import { Trash2 } from 'lucide-react';

const Watchlist = ({ watchlist, onSelect, onRemove }) => {
    // if nothing there, show empty state
    if (!watchlist || watchlist.length === 0) {
        return (
            <div style={{ padding: '20px', color: 'var(--text-secondary)', textAlign: 'center' }}>
                No stocks added yet.
            </div>
        );
    }

    return (
        <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {watchlist.map((item) => (
                    <div
                        key={item._id}
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '12px',
                            borderRadius: '8px',
                            background: 'var(--bg-primary)',
                            border: '1px solid var(--border-color)',
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = 'var(--text-muted)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = 'var(--border-color)';
                        }}
                    >
                        <div
                            style={{ cursor: 'pointer', flex: 1 }}
                            onClick={() => onSelect(item.symbol)}
                        >
                            <span style={{ fontWeight: '600', display: 'block', color: 'var(--text-primary)' }}>{item.symbol}</span>
                            <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{item.name || 'Stock'}</span>
                        </div>
                        <button
                            onClick={() => onRemove(item._id)}
                            style={{
                                background: 'transparent',
                                color: 'var(--text-secondary)',
                                padding: '8px',
                                border: 'none',
                                cursor: 'pointer',
                                borderRadius: '4px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.color = 'var(--danger)';
                                e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.color = 'var(--text-secondary)';
                                e.currentTarget.style.background = 'transparent';
                            }}
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
