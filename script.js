// Cookie banner
function acceptCookies() {
  localStorage.setItem('cookieConsent', 'accepted');
  document.getElementById('cookieBanner').classList.add('hidden');
}
function declineCookies() {
  localStorage.setItem('cookieConsent', 'declined');
  document.getElementById('cookieBanner').classList.add('hidden');
}
if (localStorage.getItem('cookieConsent')) {
  document.getElementById('cookieBanner').classList.add('hidden');
}

// FAQ accordion
function toggleFaq(btn) {
  const item = btn.closest('.faq-item');
  const isOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item.open').forEach(el => el.classList.remove('open'));
  if (!isOpen) item.classList.add('open');
}

// Nav menu
function toggleMenu() {
  document.querySelector('.nav-links').classList.toggle('open');
}
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    document.querySelector('.nav-links').classList.remove('open');
  });
});

// Contact form
function handleSubmit(e) {
  e.preventDefault();
  const btn = e.target.querySelector('button');
  btn.textContent = 'Отправлено!';
  btn.style.background = '#2ecc71';
  setTimeout(() => {
    btn.textContent = 'Отправить';
    btn.style.background = '';
    e.target.reset();
  }, 3000);
}

// Click-to-play video placeholders
document.querySelectorAll('.video-placeholder').forEach(placeholder => {
  placeholder.addEventListener('click', () => {
    const src = placeholder.dataset.src;
    const iframe = document.createElement('iframe');
    iframe.src = src;
    iframe.frameBorder = '0';
    iframe.allow = 'clipboard-write; autoplay; fullscreen; picture-in-picture';
    iframe.allowFullscreen = true;
    iframe.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;';
    placeholder.replaceWith(iframe);
  });
});

// Scroll animations
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.card, .project-card').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  observer.observe(el);
});

// Animated wave background for sections
const waveConfigs = [
  { amp: 55,  freq: 0.010, speed: 0.016, color: 'rgba(200,137,26,0.15)', offset: 0 },
  { amp: 35,  freq: 0.016, speed: 0.022, color: 'rgba(200,137,26,0.10)', offset: 2 },
  { amp: 70,  freq: 0.007, speed: 0.010, color: 'rgba(232,168,58,0.08)', offset: 4 },
  { amp: 25,  freq: 0.022, speed: 0.028, color: 'rgba(200,137,26,0.06)', offset: 1 },
];

