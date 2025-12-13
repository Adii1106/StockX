const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;



// 2. Manual CORS headers to ensure no library issues
app.use((req, res, next) => {
  const origin = req.headers.origin || '*';
  res.header('Access-Control-Allow-Origin', origin);
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  // Intercept OPTIONS method
  if (req.method === 'OPTIONS') {
    return res.status(200).send('OK');
  }
  next();
});

const connectDB = require('./db');

// Connect to MongoDB
connectDB();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('StockX API is running...');
});

app.get('/api/ping', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date(), 
    env: { 
      mongo: process.env.MONGO_URI ? 'Set' : 'Missing',
      port: process.env.PORT
    } 
  });
});

// Connect to MongoDB (Safe Mode)
try {
  connectDB().catch(err => console.error('Init DB connection failed:', err));
} catch (e) {
  console.error('Synchronous DB error:', e);
}

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/stocks', require('./routes/stocks'));
app.use('/api/watchlist', require('./routes/watchlist'));

// Export for Vercel
module.exports = app;

// Only listen if not running on Vercel (local dev)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
