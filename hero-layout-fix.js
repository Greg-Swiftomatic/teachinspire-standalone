/* ===================================================
   TEACHINSPIRE HERO LAYOUT FIX - POST-VUE INJECTION
   =================================================== */

// Wait for Vue to render, then apply our layout fixes
function applyHeroLayoutFix() {
    console.log('🚀 Applying hero layout fix...');
    
    // Find the hero section by looking for characteristic elements
    const heroSection = document.querySelector('[data-section-id*="ac0b1e8c"]') ||
                       document.querySelector('section:first-of-type') ||
                       document.querySelector('[data-name*="Hero"]') ||
                       document.querySelector('div[id*="app"] section:first-child');
    
    if (!heroSection) {
        console.log('❌ Hero section not found, retrying...');
        setTimeout(applyHeroLayoutFix, 500);
        return;
    }
    
    console.log('✅ Found hero section:', heroSection);
    
    // Find the hero container (should have text elements + image)
    const heroContainer = heroSection.querySelector('[data-ww-object-uid*="6622e1cb"]') ||
                         heroSection.querySelector('.ww-object') ||
                         heroSection.querySelector('div:first-child');
    
    if (!heroContainer) {
        console.log('❌ Hero container not found, retrying...');
        setTimeout(applyHeroLayoutFix, 500);
        return;
    }
    
    console.log('✅ Found hero container:', heroContainer);
    
    // Apply grid layout to container
    heroContainer.style.cssText = `
        display: grid !important;
        grid-template-columns: 1fr 1fr !important;
        gap: 64px !important;
        align-items: center !important;
        max-width: 1200px !important;
        width: 100% !important;
        margin: 0 auto !important;
        text-align: left !important;
    `;
    
    // Find all children in the hero container
    const children = Array.from(heroContainer.children);
    console.log('✅ Found', children.length, 'hero children');
    
    // Find the hourglass image
    const hourglassImage = children.find(child => {
        const img = child.querySelector('img') || child;
        return img.src && (img.src.includes('513fa36c') || 
                          img.src.includes('hourglass') || 
                          img.alt && img.alt.toLowerCase().includes('hourglass'));
    });
    
    if (hourglassImage) {
        console.log('✅ Found hourglass image:', hourglassImage);
        
        // Position image in right column
        hourglassImage.style.cssText = `
            grid-column: 2 !important;
            grid-row: 1 / -1 !important;
            justify-self: center !important;
            align-self: center !important;
            max-width: 450px !important;
            width: 100% !important;
            height: auto !important;
            order: 2 !important;
        `;
        
        // Style the actual img element inside
        const img = hourglassImage.querySelector('img');
        if (img) {
            img.style.cssText = `
                max-width: 450px !important;
                width: 100% !important;
                height: auto !important;
                object-fit: contain !important;
            `;
        }
    }
    
    // Position all text elements in left column
    children.forEach((child, index) => {
        if (child !== hourglassImage) {
            child.style.cssText = `
                grid-column: 1 !important;
                text-align: left !important;
                align-self: start !important;
            `;
            
            // Also fix text alignment in nested elements
            const textElements = child.querySelectorAll('h1, h2, p, .ww-text, [role="heading"]');
            textElements.forEach(el => {
                el.style.textAlign = 'left';
            });
        }
    });
    
    // Apply mobile responsive styles
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    const handleMobileLayout = (e) => {
        if (e.matches) {
            heroContainer.style.gridTemplateColumns = '1fr';
            heroContainer.style.textAlign = 'center';
            
            if (hourglassImage) {
                hourglassImage.style.order = '-1';
                hourglassImage.style.maxWidth = '300px';
                hourglassImage.style.marginBottom = '24px';
            }
            
            children.forEach(child => {
                if (child !== hourglassImage) {
                    child.style.textAlign = 'center';
                    const textElements = child.querySelectorAll('h1, h2, p, .ww-text, [role="heading"]');
                    textElements.forEach(el => {
                        el.style.textAlign = 'center';
                    });
                }
            });
        } else {
            heroContainer.style.gridTemplateColumns = '1fr 1fr';
            heroContainer.style.textAlign = 'left';
            
            if (hourglassImage) {
                hourglassImage.style.order = '2';
                hourglassImage.style.maxWidth = '450px';
                hourglassImage.style.marginBottom = '0';
            }
            
            children.forEach(child => {
                if (child !== hourglassImage) {
                    child.style.textAlign = 'left';
                    const textElements = child.querySelectorAll('h1, h2, p, .ww-text, [role="heading"]');
                    textElements.forEach(el => {
                        el.style.textAlign = 'left';
                    });
                }
            });
        }
    };
    
    mediaQuery.addListener(handleMobileLayout);
    handleMobileLayout(mediaQuery);
    
    console.log('🎉 Hero layout fix applied successfully!');
}

// Try to apply the fix when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(applyHeroLayoutFix, 1000);
    });
} else {
    setTimeout(applyHeroLayoutFix, 1000);
}

// Also listen for Vue route changes or updates
if (window.addEventListener) {
    window.addEventListener('load', () => {
        setTimeout(applyHeroLayoutFix, 2000);
    });
    
    // Watch for mutations in the app div
    const observer = new MutationObserver((mutations) => {
        const hasHeroContent = document.querySelector('[data-section-id*="ac0b1e8c"]') || 
                              document.querySelector('section:first-of-type');
        if (hasHeroContent) {
            setTimeout(applyHeroLayoutFix, 100);
        }
    });
    
    const appDiv = document.getElementById('app');
    if (appDiv) {
        observer.observe(appDiv, { childList: true, subtree: true });
    }
}