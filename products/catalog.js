const catalog = document.getElementById("catalog");
const loadMore = document.getElementById("loadMore");

const overlay = document.getElementById("zoomOverlay");
const zoomImg = document.getElementById("zoomImg");

let current = 1;
let batchSize = 6;
let loading = false;
let finished = false;

function loadBatch() {

    if (loading || finished) return;

    loading = true;

    let loaded = 0;

    function loadNext() {

        if (loaded >= batchSize) {
            loading = false;
            return;
        }

        const img = new Image();

        img.src =
            "../images/products/ly-giay/ly-giay-" +
            current +
            ".webp";

        img.onload = function () {

            const item = document.createElement("div");

            item.className = "catalog-item";

            item.innerHTML =
                '<img src="' +
                img.src +
                '" alt="Ly giấy ' +
                current +
                '" loading="lazy">';

            catalog.appendChild(item);

            const image =
                item.querySelector("img");

            image.addEventListener("click", function () {

                zoomImg.src = image.src;

                overlay.classList.add("show");

            });

            current++;
            loaded++;

            loadNext();
        };

        img.onerror = function () {

            finished = true;
            loading = false;

        };
    }

    loadNext();
}

loadBatch();

const observer = new IntersectionObserver(
    function (entries) {

        entries.forEach(function (entry) {

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

overlay.addEventListener("click", function () {

    overlay.classList.remove("show");

});