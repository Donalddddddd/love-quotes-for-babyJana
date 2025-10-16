class LoveQuotesApp {
    constructor() {
        this.initializeApp();
        this.bindEvents();
    }

    initializeApp() {
        this.displayCurrentDate();
        this.loadQuoteOfTheDay();
    }

    bindEvents() {
        document.getElementById('generateRandom').addEventListener('click', () => {
            this.generateRandomQuote();
        });
    }

    displayCurrentDate() {
        const now = new Date();
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        const dateString = now.toLocaleDateString('en-US', options);
        document.getElementById('currentDate').textContent = dateString;
    }

    async loadQuoteOfTheDay() {
        const quoteElement = document.getElementById('quoteOfTheDay');
        
        try {
            quoteElement.classList.add('loading');
            
            const response = await fetch('/api/quote-of-the-day');
            const data = await response.json();
            
            if (data.success) {
                this.typeWriter(quoteElement, data.quote, 50);
            } else {
                throw new Error(data.error);
            }
        } catch (error) {
            console.error('Error loading quote of the day:', error);
            quoteElement.textContent = 'Dear baby jana, even when technology fails, my love for you remains constant. 💖';
        } finally {
            quoteElement.classList.remove('loading');
        }
    }

    async generateRandomQuote() {
        const quoteElement = document.getElementById('randomQuote');
        const button = document.getElementById('generateRandom');
        
        try {
            // Add loading state to button
            button.disabled = true;
            button.classList.add('loading');
            quoteElement.classList.add('loading');
            
            const response = await fetch('/api/random-quote');
            const data = await response.json();
            
            if (data.success) {
                // Add fade out effect
                quoteElement.style.opacity = '0';
                
                setTimeout(() => {
                    this.typeWriter(quoteElement, data.quote, 30);
                    quoteElement.style.opacity = '1';
                    
                    // Add celebration effect
                    this.celebrate();
                }, 300);
            } else {
                throw new Error(data.error);
            }
        } catch (error) {
            console.error('Error generating random quote:', error);
            quoteElement.textContent = 'Dear baby jana, this random quote is specially crafted for you with all my love! 💝';
        } finally {
            button.disabled = false;
            button.classList.remove('loading');
            quoteElement.classList.remove('loading');
        }
    }

    typeWriter(element, text, speed = 50) {
        element.innerHTML = '';
        let i = 0;
        
        function type() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        
        type();
    }

    celebrate() {
        // Create floating hearts animation
        for (let i = 0; i < 5; i++) {
            this.createFloatingHeart();
        }
    }

    createFloatingHeart() {
        const heart = document.createElement('div');
        heart.innerHTML = '💖';
        heart.style.position = 'fixed';
        heart.style.fontSize = '1.5rem';
        heart.style.pointerEvents = 'none';
        heart.style.zIndex = '1000';
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.top = '100vh';
        heart.style.opacity = '1';
        
        document.body.appendChild(heart);
        
        // Animate the heart
        const animation = heart.animate([
            { transform: 'translateY(0) scale(1)', opacity: 1 },
            { transform: 'translateY(-100vh) scale(0.5)', opacity: 0 }
        ], {
            duration: 2000,
            easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
        });
        
        animation.onfinish = () => {
            heart.remove();
        };
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new LoveQuotesApp();
});

// Add service worker for offline functionality (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js').then(function(registration) {
            console.log('SW registered: ', registration);
        }).catch(function(registrationError) {
            console.log('SW registration failed: ', registrationError);
        });
    });
}