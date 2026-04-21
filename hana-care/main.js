// Nav scroll effect
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// Mobile menu
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');

menuToggle.addEventListener('click', () => {
  const isOpen = navMenu.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

navMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  });
});

// Intersection observer — fade-in animations
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.animate').forEach(el => observer.observe(el));

// Stagger service cards and pillar items
document.querySelectorAll('.service-card, .testimonial-card').forEach((el, i) => {
  el.style.transitionDelay = `${(i % 3) * 0.1}s`;
});

// Request info form — demo submit handler
const form = document.getElementById('requestForm');
const submitBtn = form.querySelector('.submit-btn');

form.addEventListener('submit', e => {
  e.preventDefault();

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  submitBtn.textContent = 'Sending…';
  submitBtn.disabled = true;

  // Simulate async submission
  setTimeout(() => {
    submitBtn.textContent = '✓ Request Received';
    submitBtn.classList.add('sent');

    const confirmation = document.createElement('p');
    confirmation.textContent = 'Thank you! A member of our care team will be in touch within one business day.';
    confirmation.style.cssText = 'color:#3d5a47;font-size:.9rem;margin-top:12px;text-align:center;';
    form.appendChild(confirmation);

    setTimeout(() => {
      form.reset();
      form.removeChild(confirmation);
      submitBtn.textContent = 'Request Information';
      submitBtn.classList.remove('sent');
      submitBtn.disabled = false;
    }, 5000);
  }, 900);
});

// ── SAKURA PETALS (remove this block + canvas element + data-sakura attrs + CSS to revert) ──
(function () {
  const canvas = document.getElementById('sakuraCanvas');
  const ctx = canvas.getContext('2d');
  let petals = [];
  let rafId = null;

  const COLORS = ['#ffd6e0', '#ffb3c6', '#ffc8d8', '#ffe4ec', '#f9a8c0'];

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  function rand(a, b) { return a + Math.random() * (b - a); }

  function spawnBurst(count) {
    for (let i = 0; i < count; i++) {
      // stagger spawn times so they don't all appear at once
      const delay = rand(0, 120);
      petals.push({
        x:        rand(0, canvas.width),
        y:        rand(-60, -8) - delay * 1.5,
        size:     rand(7, 13),
        vy:       rand(1.0, 2.2),
        vx:       rand(-0.5, 0.5),
        rotation: rand(0, Math.PI * 2),
        rotSpeed: rand(-0.025, 0.025),
        sway:     rand(0.4, 0.9),
        swayFreq: rand(0.012, 0.028),
        swayOff:  rand(0, Math.PI * 2),
        opacity:  rand(0.7, 1.0),
        color:    COLORS[Math.floor(Math.random() * COLORS.length)],
        t:        0,
      });
    }
    if (!rafId) loop();
  }

  function drawPetal(p) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);
    ctx.globalAlpha = p.opacity;
    ctx.beginPath();
    // Teardrop petal shape centered at origin
    const s = p.size;
    ctx.moveTo(0, -s);
    ctx.bezierCurveTo(-s * 0.55, -s * 0.6,  -s * 0.7,  s * 0.1,  0,  s);
    ctx.bezierCurveTo( s * 0.7,   s * 0.1,   s * 0.55, -s * 0.6,  0, -s);
    ctx.closePath();
    ctx.fillStyle = p.color;
    ctx.fill();
    // subtle center vein
    ctx.beginPath();
    ctx.moveTo(0, -s * 0.8);
    ctx.lineTo(0,  s * 0.8);
    ctx.strokeStyle = 'rgba(255,150,170,0.25)';
    ctx.lineWidth = 0.6;
    ctx.stroke();
    ctx.restore();
  }

  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    petals.forEach(p => {
      p.t++;
      p.y += p.vy;
      p.x += p.vx + Math.sin(p.swayOff + p.t * p.swayFreq) * p.sway;
      p.rotation += p.rotSpeed;
      // fade out in bottom quarter
      if (p.y > canvas.height * 0.72) p.opacity -= 0.012;
      drawPetal(p);
    });
    petals = petals.filter(p => p.y < canvas.height + 20 && p.opacity > 0);
    rafId = petals.length ? requestAnimationFrame(loop) : null;
  }

  // Fire on scroll-into-view; each section triggers once
  const sakuraObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        spawnBurst(parseInt(entry.target.dataset.sakura, 10) || 25);
        sakuraObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.25 });

  document.querySelectorAll('[data-sakura]').forEach(el => sakuraObs.observe(el));
})();
// ── END SAKURA ──

// Smooth scroll — ensure nav offset is accounted for
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = nav.offsetHeight + 16;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});
