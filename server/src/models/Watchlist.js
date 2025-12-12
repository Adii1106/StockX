const mongoose = require('mongoose');

const watchlistSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  symbol: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: false,
  },
}, { timestamps: true });

module.exports = mongoose.model('Watchlist', watchlistSchema);
