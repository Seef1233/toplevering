/**
 * نقاء للتنظيف - Main JavaScript
 * Features: Navbar, Counters, FAQ, Slider, Form, Animations, Scroll
 */

'use strict';

/* ===== NAVBAR ===== */
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
const navLinks = document.querySelectorAll('.nav-link');

// Sticky navbar + active state
window.addEventListener('scroll', () => {
  if (window.scrollY > 80) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  updateActiveNavLink();
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

// Update active nav link based on scroll position
function updateActiveNavLink() {
  const sections = document.querySelectorAll('section[id], .hero[id]');
  let current = '';

  sections.forEach(section => {
    const sectionTop = section.offsetTop - 120;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
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
  if (window.scrollY > 400) {
    scrollTopBtn.classList.add('visible');
    scrollTopBtn.hidden = false;
  } else {
    scrollTopBtn.classList.remove('visible');
    scrollTopBtn.hidden = true;
  }
}

scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

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

  question.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');

    // Close all
    faqItems.forEach(other => {
      other.classList.remove('open');
      other.querySelector('.faq-answer').classList.remove('open');
      other.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      other.querySelector('.faq-answer').setAttribute('aria-hidden', 'true');
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
    dot.setAttribute('aria-label', `التقييم ${i + 1}`);
    dot.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
    dot.addEventListener('click', () => goToSlide(i));
    dotsContainer.appendChild(dot);
  });

  function goToSlide(index) {
    currentSlide = (index + cards.length) % cards.length;
    track.style.transform = `translateX(${currentSlide * 100}%)`;

    // In RTL, we need to reverse the direction
    track.style.transform = `translateX(${currentSlide * -100}%)`;

    // Update dots
    document.querySelectorAll('.dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === currentSlide);
      dot.setAttribute('aria-selected', i === currentSlide ? 'true' : 'false');
    });
  }

  function nextSlide() { goToSlide(currentSlide + 1); }
  function prevSlide() { goToSlide(currentSlide - 1); }

  prevBtn.addEventListener('click', prevSlide);
  nextBtn.addEventListener('click', nextSlide);

  // Autoplay
  function startAutoplay() {
    autoplayInterval = setInterval(nextSlide, 5000);
  }

  function stopAutoplay() {
    clearInterval(autoplayInterval);
  }

  startAutoplay();

  track.closest('.testimonials-slider').addEventListener('mouseenter', stopAutoplay);
  track.closest('.testimonials-slider').addEventListener('mouseleave', startAutoplay);

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
    const sliderVisible = track.closest('.testimonials-slider').getBoundingClientRect();
    if (sliderVisible.top < window.innerHeight && sliderVisible.bottom > 0) {
      if (e.key === 'ArrowRight') prevSlide();
      if (e.key === 'ArrowLeft') nextSlide();
    }
  });
}

/* ===== CONTACT FORM ===== */
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

if (contactForm) {
  const nameInput = document.getElementById('name');
  const phoneInput = document.getElementById('phone');
  const serviceSelect = document.getElementById('service');
  const submitBtn = document.getElementById('submitBtn');

  // Set min date for date picker
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

    // Name
    if (!nameInput.value.trim() || nameInput.value.trim().length < 3) {
      showError('name', 'الرجاء إدخال الاسم الكامل (3 أحرف على الأقل)');
      valid = false;
    } else {
      clearError('name');
    }

    // Phone
    const phoneVal = phoneInput.value.trim().replace(/\s/g, '');
    const phoneRegex = /^(05|5)[0-9]{8}$/;
    if (!phoneRegex.test(phoneVal)) {
      showError('phone', 'الرجاء إدخال رقم جوال سعودي صحيح (مثال: 0512345678)');
      valid = false;
    } else {
      clearError('phone');
    }

    // Service
    if (!serviceSelect.value) {
      showError('service', 'الرجاء اختيار نوع الخدمة');
      valid = false;
    } else {
      clearError('service');
    }

    return valid;
  }

  // Real-time validation
  nameInput.addEventListener('input', () => {
    if (nameInput.value.trim().length >= 3) clearError('name');
  });

  phoneInput.addEventListener('input', () => {
    const val = phoneInput.value.trim().replace(/\s/g, '');
    if (/^(05|5)[0-9]{8}$/.test(val)) clearError('phone');
  });

  serviceSelect.addEventListener('change', () => {
    if (serviceSelect.value) clearError('service');
  });

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    // Simulate sending
    submitBtn.disabled = true;
    submitBtn.querySelector('span').textContent = 'جاري الإرسال...';
    submitBtn.querySelector('i').className = 'fas fa-spinner fa-spin';

    await new Promise(resolve => setTimeout(resolve, 1800));

    // Show success
    contactForm.hidden = true;
    formSuccess.hidden = false;
    formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // Reset after 5 seconds (optional)
    setTimeout(() => {
      contactForm.reset();
      contactForm.hidden = false;
      formSuccess.hidden = true;
      submitBtn.disabled = false;
      submitBtn.querySelector('span').textContent = 'إرسال طلب الحجز';
      submitBtn.querySelector('i').className = 'fas fa-paper-plane';
    }, 6000);
  });
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
