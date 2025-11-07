// ParticleStars — Canvas particle background
class ParticleStars {
  constructor() {
    this.canvas = document.getElementById('particles-js');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.numberOfParticles = 150;
    this.init();
  }
  init() {
    this.resizeCanvas();
    this.createParticles();
    this.animate();
    window.addEventListener('resize', ()=> {
      this.resizeCanvas();
      this.createParticles();
    });
  }
  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }
  createParticles() {
    this.particles = [];
    for (let i=0;i<this.numberOfParticles;i++){
      this.particles.push({
        x: Math.random()*this.canvas.width,
        y: Math.random()*this.canvas.height,
        radius: Math.random()*1.5 + 0.5,
        speed: Math.random()*0.5 + 0.2,
        opacity: Math.random()*0.5 + 0.3,
        twinkleSpeed: Math.random()*0.02 + 0.01,
        angle: 0
      });
    }
  }
  animate() {
    if (!this.ctx) return;
    this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
    this.particles.forEach(p => {
      p.angle += p.twinkleSpeed;
      p.opacity = 0.3 + Math.sin(p.angle) * 0.3;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI*2);
      this.ctx.fillStyle = `rgba(255,255,255,${p.opacity})`;
      this.ctx.fill();
      p.y += p.speed;
      if (p.y > this.canvas.height) {
        p.y = 0;
        p.x = Math.random()*this.canvas.width;
      }
    });
    requestAnimationFrame(()=>this.animate());
  }
}
document.addEventListener('DOMContentLoaded', ()=>{ new ParticleStars(); });
