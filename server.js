const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// स्कोर्स को टेम्परेरी सेव करने के लिए एरे (सर्वर रीस्टार्ट होने तक रहेगा)
let leaderboard = [];

// 1. स्कोर सेव करने का API
app.post('/api/save-score', (req, res) => {
    const { score, survived } = req.body;
    
    // एक नया एंट्री ऑब्जेक्ट बनाओ (तुम चाहो तो बाद में प्लेयर का नाम भी जोड़ सकते हो)
    const newEntry = {
        score: score,
        status: survived ? "✅ Survived" : "🚨 Injured",
        date: new Date().toLocaleTimeString()
    };

    leaderboard.push(newEntry);
    
    // स्कोर्स को बड़े से छोटे क्रम (Descending Order) में सॉर्ट करो
    leaderboard.sort((a, b) => b.score - a.score);
    
    // सिर्फ टॉप 5 स्कोर्स ही रखो
    leaderboard = leaderboard.slice(0, 5);

    console.log("\n🏆 CURRENT LEADERBOARD (TOP 5) 🏆");
    console.table(leaderboard);

    res.json({ status: "success", leaderboard: leaderboard });
});

// 2. लीडरबोर्ड डेटा गेट करने का API
app.get('/api/leaderboard', (req, res) => {
    res.json(leaderboard);
});

app.listen(PORT, () => {
    console.log(`🚀 Ocean Eco-Scanner Server running at http://localhost:${PORT}`);
});