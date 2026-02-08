import { Link, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const location = useLocation();

    // hide navbar on auth pages
    const isAuthPage = ['/login', '/signup'].includes(location.pathname);
    if (isAuthPage) return null;

    return (
        <nav>
            <Link to="/" className="logo">StockX</Link>
            <div className="nav-links">
                {user ? (
                    <>
                        <Link to="/dashboard" className="nav-link">Dashboard</Link>
                        <Link to="/profile" className="nav-link">Profile</Link>
                        <button onClick={logout} className="btn btn-outline" style={{ padding: '5px 15px', fontSize: '0.9rem' }}>Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="nav-link">Login</Link>
                        <Link to="/signup" className="btn btn-primary" style={{ padding: '8px 20px' }}>Sign Up</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
