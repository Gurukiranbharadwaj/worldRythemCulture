document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // Navbar Scroll Effect
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
        // initial check
        if (window.scrollY > 50) navbar.classList.add('scrolled');
    }

    // Mobile Menu Toggle
    const mobileToggle = document.getElementById('mobile-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const toggleIcon = document.getElementById('toggle-icon');

    if (mobileToggle && mobileMenu) {
        let isMenuOpen = false;

        mobileToggle.addEventListener('click', () => {
            isMenuOpen = !isMenuOpen;
            if (isMenuOpen) {
                mobileMenu.classList.add('show');
                // Change to X icon
                toggleIcon.innerHTML = '<line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>';
            } else {
                mobileMenu.classList.remove('show');
                // Change back to Menu icon
                toggleIcon.innerHTML = '<line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line>';
            }
        });
    }

    // Intersection Observer for Animations (Replaces Framer Motion 'whileInView')
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    if (animatedElements.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    
                    // Smart Lazy Load Section Backgrounds
                    if (entry.target.dataset.bg) {
                        entry.target.style.backgroundImage = entry.target.dataset.bg;
                        entry.target.removeAttribute('data-bg');
                    }
                    // Also process any child elements that have data-bg
                    const lazyBgs = entry.target.querySelectorAll('[data-bg]');
                    lazyBgs.forEach(bgEl => {
                        bgEl.style.backgroundImage = bgEl.dataset.bg;
                        bgEl.removeAttribute('data-bg');
                    });

                    // observer.unobserve(entry.target);
                }
            });
        }, {
            root: null,
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        });

        animatedElements.forEach(el => observer.observe(el));
    }

    // Active Link Highlighting based on current page
    const navLinks = document.querySelectorAll('.nav-link');
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        // Handle hash links correctly
        if (href === '/' && currentPath === 'index.html' && window.location.hash === '') {
            link.style.color = 'var(--color-orange)';
        } else if (href && href.includes(currentPath) && currentPath !== 'index.html') {
            link.style.color = 'var(--color-orange)';
        }
        
        link.addEventListener('mouseenter', () => {
            link.style.color = 'var(--color-orange)';
        });
        
        link.addEventListener('mouseleave', () => {
            const isHashLink = href && href.startsWith('/#');
            const isActive = isHashLink ? (currentPath === 'index.html' && window.location.hash === href.substring(1)) 
                                        : (href && href.includes(currentPath) || (currentPath==='index.html' && href==='/'));
            
            if (!isActive) link.style.color = 'var(--color-gray)';
        });
    });

    // FAQ Accordion Trigger
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const trigger = item.querySelector('.faq-trigger');
        const content = item.querySelector('.faq-content');
        
        if (trigger && content) {
            trigger.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                
                // Close all other FAQ items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                        const otherContent = otherItem.querySelector('.faq-content');
                        if (otherContent) otherContent.style.maxHeight = null;
                    }
                });
                
                // Toggle current FAQ item
                if (isActive) {
                    item.classList.remove('active');
                    content.style.maxHeight = null;
                } else {
                    item.classList.add('active');
                    content.style.maxHeight = content.scrollHeight + 'px';
                }
            });
        }
    });

    // Video and IFrame Lazy Loading & Dynamic Unloading on scroll
    const lazyMediaElements = document.querySelectorAll('video[data-src], iframe[data-src]');
    
    if (lazyMediaElements.length > 0 && typeof IntersectionObserver !== 'undefined') {
        const mediaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const element = entry.target;
                const src = element.getAttribute('data-src');
                
                if (entry.isIntersecting) {
                    // Set src if it hasn't been set yet
                    if (element.src !== src && !element.src.endsWith(src)) {
                        element.src = src;
                        if (element.tagName === 'VIDEO') {
                            element.load();
                        }
                    }
                    
                    // If video is supposed to autoplay, play it
                    if (element.tagName === 'VIDEO' && element.hasAttribute('autoplay')) {
                        element.play().catch(err => {
                            console.log("Autoplay prevented or failed:", err);
                        });
                    }
                } else {
                    // Out of viewport: pause and unload to stop downloading/buffering
                    if (element.tagName === 'VIDEO') {
                        element.pause();
                        if (element.src) {
                            element.removeAttribute('src');
                            element.load();
                        }
                    } else if (element.tagName === 'IFRAME') {
                        if (element.src) {
                            element.removeAttribute('src');
                        }
                    }
                }
            });
        }, {
            root: null,
            threshold: 0,
            rootMargin: '100px 0px 100px 0px' // Load slightly before it enters the viewport
        });
        
        lazyMediaElements.forEach(el => mediaObserver.observe(el));
    }
});

