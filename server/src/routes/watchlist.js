const express = require('express');
const router = express.Router();
const {
  getWatchlist,
  addWatchlistItem,
  removeWatchlistItem,
} = require('../controllers/watchlistController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getWatchlist);
router.post('/', protect, addWatchlistItem);
router.delete('/:id', protect, removeWatchlistItem);

module.exports = router;
