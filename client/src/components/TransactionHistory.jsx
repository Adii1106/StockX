import React from 'react';
import { History, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

const TransactionHistory = ({ transactions, loading }) => {
  if (loading) return <div className="card">Loading history...</div>;
  if (!transactions || transactions.length === 0) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)' }}>
        No transactions yet.
      </div>
    );
  }

  return (
    <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
      <div style={{ padding: '20px', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <History size={20} color="var(--accent-primary)" />
        <h3 style={{ fontSize: '1.1rem' }}>Trade History</h3>
      </div>
      <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
        {transactions.map((t, i) => (
          <div key={i} style={{ 
            padding: '16px', 
            borderBottom: '1px solid var(--border-color)', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center' 
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ 
                padding: '8px', 
                borderRadius: '8px', 
                background: t.type === 'BUY' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)' 
              }}>
                {t.type === 'BUY' ? <ArrowDownLeft size={16} color="var(--success)" /> : <ArrowUpRight size={16} color="var(--danger)" />}
              </div>
              <div>
                <div style={{ fontWeight: 'bold' }}>{t.type} {t.symbol}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {new Date(t.createdAt).toLocaleDateString()} at {new Date(t.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: 'bold' }}>${t.totalAmount?.toLocaleString()}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t.shares} shares @ ${t.price?.toFixed(2)}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionHistory;
