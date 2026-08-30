// ========== DOM READY ==========
document.addEventListener('DOMContentLoaded', () => {
    // === Mobile Navigation ===
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            const isOpen = navLinks.classList.toggle('open');
            navToggle.classList.toggle('open');
            navToggle.setAttribute('aria-expanded', isOpen);
        });

        // Закрытие при клике на ссылку
        navLinks.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('open');
                navToggle.classList.remove('open');
                navToggle.setAttribute('aria-expanded', 'false');
            });
        });

        // Закрытие при клике вне меню
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.navbar')) {
                navLinks.classList.remove('open');
                navToggle.classList.remove('open');
                navToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // === Navbar Scroll Effect ===
    const navbar = document.querySelector('.navbar');
    let lastScrollY = 0;

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;

        if (currentScrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScrollY = currentScrollY;
    }, { passive: true });

    // === Intersection Observer for animations ===
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Добавляем задержку для последовательного появления
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Наблюдаем за элементами
    document.querySelectorAll('.observe-me, .observe-me-left, .observe-me-right, .observe-me-scale').forEach(el => {
        observer.observe(el);
    });

    // === Video Auto-play on Hover ===
    const workVideos = document.querySelectorAll('.work-video');

    workVideos.forEach(video => {
        const card = video.closest('.work-card');

        if (card) {
            card.addEventListener('mouseenter', () => {
                video.play().catch(() => {});
            });

            card.addEventListener('mouseleave', () => {
                video.pause();
                video.currentTime = 0;
            });
        }
    });

    // === Video Observer (pause when not visible) ===
    const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const video = entry.target;

            if (entry.isIntersecting) {
                if (video.dataset.autoplay !== 'false') {
                    video.play().catch(() => {});
                }
            } else {
                video.pause();
            }
        });
    }, { threshold: 0.3 });

    document.querySelectorAll('video:not(.hero-video)').forEach(video => {
        videoObserver.observe(video);
    });

    // === Stat Counter ===
    const statNumbers = document.querySelectorAll('.stat-number');

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.dataset.count);
                const duration = 2000;
                const startTime = performance.now();

                const updateCounter = (currentTime) => {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    const ease = 1 - Math.pow(1 - progress, 3);
                    const current = Math.round(ease * target);

                    el.textContent = current;

                    if (progress < 1) {
                        requestAnimationFrame(updateCounter);
                    } else {
                        el.textContent = target;
                    }
                };

                requestAnimationFrame(updateCounter);
                counterObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(el => {
        counterObserver.observe(el);
    });

    // === Smooth anchor scroll ===
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            if (href === '#') return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const offset = 80;
                const top = target.getBoundingClientRect().top + window.scrollY - offset;

                window.scrollTo({
                    top: top,
                    behavior: 'smooth'
                });
            }
        });
    });

    // === Keyboard navigation for menu ===
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            navLinks?.classList.remove('open');
            navToggle?.classList.remove('open');
            navToggle?.setAttribute('aria-expanded', 'false');
        }
    });
});

// ========== PAGE TRANSITIONS ==========
document.addEventListener('click', (e) => {
    const link = e.target.closest('a');

    if (link && link.href && link.href.startsWith(window.location.origin)) {
        const isSpecialLink = link.target === '_blank' ||
            link.href.includes('tel:') ||
            link.href.includes('mailto:') ||
            link.hasAttribute('download');

        if (!isSpecialLink) {
            e.preventDefault();

            const body = document.body;
            body.style.opacity = '0';
            body.style.transition = 'opacity 0.3s ease';

            setTimeout(() => {
                window.location.href = link.href;
            }, 300);
        }
    }
});

// ========== BROWSER DETECTION ==========
if ('IntersectionObserver' in window) {
    document.documentElement.classList.add('intersection-support');
}

// ========== PERFORMANCE ==========
if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
        // Lazy load offscreen images
        document.querySelectorAll('img[loading="lazy"]').forEach(img => {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        img.src = img.dataset.src || img.src;
                        observer.unobserve(img);
                    }
                });
            });
            observer.observe(img);
        });
    });
}

// ========== GALLERY CONTROLLER ==========
function initGallery(galleryId, mainImgId, prevBtnId, nextBtnId, counterId) {
    const gallery = document.getElementById(galleryId);
    if (!gallery) return;

    const mainImg = document.getElementById(mainImgId);
    const prevBtn = document.getElementById(prevBtnId);
    const nextBtn = document.getElementById(nextBtnId);
    const counter = document.getElementById(counterId);
    const thumbs = gallery.querySelectorAll('.gallery-thumb');

    let currentIndex = 0;
    const total = thumbs.length;

    // Обновить изображение
    function updateGallery(index) {
        if (index < 0) index = total - 1;
        if (index >= total) index = 0;
        currentIndex = index;

        // Меняем главное фото
        const newSrc = thumbs[index].src;
        mainImg.style.opacity = '0';
        setTimeout(() => {
            mainImg.src = newSrc;
            mainImg.style.opacity = '1';
        }, 200);

        // Обновляем активный thumb
        thumbs.forEach((thumb, i) => {
            thumb.classList.toggle('active', i === index);
        });

        // Обновляем счётчик
        if (counter) {
            counter.textContent = `${index + 1} / ${total}`;
        }
    }

    // События для кнопок
    if (prevBtn) {
        prevBtn.addEventListener('click', () => updateGallery(currentIndex - 1));
    }
    if (nextBtn) {
        nextBtn.addEventListener('click', () => updateGallery(currentIndex + 1));
    }

    // Клик по миниатюрам
    thumbs.forEach((thumb, index) => {
        thumb.addEventListener('click', () => updateGallery(index));
    });

    // Клавиатура
    document.addEventListener('keydown', (e) => {
        if (!gallery.closest('.film-item')) return;
        if (e.key === 'ArrowLeft') updateGallery(currentIndex - 1);
        if (e.key === 'ArrowRight') updateGallery(currentIndex + 1);
    });

    // Свайп для мобильных (опционально)
    let touchStartX = 0;
    let touchEndX = 0;

    gallery.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    gallery.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                updateGallery(currentIndex + 1);
            } else {
                updateGallery(currentIndex - 1);
            }
        }
    }, { passive: true });

    // Запускаем с первого кадра
    updateGallery(0);
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', () => {
    initGallery(
        'gallery-omut',          // ID галереи
        'mainImg-omut',          // ID главного изображения
        'prevBtn-omut',          // ID кнопки "назад"
        'nextBtn-omut',          // ID кнопки "вперёд"
        'counter-omut'           // ID счётчика
    );
});
