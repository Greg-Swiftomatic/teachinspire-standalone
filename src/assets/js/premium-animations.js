/**
 * TeachInspire Premium Animations - Main Animation System
 * Production-ready scroll-triggered animations with WeWeb integration
 * Optimized for performance and accessibility
 */

class TeachInspireAnimations {
  constructor() {
    this.observers = new Map();
    this.animatedElements = new Set();
    this.isInitialized = false;
    this.isMobile = window.innerWidth <= 768;
    this.isTouch = 'ontouchstart' in window;
    
    // WeWeb-specific section UIDs for targeting
    this.sectionUIDs = {
      hero: 'ac0b1e8c-2363-41b1-9daa-49d580bb8c6f',
      problem: '1b0b31e0-8a1d-4c98-9562-2a7bffd7b340',
      solution: '7e236026-ae26-43c1-b165-0a64b12a6d75',
      about: 'a823c108-9097-4a2a-a8cd-8505c1ef1cc9',
      training: 'eeca3349-b596-4f42-8363-38d479ae30ba',
      community: 'c7ba5dc1-c233-4dd9-bcdb-39a1d7642e7e',
      guarantees: '1fb36b5f-587e-46f8-8fd2-f32ec4a7913c',
      format: '2225af1a-6129-4282-9fbe-35e98a57ccee',
      pricing: '71aef82d-8d34-45b3-bdf7-1310e073766c',
      cta: '33abbee2-21ea-439c-afe7-322d23c08713'
    };
    
    // Animation configuration
    this.config = {
      threshold: 0.15,
      rootMargin: '0px 0px -10% 0px',
      duration: this.isMobile ? 600 : 800,
      staggerDelay: 100
    };
    
    this.bindMethods();
  }
  
  bindMethods() {
    this.handleIntersection = this.handleIntersection.bind(this);
    this.handleResize = this.handleResize.bind(this);
    this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
  }
  
  init() {
    if (this.isInitialized) return;
    
    this.loadCSS();
    this.setupIntersectionObservers();
    this.setupSectionAnimations();
    this.setupTextAnimations();
    this.setupImageAnimations();
    this.setupInteractiveElements();
    this.setupCalendarIntegration();
    this.addEventListeners();
    
    this.isInitialized = true;
    console.log('TeachInspire Premium Animations initialized');
  }
  
