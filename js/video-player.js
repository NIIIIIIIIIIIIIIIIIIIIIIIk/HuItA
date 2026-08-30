// ========== VIDEO PLAYER CONTROLS ==========
(function() {
    'use strict';

    // === Custom video controls ===
    const videos = document.querySelectorAll('.film-video');

    videos.forEach(video => {
        const wrapper = video.closest('.film-video-wrapper');

        if (!wrapper) return;

        // Создаем контролы
        const controls = document.createElement('div');
        controls.className = 'video-controls';
        controls.style.cssText = `
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            padding: 1rem;
            background: linear-gradient(0deg, rgba(0,0,0,0.8) 0%, transparent 100%);
            display: flex;
            align-items: center;
            gap: 1rem;
            opacity: 0;
            transition: opacity 0.3s ease;
            z-index: 5;
        `;

        // Play/Pause button
        const playBtn = document.createElement('button');
        playBtn.innerHTML = '▶';
        playBtn.style.cssText = `
            background: none;
            border: none;
            color: white;
            font-size: 1.2rem;
            cursor: pointer;
            padding: 0.2rem 0.5rem;
            transition: transform 0.2s ease;
        `;
        playBtn.setAttribute('aria-label', 'Play/Pause');

        // Progress bar
        const progressBar = document.createElement('div');
        progressBar.style.cssText = `
            flex: 1;
            height: 4px;
            background: rgba(255,255,255,0.2);
            cursor: pointer;
            position: relative;
            border-radius: 2px;
        `;

        const progressFill = document.createElement('div');
        progressFill.style.cssText = `
            height: 100%;
            width: 0%;
            background: var(--color-amber, #d97a3e);
            border-radius: 2px;
            transition: width 0.1s linear;
        `;
        progressBar.appendChild(progressFill);

        // Time display
        const timeDisplay = document.createElement('span');
        timeDisplay.style.cssText = `
            font-family: var(--font-mono, monospace);
            font-size: 0.7rem;
            color: rgba(255,255,255,0.6);
            min-width: 80px;
            text-align: right;
        `;
        timeDisplay.textContent = '0:00 / 0:00';

        // Assemble controls
        controls.appendChild(playBtn);
        controls.appendChild(progressBar);
        controls.appendChild(timeDisplay);
        wrapper.appendChild(controls);

        // Показываем контролы при наведении
        wrapper.addEventListener('mouseenter', () => {
            controls.style.opacity = '1';
        });

        wrapper.addEventListener('mouseleave', () => {
            if (!video.paused) {
                controls.style.opacity = '0';
            }
        });

        // При клике на видео - toggle play
        video.addEventListener('click', () => {
            togglePlay();
        });

        // Play button
        playBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            togglePlay();
        });

        function togglePlay() {
            if (video.paused) {
                video.play().catch(() => {});
                playBtn.innerHTML = '⏸';
                controls.style.opacity = '0';
                // Показываем на секунду
                setTimeout(() => {
                    if (!video.paused && !wrapper.matches(':hover')) {
                        controls.style.opacity = '0';
                    }
                }, 2000);
            } else {
                video.pause();
                playBtn.innerHTML = '▶';
                controls.style.opacity = '1';
            }
        }

        // Update progress
        video.addEventListener('timeupdate', () => {
            const progress = (video.currentTime / video.duration) * 100;
            progressFill.style.width = `${progress}%`;

            const current = formatTime(video.currentTime);
            const total = formatTime(video.duration);
            timeDisplay.textContent = `${current} / ${total}`;
        });

        // Click on progress bar
        progressBar.addEventListener('click', (e) => {
            const rect = progressBar.getBoundingClientRect();
            const percent = (e.clientX - rect.left) / rect.width;
            video.currentTime = percent * video.duration;
        });

        // When video ends
        video.addEventListener('ended', () => {
            playBtn.innerHTML = '▶';
            controls.style.opacity = '1';
        });

        // Format time
        function formatTime(seconds) {
            if (!seconds || isNaN(seconds)) return '0:00';
            const mins = Math.floor(seconds / 60);
            const secs = Math.floor(seconds % 60);
            return `${mins}:${secs.toString().padStart(2, '0')}`;
        }

        // Загрузка метаданных
        video.addEventListener('loadedmetadata', () => {
            const total = formatTime(video.duration);
            timeDisplay.textContent = `0:00 / ${total}`;
        });

        // === Keyboard shortcuts ===
        video.addEventListener('keydown', (e) => {
            if (e.key === ' ' || e.key === 'k') {
                e.preventDefault();
                togglePlay();
            }
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                video.currentTime = Math.max(0, video.currentTime - 5);
            }
            if (e.key === 'ArrowRight') {
                e.preventDefault();
                video.currentTime = Math.min(video.duration, video.currentTime + 5);
            }
            if (e.key === 'ArrowUp') {
                e.preventDefault();
                video.volume = Math.min(1, video.volume + 0.1);
            }
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                video.volume = Math.max(0, video.volume - 0.1);
            }
        });

        // === Показываем контролы на мобильных при клике ===
        if (window.innerWidth < 768) {
            video.addEventListener('click', () => {
                const isVisible = controls.style.opacity === '1';
                controls.style.opacity = isVisible ? '0' : '1';
            });
        }

        // === Auto-play with sound off on mobile ===
        if (window.innerWidth < 768) {
            video.muted = true;
            video.setAttribute('playsinline', '');
        }
    });

})();
