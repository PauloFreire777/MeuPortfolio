/* ============================================================
   PAULO FREIRE — PORTFOLIO
   script.js — Interactivity & Animations
   ============================================================ */

/* ── 1. NAVBAR: scroll shadow + active link ─────────────────── */
(function initNavbar() {
  const navbar    = document.getElementById('navbar');
  const navLinks  = document.querySelectorAll('.nav-link');
  const sections  = document.querySelectorAll('section[id]');
  const hamburger = document.getElementById('hamburger');
  const navMenu   = document.getElementById('nav-menu');

  /* Scroll shadow */
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
    highlightActiveLink();
  }, { passive: true });

  /* Active nav link based on scroll position */
  function highlightActiveLink() {
    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 100;
      if (window.scrollY >= top) current = sec.id;
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
  }

  /* Mobile hamburger toggle */
  hamburger.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
  });

  /* Close menu on link click (mobile) */
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });
})();

/* ── 2. TYPING EFFECT (Hero) ─────────────────────────────── */
(function initTyping() {
  const target = document.getElementById('typing-target');
  const cursor = document.getElementById('typing-cursor');
  if (!target) return;

  const phrases = [
    'Estudante de Ciencia da Computacao',
    'Bacharel em Direito',
    'Dev Front-end em formacao',
    'Entusiasta de Linux & Open Source',
    'Apaixonado por resolver problemas',
  ];

  let phraseIndex = 0;
  let charIndex   = 0;
  let isDeleting  = false;
  let isPaused    = false;

  const SPEED_TYPE   = 65;
  const SPEED_DELETE = 35;
  const PAUSE_END    = 1800;
  const PAUSE_START  = 350;

  function type() {
    const current = phrases[phraseIndex];

    if (isPaused) return;

    if (!isDeleting) {
      target.textContent = current.slice(0, charIndex + 1);
      charIndex++;
      if (charIndex === current.length) {
        isPaused = true;
        setTimeout(() => { isPaused = false; isDeleting = true; type(); }, PAUSE_END);
        return;
      }
    } else {
      target.textContent = current.slice(0, charIndex - 1);
      charIndex--;
      if (charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        isPaused = true;
        setTimeout(() => { isPaused = false; type(); }, PAUSE_START);
        return;
      }
    }

    setTimeout(type, isDeleting ? SPEED_DELETE : SPEED_TYPE);
  }

  /* Start after a short delay so the terminal animation finishes */
  setTimeout(type, 1200);
})();

/* ── 3. SCROLL REVEAL ───────────────────────────────────── */
(function initReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  function activateElement(el, delay) {
    setTimeout(() => el.classList.add('visible'), delay);
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          /* Stagger siblings inside the same parent */
          const siblings = Array.from(
            entry.target.parentElement.querySelectorAll('.reveal:not(.visible)')
          );
          const idx = Math.max(siblings.indexOf(entry.target), 0);
          activateElement(entry.target, idx * 80);
          observer.unobserve(entry.target);
        }
      });
    },
    /* rootMargin positivo no topo garante que elementos já visíveis disparem */
    { threshold: 0.05, rootMargin: '60px 0px 0px 0px' }
  );

  /* Primeira passagem: ativa elementos já visíveis sem esperar scroll */
  elements.forEach(el => {
    const rect = el.getBoundingClientRect();
    const alreadyVisible = rect.top < window.innerHeight && rect.bottom > 0;
    if (alreadyVisible) {
      activateElement(el, 0);
    } else {
      observer.observe(el);
    }
  });
})();

/* ── 4. SKILL BARS ──────────────────────────────────────── */
(function initSkillBars() {
  const bars = document.querySelectorAll('.skill-bar');
  if (!bars.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const bar   = entry.target;
          const level = bar.getAttribute('data-level') || 0;
          bar.querySelector('.skill-bar-fill').style.width = level + '%';
          observer.unobserve(bar);
        }
      });
    },
    { threshold: 0.4 }
  );

  bars.forEach(bar => observer.observe(bar));
})();

/* ── 5. SMOOTH SCROLL (for browsers that need help) ─────── */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const id  = anchor.getAttribute('href').slice(1);
      const el  = document.getElementById(id);
      if (!el) return;
      e.preventDefault();
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
})();

/* ── 6. GLITCH on hero name (subtle) ───────────────────── */
(function initGlitch() {
  const heroName = document.querySelector('.hero-name');
  if (!heroName) return;

  setInterval(() => {
    /* Tiny random chance to glitch */
    if (Math.random() > 0.985) {
      heroName.style.textShadow = '2px 0 rgba(0,245,160,.6), -2px 0 rgba(157,78,221,.6)';
      setTimeout(() => { heroName.style.textShadow = 'none'; }, 120);
    }
  }, 300);
})();

/* ── 7. TAG HOVER SPARKLE (canvas micro-effect) ─────────── */
(function initTagSparkle() {
  document.querySelectorAll('.tag, .timeline-tags span, .project-tech span').forEach(tag => {
    tag.addEventListener('mouseenter', function(e) {
      const rect = this.getBoundingClientRect();
      for (let i = 0; i < 5; i++) {
        spawnParticle(
          rect.left + rect.width / 2 + window.scrollX,
          rect.top  + rect.height / 2 + window.scrollY
        );
      }
    });
  });

  function spawnParticle(x, y) {
    const p = document.createElement('span');
    p.style.cssText = `
      position: absolute;
      width: 4px; height: 4px;
      background: #00f5a0;
      border-radius: 50%;
      pointer-events: none;
      z-index: 9999;
      top: ${y}px;
      left: ${x}px;
      opacity: 1;
      transform: translate(-50%,-50%);
    `;
    document.body.appendChild(p);

    const angle = Math.random() * Math.PI * 2;
    const dist  = 20 + Math.random() * 30;
    const dx    = Math.cos(angle) * dist;
    const dy    = Math.sin(angle) * dist;

    p.animate([
      { transform: `translate(-50%,-50%)`, opacity: 1 },
      { transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`, opacity: 0 }
    ], { duration: 600, easing: 'ease-out' }).onfinish = () => p.remove();
  }
})();
