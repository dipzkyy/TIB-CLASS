// SPA Navigation System
class SPANavigator {
    constructor() {
        this.currentPage = 'home';
        this.isTransitioning = false;
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupPageTransitions();
        this.handleInitialLoad();
        this.updateDate();
        setInterval(() => this.updateDate(), 60000);
    }

    setupNavigation() {
        // Handle internal navigation links
        document.querySelectorAll('.nav-link:not(.external), .menu-btn:not(.external), .back-button').forEach(link => {
            link.addEventListener('click', (e) => {
                if (link.classList.contains('external')) return;
                
                e.preventDefault();
                const targetPage = link.getAttribute('data-page') || 
                                 link.getAttribute('href')?.replace('#', '') || 'home';
                this.navigateTo(targetPage);
            });
        });

        // Handle browser back/forward buttons
        window.addEventListener('popstate', (e) => {
            const page = window.location.hash.replace('#', '') || 'home';
            this.switchPage(page, false);
        });
    }

    setupPageTransitions() {
        // Add transition styles
        const style = document.createElement('style');
        style.textContent = `
            .page-leaving {
                animation: pageOut 0.4s ease forwards;
            }
            
            .page-entering {
                animation: pageIn 0.6s ease 0.2s forwards;
                opacity: 0;
                transform: translateY(20px);
            }
            
            @keyframes pageOut {
                to {
                    opacity: 0;
                    transform: translateY(-20px);
                }
            }
            
            @keyframes pageIn {
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        `;
        document.head.appendChild(style);
    }

    async navigateTo(page) {
        if (this.isTransitioning || page === this.currentPage) return;

        this.isTransitioning = true;
        
        // Update URL tanpa reload
        window.history.pushState({ page }, '', `#${page}`);
        
        await this.switchPage(page);
        this.isTransitioning = false;
    }

    async switchPage(newPage, updateNav = true) {
        const oldPage = this.currentPage;
        this.currentPage = newPage;

        // Get page elements
        const oldPageEl = document.getElementById(`${oldPage}-page`);
        const newPageEl = document.getElementById(`${newPage}-page`);
        
        if (!newPageEl) {
            console.error(`Page ${newPage} not found`);
            return;
        }

        // Start transition
        if (oldPageEl) {
            oldPageEl.classList.add('page-leaving');
            await this.wait(400);
            oldPageEl.classList.remove('active', 'page-leaving');
        }

        newPageEl.classList.add('active', 'page-entering');
        await this.wait(200);
        newPageEl.classList.remove('page-entering');

        // Update active nav link
        if (updateNav) {
            this.updateActiveNavLink(newPage);
        }

        // Scroll handling
        if (newPage !== 'home') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            this.scrollToInteractiveMenu();
        }

        // Load content for internal pages
        if (['gallery', 'members', 'schedule'].includes(newPage)) {
            this.loadPageContent(newPage);
        }

        // Dispatch event
        window.dispatchEvent(new CustomEvent('pageChanged', {
            detail: { from: oldPage, to: newPage }
        }));
    }

    scrollToInteractiveMenu() {
        const interactiveMenu = document.getElementById('interactive-menu');
        if (interactiveMenu) {
            setTimeout(() => {
                interactiveMenu.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }, 100);
        }
    }

    updateActiveNavLink(activePage) {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-page') === activePage) {
                link.classList.add('active');
            }
        });
    }

    handleInitialLoad() {
        const hash = window.location.hash.replace('#', '');
        if (hash && hash !== 'home') {
            this.switchPage(hash, true);
        } else {
            this.updateActiveNavLink('home');
        }
    }

    updateDate() {
        const now = new Date();
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        const dateString = now.toLocaleDateString('id-ID', options);
        const dateElement = document.getElementById('current-date');
        if (dateElement) {
            dateElement.textContent = dateString;
        }
    }

    loadPageContent(page) {
        // Simulate loading content
        setTimeout(() => {
            if (page === 'gallery') {
                this.initGalleryCarousel();
            } else if (page === 'members') {
                this.initMemberCards();
            }
        }, 300);
    }

    initGalleryCarousel() {
        const carouselTrack = document.querySelector('#gallery-page .carousel-track');
        const slides = document.querySelectorAll('#gallery-page .carousel-slide');
        const prevBtn = document.querySelector('#gallery-page .carousel-btn.prev');
        const nextBtn = document.querySelector('#gallery-page .carousel-btn.next');
        const indicatorsContainer = document.querySelector('#gallery-page .carousel-indicators');
        
        if (!carouselTrack || !slides.length) return;

        let currentSlide = 0;
        const totalSlides = slides.length;
        
        // Create indicators if they don't exist
        if (indicatorsContainer && !indicatorsContainer.children.length) {
            slides.forEach((_, index) => {
                const indicator = document.createElement('span');
                indicator.classList.add('indicator');
                if (index === 0) indicator.classList.add('active');
                indicator.addEventListener('click', () => this.goToSlide(index));
                indicatorsContainer.appendChild(indicator);
            });
        }
        
        this.goToSlide = (slideIndex) => {
            currentSlide = slideIndex;
            if (currentSlide >= totalSlides) currentSlide = 0;
            if (currentSlide < 0) currentSlide = totalSlides - 1;
            
            carouselTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
            
            // Update active states
            slides.forEach((slide, index) => {
                slide.classList.toggle('active', index === currentSlide);
            });
            
            document.querySelectorAll('#gallery-page .indicator').forEach((indicator, index) => {
                indicator.classList.toggle('active', index === currentSlide);
            });
        };
        
        if (prevBtn) prevBtn.addEventListener('click', () => this.goToSlide(currentSlide - 1));
        if (nextBtn) nextBtn.addEventListener('click', () => this.goToSlide(currentSlide + 1));
        
        // Auto slide
        this.carouselInterval = setInterval(() => this.goToSlide(currentSlide + 1), 5000);
    }

    initMemberCards() {
        document.querySelectorAll('#members-page .flip-card').forEach((card, i) => {
            card.style.animationDelay = (i * 0.08) + 's';
            card.addEventListener('click', () => card.classList.toggle('flipped'));
        });
    }

    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize SPA
    window.spaNavigator = new SPANavigator();
    
    // Add loaded class to body
    document.body.classList.add('page-loaded');

    // Handle external links
    document.querySelectorAll('a[href^="http"]').forEach(link => {
        if (!link.classList.contains('external')) {
            link.setAttribute('target', '_blank');
            link.setAttribute('rel', 'noopener noreferrer');
        }
    });
});