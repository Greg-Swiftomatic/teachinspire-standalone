/* ===================================================
   CUSTOM HERO CONTENT - COMPLETE OVERRIDE
   =================================================== */

function createCustomHeroContent() {
    console.log('🚀 Creating custom hero content...');
    
    // Find the hero section
    const heroSection = document.querySelector('[data-section-id*="ac0b1e8c"]') ||
                       document.querySelector('section:first-of-type') ||
                       document.querySelector('#app section:first-child');
    
    if (!heroSection) {
        console.log('❌ Hero section not found, retrying...');
        setTimeout(createCustomHeroContent, 500);
        return;
    }
    
    // Clear existing content and create our custom structure
    heroSection.innerHTML = `
        <div class="custom-hero-container">
            <div class="custom-hero-content">
                <!-- Text Column -->
                <div class="text-column">
                    <h1 class="hero-title">Transformez votre institut avec l'IA pédagogique</h1>
                    
                    <div class="subtitle-container">
                        <h2 class="subtitle-prefix">Créer des cours sur mesure est</h2>
                        <h2 class="animated-word" id="custom-animated-word">fastidieux</h2>
                        <h2 class="subtitle-suffix">fluide et rapide</h2>
                    </div>
                </div>
                
                <!-- Image Column -->
                <div class="image-column">
                    <img src="https://imagedelivery.net/BGb25Nzj8sQ1HtrebC39dQ/513fa36c-80bd-4015-140b-4b42ca020b00/public" 
                         alt="Hourglass with lightbulb - Time and inspiration" 
                         class="hourglass-image">
                </div>
                
                <!-- Description (spans full width) -->
                <div class="description-container">
                    <p class="hero-description">
                        Formez vos équipes pour créer des contenus personnalisés plus rapidement, 
                        sans sacrifier la qualité pédagogique.
                    </p>
                    
                    <a href="https://cal.com/greg-teachinspire/demo" 
                       target="_blank" 
                       class="hero-cta">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="16" y1="2" x2="16" y2="6"></line>
                            <line x1="8" y1="2" x2="8" y2="6"></line>
                            <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                        Réserver une démo gratuite
                    </a>
                </div>
            </div>
        </div>
    `;
    
    // Apply custom styles
    heroSection.style.cssText = `
        background-color: #f8f7f2 !important;
        min-height: 100vh !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        padding: 100px 48px 64px 48px !important;
        position: relative !important;
    `;
    
    // Start the word animation
    setupWordAnimation();
    
    console.log('✅ Custom hero content created!');
}

function setupWordAnimation() {
    const words = ['fastidieux', 'chronophage', 'répétitif', 'complexe'];
    let currentIndex = 0;
    const animatedWordEl = document.getElementById('custom-animated-word');
    
    if (!animatedWordEl) return;
    
    function cycleWords() {
        // Add pulse animation
        animatedWordEl.style.animation = 'none';
        void animatedWordEl.offsetWidth; // Force reflow
        animatedWordEl.style.animation = 'pulse 500ms ease-in-out';
        
        // Update word
        currentIndex = (currentIndex + 1) % words.length;
        animatedWordEl.textContent = words[currentIndex];
    }
    
    // Start cycling every 3 seconds
    setInterval(cycleWords, 3000);
    
    console.log('✅ Word animation setup complete');
}

// Apply the custom content when ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(createCustomHeroContent, 1500);
    });
} else {
    setTimeout(createCustomHeroContent, 1500);
}

// Also try after window load
window.addEventListener('load', () => {
    setTimeout(createCustomHeroContent, 2000);
});

// Watch for Vue mounting
const observer = new MutationObserver((mutations) => {
    const heroExists = document.querySelector('[data-section-id*="ac0b1e8c"]') || 
                      document.querySelector('#app section:first-child');
    if (heroExists && !document.querySelector('.custom-hero-container')) {
        setTimeout(createCustomHeroContent, 500);
    }
});

const appDiv = document.getElementById('app');
if (appDiv) {
    observer.observe(appDiv, { childList: true, subtree: true });
}