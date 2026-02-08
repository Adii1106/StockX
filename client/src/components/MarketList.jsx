import { useState } from 'react';

import { TrendingUp, TrendingDown } from 'lucide-react';
import './MarketList.css';

const MarketList = ({ title, stocks, onSelect, currencySymbol = '$', rate = 1, loading = false }) => {
    const [filter, setFilter] = useState('All');
    const tabs = ['All', 'Financial', 'Technology', 'Services'];

    let displayStocks = stocks;
    if (filter !== 'All') {
        displayStocks = stocks.filter(s => s.category === filter);
    }

    // format formatting helper
    const fmt = (v) => {
        if (!v) return '-';
        return (v * rate).toFixed(2);
    };

    return (
        <div className="card market-list-card">
            <div className="market-list-header">
                <h3 className="market-list-title">{title}</h3>
                <div className="market-list-tabs">
                    {tabs.map(tab => (
                        <button
                            key={tab}
                            onClick={() => setFilter(tab)}
                            className={`market-list-tab-btn ${filter === tab ? 'active' : ''}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>
            <div className="market-list-content">
                {loading ? (
                    <div className="market-list-loading">
                        <div className="market-list-spinner"></div>
                        <span className="market-list-loading-text">Loading market data...</span>
                    </div>
                ) : displayStocks.length === 0 ? (
                    <div className="market-list-empty">
                        No stocks found
                    </div>
                ) : (
                    displayStocks.map((stock) => {
                        const isPositive = stock.change >= 0;
                        return (
                            <div
                                key={stock.symbol}
                                onClick={() => onSelect(stock.symbol)}
                                className="market-list-item"
                            >
                                <div className="market-list-item-icon">
                                    <img
                                        src={`https://www.google.com/s2/favicons?domain=${stock.domain || stock.symbol.toLowerCase() + '.com'}&sz=128`}
                                        onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                                        alt={stock.symbol}
                                        className="market-list-item-img"
                                    />
                                    <div className="market-list-item-placeholder" style={{ display: 'none' }}>
                                        {stock.symbol.charAt(0)}
                                    </div>
                                </div>

                                <div className="market-list-item-info">
                                    <div className="market-list-item-symbol">{stock.symbol}</div>
                                    <div className="market-list-item-name">{stock.name}</div>
                                </div>

                                <div className="market-list-item-price-block">
                                    <div className="market-list-item-price">{currencySymbol}{fmt(stock.price)}</div>
                                    <div className={`market-list-item-change ${isPositive ? 'positive' : 'negative'}`}>
                                        {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                                        {isPositive ? '+' : ''}{stock.change.toFixed(2)}%
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
            <div className="market-list-footer">
                <button className="btn btn-outline market-list-view-all-btn">View All Market Data</button>
            </div>
        </div>
    );
};

export default MarketList;
