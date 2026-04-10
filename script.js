/**
         * Humayoun Kobir | Portfolio Logic
         * Optimized for performance and smoothness.
         */

        document.addEventListener('DOMContentLoaded', () => {
            // 1. Theme Toggle
            const root = document.documentElement;
            const themeToggle = document.getElementById('themeToggle');
            const themeIcon = document.getElementById('themeIcon');
            const themeLabel = document.getElementById('themeLabel');
            const themeMeta = document.querySelector('meta[name="theme-color"]');

            const setTheme = (theme) => {
                if (root.getAttribute('data-theme') === theme && localStorage.getItem('portfolio-theme') === theme) return;
                root.setAttribute('data-theme', theme);
                localStorage.setItem('portfolio-theme', theme);
                themeIcon.className = theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
                themeLabel.textContent = theme === 'dark' ? 'Light' : 'Dark';
                themeMeta.setAttribute('content', theme === 'dark' ? '#0b0b0b' : '#ffffff');
            };

            themeToggle.addEventListener('click', () => {
                const newTheme = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
                setTheme(newTheme);
            });

            // Initialize Theme
            const savedTheme = localStorage.getItem('portfolio-theme') ||
                (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
            setTheme(savedTheme);

            // 2. Typing Animation
            const typingElement = document.getElementById('typing');
            const words = ["Graphic Designer.", "Beginner 3D Artist.", "Data Entry Specialist.", "Computer Hardware Enthusiast."];
            let wordIndex = 0;
            let charIndex = 0;
            let isDeleting = false;
            let typingSpeed = 100;

            const type = () => {
                if (!state.isTypingVisible) return;

                const currentWord = words[wordIndex];
                const shouldDelete = isDeleting;
                const currentSlice = currentWord.substring(0, charIndex);

                typingElement.textContent = currentSlice || '\u200B';

                if (!shouldDelete && charIndex < currentWord.length) {
                    charIndex++;
                    typingSpeed = 120 - Math.random() * 50;
                } else if (shouldDelete && charIndex > 0) {
                    charIndex--;
                    typingSpeed = 60;
                } else {
                    isDeleting = !shouldDelete;
                    wordIndex = !isDeleting ? (wordIndex + 1) % words.length : wordIndex;
                    typingSpeed = !isDeleting ? 200 : 1500;
                }

                setTimeout(type, typingSpeed);
            };

            if (typingElement) {
                const typeObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        const wasVisible = state.isTypingVisible;
                        state.isTypingVisible = entry.isIntersecting;
                        if (entry.isIntersecting && !wasVisible) type();
                    });
                }, { threshold: 0.1 });
                typeObserver.observe(typingElement);
            }

            // 3. Optimized Scroll Reveal (Only for Desktop/High-Performance)
            if (window.innerWidth >= 1024) {
                const observerOptions = {
                    threshold: 0.15,
                    rootMargin: "0px 0px -50px 0px"
                };

                const revealObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add('active');
                            revealObserver.unobserve(entry.target);
                        }
                    });
                }, observerOptions);

                document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
            } else {
                // Instantly show everything on mobile to save CPU/Battery
                document.querySelectorAll('.reveal').forEach(el => el.classList.add('active'));
            }

            // 4. Ultra-Light Scroll Sync (PC Optimized)
            const stickyHeads = document.querySelectorAll('.split-section .section-title');

            const state = {
                animating: false,
                isTypingVisible: false,
                scrollY: 0,
                lastScrollY: -1,
                titlePositions: [],
                winW: window.innerWidth,
                winH: window.innerHeight
            };

            const computePositions = () => {
                const sy = state.scrollY;
                state.winW = window.innerWidth;
                state.winH = window.innerHeight;
                state.titlePositions = Array.from(stickyHeads).map(head => {
                    const rect = head.getBoundingClientRect();
                    return {
                        el: head,
                        top: rect.top + sy,
                        height: rect.height
                    };
                });
            };

            const updateLoop = () => {
                let needsUpdate = false;

                // 1. Dynamic Background & Pointer Glow Removed

                // 2. Optimized Scroll Logic
                const sy = state.scrollY;
                if (state.winW >= 1024) {
                    const titlePositions = state.titlePositions;
                    for (let i = 0; i < titlePositions.length; i++) {
                        const pos = titlePositions[i];
                        const relativeTop = pos.top - sy;
                        if (relativeTop < 400 && relativeTop > -200) {
                            const opacity = Math.max(0, Math.min(1, (relativeTop - 50) / 150)).toFixed(2);
                            if (pos.el.style.opacity !== opacity) pos.el.style.opacity = opacity;
                        }
                    }
                    if (typeof updateGliderSync === "function") updateGliderSync();
                }

                if (needsUpdate || (Math.abs(sy - state.lastScrollY) > 0.5)) {
                    state.lastScrollY = sy;
                    requestAnimationFrame(updateLoop);
                } else {
                    state.animating = false;
                }
            };

            const startLoop = () => {
                if (!state.animating) {
                    state.animating = true;
                    requestAnimationFrame(updateLoop);
                }
            };

            window.addEventListener('resize', () => {
                computePositions();
            }, { passive: true });

            // Pointer listeners removed for extreme performance

            window.addEventListener('scroll', () => {
                state.scrollY = window.scrollY || window.pageYOffset;
                if (window.innerWidth >= 1024) {
                    startLoop();
                } else {
                    // Mobile-specific scroll logic (non-JS intensive)
                    if (!state.animating) {
                        requestAnimationFrame(() => {
                            const sy = state.scrollY;
                            // Add minimal mobile scroll effects here if needed
                        });
                    }
                }
            }, { passive: true });

            // 5. Scroll Sync Navigation Logic (Ultra-Optimized 1:1 Sync)
            const navLinks = document.querySelectorAll('.nav a');
            const sections = Array.from(navLinks).map(link => document.querySelector(link.getAttribute('href'))).filter(s => s);
            const glider = document.getElementById('navGlider');

            // Cache metrics to avoid layout thrashing in the scroll loop
            let cachedNavMetrics = [];
            let cachedSectionMetrics = [];

            const refreshMetrics = () => {
                const scrollMargin = 72;
                cachedNavMetrics = Array.from(navLinks).map(link => ({
                    left: link.offsetLeft,
                    width: link.offsetWidth
                }));
                cachedSectionMetrics = sections.map(section => ({
                    target: section.offsetTop - scrollMargin
                }));
            };

            const updateGliderSync = () => {
                if (!glider || window.innerWidth < 1024) return;

                const sy = state.scrollY;
                const sMetrics = cachedSectionMetrics;
                const nMetrics = cachedNavMetrics;

                if (!sMetrics.length || !nMetrics.length) return;

                let targetLeft, targetWidth, activeIdx = -1;

                const isAtBottom = (window.innerHeight + sy) >= document.body.offsetHeight - 80;

                if (isAtBottom) {
                    activeIdx = sMetrics.length - 1;
                    targetLeft = nMetrics[activeIdx].left;
                    targetWidth = nMetrics[activeIdx].width;
                } else if (sy <= sMetrics[0].target) {
                    targetLeft = nMetrics[0].left;
                    targetWidth = nMetrics[0].width;
                    activeIdx = 0;
                } else if (sy >= sMetrics[sMetrics.length - 1].target) {
                    targetLeft = nMetrics[sMetrics.length - 1].left;
                    targetWidth = nMetrics[sMetrics.length - 1].width;
                    activeIdx = sMetrics.length - 1;
                } else {
                    for (let i = 0; i < sMetrics.length - 1; i++) {
                        const startPoint = sMetrics[i].target;
                        const endPoint = sMetrics[i + 1].target;

                        if (sy >= startPoint && sy < endPoint) {
                            const progress = (sy - startPoint) / (endPoint - startPoint);
                            targetLeft = nMetrics[i].left + (nMetrics[i + 1].left - nMetrics[i].left) * progress;
                            targetWidth = nMetrics[i].width + (nMetrics[i + 1].width - nMetrics[i].width) * progress;
                            activeIdx = progress > 0.5 ? i + 1 : i;
                            break;
                        }
                    }
                }

                if (targetLeft !== undefined) {
                    // Restored width-based sizing to preserve perfect border-radius (pill shape)
                    glider.style.transform = `translate3d(${targetLeft}px, 0, 0)`;
                    glider.style.width = `${targetWidth}px`;
                    glider.classList.add('visible');

                    navLinks.forEach((link, idx) => {
                        if (idx === activeIdx) {
                            if (!link.classList.contains('active')) link.classList.add('active');
                        } else {
                            if (link.classList.contains('active')) link.classList.remove('active');
                        }
                    });
                }
            };

            window.addEventListener('resize', () => {
                computePositions();
                refreshMetrics();
                updateGliderSync();
            }, { passive: true });

            // 6. Copy to Clipboard Utility
            window.copyContact = (text, btn) => {
                navigator.clipboard.writeText(text).then(() => {
                    const icon = btn.querySelector('i');
                    const originalClass = icon.className;

                    btn.classList.add('copied');
                    icon.className = 'fa-solid fa-check';

                    setTimeout(() => {
                        btn.classList.remove('copied');
                        icon.className = originalClass;
                    }, 2000);
                });
            };

            // Initial run
            if ('requestIdleCallback' in window) {
                requestIdleCallback(() => {
                    computePositions();
                    refreshMetrics();
                    updateGliderSync();
                    if (window.innerWidth >= 1024) startLoop();
                });
            } else {
                setTimeout(() => {
                    computePositions();
                    refreshMetrics();
                    updateGliderSync();
                    if (window.innerWidth >= 1024) startLoop();
                }, 100);
            }
        });

// Disable Right Click
        document.addEventListener('contextmenu', function (e) {
            e.preventDefault();
        });
        // Disable F12, Ctrl+Shift+I, Ctrl+Shift+C, Ctrl+Shift+J, Ctrl+U
        document.addEventListener('keydown', function (e) {
            if (e.key === '' ||
                (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'C' || e.key === 'J' || e.key === 'i' || e.key === 'c' || e.key === 'j')) ||
                (e.ctrlKey && (e.key === 'U' || e.key === 'u'))) {
                e.preventDefault();
            }
        });

        // Anti-DevTools Debugger Trap
        setInterval(function () {
            const before = new Date().getTime();
            debugger; // This will pause the site if DevTools is open
            const after = new Date().getTime();
            if (after - before > 100) {
                // If it paused, they have DevTools open. You can redirect or clear the body.
                document.body.innerHTML = "Inspector detected. Nice try! ðŸ˜‰";
            }
        }, 1000);
