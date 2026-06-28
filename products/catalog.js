const catalog = document.getElementById("catalog");
const loadMore = document.getElementById("loadMore");

const overlay = document.getElementById("zoomOverlay");
const zoomImg = document.getElementById("zoomImg");

const folder = catalog.dataset.folder;

let images = [];
let currentIndex = 0;

const batchSize = 6;

let loading = false;



// =========================
// LOAD JSON
// =========================

async function init() {

    try {

        const response = await fetch(
            `../images/products/${folder}/gallery.json`
        );

        const data = await response.json();

        images = data.images || [];

        loadBatch();

    } catch (err) {

        console.error("Không đọc được gallery.json");

        console.error(err);

    }

}



// =========================
// LOAD 1 BATCH
// =========================

function loadBatch() {

    if (loading) return;

    if (currentIndex >= images.length) return;

    loading = true;

    let loaded = 0;

    function loadNext() {

        if (loaded >= batchSize) {

            loading = false;

            requestAnimationFrame(checkViewport);

            return;

        }

        if (currentIndex >= images.length) {

            loading = false;

            return;

        }

        const file = images[currentIndex];

        const img = new Image();

        img.src =
            `../images/products/${folder}/${file}`;

        img.onload = function () {

            const item = document.createElement("div");

            item.className = "catalog-item";

            item.innerHTML = `
                <img
                    src="${img.src}"
                    loading="lazy"
                    alt="">
            `;

            catalog.appendChild(item);

            item.querySelector("img")
                .addEventListener("click", function () {

                    zoomImg.src = this.src;

                    overlay.classList.add("show");

                });

            currentIndex++;

            loaded++;

            loadNext();

        };

        img.onerror = function () {

            console.warn("Không tìm thấy:", file);

            currentIndex++;

            loaded++;

            loadNext();

        };

    }

    loadNext();

}



// =========================
// CHECK VIEWPORT
// =========================

function checkViewport() {

    if (!loadMore) return;

    const rect = loadMore.getBoundingClientRect();

    if (rect.top <= window.innerHeight + 300) {

        loadBatch();

    }

}



// =========================
// INFINITE SCROLL
// =========================

const observer = new IntersectionObserver(

    entries => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                loadBatch();

            }

        });

    },

    {

        rootMargin: "300px"

    }

);

observer.observe(loadMore);



// =========================
// ZOOM
// =========================

overlay.addEventListener("click", function () {

    overlay.classList.remove("show");

});



// =========================
// START
// =========================

init();