function initWave(canvas) {
  const ctx = canvas.getContext('2d');
  const section = canvas.parentElement;
  let tick = Math.random() * 1000;

  function resize() {
    canvas.width = section.offsetWidth;
    canvas.height = section.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  function drawWave(wave) {
    ctx.beginPath();
    ctx.moveTo(0, canvas.height / 2);
    for (let x = 0; x <= canvas.width; x++) {
      const y = canvas.height / 2
        + Math.sin(x * wave.freq + tick * wave.speed + wave.offset) * wave.amp
        + Math.sin(x * wave.freq * 1.6 + tick * wave.speed * 0.7 + wave.offset) * (wave.amp * 0.35);
      ctx.lineTo(x, y);
    }
    ctx.lineTo(canvas.width, canvas.height);
    ctx.lineTo(0, canvas.height);
    ctx.closePath();
    ctx.fillStyle = wave.color;
    ctx.fill();
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    waveConfigs.forEach(w => drawWave(w));
    tick++;
    requestAnimationFrame(animate);
  }

  animate();
}

document.querySelectorAll('.wave-canvas').forEach(canvas => initWave(canvas));

// Portfolio guest gallery
const pgCards = Array.from(document.querySelectorAll('.pg-card'));
const pgLightbox = document.querySelector('.pg-lightbox');
const pgLbImg = document.querySelector('.pg-lb-img');
const pgLbPrev = document.querySelector('.pg-lb-prev');
const pgLbNext = document.querySelector('.pg-lb-next');
let pgIndex = 0;

function openPgLightbox(index) {
  pgIndex = index;
  pgLbImg.src = pgCards[pgIndex].dataset.src;
  pgLightbox.classList.add('open');
}
function changePgPhoto(delta) {
  pgIndex = (pgIndex + delta + pgCards.length) % pgCards.length;
  pgLbImg.src = pgCards[pgIndex].dataset.src;
}

pgCards.forEach(card => {
  card.addEventListener('click', () => openPgLightbox(parseInt(card.dataset.pgIndex)));
});

if (pgLightbox) {
  pgLightbox.querySelector('.lightbox-backdrop').addEventListener('click', () => pgLightbox.classList.remove('open'));
  pgLightbox.querySelector('.lightbox-close').addEventListener('click', () => pgLightbox.classList.remove('open'));
  if (pgLbPrev) pgLbPrev.addEventListener('click', () => changePgPhoto(-1));
  if (pgLbNext) pgLbNext.addEventListener('click', () => changePgPhoto(1));
}

document.querySelector('.pg-prev')?.addEventListener('click', () => {
  document.querySelector('.pg-scroll').scrollBy({ left: -300, behavior: 'smooth' });
});
document.querySelector('.pg-next')?.addEventListener('click', () => {
  document.querySelector('.pg-scroll').scrollBy({ left: 300, behavior: 'smooth' });
});

// Studio gallery slider and lightbox
const galleryTrack = document.querySelector('.gallery-track');
const prevBtn = document.querySelector('.gallery-btn.prev');
const nextBtn = document.querySelector('.gallery-btn.next');
const gallerySidePrev = document.querySelector('.gallery-side-prev');
const gallerySideNext = document.querySelector('.gallery-side-next');
const lightbox = document.querySelector('.lightbox');
const lightboxBackdrop = document.querySelector('.lightbox-backdrop');
const lightboxImage = document.querySelector('.lightbox-image');
const lightboxClose = document.querySelector('.lightbox-close');
const lightboxPrev = document.querySelector('.lightbox-prev');
const lightboxNext = document.querySelector('.lightbox-next');
let currentLightboxIndex = 0;

const galleryCards = galleryTrack ? Array.from(galleryTrack.querySelectorAll('.gallery-card')) : [];
let galleryIndex = 0;

function scrollGallery(direction) {
  if (!galleryCards.length) return;
  galleryIndex = Math.min(Math.max(galleryIndex + direction, 0), galleryCards.length - 1);
  galleryCards[galleryIndex].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
}

function setLightboxImage(index) {
  const card = galleryCards[index];
  if (!card) return;
  currentLightboxIndex = index;
  const img = card.querySelector('img');
  lightboxImage.src = img?.src || card.dataset.src || '';
  lightboxImage.alt = img?.alt || card.dataset.alt || 'Фото студии';
  lightbox.classList.add('open');
}

function changeLightboxImage(delta) {
  if (!galleryCards.length) return;
  const nextIndex = (currentLightboxIndex + delta + galleryCards.length) % galleryCards.length;
  setLightboxImage(nextIndex);
}

if (galleryTrack) {
  if (prevBtn) prevBtn.addEventListener('click', () => scrollGallery(-1));
  if (nextBtn) nextBtn.addEventListener('click', () => scrollGallery(1));
  if (gallerySidePrev) gallerySidePrev.addEventListener('click', () => scrollGallery(-1));
  if (gallerySideNext) gallerySideNext.addEventListener('click', () => scrollGallery(1));
}

if (galleryTrack && lightbox && lightboxImage) {
  galleryCards.forEach(card => {
    card.addEventListener('click', () => {
      galleryIndex = parseInt(card.dataset.index, 10) || 0;
      setLightboxImage(galleryIndex);
    });
  });
}

if (lightbox && lightboxClose && lightboxBackdrop) {
  const closeLightbox = () => lightbox.classList.remove('open');
  lightboxClose.addEventListener('click', closeLightbox);
  lightboxBackdrop.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) closeLightbox();
  });
  if (lightboxPrev) {
    lightboxPrev.addEventListener('click', () => changeLightboxImage(-1));
  }
  if (lightboxNext) {
    lightboxNext.addEventListener('click', () => changeLightboxImage(1));
  }
  window.addEventListener('keydown', (event) => {
    if (!lightbox.classList.contains('open')) return;
    if (event.key === 'ArrowLeft') {
      changeLightboxImage(-1);
    }
    if (event.key === 'ArrowRight') {
      changeLightboxImage(1);
    }
    if (event.key === 'Escape') {
      closeLightbox();
    }
  });
}
