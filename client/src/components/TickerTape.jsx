import React from 'react';

const TickerTape = () => {
  const stocks = [
    { s: 'AAPL', p: '189.43', c: '+1.2%' },
    { s: 'TSLA', p: '175.05', c: '-0.8%' },
    { s: 'NVDA', p: '875.28', c: '+3.5%' },
    { s: 'GOOGL', p: '154.32', c: '+0.5%' },
    { s: 'BTC', p: '67,432', c: '+2.1%' },
    { s: 'ETH', p: '3,452', c: '-1.4%' },
    { s: 'MSFT', p: '415.10', c: '+0.2%' },
    { s: 'AMZN', p: '178.45', c: '+1.1%' },
    { s: 'META', p: '485.32', c: '-0.3%' },
    { s: 'NFLX', p: '610.54', c: '+2.4%' },
  ];

  return (
    <div className="w-full bg-[#0a0f18]/80 backdrop-blur-md border-b border-white/5 py-2 overflow-hidden sticky top-0 z-50">
      <div className="flex whitespace-nowrap animate-marquee">
        {/* Double the list for seamless loop */}
        {[...stocks, ...stocks].map((stock, i) => (
          <div key={i} className="flex items-center mx-6 space-x-2">
            <span className="font-bold text-white/90">{stock.s}</span>
            <span className="text-white/60 font-mono">{stock.p}</span>
            <span className={`text-xs ${stock.c.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}`}>
              {stock.c}
            </span>
          </div>
        ))}
      </div>
      
      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: inline-flex;
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default TickerTape;
