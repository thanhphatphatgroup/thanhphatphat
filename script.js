// ===================== DOM READY =====================

window.addEventListener("DOMContentLoaded", function () {

    const reveals = document.querySelectorAll(".reveal");
    const backToTop = document.getElementById("backToTop");

    if(backToTop){

    function handleScroll() {

        const windowHeight = window.innerHeight;

        // ===== REVEAL =====
        reveals.forEach((el) => {

            const elementTop = el.getBoundingClientRect().top;

            if (elementTop < windowHeight - 50) {
                el.classList.add("show");
            } else {
                el.classList.remove("show");
            }

        });

        // ===== BACK TO TOP =====
        if (window.scrollY > 300) {
            backToTop.style.display = "block";
        } else {
            backToTop.style.display = "none";
        }
    }

    // ===== SCROLL EVENT =====
    window.addEventListener("scroll", handleScroll);

    // ===== INIT =====
    handleScroll();



    // ===================== BACK TO TOP CLICK =====================

    backToTop.addEventListener("click", function () {

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    });
    }
      



    // ===================== SMOOTH SCROLL =====================

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {

        anchor.addEventListener("click", function (e) {

            const targetId = this.getAttribute("href");

            if (targetId === "#") return;

            const target = document.querySelector(targetId);

            if (target) {

                e.preventDefault();

                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }

        });

    });

});



// ===================== JS NEW =====================
// ===================== SLIDER FINAL =====================

document.addEventListener("DOMContentLoaded", () => {

    let isDraggingGlobal = false;

    document.querySelectorAll(".slider").forEach(slider => {

        const folder = slider.dataset.folder;
        const MAX_IMAGES =
            folder === "ly-giay" ? 15 : 999;

        const track = document.createElement("div");
        track.className = "slider-track";
        slider.appendChild(track);

        let items = [];
        let index = 0;



        // ===================== LAYOUT =====================

        let slideWidth = 0;
        let gap = 0;
        let perView = 0;

        function calcLayout() {

            if (!items.length) return;

            gap = window.innerWidth <= 768 ? 10 : 20;
            perView = window.innerWidth <= 768 ? 1 : 3;

            slideWidth = items[0].getBoundingClientRect().width;
        }

        function update() {

            if (!items.length) return;

            const slide = items[index * perView];

            if (slide) {

                track.style.transform =
                `translate3d(-${slide.offsetLeft}px,0,0)`;

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

        function initLayout() {
            calcLayout();
            update();
        }

        window.addEventListener("resize", () => {
            calcLayout();
            update();
        });



        // ===================== BUTTON =====================

        const prev = document.createElement("button");
        prev.innerHTML = "<";
        prev.className = "slider-btn prev";

        const next = document.createElement("button");
        next.innerHTML = ">";
        next.className = "slider-btn next";

        slider.appendChild(prev);
        slider.appendChild(next);

        const dots = document.createElement("div");
        dots.className = "dots";
        slider.appendChild(dots);

        prev.onclick = () => {
            index--;
            if (index < 0) index = 0;
            update();
        };

        next.onclick = () => {

            const max = Math.ceil(items.length / perView) - 1;

            index++;
            if (index > max) index = max;

            update();
        };



        // ===================== ENV =====================

        const isLocalFile = location.protocol === "file:";



        // ===================== LOAD IMAGE =====================

        let i = 1;
        const MAX_HOME_IMAGES = 15;

const formats = ["webp"];

function loadImage() {

    let formatIndex = 0;

    function tryNextFormat() {

        if (formatIndex >= formats.length) {
            finish();
            return;
        }

        const ext = formats[formatIndex];

        const img = new Image();
        
        const basePath = window.PRODUCT_PAGE ? "../images/products/" : "images/products/";

        img.src = `${basePath}${folder}/${folder}-${i}.${ext}`;

        img.onload = () => {

            addSlide(img);

            i++;

            if (i <= MAX_HOME_IMAGES) {
                loadImage();
            } else {
                finish();
            }
        };

        img.onerror = () => {

            formatIndex++;
            tryNextFormat(); // thử format khác
        };
    }

    tryNextFormat();
}





        // ===================== ADD SLIDE =====================

        function addSlide(el) {

            const wrap = document.createElement("div");
            wrap.className = "slide";

            wrap.appendChild(el);

            track.appendChild(wrap);
        }



        // ===================== FINISH =====================

        function finish() {

            items = Array.from(track.children);

            if (!items.length) return;

            initLayout();
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

}, {
    rootMargin: "300px"
});

observer.observe(slider);



        // ===================== MOBILE SWIPE =====================

        let startX = 0;
        let currentX = 0;
        let isDragging = false;

        track.addEventListener("touchstart", (e) => {

            startX = e.touches[0].clientX;
            currentX = startX;

            isDragging = true;
            track.style.transition = "none";
        });

        track.addEventListener("touchmove", (e) => {

            if (!isDragging) return;

            currentX = e.touches[0].clientX;
        });

        track.addEventListener("touchend", () => {

            if (!isDragging) return;

            const diff = startX - currentX;

            track.style.transition =
                "transform 0.35s cubic-bezier(0.22, 1, 0.36, 1)";

            if (Math.abs(diff) > 40) {

                if (diff > 0) next.onclick();
                else prev.onclick();

            } else {
                update();
            }

            isDragging = false;
        });



        // ===================== DESKTOP DRAG =====================

        let dragStartX = 0;
        let isDrag = false;
        let currentDiff = 0;

        function renderDrag() {

            if (!isDrag) return;

            const slide = items[index * perView];

            const baseX =
            slide ? slide.offsetLeft : 0;

            const maxDrag = slideWidth * 0.5;

            const limitedDiff = Math.max(
                -maxDrag,
                Math.min(maxDrag, currentDiff)
            );

            const damp = 0.7;

            const finalX = Math.round(baseX - limitedDiff * damp);

            track.style.transform =
                `translate3d(-${finalX}px,0,0)`;

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

            const diff = currentDiff;

            track.style.transition =
                "transform 0.35s cubic-bezier(0.22, 1, 0.36, 1)";
            track.style.willChange = "auto";

            if (Math.abs(diff) > 80) {

                if (diff < 0) next.onclick();
                else prev.onclick();

            } else {
                update();
            }

            isDrag = false;

            setTimeout(() => {
                isDraggingGlobal = false;
            }, 50);
        });

    });



   // ===================== ZOOM NEW (MOBILE + PC) =====================

const overlay = document.getElementById("zoomOverlay");
const zoomImg = document.getElementById("zoomImg");

function enableZoom() {

    document.querySelectorAll(".slide img").forEach(img => {

        let startX = 0;
        let startY = 0;

        // ===== TOUCH START =====
        img.addEventListener("touchstart", (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        });

        // ===== TOUCH END (TAP) =====
        img.addEventListener("touchend", (e) => {

            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;

            const diffX = Math.abs(startX - endX);
            const diffY = Math.abs(startY - endY);

            // 👉 nếu là TAP (không phải vuốt)
            if (diffX < 10 && diffY < 10 && !isDraggingGlobal) {
                zoomImg.src = img.src;
                overlay.classList.add("show");
            }

        });

        // ===== CLICK PC =====
        img.addEventListener("click", () => {

            if (isDraggingGlobal) return;

            zoomImg.src = img.src;
            overlay.classList.add("show");
        });

    });
}

// ===== CLOSE OVERLAY =====
overlay.addEventListener("click", () => {
    overlay.classList.remove("show");
});

});

