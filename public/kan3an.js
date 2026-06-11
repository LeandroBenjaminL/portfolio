const AppState = {
    currentLang: 'en',
    currentTheme: 'dark',
    currentSection: 'home',
    isMenuOpen: false,
    isLoaded: false
};

document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    loadPreferences();
    initLanguage();
    initTheme();
    initNavigation();
    initScrollEffects();
    initFormHandlers();
    initMobileMenu();
    updateLanguageUI();
    updateThemeUI();
    AppState.isLoaded = true;
}

function loadPreferences() {
    const savedLang = localStorage.getItem('portfolio-lang');
    const savedTheme = localStorage.getItem('portfolio-theme');
    if (savedLang) AppState.currentLang = savedLang;
    if (savedTheme) AppState.currentTheme = savedTheme;
}

function initLanguage() {
    const langToggle = document.getElementById('langToggle');
    if (langToggle) langToggle.addEventListener('click', toggleLanguage);
    setLanguage(AppState.currentLang);
}

function toggleLanguage() {
    const newLang = AppState.currentLang === 'en' ? 'ar' : 'en';
    setLanguage(newLang);
    localStorage.setItem('portfolio-lang', newLang);
}

function setLanguage(lang) {
    AppState.currentLang = lang;
    const html = document.documentElement;
    const body = document.body;
    if (lang === 'ar') {
        html.setAttribute('lang', 'ar'); html.setAttribute('dir', 'rtl');
        body.setAttribute('data-lang', 'ar'); body.setAttribute('data-dir', 'rtl');
    } else {
        html.setAttribute('lang', 'en'); html.setAttribute('dir', 'ltr');
        body.setAttribute('data-lang', 'en'); body.setAttribute('data-dir', 'ltr');
    }
    updateLanguageUI();
}

function updateLanguageUI() {
    const textElements = document.querySelectorAll('[data-text-en], [data-text-ar]');
    textElements.forEach(element => {
        const enText = element.getAttribute('data-text-en');
        const arText = element.getAttribute('data-text-ar');
        if (AppState.currentLang === 'ar' && arText) element.textContent = arText;
        else if (AppState.currentLang === 'en' && enText) element.textContent = enText;
    });
    const placeholderElements = document.querySelectorAll('[data-placeholder-en], [data-placeholder-ar]');
    placeholderElements.forEach(element => {
        const enPlaceholder = element.getAttribute('data-placeholder-en');
        const arPlaceholder = element.getAttribute('data-placeholder-ar');
        if (AppState.currentLang === 'ar' && arPlaceholder) element.setAttribute('placeholder', arPlaceholder);
        else if (AppState.currentLang === 'en' && enPlaceholder) element.setAttribute('placeholder', enPlaceholder);
    });
    const langToggle = document.getElementById('langToggle');
    if (langToggle) {
        const langText = langToggle.querySelector('.lang-text');
        if (langText) langText.textContent = AppState.currentLang === 'en' ? 'AR' : 'EN';
    }
}

function initTheme() {
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) themeToggle.addEventListener('click', toggleTheme);
    setTheme(AppState.currentTheme);
}

function toggleTheme() {
    const newTheme = AppState.currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('portfolio-theme', newTheme);
}

function setTheme(theme) {
    AppState.currentTheme = theme;
    document.body.setAttribute('data-theme', theme);
    updateThemeUI();
}

function updateThemeUI() {
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        const icon = themeToggle.querySelector('i');
        if (icon) icon.className = AppState.currentTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
}

function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                const headerHeight = document.querySelector('.main-header').offsetHeight;
                window.scrollTo({ top: targetSection.offsetTop - headerHeight, behavior: 'smooth' });
                updateActiveNavLink(link);
                if (AppState.isMenuOpen) toggleMobileMenu();
            }
        });
    });
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('scroll', updateHeaderOnScroll);
}

function handleScroll() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.scrollY + 100;
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            AppState.currentSection = sectionId;
            updateActiveNavLink(null, sectionId);
        }
    });
}

