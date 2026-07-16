const catalog = document.getElementById("catalog");
const loadMore = document.getElementById("loadMore");

const overlay = document.getElementById("zoomOverlay");
const zoomImg = document.getElementById("zoomImg");

const folder = catalog ? catalog.dataset.folder : null;

let images = [];
let currentIndex = 0;
const batchSize = 6;
let loading = false;

// TẠO 3 CỘT MASONRY
let columns = [];

function createColumns() {
    if (!catalog) return;
    catalog.innerHTML = "";
    columns = [];

    // Tạo 3 cột Flexbox
    for (let i = 0; i < 3; i++) {
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
        const data = await response.json();
        images = data.images || [];
        loadBatch();
    } catch (err) {
        console.error("Không đọc được gallery.json:", err);
    }
}

// =========================
// LOAD BATCH
// =========================
function loadBatch() {
    if (loading || currentIndex >= images.length) return;
    loading = true;

    let loaded = 0;

    function loadNext() {
        if (loaded >= batchSize || currentIndex >= images.length) {
            loading = false;
            requestAnimationFrame(checkViewport);
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
            targetCol.appendChild(item);

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
            loaded++;
            loadNext();
        };
    }

    loadNext();
}

// =========================
// CHECK VIEWPORT & OBSERVER
// =========================
function checkViewport() {
    if (!loadMore) return;
    const rect = loadMore.getBoundingClientRect();
    if (rect.top <= window.innerHeight + 400) {
        loadBatch();
    }
}

if (loadMore) {
    const observer = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    loadBatch();
                }
            });
        },
        { rootMargin: "300px" }
    );
    observer.observe(loadMore);
}

// ZOOM OVERLAY
if (overlay) {
    overlay.addEventListener("click", function () {
        overlay.classList.remove("show");
    });
}

// START
init();