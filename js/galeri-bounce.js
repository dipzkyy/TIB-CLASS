class BounceCards {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.images = options.images || [];
    this.containerWidth = options.containerWidth || 500;
    this.containerHeight = options.containerHeight || 250;
    this.animationDelay = options.animationDelay || 1;
    this.animationStagger = options.animationStagger || 0.06;
    this.easeType = options.easeType || "elastic.out(1, 0.8)";
    this.transformStyles = options.transformStyles || [
      'rotate(5deg) translate(-130px)',
      'rotate(0deg) translate(-65px)',
      'rotate(-5deg)',
      'rotate(5deg) translate(65px)',
      'rotate(-5deg) translate(130px)'
    ];
    this.enableHover = false; // HOVER DINONAKTIFKAN

    this.cards = [];
    this.isMobile = window.innerWidth <= 768;
    this.zoomedCard = null;
    
    this.init();
  }

  init() {
    this.createCards();
    this.animateEntrance();
    this.setupEventListeners();
  }

  createCards() {
    this.images.forEach((src, index) => {
      const card = document.createElement('div');
      card.className = `bounce-card bounce-card-${index} bounce-cards-loading`;
      card.style.transform = this.transformStyles[index] || 'none';
      
      const img = document.createElement('img');
      img.src = src;
      img.alt = `Gallery image ${index + 1}`;
      img.onerror = () => {
        img.src = 'assets/kegiatan.png';
      };
      
      card.appendChild(img);
      this.container.appendChild(card);
      this.cards.push(card);
    });
  }

  animateEntrance() {
    this.cards.forEach((card, index) => {
      gsap.to(card, {
        scale: 1,
        opacity: 1,
        duration: 0.8,
        delay: this.animationDelay + (index * this.animationStagger),
        ease: this.easeType,
        onComplete: () => {
          card.classList.remove('bounce-cards-loading');
          card.classList.add('bounce-cards-loaded', 'active');
        }
      });
    });
  }

  setupEventListeners() {
    this.cards.forEach((card, cardIndex) => {
      // HOVER DINONAKTIFKAN - hanya klik yang aktif
      
      // Click event for zoom
      card.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleZoom(cardIndex);
      });
    });

    // Close zoom when clicking outside
    document.addEventListener('click', (e) => {
      if (!this.container.contains(e.target) && this.zoomedCard !== null) {
        this.resetZoom();
      }
    });

    // Handle window resize
    window.addEventListener('resize', () => {
      this.isMobile = window.innerWidth <= 768;
    });
  }

  toggleZoom(cardIndex) {
    if (this.zoomedCard === cardIndex) {
      // Jika mengklik kartu yang sama, reset zoom
      this.resetZoom();
    } else {
      // Zoom kartu yang diklik
      this.zoomCard(cardIndex);
    }
  }

  zoomCard(cardIndex) {
    // Reset zoom yang ada
    this.resetZoom();
    
    // Set kartu yang di-zoom
    this.zoomedCard = cardIndex;
    
    const card = this.cards[cardIndex];
    
    // Tambahkan class zoomed
    card.classList.add('zoomed');
    
    // Animasi ke state zoom
    gsap.to(card, {
      scale: 1.15,
      duration: 0.3,
      ease: "back.out(1.4)"
    });
  }

  resetZoom() {
    if (this.zoomedCard !== null) {
      const card = this.cards[this.zoomedCard];
      
      // Hapus class zoomed
      card.classList.remove('zoomed');
      
      // Animasi kembali ke normal
      gsap.to(card, {
        scale: 1,
        duration: 0.3,
        ease: "back.in(1.4)"
      });
      
      this.zoomedCard = null;
    }
  }

  handleResize() {
    this.isMobile = window.innerWidth <= 768;
  }
}

// Initialize Bounce Cards when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  const bounceCardsContainer = document.getElementById('bounceCardsContainer');
  if (bounceCardsContainer) {
    const images = [
      "assets/kegiatan.png",
      "assets/kegiatan.png", 
      "assets/kegiatan.png",
      "assets/kegiatan.png",
      "assets/kegiatan.png"
    ];

    const transformStyles = [
      "rotate(5deg) translate(-130px)",
      "rotate(0deg) translate(-65px)",
      "rotate(-5deg)",
      "rotate(5deg) translate(65px)", 
      "rotate(-5deg) translate(130px)"
    ];

    new BounceCards('bounceCardsContainer', {
      images: images,
      containerWidth: 500,
      containerHeight: 250,
      animationDelay: 1,
      animationStagger: 0.08,
      easeType: "elastic.out(1, 0.5)",
      transformStyles: transformStyles,
      enableHover: false // HOVER DINONAKTIFKAN
    });
  }
});