/**
 * PORTFOLIO — script.js
 * Author : Immanuel
 * Stack  : Vanilla JS (no dependencies)
 */

/* ─────────────────────────────────────
   1. THEME TOGGLE (Dark / Light)
───────────────────────────────────── */
(function initTheme() {
  const html         = document.documentElement;
  const toggleBtn    = document.getElementById('themeToggle');
  const STORAGE_KEY  = 'portfolio-theme';

  // Apply saved preference on load
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) html.setAttribute('data-theme', saved);

  toggleBtn.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next    = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem(STORAGE_KEY, next);
  });
})();


/* ─────────────────────────────────────
   2. TYPED TEXT EFFECT
───────────────────────────────────── */
(function initTyped() {
  const el      = document.getElementById('typedText');
  if (!el) return;

  const words   = ['UI/UX Designer', 'Front-End Developer', 'Creative Coder', 'can`be anything', 'If you can, please make a reasonable request'];
  let wordIdx   = 0;
  let charIdx   = 0;
  let deleting  = false;
  let paused    = false;

  function type() {
    if (paused) return;

    const currentWord = words[wordIdx];

    if (!deleting) {
      // Typing forward
      charIdx++;
      el.textContent = currentWord.slice(0, charIdx);

      if (charIdx === currentWord.length) {
        paused = true;
        setTimeout(() => { paused = false; deleting = true; type(); }, 1800);
        return;
      }
    } else {
      // Deleting
      charIdx--;
      el.textContent = currentWord.slice(0, charIdx);

      if (charIdx === 0) {
        deleting = false;
        wordIdx  = (wordIdx + 1) % words.length;
        paused   = true;
        setTimeout(() => { paused = false; type(); }, 400);
        return;
      }
    }

    const speed = deleting ? 60 : 100;
    setTimeout(type, speed);
  }

  // Kick off after a short delay
  setTimeout(type, 600);
})();


/* ─────────────────────────────────────
   3. SIDEBAR — Active Link on Scroll
───────────────────────────────────── */
(function initActiveNav() {
  const links    = document.querySelectorAll('.sidebar__link');
  const sections = document.querySelectorAll('section[id]');

  function setActive() {
    const scrollY = window.scrollY + 150;

    sections.forEach(section => {
      const top    = section.offsetTop;
      const height = section.offsetHeight;
      const id     = section.getAttribute('id');

      if (scrollY >= top && scrollY < top + height) {
        links.forEach(l => l.classList.remove('active'));
        const match = document.querySelector(`.sidebar__link[href="#${id}"]`);
        if (match) match.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', setActive, { passive: true });
  setActive();
})();


/* ─────────────────────────────────────
   4. MOBILE HAMBURGER
───────────────────────────────────── */
(function initHamburger() {
  const hamburger = document.getElementById('hamburger');
  const sidebar   = document.getElementById('sidebar');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    sidebar.classList.toggle('open');
  });

  // Close on nav link click (mobile)
  document.querySelectorAll('.sidebar__link').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        hamburger.classList.remove('open');
        sidebar.classList.remove('open');
      }
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (
      window.innerWidth <= 768 &&
      !sidebar.contains(e.target) &&
      !hamburger.contains(e.target)
    ) {
      hamburger.classList.remove('open');
      sidebar.classList.remove('open');
    }
  });
})();


/* ─────────────────────────────────────
   5. SKILL BARS — Animate on scroll
───────────────────────────────────── */
(function initSkillBars() {
  const bars     = document.querySelectorAll('.skill-bar');
  let animated   = false;

  function animateBars() {
    if (animated) return;

    const section  = document.getElementById('skills');
    if (!section) return;

    const rect     = section.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.85) {
      bars.forEach(bar => {
        const pct  = bar.getAttribute('data-percent');
        const fill = bar.querySelector('.skill-bar__fill');
        if (fill) {
          // Small delay to ensure CSS transition picks up
          requestAnimationFrame(() => {
            fill.style.width = pct + '%';
          });
        }
      });
      animated = true;
    }
  }

  window.addEventListener('scroll', animateBars, { passive: true });
  animateBars(); // check on load in case already visible
})();


