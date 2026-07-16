const catalog = document.getElementById("catalog");
const loadMore = document.getElementById("loadMore");

const overlay = document.getElementById("zoomOverlay");
const zoomImg = document.getElementById("zoomImg");

const folder = catalog ? catalog.dataset.folder : null;

let images = [];
let currentIndex = 0;
const batchSize = 6; // Mỗi lần lướt xuống sẽ sổ ra 6 ảnh
let loading = false;

// =========================
// LOAD JSON & CHECK
// =========================
async function init() {
    if (!catalog || !folder) return;

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
// LOAD BATCH & TRIGGER REVEAL
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
            
            // Thêm class reveal để chạy hiệu ứng đồng bộ trang chủ
            item.className = "catalog-item reveal";

            item.innerHTML = `
                <img src="${img.src}" loading="lazy" alt="Sản phẩm Thành Phát Phát">
            `;

            catalog.appendChild(item);

            // Cho hiệu ứng hiển thị ngay khi nạp ảnh xong
            setTimeout(() => {
                item.classList.add("show");
            }, 50);

            // Xử lý Zoom ảnh
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
    if (rect.top <= window.innerHeight + 300) {
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

// =========================
// ZOOM OVERLAY
// =========================
if (overlay) {
    overlay.addEventListener("click", function () {
        overlay.classList.remove("show");
    });
}

// START
init();