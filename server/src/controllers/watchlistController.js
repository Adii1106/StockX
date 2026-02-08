const Watchlist = require('../models/Watchlist');

// @desc    Get user watchlist
// @route   GET /api/watchlist
const getWatchlist = async (req, res) => {
  try {
    const watchlist = await Watchlist.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(watchlist);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Add to watchlist
// @route   POST /api/watchlist
const addWatchlistItem = async (req, res) => {
  const { symbol, name } = req.body;

  if (!symbol) {
    return res.status(400).json({ message: 'Symbol is required' });
  }

  try {
    // Check if already in watchlist
    const exists = await Watchlist.findOne({ userId: req.user.id, symbol });

    if (exists) {
      return res.status(400).json({ message: 'Stock already in watchlist' });
    }

    const item = await Watchlist.create({
      userId: req.user.id,
      symbol,
      name,
    });

    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Remove from watchlist
// @route   DELETE /api/watchlist/:id
const removeWatchlistItem = async (req, res) => {
  try {
    const item = await Watchlist.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // make sure user owns this item before deleting!
    if (item.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await item.deleteOne();
    
    res.json({ message: 'Removed from watchlist', id: req.params.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getWatchlist,
  addWatchlistItem,
  removeWatchlistItem,
};
