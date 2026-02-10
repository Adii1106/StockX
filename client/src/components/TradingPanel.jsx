import React, { useState } from 'react';
import { ShoppingCart, TrendingUp, DollarSign } from 'lucide-react';

const TradingPanel = ({ stock, balance, onTrade, loading }) => {
  const [shares, setShares] = useState(1);
  const [type, setType] = useState('BUY');

  const total = (stock.price * shares).toFixed(2);
  const canAfford = type === 'BUY' ? balance >= total : true;

  return (
    <div className="card" style={{ 
      background: 'rgba(255, 255, 255, 0.03)', 
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      padding: '24px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShoppingCart size={20} color="var(--accent-primary)" />
          Trade {stock.symbol}
        </h3>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          Buying Power: <span style={{ color: 'var(--text-primary)', fontWeight: 'bold' }}>${balance?.toLocaleString()}</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button 
          onClick={() => setType('BUY')}
          style={{ 
            flex: 1, 
            padding: '10px', 
            borderRadius: '8px', 
            border: 'none',
            cursor: 'pointer',
            background: type === 'BUY' ? 'var(--success)' : 'rgba(255,255,255,0.05)',
            color: 'white',
            fontWeight: 'bold',
            transition: '0.2s'
          }}
        >
          Buy
        </button>
        <button 
          onClick={() => setType('SELL')}
          style={{ 
            flex: 1, 
            padding: '10px', 
            borderRadius: '8px', 
            border: 'none',
            cursor: 'pointer',
            background: type === 'SELL' ? 'var(--danger)' : 'rgba(255,255,255,0.05)',
            color: 'white',
            fontWeight: 'bold',
            transition: '0.2s'
          }}
        >
          Sell
        </button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>Shares</label>
        <input 
          type="number" 
          value={shares}
          onChange={(e) => setShares(Math.max(1, parseInt(e.target.value) || 0))}
          style={{ 
            width: '100%', 
            padding: '12px', 
            background: 'rgba(0,0,0,0.2)', 
            border: '1px solid rgba(255,255,255,0.1)', 
            borderRadius: '8px',
            color: 'white',
            fontSize: '1rem'
          }}
        />
      </div>

      <div style={{ padding: '16px', background: 'rgba(0,0,0,0.1)', borderRadius: '8px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
          <span style={{ color: 'var(--text-secondary)' }}>Market Price</span>
          <span>${stock.price.toLocaleString()}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
          <span style={{ color: 'var(--text-secondary)' }}>Estimated Total</span>
          <span style={{ color: !canAfford && type === 'BUY' ? 'var(--danger)' : 'white' }}>${total.toLocaleString()}</span>
        </div>
      </div>

      <button 
        disabled={loading || (!canAfford && type === 'BUY')}
        onClick={() => onTrade(type, shares)}
        style={{ 
          width: '100%', 
          padding: '14px', 
          borderRadius: '8px', 
          border: 'none',
          cursor: (loading || (!canAfford && type === 'BUY')) ? 'not-allowed' : 'pointer',
          background: type === 'BUY' ? 'var(--success)' : 'var(--danger)',
          color: 'white',
          fontWeight: 'bold',
          fontSize: '1rem',
          opacity: (loading || (!canAfford && type === 'BUY')) ? 0.5 : 1
        }}
      >
        {loading ? 'Processing...' : `${type === 'BUY' ? 'Buy' : 'Sell'} ${stock.symbol}`}
      </button>
      
      {!canAfford && type === 'BUY' && (
        <p style={{ color: 'var(--danger)', fontSize: '0.75rem', marginTop: '10px', textAlign: 'center' }}>
          Insufficient funds to complete this trade.
        </p>
      )}
    </div>
  );
};

export default TradingPanel;
