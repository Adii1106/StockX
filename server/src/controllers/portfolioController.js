const User = require('../models/User');
const Portfolio = require('../models/Portfolio');
const Transaction = require('../models/Transaction');
const YahooFinance = require('yahoo-finance2').default;
const yahooFinance = new YahooFinance({
    suppressNotices: ['yahooSurvey', 'ripHistorical']
});

// helper to get current price without validation crashes
const getCurrentPrice = async (symbol) => {
    try {
        const quote = await yahooFinance.quote(symbol, {}, { validateResult: false });
        return quote.regularMarketPrice;
    } catch (err) {
        throw new Error('Could not get live price for trade');
    }
};

// @desc    Buy a stock
// @route   POST /api/portfolio/buy
const buyStock = async (req, res) => {
    try {
        const { symbol, shares } = req.body;
        const userId = req.user.id;

        if (!symbol || !shares || shares <= 0) {
            return res.status(400).json({ message: 'Invalid trade details' });
        }

        const price = await getCurrentPrice(symbol);
        const totalCost = price * shares;

        const user = await User.findById(userId);
        if (user.balance < totalCost) {
            return res.status(400).json({ message: 'Insufficient funds! Go earn some fake money' });
        }

        // 1. Deduct from balance
        user.balance -= totalCost;
        await user.save();

        // 2. Update Portfolio
        let holding = await Portfolio.findOne({ user: userId, symbol });
        if (holding) {
            // Calculate new average price: (old_total + new_total) / total_shares
            const oldTotal = holding.averagePrice * holding.shares;
            holding.shares += Number(shares);
            holding.averagePrice = (oldTotal + totalCost) / holding.shares;
            await holding.save();
        } else {
            holding = await Portfolio.create({
                user: userId,
                symbol,
                shares,
                averagePrice: price
            });
        }

        // 3. Create Transaction
        await Transaction.create({
            user: userId,
            symbol,
            type: 'BUY',
            shares,
            price,
            totalAmount: totalCost
        });

        res.json({ message: 'Trade successful!', balance: user.balance, holding });

    } catch (error) {
        console.error('Buy error:', error.message);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Sell a stock
// @route   POST /api/portfolio/sell
const sellStock = async (req, res) => {
    try {
        const { symbol, shares } = req.body;
        const userId = req.user.id;

        const holding = await Portfolio.findOne({ user: userId, symbol });
        if (!holding || holding.shares < shares) {
            return res.status(400).json({ message: 'Not enough shares to sell!' });
        }

        const price = await getCurrentPrice(symbol);
        const totalGain = price * shares;

        // 1. Update Portfolio
        holding.shares -= Number(shares);
        if (holding.shares === 0) {
            await Portfolio.findByIdAndDelete(holding._id);
        } else {
            await holding.save();
        }

        // 2. Add to balance
        const user = await User.findById(userId);
        user.balance += totalGain;
        await user.save();

        // 3. Create Transaction
        await Transaction.create({
            user: userId,
            symbol,
            type: 'SELL',
            shares,
            price,
            totalAmount: totalGain
        });

        res.json({ message: 'Sold successfully!', balance: user.balance });

    } catch (error) {
        console.error('Sell error:', error.message);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user portfolio with real-time value
// @route   GET /api/portfolio
const getPortfolio = async (req, res) => {
    try {
        const userId = req.user.id;
        const holdings = await Portfolio.find({ user: userId });
        
        // Fetch current prices for all holdings in parallel
        const enrichedHoldings = await Promise.all(holdings.map(async (h) => {
            try {
                const currentPrice = await getCurrentPrice(h.symbol);
                const currentValue = currentPrice * h.shares;
                const profitLoss = currentValue - (h.averagePrice * h.shares);
                return {
                    ...h._doc,
                    currentPrice,
                    currentValue,
                    profitLoss,
                    profitLossPercentage: (profitLoss / (h.averagePrice * h.shares)) * 100
                };
            } catch (err) {
                return { ...h._doc, error: 'Could not fetch live price' };
            }
        }));

        const user = await User.findById(userId).select('balance');

        res.json({
            balance: user.balance,
            holdings: enrichedHoldings
        });

    } catch (error) {
        res.status(500).json({ message: 'Error fetching portfolio' });
    }
};

// @desc    Get user transaction history
// @route   GET /api/portfolio/transactions
const getTransactions = async (req, res) => {
    try {
        const userId = req.user.id;
        const transactions = await Transaction.find({ user: userId }).sort({ createdAt: -1 });
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching transactions' });
    }
};

module.exports = { buyStock, sellStock, getPortfolio, getTransactions };
