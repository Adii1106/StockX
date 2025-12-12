const POPULAR_STOCKS = [
    { symbol: 'AAPL', name: 'Apple Inc.' },
    { symbol: 'MSFT', name: 'Microsoft Corp' },
    { symbol: 'GOOGL', name: 'Alphabet Inc.' },
    { symbol: 'AMZN', name: 'Amazon.com' },
    { symbol: 'TSLA', name: 'Tesla Inc.' },
    { symbol: 'NVDA', name: 'NVIDIA Corp' },
];

const PopularStocks = ({ onSelect }) => {
    return (
        <div className="card">
            <h3 style={{ marginBottom: '15px' }}>Popular Stocks</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {POPULAR_STOCKS.map((stock) => (
                    <div
                        key={stock.symbol}
                        onClick={() => onSelect(stock.symbol)}
                        style={{
                            padding: '10px',
                            borderRadius: '8px',
                            background: 'rgba(255,255,255,0.03)',
                            cursor: 'pointer',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                    >
                        <span style={{ fontWeight: '600' }}>{stock.symbol}</span>
                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{stock.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PopularStocks;
