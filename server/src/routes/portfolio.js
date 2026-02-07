const express = require('express');
const router = express.Router();
const { buyStock, sellStock, getPortfolio, getTransactions } = require('../controllers/portfolioController');
const { protect } = require('../middleware/authMiddleware');

// All portfolio routes are protected
router.use(protect);

router.get('/', getPortfolio);
router.get('/transactions', getTransactions);
router.post('/buy', buyStock);
router.post('/sell', sellStock);

module.exports = router;
