import { Trash2 } from 'lucide-react';

const Watchlist = ({ watchlist, onSelect, onRemove }) => {
    if (!watchlist || watchlist.length === 0) {
        return (
            <div className="card">
                <h3 style={{ marginBottom: '15px' }}>Your Watchlist</h3>
                <p style={{ color: 'var(--text-secondary)' }}>No stocks added yet.</p>
            </div>
        );
    }

    return (
        <div className="card">
            <h3 style={{ marginBottom: '15px' }}>Your Watchlist</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {watchlist.map((item) => (
                    <div
                        key={item._id}
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '10px',
                            borderRadius: '8px',
                            background: 'rgba(255,255,255,0.03)',
                        }}
                    >
                        <div
                            style={{ cursor: 'pointer', flex: 1 }}
                            onClick={() => onSelect(item.symbol)}
                        >
                            <span style={{ fontWeight: '600', display: 'block' }}>{item.symbol}</span>
                            <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{item.name || 'Stock'}</span>
                        </div>
                        <button
                            onClick={() => onRemove(item._id)}
                            style={{
                                background: 'transparent',
                                color: 'var(--text-secondary)',
                                padding: '5px'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--danger)'}
                            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Watchlist;
