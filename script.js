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

// self-playing "live" trailer preview — a looping animated canvas scene,
// not a real video file, so it autoplays with no click and no asset to load
const trailerCanvas = document.getElementById('trailerCanvas');
if (trailerCanvas) {
  const tctx = trailerCanvas.getContext('2d');
  const trailerBox = trailerCanvas.closest('.main-video');
  let embers = [];
  let scanY = 0;
  let flash = 0;
  let nextFlashAt = 0;
  let chopperX = -0.2;

  function resizeTrailer() {
    trailerCanvas.width = trailerBox.offsetWidth;
    trailerCanvas.height = trailerBox.offsetHeight;
  }

  function makeEmber() {
    return {
      x: Math.random() * trailerCanvas.width,
      y: trailerCanvas.height + Math.random() * 20,
      r: Math.random() * 1.8 + 0.4,
      speed: Math.random() * 0.5 + 0.15
    };
  }

  function initTrailer() {
    resizeTrailer();
    embers = Array.from({ length: 30 }, makeEmber);
    nextFlashAt = performance.now() + 1500 + Math.random() * 2000;
  }

  function drawTrailer(now) {
    const w = trailerCanvas.width;
    const h = trailerCanvas.height;

    tctx.fillStyle = '#0a0d12';
    tctx.fillRect(0, 0, w, h);

    const grad = tctx.createRadialGradient(w * 0.7, h * 0.4, 0, w * 0.7, h * 0.4, w * 0.7);
    grad.addColorStop(0, 'rgba(255,59,48,0.10)');
    grad.addColorStop(1, 'rgba(10,13,18,0)');
    tctx.fillStyle = grad;
    tctx.fillRect(0, 0, w, h);

    embers.forEach(p => {
      p.y -= p.speed;
      if (p.y < -5) Object.assign(p, makeEmber(), { y: h + 5 });
      tctx.beginPath();
      tctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      tctx.fillStyle = 'rgba(255,176,32,0.6)';
      tctx.fill();
    });

    chopperX += 0.0025;
    if (chopperX > 1.2) chopperX = -0.2;
    tctx.font = `${Math.max(18, w * 0.09)}px sans-serif`;
    tctx.fillText('🚁', chopperX * w, h * 0.28);

    if (now >= nextFlashAt) {
      flash = 1;
      nextFlashAt = now + 2500 + Math.random() * 3000;
    }
    if (flash > 0) {
      tctx.fillStyle = `rgba(255,176,32,${flash * 0.35})`;
      tctx.fillRect(0, 0, w, h);
      flash -= 0.04;
    }

    scanY = (scanY + 1) % (h + 24);
    tctx.strokeStyle = 'rgba(255,255,255,0.04)';
    tctx.lineWidth = 24;
    tctx.beginPath();
    tctx.moveTo(0, scanY - 12);
    tctx.lineTo(w, scanY - 12);
    tctx.stroke();

    requestAnimationFrame(drawTrailer);
  }

  window.addEventListener('resize', resizeTrailer);
  initTrailer();
  requestAnimationFrame(drawTrailer);
}
