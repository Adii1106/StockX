const yf = require('yahoo-finance2');
try {
  const YahooFinance = yf.default;
  const instance = new YahooFinance();
  console.log('Instantiation successful');
  console.log('Instance has quote?', typeof instance.quote);
} catch (e) {
  console.log('Instantiation failed:', e.message);
}
