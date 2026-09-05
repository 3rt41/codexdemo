/* ============================================================
   FATA VERDE — main.js
   Scroll animations, navbar, parallax
   ============================================================ */

// ── NAVBAR SCROLL ──────────────────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}, { passive: true });

// ── SCROLL REVEAL ──────────────────────────────────────────
const revealElements = document.querySelectorAll(
  '.founder-card, .production-item, .project-card, .gallery-item, ' +
  '.about-text, .about-founders, .contact-info, .contact-ornament, ' +
  '.section-header, .section-intro, .about-lead'
);

revealElements.forEach(el => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger siblings
      const siblings = [...entry.target.parentElement.querySelectorAll('.reveal')];
      const idx = siblings.indexOf(entry.target);
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, idx * 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
});

revealElements.forEach(el => revealObserver.observe(el));

// ── HERO PARALLAX ──────────────────────────────────────────
const heroBg = document.querySelector('.hero-bg-image img');
if (heroBg) {
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    if (scrolled < window.innerHeight) {
      heroBg.style.transform = `translateY(${scrolled * 0.3}px)`;
    }
  }, { passive: true });
}

// ── SMOOTH NAV LINKS ──────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = navbar.offsetHeight + 20;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ── GALLERY LIGHTBOX (minimal) ─────────────────────────────
const galleryItems = document.querySelectorAll('.gallery-item');

galleryItems.forEach(item => {
  item.addEventListener('click', () => {
    const img = item.querySelector('img');
    if (!img) return;

    const overlay = document.createElement('div');
    overlay.id = 'lightbox';
    overlay.style.cssText = `
      position: fixed; inset: 0; z-index: 10000;
      background: rgba(5,5,6,0.96);
      display: flex; align-items: center; justify-content: center;
      cursor: zoom-out;
      animation: lightboxIn 0.3s ease both;
    `;

    const image = document.createElement('img');
    image.src = img.src;
    image.alt = img.alt;
    image.style.cssText = `
      max-width: 92vw; max-height: 90vh;
      object-fit: contain;
      border: 1px solid rgba(200,168,75,0.2);
      box-shadow: 0 0 80px rgba(200,168,75,0.08);
    `;

    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '✕';
    closeBtn.style.cssText = `
      position: absolute; top: 1.5rem; right: 2rem;
      background: none; border: none;
      color: #c8a84b; font-size: 1.5rem;
      cursor: pointer; opacity: 0.6;
      font-family: 'Cormorant Garamond', serif;
      transition: opacity 0.2s;
    `;
    closeBtn.onmouseenter = () => closeBtn.style.opacity = '1';
    closeBtn.onmouseleave = () => closeBtn.style.opacity = '0.6';

    const close = () => {
      overlay.style.opacity = '0';
      overlay.style.transition = 'opacity 0.25s';
      setTimeout(() => overlay.remove(), 250);
    };

    overlay.addEventListener('click', close);
    closeBtn.addEventListener('click', close);
    image.addEventListener('click', e => e.stopPropagation());

    overlay.append(image, closeBtn);
    document.body.appendChild(overlay);
  });
});

// ── INJECT LIGHTBOX KEYFRAMES ──────────────────────────────
const style = document.createElement('style');
style.textContent = `
  @keyframes lightboxIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
`;
document.head.appendChild(style);

// ── GOLD CURSOR TRAIL (subtle) ─────────────────────────────
const trail = [];
const TRAIL_COUNT = 6;

for (let i = 0; i < TRAIL_COUNT; i++) {
  const dot = document.createElement('div');
  dot.style.cssText = `
    position: fixed; pointer-events: none; z-index: 9998;
    width: ${4 - i * 0.4}px; height: ${4 - i * 0.4}px;
    border-radius: 50%;
    background: rgba(200,168,75, ${0.3 - i * 0.04});
    transform: translate(-50%, -50%);
    transition: left ${0.05 + i * 0.04}s ease, top ${0.05 + i * 0.04}s ease;
    will-change: left, top;
  `;
  document.body.appendChild(dot);
  trail.push(dot);
}

let mouseX = 0, mouseY = 0;
document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  trail.forEach((dot) => {
    dot.style.left = mouseX + 'px';
    dot.style.top  = mouseY + 'px';
  });
}, { passive: true });

console.log('%c✦ Fata Verde ✦', 'color: #c8a84b; font-family: serif; font-size: 18px; font-style: italic;');
