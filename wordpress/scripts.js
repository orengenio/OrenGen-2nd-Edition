/**
 * OrenGen.io - Main JavaScript
 * All interactive functionality for the website
 */

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
    
    // ==========================================
    // THEME TOGGLE
    // ==========================================
    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;
    
    // Load saved theme
    const currentTheme = localStorage.getItem('theme') || 'light';
    html.setAttribute('data-theme', currentTheme);
    
    // Theme toggle functionality
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const theme = html.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
            html.setAttribute('data-theme', theme);
            localStorage.setItem('theme', theme);
        });
    }
    
    
    // ==========================================
    // TRANSLATE TOGGLE
    // ==========================================
    const translateToggle = document.getElementById('translateToggle');
    const translateElement = document.getElementById('google_translate_element');
    
    if (translateToggle && translateElement) {
        translateToggle.addEventListener('click', () => {
            if (translateElement.style.display === 'none') {
                translateElement.style.display = 'block';
            } else {
                translateElement.style.display = 'none';
            }
        });
    }
    
    
    // ==========================================
    // BUY-LINGUAL LANGUAGE DEMO
    // ==========================================
    const languageButtons = document.querySelectorAll('.lang-btn');
    const demoTextElement = document.getElementById('demoText');
    
    const translations = {
        english: {
            text: "Hello! I'm your AI assistant. How can I help you today?",
            label: "English"
        },
        spanish: {
            text: "¡Hola! Soy tu asistente de IA. ¿Cómo puedo ayudarte hoy?",
            label: "Spanish"
        },
        french: {
            text: "Bonjour! Je suis votre assistant IA. Comment puis-je vous aider aujourd'hui?",
            label: "French"
        },
        chinese: {
            text: "你好！我是您的AI助手。今天我能帮您什么？",
            label: "Chinese (Mandarin)"
        }
    };
    
    // Typing effect function
    function typeText(text, element, speed = 40) {
        element.innerHTML = '';
        let index = 0;
        
        function type() {
            if (index < text.length) {
                element.innerHTML += text.charAt(index);
                index++;
                setTimeout(type, speed);
            } else {
                // Add cursor at the end
                element.innerHTML += '<span class="typing-cursor"></span>';
            }
        }
        
        type();
    }
    
    // Language button click handlers
    languageButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            languageButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');
            
            // Get the language
            const lang = button.dataset.lang;
            
            // Type the translation
            if (demoTextElement && translations[lang]) {
                typeText(translations[lang].text, demoTextElement);
            }
        });
    });
    
    
    // ==========================================
    // PRICING PAGE - BILLING TOGGLE
    // ==========================================
    const billingToggle = document.getElementById('billingToggle');
    
    if (billingToggle) {
        const monthlyLabels = document.querySelectorAll('.monthly-label, .monthly-price, .monthly-text');
        const annualLabels = document.querySelectorAll('.annual-label, .annual-price, .annual-text');
        
        billingToggle.addEventListener('click', () => {
            billingToggle.classList.toggle('annual');
            
            if (billingToggle.classList.contains('annual')) {
                monthlyLabels.forEach(el => {
                    if (el.classList.contains('monthly-label')) {
                        el.classList.remove('active');
                    } else {
                        el.style.display = 'none';
                    }
                });
                annualLabels.forEach(el => {
                    if (el.classList.contains('annual-label')) {
                        el.classList.add('active');
                    } else {
                        el.style.display = 'inline';
                    }
                });
            } else {
                monthlyLabels.forEach(el => {
                    if (el.classList.contains('monthly-label')) {
                        el.classList.add('active');
                    } else {
                        el.style.display = 'inline';
                    }
                });
                annualLabels.forEach(el => {
                    if (el.classList.contains('annual-label')) {
                        el.classList.remove('active');
                    } else {
                        el.style.display = 'none';
                    }
                });
            }
        });
    }
    
    
    // ==========================================
    // URL PARAMETER HANDLING
    // ==========================================
    const urlParams = new URLSearchParams(window.location.search);
    
    // Pricing page - highlight selected plan
    const selectedPlan = urlParams.get('plan');
    if (selectedPlan) {
        const planCard = document.querySelector(`[href*="plan=${selectedPlan}"]`)?.closest('.pricing-card');
        if (planCard) {
            planCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
            planCard.style.animation = 'pulse 1s ease-in-out 3';
        }
        
        // Contact page - pre-fill interest field
        const interestSelect = document.getElementById('interest');
        if (interestSelect) {
            const planMapping = {
                'starter': 'buy-lingual',
                'professional': 'buy-lingual',
                'enterprise': 'custom-ai',
                'trial': 'trial',
                'demo': 'demo'
            };
            
            const mappedValue = planMapping[selectedPlan] || selectedPlan;
            
            for (let option of interestSelect.options) {
                if (option.value === mappedValue) {
                    option.selected = true;
                    break;
                }
            }
        }
    }
    
    
    // ==========================================
    // CONTACT FORM HANDLING
    // ==========================================
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            // Add custom validation or tracking here
            console.log('Form submitted');
            // Form will submit normally to Formspree or your backend
        });
    }
    
    
    // ==========================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // ==========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
});


// ==========================================
// GOOGLE TRANSLATE INITIALIZATION
// ==========================================
function googleTranslateElementInit() {
    new google.translate.TranslateElement({
        pageLanguage: 'en',
        includedLanguages: 'en,es,fr,de,it,pt,ru,zh-CN,ja,ko,ar,hi,bn,pa,te,mr,ta,ur,gu,kn,ml,th,vi,id,ms,fil',
        layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
        autoDisplay: false
    }, 'google_translate_element');
}


// ==========================================
// UNICORN STUDIO PARALLAX (Homepage only)
// ==========================================
if (document.querySelector('.parallax-container')) {
    // Initialize UnicornStudio if on homepage
    // The embed code will be in the HTML
    console.log('UnicornStudio parallax loaded');
}
