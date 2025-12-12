const express = require('express');
const router = express.Router();
const {
  getQuote,
  getHistory,
  searchStocks,
  getNews,
  getExchangeRates,
  getMarketNews,
} = require('../controllers/stockController');

router.get('/quote/:symbol', getQuote);
router.get('/history/:symbol', getHistory);
router.get('/search', searchStocks);
router.get('/news/general', getMarketNews); // General news
router.get('/news/:symbol', getNews);       // Specific stock news
router.get('/rates', getExchangeRates);

module.exports = router;
