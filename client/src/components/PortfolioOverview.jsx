import React from 'react';
import { Briefcase, TrendingUp, TrendingDown, PieChart } from 'lucide-react';

const PortfolioOverview = ({ portfolio, loading, onSelect }) => {
  if (loading) return <div className="card">Loading portfolio...</div>;
  if (!portfolio || !portfolio.holdings || portfolio.holdings.length === 0) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
        <PieChart size={48} color="var(--text-muted)" style={{ marginBottom: '16px', opacity: 0.5 }} />
        <h4 style={{ color: 'var(--text-secondary)' }}>No holdings yet</h4>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Buy some stocks to see your portfolio grow!</p>
      </div>
    );
  }

  const totalValue = portfolio.holdings.reduce((acc, h) => acc + (h.currentValue || 0), 0);
  const totalPL = portfolio.holdings.reduce((acc, h) => acc + (h.profitLoss || 0), 0);
  const isProfit = totalPL >= 0;

  return (
    <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
      <div style={{ padding: '20px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)' }}>
        <h3 style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Briefcase size={20} color="var(--accent-primary)" />
          Your Portfolio
        </h3>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Value</div>
          <div style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
        </div>
      </div>

      <div style={{ padding: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', borderBottom: '1px solid var(--border-color)' }}>
        <div style={{ padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Cash Balance</div>
            <div style={{ fontWeight: 'bold' }}>${portfolio.balance?.toLocaleString()}</div>
        </div>
        <div style={{ padding: '12px', background: isProfit ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', borderRadius: '12px' }}>
            <div style={{ fontSize: '0.7rem', color: isProfit ? 'var(--success)' : 'var(--danger)' }}>Total Profit/Loss</div>
            <div style={{ fontWeight: 'bold', color: isProfit ? 'var(--success)' : 'var(--danger)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                {isProfit ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                ${Math.abs(totalPL).toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>
        </div>
      </div>

      <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
        {portfolio.holdings.map((holding) => (
          <div 
            key={holding.symbol}
            onClick={() => onSelect(holding.symbol)}
            className="portfolio-item"
            style={{ 
              padding: '16px', 
              borderBottom: '1px solid var(--border-color)', 
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              transition: '0.2s'
            }}
          >
            <div>
              <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{holding.symbol}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{holding.shares} shares @ ${holding.averagePrice?.toFixed(2)}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>${holding.currentValue?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
              <div style={{ fontSize: '0.75rem', color: holding.profitLoss >= 0 ? 'var(--success)' : 'var(--danger)' }}>
                {holding.profitLoss >= 0 ? '+' : ''}{holding.profitLossPercentage?.toFixed(2)}%
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <style>{`
        .portfolio-item:hover {
          background: rgba(255,255,255,0.05);
        }
      `}</style>
    </div>
  );
};

export default PortfolioOverview;
