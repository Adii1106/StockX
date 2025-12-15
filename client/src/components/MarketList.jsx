import { useState } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const MarketList = ({ title, stocks, onSelect, currencySymbol = '$', rate = 1, loading = false }) => {
    const [filter, setFilter] = useState('All');
    const tabs = ['All', 'Financial', 'Technology', 'Services'];

    const filteredStocks = filter === 'All'
        ? stocks
        : stocks.filter(s => s.category === filter);

    // Helper to format currency
    const fmt = (val) => {
        if (!val) return '-';
        return (val * rate).toFixed(2);
    };

    return (
        <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
            <div style={{ padding: '20px 20px 0 20px', borderBottom: '1px solid var(--border-color)' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '16px' }}>{title}</h3>
                <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '16px', scrollbarWidth: 'none' }}>
                    {tabs.map(tab => (
                        <button
                            key={tab}
                            onClick={() => setFilter(tab)}
                            style={{
                                background: filter === tab ? 'var(--accent-primary)' : 'rgba(255,255,255,0.05)',
                                color: filter === tab ? '#fff' : 'var(--text-secondary)',
                                border: 'none',
                                padding: '6px 12px',
                                borderRadius: '20px',
                                fontSize: '0.8rem',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                whiteSpace: 'nowrap'
                            }}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>
            <div>
                {loading ? (
                    <div style={{ padding: '40px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '24px', height: '24px', border: '2px solid var(--accent-primary)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Loading market data...</span>
                    </div>
                ) : filteredStocks.length === 0 ? (
                    <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                        No stocks found
                    </div>
                ) : (
                    filteredStocks.map((stock) => {
                        const isPositive = stock.change >= 0;
                        return (
                            <div
                                key={stock.symbol}
                                onClick={() => onSelect(stock.symbol)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    padding: '16px 20px',
                                    borderBottom: '1px solid var(--border-color)',
                                    cursor: 'pointer',
                                    transition: 'background-color 0.2s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--card-hover)'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                            >
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '50%',
                                    background: 'var(--bg-secondary)',
                                    border: '1px solid var(--border-color)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    overflow: 'hidden',
                                    flexShrink: 0,
                                    marginRight: '16px'
                                }}>
                                    <img
                                        src={`https://www.google.com/s2/favicons?domain=${stock.domain || stock.symbol.toLowerCase() + '.com'}&sz=128`}
                                        onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                                        alt={stock.symbol}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                    <div style={{ display: 'none', width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                        {stock.symbol.charAt(0)}
                                    </div>
                                </div>

                                <div style={{ flex: 1, overflow: 'hidden' }}>
                                    <div style={{ fontWeight: '600', fontSize: '1rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{stock.symbol}</div>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{stock.name}</div>
                                </div>

                                <div style={{ textAlign: 'right', marginLeft: '12px' }}>
                                    <div style={{ fontWeight: '600', fontSize: '1rem' }}>{currencySymbol}{fmt(stock.price)}</div>
                                    <div style={{
                                        fontSize: '0.85rem',
                                        color: isPositive ? 'var(--success)' : 'var(--danger)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'flex-end',
                                        gap: '4px'
                                    }}>
                                        {isPositive ? '+' : ''}{stock.change.toFixed(2)}%
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
            <div style={{ padding: '16px', textAlign: 'center' }}>
                <button className="btn btn-outline" style={{ width: '100%', fontSize: '0.9rem' }}>View All Market Data</button>
            </div>
        </div>
    );
};

export default MarketList;
