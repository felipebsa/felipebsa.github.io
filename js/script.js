/**
 * Felipe Barbosa — Personal Portfolio
 * Vanilla JS, no dependencies. Handles: theme persistence, mobile nav,
 * active-section tracking, scroll-reveal animations, and the project carousel.
 */
(() => {
  'use strict';

  const THEME_STORAGE_KEY = 'fb-theme';
  const root = document.documentElement;

  /* ---------------------------------------------------------------------
   * Theme (light / dark), persisted to localStorage
   * ------------------------------------------------------------------- */
  const themeToggle = document.getElementById('themeToggle');

  const getStoredTheme = () => {
    try {
      return localStorage.getItem(THEME_STORAGE_KEY);
    } catch {
      return null;
    }
  };

  const setTheme = (theme) => {
    root.setAttribute('data-theme', theme);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      /* localStorage unavailable (e.g. private browsing) — theme just won't persist */
    }
  };

  const storedTheme = getStoredTheme();
  if (storedTheme === 'light' || storedTheme === 'dark') {
    setTheme(storedTheme);
  }

  themeToggle?.addEventListener('click', () => {
    const isLight = root.getAttribute('data-theme') === 'light';
    setTheme(isLight ? 'dark' : 'light');
  });

  /* ---------------------------------------------------------------------
   * Mobile navigation (off-canvas sidebar)
   * ------------------------------------------------------------------- */
  const navToggle = document.getElementById('navToggle');
  const sidebar = document.getElementById('sidebar');
  const navOverlay = document.getElementById('navOverlay');

  const openNav = () => {
    sidebar.classList.add('is-open');
    navOverlay.classList.add('is-visible');
    navToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };

  const closeNav = () => {
    sidebar.classList.remove('is-open');
    navOverlay.classList.remove('is-visible');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  navToggle?.addEventListener('click', () => {
    sidebar.classList.contains('is-open') ? closeNav() : openNav();
  });
  navOverlay?.addEventListener('click', closeNav);
  document.querySelectorAll('.nav-link').forEach((link) => link.addEventListener('click', closeNav));

  /* ---------------------------------------------------------------------
   * Active-section highlighting in the sidebar nav
   * ------------------------------------------------------------------- */
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.id;
        navLinks.forEach((link) => link.classList.toggle('is-active', link.dataset.nav === id));
      });
    },
    { rootMargin: '-40% 0px -50% 0px' }
  );
  sections.forEach((section) => sectionObserver.observe(section));

  /* ---------------------------------------------------------------------
   * Scroll-reveal animation for elements marked .reveal
   * ------------------------------------------------------------------- */
  const REVEAL_STAGGER_MS = 40;

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, index) => {
        if (!entry.isIntersecting) return;
        window.setTimeout(() => entry.target.classList.add('is-visible'), index * REVEAL_STAGGER_MS);
        revealObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
  );
  document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

  /* ---------------------------------------------------------------------
   * Project carousel
   * ------------------------------------------------------------------- */
  const track = document.getElementById('carouselTrack');
  if (track) {
    const slides = Array.from(track.children);
    const dots = Array.from(document.querySelectorAll('.carousel__dot'));
    const prevButton = document.getElementById('prevSlide');
    const nextButton = document.getElementById('nextSlide');
    const SWIPE_THRESHOLD_PX = 50;

    let activeIndex = 0;

    const goToSlide = (index) => {
      activeIndex = (index + slides.length) % slides.length;
      track.style.transform = `translateX(-${activeIndex * 100}%)`;
      dots.forEach((dot, i) => dot.classList.toggle('is-active', i === activeIndex));
    };

    prevButton.addEventListener('click', () => goToSlide(activeIndex - 1));
    nextButton.addEventListener('click', () => goToSlide(activeIndex + 1));
    dots.forEach((dot, i) => dot.addEventListener('click', () => goToSlide(i)));

    let touchStartX = 0;
    track.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', (e) => {
      const deltaX = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(deltaX) < SWIPE_THRESHOLD_PX) return;
      goToSlide(activeIndex + (deltaX < 0 ? 1 : -1));
    }, { passive: true });
  }
})();