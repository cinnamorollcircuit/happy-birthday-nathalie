document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // Initialize day-to-night timeline atmosphere
    document.body.className = 'time-landing';

    // --------------------------------------------------------------------------
    // 1. App State & DOM Selectors
    // --------------------------------------------------------------------------
    const state = {
        currentSection: 'landing',
        candleBlown: false,
        selectedDessert: null,
        musicPlaying: true,
        musicMuted: false,
        openingTimerIds: [],
        dessertTimerIds: [],
        bouquetTimerIds: [],
        cakeTimerIds: [],
        memoryBoxTimerIds: [],
        sectionHistory: ['landing']
    };

    const bgAudio = document.getElementById('bgAudio');

    const DOM = {
        app: document.getElementById('app'),
        sections: {
            landing: document.getElementById('landing'),
            opening: document.getElementById('opening'),
            letter: document.getElementById('letter'),
            photos: document.getElementById('photos'),
            dessert: document.getElementById('dessert'),
            bouquet: document.getElementById('bouquet'),
            wish: document.getElementById('wish'),
            finale: document.getElementById('finale')
        },
        navBackBtn: document.getElementById('navBackBtn'),
        startButton: document.getElementById('startButton'),
        nextToPhotosBtn: document.getElementById('nextToPhotosBtn'),

        // Single Photo Stage Cards & Buttons
        photoCard1: document.getElementById('photoCard1'),
        photoCard2: document.getElementById('photoCard2'),
        photoCard3: document.getElementById('photoCard3'),
        photo3NextBtn: document.getElementById('photo3NextBtn'),

        // Dessert Shop Elements
        dessertItemBtns: document.querySelectorAll('.dessert-item-btn'),
        dessertMessageCard: document.getElementById('dessertMessageCard'),
        dessertMsgPlaceholder: document.getElementById('dessertMsgPlaceholder'),
        dessertMsgContent: document.getElementById('dessertMsgContent'),
        dessertMsgIcon: document.getElementById('dessertMsgIcon'),
        dessertMsgTitle: document.getElementById('dessertMsgTitle'),
        dessertMsgText: document.getElementById('dessertMsgText'),
        dessertToBouquetBtn: document.getElementById('dessertToBouquetBtn'),

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

        // Music Controller Elements
        musicController: document.getElementById('musicController'),
        musicPlayPauseBtn: document.getElementById('musicPlayPauseBtn'),
        musicPlayIcon: document.getElementById('musicPlayIcon'),
        musicMuteBtn: document.getElementById('musicMuteBtn'),
        musicMuteIcon: document.getElementById('musicMuteIcon'),

        // Dialog & Canvas
        homeButton: document.getElementById('homeButton'),
        toast: document.getElementById('toast'),
        particlesCanvas: document.getElementById('particlesCanvas'),
        sakuraCanvas: document.getElementById('sakuraCanvas'),
        confettiCanvas: document.getElementById('confettiCanvas')
    };

    // --------------------------------------------------------------------------
    // 2. HTML5 Audio Control (`assets/audio/birthday.mp3`) & Floating Controller
    // --------------------------------------------------------------------------
    let isAudioUnlocked = false;

    function updateMusicUI() {
        if (!bgAudio) return;
        const isPaused = bgAudio.paused;
        const isMuted = bgAudio.muted;

        if (DOM.musicController) {
            if (!isPaused) {
                DOM.musicController.classList.add('is-playing');
            } else {
                DOM.musicController.classList.remove('is-playing');
            }
        }

        if (DOM.musicPlayIcon) {
            DOM.musicPlayIcon.textContent = isPaused ? '▶' : '❚❚';
        }
        if (DOM.musicPlayPauseBtn) {
            DOM.musicPlayPauseBtn.setAttribute('aria-label', isPaused ? 'Play background music' : 'Pause background music');
            DOM.musicPlayPauseBtn.title = isPaused ? 'Play' : 'Pause';
        }

        if (DOM.musicMuteIcon) {
            DOM.musicMuteIcon.textContent = isMuted ? '🔇' : '🔊';
        }
        if (DOM.musicMuteBtn) {
            DOM.musicMuteBtn.setAttribute('aria-label', isMuted ? 'Unmute background music' : 'Mute background music');
            DOM.musicMuteBtn.title = isMuted ? 'Unmute' : 'Mute';
        }
    }

    function startAudioPlayback() {
        if (!bgAudio) return;
        bgAudio.volume = 0.38; // Soft, gentle, comfortable volume

        const playPromise = bgAudio.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                isAudioUnlocked = true;
                state.musicPlaying = true;
                updateMusicUI();
            }).catch(() => {
                // Autoplay blocked by browser policy before user interaction
                // Unlock on the first user interaction (touch/click/key) anywhere on the window
                if (!isAudioUnlocked) {
                    const unlock = () => {
                        bgAudio.volume = 0.38;
                        bgAudio.play().then(() => {
                            isAudioUnlocked = true;
                            state.musicPlaying = true;
                            updateMusicUI();
                        }).catch(() => {});
                        window.removeEventListener('click', unlock);
                        window.removeEventListener('touchstart', unlock);
                        window.removeEventListener('keydown', unlock);
                    };
                    window.addEventListener('click', unlock, { once: true });
                    window.addEventListener('touchstart', unlock, { once: true });
                    window.addEventListener('keydown', unlock, { once: true });
                }
            });
        }
    }

    // Try starting audio immediately on load
    startAudioPlayback();

    // Floating music controller button handlers
    if (DOM.musicPlayPauseBtn) {
        DOM.musicPlayPauseBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (!bgAudio) return;
            if (bgAudio.paused) {
                bgAudio.play().then(() => {
                    state.musicPlaying = true;
                    updateMusicUI();
                }).catch(() => {});
            } else {
                bgAudio.pause();
                state.musicPlaying = false;
                updateMusicUI();
            }
        });
    }

    if (DOM.musicMuteBtn) {
        DOM.musicMuteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (!bgAudio) return;
            bgAudio.muted = !bgAudio.muted;
            state.musicMuted = bgAudio.muted;
            updateMusicUI();
        });
    }

    if (bgAudio) {
        bgAudio.addEventListener('play', updateMusicUI);
        bgAudio.addEventListener('pause', updateMusicUI);
        bgAudio.addEventListener('volumechange', updateMusicUI);
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

    const previousSectionMap = {
        'opening': 'landing',
        'letter': 'landing',
        'photos': 'letter',
        'dessert': 'photos',
        'bouquet': 'dessert',
        'wish': 'bouquet',
        'finale': 'wish'
    };

    function updateNavBackButton() {
        const btn = DOM.navBackBtn || document.getElementById('navBackBtn');
        if (!btn) return;

        if (state.currentSection === 'landing' || state.currentSection === 'opening') {
            btn.style.display = 'none';
            btn.classList.remove('visible');
        } else {
            btn.style.display = 'inline-flex';
            void btn.offsetWidth;
            btn.classList.add('visible');
        }
    }

    function switchSection(targetSectionId, callback, isBackwards = false) {
        if (isSectionTransitioning) return;
        isSectionTransitioning = true;

        createSparkleBurst();

        const currentId = state.currentSection;
        const currentEl = currentId ? DOM.sections[currentId] : null;
        const targetEl = DOM.sections[targetSectionId];

        // Track navigation history stack
        if (!isBackwards) {
            if (targetSectionId !== 'opening') {
                if (state.sectionHistory[state.sectionHistory.length - 1] !== targetSectionId) {
                    state.sectionHistory.push(targetSectionId);
                }
            }
        }

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
                document.body.className = `time-${targetSectionId}`;
                updateNavBackButton();
                window.scrollTo({ top: 0, behavior: 'smooth' });
                isSectionTransitioning = false;
                if (callback) callback();
            }, 360);
        } else {
            Object.keys(DOM.sections).forEach(id => {
                const el = DOM.sections[id];
                if (!el) return;
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
            document.body.className = `time-${targetSectionId}`;
            updateNavBackButton();
            window.scrollTo({ top: 0, behavior: 'smooth' });
            isSectionTransitioning = false;
            if (callback) callback();
        }
    }

    function goBack() {
        if (isSectionTransitioning) return;

        // Close final dialog if open
        if (DOM.endingDialog && DOM.endingDialog.open) {
            DOM.endingDialog.close();
        }

        const current = state.currentSection;
        let target = 'landing';

        if (state.sectionHistory && state.sectionHistory.length > 1) {
            state.sectionHistory.pop(); // Remove current
            target = state.sectionHistory[state.sectionHistory.length - 1];
        } else if (previousSectionMap[current]) {
            target = previousSectionMap[current];
        }

        if (target === 'opening' || !target) {
            target = 'landing';
        }

        // Clean up current section timers
        if (current === 'photos') {
            clearScrapbookTimers();
        } else if (current === 'dessert') {
            resetDessertScene();
        } else if (current === 'bouquet') {
            resetBouquetScene();
        } else if (current === 'wish') {
            resetCakeScene();
        } else if (current === 'finale') {
            confettiActive = false;
            resetMemoryBoxScene();
        }

        // Setup destination section when returning
        const onEnter = () => {
            if (target === 'photos') {
                startScrapbookSequentialReveal();
            } else if (target === 'dessert') {
                resetDessertScene();
            } else if (target === 'bouquet') {
                startBouquetCreationAnimation();
            } else if (target === 'wish') {
                state.candleBlown = false;
                if (DOM.candle) DOM.candle.classList.remove('extinguished');
                const cake = DOM.cake || document.getElementById('cake');
                if (cake) cake.classList.remove('extinguished');
                startCakeAssemblyAnimation();
            } else if (target === 'letter') {
                const card = DOM.sections.letter ? DOM.sections.letter.querySelector('.letter-card') : null;
                if (card) card.focus();
            } else if (target === 'landing') {
                state.sectionHistory = ['landing'];
            }
        };

        switchSection(target, onEnter, true);
    }

    // Attach Return / Back button click handler
    if (DOM.navBackBtn) {
        DOM.navBackBtn.addEventListener('click', () => {
            const rect = DOM.navBackBtn.getBoundingClientRect();
            createSparkleBurst(rect.left + rect.width / 2, rect.top + rect.height / 2);
            goBack();
        });
    }

    // --------------------------------------------------------------------------
    // 5. Flow Sequencing Event Handlers
    // --------------------------------------------------------------------------

    // Flow 1: Landing -> Start Button (Starts Audio + Clean Opening -> Letter)
    if (DOM.startButton) {
        DOM.startButton.addEventListener('click', () => {
            if (isSectionTransitioning) return;

            const rect = DOM.startButton.getBoundingClientRect();
            createSparkleBurst(rect.left + rect.width / 2, rect.top + rect.height / 2);

            startAudioPlayback();

            // Clear any previous opening timers
            if (state.openingTimerIds) {
                state.openingTimerIds.forEach(id => clearTimeout(id));
                state.openingTimerIds = [];
            }

            switchSection('opening', () => {
                const t1 = setTimeout(() => {
                    const title = document.getElementById('opening-title');
                    if (title) title.textContent = "Getting everything ready…";
                }, 800);
                state.openingTimerIds.push(t1);

                const t2 = setTimeout(() => {
                    switchSection('letter', () => {
                        const card = DOM.sections.letter ? DOM.sections.letter.querySelector('.letter-card') : null;
                        if (card) card.focus();
                    });
                }, 1800);
                state.openingTimerIds.push(t2);
            });
        });
    }

    // Flow 2: Birthday Message -> Photos (Scrapbook Sequence)
    if (DOM.nextToPhotosBtn) {
        DOM.nextToPhotosBtn.addEventListener('click', () => {
            const rect = DOM.nextToPhotosBtn.getBoundingClientRect();
            createSparkleBurst(rect.left + rect.width / 2, rect.top + rect.height / 2);

            switchSection('photos', () => {
                startScrapbookSequentialReveal();
            });
        });
    }

    // ── One-by-One Polaroid Reveal Animation (Slow, Dramatic & Realistic) ──
    let scrapbookStepTimers = [];

    function clearScrapbookTimers() {
        scrapbookStepTimers.forEach(t => clearTimeout(t));
        scrapbookStepTimers = [];
    }

    function createScrapbookPetalBurst(targetElement) {
        const container = document.getElementById('scrapbookPetals');
        if (!container || !targetElement) return;

        const rect = targetElement.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        const originX = rect.left + rect.width / 2 - containerRect.left;
        const originY = rect.top + rect.height * 0.3 - containerRect.top;

        const emojis = ['🌸', '🌸', '✨', '💕'];
        for (let i = 0; i < 4; i++) {
            const petal = document.createElement('span');
            petal.className = 'scrapbook-floating-petal';
            petal.textContent = emojis[i % emojis.length];
            petal.style.left = `${originX + (Math.random() - 0.5) * 60}px`;
            petal.style.top = `${originY + (Math.random() - 0.5) * 40}px`;
            petal.style.setProperty('--drift-x', `${(Math.random() - 0.5) * 80}px`);
            petal.style.animationDelay = `${i * 0.12}s`;
            container.appendChild(petal);

            setTimeout(() => {
                petal.remove();
            }, 3500);
        }
    }

    function startScrapbookSequentialReveal() {
        clearScrapbookTimers();

        const cards = [DOM.photoCard1, DOM.photoCard2, DOM.photoCard3];
        const actions = document.getElementById('scrapbookActions');

        // Reset all cards to initial hidden state
        cards.forEach(card => {
            if (card) {
                card.classList.remove('card-revealed');
                card.style.display = 'flex';
            }
        });
        if (actions) {
            actions.classList.remove('show-action');
        }

        // Step 1: Photo 1 begins reveal (0.8s) -> settles & develops (~2.8s)
        scrapbookStepTimers.push(setTimeout(() => {
            if (DOM.photoCard1) {
                DOM.photoCard1.classList.add('card-revealed');
                createScrapbookPetalBurst(DOM.photoCard1);
                createSparkleBurst(window.innerWidth * 0.35, window.innerHeight * 0.45);
            }
        }, 800));

        // Step 2: Photo 2 begins reveal (3.8s) -> settles & develops (~5.8s)
        scrapbookStepTimers.push(setTimeout(() => {
            if (DOM.photoCard2) {
                DOM.photoCard2.classList.add('card-revealed');
                createScrapbookPetalBurst(DOM.photoCard2);
                createSparkleBurst(window.innerWidth * 0.5, window.innerHeight * 0.42);
            }
        }, 3800));

        // Step 3: Photo 3 begins reveal (6.8s) -> settles & develops (~8.8s)
        scrapbookStepTimers.push(setTimeout(() => {
            if (DOM.photoCard3) {
                DOM.photoCard3.classList.add('card-revealed');
                createScrapbookPetalBurst(DOM.photoCard3);
                createSparkleBurst(window.innerWidth * 0.65, window.innerHeight * 0.45);
            }
        }, 6800));

        // Step 4: All 3 Polaroids settled -> reveal Continue button with breathing room (10.2s)
        scrapbookStepTimers.push(setTimeout(() => {
            if (actions) {
                actions.classList.add('show-action');
            }
            createSparkleBurst(window.innerWidth / 2, window.innerHeight * 0.65);
        }, 10200));
    }

    // Flow 3: Photos -> Dessert Shop
    if (DOM.photo3NextBtn) {
        DOM.photo3NextBtn.addEventListener('click', () => {
            const rect = DOM.photo3NextBtn.getBoundingClientRect();
            createSparkleBurst(rect.left + rect.width / 2, rect.top + rect.height / 2);
            switchSection('dessert', () => {
                resetDessertScene();
            });
        });
    }

    // --------------------------------------------------------------------------
    // 5b. 🍩 Korean Dessert Shop Section Engine
    // --------------------------------------------------------------------------
    const dessertMessages = {
        milk: {
            title: 'Vanilla Milk 🥛',
            icon: '🥛',
            msg: 'Take things one day at a time, and remember to always be gentle with yourself. 🥛✨'
        },
        cake: {
            title: 'Strawberry Cake 🍰',
            icon: '🍰',
            msg: 'Celebrate your small wins along the way, not just the big milestones. 🍰🍓'
        },
        cookie: {
            title: 'Chocolate Chip Cookie 🍪',
            icon: '🍪',
            msg: 'The best things in life take time to make, so trust your own pace and journey. 🍪💕'
        },
        donut: {
            title: 'Sakura Glazed Donut 🍩',
            icon: '🍩',
            msg: 'A little reminder to enjoy the small things and appreciate the good moments in life. 🍩🌸'
        },
        cocoa: {
            title: 'Hot Chocolate ☕',
            icon: '☕',
            msg: 'Whenever things feel overwhelming, take a moment to pause, breathe, and rest. ☕☁️'
        }
    };

    function resetDessertScene() {
        if (state.dessertTimerIds) {
            state.dessertTimerIds.forEach(id => clearTimeout(id));
            state.dessertTimerIds = [];
        }
        state.selectedDessert = null;

        if (DOM.dessertItemBtns) {
            DOM.dessertItemBtns.forEach(btn => {
                btn.classList.remove('active-dessert');
                btn.setAttribute('aria-checked', 'false');
            });
        }

        if (DOM.dessertMsgPlaceholder) {
            DOM.dessertMsgPlaceholder.style.display = 'block';
        }
        if (DOM.dessertMsgContent) {
            DOM.dessertMsgContent.style.display = 'none';
        }
    }

    if (DOM.dessertItemBtns) {
        DOM.dessertItemBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const dessertKey = btn.getAttribute('data-dessert');
                const data = dessertMessages[dessertKey];
                if (!data) return;

                state.selectedDessert = dessertKey;

                // Highlight selected item
                DOM.dessertItemBtns.forEach(b => {
                    b.classList.remove('active-dessert');
                    b.setAttribute('aria-checked', 'false');
                });
                btn.classList.add('active-dessert');
                btn.setAttribute('aria-checked', 'true');

                // Sparkle burst at button
                const rect = btn.getBoundingClientRect();
                createSparkleBurst(rect.left + rect.width / 2, rect.top + rect.height / 2);

                // Update and animate message
                if (DOM.dessertMsgPlaceholder) {
                    DOM.dessertMsgPlaceholder.style.display = 'none';
                }
                if (DOM.dessertMsgContent) {
                    DOM.dessertMsgContent.style.display = 'flex';
                    DOM.dessertMsgContent.classList.remove('dessert-msg-animate');
                    void DOM.dessertMsgContent.offsetWidth;
                    DOM.dessertMsgContent.classList.add('dessert-msg-animate');
                }
                if (DOM.dessertMsgIcon) {
                    DOM.dessertMsgIcon.textContent = data.icon;
                }
                if (DOM.dessertMsgTitle) {
                    DOM.dessertMsgTitle.textContent = data.title;
                }
                if (DOM.dessertMsgText) {
                    DOM.dessertMsgText.textContent = data.msg;
                }
            });
        });
    }

    // Flow 4: Dessert Shop -> Cinematic Bouquet Animation Scene
    if (DOM.dessertToBouquetBtn) {
        DOM.dessertToBouquetBtn.addEventListener('click', () => {
            const rect = DOM.dessertToBouquetBtn.getBoundingClientRect();
            createSparkleBurst(rect.left + rect.width / 2, rect.top + rect.height / 2);
            switchSection('bouquet', () => {
                startBouquetCreationAnimation();
            });
        });
    }

    // --------------------------------------------------------------------------
    // 5c. Cinematic Bouquet Creation & Compliments Sequencing
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
        if (state.bouquetTimerIds) {
            state.bouquetTimerIds.forEach(id => clearTimeout(id));
            state.bouquetTimerIds = [];
        }

        if (DOM.bouquetWrapper) {
            DOM.bouquetWrapper.className = 'bouquet-wrapper';
        }
        if (DOM.cinnamorollContainer) {
            DOM.cinnamorollContainer.classList.remove('show');
        }
        if (DOM.bouquetBanner) {
            DOM.bouquetBanner.classList.remove('show');
        }

        if (DOM.floatingCompliments) {
            DOM.floatingCompliments.forEach(pill => {
                pill.classList.remove('show');
            });
        }
    }

    function addBouquetStep(delay, callback) {
        const id = setTimeout(callback, delay);
        state.bouquetTimerIds.push(id);
    }

    function triggerCompliment(index) {
        if (!DOM.floatingCompliments) return;
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
            if (DOM.bouquetWrapper) DOM.bouquetWrapper.classList.add('anim-stems');
        });

        // Step 2: Leaves unfold (0.9s)
        addBouquetStep(900, () => {
            if (DOM.bouquetWrapper) DOM.bouquetWrapper.classList.add('anim-leaves');
        });

        // Step 3: First flower blooms (1.6s) + Compliment 1
        addBouquetStep(1600, () => {
            if (DOM.bouquetWrapper) DOM.bouquetWrapper.classList.add('anim-f1');
            triggerCompliment(0);
        });

        // Step 4: Second flower blooms (2.2s) + Compliment 2
        addBouquetStep(2200, () => {
            if (DOM.bouquetWrapper) DOM.bouquetWrapper.classList.add('anim-f2');
            triggerCompliment(1);
        });

        // Step 5: Third flower blooms (2.8s) + Compliment 3
        addBouquetStep(2800, () => {
            if (DOM.bouquetWrapper) DOM.bouquetWrapper.classList.add('anim-f3');
            triggerCompliment(2);
        });

        // Step 6: Lotus flowers unfold gracefully (3.5s) + Compliment 4
        addBouquetStep(3500, () => {
            if (DOM.bouquetWrapper) DOM.bouquetWrapper.classList.add('anim-lotus');
            triggerCompliment(3);
        });

        // Step 7: Supporting blossoms & baby's breath (4.2s) + Compliment 5
        addBouquetStep(4200, () => {
            if (DOM.bouquetWrapper) DOM.bouquetWrapper.classList.add('anim-f4');
            triggerCompliment(4);
        });

        // Step 8: Satin Ribbon wraps around stems (4.9s)
        addBouquetStep(4900, () => {
            if (DOM.bouquetWrapper) DOM.bouquetWrapper.classList.add('anim-ribbon');
        });

        // Step 9: Orbiting sparkles appear (5.5s)
        addBouquetStep(5500, () => {
            if (DOM.bouquetWrapper) DOM.bouquetWrapper.classList.add('anim-sparkles');
        });

        // Step 10: Cinnamoroll companion enters presenting flowers (6.1s)
        addBouquetStep(6100, () => {
            if (DOM.cinnamorollContainer) DOM.cinnamorollContainer.classList.add('show');
        });

        // Step 11: Final settling breathe sway & reveal Wish button (6.9s)
        addBouquetStep(6900, () => {
            if (DOM.bouquetWrapper) DOM.bouquetWrapper.classList.add('completed');
            if (DOM.bouquetBanner) DOM.bouquetBanner.classList.add('show');
        });
    }

    // Flow 5: Bouquet -> Wish / Cake Section
    if (DOM.bouquetToWishBtn) {
        DOM.bouquetToWishBtn.addEventListener('click', () => {
            const rect = DOM.bouquetToWishBtn.getBoundingClientRect();
            createSparkleBurst(rect.left + rect.width / 2, rect.top + rect.height / 2);
            switchSection('wish', () => {
                startCakeAssemblyAnimation();
            });
        });
    }

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

        if (DOM.candle) DOM.candle.classList.add('extinguished');
        const cake = DOM.cake || document.getElementById('cake');
        if (cake) {
            cake.classList.add('extinguished');
        }
        createSmokeParticles();
        createSparkleBurst(window.innerWidth / 2, window.innerHeight * 0.38);

        // Pop in the Yay! Cinnamoroll sticker
        const yaySticker = document.getElementById('cinStickerYay');
        if (yaySticker) {
            setTimeout(() => {
                yaySticker.classList.add('cin-sticker-visible');
            }, 200);
        }

        setTimeout(() => {
            switchSection('finale', () => {
                startConfetti();
                startMemoryBoxAnimation();
            });
        }, 1400);
    }

    function createSmokeParticles() {
        if (!DOM.smokeParticles) return;
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

    if (DOM.candle) DOM.candle.addEventListener('click', extinguishCandle);
    if (DOM.flame) DOM.flame.addEventListener('click', extinguishCandle);

    // Interactive Letter Seal Tap
    const letterSeal = document.getElementById('letterSeal');
    if (letterSeal) {
        letterSeal.addEventListener('click', () => {
            const rect = letterSeal.getBoundingClientRect();
            createSparkleBurst(rect.left + rect.width / 2, rect.top + rect.height / 2);
        });
    }

    // Interactive Photo Tap Sparkles
    [DOM.photoCard1, DOM.photoCard2, DOM.photoCard3].forEach(card => {
        if (card) {
            card.addEventListener('click', (e) => {
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
    // 7b. Website-Wide Ambient Falling Cherry Blossoms (Sakura Engine)
    // --------------------------------------------------------------------------
    function initSakuraPetalsEngine() {
        const canvas = DOM.sakuraCanvas;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });

        const petalColors = [
            { c1: '#FFF5F8', c2: '#FFB7C5' },
            { c1: '#FFF0F5', c2: '#FFCCD5' },
            { c1: '#FFE5EC', c2: '#FFAFCC' },
            { c1: '#FFFFFF', c2: '#FF94B9' }
        ];

        const petalCount = width < 768 ? 16 : 24;

        function createPetal(randomY = false) {
            const colorPair = petalColors[Math.floor(Math.random() * petalColors.length)];
            return {
                x: Math.random() * width,
                y: randomY ? Math.random() * height : -25 - Math.random() * 20,
                size: Math.random() * 6 + 9,
                speedY: Math.random() * 0.7 + 0.65,
                speedX: (Math.random() - 0.5) * 0.5,
                windOffset: Math.random() * Math.PI * 2,
                windSpeed: Math.random() * 0.015 + 0.008,
                rotation: Math.random() * Math.PI * 2,
                rotSpeed: (Math.random() - 0.5) * 0.025,
                flip: Math.random() * Math.PI * 2,
                flipSpeed: Math.random() * 0.02 + 0.01,
                alpha: Math.random() * 0.35 + 0.45,
                color1: colorPair.c1,
                color2: colorPair.c2
            };
        }

        const petals = Array.from({ length: petalCount }, () => createPetal(true));

        function drawSakura() {
            ctx.clearRect(0, 0, width, height);

            petals.forEach(p => {
                p.windOffset += p.windSpeed;
                p.x += p.speedX + Math.sin(p.windOffset) * 0.85;
                p.y += p.speedY;
                p.rotation += p.rotSpeed;
                p.flip += p.flipSpeed;

                if (p.y > height + 25 || p.x < -30 || p.x > width + 30) {
                    Object.assign(p, createPetal(false));
                }

                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate(p.rotation);
                const scaleX = Math.cos(p.flip);
                ctx.scale(scaleX, 1);
                ctx.globalAlpha = p.alpha;

                // Organic cherry blossom petal shape with delicate cleft notch
                ctx.beginPath();
                ctx.moveTo(0, -p.size);
                ctx.bezierCurveTo(p.size * 0.75, -p.size * 0.7, p.size * 0.85, p.size * 0.4, 0, p.size);
                ctx.bezierCurveTo(-p.size * 0.85, p.size * 0.4, -p.size * 0.75, -p.size * 0.7, 0, -p.size);

                const grad = ctx.createLinearGradient(0, -p.size, 0, p.size);
                grad.addColorStop(0, p.color1);
                grad.addColorStop(1, p.color2);
                ctx.fillStyle = grad;
                ctx.fill();

                // Center subtle delicate vein
                ctx.beginPath();
                ctx.moveTo(0, -p.size * 0.65);
                ctx.lineTo(0, p.size * 0.65);
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
                ctx.lineWidth = 0.75;
                ctx.stroke();

                ctx.restore();
            });

            ctx.globalAlpha = 1.0;
            requestAnimationFrame(drawSakura);
        }
        drawSakura();
    }
    initSakuraPetalsEngine();

    // --------------------------------------------------------------------------
    // 8. Confetti Canvas Engine
    // --------------------------------------------------------------------------
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
    // 8b. Finale Animation Engine (Greetings from Cinnamoroll)
    // --------------------------------------------------------------------------
    function clearMemoryBoxTimers() {
        if (state.memoryBoxTimerIds) {
            state.memoryBoxTimerIds.forEach(id => clearTimeout(id));
            state.memoryBoxTimerIds = [];
        }
    }

    function addMemoryBoxStep(delay, callback) {
        const id = setTimeout(callback, delay);
        state.memoryBoxTimerIds = state.memoryBoxTimerIds || [];
        state.memoryBoxTimerIds.push(id);
    }

    function resetMemoryBoxScene() {
        clearMemoryBoxTimers();
        const stage = document.getElementById('memoryBoxStage');
        if (stage) {
            stage.className = 'memory-box-stage';
        }
    }

    function startMemoryBoxAnimation() {
        resetMemoryBoxScene();
        const stage = document.getElementById('memoryBoxStage');
        if (!stage) return;

        // Step 1: Illustration smoothly appears & warm glow activates (0.1s)
        addMemoryBoxStep(100, () => {
            stage.classList.add('box-stage-active');
            createSparkleBurst(window.innerWidth / 2, window.innerHeight * 0.40);
        });

        // Step 2: Sentimental message smoothly reveals (1.2s)
        addMemoryBoxStep(1200, () => {
            stage.classList.add('finale-message-visible');
        });

        // Step 3: "The End ♡" and Return to Start button appear (2.2s)
        addMemoryBoxStep(2200, () => {
            stage.classList.add('finale-end-visible');
            createSparkleBurst(window.innerWidth / 2, window.innerHeight * 0.65);
        });
    }

    // Return to Start Button Handler
    if (DOM.homeButton) {
        DOM.homeButton.addEventListener('click', () => {
            confettiActive = false;
            resetMemoryBoxScene();

            state.currentSection = 'landing';
            state.sectionHistory = ['landing'];
            state.candleBlown = false;

            // Reset candle & cake states
            if (DOM.candle) {
                DOM.candle.classList.remove('extinguished');
            }
            const cake = DOM.cake || document.getElementById('cake');
            if (cake) {
                cake.className = 'cake';
            }
            if (state.cakeTimerIds) {
                state.cakeTimerIds.forEach(id => clearTimeout(id));
                state.cakeTimerIds = [];
            }
            if (DOM.wishHint) {
                DOM.wishHint.classList.remove('show-hint');
            }

            // Reset bouquet
            resetBouquetScene();

            // Reset dessert
            resetDessertScene();

            // Reset photos
            clearScrapbookTimers();
            const photoCards = [DOM.photoCard1, DOM.photoCard2, DOM.photoCard3];
            photoCards.forEach(c => {
                if (c) c.classList.remove('card-revealed');
            });
            const scrapbookActions = document.getElementById('scrapbookActions');
            if (scrapbookActions) {
                scrapbookActions.classList.remove('show-action');
            }

            // Reset Cinnamoroll stickers
            const yaySticker = document.getElementById('cinStickerYay');
            if (yaySticker) {
                yaySticker.classList.remove('cin-sticker-visible');
            }

            // Hide back button on landing
            updateNavBackButton();

            // Smooth transition back to Start/Landing
            switchSection('landing');
            showToast('Welcome back to the start! 💌🌸');
        });
    }

    function showToast(message) {
        if (!DOM.toast) return;
        DOM.toast.textContent = message;
        DOM.toast.classList.add('show');
        setTimeout(() => {
            DOM.toast.classList.remove('show');
        }, 3000);
    }
});
