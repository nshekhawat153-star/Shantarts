document.addEventListener('DOMContentLoaded', () => {

  // ==========================================================================
  // HEADER SCROLL EVENT
  // ==========================================================================
  const header = document.getElementById('header');
  const checkScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', checkScroll);
  checkScroll(); // Initial check on load

  // ==========================================================================
  // MOBILE NAVIGATION DRAWER
  // ==========================================================================
  const mobileToggle = document.getElementById('mobile-nav-toggle');
  const navWrapper = document.getElementById('nav-links-wrapper');
  const navLinks = document.querySelectorAll('.nav-links a, .nav-cta .btn');

  const toggleMobileMenu = () => {
    mobileToggle.classList.toggle('open');
    navWrapper.classList.toggle('open');
    // Toggle scroll locking on body
    if (navWrapper.classList.contains('open')) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  };

  mobileToggle.addEventListener('click', toggleMobileMenu);

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navWrapper.classList.contains('open')) {
        toggleMobileMenu();
      }
    });
  });

  // ==========================================================================
  // SCROLL-LINKED REVEAL ANIMATIONS (INTERSECTION OBSERVER)
  // ==========================================================================
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Unobserve after revealing to prevent repeated triggers
        observer.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    threshold: 0.15, // Trigger when 15% of element is visible
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ==========================================================================
  // INTERACTIVE CUSTOM COMMISSION TIMELINE
  // ==========================================================================
  const timelineBtns = document.querySelectorAll('.timeline-step-btn');
  const stageContents = document.querySelectorAll('.timeline-stage-content');
  const progressBar = document.getElementById('timeline-progress-bar');

  const updateTimeline = (stepIndex) => {
    // Update progress bar width
    const percent = (stepIndex / (timelineBtns.length - 1)) * 100;
    progressBar.style.width = `${percent}%`;

    // Toggle active buttons
    timelineBtns.forEach((btn, index) => {
      if (index <= stepIndex) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Toggle active stage content
    stageContents.forEach((stage, index) => {
      if (index === stepIndex) {
        stage.classList.add('active');
      } else {
        stage.classList.remove('active');
      }
    });
  };

  timelineBtns.forEach((btn, index) => {
    btn.addEventListener('click', () => {
      updateTimeline(index);
    });
  });

  // Initialize timeline on step 0
  updateTimeline(0);

  // ==========================================================================
  // LIGHTBOX PHOTO GALLERY SHOWCASE
  // ==========================================================================
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      const caption = item.getAttribute('data-caption');
      
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightboxCaption.textContent = caption;
      
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden'; // Stop background scrolling
    });
  });

  const closeLightbox = () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  };

  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });

  // ==========================================================================
  // TESTIMONIALS SLIDER
  // ==========================================================================
  const track = document.getElementById('testimonials-track');
  const dots = document.querySelectorAll('.dot');
  let currentSlide = 0;
  let testimonialInterval;

  const goToSlide = (slideIndex) => {
    track.style.transform = `translateX(-${slideIndex * 100}%)`;
    dots.forEach((dot, index) => {
      if (index === slideIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
    currentSlide = slideIndex;
  };

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      goToSlide(index);
      resetAutoplay();
    });
  });

  const startAutoplay = () => {
    testimonialInterval = setInterval(() => {
      let nextSlide = (currentSlide + 1) % dots.length;
      goToSlide(nextSlide);
    }, 6000); // Transitions slide every 6 seconds
  };

  const resetAutoplay = () => {
    clearInterval(testimonialInterval);
    startAutoplay();
  };

  startAutoplay();

  // ==========================================================================
  // FORM FILE UPLOAD AND SUCCESS STATES
  // ==========================================================================
  const form = document.getElementById('consultation-form');
  const fileInput = document.getElementById('form-file-upload');
  const uploadContainer = document.getElementById('file-upload-container');
  const uploadText = document.getElementById('file-upload-display-text');
  const successModal = document.getElementById('success-modal');
  const successCloseBtn = document.getElementById('success-close-btn');

  // Trigger file click
  uploadContainer.addEventListener('click', () => {
    fileInput.click();
  });

  fileInput.addEventListener('change', () => {
    if (fileInput.files.length > 0) {
      const fileName = fileInput.files[0].name;
      uploadText.innerHTML = `Selected Inspiration: <span style="color:#D4AF37; font-weight:600;">${fileName}</span>`;
    }
  });

  // Drag and Drop implementation
  uploadContainer.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadContainer.style.borderColor = '#D4AF37';
    uploadContainer.style.backgroundColor = '#F5EFEB';
  });

  uploadContainer.addEventListener('dragleave', () => {
    uploadContainer.style.borderColor = '';
    uploadContainer.style.backgroundColor = '';
  });

  uploadContainer.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadContainer.style.borderColor = '';
    uploadContainer.style.backgroundColor = '';
    if (e.dataTransfer.files.length > 0) {
      fileInput.files = e.dataTransfer.files;
      const fileName = fileInput.files[0].name;
      uploadText.innerHTML = `Dropped Inspiration: <span style="color:#D4AF37; font-weight:600;">${fileName}</span>`;
    }
  });

  // Submit modal logic
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Simulate API calling latency
    const submitBtn = document.getElementById('btn-submit-form');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'TRANSMITTING BRIEF...';
    submitBtn.disabled = true;

    setTimeout(() => {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
      
      // Open success modal
      successModal.classList.add('active');
      document.body.style.overflow = 'hidden';
      
      // Clear form inputs
      form.reset();
      uploadText.innerHTML = 'Drag & drop blueprints or interior inspiration, or <span>browse files</span>';
    }, 1500);
  });

  // Success Modal Close
  const closeSuccessModal = () => {
    successModal.classList.remove('active');
    document.body.style.overflow = '';
  };

  successCloseBtn.addEventListener('click', closeSuccessModal);
  successModal.addEventListener('click', (e) => {
    if (e.target === successModal) {
      closeSuccessModal();
    }
  });

  // ==========================================================================
  // NEWSLETTER SUBSCRIPTION FEEDBACK
  // ==========================================================================
  const newsletterForm = document.getElementById('newsletter-form');
  const newsletterInput = document.getElementById('newsletter-email');
  const newsletterSubmitBtn = document.getElementById('newsletter-submit-btn');

  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    newsletterSubmitBtn.textContent = 'SUBSCRIBED';
    newsletterSubmitBtn.style.color = '#FDFCF7';
    newsletterInput.value = '';
    newsletterInput.disabled = true;
    newsletterSubmitBtn.disabled = true;
    
    setTimeout(() => {
      newsletterSubmitBtn.textContent = 'SUBSCRIBED';
    }, 2000);
  });

  // ==========================================================================
  // [NEW] FAQ ACCORDION INTERACTION
  // ==========================================================================
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    const content = item.querySelector('.faq-content');

    trigger.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all other accordions for a clean, Aman-style premium experience
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          otherItem.querySelector('.faq-trigger').setAttribute('aria-expanded', 'false');
          otherItem.querySelector('.faq-content').style.maxHeight = '0';
        }
      });

      // Toggle current accordion
      if (isActive) {
        item.classList.remove('active');
        trigger.setAttribute('aria-expanded', 'false');
        content.style.maxHeight = '0';
      } else {
        item.classList.add('active');
        trigger.setAttribute('aria-expanded', 'true');
        content.style.maxHeight = `${content.scrollHeight}px`;
      }
    });
  });

});

