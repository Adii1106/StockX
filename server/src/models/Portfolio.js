const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  symbol: {
    type: String,
    required: true,
  },
  shares: {
    type: Number,
    required: true,
    default: 0,
  },
  averagePrice: {
    type: Number,
    required: true,
  },
}, { timestamps: true });

// Make it easy to find a specific stock for a user
portfolioSchema.index({ user: 1, symbol: 1 }, { unique: true });

module.exports = mongoose.model('Portfolio', portfolioSchema);
