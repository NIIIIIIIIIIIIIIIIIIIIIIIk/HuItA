// ========== GRAIN EFFECT ==========
(function() {
    'use strict';

    const grain = document.querySelector('.grain-overlay');

    if (!grain) return;

    // Переменные для контроля
    let isEnabled = true;
    let animationFrame = null;

    // Настройки
    const config = {
        opacity: 0.035,
        speed: 0.5,
        intensity: 1
    };

    // Создаем canvas для гранулы
    function createGrainCanvas() {
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 256;
        canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 9999;
            opacity: ${config.opacity};
            mix-blend-mode: overlay;
        `;

        const ctx = canvas.getContext('2d');

        // Функция обновления шума
        function updateGrain() {
            if (!isEnabled) return;

            const imageData = ctx.createImageData(canvas.width, canvas.height);
            const data = imageData.data;

            for (let i = 0; i < data.length; i += 4) {
                const noise = Math.random() * 255;
                data[i] = noise; // R
                data[i + 1] = noise; // G
                data[i + 2] = noise; // B
                data[i + 3] = 255; // A
            }

            ctx.putImageData(imageData, 0, 0);

            animationFrame = requestAnimationFrame(updateGrain);
        }

        // Запускаем анимацию
        updateGrain();

        return canvas;
    }

    // Создаем и добавляем canvas
    const grainCanvas = createGrainCanvas();
    document.body.appendChild(grainCanvas);

    // Оптимизация: отключаем на мобильных устройствах
    if (window.innerWidth < 768) {
        isEnabled = false;
        grainCanvas.style.opacity = '0.01';
    }

    // Оптимизация: отключаем при слабом питании
    if ('getBattery' in navigator) {
        navigator.getBattery().then(battery => {
            if (battery.charging && battery.level < 0.2) {
                isEnabled = false;
                grainCanvas.style.opacity = '0.01';
            }
        });
    }

    // Отключаем при скролле для производительности
    let scrollTimeout = null;
    window.addEventListener('scroll', () => {
        if (isEnabled) {
            grainCanvas.style.opacity = '0.01';

            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                grainCanvas.style.opacity = config.opacity;
            }, 100);
        }
    }, { passive: true });

    // Экспортируем API для управления
    window.grainEffect = {
        enable: () => {
            isEnabled = true;
            grainCanvas.style.opacity = config.opacity;
        },
        disable: () => {
            isEnabled = false;
            grainCanvas.style.opacity = '0.01';
        },
        toggle: () => {
            if (isEnabled) {
                window.grainEffect.disable();
            } else {
                window.grainEffect.enable();
            }
        },
        setOpacity: (value) => {
            config.opacity = Math.min(0.1, Math.max(0, value));
            grainCanvas.style.opacity = isEnabled ? config.opacity : '0.01';
        }
    };

    // Dev tool: доступ через консоль
    console.log('Grain effect loaded. Use window.grainEffect to control.');

})();
