import { Plus, Check, TrendingUp, TrendingDown } from 'lucide-react';

const StockCard = ({ stock, onAddToWatchlist, isWatchlisted, currencySymbol = '$', convertedPrice, rate = 1 }) => {
    const isPositive = stock.change >= 0;
    const priceDisplay = convertedPrice ? convertedPrice.toFixed(2) : stock.price.toFixed(2);

    // Helper to format currency
    const fmt = (val) => {
        if (val === undefined || val === null) return '-';
        return (val * rate).toFixed(2);
    };

    // Helper for large numbers (Market Cap, Vol) - no currency conversion usually for volume, but Market Cap yes
    const fmtLarge = (val, isCurrency = false) => {
        if (!val) return '-';
        let num = val;
        if (isCurrency) num = val * rate;

        if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
        if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
        if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
        return num.toLocaleString();
    };

    const getDomain = (symbol) => {
        const map = {
            'AAPL': 'apple.com', 'MSFT': 'microsoft.com', 'GOOGL': 'google.com', 'GOOG': 'google.com',
            'AMZN': 'amazon.com', 'TSLA': 'tesla.com', 'NVDA': 'nvidia.com', 'META': 'meta.com',
            'NFLX': 'netflix.com', 'JPM': 'jpmorganchase.com', 'BAC': 'bankofamerica.com',
            'V': 'visa.com', 'MA': 'mastercard.com', 'DIS': 'disney.com', 'MCD': 'mcdonalds.com',
            'CSCO': 'cisco.com', 'INTC': 'intel.com', 'AMD': 'amd.com', 'WMT': 'walmart.com',
            'TGT': 'target.com', 'KO': 'coca-colacompany.com', 'PEP': 'pepsico.com'
        };
        // Clean symbol (remove .NS, .BO etc if needed, though usually main part is enough)
        const cleanSym = symbol.split('.')[0].toUpperCase();
        return map[cleanSym] || `${cleanSym.toLowerCase()}.com`;
    };

    return (
        <div className="card">
            {/* Header Section */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                    <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '50%',
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border-color)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden',
                        flexShrink: 0
                    }}>
                        <img
                            src={`https://www.google.com/s2/favicons?domain=${getDomain(stock.symbol)}&sz=128`}
                            onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                            alt={stock.symbol}
                            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                        />
                        <div style={{ display: 'none', width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: 'var(--text-secondary)' }}>
                            {stock.symbol.charAt(0)}
                        </div>
                    </div>
                    <div>
                        <h2 style={{ fontSize: '2.5rem', fontWeight: '700', lineHeight: '1.1' }}>{stock.symbol}</h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.25rem', marginTop: '4px' }}>{stock.name}</p>
                        <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                            <span style={{ padding: '4px 8px', borderRadius: '4px', background: 'rgba(255,255,255,0.05)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                Stock
                            </span>
                            {stock.marketCap && (
                                <span style={{ padding: '4px 8px', borderRadius: '4px', background: 'rgba(255,255,255,0.05)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                    Cap: {currencySymbol}{fmtLarge(stock.marketCap, true)}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '3.5rem', fontWeight: '700', lineHeight: '1', letterSpacing: '-0.02em' }}>
                        {currencySymbol}{priceDisplay}
                    </div>
                    <div style={{
                        color: isPositive ? 'var(--success)' : 'var(--danger)',
                        fontSize: '1.25rem',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        gap: '6px',
                        marginTop: '8px'
                    }}>
                        {isPositive ? <TrendingUp size={24} /> : <TrendingDown size={24} />}
                        {isPositive ? '+' : ''}{stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
                    </div>
                </div>
            </div>

            {/* Data Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                gap: '16px',
                background: 'var(--bg-secondary)',
                padding: '20px',
                borderRadius: '8px',
                border: '1px solid var(--border-color)'
            }}>
                <div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '4px' }}>Open</div>
                    <div style={{ fontWeight: '600', fontSize: '1.1rem' }}>{currencySymbol}{fmt(stock.open)}</div>
                </div>
                <div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '4px' }}>High</div>
                    <div style={{ fontWeight: '600', fontSize: '1.1rem' }}>{currencySymbol}{fmt(stock.high)}</div>
                </div>
                <div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '4px' }}>Low</div>
                    <div style={{ fontWeight: '600', fontSize: '1.1rem' }}>{currencySymbol}{fmt(stock.low)}</div>
                </div>
                <div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '4px' }}>Prev Close</div>
                    <div style={{ fontWeight: '600', fontSize: '1.1rem' }}>{currencySymbol}{fmt(stock.prevClose)}</div>
                </div>
                <div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '4px' }}>Volume</div>
                    <div style={{ fontWeight: '600', fontSize: '1.1rem' }}>{fmtLarge(stock.volume)}</div>
                </div>
            </div>

            <div style={{ marginTop: '24px' }}>
                <button
                    onClick={onAddToWatchlist}
                    className="btn"
                    disabled={isWatchlisted}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        width: '100%',
                        justifyContent: 'center',
                        padding: '12px',
                        background: isWatchlisted ? 'transparent' : 'var(--accent-primary)',
                        border: isWatchlisted ? '1px solid var(--border-color)' : 'none',
                        color: isWatchlisted ? 'var(--text-muted)' : 'white'
                    }}
                >
                    {isWatchlisted ? 'In Watchlist' : 'Add to Watchlist'}
                    {isWatchlisted ? <Check size={18} /> : <Plus size={18} />}
                </button>
            </div>
        </div>
    );
};

export default StockCard;
