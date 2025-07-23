document.addEventListener('DOMContentLoaded', () => {

    /**
     * Splits the text content of elements with `data-animation="reveal-words"`
     * into individual <span> tags for each word.
     */
    const setupWordReveal = () => {
        const revealElements = document.querySelectorAll('[data-animation="reveal-words"]');
        revealElements.forEach(element => {
            const text = element.textContent;
            const words = text.trim().split(' ');
            element.innerHTML = ''; // Clear original text

            words.forEach((word, index) => {
                const wordSpan = document.createElement('span');
                wordSpan.textContent = word;
                wordSpan.classList.add('word');
                // Stagger the animation start time for each word
                wordSpan.style.transitionDelay = `${index * 0.05}s`;
                element.appendChild(wordSpan);
                // Add a space after each word
                element.appendChild(document.createTextNode(' '));
            });
        });
    };

    /**
     * Sets up the Intersection Observer to add the 'is-visible' class
     * to elements when they scroll into the viewport.
     */
    const setupScrollAnimations = () => {
        const animatedElements = document.querySelectorAll('[data-animation]');
        if (animatedElements.length === 0) return;

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    // Optional: Stop observing the element once it's visible
                    observer.unobserve(entry.target);
                }
            });
        }, {
            // Trigger animation when element is 20% visible
            threshold: 0.2,
        });

        animatedElements.forEach(element => {
            observer.observe(element);
        });
    };

    /**
     * Initializes a simple parallax effect for elements with `data-parallax`.
     * The effect moves the element vertically as the user scrolls.
     */
    const setupParallax = () => {
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        if (parallaxElements.length === 0) return;

        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset;
            parallaxElements.forEach(element => {
                // The 'speed' factor determines how fast the parallax effect is.
                // A smaller number means a more subtle effect.
                const speed = parseFloat(element.getAttribute('data-parallax-speed')) || 0.5;
                const yPos = -(scrollTop * speed / 10);
                element.style.transform = `translateY(${yPos}px)`;
            });
        });
    };


    // --- INITIALIZE ALL ANIMATION SYSTEMS ---
    setupWordReveal();
    setupScrollAnimations();
    setupParallax();

});