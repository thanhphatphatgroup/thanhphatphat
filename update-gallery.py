from pathlib import Path
import json
import re
from datetime import datetime
from PIL import Image

# ==========================================
# CẤU HÌNH
# ==========================================

ROOT = Path("images/products")

IMAGE_EXTS = {
    ".webp",
    ".png",
    ".jpg",
    ".jpeg"
}

# ==========================================
# HÀM HỖ TRỢ
# ==========================================

def convert_to_webp_and_cleanup(folder_path):
    """BƯỚC 1: Chuyển tất cả ảnh PNG, JPG, JPEG sang WebP và xóa file gốc"""
    for file in folder_path.iterdir():
        if file.is_file() and file.suffix.lower() in IMAGE_EXTS and file.suffix.lower() != ".webp":
            webp_path = file.with_suffix(".webp")
            try:
                with Image.open(file) as img:
                    img.save(webp_path, "WEBP", quality=80)
                file.unlink()  # Xóa file gốc (.png, .jpg...)
                print(f"  ➜ [WebP] Đã nén & dọn dẹp: {file.name} -> {webp_path.name}")
            except Exception as e:
                print(f"  ⚠ Lỗi nén file {file.name}: {e}")

def get_group_name(filename):
    """Trích xuất tên nhóm từ file (Ví dụ: '30-4 (1).webp' -> '30-4')"""
    name_without_ext = Path(filename).stem
    group = re.sub(r'[\s\-_]*\(\d+\)$', '', name_without_ext)
    group = re.sub(r'[\s\-_]*\d+$', '', group)
    return group if group else name_without_ext

def natural_sort(filename):
    """Sắp xếp thứ tự tự nhiên trong cùng 1 nhóm (1, 2, 10...)"""
    return [
        int(text) if text.isdigit() else text.lower()
        for text in re.split(r'(\d+)', filename)
    ]

# ==========================================
# CHƯƠNG TRÌNH CHÍNH (MAIN)
# ==========================================

print("=" * 65)
print("      UPDATE GALLERY (AUTO WEBP & AUTO GROUP BY DATE)")
print("=" * 65)

total_images = 0

for folder in sorted(ROOT.iterdir()):

    if not folder.is_dir():
        continue

    # 1. BƯỚC 1: TỰ ĐỘNG NÉN & XÓA FILE GỐC (PNG, JPG, JPEG)
    convert_to_webp_and_cleanup(folder)

    # 2. BƯỚC 2: QUÉT TẤT CẢ FILE WEBP TRONG THƯ MỤC
    regular_files = [
        f for f in folder.iterdir() 
        if f.is_file() and f.suffix.lower() == ".webp"
    ]

    # 3. BƯỚC 3: GOM NHÓM VÀ SẮP XẾP THEO BỘ MỚI NHẤT
    groups = {}
    for file in regular_files:
        gname = get_group_name(file.name)
        if gname not in groups:
            groups[gname] = []
        groups[gname].append(file)

    group_items = []
    for gname, files in groups.items():
        # Sắp xếp nội bộ trong nhóm: (1), (2), (3)...
        files.sort(key=lambda x: natural_sort(x.name))
        
        # Lấy thời gian chỉnh sửa mới nhất của nhóm
        max_mtime = max(f.stat().st_mtime for f in files)
        group_items.append((max_mtime, files))

    # Xếp nhóm có thời gian mới ném vào lên đầu tiên
    group_items.sort(key=lambda x: x[0], reverse=True)

    regular_images_paths = []
    for _, files in group_items:
        for f in files:
            regular_images_paths.append(f.name)

    # 4. BƯỚC 4: XUẤT RA FILE GALLERY.JSON CHO TRANG CHI TIẾT SẢN PHẨM
    gallery = {
        "count": len(regular_images_paths),
        "updated": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "images": regular_images_paths
    }

    with open(folder / "gallery.json", "w", encoding="utf8") as f:
        json.dump(
            gallery,
            f,
            ensure_ascii=False,
            indent=4
        )

    total_images += len(regular_images_paths)

    print(f"✓ {folder.name:<18} | Tổng ảnh: {len(regular_images_paths):>3} ảnh (Đã xếp bộ mới lên đầu)")

print("=" * 65)
print(f"TỔNG CỘNG TẤT CẢ: {total_images} ảnh WebP đã sẵn sàng!")
print("=" * 65)
print("Hoàn thành.")