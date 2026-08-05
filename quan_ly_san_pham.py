import os
import json
import webbrowser
from threading import Timer
from pathlib import Path
from flask import Flask, render_template_string, jsonify, request, send_from_directory

app = Flask(__name__)

BASE_DIR = Path(__file__).resolve().parent
PRODUCTS_DIR = BASE_DIR / "images" / "products"
FEATURED_JSON_PATH = BASE_DIR / "featured.json"

ALLOWED_EXTENSIONS = {'.webp', '.jpg', '.jpeg', '.png'}

def get_all_product_images():
    if not PRODUCTS_DIR.exists():
        return [], []
    
    categories = []
    all_files = []

    for cat_dir in sorted(PRODUCTS_DIR.iterdir()):
        if cat_dir.is_dir():
            cat_name = cat_dir.name
            categories.append(cat_name)
            
            for f in cat_dir.iterdir():
                if f.is_file() and f.suffix.lower() in ALLOWED_EXTENSIONS:
                    all_files.append({
                        "rel_path": f"{cat_name}/{f.name}",
                        "filename": f.name,
                        "category": cat_name
                    })

    all_files.sort(key=lambda x: x["rel_path"].lower())
    return categories, all_files

def load_featured_data():
    if not FEATURED_JSON_PATH.exists():
        return {}
    try:
        with open(FEATURED_JSON_PATH, 'r', encoding='utf-8') as f:
            data = json.load(f)
            # Dọn dẹp ảnh bị xóa khỏi ổ cứng
            clean_data = {}
            for cat, img_list in data.items():
                clean_data[cat] = [img for img in img_list if (PRODUCTS_DIR / img).exists()]
            return clean_data
    except Exception:
        return {}

@app.route('/images/products/<path:filename>')
def serve_product_image(filename):
    return send_from_directory(PRODUCTS_DIR, filename)

@app.route('/api/data', methods=['GET'])
def get_data():
    categories, all_images = get_all_product_images()
    featured = load_featured_data()
    return jsonify({
        'categories': categories,
        'all_images': all_images,
        'featured': featured
    })

@app.route('/api/save', methods=['POST'])
def save_featured():
    try:
        req_data = request.get_json()
        featured_dict = req_data.get('featured', {})
        
        clean_payload = {}
        for cat, img_list in featured_dict.items():
            seen = set()
            valid_list = []
            for img in img_list:
                if img not in seen and (PRODUCTS_DIR / img).exists():
                    seen.add(img)
                    valid_list.append(img)
                if len(valid_list) == 12:
                    break
            clean_payload[cat] = valid_list

        temp_path = FEATURED_JSON_PATH.with_suffix('.tmp')
        with open(temp_path, 'w', encoding='utf-8') as f:
            json.dump(clean_payload, f, ensure_ascii=False, indent=4)
        
        temp_path.replace(FEATURED_JSON_PATH)
        return jsonify({'success': True})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

