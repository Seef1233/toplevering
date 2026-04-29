/**
 * Top Aflevering - Main JavaScript
 * Features: Navbar, Counters, FAQ, Slider, Form, Animations, Scroll
 */

'use strict';

/* ===== NAVBAR ===== */
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
const navLinks = document.querySelectorAll('.nav-link');

// Sticky navbar on scroll
window.addEventListener('scroll', () => {
  if (window.scrollY > 80) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  handleScrollTop();
}, { passive: true });

// Mobile hamburger menu
hamburger.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen);
  mobileMenu.setAttribute('aria-hidden', !isOpen);
});

// Close mobile menu on nav link click
document.querySelectorAll('.mobile-menu .nav-link').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
  });
});

// Close mobile menu on outside click
document.addEventListener('click', (e) => {
  if (!navbar.contains(e.target)) {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  }
});

// Update active nav link based on current page URL
function updateActiveNavLink() {
  const path = window.location.pathname;
  // Determine the current page filename
  const page = path.split('/').pop() || 'index.html';

  navLinks.forEach(link => {
    link.classList.remove('active');
    const href = link.getAttribute('href') || '';
    const hrefPage = href.split('/').pop() || 'index.html';

    // Match exact page, treat empty href and 'index.html' as home
    if (
      hrefPage === page ||
      (page === '' && hrefPage === 'index.html') ||
      (page === 'index.html' && (hrefPage === 'index.html' || href === '#' || href === '/' || href === ''))
    ) {
      link.classList.add('active');
    }
  });
}

/* ===== SMOOTH SCROLL FOR ANCHOR LINKS ===== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const navHeight = navbar.offsetHeight;
      const targetPos = target.getBoundingClientRect().top + window.scrollY - navHeight - 10;
      window.scrollTo({ top: targetPos, behavior: 'smooth' });
    }
  });
});

/* ===== SCROLL TO TOP ===== */
const scrollTopBtn = document.getElementById('scrollTop');

function handleScrollTop() {
  if (!scrollTopBtn) return;
  if (window.innerWidth <= 768) {
    scrollTopBtn.hidden = true;
    scrollTopBtn.classList.remove('visible');
    return;
  }
  if (window.scrollY > 400) {
    scrollTopBtn.classList.add('visible');
    scrollTopBtn.hidden = false;
  } else {
    scrollTopBtn.classList.remove('visible');
    scrollTopBtn.hidden = true;
  }
}

if (scrollTopBtn) {
  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ===== ANIMATED COUNTERS ===== */
const counters = document.querySelectorAll('.counter');
let countersStarted = false;

function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 2000;
  const step = target / (duration / 16);
  let current = 0;

  const update = () => {
    current += step;
    if (current < target) {
      el.textContent = Math.floor(current).toLocaleString('nl-NL');
      requestAnimationFrame(update);
    } else {
      el.textContent = target.toLocaleString('nl-NL');
    }
  };

  requestAnimationFrame(update);
}

function startCounters() {
  if (countersStarted) return;
  countersStarted = true;
  counters.forEach(animateCounter);
}

/* ===== INTERSECTION OBSERVER (Animations + Counters) ===== */
const observerOptions = {
  threshold: 0.15,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observe fade-in elements
document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right').forEach(el => {
  observer.observe(el);
});

// Counter observer
const statsSection = document.querySelector('.stats-section');
if (statsSection) {
  const counterObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      startCounters();
      counterObserver.unobserve(statsSection);
    }
  }, { threshold: 0.3 });
  counterObserver.observe(statsSection);
}

// Also trigger hero counters when they come into view
const heroSection = document.querySelector('.hero');
if (heroSection) {
  const heroCounterObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      document.querySelectorAll('.hero .counter').forEach(animateCounter);
      heroCounterObserver.unobserve(heroSection);
    }
  }, { threshold: 0.3 });
  heroCounterObserver.observe(heroSection);
}

/* ===== ADD ANIMATION CLASSES ===== */
function addAnimationClasses() {
  // Service cards
  document.querySelectorAll('.service-card').forEach((card, i) => {
    card.classList.add('fade-in');
    card.style.transitionDelay = `${i * 0.1}s`;
    observer.observe(card);
  });

  // Pricing cards
  document.querySelectorAll('.pricing-card').forEach((card, i) => {
    card.classList.add('fade-in');
    card.style.transitionDelay = `${i * 0.15}s`;
    observer.observe(card);
  });

  // Feature items
  document.querySelectorAll('.feature-item').forEach((item, i) => {
    item.classList.add('fade-in');
    item.style.transitionDelay = `${i * 0.1}s`;
    observer.observe(item);
  });

  // FAQ items
  document.querySelectorAll('.faq-item').forEach((item, i) => {
    item.classList.add('fade-in');
    item.style.transitionDelay = `${i * 0.08}s`;
    observer.observe(item);
  });

  // Section headers
  document.querySelectorAll('.section-header').forEach(header => {
    header.classList.add('fade-in');
    observer.observe(header);
  });

  // About grid
  const aboutImage = document.querySelector('.about-image');
  const aboutContent = document.querySelector('.about-content');
  if (aboutImage) { aboutImage.classList.add('fade-in-right'); observer.observe(aboutImage); }
  if (aboutContent) { aboutContent.classList.add('fade-in-left'); observer.observe(aboutContent); }

  // Contact
  const contactInfo = document.querySelector('.contact-info');
  const contactForm = document.querySelector('.contact-form-wrapper');
  if (contactInfo) { contactInfo.classList.add('fade-in-right'); observer.observe(contactInfo); }
  if (contactForm) { contactForm.classList.add('fade-in-left'); observer.observe(contactForm); }
}

