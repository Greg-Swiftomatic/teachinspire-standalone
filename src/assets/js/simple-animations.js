/**
 * TeachInspire Simple Animations - Working Version
 * Simplified animation system that focuses on reliable scroll animations
 */

(function() {
  'use strict';
  
  // Configuration
  const config = {
    threshold: 0.15,
    rootMargin: '-50px 0px -100px 0px',
    animationDuration: 800,
    staggerDelay: 200
  };
  
  // Track animated elements
  const animatedElements = new Set();
  let observer = null;
  
  // Initialize animations
  function init() {
    console.log('Initializing TeachInspire Simple Animations...');
    
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', setupAnimations);
    } else {
      setupAnimations();
    }
  }
  
  function setupAnimations() {
    console.log('Setting up animations...');
    
    // Add CSS for animations
    addAnimationCSS();
    
    // Setup scroll animations
    setupScrollAnimations();
    
    // Setup calendar integration
    setupCalendar();
    
    // Setup hero word cycling
    setupHeroAnimation();
    
    console.log('Animations ready!');
  }
  
  function addAnimationCSS() {
    const style = document.createElement('style');
    style.textContent = `
      /* Animation styles */
      .animate-section {
        opacity: 0;
        transform: translateX(-50px);
        transition: opacity 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94),
                    transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      }
      
      .animate-section.slide-right {
        transform: translateX(50px);
      }
      
      .animate-section.visible {
        opacity: 1;
        transform: translateX(0);
      }
      
      /* Button enhancements */
      .enhanced-button {
        transition: transform 0.3s ease, box-shadow 0.3s ease;
      }
      
      .enhanced-button:hover {
        transform: translateY(-3px);
        box-shadow: 0 8px 25px rgba(0,0,0,0.15);
      }
      
      /* Hero word animation */
      .animated-word {
        transition: all 0.3s ease;
      }
      
      /* Image animations */
      .animate-image {
        opacity: 0;
        transform: scale(0.95) translateY(20px);
        transition: opacity 0.6s ease, transform 0.6s ease;
      }
      
      .animate-image.visible {
        opacity: 1;
        transform: scale(1) translateY(0);
      }
      
      /* Floating animation for hero image */
      .float-animation {
        animation: gentle-float 6s ease-in-out infinite;
      }
      
      @keyframes gentle-float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
      }
      
      /* Reduced motion support */
      @media (prefers-reduced-motion: reduce) {
        .animate-section,
        .animate-image,
        .enhanced-button {
          transition-duration: 0.01ms !important;
        }
        
        .float-animation {
          animation: none;
        }
      }
    `;
    
    document.head.appendChild(style);
  }
  
  function setupScrollAnimations() {
    // Find all sections
    const sections = document.querySelectorAll('.section, section');
    console.log(`Found ${sections.length} sections to animate`);
    
    // Create intersection observer
    observer = new IntersectionObserver(handleIntersection, {
      threshold: config.threshold,
      rootMargin: config.rootMargin
    });
    
    // Setup each section
    sections.forEach((section, index) => {
      const sectionId = section.id;
      const shouldSlideRight = shouldSectionSlideRight(sectionId, index);
      
      // Add animation classes
      section.classList.add('animate-section');
      if (shouldSlideRight) {
        section.classList.add('slide-right');
      }
      
      // Add stagger delay
      section.style.transitionDelay = `${index * 0.1}s`;
      
      // Start observing
      observer.observe(section);
      
      console.log(`Section ${index + 1} (${sectionId}) setup - slide ${shouldSlideRight ? 'right' : 'left'}`);
    });
    
    // Setup images
    const images = document.querySelectorAll('img, .hourglass-image, .challenges-image, .format-img');
    images.forEach((image, index) => {
      image.classList.add('animate-image');
      
      // Special handling for hero image
      if (image.classList.contains('hourglass-image')) {
        image.classList.add('float-animation');
      }
      
      observer.observe(image);
    });
    
    // Setup buttons
    const buttons = document.querySelectorAll('.hero-cta, .cta-button, .investment-button, button');
    buttons.forEach(button => {
      button.classList.add('enhanced-button');
    });
  }
  
  function shouldSectionSlideRight(sectionId, index) {
    // Sections that should slide from right
    const rightSlideIds = [
      '7e236026-ae26-43c1-b165-0a64b12a6d75', // approach
      'eeca3349-b596-4f42-8363-38d479ae30ba', // training
      '1fb36b5f-587e-46f8-8fd2-f32ec4a7913c', // guarantees
      '71aef82d-8d34-45b3-bdf7-1310e073766c'  // investment
    ];
    
    if (sectionId && rightSlideIds.includes(sectionId)) {
      return true;
    }
    
    // Fallback: alternate based on index
    return index % 2 === 1;
  }
  
  function handleIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animatedElements.has(entry.target)) {
        console.log('Animating element:', entry.target.className, entry.target.id);
        
        entry.target.classList.add('visible');
        animatedElements.add(entry.target);
        
        // Stop observing this element
        observer.unobserve(entry.target);
      }
    });
  }
  
  function setupCalendar() {
    const calendarUrl = 'https://cal.com/greg-teachinspire/decouverte-teachinspire?overlayCalendar=true';
    
    // Find calendar buttons
    const calendarButtons = document.querySelectorAll(`
      .hero-cta, .cta-button, .investment-button,
      a[href*="cal.com"], a[href*="demo"]
    `);
    
    console.log(`Found ${calendarButtons.length} calendar buttons`);
    
    calendarButtons.forEach(button => {
      button.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('Opening calendar...');
        
        try {
          const popup = window.open(
            calendarUrl,
            'teachinspire-calendar',
            'width=900,height=700,scrollbars=yes,resizable=yes,centerscreen=yes'
          );
          
          if (!popup || popup.closed) {
            console.log('Popup blocked, redirecting...');
            window.location.href = calendarUrl;
          }
        } catch (error) {
          console.log('Error opening popup:', error);
          window.location.href = calendarUrl;
        }
      });
    });
  }
  
  function setupHeroAnimation() {
    const animatedWord = document.getElementById('animated-word') || 
                        document.querySelector('.animated-word');
    
    if (!animatedWord) {
      console.log('Animated word element not found');
      return;
    }
    
    const words = ['fastidieux', 'chronophage', 'répétitif', 'complexe'];
    let currentIndex = 0;
    
    function cycleWords() {
      currentIndex = (currentIndex + 1) % words.length;
      
      // Animate transition
      animatedWord.style.transform = 'scale(0.8)';
      animatedWord.style.opacity = '0.6';
      
      setTimeout(() => {
        animatedWord.textContent = words[currentIndex];
        animatedWord.style.transform = 'scale(1)';
        animatedWord.style.opacity = '1';
      }, 150);
    }
    
    // Start cycling
    setInterval(cycleWords, 3000);
    console.log('Hero word animation started');
  }
  
  // Public API
  window.TeachInspireSimpleAnimations = {
    init: init,
    getAnimatedCount: () => animatedElements.size,
    reinit: function() {
      animatedElements.clear();
      if (observer) {
        observer.disconnect();
      }
      setupAnimations();
    }
  };
  
  // Auto-initialize
  init();
  
})();