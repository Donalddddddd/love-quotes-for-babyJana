const express = require('express');
const cors = require('cors');
const nodeCron = require('node-cron');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Love quotes database
const loveQuotes = [
    "Every moment with you is a wonderful addition to my life's journey.",
    "You're the missing piece I never knew I was searching for.",
    "In your smile, I see something more beautiful than the stars.",
    "Loving you is like breathing - I can't stop and I don't want to.",
    "You are the source of my joy, the center of my world, and the whole of my heart.",
    "If I had a flower for every time I thought of you, I could walk in my garden forever.",
    "My love for you is a journey starting at forever and ending at never.",
    "You are my today and all of my tomorrows.",
    "I saw that you were perfect, and so I loved you. Then I saw that you were not perfect and I loved you even more.",
    "I need you like a heart needs a beat.",
    "You are the last thought in my mind before I drift off to sleep and the first thought when I wake up each morning.",
    "I love you not only for what you are but for what I am when I'm with you.",
    "To the world you may be one person, but to me you are the world.",
    "I choose you. And I'll choose you over and over and over. Without pause, without doubt, in a heartbeat. I'll keep choosing you.",
    "You're my paradise and I'd happily get stranded on you for a lifetime."
];

// Store today's quote
let todaysQuote = "Dear baby jana, " + loveQuotes[0];

// Generate new quote every day at midnight
nodeCron.schedule('0 0 * * *', () => {
    const randomIndex = Math.floor(Math.random() * loveQuotes.length);
    todaysQuote = "Dear baby jana, " + loveQuotes[randomIndex];
    console.log('New quote of the day:', todaysQuote);
});

// Initialize first quote
todaysQuote = "Dear baby jana, " + loveQuotes[Math.floor(Math.random() * loveQuotes.length)];

// API Routes
app.get('/api/quote/today', (req, res) => {
    res.json({ quote: todaysQuote });
});

app.get('/api/quote/random', (req, res) => {
    const randomIndex = Math.floor(Math.random() * loveQuotes.length);
    const randomQuote = "Dear baby jana, " + loveQuotes[randomIndex];
    res.json({ quote: randomQuote });
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// Export for Vercel
module.exports = app;