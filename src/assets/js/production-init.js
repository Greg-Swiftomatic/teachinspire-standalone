/**
 * TeachInspire Premium Animations - Production Initialization
 * Handles loading, initialization, and error management for the animation system
 * Optimized for production deployment with graceful fallbacks
 */

(function() {
  'use strict';
  
  // Production configuration
  const PRODUCTION_CONFIG = {
    debug: false,
    retryAttempts: 3,
    retryDelay: 1000,
    initTimeout: 5000,
    calendarUrl: 'https://cal.com/greg-teachinspire/decouverte-teachinspire?overlayCalendar=true'
  };
  
  // Global namespace
  window.TeachInspireProduction = window.TeachInspireProduction || {};
  
  class ProductionManager {
    constructor() {
      this.animationSystem = null;
      this.isInitialized = false;
      this.loadAttempts = 0;
      this.initStartTime = Date.now();
      this.errors = [];
      
      this.bindMethods();
      this.setupErrorHandling();
    }
    
    bindMethods() {
      this.init = this.init.bind(this);
      this.loadAnimationSystem = this.loadAnimationSystem.bind(this);
      this.handleError = this.handleError.bind(this);
      this.retry = this.retry.bind(this);
    }
    
    setupErrorHandling() {
      // Global error handler for animation-related errors
      window.addEventListener('error', (event) => {
        if (event.filename && event.filename.includes('premium-animations')) {
          this.handleError('Script error', event.error);
        }
      });
      
      // Unhandled promise rejection handler
      window.addEventListener('unhandledrejection', (event) => {
        if (event.reason && event.reason.message && 
            event.reason.message.includes('TeachInspire')) {
          this.handleError('Promise rejection', event.reason);
        }
      });
    }
    
    async init() {
      if (this.isInitialized) {
        this.log('Animation system already initialized');
        return this.animationSystem;
      }
      
      this.log('Starting TeachInspire Premium Animations initialization...');
      
      try {
        // Wait for DOM to be ready
        await this.waitForDOM();
        
        // Load and initialize animation system
        await this.loadAnimationSystem();
        
        // Initialize the system
        await this.initializeAnimationSystem();
        
        // Setup production features
        this.setupProductionFeatures();
        
        this.isInitialized = true;
        const loadTime = Date.now() - this.initStartTime;
        this.log(`Animation system initialized successfully in ${loadTime}ms`);
        
        return this.animationSystem;
        
      } catch (error) {
        this.handleError('Initialization failed', error);
        return this.setupFallbackBehavior();
      }
    }
    
    async waitForDOM() {
      return new Promise((resolve) => {
        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', resolve, { once: true });
        } else {
          resolve();
        }
      });
    }
    
    async loadAnimationSystem() {
      return new Promise((resolve, reject) => {
        // Check if already loaded
        if (window.TeachInspireAnimations) {
          resolve(window.TeachInspireAnimations);
          return;
        }
        
        // Create script element
        const script = document.createElement('script');
        script.src = '/src/assets/js/premium-animations.js';
        script.async = true;
        
        script.onload = () => {
          if (window.TeachInspireAnimations) {
            resolve(window.TeachInspireAnimations);
          } else {
            reject(new Error('Animation class not found after script load'));
          }
        };
        
        script.onerror = () => {
          reject(new Error('Failed to load animation script'));
        };
        
        document.head.appendChild(script);
        
        // Timeout fallback
        setTimeout(() => {
          reject(new Error('Script load timeout'));
        }, PRODUCTION_CONFIG.initTimeout);
      });
    }
    
    async initializeAnimationSystem() {
      const AnimationClass = await this.loadAnimationSystem();
      
      return new Promise((resolve, reject) => {
        try {
          this.animationSystem = new AnimationClass();
          
          // Initialize with timeout protection
          const timeoutId = setTimeout(() => {
            reject(new Error('Animation initialization timeout'));
          }, PRODUCTION_CONFIG.initTimeout);
          
          // Initialize the system
          this.animationSystem.init();
          
          clearTimeout(timeoutId);
          resolve(this.animationSystem);
          
        } catch (error) {
          reject(error);
        }
      });
    }
    
    setupProductionFeatures() {
      // Performance monitoring
      this.setupPerformanceMonitoring();
      
      // Calendar integration fallback
      this.setupCalendarFallback();
      
      // Responsive behavior
      this.setupResponsiveBehavior();
      
      // Accessibility enhancements
      this.setupAccessibilityFeatures();
      
      // Analytics integration (if needed)
      this.setupAnalytics();
    }
    
    setupPerformanceMonitoring() {
      // Monitor animation performance
      if ('PerformanceObserver' in window) {
        try {
          const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              if (entry.duration > 16.67) { // >60fps threshold
                this.log(`Performance warning: ${entry.name} took ${entry.duration}ms`);
              }
            }
          });
          
          observer.observe({ entryTypes: ['measure'] });
        } catch (error) {
          this.log('Performance monitoring setup failed:', error);
        }
      }
    }
    
    setupCalendarFallback() {
      // Ensure calendar links work even if animation system fails
      const calendarButtons = document.querySelectorAll(`
        a[href*="cal.com"], 
        button[data-calendar],
        .hero-cta, .cta-button, .investment-button
      `);
      
      calendarButtons.forEach(button => {
        // Remove existing click handlers
        button.removeEventListener('click', this.handleCalendarClick);
        
        // Add production-ready click handler
        button.addEventListener('click', this.handleCalendarClick.bind(this));
      });
    }
    
    handleCalendarClick(event) {
      event.preventDefault();
      
      const url = PRODUCTION_CONFIG.calendarUrl;
      
      try {
        // Try to open popup
        const popup = window.open(
          url,
          'teachinspire-calendar',
          'width=900,height=700,scrollbars=yes,resizable=yes,centerscreen=yes'
        );
        
        if (!popup || popup.closed || typeof popup.closed === 'undefined') {
          // Popup blocked, fallback to same window
          window.location.href = url;
        }
      } catch (error) {
        // Fallback to direct navigation
        window.location.href = url;
      }
    }
    
    setupResponsiveBehavior() {
      let resizeTimeout;
      
      window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
          if (this.animationSystem && this.animationSystem.handleResize) {
            this.animationSystem.handleResize();
          }
        }, 250);
      });
    }
    
    setupAccessibilityFeatures() {
      // Respect reduced motion preferences
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      
      const handleMotionPreference = (e) => {
        if (e.matches) {
          document.body.classList.add('reduce-motion');
          this.log('Reduced motion mode enabled');
        } else {
          document.body.classList.remove('reduce-motion');
        }
      };
      
      handleMotionPreference(mediaQuery);
      mediaQuery.addListener(handleMotionPreference);
      
      // High contrast support
      const contrastQuery = window.matchMedia('(prefers-contrast: high)');
      contrastQuery.addListener((e) => {
        if (e.matches) {
          document.body.classList.add('high-contrast');
        } else {
          document.body.classList.remove('high-contrast');
        }
      });
    }
    
    setupAnalytics() {
      // Basic usage analytics (privacy-friendly)
      if (typeof gtag === 'function') {
        gtag('event', 'animation_system_loaded', {
          'event_category': 'TeachInspire',
          'event_label': 'Premium Animations',
          'value': Date.now() - this.initStartTime
        });
      }
    }
    
    setupFallbackBehavior() {
      this.log('Setting up fallback behavior...');
      
      // Basic fade-in for sections
      const sections = document.querySelectorAll('.section, section');
      sections.forEach((section, index) => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        
        setTimeout(() => {
          section.style.opacity = '1';
          section.style.transform = 'translateY(0)';
        }, index * 200);
      });
      
      // Ensure calendar buttons work
      this.setupCalendarFallback();
      
      // Basic hover effects
      const buttons = document.querySelectorAll('button, .hero-cta, .cta-button');
      buttons.forEach(button => {
        button.style.transition = 'transform 0.3s ease';
        
        button.addEventListener('mouseenter', () => {
          button.style.transform = 'translateY(-2px)';
        });
        
        button.addEventListener('mouseleave', () => {
          button.style.transform = 'translateY(0)';
        });
      });
      
      return {
        fallback: true,
        message: 'Using fallback animations'
      };
    }
    
    handleError(context, error) {
      const errorInfo = {
        context,
        error: error.message || error,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent
      };
      
      this.errors.push(errorInfo);
      this.log(`Error in ${context}:`, error);
      
      // Attempt retry if not exceeded max attempts
      if (this.loadAttempts < PRODUCTION_CONFIG.retryAttempts) {
        this.retry();
      }
    }
    
    retry() {
      this.loadAttempts++;
      this.log(`Retrying initialization (attempt ${this.loadAttempts})...`);
      
      setTimeout(() => {
        this.init();
      }, PRODUCTION_CONFIG.retryDelay * this.loadAttempts);
    }
    
    log(...args) {
      if (PRODUCTION_CONFIG.debug || window.location.hostname === 'localhost') {
        console.log('[TeachInspire]', ...args);
      }
    }
    
    // Public API
    getAnimationSystem() {
      return this.animationSystem;
    }
    
    getCalendarUrl() {
      return PRODUCTION_CONFIG.calendarUrl;
    }
    
    getStatus() {
      return {
        initialized: this.isInitialized,
        errors: this.errors,
        loadAttempts: this.loadAttempts,
        initTime: Date.now() - this.initStartTime,
        animationSystem: this.animationSystem ? 'loaded' : 'not loaded'
      };
    }
    
    reinitialize() {
      this.isInitialized = false;
      this.animationSystem = null;
      this.loadAttempts = 0;
      this.errors = [];
      this.initStartTime = Date.now();
      
      return this.init();
    }
    
    destroy() {
      if (this.animationSystem && this.animationSystem.destroy) {
        this.animationSystem.destroy();
      }
      
      this.isInitialized = false;
      this.animationSystem = null;
    }
  }
  
  // Initialize the production manager
  const productionManager = new ProductionManager();
  
  // Expose public API
  window.TeachInspireProduction = {
    init: () => productionManager.init(),
    getAnimationSystem: () => productionManager.getAnimationSystem(),
    getCalendarUrl: () => productionManager.getCalendarUrl(),
    getStatus: () => productionManager.getStatus(),
    reinitialize: () => productionManager.reinitialize(),
    destroy: () => productionManager.destroy()
  };
  
  // Auto-initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      productionManager.init();
    });
  } else {
    // DOM already loaded, initialize immediately
    productionManager.init();
  }
  
})();