class LoveQuotesApp {
    constructor() {
        this.init();
        this.createFloatingHearts();
    }

    init() {
        this.loadTodayQuote();
        this.setupEventListeners();
    }

    async loadTodayQuote() {
        try {
            const response = await fetch('/api/quote/today');
            const data = await response.json();
            document.getElementById('todayQuote').textContent = data.quote;
        } catch (error) {
            console.error('Error loading today\'s quote:', error);
            document.getElementById('todayQuote').textContent = 'Dear baby jana, You are always in my heart.';
        }
    }

    async loadRandomQuote() {
        try {
            const button = document.getElementById('randomQuoteBtn');
            const originalText = button.innerHTML;
            
            // Add loading state
            button.innerHTML = '<span class="button-heart">💗</span>Loading...<span class="button-heart">💗</span>';
            button.disabled = true;

            const response = await fetch('/api/quote/random');
            const data = await response.json();
            
            // Add fade out effect
            const quoteElement = document.getElementById('randomQuote');
            quoteElement.style.opacity = '0';
            
            setTimeout(() => {
                quoteElement.textContent = data.quote;
                quoteElement.style.opacity = '1';
                
                // Restore button
                button.innerHTML = originalText;
                button.disabled = false;
            }, 300);

        } catch (error) {
            console.error('Error loading random quote:', error);
            document.getElementById('randomQuote').textContent = 'Dear baby jana, My love for you grows stronger every day.';
            
            // Restore button
            const button = document.getElementById('randomQuoteBtn');
            button.innerHTML = '<span class="button-heart">💗</span>Generate Random Quote<span class="button-heart">💗</span>';
            button.disabled = false;
        }
    }

    setupEventListeners() {
        document.getElementById('randomQuoteBtn').addEventListener('click', () => {
            this.loadRandomQuote();
        });
    }

    createFloatingHearts() {
        const heartsContainer = document.querySelector('.floating-hearts');
        const heartEmojis = ['💕', '💖', '💗', '💓', '💞', '💝', '💘', '❤️'];
        
        for (let i = 0; i < 15; i++) {
            setTimeout(() => {
                this.createHeart(heartsContainer, heartEmojis);
            }, i * 400);
        }
    }

    createHeart(container, emojis) {
        const heart = document.createElement('div');
        heart.className = 'heart-float';
        heart.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        
        // Random position
        const left = Math.random() * 100;
        heart.style.left = left + 'vw';
        
        // Random size
        const size = Math.random() * 20 + 15;
        heart.style.fontSize = size + 'px';
        
        // Random animation duration
        const duration = Math.random() * 3 + 6;
        heart.style.animationDuration = duration + 's';
        
        // Random delay
        const delay = Math.random() * 5;
        heart.style.animationDelay = delay + 's';
        
        container.appendChild(heart);
        
        // Remove heart after animation
        setTimeout(() => {
            heart.remove();
        }, (duration + delay) * 1000);
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new LoveQuotesApp();
});

// Add some interactive effects
document.addEventListener('mousemove', (e) => {
    const hearts = document.querySelectorAll('.heart-float');
    hearts.forEach(heart => {
        const rect = heart.getBoundingClientRect();
        const heartX = rect.left + rect.width / 2;
        const heartY = rect.top + rect.height / 2;
        const distance = Math.sqrt(Math.pow(e.clientX - heartX, 2) + Math.pow(e.clientY - heartY, 2));
        
        if (distance < 100) {
            heart.style.transform += ' scale(1.2)';
            setTimeout(() => {
                heart.style.transform = heart.style.transform.replace(' scale(1.2)', '');
            }, 300);
        }
    });
});