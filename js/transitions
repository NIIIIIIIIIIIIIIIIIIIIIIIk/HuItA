// ========== PAGE TRANSITIONS ==========
(function() {
    'use strict';

    let isTransitioning = false;
    const transitionDuration = 400;

    // Создаем overlay для перехода
    const overlay = document.createElement('div');
    overlay.className = 'page-transition-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: var(--color-black, #0a0a0a);
        z-index: 9998;
        pointer-events: none;
        opacity: 0;
        transition: opacity ${transitionDuration}ms ease;
    `;
    document.body.appendChild(overlay);

    // Перехватываем клики по ссылкам
    document.addEventListener('click', function(e) {
        const link = e.target.closest('a');

        if (!link) return;

        const href = link.getAttribute('href');
        const isInternal = href &&
            !href.startsWith('http') &&
            !href.startsWith('#') &&
            !href.startsWith('tel:') &&
            !href.startsWith('mailto:') &&
            !link.hasAttribute('download') &&
            !link.target;

        if (isInternal && !isTransitioning) {
            e.preventDefault();
            navigateTo(href);
        }
    });

    function navigateTo(url) {
        isTransitioning = true;

        // Затемняем
        overlay.style.opacity = '1';

        // Эффект "проявки" для текущей страницы
        document.body.style.opacity = '0';
        document.body.style.transition = `opacity ${transitionDuration / 2}ms ease`;

        setTimeout(() => {
            window.location.href = url;
        }, transitionDuration);
    }

    // При загрузке новой страницы - показываем
    window.addEventListener('load', function() {
        overlay.style.opacity = '0';
        document.body.style.opacity = '1';
        document.body.style.transition = `opacity ${transitionDuration / 2}ms ease`;

        setTimeout(() => {
            isTransitioning = false;
        }, transitionDuration);
    });

    // Если переход занял слишком много времени
    window.addEventListener('pageshow', function(e) {
        if (e.persisted) {
            overlay.style.opacity = '0';
            document.body.style.opacity = '1';
            isTransitioning = false;
        }
    });

})();

// ========== HISTORY API NAVIGATION ==========
if (window.history && window.history.pushState) {
    // Сохраняем состояние при переходе
    document.querySelectorAll('a[href^="/"], a[href^="./"], a[href^="../"], a[href*=".html"]').forEach(link => {
        link.addEventListener('click', function(e) {
            if (!e.defaultPrevented) {
                const href = this.getAttribute('href');
                if (href && !href.startsWith('#') && !href.startsWith('tel:') && !href.startsWith('mailto:')) {
                    const url = new URL(href, window.location.href);
                    if (url.origin === window.location.origin) {
                        // Сохраняем состояние
                        history.pushState({ path: url.pathname }, '', url.href);
                    }
                }
            }
        });
    });

    // Обработка нажатия назад/вперед
    window.addEventListener('popstate', function() {
        // Анимация возврата
        const overlay = document.querySelector('.page-transition-overlay');
        if (overlay) {
            overlay.style.opacity = '0.5';
            setTimeout(() => {
                overlay.style.opacity = '0';
                location.reload();
            }, 200);
        }
    });
}