  loadCSS() {
    // Ensure our CSS is loaded
    if (!document.querySelector('link[href*="common.css"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = '/src/assets/css/common.css';
      document.head.appendChild(link);
    }
  }
  
  setupIntersectionObservers() {
    // Main animation observer
    this.observers.set('main', new IntersectionObserver(
      this.handleIntersection,
      {
        threshold: this.config.threshold,
        rootMargin: this.config.rootMargin
      }
    ));
    
    // Text animation observer (higher threshold)
    this.observers.set('text', new IntersectionObserver(
      this.handleTextAnimation.bind(this),
      {
        threshold: 0.3,
        rootMargin: '0px 0px -5% 0px'
      }
    ));
    
    // Image animation observer
    this.observers.set('image', new IntersectionObserver(
      this.handleImageAnimation.bind(this),
      {
        threshold: 0.1,
        rootMargin: '0px 0px -20% 0px'
      }
    ));
  }
  
  setupSectionAnimations() {
    const sections = this.getAllSections();
    
    sections.forEach((section, index) => {
      const uid = this.getSectionUID(section);
      const isLeftSlide = this.shouldSlideLeft(uid, index);
      
      // Add animation classes
      section.classList.add('section-animate', 'animate-element');
      if (!isLeftSlide) {
        section.classList.add('slide-right');
      }
      
      // Add stagger delay
      const delay = index * 0.2;
      section.style.transitionDelay = `${delay}s`;
      
      // Start observing
      this.observers.get('main').observe(section);
    });
  }
  
  setupTextAnimations() {
    // Hero section special word animation
    const heroSection = this.findSectionByUID(this.sectionUIDs.hero);
    if (heroSection) {
      this.setupHeroWordAnimation(heroSection);
    }
    
    // Text elements for word-by-word reveals
    const textElements = this.findTextElements();
    textElements.forEach(element => {
      if (this.isHeading(element)) {
        this.prepareWordReveal(element);
        this.observers.get('text').observe(element);
      }
    });
    
    // Setup typewriter effects for subtitles
    const subtitles = document.querySelectorAll('.subtitle, .section-description');
    subtitles.forEach(element => {
      element.classList.add('typewriter-ready');
      this.observers.get('text').observe(element);
    });
  }
  
  setupImageAnimations() {
    const images = this.findImageElements();
    
    images.forEach((image, index) => {
      const animationType = this.getImageAnimationType(index);
      
      switch (animationType) {
        case 'parallax':
          image.classList.add('image-parallax', 'animate-element');
          break;
        case 'clip':
          image.classList.add('image-clip', 'animate-element');
          break;
        case 'focus':
          image.classList.add('image-focus', 'animate-element');
          break;
      }
      
      // Special handling for hero image
      if (image.closest('[id*="hero"], .hero-section')) {
        image.classList.add('float-animation');
      }
      
      this.observers.get('image').observe(image);
    });
  }
  
  setupInteractiveElements() {
    // Button enhancements
    const buttons = this.findButtonElements();
    buttons.forEach(button => {
      button.classList.add('ripple-button', 'hover-lift');
      
      // Add glow pulse to CTA buttons
      if (this.isCTAButton(button)) {
        button.classList.add('glow-pulse');
      }
      
      // Add ripple click handler
      this.addRippleEffect(button);
    });
    
    // Calendar icons
    const calendarIcons = this.findCalendarIcons();
    calendarIcons.forEach(icon => {
      icon.classList.add('calendar-hover');
    });
    
    // Enhance hover states (desktop only)
    if (!this.isTouch) {
      this.setupHoverEnhancements();
    }
  }
  
  setupCalendarIntegration() {
    const calendarButtons = this.findCalendarButtons();
    const calendarUrl = 'https://cal.com/greg-teachinspire/decouverte-teachinspire?overlayCalendar=true';
    
    calendarButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        this.openCalendar(calendarUrl);
      });
    });
  }
  
  // Event Handlers
  handleIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting && !this.animatedElements.has(entry.target)) {
        this.animateSection(entry.target);
        this.animatedElements.add(entry.target);
        
        // Clean up observer for performance
        this.observers.get('main').unobserve(entry.target);
      }
    });
  }
  
  handleTextAnimation(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (entry.target.classList.contains('word-reveal-ready')) {
          this.animateWordReveal(entry.target);
        } else if (entry.target.classList.contains('typewriter-ready')) {
          this.animateTypewriter(entry.target);
        }
        
        this.observers.get('text').unobserve(entry.target);
      }
    });
  }
  
  handleImageAnimation(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        this.animateImage(entry.target);
        this.observers.get('image').unobserve(entry.target);
      }
    });
  }
  
  handleResize() {
    const wasLile = this.isMobile;
    this.isMobile = window.innerWidth <= 768;
    
    if (wasLile !== this.isMobile) {
      this.updateAnimationDurations();
    }
  }
  
  handleVisibilityChange() {
    if (document.hidden) {
      this.pauseContinuousAnimations();
    } else {
      this.resumeContinuousAnimations();
    }
  }
  
  // Animation Methods
  animateSection(section) {
    section.classList.add('visible');
    
    // Add highlight effects for key phrases
    this.addHighlightEffects(section);
    
    // Clean up will-change after animation
    setTimeout(() => {
      section.classList.add('animation-complete');
    }, this.config.duration);
  }
  
  animateWordReveal(element) {
    const words = element.querySelectorAll('.word-reveal');
    
    words.forEach((word, index) => {
      setTimeout(() => {
        word.style.animationDelay = '0s';
        word.classList.add('animate');
      }, index * this.config.staggerDelay);
    });
  }
  
  animateTypewriter(element) {
    element.classList.add('typewriter');
    
    setTimeout(() => {
      element.classList.add('animation-complete');
    }, 3000);
  }
  
  animateImage(image) {
    if (image.classList.contains('image-parallax')) {
      image.classList.add('revealed');
    } else if (image.classList.contains('image-clip')) {
      image.classList.add('revealed');
    } else if (image.classList.contains('image-focus')) {
      image.classList.add('focused');
    }
    
    setTimeout(() => {
      image.classList.add('animation-complete');
    }, this.config.duration);
  }
  
  // Helper Methods
  getAllSections() {
    // Try to find WeWeb sections first, then fall back to standard sections
    const wewebSections = Array.from(document.querySelectorAll('[data-ww-component="section"]'));
    if (wewebSections.length > 0) {
      return wewebSections;
    }
    
    // Fallback to standard sections
    return Array.from(document.querySelectorAll('.section, section'));
  }
  
  findSectionByUID(uid) {
    return document.querySelector(`[id="${uid}"], [data-ww-uid="${uid}"]`);
  }
  
  getSectionUID(section) {
    return section.id || section.dataset.wwUid || section.dataset.uid || '';
  }
  
  shouldSlideLeft(uid, index) {
    const leftSlideUIDs = [
      this.sectionUIDs.problem,
      this.sectionUIDs.about,
      this.sectionUIDs.community,
      this.sectionUIDs.format,
      this.sectionUIDs.cta
    ];
    
    if (uid && leftSlideUIDs.includes(uid)) {
      return true;
    }
    
    // Fallback: alternate based on index
    return index % 2 === 0;
  }
  
  findTextElements() {
    return Array.from(document.querySelectorAll(`
      .ww-text, .ww-heading, [data-ww-name*="Text"],
      h1, h2, h3, h4, h5, h6, p, .section-title, .hero-title
    `));
  }
  
  findImageElements() {
    return Array.from(document.querySelectorAll(`
      .ww-image, [data-ww-component="image"],
      img, .hourglass-image, .challenges-image, .format-img, .profile-image
    `));
  }
  
  findButtonElements() {
    return Array.from(document.querySelectorAll(`
      .ww-button, [data-ww-component="button"],
      button, .hero-cta, .cta-button, .investment-button
    `));
  }
  
  findCalendarButtons() {
    return Array.from(document.querySelectorAll(`
      a[href*="cal.com"], 
      button[data-calendar],
      .hero-cta, .cta-button, .investment-button,
      [data-ww-name*="calendar"], [data-ww-name*="rendez"],
      [data-ww-name*="demo"], [data-ww-name*="decouverte"]
    `));
  }
  
  findCalendarIcons() {
    return Array.from(document.querySelectorAll(`
      [data-lucide="calendar"], .lucide-calendar,
      svg[data-icon="calendar"], .calendar-icon
    `));
  }
  
  isHeading(element) {
    return /^h[1-6]$/i.test(element.tagName) || 
           element.classList.contains('section-title') ||
           element.classList.contains('hero-title');
  }
  
  isCTAButton(button) {
    return button.classList.contains('hero-cta') ||
           button.classList.contains('cta-button') ||
           button.classList.contains('investment-button') ||
           button.textContent.toLowerCase().includes('demo') ||
           button.textContent.toLowerCase().includes('devis') ||
           button.textContent.toLowerCase().includes('rendez-vous');
  }
  
  getImageAnimationType(index) {
    const types = ['parallax', 'clip', 'focus'];
    return types[index % types.length];
  }
  
  prepareWordReveal(element) {
    const text = element.textContent;
    const words = text.split(' ');
    
    element.innerHTML = words.map(word => 
      `<span class="word-reveal">${word}</span>`
    ).join(' ');
    
    element.classList.add('word-reveal-ready');
  }
  
  addHighlightEffects(section) {
    const keyPhrases = ['premium', 'professionnel', 'formation', 'garanti'];
    const textElements = section.querySelectorAll('p, span, .text');
    
    textElements.forEach(element => {
      let html = element.innerHTML;
      keyPhrases.forEach(phrase => {
        const regex = new RegExp(`\\b(${phrase})\\b`, 'gi');
        html = html.replace(regex, '<span class="highlight-underline">$1</span>');
      });
      element.innerHTML = html;
    });
    
    // Trigger highlight animations
    setTimeout(() => {
      section.querySelectorAll('.highlight-underline').forEach(span => {
        span.classList.add('revealed');
      });
    }, 200);
  }
  
  addRippleEffect(button) {
    button.addEventListener('click', function(e) {
      const ripple = document.createElement('span');
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      
      ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        transform: scale(0);
        animation: rippleEffect 0.6s ease-out;
        pointer-events: none;
      `;
      
      this.appendChild(ripple);
      
      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  }
  
  setupHoverEnhancements() {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes rippleEffect {
        to { transform: scale(4); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }
  
  setupHeroWordAnimation(heroSection) {
    const animatedWord = heroSection.querySelector('#animated-word, .animated-word');
    if (!animatedWord) return;
    
    const words = ['fastidieux', 'chronophage', 'répétitif', 'complexe'];
    let currentIndex = 0;
    
    const cycleWords = () => {
      currentIndex = (currentIndex + 1) % words.length;
      animatedWord.style.transform = 'scale(0.8)';
      animatedWord.style.opacity = '0.7';
      
      setTimeout(() => {
        animatedWord.textContent = words[currentIndex];
        animatedWord.style.transform = 'scale(1)';
        animatedWord.style.opacity = '1';
      }, 150);
    };
    
    setInterval(cycleWords, 3000);
  }
  
  openCalendar(url) {
    const popup = window.open(
      url,
      'teachinspire-calendar',
      'width=900,height=700,scrollbars=yes,resizable=yes,centerscreen=yes'
    );
    
    if (!popup) {
      // Fallback if popup is blocked
      window.location.href = url;
    }
  }
  
  updateAnimationDurations() {
    const newDuration = this.isMobile ? 600 : 800;
    document.documentElement.style.setProperty('--animation-duration', `${newDuration}ms`);
  }
  
  pauseContinuousAnimations() {
    document.querySelectorAll('.float-animation, .glow-pulse').forEach(el => {
      el.style.animationPlayState = 'paused';
    });
  }
  
  resumeContinuousAnimations() {
    document.querySelectorAll('.float-animation, .glow-pulse').forEach(el => {
      el.style.animationPlayState = 'running';
    });
  }
  
  addEventListeners() {
    window.addEventListener('resize', this.handleResize);
    document.addEventListener('visibilitychange', this.handleVisibilityChange);
    
    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
      this.destroy();
    });
  }
  
  destroy() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers.clear();
    this.animatedElements.clear();
    
    window.removeEventListener('resize', this.handleResize);
    document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    
    this.isInitialized = false;
  }
  
  // Public API
  reinitialize() {
    this.destroy();
    setTimeout(() => {
      this.init();
    }, 100);
  }
  
  getAnimationSystem() {
    return {
      initialized: this.isInitialized,
      animatedCount: this.animatedElements.size,
      observerCount: this.observers.size,
      isMobile: this.isMobile,
      isTouch: this.isTouch
    };
  }
  
  getCalendarUrl() {
    return 'https://cal.com/greg-teachinspire/decouverte-teachinspire?overlayCalendar=true';
  }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = TeachInspireAnimations;
}

// Global access
window.TeachInspireAnimations = TeachInspireAnimations;