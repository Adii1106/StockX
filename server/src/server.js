const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;



// 2. Manual CORS headers (Simple Wildcard for Debugging)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); 
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
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

app.get('/api/ping', async (req, res) => {
  try {
    const conn = await connectDB();
    const state = ['Disconnected', 'Connected', 'Connecting', 'Disconnecting'][conn.connection.readyState];
    res.json({ 
      status: 'ok', 
      dbState: state,
      dbHost: conn.connection.host,
      timestamp: new Date()
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'error', 
      message: error.message,
      code: error.code,
      name: error.name
    });
  }
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