HTML_TEMPLATE = """
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Quản Lý Sản Phẩm Nổi Bật Theo Danh Mục</title>
    <script src="https://cdn.jsdelivr.net/npm/sortablejs@1.15.0/Sortable.min.js"></script>
    <style>
        :root {
            --bg-color: #f4f6f9;
            --card-bg: #ffffff;
            --primary: #2563eb;
            --primary-hover: #1d4ed8;
            --danger: #ef4444;
            --border: #e2e8f0;
            --text: #1e293b;
            --text-muted: #64748b;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
        body { background-color: var(--bg-color); color: var(--text); padding: 20px; }
        .container { max-width: 1280px; margin: 0 auto; }
        
        header { 
            display: flex; justify-content: space-between; align-items: center; 
            background: var(--card-bg); padding: 20px; border-radius: 12px; 
            box-shadow: 0 1px 3px rgba(0,0,0,0.1); margin-bottom: 24px;
        }
        h1 { font-size: 1.4rem; color: var(--text); }
        .btn-save {
            background: var(--primary); color: white; border: none; padding: 12px 24px;
            font-size: 1rem; font-weight: 600; border-radius: 8px; cursor: pointer;
        }
        .btn-save:hover { background: var(--primary-hover); }

        .cat-tabs { display: flex; gap: 10px; margin-bottom: 20px; flex-wrap: wrap; }
        .tab-btn {
            padding: 10px 18px; border: 1px solid var(--border); background: white;
            border-radius: 8px; font-weight: 600; cursor: pointer; color: var(--text-muted);
        }
        .tab-btn.active { background: var(--primary); color: white; border-color: var(--primary); }

        .section-title { font-size: 1.1rem; font-weight: 600; margin-bottom: 12px; display: flex; align-items: center; gap: 8px; }
        .badge { background: #e0e7ff; color: #4338ca; padding: 2px 8px; border-radius: 12px; font-size: 0.85rem; }

        .featured-wrapper {
            background: var(--card-bg); padding: 20px; border-radius: 12px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1); margin-bottom: 32px;
        }
        .featured-grid { display: grid; grid-template-columns: repeat(6, 1fr); gap: 16px; min-height: 180px; }
        @media (max-width: 1024px) { .featured-grid { grid-template-columns: repeat(3, 1fr); } }

        .featured-slot {
            aspect-ratio: 1; border: 2px dashed var(--border); border-radius: 8px;
            position: relative; background: #fafafa; overflow: hidden;
            display: flex; align-items: center; justify-content: center;
        }
        .featured-slot.filled { border-style: solid; border-color: var(--primary); background: white; cursor: grab; }

        .slot-number {
            position: absolute; top: 6px; left: 6px; background: rgba(0,0,0,0.6);
            color: white; font-size: 0.75rem; font-weight: bold; width: 22px; height: 22px;
            border-radius: 50%; display: flex; align-items: center; justify-content: center; z-index: 2;
        }
        .featured-img { width: 100%; height: 100%; object-fit: cover; }
        
        .btn-remove {
            position: absolute; top: 6px; right: 6px; background: var(--danger);
            color: white; border: none; width: 22px; height: 22px; border-radius: 50%;
            cursor: pointer; font-weight: bold; font-size: 0.8rem; display: none;
            align-items: center; justify-content: center; z-index: 3;
        }
        .featured-slot.filled:hover .btn-remove { display: flex; }

        .library-wrapper {
            background: var(--card-bg); padding: 20px; border-radius: 12px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        .search-bar { width: 100%; padding: 10px 14px; border: 1px solid var(--border); border-radius: 8px; font-size: 0.95rem; margin-bottom: 20px; }

        .library-grid {
            display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 16px;
            max-height: 500px; overflow-y: auto; padding-right: 4px;
        }

        .thumb-item {
            aspect-ratio: 1; border: 2px solid var(--border); border-radius: 8px;
            position: relative; overflow: hidden; cursor: pointer; background: white;
        }
        .thumb-item:hover { border-color: var(--primary); }
        .thumb-item.selected { border-color: #10b981; opacity: 0.5; cursor: not-allowed; }

        .thumb-img { width: 100%; height: 80%; object-fit: cover; }
        .thumb-name {
            height: 20%; font-size: 0.7rem; padding: 2px 4px; text-align: center;
            white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
            background: #f8fafc; border-top: 1px solid var(--border); color: var(--text-muted);
        }

        .selected-badge {
            position: absolute; top: 40%; left: 50%; transform: translate(-50%, -50%);
            background: #10b981; color: white; padding: 4px 8px; border-radius: 4px;
            font-size: 0.75rem; font-weight: bold; display: none;
        }
        .thumb-item.selected .selected-badge { display: block; }

        .toast {
            position: fixed; bottom: 20px; right: 20px; background: #10b981; color: white;
            padding: 12px 24px; border-radius: 8px; font-weight: 500; display: none; z-index: 999;
        }
    </style>
</head>
<body>

<div class="container">
    <header>
        <h1>QUẢN LÝ SẢN PHẨM NỔI BẬT THEO DANH MỤC</h1>
        <button class="btn-save" onclick="saveData()">LƯU THAY ĐỔI</button>
    </header>

    <!-- THANH CHỌN DANH MỤC -->
    <div class="cat-tabs" id="cat-tabs"></div>

    <div class="featured-wrapper">
        <div class="section-title">
            12 NỔI BẬT DÀNH CHO: <span id="current-cat-name" style="color:var(--primary)">-</span>
            <span class="badge" id="count-badge">0/12</span>
        </div>
        <div class="featured-grid" id="featured-grid"></div>
    </div>

    <div class="library-wrapper">
        <div class="section-title">KHO ẢNH SẢN PHẨM PHÙ HỢP</div>
        <input type="text" class="search-bar" id="search-input" placeholder="Tìm kiếm tên ảnh..." oninput="renderLibrary()">
        <div class="library-grid" id="library-grid"></div>
    </div>
</div>

<div class="toast" id="toast">Đã lưu cấu hình theo danh mục thành công!</div>

<script>
let allImages = [];
let categories = [];
let featuredDict = {};
let currentCategory = '';

async function initApp() {
    try {
        const res = await fetch('/api/data');
        const data = await res.json();
        allImages = data.all_images;
        categories = data.categories;
        featuredDict = data.featured;

        if (categories.length > 0) {
            currentCategory = categories[0];
        }
        
        renderTabs();
        switchCategory(currentCategory);
        initSortable();
    } catch (err) {
        alert('Lỗi nạp dữ liệu: ' + err.message);
    }
}

function renderTabs() {
    const tabsContainer = document.getElementById('cat-tabs');
    tabsContainer.innerHTML = '';
    categories.forEach(cat => {
        const btn = document.createElement('button');
        btn.className = 'tab-btn' + (cat === currentCategory ? ' active' : '');
        btn.innerText = cat.toUpperCase();
        btn.onclick = () => switchCategory(cat);
        tabsContainer.appendChild(btn);
    });
}

function switchCategory(cat) {
    currentCategory = cat;
    document.getElementById('current-cat-name').innerText = cat.toUpperCase();
    
    if (!featuredDict[currentCategory]) {
        featuredDict[currentCategory] = [];
    }
    
    renderTabs();
    renderFeatured();
    renderLibrary();
}

function renderFeatured() {
    const grid = document.getElementById('featured-grid');
    grid.innerHTML = '';
    const list = featuredDict[currentCategory] || [];
    
    for (let i = 0; i < 12; i++) {
        const slot = document.createElement('div');
        slot.className = 'featured-slot' + (list[i] ? ' filled' : '');
        slot.dataset.index = i;
        if (list[i]) slot.dataset.relpath = list[i];

        const numSpan = document.createElement('span');
        numSpan.className = 'slot-number';
        numSpan.innerText = String(i + 1).padStart(2, '0');
        slot.appendChild(numSpan);

        if (list[i]) {
            const img = document.createElement('img');
            img.src = '/images/products/' + list[i];
            img.className = 'featured-img';
            slot.appendChild(img);

            const btnRemove = document.createElement('button');
            btnRemove.className = 'btn-remove';
            btnRemove.innerText = '×';
            btnRemove.onclick = (e) => {
                e.stopPropagation();
                removeFeatured(i);
            };
            slot.appendChild(btnRemove);
        }
        grid.appendChild(slot);
    }

    document.getElementById('count-badge').innerText = `${list.length}/12`;
}

function renderLibrary() {
    const grid = document.getElementById('library-grid');
    const keyword = document.getElementById('search-input').value.toLowerCase().trim();
    grid.innerHTML = '';

    const currentList = featuredDict[currentCategory] || [];

    allImages.forEach(item => {
        // Chỉ hiển thị ảnh thuộc đúng danh mục đang chọn
        if (item.category !== currentCategory) return;
        if (keyword && !item.filename.toLowerCase().includes(keyword)) return;

        const isSelected = currentList.includes(item.rel_path);
        const thumb = document.createElement('div');
        thumb.className = 'thumb-item' + (isSelected ? ' selected' : '');
        
        thumb.onclick = () => {
            if (!isSelected) addFeatured(item.rel_path);
        };

        const img = document.createElement('img');
        img.src = '/images/products/' + item.rel_path;
        img.className = 'thumb-img';

        const nameDiv = document.createElement('div');
        nameDiv.className = 'thumb-name';
        nameDiv.innerText = item.filename;

        const badge = document.createElement('div');
        badge.className = 'selected-badge';
        badge.innerText = '✓ Đã chọn';

        thumb.appendChild(img);
        thumb.appendChild(nameDiv);
        thumb.appendChild(badge);
        grid.appendChild(thumb);
    });
}

function addFeatured(relPath) {
    const list = featuredDict[currentCategory] || [];
    if (list.length >= 12) {
        alert(`Đã đủ 12 ảnh nổi bật cho danh mục ${currentCategory}.`);
        return;
    }
    if (!list.includes(relPath)) {
        list.push(relPath);
        renderFeatured();
        renderLibrary();
    }
}

function removeFeatured(index) {
    featuredDict[currentCategory].splice(index, 1);
    renderFeatured();
    renderLibrary();
}

function initSortable() {
    const grid = document.getElementById('featured-grid');
    new Sortable(grid, {
        animation: 150,
        draggable: '.filled',
        onEnd: function () {
            const slots = grid.querySelectorAll('.featured-slot');
            const newList = [];
            slots.forEach(slot => {
                if (slot.dataset.relpath) {
                    newList.push(slot.dataset.relpath);
                }
            });
            featuredDict[currentCategory] = newList;
            renderFeatured();
        }
    });
}

async function saveData() {
    try {
        const res = await fetch('/api/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ featured: featuredDict })
        });
        const data = await res.json();
        if (data.success) {
            const toast = document.getElementById('toast');
            toast.style.display = 'block';
            setTimeout(() => { toast.style.display = 'none'; }, 2500);
        } else {
            alert('Lỗi khi lưu: ' + data.error);
        }
    } catch (err) {
        alert('Lỗi kết nối server local: ' + err.message);
    }
}

window.onload = initApp;
</script>
</body>
</html>
"""

@app.route('/')
def index():
    return render_template_string(HTML_TEMPLATE)

def open_browser():
    webbrowser.open_new('http://127.0.0.1:5000/')

if __name__ == '__main__':
    print("=" * 60)
    print("      TOOL QUẢN LÝ SẢN PHẨM NỔI BẬT (CHIA THEO MỤC)")
    print("      Đang mở giao diện tại: http://127.0.0.1:5000")
    print("=" * 60)
    Timer(1.5, open_browser).start()
    app.run(host='127.0.0.1', port=5000, debug=False)