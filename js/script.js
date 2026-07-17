// ===== theme toggle (dark / light) =====
const root = document.documentElement;
const themeButton = document.getElementById('themeToggle');

function applyTheme(theme){
  root.setAttribute('data-theme', theme);
  try { localStorage.setItem('fb-theme', theme); } catch(e){}
}

(function initTheme(){
  let saved = null;
  try { saved = localStorage.getItem('fb-theme'); } catch(e){}
  if (saved === 'light' || saved === 'dark'){
    applyTheme(saved);
  }
})();

if (themeButton){
  themeButton.addEventListener('click', () => {
    const current = root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    applyTheme(current === 'dark' ? 'light' : 'dark');
  });
}

// ===== mobile nav toggle =====
const navToggle = document.getElementById('navToggle');
const sidebar = document.getElementById('sidebar');
const navOverlay = document.getElementById('navOverlay');

function openNav(){
  sidebar.classList.add('is-open');
  navOverlay.classList.add('is-visible');
  navToggle.setAttribute('aria-expanded','true');
  document.body.style.overflow = 'hidden';
}
function closeNav(){
  sidebar.classList.remove('is-open');
  navOverlay.classList.remove('is-visible');
  navToggle.setAttribute('aria-expanded','false');
  document.body.style.overflow = '';
}
navToggle.addEventListener('click', () => {
  sidebar.classList.contains('is-open') ? closeNav() : openNav();
});
navOverlay.addEventListener('click', closeNav);
document.querySelectorAll('.nav-link').forEach(link => link.addEventListener('click', closeNav));

// ===== active section highlighting =====
const sections = document.querySelectorAll('main section[id]');
const navLinks = document.querySelectorAll('.nav-link');

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting){
      const id = entry.target.getAttribute('id');
      navLinks.forEach(link => link.classList.toggle('is-active', link.dataset.nav === id));
    }
  });
}, { rootMargin: '-40% 0px -50% 0px', threshold: 0 });

sections.forEach(section => navObserver.observe(section));

// ===== scroll reveal animations =====
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting){
      setTimeout(() => entry.target.classList.add('is-visible'), i * 40);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

// ===== project carousel =====
const track = document.getElementById('carouselTrack');
const slides = track ? Array.from(track.children) : [];
const prevBtn = document.getElementById('prevSlide');
const nextBtn = document.getElementById('nextSlide');
const dots = Array.from(document.querySelectorAll('.carousel__dot'));
let currentSlide = 0;

function updateCarousel(){
  track.style.transform = `translateX(-${currentSlide * 100}%)`;
  dots.forEach((dot, i) => dot.classList.toggle('is-active', i === currentSlide));
}

if (track && slides.length){
  prevBtn.addEventListener('click', () => {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    updateCarousel();
  });
  nextBtn.addEventListener('click', () => {
    currentSlide = (currentSlide + 1) % slides.length;
    updateCarousel();
  });
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      currentSlide = parseInt(dot.dataset.slide, 10);
      updateCarousel();
    });
  });

  let touchStartX = 0;
  track.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, {passive:true});
  track.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 50){
      currentSlide = dx < 0
        ? (currentSlide + 1) % slides.length
        : (currentSlide - 1 + slides.length) % slides.length;
      updateCarousel();
    }
  }, {passive:true});
}
