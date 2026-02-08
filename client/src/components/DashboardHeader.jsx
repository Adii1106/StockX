import { TrendingUp, Globe, LogOut } from 'lucide-react';

import { Link } from 'react-router-dom';

// Main header component for the dashboard
// handles currency switching and logout
function DashboardHeader({ user, logout, currency, setCurrency }) {
    return (
        <nav style={{
            height: '70px',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            padding: '0 24px',
            background: 'rgba(15, 23, 42, 0.8)',
            backdropFilter: 'blur(10px)',
            position: 'sticky',
            top: 0,
            zIndex: 50
        }}>
            <div style={{ flex: '0 0 auto', display: 'flex', alignItems: 'center', gap: '24px' }}>
                <Link to="/dashboard" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '32px', height: '32px', background: 'var(--accent-primary)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <TrendingUp size={20} color="white" />
                    </div>
                    <span style={{ fontSize: '1.25rem', fontWeight: '700', letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>StockX</span>
                </Link>

                <div style={{ display: 'flex', gap: '16px' }}>
                    <Link to="/dashboard" style={{ textDecoration: 'none', color: 'var(--text-secondary)', fontWeight: '500', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = 'var(--text-primary)'} onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}>
                        Dashboard
                    </Link>
                </div>
            </div>

            <div style={{ flex: 1 }}></div>

            <div style={{ flex: '0 0 auto', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '16px' }}>
                {/* Currency Selector */}
                {currency && setCurrency && (
                    <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-secondary)', padding: '6px 12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                        <Globe size={16} style={{ marginRight: '8px', color: 'var(--text-secondary)' }} />
                        <select
                            value={currency}
                            onChange={(e) => setCurrency(e.target.value)}
                            style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', outline: 'none', cursor: 'pointer', fontSize: '0.9rem', padding: 0 }}
                        >
                            <option value="USD">USD ($)</option>
                            <option value="INR">INR (₹)</option>
                            <option value="EUR">EUR (€)</option>
                            <option value="GBP">GBP (£)</option>
                            <option value="JPY">JPY (¥)</option>
                        </select>
                    </div>
                )}

                <button onClick={logout} className="btn btn-outline" style={{ fontSize: '0.85rem' }}>
                    Logout
                </button>

                <Link to="/profile" style={{ textDecoration: 'none' }}>
                    <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border-color)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: '600',
                        color: 'var(--text-primary)',
                        cursor: 'pointer',
                        transition: 'border-color 0.2s'
                    }}
                        onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--accent-primary)'}
                        onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}
                    >
                        {user ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                </Link>
            </div>
        </nav>
    );
};

export default DashboardHeader;
