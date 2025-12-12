const YahooFinance = require('yahoo-finance2').default;
const yahooFinance = new YahooFinance();

async function checkRates() {
    try {
        const symbols = ['INR=X', 'EUR=X', 'GBP=X', 'JPY=X'];
        const quotes = await Promise.all(symbols.map(s => yahooFinance.quote(s)));
        
        console.log('--- Raw Quotes ---');
        quotes.forEach(q => {
            console.log(`Symbol: ${q.symbol}, Price: ${q.regularMarketPrice}`);
        });

        const rates = {};
        quotes.forEach(q => {
            // Symbol 'INR=X' -> 'INR'
            const currency = q.symbol.replace('=X', '');
            rates[currency] = q.regularMarketPrice;
        });
        rates['USD'] = 1; // Base
        console.log('--- Processed Rates ---');
        console.log(rates);

    } catch (e) {
        console.error('Error:', e);
    }
}

checkRates();