function updateActiveNavLink(clickedLink, sectionId = null) {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (clickedLink && link === clickedLink) link.classList.add('active');
        else if (sectionId) {
            const linkSection = link.getAttribute('data-section');
            if (linkSection === sectionId) link.classList.add('active');
        }
    });
}

function updateHeaderOnScroll() {
    const header = document.querySelector('.main-header');
    header.classList.toggle('scrolled', window.scrollY > 50);
}

function initScrollEffects() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -100px 0px' });
    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
    document.querySelectorAll('.section').forEach(el => observer.observe(el));
}

function initFormHandlers() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) contactForm.addEventListener('submit', handleFormSubmit);
}

function handleFormSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    const subject = encodeURIComponent(data.asunto || 'Contacto desde portfolio');
    const body = encodeURIComponent('Nombre: ' + (data.nombre || '') + '\nEmail: ' + (data.email || '') + '\n\nMensaje:\n' + (data.mensaje || ''));
    window.location.href = 'mailto:leandrobenjaminnn@gmail.com?subject=' + subject + '&body=' + body;
}

function initMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    if (menuToggle) menuToggle.addEventListener('click', toggleMobileMenu);
    document.addEventListener('click', (e) => {
        const navMenu = document.getElementById('navMenu');
        if (AppState.isMenuOpen && !navMenu.contains(e.target) && !document.getElementById('menuToggle').contains(e.target)) {
            toggleMobileMenu();
        }
    });
}

function toggleMobileMenu() {
    AppState.isMenuOpen = !AppState.isMenuOpen;
    const navMenu = document.getElementById('navMenu');
    const menuToggle = document.getElementById('menuToggle');
    if (navMenu) navMenu.classList.toggle('active', AppState.isMenuOpen);
    if (menuToggle) menuToggle.classList.toggle('active', AppState.isMenuOpen);
}

function generateParticles() {
    const container = document.getElementById('particles');
    if (!container) return;
    const symbols = ['{', '}', '[', ']', '(', ')', '<', '>', '/', '*', '=', '+', '-', ';', ':', '&', '|', '%', '$', '#', '@'];
    for (let i = 0; i < 20; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        p.textContent = symbols[Math.floor(Math.random() * symbols.length)];
        p.style.left = Math.random() * 100 + '%';
        p.style.animationDelay = Math.random() * 15 + 's';
        p.style.animationDuration = (10 + Math.random() * 10) + 's';
        container.appendChild(p);
    }
}

document.addEventListener('DOMContentLoaded', generateParticles);

// animations.js
function inView(element, callback, options = {}) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                callback(entry);
                if (options.once !== false) observer.unobserve(entry.target);
            }
        });
    }, { threshold: options.amount || 0.1, rootMargin: options.rootMargin || '0px' });
    observer.observe(element);
    return () => observer.unobserve(element);
}

function animateElement(element, props, options = {}) {
    if (typeof anime === 'undefined') return;
    const animeProps = {};
    if (props.opacity) animeProps.opacity = props.opacity;
    if (props.x !== undefined) animeProps.translateX = props.x;
    if (props.y !== undefined) animeProps.translateY = props.y;
    if (props.scale) animeProps.scale = props.scale;
    return anime({
        targets: element, ...animeProps,
        duration: (options.duration || 0.8) * 1000,
        delay: (options.delay || 0) * 1000,
        easing: options.easing || 'easeOutExpo'
    });
}

window.addEventListener('load', () => setTimeout(() => initLoaderAnimation(), 100));

function initLoaderAnimation() {
    const loader = document.getElementById('loader');
    const loaderPercent = document.getElementById('loaderPercent');
    if (!loader || !loaderPercent) return;
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 30;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            setTimeout(() => {
                if (typeof anime !== 'undefined') {
                    anime({
                        targets: loader, opacity: [1, 0], duration: 500, easing: 'easeInOutQuad',
                        complete: () => { loader.classList.add('hidden'); initPageAnimations(); }
                    });
                } else {
                    loader.classList.add('hidden');
                    initPageAnimations();
                }
            }, 300);
        }
        loaderPercent.textContent = Math.floor(progress) + '%';
    }, 100);
}