/* ===== FAQ ACCORDION ===== */
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
  const question = item.querySelector('.faq-question');
  const answer = item.querySelector('.faq-answer');

  if (!question || !answer) return;

  question.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');

    // Close all
    faqItems.forEach(other => {
      other.classList.remove('open');
      const otherAnswer = other.querySelector('.faq-answer');
      const otherQuestion = other.querySelector('.faq-question');
      if (otherAnswer) { otherAnswer.classList.remove('open'); otherAnswer.setAttribute('aria-hidden', 'true'); }
      if (otherQuestion) otherQuestion.setAttribute('aria-expanded', 'false');
    });

    // Toggle clicked
    if (!isOpen) {
      item.classList.add('open');
      answer.classList.add('open');
      question.setAttribute('aria-expanded', 'true');
      answer.setAttribute('aria-hidden', 'false');
    }
  });

  // Keyboard support
  question.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      question.click();
    }
  });
});

/* ===== TESTIMONIALS SLIDER ===== */
const track = document.getElementById('testimonialsTrack');
const dotsContainer = document.getElementById('testimonialsDots');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

if (track) {
  const cards = track.querySelectorAll('.testimonial-card');
  let currentSlide = 0;
  let autoplayInterval = null;

  // Create dots
  cards.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = `dot${i === 0 ? ' active' : ''}`;
    dot.setAttribute('role', 'tab');
    dot.setAttribute('aria-label', `Beoordeling ${i + 1}`);
    dot.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
    dot.addEventListener('click', () => goToSlide(i));
    if (dotsContainer) dotsContainer.appendChild(dot);
  });

  function goToSlide(index) {
    currentSlide = (index + cards.length) % cards.length;
    track.style.transform = `translateX(${currentSlide * -100}%)`;

    // Update dots
    document.querySelectorAll('.dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === currentSlide);
      dot.setAttribute('aria-selected', i === currentSlide ? 'true' : 'false');
    });
  }

  function nextSlide() { goToSlide(currentSlide + 1); }
  function prevSlide() { goToSlide(currentSlide - 1); }

  if (prevBtn) prevBtn.addEventListener('click', prevSlide);
  if (nextBtn) nextBtn.addEventListener('click', nextSlide);

  // Autoplay
  function startAutoplay() {
    autoplayInterval = setInterval(nextSlide, 5000);
  }

  function stopAutoplay() {
    clearInterval(autoplayInterval);
  }

  startAutoplay();

  const sliderEl = track.closest('.testimonials-slider');
  if (sliderEl) {
    sliderEl.addEventListener('mouseenter', stopAutoplay);
    sliderEl.addEventListener('mouseleave', startAutoplay);
  }

  // Touch/swipe support
  let touchStartX = 0;
  track.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].clientX;
  }, { passive: true });

  track.addEventListener('touchend', (e) => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? nextSlide() : prevSlide();
    }
  }, { passive: true });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!sliderEl) return;
    const sliderVisible = sliderEl.getBoundingClientRect();
    if (sliderVisible.top < window.innerHeight && sliderVisible.bottom > 0) {
      if (e.key === 'ArrowRight') prevSlide();
      if (e.key === 'ArrowLeft') nextSlide();
    }
  });
}

/* ===== HOME ABOUT PERSON SLIDER ===== */
const homeAboutSlider = document.querySelector('[data-home-about-slider]');

