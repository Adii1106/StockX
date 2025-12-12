import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            const message = err.response?.data?.message || 'Login failed. Please check your connection and credentials.';
            setError(message);
        }
    };

    return (
        <div className="auth-container card">
            <h2 style={{ marginBottom: '20px', textAlign: 'center' }}>Welcome Back</h2>
            {error && <div style={{ color: 'var(--danger)', marginBottom: '15px', textAlign: 'center' }}>{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Email Address</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Login</button>
            </form>
            <p style={{ textAlign: 'center', marginTop: '20px', color: 'var(--text-secondary)' }}>
                Don't have an account? <Link to="/signup" style={{ color: 'var(--accent-primary)' }}>Sign Up</Link>
            </p>
        </div>
    );
};

export default LoginPage;