function initPageAnimations() {
    setTimeout(() => {
        initHeroAnimations();
        initSkillAnimations();
        initTimelineAnimations();
        initProjectAnimations();
        initScrollAnimations();
        initContactAnimations();
        animateStats();
        initParallax();
        initSmoothScroll();
    }, 300);
}

function initHeroAnimations() {
    if (typeof anime === 'undefined') return;
    const heroName = document.getElementById('heroName');
    if (heroName) {
        const nameValue = heroName.querySelector('.name-value');
        if (nameValue) {
            const text = nameValue.textContent;
            nameValue.textContent = '';
            anime({
                targets: { value: 0 }, value: text.length, duration: 1500, delay: 500, easing: 'easeInOutQuad',
                update: anim => {
                    const len = Math.floor(anim.animatables[0].target.value);
                    nameValue.textContent = text.substring(0, len);
                },
                complete: () => {
                    const cursor = document.createElement('span');
                    cursor.className = 'name-cursor';
                    cursor.textContent = '|';
                    cursor.style.animation = 'blink 1s infinite';
                    nameValue.appendChild(cursor);
                    setTimeout(() => cursor.remove(), 2000);
                }
            });
        }
    }
    const els = [
        { el: document.querySelector('.hero-title'), opt: { opacity: [0, 1], translateX: [-30, 0] }, d: 800, dur: 1000 },
        { el: document.querySelector('.hero-description'), opt: { opacity: [0, 1], translateY: [20, 0] }, d: 1200, dur: 1000 },
    ];
    els.forEach(({ el, opt, d, dur }) => { if (el) anime({ targets: el, ...opt, delay: d, duration: dur, easing: 'easeOutExpo' }); });
    document.querySelectorAll('.hero-buttons .btn').forEach((el, i) => anime({ targets: el, opacity: [0, 1], scale: [0.8, 1], delay: 1500 + i * 100, duration: 800, easing: 'easeOutBack' }));
    const profileImage = document.getElementById('profileImage');
    if (profileImage) {
        anime({ targets: profileImage, opacity: [0, 1], scale: [0.8, 1], rotate: [180, 0], delay: 1000, duration: 1500, easing: 'easeOutElastic(1, .8)' });
        profileImage.addEventListener('mouseenter', () => anime({ targets: profileImage, scale: [1, 1.1], rotate: [0, 5], duration: 500, easing: 'easeOutElastic(1, .8)' }));
        profileImage.addEventListener('mouseleave', () => anime({ targets: profileImage, scale: [1.1, 1], rotate: [5, 0], duration: 500, easing: 'easeOutElastic(1, .8)' }));
    }
    document.querySelectorAll('.social-icon').forEach((el, i) => anime({ targets: el, opacity: [0, 1], scale: [0, 1], rotate: [180, 0], delay: 2000 + i * 100, duration: 800, easing: 'easeOutBack' }));
    document.querySelectorAll('.floating-badge').forEach((el, i) => anime({ targets: el, opacity: [0, 1], scale: [0, 1], delay: 1500 + i * 200, duration: 800, easing: 'easeOutBack' }));
}

function initSkillAnimations() {
    const section = document.getElementById('skills');
    if (!section) return;
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const item = entry.target;
                const bar = item.querySelector('.skill-progress');
                const pct = item.querySelector('.skill-percent');
                const target = parseInt(item.getAttribute('data-percent') || 0);
                if (bar && typeof anime !== 'undefined') {
                    anime({ targets: bar, width: ['0%', target + '%'], duration: 2000, easing: 'easeOutExpo', delay: 300 });
                    anime({ targets: { value: 0 }, value: target, duration: 2000, easing: 'easeOutExpo', delay: 300, update: a => { if (pct) pct.textContent = Math.floor(a.animatables[0].target.value) + '%'; } });
                }
                observer.unobserve(item);
            }
        });
    }, { threshold: 0.5 });
    section.querySelectorAll('.skill-item').forEach(item => observer.observe(item));
}