if (homeAboutSlider) {
  const aboutTrack = homeAboutSlider.querySelector('.home-about-track');
  const aboutSlides = homeAboutSlider.querySelectorAll('.home-about-photo');
  const aboutPanels = document.querySelectorAll('.home-about-panel');
  const aboutDots = homeAboutSlider.querySelectorAll('.home-about-dots button');
  const aboutPrev = homeAboutSlider.querySelector('.home-about-arrow-prev');
  const aboutNext = homeAboutSlider.querySelector('.home-about-arrow-next');
  let aboutIndex = 0;

  function setHomeAboutSlide(index) {
    aboutIndex = (index + aboutSlides.length) % aboutSlides.length;
    if (aboutTrack) {
      aboutTrack.style.transform = `translateX(${aboutIndex * -100}%)`;
    }

    aboutPanels.forEach((panel, i) => {
      panel.classList.toggle('active', i === aboutIndex);
    });

    aboutDots.forEach((dot, i) => {
      const active = i === aboutIndex;
      dot.classList.toggle('active', active);
      dot.setAttribute('aria-current', active ? 'true' : 'false');
    });
  }

  if (aboutPrev) {
    aboutPrev.addEventListener('click', () => setHomeAboutSlide(aboutIndex - 1));
  }

  if (aboutNext) {
    aboutNext.addEventListener('click', () => setHomeAboutSlide(aboutIndex + 1));
  }

  aboutDots.forEach((dot, i) => {
    dot.addEventListener('click', () => setHomeAboutSlide(i));
  });

  let aboutTouchStartX = 0;
  homeAboutSlider.addEventListener('touchstart', (e) => {
    aboutTouchStartX = e.changedTouches[0].clientX;
  }, { passive: true });

  homeAboutSlider.addEventListener('touchend', (e) => {
    const diff = aboutTouchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? setHomeAboutSlide(aboutIndex + 1) : setHomeAboutSlide(aboutIndex - 1);
    }
  }, { passive: true });
}

/* ===== CONTACT FORM (legacy script.js handler - kept for compatibility) ===== */
const contactFormEl = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

if (contactFormEl && formSuccess) {
  const nameInput = document.getElementById('name');
  const phoneInput = document.getElementById('phone');
  const serviceSelect = document.getElementById('service');
  const submitBtn = document.getElementById('submitBtn');

  if (nameInput && phoneInput && serviceSelect && submitBtn) {
    const dateInput = document.getElementById('date');
    if (dateInput) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      dateInput.min = tomorrow.toISOString().split('T')[0];
    }

    function showError(inputId, message) {
      const errorEl = document.getElementById(`${inputId}-error`);
      const input = document.getElementById(inputId);
      if (errorEl) errorEl.textContent = message;
      if (input) input.classList.add('error');
    }

    function clearError(inputId) {
      const errorEl = document.getElementById(`${inputId}-error`);
      const input = document.getElementById(inputId);
      if (errorEl) errorEl.textContent = '';
      if (input) input.classList.remove('error');
    }

    function validateForm() {
      let valid = true;
      if (!nameInput.value.trim() || nameInput.value.trim().length < 3) {
        showError('name', 'Voer alstublieft uw volledige naam in (minimaal 3 tekens)');
        valid = false;
      } else { clearError('name'); }

      const phoneVal = phoneInput.value.trim().replace(/\s/g, '').replace(/^(\+31|0)/, '');
      const phoneRegex = /^[6-9][0-9]{8}$/;
      if (!phoneRegex.test(phoneVal)) {
        showError('phone', 'Voer alstublieft een geldig Nederlands telefoonnummer in');
        valid = false;
      } else { clearError('phone'); }

      if (!serviceSelect.value) {
        showError('service', 'Selecteer alstublieft een dienst');
        valid = false;
      } else { clearError('service'); }

      return valid;
    }

    nameInput.addEventListener('input', () => { if (nameInput.value.trim().length >= 3) clearError('name'); });
    phoneInput.addEventListener('input', () => {
      const val = phoneInput.value.trim().replace(/\s/g, '').replace(/^(\+31|0)/, '');
      if (/^[6-9][0-9]{8}$/.test(val)) clearError('phone');
    });
    serviceSelect.addEventListener('change', () => { if (serviceSelect.value) clearError('service'); });
  }
}

/* ===== FOOTER YEAR ===== */
const yearEl = document.getElementById('currentYear');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ===== PRELOADER ===== */
window.addEventListener('load', () => {
  document.body.classList.add('loaded');
  addAnimationClasses();
  updateActiveNavLink();
});

/* ===== FLOATING WHATSAPP - hide when footer visible ===== */
const floatWA = document.querySelector('.float-whatsapp');
const mainFooter = document.getElementById('main-footer');
if (floatWA && mainFooter && 'IntersectionObserver' in window) {
  const waObs = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        floatWA.style.opacity = '0';
        floatWA.style.pointerEvents = 'none';
        floatWA.style.transform = 'scale(0.8)';
      } else {
        floatWA.style.opacity = '1';
        floatWA.style.pointerEvents = 'auto';
        floatWA.style.transform = 'scale(1)';
      }
    });
  }, { threshold: 0.1 });
  waObs.observe(mainFooter);
}

/* ===== PERFORMANCE: Lazy Load Images ===== */
if ('IntersectionObserver' in window) {
  const lazyImages = document.querySelectorAll('img[data-src]');
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        imageObserver.unobserve(img);
      }
    });
  });
  lazyImages.forEach(img => imageObserver.observe(img));
}
