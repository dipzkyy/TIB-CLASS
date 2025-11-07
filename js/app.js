// Core app: page transitions, date, intersection observer, nav link handling
class TI_B_App {
  constructor(){
    this.isMobile = window.innerWidth <= 768;
    this.init();
  }
  
  init(){
    this.setupGlobalEvents();
    this.setupNavigation();
    this.setupPageTransitions();
    this.setCurrentDate();
    this.setupMobileMenu();
    this.setupResponsiveHandlers();
  }
  
  setupGlobalEvents(){
    window.addEventListener('error', this.handleGlobalError);
    window.addEventListener('load', ()=> {
      document.body.classList.add('page-loaded');
      sessionStorage.setItem('pageLoaded','true');
    });
  }
  
  setupNavigation(){
    // Handle internal navigation links
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', (e) => {
        if (link.getAttribute('href').startsWith('#')) {
          e.preventDefault();
          const targetId = link.getAttribute('href').substring(1);
          const el = document.getElementById(targetId);
          if (el) el.scrollIntoView({behavior:'smooth', block:'start'});
          
          // Update active nav link
          document.querySelectorAll('.nav-link').forEach(nav => nav.classList.remove('active'));
          link.classList.add('active');
          
          // Close mobile menu if open
          this.closeMobileMenu();
        }
      });
    });

    // Update active nav link on scroll
    let scrollTimeout;
    window.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        const sections = document.querySelectorAll('.page-section');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let current = '';
        sections.forEach(section => {
          const sectionTop = section.offsetTop;
          const sectionHeight = section.clientHeight;
          if (window.scrollY >= (sectionTop - 200)) {
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
    
    // Handle external links
    document.querySelectorAll('a.external').forEach(link => {
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
    });
  }
  
  setupMobileMenu() {
    const toggle = document.querySelector('.mobile-menu-toggle');
    const menu = document.querySelector('.nav-menu');
    
    if (toggle && menu) {
      toggle.addEventListener('click', () => {
        toggle.classList.toggle('active');
        menu.classList.toggle('active');
        document.body.style.overflow = menu.classList.contains('active') ? 'hidden' : '';
      });
      
      // Close menu when clicking on links
      menu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          this.closeMobileMenu();
        });
      });
      
      // Close menu when clicking outside
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
    const observer = new IntersectionObserver((entries)=>{
      entries.forEach(entry=>{
        if (entry.isIntersecting) entry.target.classList.add('section-visible');
      });
    }, { 
      threshold: this.isMobile ? 0.05 : 0.15,
      rootMargin: this.isMobile ? '0px 0px -10px 0px' : '0px 0px -50px 0px'
    });
    
    document.querySelectorAll('.page-section').forEach(s => observer.observe(s));
    
    // Scroll elements observer dengan threshold berbeda untuk mobile
    const scrollObserver = new IntersectionObserver((entries)=>{
      entries.forEach(entry=>{
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        } else {
          entry.target.classList.remove('visible');
        }
      });
    }, { 
      threshold: this.isMobile ? 0.05 : 0.12,
      rootMargin: this.isMobile ? '0px 0px -20px 0px' : '0px 0px -50px 0px'
    });
    
    document.querySelectorAll('.scroll-element').forEach(el => scrollObserver.observe(el));
  }
  
  setCurrentDate(){
    const dateElement = document.getElementById('current-date');
    if (!dateElement) return;
    
    const updateDate = ()=>{
      const today = new Date();
      const options = { 
        weekday:'long', 
        year:'numeric', 
        month:'long', 
        day:'numeric', 
        hour:'2-digit', 
        minute:'2-digit'
      };
      
      // Format yang lebih pendek untuk mobile
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
        this.isMobile = window.innerWidth <= 768;
        
        // Jika status mobile berubah, reinitialize observer
        if (wasMobile !== this.isMobile) {
          this.initializeIntersectionObserver();
          this.setCurrentDate();
        }
      }, 250);
    });
    
    // Handle orientation changes
    window.addEventListener('orientationchange', () => {
      setTimeout(() => {
        this.isMobile = window.innerWidth <= 768;
        this.initializeIntersectionObserver();
      }, 300);
    });
  }
  
  handleGlobalError(e){ 
    console.error('Global error:', e.error); 
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', ()=>{ 
  new TI_B_App();
});