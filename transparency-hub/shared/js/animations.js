/**
 * ===================================================================
 * TRANSPARENCY HUB - ANIMATION CONTROLLER
 * Scroll-triggered animations & micro-interactions
 * ===================================================================
 */

class AnimationController {
    constructor(options = {}) {
        this.threshold = options.threshold || 0.2;
        this.rootMargin = options.rootMargin || '0px 0px -100px 0px';
        this.observers = new Map();

        this.init();
    }

    /**
     * Initialize animation controller
     */
    init() {
        this.setupScrollAnimations();
        this.setupStaggeredAnimations();
        this.setupCounterAnimations();

        console.log('[Animations] Controller initialized');
    }

    /**
     * Setup scroll-triggered fade-in animations
     */
    setupScrollAnimations() {
        const elements = document.querySelectorAll('.animate-on-scroll');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');

                    // Optionally unobserve after animation
                    if (entry.target.dataset.animateOnce !== 'false') {
                        observer.unobserve(entry.target);
                    }
                }
            });
        }, {
            threshold: this.threshold,
            rootMargin: this.rootMargin
        });

        elements.forEach(el => observer.observe(el));
        this.observers.set('scroll', observer);

        console.log(`[Animations] Observing ${elements.length} scroll elements`);
    }

    /**
     * Setup staggered list animations
     */
    setupStaggeredAnimations() {
        const containers = document.querySelectorAll('.stagger-container');

        containers.forEach(container => {
            const items = container.querySelectorAll('.stagger-item');

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const itemsArray = Array.from(items);
                        itemsArray.forEach((item, index) => {
                            setTimeout(() => {
                                item.classList.add('visible');
                            }, index * 100); // 100ms delay between items
                        });

                        observer.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.1
            });

            observer.observe(container);
        });

        console.log(`[Animations] Setup ${containers.length} stagger containers`);
    }

    /**
     * Setup counter animations (counting up numbers)
     */
    setupCounterAnimations() {
        const counters = document.querySelectorAll('[data-counter]');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.5
        });

        counters.forEach(counter => observer.observe(counter));
    }

    /**
     * Animate a number counting up
     */
    animateCounter(element) {
        const target = parseFloat(element.dataset.counter);
        const duration = parseInt(element.dataset.duration) || 2000;
        const prefix = element.dataset.prefix || '';
        const suffix = element.dataset.suffix || '';
        const decimals = element.dataset.decimals || 0;

        const start = 0;
        const increment = target / (duration / 16); // 60fps
        let current = start;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }

            const formattedValue = current.toFixed(decimals);
            element.textContent = `${prefix}${formattedValue}${suffix}`;
        }, 16);
    }

    /**
     * Trigger success animation
     */
    static triggerSuccess(element) {
        element.classList.add('success-bounce');
        setTimeout(() => {
            element.classList.remove('success-bounce');
        }, 600);
    }

    /**
     * Trigger error animation
     */
    static triggerError(element) {
        element.classList.add('shake');
        setTimeout(() => {
            element.classList.remove('shake');
        }, 500);
    }

    /**
     * Pulse element to draw attention
     */
    static pulse(element, duration = 2000) {
        element.classList.add('pulse');
        setTimeout(() => {
            element.classList.remove('pulse');
        }, duration);
    }

    /**
     * Destroy all observers
     */
    destroy() {
        this.observers.forEach(observer => observer.disconnect());
        this.observers.clear();
        console.log('[Animations] Destroyed');
    }
}


/**
 * ===================================================================
 * SCROLL UTILITIES
 * ===================================================================
 */

/**
 * Smooth scroll to element
 */
function scrollToElement(selector, offset = 0) {
    const element = typeof selector === 'string'
        ? document.querySelector(selector)
        : selector;

    if (element) {
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
}

/**
 * Scroll to top of page
 */
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

/**
 * Check if element is in viewport
 */
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}


/**
 * ===================================================================
 * PARALLAX EFFECT
 * ===================================================================
 */

class ParallaxEffect {
    constructor(selector, speed = 0.5) {
        this.elements = document.querySelectorAll(selector);
        this.speed = speed;

        this.init();
    }

    init() {
        if (this.elements.length === 0) return;

        window.addEventListener('scroll', () => {
            this.update();
        });

        this.update();
        console.log(`[Parallax] Initialized ${this.elements.length} elements`);
    }

    update() {
        const scrolled = window.pageYOffset;

        this.elements.forEach(element => {
            const offset = element.offsetTop;
            const distance = scrolled - offset;
            const translate = distance * this.speed;

            element.style.transform = `translateY(${translate}px)`;
        });
    }
}


/**
 * ===================================================================
 * TYPING EFFECT
 * ===================================================================
 */

