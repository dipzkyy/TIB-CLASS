// Core app: page transitions, date, intersection observer, nav link handling
class TI_B_App {
  constructor(){
    this.isMobile = window.innerWidth <= 768;
    this.isTablet = window.innerWidth <= 1024 && window.innerWidth > 768;
    this.observer = null;
    this.scrollObserver = null;
    
    // Check if we need to redirect to loading screen
    this.checkLoadingRedirect();
    this.init();
  }

  checkLoadingRedirect() {
    // Only redirect if we're on the main page and haven't shown loading yet
    const currentPage = window.location.pathname.split('/').pop();
    const hasSeenLoading = sessionStorage.getItem('hasSeenLoading');
    
    if (currentPage === 'index.html' && !hasSeenLoading) {
      sessionStorage.setItem('hasSeenLoading', 'true');
      window.location.href = 'loading.html';
      return;
    }
    
    // If we're coming from loading page, mark as loaded
    if (document.referrer.includes('loading.html')) {
      sessionStorage.setItem('hasSeenLoading', 'true');
    }
  }

  init(){
    // Only initialize if we're not redirecting to loading
    if (window.location.pathname.includes('loading.html')) {
      return;
    }
    
    this.setupGlobalEvents();
    this.setupNavigation();
    this.setupPageTransitions();
    this.setCurrentDate();
    this.setupMobileMenu();
    this.setupResponsiveHandlers();
    this.setupSPAHandlers();
    this.setupBackButton();
  }

  setupGlobalEvents(){
    window.addEventListener('error', this.handleGlobalError);
    window.addEventListener('load', ()=> {
      document.body.classList.add('page-loaded');
      sessionStorage.setItem('pageLoaded','true');
    });
  }

  setupNavigation(){
    // Smooth scroll untuk internal links
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });

    // Active nav link berdasarkan scroll position
    let scrollTimeout;
    window.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        const sections = document.querySelectorAll('.page-section');
        const navLinks = document.querySelectorAll('.nav-link');

        let current = '';
        sections.forEach(section => {
          const sectionTop = section.offsetTop - 100;
          const sectionHeight = section.clientHeight;
          if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
          }
        });

        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
          }
        });
      }, 100);
    });

    // External links
    document.querySelectorAll('a.external').forEach(link => {
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
    });
  }

  setupMobileMenu() {
    const toggle = document.querySelector('.mobile-menu-toggle');
    const menu = document.querySelector('.nav-menu');

    if (toggle && menu) {
      toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        toggle.classList.toggle('active');
        menu.classList.toggle('active');
        document.body.style.overflow = menu.classList.contains('active') ? 'hidden' : '';
      });

      menu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          this.closeMobileMenu();
        });
      });

      document.addEventListener('click', (e) => {
        if (!menu.contains(e.target) && !toggle.contains(e.target) && menu.classList.contains('active')) {
          this.closeMobileMenu();
        }
      });
    }
  }

  closeMobileMenu() {
    const toggle = document.querySelector('.mobile-menu-toggle');
    const menu = document.querySelector('.nav-menu');

    if (toggle && menu) {
      toggle.classList.remove('active');
      menu.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  setupPageTransitions(){
    this.initializeIntersectionObserver();
  }

  initializeIntersectionObserver(){
    // Hapus observer lama jika ada
    if (this.observer) {
      this.observer.disconnect();
    }
    if (this.scrollObserver) {
      this.scrollObserver.disconnect();
    }

    // Observer untuk section utama
    this.observer = new IntersectionObserver((entries)=>{
      entries.forEach(entry=>{
        if (entry.isIntersecting) {
          entry.target.classList.add('section-visible');
        } else {
          // Reset saat keluar viewport untuk auto refresh
          entry.target.classList.remove('section-visible');
        }
      });
    }, { 
      threshold: this.isMobile ? 0.05 : 0.1,
      rootMargin: this.isMobile ? '0px 0px -10px 0px' : '0px 0px -30px 0px'
    });

    // Observer untuk scroll elements dengan auto refresh
    this.scrollObserver = new IntersectionObserver((entries)=>{
      entries.forEach(entry=>{
        if (entry.isIntersecting) {
          entry.target.classList.add('scroll-visible', 'stagger-visible');
        } else {
          // Reset saat keluar viewport untuk auto refresh
          entry.target.classList.remove('scroll-visible', 'stagger-visible');
        }
      });
    }, { 
      threshold: this.isMobile ? 0.05 : 0.1,
      rootMargin: this.isMobile ? '0px 0px -10px 0px' : '0px 0px -30px 0px'
    });

    document.querySelectorAll('.page-section').forEach(s => this.observer.observe(s));
    document.querySelectorAll('.scroll-element, .stagger-item').forEach(el => this.scrollObserver.observe(el));
  }

  setCurrentDate(){
    const dateElement = document.getElementById('current-date');
    if (!dateElement) return;

    const updateDate = ()=>{
      const today = new Date();
      const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric'
      };

      if (this.isMobile) {
        options.weekday = 'short';
        options.month = 'short';
      }

      dateElement.textContent = today.toLocaleDateString('id-ID', options);
    };

    updateDate();
    setInterval(updateDate, 60000);
  }

  setupResponsiveHandlers() {
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        const wasMobile = this.isMobile;
        const wasTablet = this.isTablet;
        
        this.isMobile = window.innerWidth <= 768;
        this.isTablet = window.innerWidth <= 1024 && window.innerWidth > 768;

        if (wasMobile !== this.isMobile || wasTablet !== this.isTablet) {
          this.initializeIntersectionObserver();
          this.setCurrentDate();
          this.setupBackButton();
        }
      }, 250);
    });

    window.addEventListener('orientationchange', () => {
      setTimeout(() => {
        this.isMobile = window.innerWidth <= 768;
        this.isTablet = window.innerWidth <= 1024 && window.innerWidth > 768;
        this.initializeIntersectionObserver();
        this.setupBackButton();
      }, 300);
    });
  }

  setupSPAHandlers() {
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('back-button') || 
          e.target.closest('.back-button')) {
        e.preventDefault();
        window.history.back();
      }
    });
  }

  setupBackButton() {
    const backButtons = document.querySelectorAll('.back-button');
    const backNotice = document.querySelector('.back-notice');
    
    if (this.isMobile || this.isTablet) {
      backButtons.forEach(btn => btn.style.display = 'none');
      if (backNotice) backNotice.style.display = 'block';
    } else {
      backButtons.forEach(btn => btn.style.display = 'inline-flex');
      if (backNotice) backNotice.style.display = 'none';
    }
  }

  handleGlobalError(e){ 
    console.error('Global error:', e.error); 
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', ()=>{ 
  new TI_B_App();
});

// Fallback: If user accesses index.html directly, redirect to loading
if (window.location.pathname.endsWith('index.html') && !sessionStorage.getItem('hasSeenLoading')) {
  sessionStorage.setItem('hasSeenLoading', 'true');
  window.location.href = 'loading.html';
}