/* ─────────────────────────────────────
   6. SCROLL REVEAL
───────────────────────────────────── */
(function initScrollReveal() {
  // Add reveal classes dynamically to major elements
  const targets = [
    { selector: '.hero__text',       cls: 'reveal-left'  },
    { selector: '.hero__image',      cls: 'reveal-right' },
    { selector: '.about__image',     cls: 'reveal-left'  },
    { selector: '.about__content',   cls: 'reveal-right' },
    { selector: '.skills__left',     cls: 'reveal-left'  },
    { selector: '.skills__right',    cls: 'reveal-right' },
    { selector: '.project-card',     cls: 'reveal'       },
    { selector: '.contact__info',    cls: 'reveal-left'  },
    { selector: '.contact__form-wrap', cls: 'reveal-right' },
    { selector: '.section-title',    cls: 'reveal'       },
    { selector: '.section-subtitle', cls: 'reveal'       },
  ];

  targets.forEach(({ selector, cls }) => {
    document.querySelectorAll(selector).forEach(el => {
      el.classList.add(cls);
    });
  });

  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, idx) => {
      if (entry.isIntersecting) {
        // Stagger project cards
        const delay = entry.target.classList.contains('project-card')
          ? Array.from(entry.target.parentElement.children).indexOf(entry.target) * 80
          : 0;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealEls.forEach(el => observer.observe(el));
})();


/* ─────────────────────────────────────
   7. SCROLL TO TOP BUTTON
───────────────────────────────────── */
(function initScrollTop() {
  const btn = document.getElementById('scrollTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();


/* ─────────────────────────────────────
   8. CONTACT FORM
───────────────────────────────────── */
(function initContactForm() {
  const form    = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  if (!form || !success) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const inputs = form.querySelectorAll('[required]');
    let valid    = true;

    inputs.forEach(input => {
      if (!input.value.trim()) {
        valid = false;
        input.style.borderColor = '#f44336';
        input.addEventListener('input', () => {
          input.style.borderColor = '';
        }, { once: true });
      }
    });

    if (!valid) return;

    // Simulate sending
    const submitBtn = form.querySelector('[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Mengirim...';

    setTimeout(() => {
      form.reset();
      submitBtn.disabled    = false;
      submitBtn.innerHTML   = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:18px;height:18px">
          <line x1="22" y1="2" x2="11" y2="13"/>
          <polygon points="22 2 15 22 11 13 2 9 22 2"/>
        </svg>
        Kirim Pesan
      `;
      success.classList.add('visible');
      setTimeout(() => success.classList.remove('visible'), 4000);
    }, 1200);
  });
})();


/* ─────────────────────────────────────
   9. SMOOTH SCROLL (fallback for Safari)
───────────────────────────────────── */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
})();


/* ─────────────────────────────────────
   10. CURSOR GLOW EFFECT (desktop only)
───────────────────────────────────── */
(function initCursorGlow() {
  if (window.matchMedia('(pointer: coarse)').matches) return; // skip touch devices

  const glow = document.createElement('div');
  glow.style.cssText = `
    position: fixed;
    pointer-events: none;
    z-index: 9999;
    width: 350px;
    height: 350px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(46,110,245,0.06) 0%, transparent 70%);
    transform: translate(-50%, -50%);
    transition: opacity 0.3s;
    top: 0;
    left: 0;
  `;
  document.body.appendChild(glow);

  let cx = 0, cy = 0;
  let tx = 0, ty = 0;

  document.addEventListener('mousemove', (e) => {
    tx = e.clientX;
    ty = e.clientY;
  });

  function animate() {
    cx += (tx - cx) * 0.12;
    cy += (ty - cy) * 0.12;
    glow.style.left = cx + 'px';
    glow.style.top  = cy + 'px';
    requestAnimationFrame(animate);
  }

  animate();
})();