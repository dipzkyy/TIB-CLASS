// Circle Menu dengan dukungan SPA dan posisi tombol responsif
class CircleMenu {
    constructor(menuId) {
        this.menu = document.getElementById(menuId);
        this.menuButtons = this.menu.querySelector('.menu-buttons');
        this.rippleEffect = document.querySelector('.ripple-effect');
        this.isOpen = false;
        this.isMobile = window.innerWidth <= 768;
        
        this.init();
        this.setupResponsiveHandlers();
    }

    init() {
        this.menu.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleMenu();
        });

        // Close menu when clicking outside
        document.addEventListener('click', () => {
            if (this.isOpen) {
                this.closeMenu();
            }
        });

        // Prevent menu buttons from closing menu when clicked
        this.menuButtons.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }

    toggleMenu() {
        if (this.isOpen) {
            this.closeMenu();
        } else {
            this.openMenu();
        }
    }

    openMenu() {
        this.isOpen = true;
        this.menu.classList.add('active');
        this.menuButtons.classList.add('menu-open');
        
        // Create ripple effect
        this.createRipple();
        
        // Animate menu buttons dengan posisi responsif
        this.animateMenuButtons();
    }

    closeMenu() {
        this.isOpen = false;
        this.menu.classList.remove('active');
        this.menuButtons.classList.remove('menu-open');
        
        // Reset button animations
        this.menuButtons.querySelectorAll('.menu-btn').forEach(btn => {
            btn.style.opacity = '0';
            btn.style.transform = 'translate(-50%, -50%) scale(0.8)';
        });
    }

    createRipple() {
        const ripple = document.createElement('div');
        ripple.classList.add('ripple-circle');
        this.rippleEffect.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 1200);
    }

    animateMenuButtons() {
        const buttons = this.menuButtons.querySelectorAll('.menu-btn');
        
        // Radius berbeda untuk mobile dan desktop - DIPERBESAR
        const radius = this.isMobile ? 120 : 180; // Diperbesar dari 80/140
        
        buttons.forEach((btn, index) => {
            // Hitung posisi untuk 4 tombol (sudut 0°, 90°, 180°, 270°)
            const angle = (index / 4) * 2 * Math.PI;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            
            // Posisikan tombol di tengah layar
            btn.style.left = `calc(50% + ${x}px)`;
            btn.style.top = `calc(50% + ${y}px)`;
            btn.style.transform = 'translate(-50%, -50%) scale(0.8)';
            
            setTimeout(() => {
                btn.style.opacity = '1';
                btn.style.transform = 'translate(-50%, -50%) scale(1)';
            }, index * 100);
        });
    }

    setupResponsiveHandlers() {
        window.addEventListener('resize', () => {
            this.isMobile = window.innerWidth <= 768;
            
            // Jika menu sedang terbuka, reposition buttons
            if (this.isOpen) {
                setTimeout(() => {
                    this.animateMenuButtons();
                }, 100);
            }
        });
    }
}

// TypeWriter yang responsif
class TypeWriter {
  constructor(elementId, texts, speed = 30, pauseTime = 2000) {
    this.element = document.getElementById(elementId);
    this.texts = texts;
    this.speed = speed;
    this.pauseTime = pauseTime;
    this.textIndex = 0;
    this.charIndex = 0;
    this.isDeleting = false;
    this.isWaiting = false;
    this.hasCompleted = false;
    this.isMobile = window.innerWidth <= 768;
    
    // Adjust speed for mobile
    if (this.isMobile) {
      this.speed = 40;
      this.pauseTime = 1500;
    }
  }

  start() { 
    if (this.element && !this.hasCompleted) {
      this.type(); 
    }
  }

  type() {
    if (this.isWaiting) return;
    
    const currentText = this.texts[this.textIndex];
    
    if (this.isDeleting) {
      this.element.textContent = currentText.substring(0, this.charIndex - 1);
      this.charIndex--;
    } else {
      this.element.textContent = currentText.substring(0, this.charIndex + 1);
      this.charIndex++;
    }
    
    if (!this.isDeleting && this.charIndex === currentText.length) {
      this.isWaiting = true;
      setTimeout(() => {
        this.isWaiting = false;
        this.isDeleting = true;
        this.type();
      }, this.pauseTime);
    } 
    else if (this.isDeleting && this.charIndex === 0) {
      this.isDeleting = false;
      this.textIndex = (this.textIndex + 1) % this.texts.length;
      
      setTimeout(() => {
        this.type();
      }, 500);
    } 
    else {
      setTimeout(() => this.type(), this.isDeleting ? this.speed / 2 : this.speed);
    }
  }
}

// Initialize typewriter dan circle menu
document.addEventListener('DOMContentLoaded', () => {
  // Typewriter
  const el = document.getElementById('typewriterText');
  if (el) {
    const texts = [
      "Kami adalah komunitas mahasiswa Teknik Informatika yang penuh semangat dan kreativitas.",
      "Bersama kita bangun masa depan teknologi yang lebih baik!",
      "Solid, Solid, Solid!!"
    ];
    const tw = new TypeWriter('typewriterText', texts, 50, 2000);
    setTimeout(() => tw.start(), 900);
  }

  // Circle Menu
  if (document.getElementById('circleMenu')) {
    new CircleMenu('circleMenu');
  }
});