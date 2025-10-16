const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Love quotes database
const loveQuotes = [
    "Every day with you is a wonderful addition to my life's journey.",
    "You're the missing piece I never knew I was searching for.",
    "In your smile, I see something more beautiful than the stars.",
    "Loving you is like breathing - I can't stop and I don't want to.",
    "You are the source of my joy, the center of my world, and the whole of my heart.",
    "If I had to choose between breathing and loving you, I would use my last breath to say I love you.",
    "My love for you is a journey starting at forever and ending at never.",
    "I saw that you were perfect, and so I loved you. Then I saw that you were not perfect and I loved you even more.",
    "You are my sun, my moon, and all my stars.",
    "I love you not only for what you are but for what I am when I'm with you."
];

// Function to get quote of the day (consistent based on date)
function getQuoteOfTheDay() {
    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
    const quoteIndex = dayOfYear % loveQuotes.length;
    return `Dear baby jana, ${loveQuotes[quoteIndex]}`;
}

// Function to get random quote
function getRandomQuote() {
    const randomIndex = Math.floor(Math.random() * loveQuotes.length);
    return `Dear baby jana, ${loveQuotes[randomIndex]}`;
}

// API Routes
app.get('/api/quote-of-the-day', (req, res) => {
    try {
        const quote = getQuoteOfTheDay();
        res.json({
            success: true,
            quote: quote,
            date: new Date().toISOString().split('T')[0]
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch quote of the day'
        });
    }
});

app.get('/api/random-quote', (req, res) => {
    try {
        const quote = getRandomQuote();
        res.json({
            success: true,
            quote: quote
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch random quote'
        });
    }
});

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Vercel serverless function handler
module.exports = app;