function initTimelineAnimations() {
    document.querySelectorAll('.timeline-item').forEach((item, i) => {
        inView(item, () => {
            if (typeof anime !== 'undefined') anime({ targets: item, opacity: [0, 1], translateX: [-50, 0], delay: i * 150, duration: 1000, easing: 'easeOutExpo' });
        }, { amount: 0.3 });
    });
}

function initProjectAnimations() {
    document.querySelectorAll('.project-card').forEach((card, i) => {
        inView(card, () => {
            if (typeof anime !== 'undefined') anime({ targets: card, opacity: [0, 1], translateY: [50, 0], scale: [0.9, 1], delay: i * 100, duration: 1000, easing: 'easeOutExpo' });
        }, { amount: 0.2 });
        card.addEventListener('mouseenter', () => { if (typeof anime !== 'undefined') anime({ targets: card, scale: [1, 1.02], duration: 300, easing: 'easeOutQuad' }); });
        card.addEventListener('mouseleave', () => { if (typeof anime !== 'undefined') anime({ targets: card, scale: [1.02, 1], duration: 300, easing: 'easeOutQuad' }); });
    });
}

function initScrollAnimations() {
    document.querySelectorAll('.section').forEach(section => {
        inView(section, () => {
            const h = section.querySelector('.section-header');
            if (h && typeof anime !== 'undefined') anime({ targets: h, opacity: [0, 1], translateY: [-20, 0], duration: 600, easing: 'easeOutExpo' });
        }, { amount: 0.2 });
    });
    document.querySelectorAll('.project-card, .contact-item').forEach((card, i) => {
        inView(card, () => {
            if (typeof anime !== 'undefined') anime({ targets: card, opacity: [0, 1], translateY: [30, 0], delay: i * 30, duration: 500, easing: 'easeOutExpo' });
        }, { amount: 0.2 });
    });
}

function animateStats() {
    document.querySelectorAll('.stat-number').forEach(stat => {
        const target = parseInt(stat.getAttribute('data-count') || 0);
        inView(stat, () => {
            if (typeof anime !== 'undefined') anime({ targets: { value: 0 }, value: target, duration: 2000, easing: 'easeOutExpo', update: a => { stat.textContent = Math.floor(a.animatables[0].target.value); } });
        }, { amount: 0.5 });
    });
}

function initContactAnimations() {
    document.querySelectorAll('.contact-item').forEach(item => {
        item.addEventListener('mouseenter', () => { if (typeof anime !== 'undefined') anime({ targets: item, scale: [1, 1.02], duration: 200, easing: 'easeOutQuad' }); });
        item.addEventListener('mouseleave', () => { if (typeof anime !== 'undefined') anime({ targets: item, scale: [1.02, 1], duration: 200, easing: 'easeOutQuad' }); });
    });
}

function initParallax() {
    const profileImage = document.getElementById('profileImage');
    if (!profileImage) return;
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrolled = window.pageYOffset;
                profileImage.style.transform = `translateY(${Math.min(scrolled * 0.3, 100)}px)`;
                const gridBg = document.querySelector('.code-grid-bg');
                if (gridBg) gridBg.style.transform = `translateY(${scrolled * 0.2}px)`;
                ticking = false;
            });
            ticking = true;
        }
    });
}

function initSmoothScroll() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                const headerHeight = document.querySelector('.main-header').offsetHeight;
                if (typeof anime !== 'undefined') anime({ targets: window, scrollTop: targetSection.offsetTop - headerHeight, duration: 800, easing: 'easeInOutQuad' });
                else window.scrollTo({ top: targetSection.offsetTop - headerHeight, behavior: 'smooth' });
            }
        });
    });
    let currentSection = '';
    window.addEventListener('scroll', () => {
        const scrollPos = window.scrollY + 150;
        sections.forEach(section => {
            const top = section.offsetTop, h = section.offsetHeight, id = section.getAttribute('id');
            if (scrollPos >= top && scrollPos < top + h && currentSection !== id) {
                currentSection = id;
                navLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === '#' + id);
                });
            }
        });
    });
}
