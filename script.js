// ===================== HELPER: DEBOUNCE =====================
function debounce(func, wait) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

// ===================== DOM READY =====================
window.addEventListener("DOMContentLoaded", function () {
    const reveals = document.querySelectorAll(".reveal");
    const backToTop = document.getElementById("backToTop");

    if (backToTop) {

        let isTicking = false;

        function handleScroll() {
            const windowHeight = window.innerHeight;
            // REVEAL
            reveals.forEach((el) => {
                if (el.getBoundingClientRect().top < windowHeight - 50) {
                    el.classList.add("show");
                } else {
                    el.classList.remove("show");
                }
            });

            // BACK TO TOP
            backToTop.style.display = window.scrollY > 300 ? "block" : "none";
            isTicking = false;
        }

        // Tối ưu Scroll bằng requestAnimationFrame
        window.addEventListener("scroll", () => {
            if (!isTicking) {
                window.requestAnimationFrame(handleScroll);
                isTicking = true;
            }
        }, { passive: true });

        handleScroll();

        backToTop.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    // SMOOTH SCROLL FOR ANCHORS
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener("click", function (e) {
            const targetId = this.getAttribute("href");
            if (targetId === "#") return;

            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        });
    });

});


// ===================== SLIDER LOGIC =====================
document.addEventListener("DOMContentLoaded", () => {

    let isDraggingGlobal = false;

    document.querySelectorAll(".slider").forEach(slider => {

        const folder = slider.dataset.folder;
        const track = document.createElement("div");
        track.className = "slider-track";
        slider.appendChild(track);

        let items = [];
        let index = 0;
        let slideWidth = 0;
        let perView = 0;

        function calcLayout() {
            if (!items.length) return;
            perView = window.innerWidth <= 768 ? 1 : 3;
            slideWidth = items[0].getBoundingClientRect().width;
        }

        function update() {
            if (!items.length) return;

            const slide = items[index * perView];
            if (slide) {
                track.style.transform = `translate3d(-${slide.offsetLeft}px,0,0)`;
            }

            const total = Math.ceil(items.length / perView);
            dots.innerHTML = "";

            for (let i = 0; i < total; i++) {
                const dot = document.createElement("span");
                if (i === index) dot.classList.add("active");
                dot.onclick = () => {
                    index = i;
                    update();
                };
                dots.appendChild(dot);
            }
        }

        // Tối ưu Resize với Debounce
        window.addEventListener("resize", debounce(() => {
            calcLayout();
            update();
        }, 150));

        // BUTTONS
        const prev = document.createElement("button");
        prev.innerHTML = "<";
        prev.className = "slider-btn prev";
        prev.setAttribute("aria-label", "Ảnh trước");

        const next = document.createElement("button");
        next.innerHTML = ">";
        next.className = "slider-btn next";
        next.setAttribute("aria-label", "Ảnh tiếp theo");

        slider.appendChild(prev);
        slider.appendChild(next);

        const dots = document.createElement("div");
        dots.className = "dots";
        slider.appendChild(dots);

        prev.onclick = () => {
            index = Math.max(0, index - 1);
            update();
        };

        next.onclick = () => {
            const max = Math.ceil(items.length / perView) - 1;
            index = Math.min(max, index + 1);
            update();
        };

        // LOAD IMAGES
        let i = 1;
        const MAX_HOME_IMAGES = 15;

        function loadImage() {
            const img = new Image();
            const basePath = window.PRODUCT_PAGE ? "../images/products/" : "images/products/";

            img.src = `${basePath}${folder}/${folder}-${i}.webp`;

            img.onload = () => {
                const wrap = document.createElement("div");
                wrap.className = "slide";
                wrap.appendChild(img);
                track.appendChild(wrap);

                i++;
                if (i <= MAX_HOME_IMAGES) {
                    loadImage();
                } else {
                    finish();
                }
            };

            img.onerror = () => finish();
        }

        function finish() {
            items = Array.from(track.children);
            if (!items.length) return;
            calcLayout();
            update();
            enableZoom();
        }

        let loaded = false;
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {

                if (entry.isIntersecting && !loaded) {
                    loaded = true;
                    loadImage();
                    observer.unobserve(slider);
                }
            });
        }, { rootMargin: "300px" });

        observer.observe(slider);

        // SWIPE MOBILE
        let startX = 0;
        let currentX = 0;
        let isDragging = false;

        track.addEventListener("touchstart", (e) => {
            startX = e.touches[0].clientX;
            currentX = startX;
            isDragging = true;
            track.style.transition = "none";
        }, { passive: true });

        track.addEventListener("touchmove", (e) => {
            if (!isDragging) return;
            currentX = e.touches[0].clientX;
        }, { passive: true });

        track.addEventListener("touchend", () => {
            if (!isDragging) return;
            const diff = startX - currentX;
            track.style.transition = "transform 0.35s cubic-bezier(0.22, 1, 0.36, 1)";

            if (Math.abs(diff) > 40) {
                if (diff > 0) next.onclick();
                else prev.onclick();
            } else {
                update();
            }
            isDragging = false;
        });

        // DRAG DESKTOP
        let dragStartX = 0;
        let isDrag = false;
        let currentDiff = 0;

        function renderDrag() {
            if (!isDrag) return;
            const slide = items[index * perView];
            const baseX = slide ? slide.offsetLeft : 0;
            const maxDrag = slideWidth * 0.5;

            const limitedDiff = Math.max(-maxDrag, Math.min(maxDrag, currentDiff));
            const finalX = Math.round(baseX - limitedDiff * 0.7);

            track.style.transform = `translate3d(-${finalX}px,0,0)`;
            requestAnimationFrame(renderDrag);
        }

        track.addEventListener("mousedown", (e) => {
            isDrag = true;
            isDraggingGlobal = false;
            dragStartX = e.clientX;
            currentDiff = 0;
            track.style.transition = "none";
            track.style.willChange = "transform";
            requestAnimationFrame(renderDrag);
        });

        document.addEventListener("mousemove", (e) => {
            if (!isDrag) return;
            currentDiff = e.clientX - dragStartX;
            if (Math.abs(currentDiff) > 5) isDraggingGlobal = true;
        });

        document.addEventListener("mouseup", () => {
            if (!isDrag) return;
            track.style.transition = "transform 0.35s cubic-bezier(0.22, 1, 0.36, 1)";
            track.style.willChange = "auto";

            if (Math.abs(currentDiff) > 80) {
                if (currentDiff < 0) next.onclick();
                else prev.onclick();
            } else {
                update();
            }

            isDrag = false;
            setTimeout(() => { isDraggingGlobal = false; }, 50);
        });

    });

    // ZOOM OVERLAY
    const overlay = document.getElementById("zoomOverlay");
    const zoomImg = document.getElementById("zoomImg");

    function enableZoom() {
        document.querySelectorAll(".slide img").forEach(img => {
            let startX = 0, startY = 0;

            img.addEventListener("touchstart", (e) => {
                startX = e.touches[0].clientX;
                startY = e.touches[0].clientY;
            }, { passive: true });

            img.addEventListener("touchend", (e) => {
                const diffX = Math.abs(startX - e.changedTouches[0].clientX);
                const diffY = Math.abs(startY - e.changedTouches[0].clientY);

                if (diffX < 10 && diffY < 10 && !isDraggingGlobal) {
                    zoomImg.src = img.src;
                    overlay.classList.add("show");
                }
            });

            img.addEventListener("click", () => {
                if (isDraggingGlobal) return;
                zoomImg.src = img.src;
                overlay.classList.add("show");
            });
        });
    }

    if (overlay) {
        overlay.addEventListener("click", () => {
            overlay.classList.remove("show");
        });
    }

});