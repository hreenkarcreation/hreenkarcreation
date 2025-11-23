// ============================================================================
// PREMIUM WEBSITE INTERACTIVITY - SCRIPT.JS
// Advanced JavaScript for Hreenkar Creation & Kambeshwar Agencies Website
// ============================================================================

(function() {
    'use strict';

    // ========================================================================
    // CONFIGURATION & CONSTANTS
    // ========================================================================
    const CONFIG = {
        scrollThreshold: 100,
        animationDuration: 800,
        debounceDelay: 150,
        counterSpeed: 2000,
        carouselAutoplayDelay: 5000
    };
    
    // Find this section in your script.js and replace it completely

// Initialize EmailJS
emailjs.init('MR87pdkp-Hr9AcuQ1');

// Contact Form Handling
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;

    // Remove any existing event listeners
    const newForm = contactForm.cloneNode(true);
    contactForm.parentNode.replaceChild(newForm, contactForm);
    
    newForm.addEventListener('submit', function(e) {
        e.preventDefault(); // Stop form from submitting normally
        e.stopPropagation(); // Stop event propagation
        
        const submitBtn = document.getElementById('submit-btn');
        const formStatus = document.getElementById('form-status');
        
        // Clear previous status
        formStatus.textContent = '';
        formStatus.className = 'form-status-message';
        
        // Disable button and show loading state
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
        
        // Prepare template parameters
        const templateParams = {
            full_name: document.getElementById('full-name').value.trim(),
            email: document.getElementById('email').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            company_name: document.getElementById('company-name').value.trim() || 'Not provided',
            inquiry_type: document.getElementById('inquiry-type').value,
            message: document.getElementById('message').value.trim()
        };
        
        // Validate required fields
        if (!templateParams.full_name || !templateParams.email || !templateParams.phone || !templateParams.inquiry_type || !templateParams.message) {
            formStatus.textContent = '✗ Please fill in all required fields.';
            formStatus.className = 'form-status-message error';
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send Message';
            return false;
        }
        
        // Send email using EmailJS
        emailjs.send('service_whh1lzt', 'template_6nlkrtp', templateParams)
            .then(function(response) {
                // Success
                formStatus.textContent = '✓ Message sent successfully! We will contact you soon.';
                formStatus.className = 'form-status-message success';
                
                // Reset form
                newForm.reset();
                
                // Re-enable button
                submitBtn.disabled = false;
                submitBtn.textContent = 'Send Message';
                
                // Clear message after 5 seconds
                setTimeout(() => {
                    formStatus.textContent = '';
                }, 5000);
            })
            .catch(function(error) {
                // Error
                console.error('Email sending failed:', error);
                formStatus.textContent = '✗ Failed to send message. Please try again or contact us directly.';
                formStatus.className = 'form-status-message error';
                
                // Re-enable button
                submitBtn.disabled = false;
                submitBtn.textContent = 'Send Message';
            });
        
        return false; // Ensure form doesn't submit
    });
}

// Call this in your init() function
// Add initContactForm() to your init() function

    // ========================================================================
    // UTILITY FUNCTIONS
    // ========================================================================
    
    // Debounce function for performance optimization
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Throttle function for scroll events
    function throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ========================================================================
    // SMOOTH SCROLL NAVIGATION
    // ========================================================================
    function initSmoothScroll() {
        const navLinks = document.querySelectorAll('a[href^="#"]');
        
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                
                if (href === '#' || !href) return;
                
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const headerHeight = document.querySelector('.site-header')?.offsetHeight || 80;
                    const targetPosition = targetElement.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: prefersReducedMotion ? 'auto' : 'smooth'
                    });
                    
                    // Close mobile menu if open
                    const mobileMenu = document.querySelector('.nav-menu');
                    if (mobileMenu && mobileMenu.classList.contains('active')) {
                        toggleMobileMenu();
                    }
                }
            });
        });
    }

    // ========================================================================
    // ACTIVE NAVIGATION HIGHLIGHTING
    // ========================================================================
    function initActiveNavigation() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        const observerOptions = {
            root: null,
            rootMargin: '-20% 0px -70% 0px',
            threshold: 0
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.getAttribute('id');
                    
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${sectionId}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }, observerOptions);
        
        sections.forEach(section => observer.observe(section));
    }

    // ========================================================================
    // MOBILE MENU TOGGLE
    // ========================================================================
    function toggleMobileMenu() {
        const menuToggle = document.querySelector('.mobile-menu-toggle');
        const navMenu = document.querySelector('.nav-menu');
        const body = document.body;
        
        if (!menuToggle || !navMenu) return;
        
        const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
        
        menuToggle.setAttribute('aria-expanded', !isExpanded);
        navMenu.classList.toggle('active');
        menuToggle.classList.toggle('active');
        body.classList.toggle('menu-open');
    }

    function initMobileMenu() {
        const menuToggle = document.querySelector('.mobile-menu-toggle');
        
        if (menuToggle) {
            menuToggle.addEventListener('click', toggleMobileMenu);
        }
    }

    // ========================================================================
    // HEADER SCROLL EFFECT
    // ========================================================================
    function initHeaderScrollEffect() {
        const header = document.querySelector('.site-header');
        
        if (!header) return;
        
        const handleScroll = throttle(() => {
            if (window.scrollY > CONFIG.scrollThreshold) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }, 100);
        
        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Check initial state
    }

    // ========================================================================
    // PARALLAX SCROLLING EFFECT
    // ========================================================================
    function initParallaxEffect() {
        if (prefersReducedMotion) return;
        
        const heroSection = document.querySelector('.hero-section');
        
        if (!heroSection) return;
        
        const handleParallax = throttle(() => {
            const scrolled = window.pageYOffset;
            const parallaxSpeed = 0.5;
            heroSection.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
        }, 16);
        
        window.addEventListener('scroll', handleParallax);
    }

    // ========================================================================
    // SCROLL ANIMATIONS WITH INTERSECTION OBSERVER
    // ========================================================================
    function initScrollAnimations() {
        if (prefersReducedMotion) return;
        
        const animatedElements = document.querySelectorAll(
            '.brand-card, .advantage-card, .service-category, .stat-card, .about-text-content, .contact-form-container, .contact-info-container'
        );
        
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('animate-in');
                    }, index * 100);
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        animatedElements.forEach(el => {
            el.classList.add('animate-element');
            observer.observe(el);
        });
    }

    // ========================================================================
    // COUNTER ANIMATION
    // ========================================================================
    function animateCounter(element) {
        const target = parseInt(element.getAttribute('data-count')) || parseInt(element.textContent);
        const duration = CONFIG.counterSpeed;
        const increment = target / (duration / 16);
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target + '+';
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current) + '+';
            }
        }, 16);
    }

    function initCounterAnimations() {
        const counters = document.querySelectorAll('.stat-number[data-count]');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                    entry.target.classList.add('counted');
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        counters.forEach(counter => observer.observe(counter));
    }

    // ========================================================================
    // BRAND MODAL FUNCTIONALITY
    // ========================================================================
    function createBrandModal() {
        const modal = document.createElement('div');
        modal.className = 'brand-modal';
        modal.innerHTML = `
            <div class="modal-backdrop"></div>
            <div class="modal-content">
                <button class="modal-close" aria-label="Close modal">&times;</button>
                <div class="modal-body">
                    <img src="" alt="" class="modal-brand-logo">
                    <h3 class="modal-brand-name"></h3>
                    <p class="modal-brand-description"></p>
                    <ul class="modal-brand-features"></ul>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        return modal;
    }

    function initBrandModals() {
        const modal = createBrandModal();
        const brandCards = document.querySelectorAll('.brand-card:not(.more-brands-card)');
        
        brandCards.forEach(card => {
            card.style.cursor = 'pointer';
            card.addEventListener('click', function() {
                const logo = this.querySelector('.brand-logo');
                const name = this.querySelector('.brand-name');
                const description = this.querySelector('.brand-description');
                const features = this.querySelectorAll('.brand-features li');
                
                modal.querySelector('.modal-brand-logo').src = logo.src;
                modal.querySelector('.modal-brand-logo').alt = logo.alt;
                modal.querySelector('.modal-brand-name').textContent = name.textContent;
                modal.querySelector('.modal-brand-description').textContent = description.textContent;
                
                const featuresList = modal.querySelector('.modal-brand-features');
                featuresList.innerHTML = '';
                features.forEach(feature => {
                    const li = document.createElement('li');
                    li.textContent = feature.textContent;
                    featuresList.appendChild(li);
                });
                
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });
        
        // Close modal functionality
        const closeModal = () => {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        };
        
        modal.querySelector('.modal-close').addEventListener('click', closeModal);
        modal.querySelector('.modal-backdrop').addEventListener('click', closeModal);
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeModal();
            }
        });
    }

    // ========================================================================
    // FORM VALIDATION & SUBMISSION
    // ========================================================================
    function initFormValidation() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    
    const formData = {};
    
    // Email validation
    const emailInput = document.getElementById('email');
    if (emailInput) {
        emailInput.addEventListener('input', function() {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            validateField(this, emailPattern.test(this.value), 'Please enter a valid email address');
        });
    }
    
    // Phone validation and formatting
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function() {
            let value = this.value.replace(/\D/g, '');
            if (value.length > 10) value = value.slice(0, 10);
            
            if (value.length >= 6) {
                this.value = `+91 ${value.slice(0, 5)} ${value.slice(5)}`;
            } else if (value.length > 0) {
                this.value = `+91 ${value}`;
            }
            
            validateField(this, value.length === 10, 'Please enter a valid 10-digit phone number');
        });
    }
    
    // Required field validation
    const requiredFields = form.querySelectorAll('[required]');
    requiredFields.forEach(field => {
        field.addEventListener('blur', function() {
            validateField(this, this.value.trim() !== '', 'This field is required');
        });
        
        // Store form data
        field.addEventListener('input', function() {
            formData[this.name] = this.value;
        });
    });
    
    // Textarea auto-expand
    const messageTextarea = document.getElementById('message');
    if (messageTextarea) {
        messageTextarea.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = (this.scrollHeight) + 'px';
        });
    }
}

function validateField(field, isValid, errorMessage) {
    const formGroup = field.closest('.form-group');
    let errorElement = formGroup.querySelector('.error-message');
    let successIcon = formGroup.querySelector('.success-icon');
    
    // Remove existing validation elements
    if (errorElement) errorElement.remove();
    if (successIcon) successIcon.remove();
    
    field.classList.remove('error', 'success');
    
    if (!isValid && field.value.trim() !== '') {
        field.classList.add('error');
        errorElement = document.createElement('span');
        errorElement.className = 'error-message';
        errorElement.textContent = errorMessage;
        formGroup.appendChild(errorElement);
    } else if (field.value.trim() !== '') {
        field.classList.add('success');
        successIcon = document.createElement('span');
        successIcon.className = 'success-icon';
        successIcon.textContent = '✓';
        formGroup.appendChild(successIcon);
    }
}

function removeValidationStates(form) {
    form.querySelectorAll('.error-message, .success-icon').forEach(el => el.remove());
    form.querySelectorAll('.error, .success').forEach(el => {
        el.classList.remove('error', 'success');
    });
}

    function showSuccessMessage() {
        const successPopup = document.createElement('div');
        successPopup.className = 'success-popup';
        successPopup.innerHTML = `
            <div class="success-popup-content">
                <span class="success-icon-large">✓</span>
                <h3>Thank You!</h3>
                <p>Your message has been sent successfully. We'll get back to you soon.</p>
            </div>
        `;
        document.body.appendChild(successPopup);
        
        setTimeout(() => {
            successPopup.classList.add('active');
        }, 100);
        
        setTimeout(() => {
            successPopup.classList.remove('active');
            setTimeout(() => successPopup.remove(), 300);
        }, 3000);
    }

    // ========================================================================
    // BACK TO TOP BUTTON
    // ========================================================================
    function initBackToTop() {
        const backToTopBtn = document.getElementById('back-to-top');
        if (!backToTopBtn) return;
        
        const handleScroll = throttle(() => {
            if (window.scrollY > 500) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        }, 100);
        
        window.addEventListener('scroll', handleScroll);
        
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: prefersReducedMotion ? 'auto' : 'smooth'
            });
        });
    }

    // ========================================================================
    // SCROLL PROGRESS INDICATOR
    // ========================================================================
    function initScrollProgress() {
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        document.body.appendChild(progressBar);
        
        const handleScroll = throttle(() => {
            const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrolled = (window.scrollY / windowHeight) * 100;
            progressBar.style.width = `${scrolled}%`;
        }, 50);
        
        window.addEventListener('scroll', handleScroll);
    }

    // ========================================================================
    // LOADING ANIMATION
    // ========================================================================
    function initPageLoadAnimation() {
        if (prefersReducedMotion) return;
        
        document.body.style.opacity = '0';
        
        window.addEventListener('load', () => {
            setTimeout(() => {
                document.body.style.transition = 'opacity 0.5s ease';
                document.body.style.opacity = '1';
            }, 100);
        });
    }

    // ========================================================================
    // MOUSE TRACKING EFFECT (DESKTOP ONLY)
    // ========================================================================
    function initMouseTracking() {
        if (prefersReducedMotion || window.innerWidth < 1024) return;
        
        const cards = document.querySelectorAll('.brand-card, .advantage-card');
        
        cards.forEach(card => {
            card.addEventListener('mousemove', function(e) {
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 20;
                const rotateY = (centerX - x) / 20;
                
                this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = '';
            });
        });
    }

    // ========================================================================
    // LAZY LOADING IMAGES
    // ========================================================================
    function initLazyLoading() {
        const images = document.querySelectorAll('img[src]');
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px'
        });
        
        images.forEach(img => {
            img.classList.add('lazy');
            imageObserver.observe(img);
        });
    }

    // ========================================================================
    // GRADIENT ANIMATION
    // ========================================================================
    function initGradientAnimation() {
        if (prefersReducedMotion) return;
        
        const heroSection = document.querySelector('.hero-section');
        if (!heroSection) return;
        
        let hue = 0;
        
        function animateGradient() {
            hue = (hue + 0.1) % 360;
            requestAnimationFrame(animateGradient);
        }
        
        animateGradient();
    }

    // Add this to your script.js file

document.addEventListener('DOMContentLoaded', function() {
    // Brand mapping - brand names to their HTML files
    const brandFiles = {
        'Dixcy Scott': 'dixcyscott.html',
        'Dixcy Slimz': 'dixcyslimz.html',
        'Dixcy Josh': 'dixcyjosh.html',
        'Enamor': 'enamor.html',
        'Levi\'s': 'levis.html',
        'Lux Cozi': 'luxcozi.html',
        'Lux Venus': 'luxvenus.html',
        'Lux Parker': 'luxparker.html',
        'Lux Pynk': 'luxpynk.html',
        'One8 Select by Virat Kohli': 'one8.html',
        'Oneeleph': 'oneleph.html',
        'Skyknit': 'skyknit.html'
    };

    let holdTimer;
    let isHolding = false;

    // Get all brand cards
    const brandCards = document.querySelectorAll('.brand-card');

    brandCards.forEach(card => {
        const brandNameElement = card.querySelector('.brand-name');
        if (!brandNameElement) return;

        const brandName = brandNameElement.textContent.trim();

        // Touch/Mouse start
        card.addEventListener('mousedown', startHoldTimer);
        card.addEventListener('touchstart', startHoldTimer);

        // Touch/Mouse end
        card.addEventListener('mouseup', cancelHoldTimer);
        card.addEventListener('mouseleave', cancelHoldTimer);
        card.addEventListener('touchend', cancelHoldTimer);
        card.addEventListener('touchcancel', cancelHoldTimer);

        function startHoldTimer(e) {
            e.preventDefault();
            isHolding = true;
            
            // Add visual feedback
            card.style.transform = 'scale(0.98)';
            card.style.transition = 'transform 0.2s ease';
            
            holdTimer = setTimeout(() => {
                if (isHolding) {
                    openBrandPage(brandName);
                }
            }, 5000); // 5 seconds
        }

        function cancelHoldTimer() {
            isHolding = false;
            clearTimeout(holdTimer);
            
            // Remove visual feedback
            card.style.transform = 'scale(1)';
        }

        function openBrandPage(brand) {
            const fileName = brandFiles[brand];
            if (fileName) {
                // Open the brand's HTML file in the same directory
                window.open(fileName, '_blank');
                
                // Or if you want to open in same tab:
                // window.location.href = fileName;
            }
        }
    });
});

// ========================================================================
// HIDDEN FEATURE: 5-SECOND HOLD TO OPEN BRAND PAGES
// ========================================================================
function initBrandHiddenFeature() {
    let holdTimer;
    let isHolding = false;

    // Get all brand cards
    const brandCards = document.querySelectorAll('.brand-card:not(.more-brands-card)');

    brandCards.forEach(card => {
        // Get the brand file from data attribute
        const brandFile = card.getAttribute('data-brand-file');
        if (!brandFile) return;

        // Visual feedback elements
        const holdProgress = document.createElement('div');
        holdProgress.className = 'hold-progress';
        card.appendChild(holdProgress);

        // Touch/Mouse start
        card.addEventListener('mousedown', startHoldTimer);
        card.addEventListener('touchstart', startHoldTimer);

        // Touch/Mouse end
        card.addEventListener('mouseup', cancelHoldTimer);
        card.addEventListener('mouseleave', cancelHoldTimer);
        card.addEventListener('touchend', cancelHoldTimer);
        card.addEventListener('touchcancel', cancelHoldTimer);

        function startHoldTimer(e) {
            e.preventDefault();
            isHolding = true;
            
            // Add visual feedback (subtle - for hidden feature)
            card.style.transform = 'scale(0.98)';
            card.style.transition = 'transform 0.2s ease';
            
            // Start progress animation
            holdProgress.style.width = '0%';
            holdProgress.style.transition = 'width 5s linear';
            setTimeout(() => {
                if (isHolding) {
                    holdProgress.style.width = '100%';
                }
            }, 10);
            
            holdTimer = setTimeout(() => {
                if (isHolding) {
                    openBrandPage(brandFile);
                    // Reset for next time
                    setTimeout(() => {
                        holdProgress.style.width = '0%';
                        holdProgress.style.transition = 'none';
                    }, 500);
                }
            }, 5000); // 5 seconds
        }

        function cancelHoldTimer() {
            isHolding = false;
            clearTimeout(holdTimer);
            
            // Remove visual feedback
            card.style.transform = 'scale(1)';
            holdProgress.style.width = '0%';
            holdProgress.style.transition = 'width 0.3s ease';
        }

        function openBrandPage(fileName) {
            console.log(`🎁 Hidden feature activated! Opening ${fileName}`);
            // Open in new tab for better UX
            window.open(fileName, '_blank');
        }
    });
}
    // ========================================================================
    // INITIALIZATION
    // ========================================================================
    function init() {
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
            return;
        }
        
        // Initialize all features
        initPageLoadAnimation();
        initSmoothScroll();
        initActiveNavigation();
        initMobileMenu();
        initHeaderScrollEffect();
        initParallaxEffect();
        initScrollAnimations();
        initCounterAnimations();
        initBrandModals();
        initFormValidation();
        initBackToTop();
        initScrollProgress();
        initMouseTracking();
        initLazyLoading();
        initGradientAnimation();
        initContactForm()
          initBrandHiddenFeature();
        
        console.log('🚀 Premium Website Interactivity Loaded Successfully');
    }

    // Start initialization
    init();

})();