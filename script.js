document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const href = link.getAttribute('href');
    if (href.length <= 1) return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

const playBtn = document.getElementById('playBtn');
if (playBtn) {
  playBtn.addEventListener('click', () => {
    alert('Trailer playback is a demo placeholder — plug in a real video source here.');
  });
}

// subtle fade-in on scroll
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = 1;
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.feature-card, .mode-card, .gallery-item').forEach(el => {
  el.style.opacity = 0;
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  observer.observe(el);
});

// count-up stats when scrolled into view
const statEls = document.querySelectorAll('[data-count]');
const statObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    statObserver.unobserve(el);
    const target = parseFloat(el.dataset.count);
    const decimals = parseInt(el.dataset.decimal || '0', 10);
    const suffix = el.dataset.suffix || '';
    const duration = 1400;
    const start = performance.now();
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = target * eased;
      el.textContent = value.toFixed(decimals) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  });
}, { threshold: 0.5 });
statEls.forEach(el => statObserver.observe(el));

// 3D tilt on cards following the cursor
document.querySelectorAll('.feature-card, .mode-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rotateX = ((y / rect.height) - 0.5) * -12;
    const rotateY = ((x / rect.width) - 0.5) * 12;
    card.style.transform = `translateY(-4px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'translateY(0) rotateX(0) rotateY(0)';
  });
});

// floating ember particle background in the hero
const canvas = document.getElementById('particles');
if (canvas) {
  const ctx = canvas.getContext('2d');
  const hero = canvas.closest('.hero');
  let particles = [];

  function resize() {
    canvas.width = hero.offsetWidth;
    canvas.height = hero.offsetHeight;
  }

  function makeParticle() {
    return {
      x: Math.random() * canvas.width,
      y: canvas.height + Math.random() * 40,
      r: Math.random() * 2 + 0.5,
      speed: Math.random() * 0.6 + 0.2,
      drift: (Math.random() - 0.5) * 0.4,
      glow: Math.random() > 0.7
    };
  }

  function init() {
    resize();
    const count = Math.floor((canvas.width * canvas.height) / 18000);
    particles = Array.from({ length: count }, makeParticle);
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.y -= p.speed;
      p.x += p.drift;
      if (p.y < -10) Object.assign(p, makeParticle(), { y: canvas.height + 10 });
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.glow ? 'rgba(255,176,32,0.85)' : 'rgba(255,255,255,0.35)';
      ctx.shadowBlur = p.glow ? 8 : 0;
      ctx.shadowColor = 'rgba(255,176,32,0.8)';
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', init);
  init();
  draw();
}
