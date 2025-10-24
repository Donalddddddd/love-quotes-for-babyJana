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
    "Every moment with you is like a beautiful dream come true. Dear baby jana, you are my everything.",
    "In your eyes, I found my home. Dear baby jana, my love for you grows stronger each day.",
    "You are the missing piece I never knew I needed. Dear baby jana, my heart belongs to you forever.",
    "With every heartbeat, I love you more. Dear baby jana, you complete my world.",
    "Your smile lights up my darkest days. Dear baby jana, you are my sunshine.",
    "I never believed in fairy tales until I met you. Dear baby jana, you are my happily ever after.",
    "In the garden of my heart, you are the most beautiful flower. Dear baby jana, I cherish you always.",
    "Every love song reminds me of you. Dear baby jana, you are the melody of my soul.",
    "Your love is the greatest gift I've ever received. Dear baby jana, I'm forever grateful for you.",
    "With you, every day feels like Valentine's Day. Dear baby jana, my love for you is eternal.",
    "Your smile is the sunshine that brightens my darkest days. Dear baby jana, you are my light.",
    "Loving you is the easiest and most natural thing I have ever done. Dear baby jana, you are my destiny",
    "I never knew what happiness was until you came into my life. Dear baby jana, you are my joy.",
    "With you, I have found a love I never knew existed. Dear baby jana, you are my miracle.",
    "You are the reason I believe in soulmates. Dear baby jana, my heart was made for you.",
    "Every time I see you, my heart skips a beat. Dear baby jana, you take my breath away.",
    "I fall in love with you more and more every single day. Dear baby jana, you are my forever.",
    "Your love is the greatest gift I have ever received. Dear baby jana, I cherish you."
];

// Function to get quote of the day (based on date)
function getQuoteOfTheDay() {
    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
    const quoteIndex = dayOfYear % loveQuotes.length;
    return loveQuotes[quoteIndex];
}

// API Routes
app.get('/api/quote', (req, res) => {
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
            error: 'Failed to fetch quote'
        });
    }
});

app.get('/api/quotes', (req, res) => {
    res.json({
        success: true,
        quotes: loveQuotes
    });
});

// Serve frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Vercel serverless function handler
module.exports = app;