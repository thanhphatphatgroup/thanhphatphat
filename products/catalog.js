const catalog = document.getElementById("catalog");
const loadMore = document.getElementById("loadMore");

const overlay = document.getElementById("zoomOverlay");
const zoomImg = document.getElementById("zoomImg");

const folder = catalog ? catalog.dataset.folder : null;

let images = [];
let currentIndex = 0;

// TẢI THẲNG 30 THỰC THỂ ẢNH ĐỂ KHÁCH LƯỚT TẢI MẠNH
const batchSize = 30; 
let loading = false;

// TẠO CỘT FLEXBOX MASONRY (2 CỘT CHO MOBILE, 3 CỘT CHO PC)
let columns = [];

function createColumns() {
    if (!catalog) return;
    catalog.innerHTML = "";
    columns = [];

    // Tự động nhận diện: Nếu là điện thoại (màn dưới 768px) thì chỉ tạo 2 cột, PC tạo 3 cột
    const colCount = window.innerWidth <= 768 ? 2 : 3;

    for (let i = 0; i < colCount; i++) {
        const col = document.createElement("div");
        col.className = "masonry-col";
        catalog.appendChild(col);
        columns.push(col);
    }
}

// LẤY CỘT CÓ CHIỀU CAO THẤP NHẤT ĐỂ CHÈN ẢNH
function getShortestColumn() {
    return columns.reduce((minCol, col) => {
        return col.offsetHeight < minCol.offsetHeight ? col : minCol;
    }, columns[0]);
}

// =========================
// LOAD JSON
// =========================
async function init() {
    if (!catalog || !folder) return;

    createColumns();

    try {
        const response = await fetch(`../images/products/${folder}/gallery.json`);
        if (!response.ok) throw new Error("CORS or 404");
        const data = await response.json();
        images = data.images || [];
    } catch (err) {
        // NẾU LỖI FILE:// HOẶC KHÔNG TẢI ĐƯỢC JSON, DÙNG DANH SÁCH DỰ PHÒNG 20 ẢNH
        images = Array.from({ length: 20 }, (_, i) => `${folder}-${i + 1}.webp`);
    }

    loadBatch();
}

// =========================
// LOAD BATCH ẢNH
// =========================
function loadBatch() {
    if (loading || currentIndex >= images.length) return;
    loading = true;

    let loaded = 0;

    function loadNext() {
        if (loaded >= batchSize || currentIndex >= images.length) {
            loading = false;
            return;
        }

        const file = images[currentIndex];
        const img = new Image();

        img.src = `../images/products/${folder}/${file}`;

        img.onload = function () {
            const item = document.createElement("div");
            item.className = "catalog-item reveal show";

            item.innerHTML = `
                <img src="${img.src}" loading="lazy" alt="Sản phẩm Thành Phát Phát">
            `;

            // Chèn ảnh vào cột ngắn nhất
            const targetCol = getShortestColumn();
            if (targetCol) {
                targetCol.appendChild(item);
            }

            // Zoom ảnh
            item.querySelector("img").addEventListener("click", function () {
                if (zoomImg && overlay) {
                    zoomImg.src = this.src;
                    overlay.classList.add("show");
                }
            });

            currentIndex++;
            loaded++;
            loadNext();
        };

        img.onerror = function () {
            currentIndex++;
            loadNext();
        };
    }

    loadNext();
}

// LẮNG NGHE SỰ KIỆN CUỘN TRANG TRÊN ĐIỆN THOẠI ĐỂ TẢI THÊM NẾU CÒN ẢNH
window.addEventListener("scroll", () => {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 600) {
        loadBatch();
    }
}, { passive: true });

// ZOOM OVERLAY
if (overlay) {
    overlay.addEventListener("click", function () {
        overlay.classList.remove("show");
    });
}

// START
init();