document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // --------------------------------------------------------------------------
    // 1. App State & DOM Selectors
    // --------------------------------------------------------------------------
    const state = {
        currentSection: 'landing',
        candleBlown: false,
        bouquetTimerIds: []
    };

    const bgAudio = document.getElementById('bgAudio');

    const DOM = {
        app: document.getElementById('app'),
        sections: {
            landing: document.getElementById('landing'),
            opening: document.getElementById('opening'),
            letter: document.getElementById('letter'),
            photos: document.getElementById('photos'),
            bouquet: document.getElementById('bouquet'),
            wish: document.getElementById('wish'),
            finale: document.getElementById('finale')
        },
        startButton: document.getElementById('startButton'),
        nextToPhotosBtn: document.getElementById('nextToPhotosBtn'),

        // Single Photo Stage Cards & Buttons
        photoCard1: document.getElementById('photoCard1'),
        photoCard2: document.getElementById('photoCard2'),
        photoCard3: document.getElementById('photoCard3'),
        photo1NextBtn: document.getElementById('photo1NextBtn'),
        photo2NextBtn: document.getElementById('photo2NextBtn'),
        photo3NextBtn: document.getElementById('photo3NextBtn'),

        // Bouquet Stage Elements
        bouquetWrapper: document.querySelector('.bouquet-wrapper'),
        floatingCompliments: document.querySelectorAll('.compliment-pill'),
        cinnamorollContainer: document.getElementById('cinnamorollContainer'),
        bouquetBanner: document.getElementById('bouquetBanner'),
        bouquetToWishBtn: document.getElementById('bouquetToWishBtn'),
        floatingPetals: document.getElementById('floatingPetals'),

        // Cake Elements
        candle: document.getElementById('candle'),
        flame: document.getElementById('flame'),
        smokeParticles: document.getElementById('smokeParticles'),
        wishHint: document.getElementById('wishHint'),

        // Dialog & Canvas
        endingDialog: document.getElementById('endingDialog'),
        homeButton: document.getElementById('homeButton'),
        toast: document.getElementById('toast'),
        particlesCanvas: document.getElementById('particlesCanvas'),
        fireworksCanvas: document.getElementById('fireworksCanvas'),
        confettiCanvas: document.getElementById('confettiCanvas')
    };

    // --------------------------------------------------------------------------
    // 2. HTML5 Audio Control (`assets/audio/birthday.mp3`)
    // --------------------------------------------------------------------------
    function startAudioPlayback() {
        if (bgAudio) {
            bgAudio.play().catch(err => {
                console.log('Audio autoplay prevented or error playing birthday.mp3:', err);
            });
        }
    }

    // --------------------------------------------------------------------------
    // 3. Magical Sparkle Particle Burst Engine (Playful & Randomized)
    // --------------------------------------------------------------------------
    const burstEmojis = ['✨', '💖', '🌸', '⭐', '💕', '🎀', '💫', '🧁', '🍪', '🍓', '🐾', '🍭', '🧸'];

    function createSparkleBurst(x, y) {
        const posX = x !== undefined ? x : window.innerWidth / 2;
        const posY = y !== undefined ? y : window.innerHeight / 2;

        let container = document.querySelector('.sparkle-burst-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'sparkle-burst-container';
            container.setAttribute('aria-hidden', 'true');
            document.body.appendChild(container);
        }

        const count = Math.floor(Math.random() * 8) + 14; // 14 to 21 particles

        for (let i = 0; i < count; i++) {
            const el = document.createElement('span');
            el.className = 'sparkle-burst-item';
            el.textContent = burstEmojis[Math.floor(Math.random() * burstEmojis.length)];
            el.style.left = `${posX + (Math.random() * 30 - 15)}px`;
            el.style.top = `${posY + (Math.random() * 30 - 15)}px`;

            const angle = (i / count) * 2 * Math.PI + (Math.random() * 0.6 - 0.3);
            const dist = 50 + Math.random() * 140;
            const tx = Math.cos(angle) * dist;
            const ty = Math.sin(angle) * dist - (Math.random() * 35 + 10);
            const rot = (Math.random() * 240 - 120) + 'deg';
            const size = (Math.random() * 0.7 + 0.9) + 'rem';

            el.style.fontSize = size;
            el.style.setProperty('--tx', `${tx}px`);
            el.style.setProperty('--ty', `${ty}px`);
            el.style.setProperty('--rot', rot);
            el.style.animationDuration = (0.7 + Math.random() * 0.35) + 's';
            el.style.animationDelay = `${Math.random() * 0.1}s`;

            container.appendChild(el);

            setTimeout(() => {
                el.remove();
            }, 1100);
        }
    }

    // --------------------------------------------------------------------------
    // 4. Section Navigation Engine (Playful & Randomized Transitions)
    // --------------------------------------------------------------------------
    const exitAnimations = ['exit-pop-left', 'exit-pop-right', 'exit-drop-tilt', 'exit-zoom-spin'];
    const enterAnimations = ['enter-wobble', 'enter-spring-up', 'enter-twist-in'];

    let isSectionTransitioning = false;

    function switchSection(targetSectionId, callback) {
        if (isSectionTransitioning) return;
        isSectionTransitioning = true;

        createSparkleBurst();

        const currentId = state.currentSection;
        const currentEl = currentId ? DOM.sections[currentId] : null;
        const targetEl = DOM.sections[targetSectionId];

        // Randomly pick unique exit and entry styles
        const randomExit = exitAnimations[Math.floor(Math.random() * exitAnimations.length)];
        const randomEnter = enterAnimations[Math.floor(Math.random() * enterAnimations.length)];

        if (currentEl && currentEl !== targetEl && currentEl.style.display !== 'none') {
            currentEl.classList.remove('active-section', ...enterAnimations);
            currentEl.classList.add(randomExit);

            setTimeout(() => {
                currentEl.style.display = 'none';
                currentEl.classList.remove(...exitAnimations);

                if (targetEl) {
                    targetEl.style.display = 'flex';
                    targetEl.classList.remove(...exitAnimations, ...enterAnimations);
                    void targetEl.offsetWidth;
                    targetEl.classList.add('active-section', randomEnter);
                }

                state.currentSection = targetSectionId;
                window.scrollTo({ top: 0, behavior: 'smooth' });
                isSectionTransitioning = false;
                if (callback) callback();
            }, 360);
        } else {
            Object.keys(DOM.sections).forEach(id => {
                const el = DOM.sections[id];
                el.classList.remove(...exitAnimations, ...enterAnimations);
                if (id === targetSectionId) {
                    el.style.display = 'flex';
                    void el.offsetWidth;
                    el.classList.add('active-section', randomEnter);
                } else {
                    el.classList.remove('active-section');
                    el.style.display = 'none';
                }
            });

            state.currentSection = targetSectionId;
            window.scrollTo({ top: 0, behavior: 'smooth' });
            isSectionTransitioning = false;
            if (callback) callback();
        }
    }

    // --------------------------------------------------------------------------
    // 5. Flow Sequencing Event Handlers
    // --------------------------------------------------------------------------

    // Flow 1: Landing -> Start Button (Starts Audio + Opens Opening Loader -> Letter)
    DOM.startButton.addEventListener('click', (e) => {
        const rect = DOM.startButton.getBoundingClientRect();
        createSparkleBurst(rect.left + rect.width / 2, rect.top + rect.height / 2);

        startAudioPlayback();
        switchSection('opening');

        setTimeout(() => {
            const title = document.getElementById('opening-title');
            if (title) title.textContent = "Getting everything ready…";
        }, 1000);

        setTimeout(() => {
            switchSection('letter', () => {
                const card = DOM.sections.letter.querySelector('.letter-card');
                if (card) card.focus();
            });
        }, 2200);
    });

    // Flow 2: Birthday Message -> Photos
    DOM.nextToPhotosBtn.addEventListener('click', (e) => {
        const rect = DOM.nextToPhotosBtn.getBoundingClientRect();
        createSparkleBurst(rect.left + rect.width / 2, rect.top + rect.height / 2);

        showPhotoStep(1);
        switchSection('photos');
    });

    // Flow 3: Single Photo progression (Photo 1 -> Photo 2 -> Photo 3)
    function showPhotoStep(step) {
        const cards = [DOM.photoCard1, DOM.photoCard2, DOM.photoCard3];
        const targetCard = cards[step - 1];
        const activeCard = cards.find(c => c && c.style.display !== 'none' && c.classList.contains('active-card'));

        createSparkleBurst(window.innerWidth / 2, window.innerHeight * 0.45);

        if (activeCard && activeCard !== targetCard) {
            activeCard.classList.remove('active-card');
            activeCard.classList.add('photo-card-exiting');

            setTimeout(() => {
                activeCard.style.display = 'none';
                activeCard.classList.remove('photo-card-exiting');

                cards.forEach((c, idx) => {
                    if (idx === step - 1) {
                        c.style.display = 'flex';
                        void c.offsetWidth;
                        c.classList.add('active-card');
                    } else {
                        c.style.display = 'none';
                        c.classList.remove('active-card');
                    }
                });
            }, 280);
        } else {
            cards.forEach((c, idx) => {
                if (idx === step - 1) {
                    c.style.display = 'flex';
                    void c.offsetWidth;
                    c.classList.add('active-card');
                } else {
                    c.style.display = 'none';
                    c.classList.remove('active-card');
                }
            });
        }
    }

    DOM.photo1NextBtn.addEventListener('click', (e) => {
        const rect = DOM.photo1NextBtn.getBoundingClientRect();
        createSparkleBurst(rect.left + rect.width / 2, rect.top + rect.height / 2);
        showPhotoStep(2);
    });

    DOM.photo2NextBtn.addEventListener('click', (e) => {
        const rect = DOM.photo2NextBtn.getBoundingClientRect();
        createSparkleBurst(rect.left + rect.width / 2, rect.top + rect.height / 2);
        showPhotoStep(3);
    });

    // Flow 4: Photo 3 -> Cinematic Bouquet Animation Scene
    DOM.photo3NextBtn.addEventListener('click', (e) => {
        const rect = DOM.photo3NextBtn.getBoundingClientRect();
        createSparkleBurst(rect.left + rect.width / 2, rect.top + rect.height / 2);
        switchSection('bouquet', () => {
            startBouquetCreationAnimation();
        });
    });

    // --------------------------------------------------------------------------
    // 5. Cinematic Bouquet Creation & Compliments Sequencing
    // --------------------------------------------------------------------------
    function createFloatingPetals() {
        if (!DOM.floatingPetals) return;
        DOM.floatingPetals.innerHTML = '';
        for (let i = 0; i < 10; i++) {
            const petal = document.createElement('div');
            petal.className = 'floating-petal';
            petal.style.left = `${Math.random() * 85 + 5}%`;
            petal.style.top = `${Math.random() * 60 + 20}%`;
            petal.style.animationDelay = `${i * 0.5}s`;
            DOM.floatingPetals.appendChild(petal);
        }
    }

    function resetBouquetScene() {
        state.bouquetTimerIds.forEach(id => clearTimeout(id));
        state.bouquetTimerIds = [];

        if (DOM.bouquetWrapper) {
            DOM.bouquetWrapper.className = 'bouquet-wrapper';
        }
        if (DOM.cinnamorollContainer) {
            DOM.cinnamorollContainer.classList.remove('show');
        }
        if (DOM.bouquetBanner) {
            DOM.bouquetBanner.classList.remove('show');
        }

        DOM.floatingCompliments.forEach(pill => {
            pill.classList.remove('show');
        });
    }

    function addBouquetStep(delay, callback) {
        const id = setTimeout(callback, delay);
        state.bouquetTimerIds.push(id);
    }

    function triggerCompliment(index) {
        const pill = DOM.floatingCompliments[index];
        if (pill) {
            pill.classList.remove('show');
            void pill.offsetWidth;
            pill.classList.add('show');
        }
    }

    function startBouquetCreationAnimation() {
        resetBouquetScene();
        createFloatingPetals();

        // Step 1: Stems grow upward (0.3s)
        addBouquetStep(300, () => {
            DOM.bouquetWrapper.classList.add('anim-stems');
        });

        // Step 2: Leaves unfold (0.9s)
        addBouquetStep(900, () => {
            DOM.bouquetWrapper.classList.add('anim-leaves');
        });

        // Step 3: First flower blooms (1.6s) + Compliment 1
        addBouquetStep(1600, () => {
            DOM.bouquetWrapper.classList.add('anim-f1');
            triggerCompliment(0); // "so pretty ✨"
        });

        // Step 4: Second flower blooms (2.2s) + Compliment 2
        addBouquetStep(2200, () => {
            DOM.bouquetWrapper.classList.add('anim-f2');
            triggerCompliment(1); // "beautiful smile 💗"
        });

        // Step 5: Third flower blooms (2.8s) + Compliment 3
        addBouquetStep(2800, () => {
            DOM.bouquetWrapper.classList.add('anim-f3');
            triggerCompliment(2); // "effortlessly lovely 🌸"
        });

        // Step 6: Lotus flowers unfold gracefully (3.5s) + Compliment 4
        addBouquetStep(3500, () => {
            DOM.bouquetWrapper.classList.add('anim-lotus');
            triggerCompliment(3); // "you look amazing"
        });

        // Step 7: Supporting blossoms & baby's breath (4.2s) + Compliment 5
        addBouquetStep(4200, () => {
            DOM.bouquetWrapper.classList.add('anim-f4');
            triggerCompliment(4); // "simply beautiful ✨"
        });

        // Step 8: Satin Ribbon wraps around stems (4.9s)
        addBouquetStep(4900, () => {
            DOM.bouquetWrapper.classList.add('anim-ribbon');
        });

        // Step 9: Orbiting sparkles appear (5.5s)
        addBouquetStep(5500, () => {
            DOM.bouquetWrapper.classList.add('anim-sparkles');
        });

        // Step 10: Cinnamoroll companion enters presenting flowers (6.1s)
        addBouquetStep(6100, () => {
            DOM.cinnamorollContainer.classList.add('show');
        });

        // Step 11: Final settling breathe sway & reveal Wish button (6.9s)
        addBouquetStep(6900, () => {
            DOM.bouquetWrapper.classList.add('completed');
            DOM.bouquetBanner.classList.add('show');
        });
    }

    // Flow 5: Bouquet -> Wish / Cake Section
    DOM.bouquetToWishBtn.addEventListener('click', (e) => {
        const rect = DOM.bouquetToWishBtn.getBoundingClientRect();
        createSparkleBurst(rect.left + rect.width / 2, rect.top + rect.height / 2);
        switchSection('wish', () => {
            startCakeAssemblyAnimation();
        });
    });

    // --------------------------------------------------------------------------
    // 6. Cinematic Cake Assembly & Wish Engine
    // --------------------------------------------------------------------------
    function addCakeStep(delay, callback) {
        const id = setTimeout(callback, delay);
        state.cakeTimerIds = state.cakeTimerIds || [];
        state.cakeTimerIds.push(id);
    }

    function resetCakeScene() {
        if (state.cakeTimerIds) {
            state.cakeTimerIds.forEach(id => clearTimeout(id));
            state.cakeTimerIds = [];
        }
        state.candleBlown = false;

        const cake = DOM.cake || document.getElementById('cake');
        if (cake) {
            cake.className = 'cake';
        }
        if (DOM.candle) {
            DOM.candle.classList.remove('extinguished');
        }
        if (DOM.wishHint) {
            DOM.wishHint.classList.remove('show-hint');
        }
        const yaySticker = document.getElementById('cinStickerYay');
        if (yaySticker) {
            yaySticker.classList.remove('cin-sticker-visible');
        }
    }

    function startCakeAssemblyAnimation() {
        resetCakeScene();
        const cake = DOM.cake || document.getElementById('cake');
        if (!cake) return;

        // Step 1: Pedestal plate & stand rise up (0.3s)
        addCakeStep(300, () => {
            cake.classList.add('anim-cake-stand');
        });

        // Step 2: Bottom tier rises & settles with subtle sprinkles (1.0s)
        addCakeStep(1000, () => {
            cake.classList.add('anim-cake-layer-bottom');
            createSparkleBurst(window.innerWidth / 2, window.innerHeight * 0.58);
        });

        // Step 3: Middle tier & cream drop into place (1.8s)
        addCakeStep(1800, () => {
            cake.classList.add('anim-cake-layer-middle');
            createSparkleBurst(window.innerWidth / 2, window.innerHeight * 0.50);
        });

        // Step 4: Top tier & Cinnamoroll topper ears settle (2.6s)
        addCakeStep(2600, () => {
            cake.classList.add('anim-cake-layer-top');
            createSparkleBurst(window.innerWidth / 2, window.innerHeight * 0.42);
        });

        // Step 5: Golden centerpiece candle rises up from cake (3.5s)
        addCakeStep(3500, () => {
            cake.classList.add('anim-cake-candles');
        });

        // Step 6: Flame ignites with warm flickering glow (4.2s)
        addCakeStep(4200, () => {
            cake.classList.add('anim-cake-flames');
        });

        // Step 7: Sparkle celebration ring bursts around cake (4.9s)
        addCakeStep(4900, () => {
            cake.classList.add('anim-cake-sparkles');
            createSparkleBurst(window.innerWidth / 2, window.innerHeight * 0.45);
        });

        // Step 8: Settles into gentle idle breathing motion & reveals wish hint (5.6s)
        addCakeStep(5600, () => {
            cake.classList.add('anim-cake-completed');
            if (DOM.wishHint) {
                DOM.wishHint.classList.add('show-hint');
            }
        });
    }

    function extinguishCandle() {
        if (state.candleBlown) return;
        state.candleBlown = true;

        DOM.candle.classList.add('extinguished');
        const cake = DOM.cake || document.getElementById('cake');
        if (cake) {
            cake.classList.add('extinguished');
        }
        createSmokeParticles();
        createSparkleBurst(window.innerWidth / 2, window.innerHeight * 0.38);

        // Pop in the Yay! Cinnamoroll sticker 🎉
        const yaySticker = document.getElementById('cinStickerYay');
        if (yaySticker) {
            setTimeout(() => {
                yaySticker.classList.add('cin-sticker-visible');
            }, 200);
        }

        setTimeout(() => {
            switchSection('finale', () => {
                startFireworks();
                startConfetti();

                setTimeout(() => {
                    DOM.endingDialog.showModal();
                }, 1400);
            });
        }, 1600);
    }

    function createSmokeParticles() {
        DOM.smokeParticles.innerHTML = '';
        // Wispy smoke circles
        for (let i = 0; i < 15; i++) {
            const particle = document.createElement('div');
            particle.className = 'smoke-particle';
            particle.style.setProperty('--rand-x', Math.random());
            particle.style.animationDelay = `${i * 0.08}s`;
            DOM.smokeParticles.appendChild(particle);
        }
        // Floating wish hearts rising with smoke
        const emojis = ['💖', '✨', '💕', '⭐', '🌸'];
        for (let i = 0; i < 6; i++) {
            const heart = document.createElement('span');
            heart.className = 'smoke-heart';
            heart.textContent = emojis[i % emojis.length];
            heart.style.setProperty('--rx', Math.random());
            heart.style.setProperty('--rot', `${(Math.random() - 0.5) * 40}deg`);
            heart.style.animationDelay = `${i * 0.15}s`;
            DOM.smokeParticles.appendChild(heart);
        }
    }

    DOM.candle.addEventListener('click', extinguishCandle);
    DOM.flame.addEventListener('click', extinguishCandle);

    // Interactive Letter Seal Tap
    const letterSeal = document.getElementById('letterSeal');
    if (letterSeal) {
        letterSeal.addEventListener('click', (e) => {
            const rect = letterSeal.getBoundingClientRect();
            createSparkleBurst(rect.left + rect.width / 2, rect.top + rect.height / 2);
        });
    }

    // Interactive Photo Tap Sparkles
    [DOM.photoCard1, DOM.photoCard2, DOM.photoCard3].forEach(card => {
        if (card) {
            card.addEventListener('click', (e) => {
                // If not clicking the next button directly, create sparkle burst at click point
                if (e.target.tagName !== 'BUTTON') {
                    createSparkleBurst(e.clientX, e.clientY);
                }
            });
        }
    });

    // --------------------------------------------------------------------------
    // 7. Ambient Pixel Canvas Stars
    // --------------------------------------------------------------------------
    function initBackgroundParticles() {
        const canvas = DOM.particlesCanvas;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });

        const particles = Array.from({ length: 50 }, () => ({
            x: Math.random() * width,
            y: Math.random() * height,
            size: Math.floor(Math.random() * 3) + 2,
            alpha: Math.random() * 0.7 + 0.3,
            speed: Math.random() * 0.4 + 0.15,
            color: ['#FF3385', '#FFB6C1', '#FFF0F5', '#FFD166', '#FF85A2'][Math.floor(Math.random() * 5)]
        }));

        function draw() {
            ctx.clearRect(0, 0, width, height);
            particles.forEach(p => {
                p.y -= p.speed;
                if (p.y < 0) p.y = height;

                ctx.fillStyle = p.color;
                ctx.globalAlpha = p.alpha;
                ctx.fillRect(Math.floor(p.x), Math.floor(p.y), p.size, p.size);

                if (p.size >= 3) {
                    ctx.fillRect(Math.floor(p.x - 1), Math.floor(p.y + 1), p.size + 2, 1);
                    ctx.fillRect(Math.floor(p.x + 1), Math.floor(p.y - 1), 1, p.size + 2);
                }
            });
            ctx.globalAlpha = 1.0;
            requestAnimationFrame(draw);
        }
        draw();
    }
    initBackgroundParticles();

    // --------------------------------------------------------------------------
    // 8. Fireworks & Confetti Canvas Engines
    // --------------------------------------------------------------------------
    let fireworksActive = false;
    function startFireworks() {
        const canvas = DOM.fireworksCanvas;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;
        fireworksActive = true;

        const particles = [];
        const colors = ['#FF3385', '#FFD166', '#FF85A2', '#FFB6C1', '#E60067', '#FFF0F5'];

        function createBurst(x, y) {
            for (let i = 0; i < 45; i++) {
                const angle = Math.random() * Math.PI * 2;
                const speed = Math.random() * 6 + 2;
                particles.push({
                    x, y,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed,
                    alpha: 1,
                    color: colors[Math.floor(Math.random() * colors.length)],
                    size: Math.floor(Math.random() * 3) + 3
                });
            }
        }

        let burstTimer = 0;
        function render() {
            if (!fireworksActive) return;
            ctx.fillStyle = 'rgba(42, 14, 35, 0.2)';
            ctx.fillRect(0, 0, width, height);

            burstTimer++;
            if (burstTimer % 22 === 0) {
                createBurst(Math.random() * width, Math.random() * (height * 0.6));
            }

            for (let i = particles.length - 1; i >= 0; i--) {
                const p = particles[i];
                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.08;
                p.alpha -= 0.015;

                if (p.alpha <= 0) {
                    particles.splice(i, 1);
                    continue;
                }

                ctx.fillStyle = p.color;
                ctx.globalAlpha = p.alpha;
                ctx.fillRect(Math.floor(p.x), Math.floor(p.y), p.size, p.size);
            }
            ctx.globalAlpha = 1.0;
            requestAnimationFrame(render);
        }
        render();
    }

    let confettiActive = false;
    function startConfetti() {
        const canvas = DOM.confettiCanvas;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;
        confettiActive = true;

        const pieces = Array.from({ length: 90 }, () => ({
            x: Math.random() * width,
            y: Math.random() * height - height,
            size: Math.floor(Math.random() * 6) + 6,
            color: ['#FF3385', '#FFD166', '#FF85A2', '#FFB6C1', '#B5179E'][Math.floor(Math.random() * 5)],
            vy: Math.random() * 3 + 2,
            vx: Math.random() * 2 - 1,
            rotation: Math.random() * 360,
            vRot: Math.random() * 6 - 3
        }));

        function render() {
            if (!confettiActive) return;
            ctx.clearRect(0, 0, width, height);

            pieces.forEach(p => {
                p.y += p.vy;
                p.x += p.vx;
                p.rotation += p.vRot;

                if (p.y > height) {
                    p.y = -20;
                    p.x = Math.random() * width;
                }

                ctx.save();
                ctx.translate(Math.floor(p.x), Math.floor(p.y));
                ctx.rotate((p.rotation * Math.PI) / 180);
                ctx.fillStyle = p.color;
                ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
                ctx.restore();
            });
            requestAnimationFrame(render);
        }
        render();
    }

    // --------------------------------------------------------------------------
    // 9. Simplified Dialog Action (ONLY Return to Start)
    // --------------------------------------------------------------------------
    DOM.homeButton.addEventListener('click', () => {
        DOM.endingDialog.close();
        fireworksActive = false;
        confettiActive = false;
        DOM.sections.finale.style.display = 'none';
        state.candleBlown = false;
        DOM.candle.classList.remove('extinguished');
        showPhotoStep(1);
        resetBouquetScene();
        if (bgAudio) {
            bgAudio.currentTime = 0;
        }
        // Reset the Yay sticker so it's fresh next time
        const yaySticker = document.getElementById('cinStickerYay');
        if (yaySticker) {
            yaySticker.classList.remove('cin-sticker-visible');
        }
        switchSection('landing');
        showToast('Cinnamoroll Circuit is back 💌');
    });

    function showToast(message) {
        if (!DOM.toast) return;
        DOM.toast.textContent = message;
        DOM.toast.classList.add('show');
        setTimeout(() => {
            DOM.toast.classList.remove('show');
        }, 3000);
    }
});
