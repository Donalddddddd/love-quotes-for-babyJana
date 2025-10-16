class LoveQuotesApp {
    constructor() {
        this.init();
    }

    async init() {
        this.displayCurrentDate();
        await this.loadQuoteOfTheDay();
        this.startAnimations();
    }

    displayCurrentDate() {
        const now = new Date();
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        document.getElementById('currentDate').textContent = 
            now.toLocaleDateString('en-US', options);
    }

    async loadQuoteOfTheDay() {
        try {
            const response = await fetch('/api/quote');
            const data = await response.json();
            
            if (data.success) {
                this.displayQuote(data.quote);
            } else {
                this.displayQuote("Dear baby jana, even when things don't go as planned, my love for you remains constant and true.");
            }
        } catch (error) {
            console.error('Error loading quote:', error);
            this.displayQuote("Dear baby jana, my love for you is like the internet - always connected, never failing.");
        }
    }

    displayQuote(quote) {
        const quoteElement = document.getElementById('quoteText');
        quoteElement.style.opacity = '0';
        
        setTimeout(() => {
            quoteElement.textContent = quote;
            quoteElement.style.opacity = '1';
        }, 500);
    }

    startAnimations() {
        this.animatePets();
        this.createFloatingHearts();
    }

    animatePets() {
        const dog = document.getElementById('dog');
        const cat = document.getElementById('cat');

        setInterval(() => {
            dog.style.animation = 'none';
            cat.style.animation = 'none';
            
            setTimeout(() => {
                dog.style.animation = 'bounce 2s ease-in-out infinite';
                cat.style.animation = 'bounce 2s ease-in-out infinite 0.5s';
            }, 10);
        }, 8000);
    }

    createFloatingHearts() {
        const container = document.querySelector('.floating-hearts');
        const hearts = ['💖', '💝', '💘', '💗', '💓'];
        
        setInterval(() => {
            const heart = document.createElement('div');
            heart.className = 'floating-heart';
            heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
            heart.style.left = Math.random() * 100 + '%';
            heart.style.animationDuration = (Math.random() * 4 + 6) + 's';
            heart.style.fontSize = (Math.random() * 10 + 15) + 'px';
            
            container.appendChild(heart);
            
            setTimeout(() => {
                heart.remove();
            }, 10000);
        }, 1000);
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new LoveQuotesApp();
});

// Add some interactive effects
document.addEventListener('mousemove', (e) => {
    const hearts = document.querySelectorAll('.heart');
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;
    
    hearts.forEach((heart, index) => {
        const moveX = (mouseX - 0.5) * 20;
        const moveY = (mouseY - 0.5) * 20;
        heart.style.transform = `translate(${moveX}px, ${moveY}px) rotate(${moveX}deg)`;
    });
});