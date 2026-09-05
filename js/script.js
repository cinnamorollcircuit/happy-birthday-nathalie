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
        collageTimerIds: [],
        dessertTimerIds: [],
        bouquetTimerIds: [],
        bouquetCompleted: false,
        bouquetFlowerClicked: false,
        cakeTimerIds: [],
        memoryBoxTimerIds: [],
        environmentTimers: [],
        starFinaleTimers: [],
        activatedStars: new Set(),
        lastClickedStarIndex: null,
        hintDismissed: false,
        idleGuidanceTimer: null,
        constellationCompleted: false,
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
            collage: document.getElementById('collage'),
            dessert: document.getElementById('dessert'),
            bouquet: document.getElementById('bouquet'),
            wish: document.getElementById('wish'),
            finale: document.getElementById('finale'),
            'letter-finale': document.getElementById('letter-finale')
        },
        navBackBtn: document.getElementById('navBackBtn'),
        startButton: document.getElementById('startButton'),
        nextToPhotosBtn: document.getElementById('nextToPhotosBtn'),

        // Single Photo Stage Cards & Buttons
        photoCard1: document.getElementById('photoCard1'),
        photoCard2: document.getElementById('photoCard2'),
        photoCard3: document.getElementById('photoCard3'),
        photo3NextBtn: document.getElementById('photo3NextBtn'),

        // Handmade Pink Scrapbook Collage Elements
        scrapbookPageCanvas: document.getElementById('scrapbookPageCanvas'),
        scrapbookBlueHeart: document.getElementById('scrapbookBlueHeart'),
        scrapbookPhotoWrap: document.getElementById('scrapbookPhotoWrap'),
        scrapbookWordsScatter: document.getElementById('scrapbookWordsScatter'),
        scrapbookFlowerDoodles: document.getElementById('scrapbookFlowerDoodles'),
        collageActions: document.getElementById('collageActions'),
        collageToDessertBtn: document.getElementById('collageToDessertBtn'),

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
        bouquetNoteCard: document.getElementById('bouquetNoteCard'),
        bouquetToWishBtn: document.getElementById('bouquetToWishBtn'),
        floatingPetals: document.getElementById('floatingPetals'),
        bouquetStardust: document.getElementById('bouquetStardust'),

        // Cake Elements
        candle: document.getElementById('candle'),
        flame: document.getElementById('flame'),
        smokeParticles: document.getElementById('smokeParticles'),
        wishHint: document.getElementById('wishHint'),

        // Music Controller Elements
        musicPlayerWidget: document.getElementById('musicPlayerWidget'),
        musicPlayerCard: document.getElementById('musicPlayerCard'),
        musicCollapsedBtn: document.getElementById('musicCollapsedBtn'),
        musicCollapseBtn: document.getElementById('musicCollapseBtn'),
        musicPlayPauseBtn: document.getElementById('musicPlayPauseBtn'),
        musicPlayIcon: document.getElementById('musicPlayIcon'),
        musicPrevBtn: document.getElementById('musicPrevBtn'),
        musicNextBtn: document.getElementById('musicNextBtn'),
        musicMuteBtn: document.getElementById('musicMuteBtn'),
        musicMuteIcon: document.getElementById('musicMuteIcon'),
        musicProgressBar: document.getElementById('musicProgressBar'),
        musicProgressFill: document.getElementById('musicProgressFill'),
        musicCurrentTime: document.getElementById('musicCurrentTime'),
        musicTotalTime: document.getElementById('musicTotalTime'),

        // Dialog & Canvas
        homeButton: document.getElementById('homeButton'),
        virgoMessageContinue: document.getElementById('virgoMessageContinue'),
        toast: document.getElementById('toast'),
        particlesCanvas: document.getElementById('particlesCanvas'),
        sakuraCanvas: document.getElementById('sakuraCanvas'),
        confettiCanvas: document.getElementById('confettiCanvas')
    };

    // --------------------------------------------------------------------------
    // 2. HTML5 Audio Control (`assets/audio/birthday.mp3`) & Floating Widget
    // --------------------------------------------------------------------------
    let isAudioUnlocked = false;
    let isSeeking = false;

    function formatTime(seconds) {
        if (isNaN(seconds) || seconds === Infinity) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }

    function updateMusicUI() {
        if (!bgAudio) return;
        const isPaused = bgAudio.paused;
        const isMuted = bgAudio.muted;

        const widget = DOM.musicPlayerWidget || DOM.musicController;
        if (widget) {
            if (!isPaused) {
                widget.classList.add('is-playing');
            } else {
                widget.classList.remove('is-playing');
            }
        }

        // Play / Pause Icon & Attributes
        if (DOM.musicPlayIcon) {
            const playSvg = DOM.musicPlayIcon.querySelector('.icon-play');
            const pauseSvg = DOM.musicPlayIcon.querySelector('.icon-pause');
            if (playSvg && pauseSvg) {
                playSvg.style.display = isPaused ? 'block' : 'none';
                pauseSvg.style.display = isPaused ? 'none' : 'block';
            } else {
                DOM.musicPlayIcon.textContent = isPaused ? '▶' : '❚❚';
            }
        }
        if (DOM.musicPlayPauseBtn) {
            DOM.musicPlayPauseBtn.setAttribute('aria-label', isPaused ? 'Play background music' : 'Pause background music');
            DOM.musicPlayPauseBtn.title = isPaused ? 'Play' : 'Pause';
        }

        // Mute / Unmute Icon & Attributes
        if (DOM.musicMuteIcon) {
            const unmutedSvg = DOM.musicMuteIcon.querySelector('.icon-unmuted');
            const mutedSvg = DOM.musicMuteIcon.querySelector('.icon-muted');
            if (unmutedSvg && mutedSvg) {
                unmutedSvg.style.display = isMuted ? 'none' : 'block';
                mutedSvg.style.display = isMuted ? 'block' : 'none';
            } else {
                DOM.musicMuteIcon.textContent = isMuted ? '🔇' : '🔊';
            }
        }
        if (DOM.musicMuteBtn) {
            DOM.musicMuteBtn.setAttribute('aria-label', isMuted ? 'Unmute background music' : 'Mute background music');
            DOM.musicMuteBtn.title = isMuted ? 'Unmute' : 'Mute';
        }

        // Progress Bar & Time Labels
        if (!isSeeking && DOM.musicProgressBar && DOM.musicProgressFill) {
            const curTime = bgAudio.currentTime || 0;
            const dur = bgAudio.duration || 0;
            const percent = dur > 0 ? (curTime / dur) * 100 : 0;
            DOM.musicProgressFill.style.width = `${percent}%`;
            DOM.musicProgressBar.setAttribute('aria-valuenow', Math.round(percent).toString());

            if (DOM.musicCurrentTime) {
                DOM.musicCurrentTime.textContent = formatTime(curTime);
            }
            if (DOM.musicTotalTime && dur > 0) {
                DOM.musicTotalTime.textContent = formatTime(dur);
            }
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

    if (DOM.musicPrevBtn) {
        DOM.musicPrevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (!bgAudio) return;
            bgAudio.currentTime = 0;
            if (bgAudio.paused) {
                bgAudio.play().then(() => {
                    state.musicPlaying = true;
                    updateMusicUI();
                }).catch(() => {});
            } else {
                updateMusicUI();
            }
            const rect = DOM.musicPrevBtn.getBoundingClientRect();
            createSparkleBurst(rect.left + rect.width / 2, rect.top + rect.height / 2);
        });
    }

    if (DOM.musicNextBtn) {
        DOM.musicNextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (!bgAudio) return;
            bgAudio.currentTime = 0;
            if (bgAudio.paused) {
                bgAudio.play().then(() => {
                    state.musicPlaying = true;
                    updateMusicUI();
                }).catch(() => {});
            } else {
                updateMusicUI();
            }
            const rect = DOM.musicNextBtn.getBoundingClientRect();
            createSparkleBurst(rect.left + rect.width / 2, rect.top + rect.height / 2);
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

    // Collapse / Expand Toggle Handlers
    if (DOM.musicCollapseBtn && DOM.musicPlayerWidget) {
        DOM.musicCollapseBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            DOM.musicPlayerWidget.classList.add('is-collapsed');
        });
    }

    if (DOM.musicCollapsedBtn && DOM.musicPlayerWidget) {
        DOM.musicCollapsedBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            DOM.musicPlayerWidget.classList.remove('is-collapsed');
            const rect = DOM.musicCollapsedBtn.getBoundingClientRect();
            createSparkleBurst(rect.left + rect.width / 2, rect.top + rect.height / 2);
        });
    }

    // Progress bar seeking interaction
    function seekFromEvent(e) {
        if (!bgAudio || !DOM.musicProgressBar) return;
        const rect = DOM.musicProgressBar.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const pos = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
        if (bgAudio.duration) {
            bgAudio.currentTime = pos * bgAudio.duration;
            if (DOM.musicProgressFill) {
                DOM.musicProgressFill.style.width = `${pos * 100}%`;
            }
            if (DOM.musicCurrentTime) {
                DOM.musicCurrentTime.textContent = formatTime(bgAudio.currentTime);
            }
        }
    }

    if (DOM.musicProgressBar) {
        DOM.musicProgressBar.addEventListener('pointerdown', (e) => {
            e.stopPropagation();
            isSeeking = true;
            seekFromEvent(e);

            const onPointerMove = (ev) => {
                if (isSeeking) {
                    seekFromEvent(ev);
                }
            };
            const onPointerUp = () => {
                isSeeking = false;
                window.removeEventListener('pointermove', onPointerMove);
                window.removeEventListener('pointerup', onPointerUp);
            };

            window.addEventListener('pointermove', onPointerMove);
            window.addEventListener('pointerup', onPointerUp);
        });
    }

    if (bgAudio) {
        bgAudio.addEventListener('play', updateMusicUI);
        bgAudio.addEventListener('pause', updateMusicUI);
        bgAudio.addEventListener('volumechange', updateMusicUI);
        bgAudio.addEventListener('timeupdate', updateMusicUI);
        bgAudio.addEventListener('loadedmetadata', updateMusicUI);
        bgAudio.addEventListener('durationchange', updateMusicUI);
    }

    // 3. Magical Sparkle Particle Burst Engine (Playful & Randomized)
    
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

    function clearSparkleBursts() {
        const container = document.querySelector('.sparkle-burst-container');
        if (container) {
            container.innerHTML = '';
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
        'collage': 'photos',
        'dessert': 'collage',
        'bouquet': 'dessert',
        'wish': 'bouquet',
        'finale': 'wish',
        'letter-finale': 'finale'
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
                updateEnvironment(targetSectionId);
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
            updateEnvironment(targetSectionId);
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
        } else if (current === 'collage') {
            resetCollageScene();
        } else if (current === 'dessert') {
            resetDessertScene();
        } else if (current === 'bouquet') {
            resetBouquetScene();
        } else if (current === 'wish') {
            resetCakeScene();
        } else if (current === 'finale') {
            cleanupAllParticles();
            resetMemoryBoxScene();
        } else if (current === 'letter-finale') {
            // When backing away from letter-finale, reset its reveal stage
            const revealStage = document.getElementById('finaleRevealStage');
            if (revealStage) {
                revealStage.classList.remove('reveal-visible');
                revealStage.setAttribute('aria-hidden', 'true');
            }
            const actionWrap = document.getElementById('finaleActionWrap');
            if (actionWrap) actionWrap.classList.remove('action-visible');
        }

        // Setup destination section when returning
        const onEnter = () => {
            if (target === 'photos') {
                startScrapbookSequentialReveal();
            } else if (target === 'collage') {
                startCollageAnimation();
            } else if (target === 'dessert') {
                initCafeScene();
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
            } else if (target === 'finale') {
                // If constellation was completed, restore its completed visual state
                if (state.constellationCompleted) {
                    const stage = document.getElementById('constellationStage');
                    if (stage) {
                        stage.classList.add('step1-brighten', 'step2-pulse', 'constellation-completed', 'constellation-settled');
                    }
                    const msgStage = document.getElementById('virgoMessageStage');
                    if (msgStage) {
                        msgStage.style.display = 'flex';
                        msgStage.classList.add('virgo-msg-visible');
                        msgStage.setAttribute('aria-hidden', 'false');
                        const continueWrap = document.getElementById('virgoMsgContinueWrap');
                        if (continueWrap) continueWrap.classList.add('continue-btn-visible');
                    }
                }
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

    // Flow 3: Photos -> Handmade Scrapbook Collage
    if (DOM.photo3NextBtn) {
        DOM.photo3NextBtn.addEventListener('click', () => {
            const rect = DOM.photo3NextBtn.getBoundingClientRect();
            createSparkleBurst(rect.left + rect.width / 2, rect.top + rect.height / 2);
            switchSection('collage', () => {
                startCollageAnimation();
            });
        });
    }

    // Flow 3b: Scrapbook Collage -> Birthday Café
    if (DOM.collageToDessertBtn) {
        DOM.collageToDessertBtn.addEventListener('click', () => {
            const rect = DOM.collageToDessertBtn.getBoundingClientRect();
            createSparkleBurst(rect.left + rect.width / 2, rect.top + rect.height / 2);
            switchSection('dessert', () => {
                initCafeScene();
            });
        });
    }

    // --------------------------------------------------------------------------
    // 5b. 🎀 Handmade Pink Scrapbook Collage Animation Engine
    // --------------------------------------------------------------------------
    function clearCollageTimers() {
        if (state.collageTimerIds) {
            state.collageTimerIds.forEach(id => clearTimeout(id));
            state.collageTimerIds = [];
        }
    }

    function addCollageStep(delay, callback) {
        const id = setTimeout(callback, delay);
        state.collageTimerIds = state.collageTimerIds || [];
        state.collageTimerIds.push(id);
    }

    function resetCollageScene() {
        clearCollageTimers();
        if (DOM.scrapbookPageCanvas) {
            DOM.scrapbookPageCanvas.classList.remove('page-visible');
        }
        if (DOM.scrapbookBlueHeart) {
            DOM.scrapbookBlueHeart.classList.remove('heart-visible');
        }
        if (DOM.scrapbookPhotoWrap) {
            DOM.scrapbookPhotoWrap.classList.remove('photo-visible');
        }
        if (DOM.scrapbookWordsScatter) {
            const words = DOM.scrapbookWordsScatter.querySelectorAll('.scrapbook-word-scrap');
            words.forEach(w => w.classList.remove('word-visible'));
        }
        if (DOM.scrapbookFlowerDoodles) {
            DOM.scrapbookFlowerDoodles.classList.remove('doodles-visible');
        }
        if (DOM.collageActions) {
            DOM.collageActions.classList.remove('show-action');
        }
    }

    function startCollageAnimation() {
        resetCollageScene();

        // Phase 1: 0.00s — Pink Crumpled Paper Canvas gently fades in
        addCollageStep(50, () => {
            if (DOM.scrapbookPageCanvas) {
                DOM.scrapbookPageCanvas.classList.add('page-visible');
                createSparkleBurst(window.innerWidth / 2, window.innerHeight * 0.45);
            }
        });

        // Phase 2: 0.50s — Blue Paper Heart gently appears & settles
        addCollageStep(500, () => {
            if (DOM.scrapbookBlueHeart) {
                DOM.scrapbookBlueHeart.classList.add('heart-visible');
                createSparkleBurst(window.innerWidth / 2, window.innerHeight * 0.42);
            }
        });

        // Phase 3: 1.20s — Photo cutout slowly develops/fades into place
        addCollageStep(1200, () => {
            if (DOM.scrapbookPhotoWrap) {
                DOM.scrapbookPhotoWrap.classList.add('photo-visible');
                createSparkleBurst(window.innerWidth / 2, window.innerHeight * 0.42);
            }
        });

        // Phase 4: 1.80s onward — Handwritten paper words reveal one by one
        const wordScraps = DOM.scrapbookWordsScatter ? DOM.scrapbookWordsScatter.querySelectorAll('.scrapbook-word-scrap') : [];
        wordScraps.forEach((word, idx) => {
            addCollageStep(1800 + idx * 220, () => {
                word.classList.add('word-visible');
            });
        });

        // Phase 5: 4.20s — Flower doodles appear as the final decorative touches
        addCollageStep(4200, () => {
            if (DOM.scrapbookFlowerDoodles) {
                DOM.scrapbookFlowerDoodles.classList.add('doodles-visible');
                createSparkleBurst(window.innerWidth * 0.35, window.innerHeight * 0.35);
                createSparkleBurst(window.innerWidth * 0.65, window.innerHeight * 0.55);
            }
        });

        // Phase 6: 5.00s — Reveal Continue button with comfortable breathing room
        addCollageStep(5000, () => {
            if (DOM.collageActions) {
                DOM.collageActions.classList.add('show-action');
                createSparkleBurst(window.innerWidth / 2, window.innerHeight * 0.70);
            }
        });
    }

    // --------------------------------------------------------------------------
    // 5c. ☕ "A Little Birthday Café" — Dessert Section Engine
    // --------------------------------------------------------------------------

    // ── Data: per-treat content and note style ──
    const cafeData = {
        chocolate: {
            noteStyle:  'sticky-note',
            noteHeader: 'Chocolate 🍫',
            noteBody:   'If today feels heavy, I hope this gives you pause and breath. You don’t have to know everything right now.',
            doodle:     '🍫',
            cinnaImg:   'assets/images/cin_xie_xie.png',
            cinnaAlt:   'Cinnamoroll sending a cozy hug'
        },
        cookie: {
            noteStyle:  'folded-note',
            noteHeader: 'Cookie 🍪',
            noteBody:   'If you ever need to hear it, you truly deserve to be appreciated. Even in the smallest ways, your presence makes a difference, more than you might realize.',
            doodle:     '🍪',
            cinnaImg:   'assets/images/cin_cookie.png',
            cinnaAlt:   'Cinnamoroll holding a heart cookie'
        },
        shortcake: {
            noteStyle:  'torn-paper',
            noteHeader: 'Strawberry Shortcake 🍓',
            noteBody:   'I hope this year brings you many small things to look forward to happiness, gentle surprises, and memories you’ll want to keep close for a long time.',
            doodle:     '🍓',
            cinnaImg:   'assets/images/cin_dessert.png',
            cinnaAlt:   'Cinnamoroll with strawberries'
        },
        cake: {
            noteStyle:  'washi-card',
            noteHeader: 'Birthday Cake 🍰',
            noteBody:   'Today is yours, and I hope you let yourself enjoy it. Reaching this point is already something worth celebrating.',
            doodle:     '🍰',
            cinnaImg:   'assets/images/cin_bday_cake.png',
            cinnaAlt:   'Cinnamoroll celebrating Nathalie’s birthday'
        },
        cupcake: {
            noteStyle:  'heart-tag',
            noteHeader: 'Cupcake 🧁',
            noteBody:   'This isn’t anything big, just a reminder to smile today. I hope something gentle and unexpected finds its way to you, even if it’s only a small thing.',
            doodle:     '🧁',
            cinnaImg:   'assets/images/cin_wand.png',
            cinnaAlt:   'Cinnamoroll cheering with a star wand'
        },
        drink: {
            noteStyle:  'paper-strip',
            noteHeader: 'Birthday Drink 🧋',
            noteBody:   'When life feels busy, I hope you remember to slow down now and then. Maybe take a moment with your favorite drink, and let yourself rest.',
            doodle:     '🧋',
            cinnaImg:   'assets/images/cin_dancing.png',
            cinnaAlt:   'Cinnamoroll relaxing with floating hearts'
        }
    };

    // ── Café state ──
    let cafeFoundTreats   = new Set();
    let cafeActiveTreat   = null;
    let cafeNotePanel     = null;
    let cafeEntranceDone  = false;
    let cafeAmbientTimers = [];
    const TOTAL_TREATS    = Object.keys(cafeData).length;

    // ── DOM references ──
    function getCafeEls() {
        return {
            entrance:      document.getElementById('cafeEntrance'),
            scene:         document.getElementById('cafeScene'),
            particles:     document.getElementById('cafeEntranceParticles'),
            note:          document.getElementById('cafeNotePanel'),
            continueWrap:  document.getElementById('cafeContinueWrap'),
            continueBtn:   document.getElementById('dessertToBouquetBtn'),
            hint:          document.getElementById('cafeDiscoveryHint'),
            ambient:       document.getElementById('cafeAmbient'),
            treats:        document.querySelectorAll('.cafe-treat')
        };
    }

    // ── Init: called when dessert section is entered ──
    function initCafeScene() {
        const els = getCafeEls();
        if (!els.entrance) return;

        cafeEntranceDone = false;
        cafeFoundTreats  = new Set();
        cafeActiveTreat  = null;

        // Reset scene visibility & Continue button state (hidden initially)
        if (els.scene)        { els.scene.style.display = 'block'; els.scene.classList.remove('scene-visible', 'scene-note-active'); }
        if (els.continueWrap) { els.continueWrap.style.display = 'none'; els.continueWrap.classList.remove('show-continue'); }
        if (els.continueBtn)  { els.continueBtn.classList.remove('all-found-pulse'); }
        if (els.note)         { els.note.style.display = 'none'; els.note.innerHTML = ''; }
        if (els.hint)         { els.hint.classList.remove('hint-fade'); }
        document.body.classList.remove('cafe-golden-hour');

        // Reset all treat states
        els.treats.forEach(btn => {
            btn.classList.remove('treat-active', 'treat-found', 'treat-animating');
            btn.setAttribute('aria-pressed', 'false');
        });

        // Phase 1 — Show entrance sign
        els.entrance.style.display = 'flex';
        els.entrance.classList.remove('entrance-visible', 'entrance-hiding');
        void els.entrance.offsetWidth;

        // Spawn entrance dust particles
        spawnEntranceParticles(els.particles);

        // Fade entrance in
        const t1 = setTimeout(() => {
            els.entrance.classList.add('entrance-visible');
        }, 80);

        // Phase 2 — After 2.6s, hide entrance, reveal scene
        const t2 = setTimeout(() => {
            els.entrance.classList.add('entrance-hiding');
            const t3 = setTimeout(() => {
                els.entrance.style.display = 'none';
                if (els.scene) {
                    els.scene.classList.add('scene-visible');
                }
                cafeEntranceDone = true;
                startCafeAmbient(els.ambient);
                // Attach treat click listeners
                attachTreatListeners(els);
            }, 700);
            state.dessertTimerIds.push(t3);
        }, 2600);

        state.dessertTimerIds.push(t1, t2);
    }

    // ── Spawn tiny floating particles during entrance ──
    function spawnEntranceParticles(container) {
        if (!container) return;
        container.innerHTML = '';
        const icons = ['✨', '♡', '🌸', '⭐', '💕', '🎀'];
        for (let i = 0; i < 12; i++) {
            const el = document.createElement('span');
            el.className = 'cafe-dust-particle';
            el.textContent = icons[i % icons.length];
            el.style.left = (10 + Math.random() * 80) + '%';
            el.style.top  = (20 + Math.random() * 55) + '%';
            el.style.animationDelay = (i * 0.22) + 's';
            el.style.fontSize = (0.55 + Math.random() * 0.45) + 'rem';
            container.appendChild(el);
        }
    }

    // ── Ambient micro-animations ──
    function startCafeAmbient(container) {
        if (!container) return;
        container.innerHTML = '';
        stopCafeAmbient();

        const spawnAmbient = () => {
            if (!document.getElementById('cafeAmbient')) return;
            const type = Math.random() < 0.45 ? 'heart' : (Math.random() < 0.5 ? 'dust' : 'sparkle');
            const el = document.createElement('span');

            if (type === 'heart') {
                el.className = 'ambient-heart';
                el.textContent = '♡';
            } else if (type === 'sparkle') {
                el.className = 'ambient-sparkle ambient-particle';
            } else {
                el.className = 'ambient-particle';
                el.style.width  = (2 + Math.random() * 3) + 'px';
                el.style.height = el.style.width;
                el.style.background = `rgba(${180 + Math.floor(Math.random()*60)},${120 + Math.floor(Math.random()*60)},${80 + Math.floor(Math.random()*60)},0.35)`;
            }

            el.style.left   = (8 + Math.random() * 84) + '%';
            el.style.top    = (30 + Math.random() * 55) + '%';
            const dur = 4 + Math.random() * 4;
            el.style.animationDuration = dur + 's';
            el.style.animationDelay    = (Math.random() * 1.5) + 's';
            container.appendChild(el);

            const cleanup = setTimeout(() => el.remove(), (dur + 2) * 1000);
            cafeAmbientTimers.push(cleanup);
        };

        // Spawn periodically
        const interval = setInterval(spawnAmbient, 900);
        cafeAmbientTimers.push(interval);
        // Initial burst
        for (let i = 0; i < 4; i++) spawnAmbient();
    }

    function stopCafeAmbient() {
        cafeAmbientTimers.forEach(id => { clearTimeout(id); clearInterval(id); });
        cafeAmbientTimers = [];
    }

    // ── Attach click listeners to treat buttons ──
    function attachTreatListeners(els) {
        els.treats.forEach(btn => {
            btn.onclick = (e) => {
                e.stopPropagation();
                if (!cafeEntranceDone) return;
                const treatKey = btn.getAttribute('data-treat');
                if (!cafeData[treatKey]) return;
                handleTreatClick(treatKey, btn, els);
            };
        });

        // Click on note to dismiss
        if (els.note) {
            els.note.onclick = (e) => {
                e.stopPropagation();
                dismissNote(els);
            };
        }

        // Click on scene background dismisses note
        const scene = els.scene;
        if (scene) {
            scene.onclick = (e) => {
                if (!e.target.closest('.cafe-treat') && !e.target.closest('.cafe-note-panel') && !e.target.closest('#dessertToBouquetBtn')) {
                    dismissNote(els);
                }
            };
        }
    }

    // ── Handle treat click ──
    function handleTreatClick(treatKey, btn, els) {
        const data = cafeData[treatKey];
        if (!data) return;

        // Deactivate previous treat
        if (cafeActiveTreat && cafeActiveTreat !== treatKey) {
            const prevBtn = document.querySelector(`.cafe-treat[data-treat="${cafeActiveTreat}"]`);
            if (prevBtn) prevBtn.classList.remove('treat-active');
        }

        // Toggle: clicking same treat again closes the note
        if (cafeActiveTreat === treatKey && els.note && els.note.style.display !== 'none') {
            dismissNote(els);
            btn.classList.remove('treat-active');
            cafeActiveTreat = null;
            return;
        }

        cafeActiveTreat = treatKey;

        // Mark treat active + trigger soft lift animation
        btn.classList.add('treat-active', 'treat-animating');
        btn.setAttribute('aria-pressed', 'true');
        setTimeout(() => btn.classList.remove('treat-animating'), 800);

        // Mark as found / opened
        if (!cafeFoundTreats.has(treatKey)) {
            cafeFoundTreats.add(treatKey);
            btn.classList.add('treat-found');
            // Sparkle burst at treat position
            const rect = btn.getBoundingClientRect();
            createSparkleBurst(rect.left + rect.width / 2, rect.top + rect.height / 2);
        }

        // 🌟 RULE: As soon as at least 1 treat is opened, make the Continue button visible & enabled
        if (cafeFoundTreats.size >= 1 && els.continueWrap) {
            els.continueWrap.style.display = 'flex';
            requestAnimationFrame(() => {
                if (els.continueWrap) {
                    els.continueWrap.classList.add('show-continue');
                }
            });
        }

        // Fade hint once first treat is found
        if (els.hint && cafeFoundTreats.size === 1) {
            const t = setTimeout(() => els.hint.classList.add('hint-fade'), 800);
            state.dessertTimerIds.push(t);
        }

        // Show note normally
        showNote(treatKey, data, els);

        // 🌟 RULE: When ALL treats are opened, activate warm golden atmosphere, but STAY in Cafe section!
        // DO NOT auto-advance, do not auto-scroll, do not use a timer to leave.
        if (cafeFoundTreats.size >= TOTAL_TREATS) {
            document.body.classList.add('cafe-golden-hour');
            if (els.continueBtn) {
                els.continueBtn.classList.add('all-found-pulse');
            }
        }
    }

    // ── Build and show the handmade note with Cinnamoroll helper ──
    function showNote(treatKey, data, els) {
        if (!els.note) return;

        if (els.scene) {
            els.scene.classList.add('scene-note-active');
        }

        // Dismiss previous with closing animation
        if (els.note.style.display !== 'none' && els.note.innerHTML !== '') {
            els.note.classList.add('note-closing');
            setTimeout(() => {
                buildNote(treatKey, data, els);
            }, 280);
        } else {
            buildNote(treatKey, data, els);
        }
    }

    function buildNote(treatKey, data, els) {
        if (!els.note) return;

        const noteStyle = data.noteStyle;

        els.note.style.display = 'block';
        els.note.classList.remove('note-closing');

        // Tape element
        const tapeHTML = '<div class="note-tape" aria-hidden="true"></div>';

        // Doodle & Cinnamoroll helper
        const cinnaImg = data.cinnaImg || 'assets/images/cin_cookie.png';
        const cinnaAlt = data.cinnaAlt || 'Cinnamoroll helper';

        els.note.innerHTML = `
            <div class="cafe-note note-${noteStyle}" role="note" aria-label="${data.noteHeader}">
                ${tapeHTML}
                <div class="note-header-wrap">
                    <span class="note-tag-pill">Happy Birthday Nathalie</span>
                    <h3 class="note-header">${data.noteHeader}</h3>
                </div>
                <div class="note-body-wrap">
                    <p class="note-body">${data.noteBody}</p>
                </div>
                <div class="note-footer-wrap">
                    <span class="note-close-hint">Tap anywhere to close ♡</span>
                </div>
                <div class="note-cinna-companion" aria-hidden="true">
                    <img class="note-cinna-img" src="${cinnaImg}" alt="${cinnaAlt}" draggable="false">
                </div>
            </div>
        `;

        // Force re-animation
        void els.note.offsetWidth;
        els.note.style.animation = 'none';
        void els.note.offsetWidth;
        els.note.style.animation = '';
    }

    // ── Dismiss the active note ──
    function dismissNote(els) {
        if (!els || !els.note || els.note.style.display === 'none') return;
        if (els.scene) {
            els.scene.classList.remove('scene-note-active');
        }
        els.note.classList.add('note-closing');
        setTimeout(() => {
            if (els.note) {
                els.note.style.display = 'none';
                els.note.innerHTML     = '';
                els.note.classList.remove('note-closing');
            }
        }, 380);

        // Deactivate the active treat button
        if (cafeActiveTreat) {
            const prevBtn = document.querySelector(`.cafe-treat[data-treat="${cafeActiveTreat}"]`);
            if (prevBtn) {
                prevBtn.classList.remove('treat-active');
                prevBtn.setAttribute('aria-pressed', 'false');
            }
            cafeActiveTreat = null;
        }
    }

    function resetDessertScene() {
        // Clear timers
        if (state.dessertTimerIds) {
            state.dessertTimerIds.forEach(id => clearTimeout(id));
            state.dessertTimerIds = [];
        }

        // Stop ambient
        stopCafeAmbient();

        // Reset state
        cafeFoundTreats  = new Set();
        cafeActiveTreat  = null;
        cafeEntranceDone = false;

        // Reset DOM
        const els = getCafeEls();
        if (els.entrance)     { els.entrance.style.display = 'none'; els.entrance.classList.remove('entrance-visible', 'entrance-hiding'); }
        if (els.scene)        { els.scene.classList.remove('scene-visible'); }
        if (els.continueWrap) { els.continueWrap.style.display = 'none'; els.continueWrap.classList.remove('show-continue'); }
        if (els.continueBtn)  { els.continueBtn.classList.remove('all-found-pulse'); }
        if (els.note)         { els.note.style.display = 'none'; els.note.innerHTML = ''; els.note.classList.remove('note-closing'); }
        if (els.hint)         { els.hint.classList.remove('hint-fade'); }
        if (els.ambient)      { els.ambient.innerHTML = ''; }
        document.body.classList.remove('cafe-golden-hour');

        els.treats.forEach(btn => {
            btn.classList.remove('treat-active', 'treat-found', 'treat-animating');
            btn.setAttribute('aria-pressed', 'false');
            btn.onclick = null;
        });
    }

    // Flow 4: Birthday Café -> Cinematic Bouquet Animation Scene
    const dessertToBouquetBtn = document.getElementById('dessertToBouquetBtn');
    if (dessertToBouquetBtn) {
        dessertToBouquetBtn.addEventListener('click', () => {
            const rect = dessertToBouquetBtn.getBoundingClientRect();
            createSparkleBurst(rect.left + rect.width / 2, rect.top + rect.height / 2);
            switchSection('bouquet', () => {
                startBouquetCreationAnimation();
            });
        });
    }


    // --------------------------------------------------------------------------
    // 5c. Cinematic Bouquet Creation & Compliments Sequencing
    // --------------------------------------------------------------------------
    let activeComplimentPop = null;
    let complimentPopTimer = null;

    function showFlowerComplimentPop(text, x, y) {
        if (complimentPopTimer) {
            clearTimeout(complimentPopTimer);
            complimentPopTimer = null;
        }
        if (!activeComplimentPop) {
            activeComplimentPop = document.createElement('div');
            activeComplimentPop.className = 'flower-compliment-pop';
            document.body.appendChild(activeComplimentPop);
        }
        activeComplimentPop.textContent = text;
        activeComplimentPop.classList.remove('show');

        // Position popover near flower, keeping within viewport
        const padding = 16;
        const popX = Math.min(Math.max(x - 90, padding), window.innerWidth - 230);
        const popY = Math.max(y - 55, padding);
        activeComplimentPop.style.left = `${popX}px`;
        activeComplimentPop.style.top = `${popY}px`;

        void activeComplimentPop.offsetWidth;
        activeComplimentPop.classList.add('show');

        complimentPopTimer = setTimeout(() => {
            if (activeComplimentPop) {
                activeComplimentPop.classList.remove('show');
            }
        }, 3200);
    }

    function createStardustParticles() {
        if (!DOM.bouquetStardust) return;
        DOM.bouquetStardust.innerHTML = '';
        const colors = [
            'rgba(255, 225, 130, 0.85)',
            'rgba(255, 190, 150, 0.75)',
            'rgba(255, 240, 210, 0.90)',
            'rgba(255, 170, 190, 0.80)'
        ];
        for (let i = 0; i < 18; i++) {
            const particle = document.createElement('div');
            particle.className = 'stardust-particle';
            const size = Math.random() * 3.5 + 2;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.backgroundColor = colors[i % colors.length];
            particle.style.boxShadow = `0 0 ${size * 2}px ${particle.style.backgroundColor}`;
            particle.style.left = `${Math.random() * 88 + 6}%`;
            particle.style.top = `${Math.random() * 70 + 15}%`;
            particle.style.setProperty('--sd-dur', `${Math.random() * 4 + 6}s`);
            particle.style.setProperty('--sd-delay', `${(i * 0.35).toFixed(2)}s`);
            DOM.bouquetStardust.appendChild(particle);
        }
    }

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
        state.bouquetCompleted = false;
        state.bouquetFlowerClicked = false;

        if (DOM.bouquetWrapper) {
            DOM.bouquetWrapper.className = 'bouquet-wrapper';
        }
        if (DOM.cinnamorollContainer) {
            DOM.cinnamorollContainer.classList.remove('show', 'wave');
        }
        if (DOM.bouquetBanner) {
            DOM.bouquetBanner.classList.remove('show');
        }
        if (DOM.bouquetNoteCard) {
            DOM.bouquetNoteCard.classList.remove('show');
        }
        if (DOM.bouquetToWishBtn) {
            DOM.bouquetToWishBtn.disabled = true;
        }
        if (DOM.bouquetStardust) {
            DOM.bouquetStardust.innerHTML = '';
        }
        if (activeComplimentPop) {
            activeComplimentPop.classList.remove('show');
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
        createStardustParticles();

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

        // Step 11: Final settling breathe sway, note card, Cinnamoroll wave & reveal Continue button (6.9s)
        addBouquetStep(6900, () => {
            if (DOM.bouquetWrapper) DOM.bouquetWrapper.classList.add('completed');
            if (DOM.cinnamorollContainer) DOM.cinnamorollContainer.classList.add('wave');
            if (DOM.bouquetBanner) DOM.bouquetBanner.classList.add('show');
            if (DOM.bouquetNoteCard) DOM.bouquetNoteCard.classList.add('show');
            state.bouquetCompleted = true;
            if (DOM.bouquetToWishBtn) {
                DOM.bouquetToWishBtn.disabled = false;
            }
        });
    }

    function initBouquetInteractions() {
        const flowerGroups = document.querySelectorAll('#bouquet .flower-group');
        flowerGroups.forEach(fg => {
            const handleFlowerInteraction = (e) => {
                e.stopPropagation();

                // 1. Gentle bounce animation
                fg.classList.remove('flower-bounce');
                void fg.offsetWidth;
                fg.classList.add('flower-bounce');
                setTimeout(() => fg.classList.remove('flower-bounce'), 600);

                // 2. Petal sparkle burst at interaction position
                const rect = fg.getBoundingClientRect();
                const clientX = e.clientX || (rect.left + rect.width / 2);
                const clientY = e.clientY || (rect.top + rect.height / 2);
                createSparkleBurst(clientX, clientY);

                // 3. Display handwritten compliment popover near the flower
                const complimentText = fg.getAttribute('data-compliment') || 'a little something just for you ♡';
                showFlowerComplimentPop(complimentText, clientX, clientY);

                // 4. Reveal/Enable Continue button on first flower click
                if (!state.bouquetFlowerClicked) {
                    state.bouquetFlowerClicked = true;
                    if (DOM.bouquetBanner) DOM.bouquetBanner.classList.add('show');
                    if (DOM.bouquetNoteCard) DOM.bouquetNoteCard.classList.add('show');
                    if (DOM.bouquetToWishBtn) {
                        DOM.bouquetToWishBtn.disabled = false;
                    }
                }
            };

            fg.addEventListener('click', handleFlowerInteraction);
            fg.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleFlowerInteraction(e);
                }
            });
        });
    }

    // Initialize bouquet interactive flower handlers
    initBouquetInteractions();

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
                initFinaleScene();
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
    // 8. Confetti Canvas Engine (Safe, Single-Loop, Fully Resettable)
    // --------------------------------------------------------------------------
    let confettiActive = false;
    let confettiAnimationId = null;
    let confettiPieces = [];

    function stopConfetti() {
        confettiActive = false;
        if (confettiAnimationId) {
            cancelAnimationFrame(confettiAnimationId);
            confettiAnimationId = null;
        }
        confettiPieces = [];
        const canvas = DOM.confettiCanvas;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
        }
    }

    function startConfetti() {
        // Always stop and cancel any existing loop first to prevent duplicates
        stopConfetti();

        const canvas = DOM.confettiCanvas;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;
        confettiActive = true;

        confettiPieces = Array.from({ length: 90 }, () => ({
            x: Math.random() * width,
            y: Math.random() * height - height,
            size: Math.floor(Math.random() * 6) + 6,
            color: ['#FF6EA6', '#FFD166', '#FF85A2', '#FFB6C1', '#FFE5EC'][Math.floor(Math.random() * 5)],
            vy: Math.random() * 3 + 2,
            vx: Math.random() * 2 - 1,
            rotation: Math.random() * 360,
            vRot: Math.random() * 6 - 3
        }));

        function render() {
            if (!confettiActive) {
                if (ctx) ctx.clearRect(0, 0, width, height);
                confettiAnimationId = null;
                return;
            }

            ctx.clearRect(0, 0, width, height);

            confettiPieces.forEach(p => {
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

            confettiAnimationId = requestAnimationFrame(render);
        }

        confettiAnimationId = requestAnimationFrame(render);
    }

    function adjustFinalePhotoFrame() {
        // No-op: finale photo frame was cleanly removed in favor of pure Virgo Constellation night sky
    }

    // --------------------------------------------------------------------------
    // 8a. Global Day-to-Night Environmental Progression Engine
    // --------------------------------------------------------------------------
    function clearEnvironmentTimers() {
        if (state.environmentTimers) {
            state.environmentTimers.forEach(id => clearTimeout(id));
            state.environmentTimers = [];
        }
    }

    function updateEnvironment(sectionId) {
        clearEnvironmentTimers();
        const envEl = document.getElementById('dayNightEnvironment');
        if (!envEl) return;

        const allEnvClasses = [
            'env-morning', 'env-morning-warm', 'env-afternoon',
            'env-golden-hour', 'env-sunset', 'env-night-sunset',
            'env-night-deeppink', 'env-night-purple', 'env-night-deepblue',
            'env-night', 'env-night-sky'
        ];
        allEnvClasses.forEach(c => envEl.classList.remove(c));

        if (sectionId === 'landing' || sectionId === 'opening') {
            envEl.classList.add('env-morning');
        } else if (sectionId === 'letter') {
            envEl.classList.add('env-morning-warm');
        } else if (sectionId === 'photos' || sectionId === 'collage' || sectionId === 'dessert') {
            envEl.classList.add('env-afternoon');
        } else if (sectionId === 'bouquet') {
            envEl.classList.add('env-golden-hour');
        } else if (sectionId === 'wish') {
            envEl.classList.add('env-sunset');
        } else if (sectionId === 'finale') {
            startNightTransitionSequence(envEl);
        } else if (sectionId === 'letter-finale') {
            // Keep the deep night-sky atmosphere from the finale
            envEl.classList.add('env-night-sky');
        } else {
            envEl.classList.add('env-morning');
        }
    }

    function startNightTransitionSequence(envEl) {
        // Smooth progression: SUNSET → DEEP PINK → PURPLE → DEEP BLUE → NIGHT SKY
        envEl.classList.add('env-night-sunset');

        const t1 = setTimeout(() => {
            envEl.classList.remove('env-night-sunset');
            envEl.classList.add('env-night-deeppink');
        }, 550);

        const t2 = setTimeout(() => {
            envEl.classList.remove('env-night-deeppink');
            envEl.classList.add('env-night-purple');
        }, 1150);

        const t3 = setTimeout(() => {
            envEl.classList.remove('env-night-purple');
            envEl.classList.add('env-night-deepblue');
        }, 1750);

        const t4 = setTimeout(() => {
            envEl.classList.remove('env-night-deepblue');
            envEl.classList.add('env-night');
        }, 2400);

        state.environmentTimers.push(t1, t2, t3, t4);
    }

    // --------------------------------------------------------------------------
    // 8b. Interactive Starry Sky Finale & Virgo Constellation Engine
    // --------------------------------------------------------------------------
    let audioCtx = null;

    // 12 Canonical Virgo Constellation Stars with coordinates matching reference image in viewBox="0 0 1000 620"
    const virgoStars = {
        'virgo-star-upper-tip':    { x: 87,  y: 174, isSpica: false, note: 587.33 },  // Upper Left Wing Tip
        'virgo-star-vindemiatrix': { x: 288, y: 230, isSpica: false, note: 659.25 },  // Epsilon Vir - Upper Left Wing Mid
        'virgo-star-minelauva':    { x: 399, y: 302, isSpica: false, note: 739.99 },  // Delta Vir - Waist Junction
        'spica':                   { x: 402, y: 548, isSpica: true,  note: 1318.51 }, // Alpha Vir - Primary Anchor
        'virgo-star-kang':         { x: 204, y: 489, isSpica: false, note: 783.99 },  // Kappa Vir - Lower Leg Joint
        'virgo-star-khambalia':    { x: 200, y: 386, isSpica: false, note: 698.46 },  // Lambda Vir - Lower Leg Mid
        'virgo-star-syrma':        { x: 80,  y: 357, isSpica: false, note: 622.25 },  // Iota Vir - Lower Foot Tip
        'virgo-star-porrima':      { x: 575, y: 251, isSpica: false, note: 987.77 },  // Gamma Vir - Chest Junction
        'virgo-star-zavijava':     { x: 568, y: 76,  isSpica: false, note: 830.61 },  // Beta Vir - Head Star
        'virgo-star-heze':         { x: 620, y: 378, isSpica: false, note: 1108.73 }, // Zeta Vir - Hip Junction
        'virgo-star-zaniah':       { x: 722, y: 378, isSpica: false, note: 880.00 },  // Eta Vir - Right Arm Joint
        'virgo-star-rijl':         { x: 917, y: 242, isSpica: false, note: 1661.22 }  // Mu Vir - Far Right Tip
    };

    // Predetermined Astronomical Virgo Edges (Only lines between these stars will draw)
    const virgoEdges = [
        ['virgo-star-upper-tip', 'virgo-star-vindemiatrix'],
        ['virgo-star-vindemiatrix', 'virgo-star-minelauva'],
        ['virgo-star-minelauva', 'spica'],
        ['spica', 'virgo-star-kang'],
        ['virgo-star-kang', 'virgo-star-khambalia'],
        ['virgo-star-khambalia', 'virgo-star-syrma'],
        ['virgo-star-minelauva', 'virgo-star-porrima'],
        ['virgo-star-porrima', 'virgo-star-zavijava'],
        ['virgo-star-porrima', 'virgo-star-heze'],
        ['spica', 'virgo-star-heze'],
        ['virgo-star-heze', 'virgo-star-zaniah'],
        ['virgo-star-zaniah', 'virgo-star-rijl']
    ];

    // Canonical progressive guidance sequence
    const virgoGuideOrder = [
        'spica',
        'virgo-star-minelauva',
        'virgo-star-vindemiatrix',
        'virgo-star-upper-tip',
        'virgo-star-porrima',
        'virgo-star-zavijava',
        'virgo-star-heze',
        'virgo-star-zaniah',
        'virgo-star-rijl',
        'virgo-star-kang',
        'virgo-star-khambalia',
        'virgo-star-syrma'
    ];

    const drawnEdges = new Set();

    function playStarChime(starId, isSpica) {
        try {
            if (!audioCtx) {
                const AudioContextClass = window.AudioContext || window.webkitAudioContext;
                if (AudioContextClass) {
                    audioCtx = new AudioContextClass();
                }
            }
            if (audioCtx && audioCtx.state === 'suspended') {
                audioCtx.resume();
            }
            if (!audioCtx) return;

            const now = audioCtx.currentTime;
            const starData = virgoStars[starId];
            const freq = starData ? starData.note : 880;

            if (isSpica) {
                // Distinct brilliant blue-white crystalline shimmer chord for Spica: E6 + B6 + E7
                [freq, freq * 1.5, freq * 2].forEach((f, i) => {
                    const osc = audioCtx.createOscillator();
                    const gain = audioCtx.createGain();
                    osc.type = i === 2 ? 'triangle' : 'sine';
                    osc.frequency.setValueAtTime(f, now + i * 0.035);

                    gain.gain.setValueAtTime(0.001, now + i * 0.035);
                    gain.gain.exponentialRampToValueAtTime(0.18 / (i + 1), now + i * 0.035 + 0.04);
                    gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.035 + 1.4);

                    osc.connect(gain);
                    gain.connect(audioCtx.destination);

                    osc.start(now + i * 0.035);
                    osc.stop(now + i * 0.035 + 1.45);
                });
            } else {
                // Gentle crystalline chime for regular stars
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();

                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, now);

                gain.gain.setValueAtTime(0.001, now);
                gain.gain.exponentialRampToValueAtTime(0.16, now + 0.04);
                gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.85);

                osc.connect(gain);
                gain.connect(audioCtx.destination);

                osc.start(now);
                osc.stop(now + 0.9);
            }
        } catch (e) {
            // Audio context not available or blocked - silent fallback
        }
    }

    function playCelestialChord() {
        try {
            if (!audioCtx) {
                const AudioContextClass = window.AudioContext || window.webkitAudioContext;
                if (AudioContextClass) {
                    audioCtx = new AudioContextClass();
                }
            }
            if (audioCtx && audioCtx.state === 'suspended') {
                audioCtx.resume();
            }
            if (!audioCtx) return;

            // Celestial ascending arpeggio chord: E5, A5, B5, E6, G#6, B6
            const chord = [659.25, 880.00, 987.77, 1318.51, 1661.22, 1975.53];
            const now = audioCtx.currentTime;

            chord.forEach((freq, i) => {
                const noteTime = now + (i * 0.09);
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();

                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, noteTime);

                gain.gain.setValueAtTime(0.001, noteTime);
                gain.gain.exponentialRampToValueAtTime(0.12, noteTime + 0.05);
                gain.gain.exponentialRampToValueAtTime(0.0001, noteTime + 1.8);

                osc.connect(gain);
                gain.connect(audioCtx.destination);

                osc.start(noteTime);
                osc.stop(noteTime + 1.85);
            });
        } catch (e) {}
    }

    function drawVirgoLine(u, v) {
        if (!u || !v || u === v) return;
        const edgeKey = [u, v].sort().join('--');
        if (drawnEdges.has(edgeKey)) return;
        drawnEdges.add(edgeKey);

        const group = document.getElementById('virgo-lines');
        if (!group) return;

        const p1 = virgoStars[u];
        const p2 = virgoStars[v];
        if (!p1 || !p2) return;

        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', p1.x);
        line.setAttribute('y1', p1.y);
        line.setAttribute('x2', p2.x);
        line.setAttribute('y2', p2.y);
        line.setAttribute('class', 'virgo-line');
        group.appendChild(line);
    }

    function checkVirgoEdges(newStarId) {
        virgoEdges.forEach(([u, v]) => {
            if ((u === newStarId && state.activatedStars.has(v)) ||
                (v === newStarId && state.activatedStars.has(u))) {
                drawVirgoLine(u, v);
            }
        });
    }

    // ── 3-State Star Progression & Single Guided Target Engine ──
    function updateGuidedStar() {
        if (state.constellationCompleted) return;

        // Find the next unactivated star in the canonical sequence
        const nextTargetId = virgoGuideOrder.find(id => !state.activatedStars.has(id));

        document.querySelectorAll('.virgo-star-node').forEach(node => {
            const id = node.getAttribute('data-star-id') || node.id;
            if (state.activatedStars.has(id)) {
                node.classList.remove('star-guided', 'star-inactive', 'star-beckon');
                node.classList.add('activated');
            } else if (id === nextTargetId) {
                node.classList.remove('star-inactive', 'star-beckon');
                node.classList.add('star-guided');
            } else {
                node.classList.remove('star-guided', 'star-beckon');
                node.classList.add('star-inactive');
            }
        });
    }

    function handleStarClick(starNode) {
        if (!starNode || state.constellationCompleted) return;

        const starId = starNode.getAttribute('data-star-id') || starNode.id;
        if (!starId || state.activatedStars.has(starId)) return;

        // 1. Dismiss hint on first star interaction
        const instruction = document.getElementById('skyInstruction');
        if (instruction && !state.hintDismissed) {
            state.hintDismissed = true;
            instruction.classList.remove('instruction-visible');
            instruction.classList.add('instruction-hidden');
        }

        // 2. Mark star as activated
        state.activatedStars.add(starId);
        starNode.classList.remove('star-inactive', 'star-guided', 'star-beckon');
        starNode.classList.add('activated', 'just-activated');
        setTimeout(() => {
            starNode.classList.remove('just-activated');
        }, 850);

        // 3. Delicate sparkle burst at star position
        const rect = starNode.getBoundingClientRect();
        createSparkleBurst(rect.left + rect.width / 2, rect.top + rect.height / 2);

        // 4. Play crystalline chime (Spica has brilliant blue-white shimmer chord)
        const isSpica = (starId === 'spica');
        playStarChime(starId, isSpica);

        // 5. Draw predetermined Virgo connection lines only between canonically connected active stars
        checkVirgoEdges(starId);

        // 6. Advance guidance to the next unactivated star
        updateGuidedStar();

        // 7. Check if all 12 Virgo stars have been activated
        if (state.activatedStars.size >= Object.keys(virgoStars).length && !state.constellationCompleted) {
            triggerVirgoCompletion();
        }
    }

    function triggerVirgoCompletion() {
        state.constellationCompleted = true;

        const stage = document.getElementById('constellationStage');
        const instruction = document.getElementById('skyInstruction');

        if (instruction) {
            instruction.classList.add('instruction-hidden');
        }

        // Ensure all predetermined Virgo lines are drawn and stay permanently visible
        virgoEdges.forEach(([u, v]) => drawVirgoLine(u, v));

        // Ensure all 12 stars are brightly lit, settled, and interactive logic is stopped
        document.querySelectorAll('.virgo-star-node').forEach(node => {
            node.classList.remove('star-guided', 'star-inactive', 'star-beckon');
            node.classList.add('activated');
            node.style.pointerEvents = 'none'; // Stop interactive connection logic so constellation cannot be changed
            node.style.cursor = 'default';
        });

        // STEP 1 (0ms): Completed constellation glows with radiant starlight
        if (stage) {
            stage.classList.add('step1-brighten', 'constellation-completed');
        }

        // STEP 2 (350ms): Constellation lines pulse with starlight
        const t2 = setTimeout(() => {
            if (stage) stage.classList.add('step2-pulse');
        }, 350);

        // STEP 3 (800ms): Celestial chord and gentle Spica sparkle
        const t3 = setTimeout(() => {
            playCelestialChord();
            const spicaEl = document.getElementById('spica');
            if (spicaEl) {
                const rect = spicaEl.getBoundingClientRect();
                createSparkleBurst(rect.left + rect.width / 2, rect.top + rect.height / 2);
            }
        }, 800);

        // STEP 4 (1000ms): Settle the completed constellation, then fade in the Virgo message
        const t4 = setTimeout(() => {
            if (stage) {
                stage.classList.add('constellation-settled');
            }

            const msgStage = document.getElementById('virgoMessageStage');
            if (msgStage) {
                msgStage.style.display = 'flex';
                void msgStage.offsetWidth; // Force reflow before transition
                msgStage.classList.add('virgo-msg-visible');
                msgStage.setAttribute('aria-hidden', 'false');

                // Scroll gently so the message is visible below the constellation
                setTimeout(() => {
                    msgStage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }, 400);
            }
        }, 1000);

        // STEP 5 (3600ms): Fade in the Continue button (after text is fully visible)
        const t5 = setTimeout(() => {
            const continueWrap = document.getElementById('virgoMsgContinueWrap');
            if (continueWrap) {
                continueWrap.classList.add('continue-btn-visible');
            }
        }, 3600);

        state.starFinaleTimers.push(t2, t3, t4, t5);
    }

    // ---------------------------------------------------------------------------
    // Virgo Message "Continue" → switch to dedicated Letter-Finale section
    // ---------------------------------------------------------------------------
    function initLetterFinaleScene() {
        const revealStage = document.getElementById('finaleRevealStage');
        if (!revealStage) return;

        // Small entrance delay so the section transition completes before the reveal starts
        const tReveal = setTimeout(() => {
            revealStage.classList.add('reveal-visible');
            revealStage.setAttribute('aria-hidden', 'false');

            const actionWrap = document.getElementById('finaleActionWrap');
            if (actionWrap) {
                actionWrap.classList.add('action-visible');
            }
        }, 600);

        state.starFinaleTimers.push(tReveal);
    }

    // Wire the Continue button
    const vmContinueBtn = document.getElementById('virgoMessageContinue');
    if (vmContinueBtn) {
        vmContinueBtn.addEventListener('click', (e) => {
            e.preventDefault();
            switchSection('letter-finale', () => {
                initLetterFinaleScene();
            });
        });
    }

    function resetStarFinale() {
        if (state.starFinaleTimers) {
            state.starFinaleTimers.forEach(id => clearTimeout(id));
            state.starFinaleTimers = [];
        }
        state.activatedStars = new Set();
        state.lastClickedStarIndex = null;
        state.hintDismissed = false;
        state.constellationCompleted = false;
        drawnEdges.clear();

        // Reset shooting star
        const shootingStar = document.getElementById('finaleShootingStar');
        if (shootingStar) {
            shootingStar.classList.remove('shooting-star-active');
        }

        // Reset all 12 Virgo stars to inactive state and restore pointer events
        const starNodes = document.querySelectorAll('.virgo-star-node');
        starNodes.forEach(node => {
            node.classList.remove('activated', 'just-activated', 'star-guided', 'star-beckon');
            node.classList.add('star-inactive');
            node.style.removeProperty('pointer-events');
            node.style.removeProperty('cursor');
        });

        // Clear SVG constellation lines
        const group = document.getElementById('virgo-lines');
        if (group) group.innerHTML = '';

        const stage = document.getElementById('constellationStage');
        if (stage) {
            stage.classList.remove('step1-brighten', 'step2-pulse', 'constellation-completed', 'constellation-settled');
        }

        // Reset the Virgo completion message stage
        const msgStage = document.getElementById('virgoMessageStage');
        if (msgStage) {
            msgStage.classList.remove('virgo-msg-visible');
            msgStage.style.display = 'none';
            msgStage.setAttribute('aria-hidden', 'true');
        }

        // Reset the continue button wrapper
        const continueWrap = document.getElementById('virgoMsgContinueWrap');
        if (continueWrap) {
            continueWrap.classList.remove('continue-btn-visible');
        }

        // Reset Letter-Finale reveal stage (now lives in #letter-finale section)
        const revealStage = document.getElementById('finaleRevealStage');
        if (revealStage) {
            revealStage.classList.remove('reveal-visible');
            revealStage.setAttribute('aria-hidden', 'true');
        }

        // Reset instruction hint
        const instruction = document.getElementById('skyInstruction');
        if (instruction) {
            instruction.classList.remove('instruction-visible', 'instruction-hidden');
        }

        // Hide "Return to Start" button container
        const actionWrap = document.getElementById('finaleActionWrap');
        if (actionWrap) {
            actionWrap.classList.remove('action-visible');
        }

        // Reset finale section content visibility
        const finaleSec = document.getElementById('finale');
        if (finaleSec) {
            finaleSec.classList.remove('finale-sky-active', 'finale-content-visible');
        }
    }

    function initFinaleScene() {
        resetStarFinale();

        const finaleSec = document.getElementById('finale');
        if (finaleSec) {
            finaleSec.classList.add('finale-sky-active');
        }

        // Guide user to the primary anchor star (Spica)
        updateGuidedStar();

        // Fade in "Psst… tap the glowing stars ✨" hint gently
        const instruction = document.getElementById('skyInstruction');
        if (instruction) {
            instruction.classList.remove('instruction-hidden');
            const tInst = setTimeout(() => {
                if (!state.hintDismissed) {
                    instruction.classList.add('instruction-visible');
                }
            }, 850);
            state.starFinaleTimers.push(tInst);
        }

        // Trigger occasional shooting star across the night sky after ~2.6s
        const shootingStar = document.getElementById('finaleShootingStar');
        if (shootingStar) {
            shootingStar.classList.remove('shooting-star-active');
            const tStar = setTimeout(() => {
                shootingStar.classList.add('shooting-star-active');
                const tStarEnd = setTimeout(() => {
                    shootingStar.classList.remove('shooting-star-active');
                }, 2200);
                state.starFinaleTimers.push(tStarEnd);
            }, 2600);
            state.starFinaleTimers.push(tStar);
        }
    }

    // Attach click and keyboard listeners to all Virgo constellation stars
    const virgoStarNodes = document.querySelectorAll('.virgo-star-node');
    virgoStarNodes.forEach(starNode => {
        starNode.addEventListener('click', (e) => {
            e.preventDefault();
            handleStarClick(starNode);
        });
        starNode.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleStarClick(starNode);
            }
        });
    });

    function clearMemoryBoxTimers() {
        if (state.memoryBoxTimerIds) {
            state.memoryBoxTimerIds.forEach(id => clearTimeout(id));
            state.memoryBoxTimerIds = [];
        }
    }

    function resetMemoryBoxScene() {
        clearMemoryBoxTimers();
        resetStarFinale();
        stopConfetti();
        clearSparkleBursts();

        const frame = document.querySelector('.finale-photo-frame');
        if (frame) {
            frame.style.removeProperty('width');
            frame.style.removeProperty('height');
            frame.style.removeProperty('transform');
        }
    }

    // --------------------------------------------------------------------------
    // 8c. Complete Fresh Restart Engine ("Return to Start" Handler) & Full Cleanup
    // --------------------------------------------------------------------------
    function cleanupAllParticles() {
        // 1. Stop and clear confetti canvas
        stopConfetti();

        // 2. Remove all active sparkle bursts
        clearSparkleBursts();

        // 3. Clear cake smoke & wish hearts
        if (DOM.smokeParticles) {
            DOM.smokeParticles.innerHTML = '';
        }

        // 4. Clear bouquet floating petals & stardust
        if (DOM.floatingPetals) {
            DOM.floatingPetals.innerHTML = '';
        }
        if (DOM.bouquetStardust) {
            DOM.bouquetStardust.innerHTML = '';
        }

        // 5. Clear scrapbook petals
        const scrapbookPetals = document.getElementById('scrapbookPetals');
        if (scrapbookPetals) {
            scrapbookPetals.innerHTML = '';
        }

        // 6. Hide any active flower compliment popover
        if (activeComplimentPop) {
            activeComplimentPop.classList.remove('show');
        }
    }

    function restartExperience() {
        // 1. Stop all particle systems and clear canvases & DOM particles
        cleanupAllParticles();

        // 2. Clear all active timers across every section
        clearMemoryBoxTimers();
        if (state.cakeTimerIds) {
            state.cakeTimerIds.forEach(id => clearTimeout(id));
            state.cakeTimerIds = [];
        }
        if (state.bouquetTimerIds) {
            state.bouquetTimerIds.forEach(id => clearTimeout(id));
            state.bouquetTimerIds = [];
        }
        if (state.dessertTimerIds) {
            state.dessertTimerIds.forEach(id => clearTimeout(id));
            state.dessertTimerIds = [];
        }
        if (state.collageTimerIds) {
            state.collageTimerIds.forEach(id => clearTimeout(id));
            state.collageTimerIds = [];
        }
        clearScrapbookTimers();
        if (state.openingTimerIds) {
            state.openingTimerIds.forEach(id => clearTimeout(id));
            state.openingTimerIds = [];
        }

        // 3. Reset all state tracking variables
        state.currentSection = 'landing';
        state.sectionHistory = ['landing'];
        state.candleBlown = false;
        state.selectedDessert = null;
        state.bouquetCompleted = false;
        state.bouquetFlowerClicked = false;
        isSectionTransitioning = false;

        // 4. Reset all sections to their pristine initial states
        resetMemoryBoxScene();
        resetCakeScene();
        resetBouquetScene();
        resetDessertScene();
        resetCollageScene();

        // Photos / Scrapbook section reset
        const photoCards = [DOM.photoCard1, DOM.photoCard2, DOM.photoCard3];
        photoCards.forEach(c => {
            if (c) {
                c.classList.remove('card-revealed');
                c.style.display = 'flex';
            }
        });
        const scrapbookActions = document.getElementById('scrapbookActions');
        if (scrapbookActions) {
            scrapbookActions.classList.remove('show-action');
        }
        const scrapbookPetals = document.getElementById('scrapbookPetals');
        if (scrapbookPetals) {
            scrapbookPetals.innerHTML = '';
        }

        // Reset Cinnamoroll stickers
        const yaySticker = document.getElementById('cinStickerYay');
        if (yaySticker) {
            yaySticker.classList.remove('cin-sticker-visible');
        }

        // Reset opening title
        const openingTitle = document.getElementById('opening-title');
        if (openingTitle) {
            openingTitle.textContent = "Setting up a cozy birthday for Nathalie…";
        }

        // 5. Reset body styling and back button navigation
        document.body.className = 'time-landing';
        document.body.classList.remove('cafe-golden-hour');
        clearEnvironmentTimers();
        updateEnvironment('landing');
        resetStarFinale();
        updateNavBackButton();

        // 6. Reset all section displays and active classes cleanly
        Object.keys(DOM.sections).forEach(id => {
            const el = DOM.sections[id];
            if (!el) return;
            el.classList.remove(...exitAnimations, ...enterAnimations, 'active-section');
            if (id === 'landing') {
                el.style.display = 'flex';
                void el.offsetWidth;
                el.classList.add('active-section');
            } else {
                el.style.display = 'none';
            }
        });

        window.scrollTo({ top: 0, behavior: 'smooth' });
        showToast('Welcome back Nathalie! 💌🌸');
    }

    // Return to Start Button Handler
    if (DOM.homeButton) {
        DOM.homeButton.addEventListener('click', (e) => {
            e.preventDefault();
            restartExperience();
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

    // Initialize initial environment and star finale state on start
    updateEnvironment('landing');
    resetStarFinale();
});
