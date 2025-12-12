const yf = require('yahoo-finance2');
console.log('Type of yf:', typeof yf);
console.log('Keys of yf:', Object.keys(yf));
console.log('Type of yf.default:', typeof yf.default);
if (yf.default) {
  console.log('Keys of yf.default:', Object.keys(yf.default));
}
try {
  const instance = new yf.YahooFinance();
  console.log('Successfully created instance from yf.YahooFinance');
} catch (e) {
  console.log('Could not create instance from yf.YahooFinance:', e.message);
}
