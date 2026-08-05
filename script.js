// ===================== HELPER: DEBOUNCE =====================
function debounce(func, wait) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

// ===================== DOM READY (REVEAL, BACK TO TOP, THEME) =====================
window.addEventListener("DOMContentLoaded", function () {
    const reveals = document.querySelectorAll(".reveal");
    const backToTop = document.getElementById("backToTop");

    if (backToTop) {
        let isTicking = false;

        function handleScroll() {
            const windowHeight = window.innerHeight;
            // REVEAL ANIMATION
            reveals.forEach((el) => {
                if (el.getBoundingClientRect().top < windowHeight - 50) {
                    el.classList.add("show");
                } else {
                    el.classList.remove("show");
                }
            });

            // BACK TO TOP BUTTON
            backToTop.style.display = window.scrollY > 300 ? "flex" : "none";
            isTicking = false;
        }

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

    // ==========================================
    // CHỨC NĂNG CHUYỂN ĐỔI GIAO DIỆN DARK / LIGHT
    // ==========================================
    const themeToggleBtn = document.getElementById("themeToggle");
    const currentTheme = localStorage.getItem("theme");
    
    if (currentTheme === "dark") {
        document.documentElement.setAttribute("data-theme", "dark");
        if (themeToggleBtn) themeToggleBtn.textContent = "☀️";
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener("click", () => {
            let theme = document.documentElement.getAttribute("data-theme");

            if (theme === "dark") {
                document.documentElement.removeAttribute("data-theme");
                localStorage.setItem("theme", "light");
                themeToggleBtn.textContent = "🌙";
            } else {
                document.documentElement.setAttribute("data-theme", "dark");
                localStorage.setItem("theme", "dark");
                themeToggleBtn.textContent = "☀️";
            }
        });
    }
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

        // Tối ưu Resize
        window.addEventListener("resize", debounce(() => {
            calcLayout();
            update();
        }, 150));

        // CONTROLS (BUTTONS & DOTS)
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

        // LOAD IMAGES: ƯU TIÊN FEATURED.JSON CHIA THEO MỤC -> FALLBACK SANG GALLERY.JSON
        async function loadImages() {
            const basePath = window.PRODUCT_PAGE ? "../images/products/" : "images/products/";
            let imagesToLoad = [];
            let isFeaturedLoaded = false;

            // 1. Thử tải dữ liệu từ featured.json (Tránh cache)
            try {
                const featuredPath = window.PRODUCT_PAGE ? "../featured.json" : "featured.json";
                const response = await fetch(`${featuredPath}?v=${Date.now()}`, { cache: "no-store" });
                
                if (response.ok) {
                    const data = await response.json();
                    if (data[folder] && data[folder].length > 0) {
                        // Tải danh sách từ featured.json theo danh mục (Ví dụ: "ly-giay/ly-1.webp")
                        imagesToLoad = data[folder].map(relPath => `${basePath}${relPath}`);
                        isFeaturedLoaded = true;
                    }
                }
            } catch (err) {
                // Không tìm thấy featured.json hoặc lỗi -> Chuyển sang đọc gallery.json
            }

            // 2. Nếu không có featured.json cho folder này, fallback về đọc gallery.json
            if (!isFeaturedLoaded) {
                try {
                    const jsonPath = `${basePath}${folder}/gallery.json`;
                    const response = await fetch(jsonPath);
                    if (response.ok) {
                        const data = await response.json();
                        const rawImages = (data.images || []).slice(0, 12);
                        imagesToLoad = rawImages.map(imgName => `${basePath}${folder}/${imgName}`);
                    }
                } catch (err) {
                    console.error(`Lỗi tải gallery.json cho folder ${folder}:`, err);
                }
            }

            // 3. Render ảnh vào Slider Track
            imagesToLoad.forEach(fullImgPath => {
                const wrap = document.createElement("div");
                wrap.className = "slide";

                const img = new Image();
                img.src = fullImgPath;
                img.alt = folder;
                img.loading = "lazy";
                img.onerror = function () {
                    wrap.style.display = "none"; // Ẩn slide nếu file vô tình bị xóa
                };

                wrap.appendChild(img);
                track.appendChild(wrap);
            });

            finish();
        }

        function finish() {
            items = Array.from(track.children);
            if (!items.length) return;
            calcLayout();
            update();
            enableZoom();
        }

        // Lazy load slider khi cuộn màn hình tới nơi
        let loaded = false;
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !loaded) {
                    loaded = true;
                    loadImages();
                    observer.unobserve(slider);
                }
            });
        }, { rootMargin: "300px" });

        observer.observe(slider);

        // TOUCH SWIPE MOBILE
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

    // ZOOM OVERLAY MODAL
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

// ==========================================
// TOAST NOTIFICATION VÀ GỬI EMAIL ĐÁNH GIÁ
// ==========================================
function showToast(message) {
    const existingToast = document.querySelector('.custom-toast');
    if (existingToast) existingToast.remove();

    const toast = document.createElement('div');
    toast.className = 'custom-toast';
    toast.innerHTML = `
        <span class="toast-icon">✓</span>
        <span>${message}</span>
    `;
    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}

(function() {
    // Thay YOUR_PUBLIC_KEY bằng Public Key từ emailjs.com
    if (typeof emailjs !== "undefined") {
        emailjs.init("YOUR_PUBLIC_KEY");
    }
})();

document.addEventListener("DOMContentLoaded", () => {
    const reviewForm = document.getElementById("reviewForm");
    const reviewsList = document.getElementById("reviewsList");
    const btnSubmit = document.getElementById("btnSubmitReview");

    if (reviewForm) {
        reviewForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const name = document.getElementById("reviewerName").value.trim();
            const comment = document.getElementById("reviewComment").value.trim();
            const ratingInput = document.querySelector('input[name="rating"]:checked');
            const ratingVal = ratingInput ? ratingInput.value : "5";

            if (!name || !comment) return;

            btnSubmit.innerText = "Đang gửi...";
            btnSubmit.disabled = true;

            // 1. Tạm thời hiển thị thẻ đánh giá mới trên web
            const starsHtml = "★".repeat(parseInt(ratingVal)) + "☆".repeat(5 - parseInt(ratingVal));
            const newCard = document.createElement("div");
            newCard.className = "card review-card";
            newCard.innerHTML = `
                <div class="stars">${starsHtml}</div>
                <p>"${comment}"</p>
                <div class="reviewer-info">
                    <strong>${name}</strong>
                    <span>Khách hàng vừa đánh giá</span>
                </div>
            `;
            reviewsList.prepend(newCard);

            // 2. Gửi dữ liệu về Email
            const templateParams = {
                from_name: name,
                rating: ratingVal + " sao",
                message: comment
            };

            emailjs.send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", templateParams)
                .then(() => {
                    showToast("Cảm ơn bạn! Đánh giá đã gửi thành công.");
                })
                .catch((error) => {
                    console.log("Lỗi gửi Email:", error);
                    showToast("Đã gửi đánh giá thành công!");
                })
                .finally(() => {
                    reviewForm.reset();
                    btnSubmit.innerText = "Gửi Đánh Giá";
                    btnSubmit.disabled = false;
                });
        });
    }
});