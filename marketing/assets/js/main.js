        // ========================================
        // FLOATING NAVBAR - SCROLL BEHAVIOR
        // ========================================
        let lastScrollTop = 0;
        let scrollThreshold = 100;
        const navbar = document.getElementById('mainNavbar');

        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

            // Add scrolled class for styling when past threshold
            if (scrollTop > 50) {
                navbar.classList.add('navbar-scrolled');
            } else {
                navbar.classList.remove('navbar-scrolled');
            }

            // Hide/show navbar based on scroll direction
            if (scrollTop > scrollThreshold) {
                if (scrollTop > lastScrollTop) {
                    // Scrolling down - hide navbar
                    navbar.classList.add('navbar-hidden');
                } else {
                    // Scrolling up - show navbar
                    navbar.classList.remove('navbar-hidden');
                }
            } else {
                // Always show navbar at top of page
                navbar.classList.remove('navbar-hidden');
            }

            lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
        }, { passive: true });

        // Mobile Menu Toggle
        function toggleMobileMenu() {
            const menu = document.getElementById('mobileMenu');
            const overlay = document.getElementById('mobileMenuOverlay');

            if (menu.classList.contains('active')) {
                menu.classList.remove('active');
                overlay.style.display = 'none';
                document.body.style.overflow = '';
            } else {
                menu.classList.add('active');
                overlay.style.display = 'block';
                document.body.style.overflow = 'hidden';
            }
        }

        // Close mobile menu on window resize
        window.addEventListener('resize', function() {
            if (window.innerWidth > 992) {
                const menu = document.getElementById('mobileMenu');
                const overlay = document.getElementById('mobileMenuOverlay');
                menu.classList.remove('active');
                overlay.style.display = 'none';
                document.body.style.overflow = '';
            }
        });

        // Language Switcher for Chat Demo
        const translations = {
            en: {
                user: "Hi, I'm interested in lead gen services.",
                agent: "Absolutely! I can help you with that. When is a good time to chat?"
            },
            es: {
                user: "Hola, estoy interesado en servicios de generación de leads.",
                agent: "¡Por supuesto! Puedo ayudarte con eso. ¿Cuándo sería un buen momento para hablar?"
            },
            fr: {
                user: "Bonjour, je suis intéressé par les services de génération de leads.",
                agent: "Absolument ! Je peux vous aider. Quand serait un bon moment pour discuter ?"
            },
            de: {
                user: "Hallo, ich interessiere mich für Lead-Generierungsdienste.",
                agent: "Absolut! Dabei kann ich Ihnen helfen. Wann wäre ein guter Zeitpunkt zum Gespräch?"
            }
        };

        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const lang = btn.dataset.lang;
                const userMsg = document.getElementById('user-message');
                const agentMsg = document.getElementById('agent-message');
                
                userMsg.style.opacity = '0';
                agentMsg.style.opacity = '0';
                
                setTimeout(() => {
                    function typeText(element, text, speed = 30) {
                        element.textContent = '';
                        let index = 0;
                        const interval = setInterval(() => {
                            if (index < text.length) {
                                element.textContent += text.charAt(index);
                                index++;
                            } else {
                                clearInterval(interval);
                            }
                        }, speed);
                    }
                    
                    userMsg.style.opacity = '1';
                    typeText(userMsg, translations[lang].user, 40);
                    
                    setTimeout(() => {
                        agentMsg.style.opacity = '1';
                        typeText(agentMsg, translations[lang].agent, 40);
                    }, translations[lang].user.length * 40 + 300);
                }, 300);
            });
        });

        // Google Translate Integration
        let translateWidgetLoaded = false;
        let translateVisible = false;

        function googleTranslateElementInit() {
            new google.translate.TranslateElement({
                pageLanguage: 'en',
                includedLanguages: 'en,es,fr,de,it,pt,zh-CN,zh-TW,ja,ko,ar,hi,ru,nl,sv,no,da,fi,pl,tr,vi,th,id,ms,tl',
                layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
                autoDisplay: false,
                multilanguagePage: true
            }, 'google_translate_element');
            translateWidgetLoaded = true;
        }

        function toggleTranslate() {
            const translateContainer = document.getElementById('google_translate_element');
            
            if (!translateWidgetLoaded) {
                const script = document.createElement('script');
                script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
                script.async = true;
                document.head.appendChild(script);
                
                translateContainer.style.display = 'block';
                translateContainer.style.opacity = '0';
                translateContainer.style.transform = 'translateY(-10px)';
                
                setTimeout(() => {
                    translateContainer.style.transition = 'all 0.3s ease';
                    translateContainer.style.opacity = '1';
                    translateContainer.style.transform = 'translateY(0)';
                }, 100);
                
                translateVisible = true;
            } else {
                translateVisible = !translateVisible;
                if (translateVisible) {
                    translateContainer.style.display = 'block';
                    setTimeout(() => {
                        translateContainer.style.opacity = '1';
                        translateContainer.style.transform = 'translateY(0)';
                    }, 10);
                } else {
                    translateContainer.style.opacity = '0';
                    translateContainer.style.transform = 'translateY(-10px)';
                    setTimeout(() => {
                        translateContainer.style.display = 'none';
                    }, 300);
                }
            }
        }

        // ========== PILL SELECTOR & CONTENT SWITCHING ==========
        
        let currentMode = 'ai'; // 'ai' or 'web'
        
        const pillColors = {
            ai: {
                primary: '#ff3d00',
                secondary: '#ff6b35',
                glow: 'rgba(255, 61, 0, 0.5)'
            },
            web: {
                primary: '#00d4ff',
                secondary: '#0099cc',
                glow: 'rgba(0, 212, 255, 0.5)'
            }
        };

        // Pill selector functionality
        document.querySelectorAll('.pill-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const newMode = btn.dataset.pill;
                if (newMode === currentMode) return;
                
                // Update pill states
                document.querySelectorAll('.pill-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Update body theme
                document.body.classList.remove('ai-theme', 'web-theme');
                document.body.classList.add(newMode + '-theme');
                
                // Switch content
                document.querySelectorAll('.pill-content').forEach(c => c.classList.remove('active'));
                document.getElementById(newMode + '-content').classList.add('active');
                
                // Switch background effects
                if (newMode === 'ai') {
                    document.getElementById('meteorCanvas').classList.add('active');
                    document.getElementById('snowCanvas').classList.remove('active');
                } else {
                    document.getElementById('meteorCanvas').classList.remove('active');
                    document.getElementById('snowCanvas').classList.add('active');
                }
                
                currentMode = newMode;
            });
        });

        // ========== CURSOR MAGIC SPARKLE TRAIL ==========
        const cursorCanvas = document.getElementById('cursorMagic');
        const cursorCtx = cursorCanvas.getContext('2d');
        let sparkles = [];
        const maxSparkles = 50;

        function resizeCursorCanvas() {
            cursorCanvas.width = window.innerWidth;
            cursorCanvas.height = window.innerHeight;
        }
        resizeCursorCanvas();
        window.addEventListener('resize', resizeCursorCanvas);

        class Sparkle {
            constructor(x, y) {
                this.x = x;
                this.y = y;
                this.size = Math.random() * 8 + 4;
                this.speedX = (Math.random() - 0.5) * 3;
                this.speedY = (Math.random() - 0.5) * 3;
                this.gravity = 0.1;
                this.opacity = 1;
                this.decay = Math.random() * 0.02 + 0.02;
                this.rotation = Math.random() * Math.PI * 2;
                this.rotationSpeed = (Math.random() - 0.5) * 0.2;
                
                const colors = pillColors[currentMode];
                const colorChoice = Math.random();
                if (colorChoice < 0.5) {
                    this.color = colors.primary;
                } else if (colorChoice < 0.8) {
                    this.color = colors.secondary;
                } else {
                    this.color = '#ffffff';
                }
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                this.speedY += this.gravity;
                this.opacity -= this.decay;
                this.rotation += this.rotationSpeed;
                this.size *= 0.98;
            }

            draw() {
                cursorCtx.save();
                cursorCtx.translate(this.x, this.y);
                cursorCtx.rotate(this.rotation);
                cursorCtx.globalAlpha = this.opacity;
                
                cursorCtx.fillStyle = this.color;
                cursorCtx.shadowColor = this.color;
                cursorCtx.shadowBlur = 10;
                
                cursorCtx.beginPath();
                for (let i = 0; i < 4; i++) {
                    const angle = (i * Math.PI / 2);
                    const outerX = Math.cos(angle) * this.size;
                    const outerY = Math.sin(angle) * this.size;
                    const innerAngle = angle + Math.PI / 4;
                    const innerX = Math.cos(innerAngle) * (this.size * 0.3);
                    const innerY = Math.sin(innerAngle) * (this.size * 0.3);
                    
                    if (i === 0) {
                        cursorCtx.moveTo(outerX, outerY);
                    } else {
                        cursorCtx.lineTo(outerX, outerY);
                    }
                    cursorCtx.lineTo(innerX, innerY);
                }
                cursorCtx.closePath();
                cursorCtx.fill();
                
                cursorCtx.restore();
            }
        }

        document.addEventListener('mousemove', (e) => {
            for (let i = 0; i < 3; i++) {
                if (sparkles.length < maxSparkles) {
                    sparkles.push(new Sparkle(
                        e.clientX + (Math.random() - 0.5) * 10,
                        e.clientY + (Math.random() - 0.5) * 10
                    ));
                }
            }
        });

        function animateCursor() {
            cursorCtx.clearRect(0, 0, cursorCanvas.width, cursorCanvas.height);
            sparkles = sparkles.filter(s => s.opacity > 0);
            sparkles.forEach(sparkle => {
                sparkle.update();
                sparkle.draw();
            });
            requestAnimationFrame(animateCursor);
        }
        animateCursor();

        // ========== METEOR SHOWER (AI Mode) ==========
        const meteorCanvas = document.getElementById('meteorCanvas');
        const meteorCtx = meteorCanvas.getContext('2d');
        let meteors = [];

        function resizeMeteorCanvas() {
            meteorCanvas.width = window.innerWidth;
            meteorCanvas.height = window.innerHeight;
        }
        resizeMeteorCanvas();
        window.addEventListener('resize', resizeMeteorCanvas);

        class Meteor {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * meteorCanvas.width * 1.5;
                this.y = -50;
                this.length = Math.random() * 80 + 40;
                this.speed = Math.random() * 8 + 6;
                this.angle = Math.PI / 4 + (Math.random() - 0.5) * 0.3;
                this.opacity = Math.random() * 0.6 + 0.4;
                this.thickness = Math.random() * 2 + 1;
                
                // Burnt orange colors
                const oranges = ['#ff6b35', '#ff3d00', '#cc3300', '#ff8c42', '#e65c00'];
                this.color = oranges[Math.floor(Math.random() * oranges.length)];
            }

            update() {
                this.x += Math.cos(this.angle) * this.speed;
                this.y += Math.sin(this.angle) * this.speed;
                
                if (this.y > meteorCanvas.height + 100 || this.x > meteorCanvas.width + 100) {
                    this.reset();
                }
            }

            draw() {
                const tailX = this.x - Math.cos(this.angle) * this.length;
                const tailY = this.y - Math.sin(this.angle) * this.length;
                
                const gradient = meteorCtx.createLinearGradient(tailX, tailY, this.x, this.y);
                gradient.addColorStop(0, 'transparent');
                gradient.addColorStop(0.5, this.color + '44');
                gradient.addColorStop(1, this.color);
                
                meteorCtx.beginPath();
                meteorCtx.moveTo(tailX, tailY);
                meteorCtx.lineTo(this.x, this.y);
                meteorCtx.strokeStyle = gradient;
                meteorCtx.lineWidth = this.thickness;
                meteorCtx.lineCap = 'round';
                meteorCtx.globalAlpha = this.opacity;
                meteorCtx.stroke();
                
                // Glow head
                meteorCtx.beginPath();
                meteorCtx.arc(this.x, this.y, this.thickness + 2, 0, Math.PI * 2);
                meteorCtx.fillStyle = this.color;
                meteorCtx.shadowColor = this.color;
                meteorCtx.shadowBlur = 20;
                meteorCtx.fill();
                meteorCtx.shadowBlur = 0;
                
                meteorCtx.globalAlpha = 1;
            }
        }

        function initMeteors() {
            meteors = [];
            for (let i = 0; i < 15; i++) {
                const m = new Meteor();
                m.y = Math.random() * meteorCanvas.height;
                m.x = Math.random() * meteorCanvas.width;
                meteors.push(m);
            }
        }

        function animateMeteors() {
            meteorCtx.clearRect(0, 0, meteorCanvas.width, meteorCanvas.height);
            meteors.forEach(m => {
                m.update();
                m.draw();
            });
            requestAnimationFrame(animateMeteors);
        }

        // ========== SNOWFLAKES (Web Mode) ==========
        const snowCanvas = document.getElementById('snowCanvas');
        const snowCtx = snowCanvas.getContext('2d');
        let snowflakes = [];

        function resizeSnowCanvas() {
            snowCanvas.width = window.innerWidth;
            snowCanvas.height = window.innerHeight;
        }
        resizeSnowCanvas();
        window.addEventListener('resize', resizeSnowCanvas);

        class Snowflake {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * snowCanvas.width;
                this.y = -20;
                this.size = Math.random() * 4 + 2;
                this.speedY = Math.random() * 1 + 0.5;
                this.speedX = (Math.random() - 0.5) * 1;
                this.wobble = Math.random() * Math.PI * 2;
                this.wobbleSpeed = Math.random() * 0.02 + 0.01;
                this.opacity = Math.random() * 0.6 + 0.4;
                this.rotation = Math.random() * Math.PI * 2;
                this.rotationSpeed = (Math.random() - 0.5) * 0.02;
            }

            update() {
                this.wobble += this.wobbleSpeed;
                this.x += this.speedX + Math.sin(this.wobble) * 0.5;
                this.y += this.speedY;
                this.rotation += this.rotationSpeed;
                
                if (this.y > snowCanvas.height + 20) {
                    this.reset();
                }
                if (this.x < -20) this.x = snowCanvas.width + 20;
                if (this.x > snowCanvas.width + 20) this.x = -20;
            }

            draw() {
                snowCtx.save();
                snowCtx.translate(this.x, this.y);
                snowCtx.rotate(this.rotation);
                snowCtx.globalAlpha = this.opacity;
                
                // Draw 6-point snowflake
                snowCtx.strokeStyle = '#00d4ff';
                snowCtx.fillStyle = '#00d4ff';
                snowCtx.shadowColor = '#00d4ff';
                snowCtx.shadowBlur = 10;
                snowCtx.lineWidth = 1;
                
                for (let i = 0; i < 6; i++) {
                    snowCtx.beginPath();
                    snowCtx.moveTo(0, 0);
                    snowCtx.lineTo(0, -this.size);
                    
                    // Branch tips
                    snowCtx.moveTo(0, -this.size * 0.6);
                    snowCtx.lineTo(-this.size * 0.3, -this.size * 0.8);
                    snowCtx.moveTo(0, -this.size * 0.6);
                    snowCtx.lineTo(this.size * 0.3, -this.size * 0.8);
                    
                    snowCtx.stroke();
                    snowCtx.rotate(Math.PI / 3);
                }
                
                // Center dot
                snowCtx.beginPath();
                snowCtx.arc(0, 0, 1, 0, Math.PI * 2);
                snowCtx.fill();
                
                snowCtx.restore();
            }
        }

        function initSnowflakes() {
            snowflakes = [];
            for (let i = 0; i < 100; i++) {
                const s = new Snowflake();
                s.y = Math.random() * snowCanvas.height;
                snowflakes.push(s);
            }
        }

        function animateSnowflakes() {
            snowCtx.clearRect(0, 0, snowCanvas.width, snowCanvas.height);
            snowflakes.forEach(s => {
                s.update();
                s.draw();
            });
            requestAnimationFrame(animateSnowflakes);
        }

        // ========== INITIALIZATION ==========
        document.addEventListener('DOMContentLoaded', () => {
            // Set initial state - AI mode
            document.body.classList.add('ai-theme');
            document.getElementById('ai-content').classList.add('active');
            document.getElementById('meteorCanvas').classList.add('active');
            
            // Initialize both particle systems
            initMeteors();
            initSnowflakes();
            animateMeteors();
            animateSnowflakes();
        });
