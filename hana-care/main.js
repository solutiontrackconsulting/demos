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