class TypingEffect {
    constructor(element, options = {}) {
        this.element = typeof element === 'string'
            ? document.querySelector(element)
            : element;

        this.text = options.text || this.element.textContent;
        this.speed = options.speed || 50;
        this.delay = options.delay || 0;
        this.cursor = options.cursor !== false;

        this.init();
    }

    init() {
        if (!this.element) return;

        this.element.textContent = '';

        if (this.cursor) {
            this.element.classList.add('typing-cursor');
        }

        setTimeout(() => {
            this.type();
        }, this.delay);
    }

    type() {
        let i = 0;
        const typeInterval = setInterval(() => {
            if (i < this.text.length) {
                this.element.textContent += this.text.charAt(i);
                i++;
            } else {
                clearInterval(typeInterval);
                if (this.cursor) {
                    this.element.classList.remove('typing-cursor');
                }
            }
        }, this.speed);
    }
}


/**
 * ===================================================================
 * PAGE TRANSITIONS
 * ===================================================================
 */

/**
 * Fade in page on load
 */
function initPageTransition() {
    document.body.classList.add('page-transition-enter');

    setTimeout(() => {
        document.body.classList.remove('page-transition-enter');
    }, 500);
}

/**
 * Fade out before navigation
 */
function exitPageTransition(callback) {
    document.body.classList.add('page-transition-exit');

    setTimeout(() => {
        if (callback) callback();
    }, 400);
}


/**
 * ===================================================================
 * CONFETTI CELEBRATION (lightweight)
 * ===================================================================
 */

function celebrate() {
    const colors = ['#0092CA', '#10B981', '#F59E0B', '#3B82F6'];
    const confettiCount = 50;

    for (let i = 0; i < confettiCount; i++) {
        createConfetti(colors[Math.floor(Math.random() * colors.length)]);
    }
}

function createConfetti(color) {
    const confetti = document.createElement('div');
    confetti.style.cssText = `
        position: fixed;
        width: 10px;
        height: 10px;
        background-color: ${color};
        left: ${Math.random() * 100}vw;
        top: -10px;
        opacity: ${Math.random() + 0.5};
        transform: rotate(${Math.random() * 360}deg);
        z-index: 9999;
        pointer-events: none;
    `;

    document.body.appendChild(confetti);

    const fallDuration = Math.random() * 3 + 2;
    const swayDistance = Math.random() * 100 - 50;

    confetti.animate([
        { transform: `translateY(0) translateX(0) rotate(0deg)`, opacity: 1 },
        { transform: `translateY(100vh) translateX(${swayDistance}px) rotate(720deg)`, opacity: 0 }
    ], {
        duration: fallDuration * 1000,
        easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
    });

    setTimeout(() => {
        confetti.remove();
    }, fallDuration * 1000);
}


/**
 * ===================================================================
 * TOAST NOTIFICATIONS
 * ===================================================================
 */

class ToastNotification {
    static show(message, type = 'info', duration = 3000) {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;

        const icons = {
            success: 'fa-circle-check',
            error: 'fa-circle-xmark',
            warning: 'fa-triangle-exclamation',
            info: 'fa-circle-info'
        };

        toast.innerHTML = `
            <i class="fas ${icons[type]}"></i>
            <span>${message}</span>
        `;

        toast.style.cssText = `
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            background: var(--white);
            padding: 1rem 1.5rem;
            border-radius: var(--radius-md);
            box-shadow: var(--shadow-lg);
            display: flex;
            align-items: center;
            gap: 0.75rem;
            z-index: 9999;
            animation: slideInRight 0.4s ease-out;
        `;

        // Type-specific styling
        const colors = {
            success: 'var(--success-green)',
            error: 'var(--danger-red)',
            warning: 'var(--warning-orange)',
            info: 'var(--payerset-blue)'
        };

        toast.style.borderLeft = `4px solid ${colors[type]}`;
        toast.querySelector('i').style.color = colors[type];

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'fadeOut 0.4s ease-out';
            setTimeout(() => {
                toast.remove();
            }, 400);
        }, duration);
    }
}


/**
 * ===================================================================
 * AUTO-INITIALIZATION
 * ===================================================================
 */

// Initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', autoInit);
} else {
    autoInit();
}

function autoInit() {
    // Initialize animation controller
    window.animationController = new AnimationController();

    // Initialize page transition
    initPageTransition();

    console.log('[Animations] Auto-initialized');
}


/**
 * ===================================================================
 * EXPORTS
 * ===================================================================
 */

window.AnimationController = AnimationController;
window.ParallaxEffect = ParallaxEffect;
window.TypingEffect = TypingEffect;
window.ToastNotification = ToastNotification;

window.animationUtils = {
    scrollToElement,
    scrollToTop,
    isInViewport,
    celebrate,
    initPageTransition,
    exitPageTransition
};

console.log('[Animations] Module loaded');
