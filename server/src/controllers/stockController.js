const YahooFinance = require('yahoo-finance2').default;
const yahooFinance = new YahooFinance();

// @desc    Get stock quote
// @route   GET /api/stocks/quote/:symbol
const getQuote = async (req, res) => {
  try {
    const symbol = req.params.symbol;
    const quote = await yahooFinance.quote(symbol);
    
    // Normalize data for frontend
    const data = {
      symbol: quote.symbol,
      price: quote.regularMarketPrice,
      change: quote.regularMarketChange,
      changePercent: quote.regularMarketChangePercent,
      name: quote.longName || quote.shortName,
      // Extended Data
      open: quote.regularMarketOpen,
      high: quote.regularMarketDayHigh,
      low: quote.regularMarketDayLow,
      prevClose: quote.regularMarketPreviousClose,
      volume: quote.regularMarketVolume,
      marketCap: quote.marketCap,
    };

    res.json(data);
  } catch (error) {
    console.error(`Error fetching quote for ${req.params.symbol}:`, error.message);
    res.status(500).json({ message: error.message || 'Error fetching stock quote' });
  }
};

// @desc    Get stock history
// @route   GET /api/stocks/history/:symbol
const getHistory = async (req, res) => {
  try {
    const symbol = req.params.symbol;
    // details: fetch 6 months of data, or based on query param
    const { period } = req.query; // e.g. '1mo', '3mo', '1y'
    
    // Map period to queryOptions if needed, defaults to 6mo
    // yahoo-finance2 historical is powerful
    
    // Simplification for MVP: get last 100 days
    const today = new Date();
    const pastDate = new Date();
    pastDate.setDate(today.getDate() - 100);
    
    const result = await yahooFinance.historical(symbol, {
      period1: pastDate,
      period2: today,
    });

    // Format for Recharts: [{ date: '...', price: 123 }]
    const formattedData = result.map(item => ({
      date: item.date.toISOString().split('T')[0],
      price: item.close,
    }));

    res.json(formattedData);
  } catch (error) {
    console.error(`Error fetching history for ${req.params.symbol}:`, error.message);
    res.status(500).json({ message: error.message || 'Error fetching stock history' });
  }
};

// @desc    Search for stocks
// @route   GET /api/stocks/search
const searchStocks = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ message: 'Query parameter is required' });
    }
    const results = await yahooFinance.search(query);
    const quotes = results.quotes.filter(q => q.isYahooFinance).map(q => ({
      symbol: q.symbol,
      name: q.longname || q.shortname || q.symbol,
      exchange: q.exchange,
    }));
    res.json(quotes);
  } catch (error) {
    console.error(`Error searching stocks for ${req.query.query}:`, error.message);
    res.status(500).json({ message: 'Error searching stocks' });
  }
};

// @desc    Get stock news
// @route   GET /api/stocks/news/:symbol
const getNews = async (req, res) => {
  try {
    const symbol = req.params.symbol;
    const result = await yahooFinance.search(symbol, { newsCount: 5 });
    res.json(result.news || []);
  } catch (error) {
    console.error(`Error fetching news for ${req.params.symbol}:`, error.message);
    res.status(500).json({ message: 'Error fetching news' });
  }
};

// @desc    Get exchange rates (USD base)
// @route   GET /api/stocks/rates
const getExchangeRates = async (req, res) => {
  try {
    // Fetch generic rates
    // Yahoo often returns 'USDINR=X' for 'INR=X'. We'll fetch what we know works.
    const symbols = ['INR=X', 'EUR=X', 'GBP=X', 'JPY=X'];
    const quotes = await Promise.all(symbols.map(s => yahooFinance.quote(s)));
    
    const rates = {};
    quotes.forEach(q => {
      // Clean up symbol: 'USDINR=X' -> 'INR', 'EUR=X' -> 'EUR'
      let currency = q.symbol.replace('=X', '');
      if (currency.startsWith('USD') && currency.length > 3) {
          currency = currency.replace('USD', '');
      }
      rates[currency] = q.regularMarketPrice;
    });
    rates['USD'] = 1; // Base

    res.json(rates);
  } catch (error) {
    console.error('Error fetching exchange rates:', error.message);
    res.status(500).json({ message: 'Error fetching exchange rates' });
  }
};

// @desc    Get general market news
// @route   GET /api/stocks/news/general
const getMarketNews = async (req, res) => {
  try {
    // Search for broad topics to get general market news
    const result = await yahooFinance.search('stock market', { newsCount: 8 });
    res.json(result.news || []);
  } catch (error) {
    console.error('Error fetching market news:', error.message);
    res.status(500).json({ message: 'Error fetching market news' });
  }
};

// @desc    Get batch quotes for multiple symbols
// @route   GET /api/stocks/batch?symbols=AAPL,NVDA,GOOGL
const getBatchQuotes = async (req, res) => {
  try {
    const { symbols } = req.query;
    if (!symbols) {
      return res.status(400).json({ message: 'Symbols parameter is required' });
    }

    const symbolArray = symbols.split(',').map(s => s.trim());
    const quotes = await Promise.all(
      symbolArray.map(async (symbol) => {
        try {
          const quote = await yahooFinance.quote(symbol);
          return {
            symbol: quote.symbol,
            price: quote.regularMarketPrice,
            change: quote.regularMarketChangePercent,
            name: quote.longName || quote.shortName,
          };
        } catch (error) {
          console.error(`Error fetching ${symbol}:`, error.message);
          return null;
        }
      })
    );

    // Filter out failed requests
    const validQuotes = quotes.filter(q => q !== null);
    res.json(validQuotes);
  } catch (error) {
    console.error('Error fetching batch quotes:', error.message);
    res.status(500).json({ message: 'Error fetching batch quotes' });
  }
};

module.exports = {
  getQuote,
  getHistory,
  searchStocks,
  getNews,
  getExchangeRates,
  getMarketNews,
  getBatchQuotes,
};
