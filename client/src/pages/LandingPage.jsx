import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const LandingPage = () => {
    return (
        <div>
            <Navbar />
            {/* HERO SECTION */}
            <div style={{
                minHeight: 'calc(100vh - 70px)', // account for navbar
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                padding: '20px'
            }}>
                <h1 style={{ fontSize: '3.5rem', marginBottom: '20px', lineHeight: 1.2 }}>
                    Analyze Stocks.<br />
                    <span style={{ color: 'var(--accent-primary)' }}>Make Smarter Decisions.</span>
                </h1>
                <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', maxWidth: '600px', marginBottom: '40px' }}>
                    Real-time market data, custom watchlists, and strategy testing tools—all in one modern dashboard.
                </p>
                <div style={{ display: 'flex', gap: '20px' }}>
                    <Link to="/signup" className="btn btn-primary" style={{ fontSize: '1.1rem', padding: '12px 30px' }}>Get Started Free</Link>
                    <Link to="/login" className="btn btn-outline" style={{ fontSize: '1.1rem', padding: '12px 30px' }}>Login</Link>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
