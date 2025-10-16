class LoveQuotesApp {
    constructor() {
        this.baseUrl = window.location.origin;
        this.init();
        this.createFloatingHearts();
    }

    init() {
        this.loadTodayQuote();
        this.setupEventListeners();
        this.startBackgroundAnimation();
    }

    async loadTodayQuote() {
        const quoteElement = document.getElementById('todayQuote');
        
        try {
            const response = await fetch(`${this.baseUrl}/api/quote/today`);
            
            if (!response.ok) {
                throw new Error('Failed to fetch quote');
            }
            
            const data = await response.json();
            this.typeWriterEffect(quoteElement, data.quote);
            
        } catch (error) {
            console.error('Error loading today\'s quote:', error);
            this.showFallbackQuote(quoteElement, 'today');
        }
    }

    async loadRandomQuote() {
        const button = document.getElementById('randomQuoteBtn');
        const quoteElement = document.getElementById('randomQuote');
        
        // Save original content
        const originalContent = quoteElement.innerHTML;
        const originalButtonHTML = button.innerHTML;
        
        try {
            // Add loading state
            button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
            button.disabled = true;
            
            quoteElement.innerHTML = `
                <div class="loading-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            `;

            const response = await fetch(`${this.baseUrl}/api/quote/random`);
            
            if (!response.ok) {
                throw new Error('Failed to fetch random quote');
            }
            
            const data = await response.json();
            
            // Clear and type new quote
            quoteElement.innerHTML = '';
            this.typeWriterEffect(quoteElement, data.quote);
            
            // Add celebration effect
            this.createCelebrationEffect();
            
        } catch (error) {
            console.error('Error loading random quote:', error);
            quoteElement.innerHTML = originalContent;
            this.showError(quoteElement, 'Failed to load quote. Please try again.');
        } finally {
            // Restore button
            button.innerHTML = originalButtonHTML;
            button.disabled = false;
        }
    }

    typeWriterEffect(element, text, speed = 30) {
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

    showFallbackQuote(element, type) {
        const fallbackQuotes = {
            today: "Dear baby jana, Even when APIs fail, my love for you never does. You're always in my heart.",
            random: "Dear baby jana, This quote may be offline, but my love for you is always connected."
        };
        
        this.typeWriterEffect(element, fallbackQuotes[type] || fallbackQuotes.today);
    }

    showError(element, message) {
        element.innerHTML = `<span style="color: #ff6b6b;">${message}</span>`;
    }

    setupEventListeners() {
        document.getElementById('randomQuoteBtn').addEventListener('click', () => {
            this.loadRandomQuote();
        });

        // Keyboard shortcut
        document.addEventListener('keydown', (e) => {
            if (e.key === 'r' || e.key === 'R') {
                this.loadRandomQuote();
            }
        });

        // Refresh today's quote every hour
        setInterval(() => {
            this.loadTodayQuote();
        }, 60 * 60 * 1000);
    }

    createFloatingHearts() {
        const heartsContainer = document.querySelector('.floating-hearts');
        const heartEmojis = ['💕', '💖', '💗', '💓', '💞', '💝', '💘', '❤️', '🧡', '💛', '💚', '💙', '💜'];
        
        const createHeart = () => {
            const heart = document.createElement('div');
            heart.className = 'heart-float';
            heart.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
            
            // Random position
            const left = Math.random() * 100;
            heart.style.left = left + 'vw';
            
            // Random size
            const size = Math.random() * 25 + 15;
            heart.style.fontSize = size + 'px';
            
            // Random animation duration
            const duration = Math.random() * 4 + 6;
            heart.style.animationDuration = duration + 's';
            
            // Random delay
            const delay = Math.random() * 5;
            heart.style.animationDelay = delay + 's';
            
            heartsContainer.appendChild(heart);
            
            // Remove heart after animation
            setTimeout(() => {
                if (heart.parentNode) {
                    heart.remove();
                }
            }, (duration + delay) * 1000);
        };
        
        // Create initial hearts
        for (let i = 0; i < 12; i++) {
            setTimeout(createHeart, i * 500);
        }
        
        // Continue creating hearts
        setInterval(createHeart, 2000);
    }

    createCelebrationEffect() {
        const button = document.getElementById('randomQuoteBtn');
        const rect = button.getBoundingClientRect();
        
        for (let i = 0; i < 8; i++) {
            setTimeout(() => {
                this.createSparkle(rect.left + rect.width / 2, rect.top + rect.height / 2);
            }, i * 100);
        }
    }

    createSparkle(x, y) {
        const sparkle = document.createElement('div');
        sparkle.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            width: 6px;
            height: 6px;
            background: #ff6b6b;
            border-radius: 50%;
            pointer-events: none;
            z-index: 1000;
        `;
        
        document.body.appendChild(sparkle);
        
        const angle = Math.random() * Math.PI * 2;
        const distance = 50 + Math.random() * 50;
        const targetX = x + Math.cos(angle) * distance;
        const targetY = y + Math.sin(angle) * distance;
        
        sparkle.animate([
            { transform: 'scale(1) translate(0, 0)', opacity: 1 },
            { transform: `scale(0) translate(${targetX - x}px, ${targetY - y}px)`, opacity: 0 }
        ], {
            duration: 800,
            easing: 'ease-out'
        }).onfinish = () => sparkle.remove();
    }

    startBackgroundAnimation() {
        // Add subtle background animation
        document.body.style.animation = 'gradientShift 10s ease infinite';
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new LoveQuotesApp();
});

// Add service worker-like functionality for offline support
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // This is a simple offline fallback - in a real app, you'd register a proper service worker
        console.log('Love Quotes App loaded successfully!');
    });
}

// Add some interactive effects
document.addEventListener('mousemove', (e) => {
    const hearts = document.querySelectorAll('.heart-float');
    hearts.forEach(heart => {
        const rect = heart.getBoundingClientRect();
        const heartX = rect.left + rect.width / 2;
        const heartY = rect.top + rect.height / 2;
        const distance = Math.sqrt(Math.pow(e.clientX - heartX, 2) + Math.pow(e.clientY - heartY, 2));
        
        if (distance < 100) {
            heart.style.transform += ' scale(1.3)';
            setTimeout(() => {
                heart.style.transform = heart.style.transform.replace(' scale(1.3)', '');
            }, 300);
        }
    });
});