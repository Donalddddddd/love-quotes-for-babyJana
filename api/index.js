const express = require('express');
const cors = require('cors');
const nodeCron = require('node-cron');
const axios = require('axios');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Free APIs for love quotes
const FREE_APIS = {
    QUOTABLE: 'https://api.quotable.io/random?tags=love',
    QUOTE_GARDEN: 'https://quote-garden.onrender.com/api/v3/quotes/random?tag=love',
    JOKE_API: 'https://v2.jokeapi.dev/joke/Any?type=single&contains=love'
};

// Fallback quotes in case APIs fail
const FALLBACK_QUOTES = [
    "Every moment with you is a wonderful addition to my life's journey.",
    "You're the missing piece I never knew I was searching for.",
    "In your smile, I see something more beautiful than the stars.",
    "Loving you is like breathing - I can't stop and I don't want to.",
    "You are the source of my joy, the center of my world, and the whole of my heart.",
    "If I had a flower for every time I thought of you, I could walk in my garden forever.",
    "My love for you is a journey starting at forever and ending at never.",
    "You are my today and all of my tomorrows.",
    "I saw that you were perfect, and so I loved you. Then I saw that you were not perfect and I loved you even more.",
    "I need you like a heart needs a beat."
];

// Store today's quote
let todaysQuote = "Dear baby jana, " + FALLBACK_QUOTES[0];

// Function to fetch quote from free APIs
async function fetchLoveQuote() {
    const apis = Object.values(FREE_APIS);
    
    for (let apiUrl of apis) {
        try {
            console.log(`Trying API: ${apiUrl}`);
            const response = await axios.get(apiUrl, { timeout: 5000 });
            
            if (apiUrl.includes('quotable')) {
                const data = response.data;
                if (data.content) {
                    return data.content;
                }
            } else if (apiUrl.includes('quote-garden')) {
                const data = response.data;
                if (data.data && data.data[0] && data.data[0].quoteText) {
                    return data.data[0].quoteText;
                }
            } else if (apiUrl.includes('jokeapi')) {
                const data = response.data;
                if (data.joke) {
                    return data.joke;
                }
            }
        } catch (error) {
            console.log(`API ${apiUrl} failed:`, error.message);
            continue;
        }
    }
    
    // If all APIs fail, use fallback
    const randomIndex = Math.floor(Math.random() * FALLBACK_QUOTES.length);
    return FALLBACK_QUOTES[randomIndex];
}

// Generate new quote every day at midnight
nodeCron.schedule('0 0 * * *', async () => {
    try {
        const newQuote = await fetchLoveQuote();
        todaysQuote = "Dear baby jana, " + newQuote;
        console.log('New quote of the day:', todaysQuote);
    } catch (error) {
        console.log('Failed to fetch new quote, using fallback');
        const randomIndex = Math.floor(Math.random() * FALLBACK_QUOTES.length);
        todaysQuote = "Dear baby jana, " + FALLBACK_QUOTES[randomIndex];
    }
});

// Initialize first quote
(async function initializeQuote() {
    try {
        const initialQuote = await fetchLoveQuote();
        todaysQuote = "Dear baby jana, " + initialQuote;
    } catch (error) {
        const randomIndex = Math.floor(Math.random() * FALLBACK_QUOTES.length);
        todaysQuote = "Dear baby jana, " + FALLBACK_QUOTES[randomIndex];
    }
})();

// API Routes
app.get('/api/quote/today', (req, res) => {
    res.json({ 
        quote: todaysQuote,
        timestamp: new Date().toISOString()
    });
});

app.get('/api/quote/random', async (req, res) => {
    try {
        const randomQuote = await fetchLoveQuote();
        res.json({ 
            quote: "Dear baby jana, " + randomQuote,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        const randomIndex = Math.floor(Math.random() * FALLBACK_QUOTES.length);
        res.json({ 
            quote: "Dear baby jana, " + FALLBACK_QUOTES[randomIndex],
            timestamp: new Date().toISOString()
        });
    }
});

app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'healthy',
        message: 'Love Quotes API is running',
        timestamp: new Date().toISOString()
    });
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('Error:', error);
    res.status(500).json({ 
        error: 'Something went wrong!',
        message: error.message 
    });
});

// Export for Vercel
module.exports = app;