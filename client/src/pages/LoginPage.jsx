import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const doLogin = async (e) => {
        e.preventDefault(); // stop reload

        try {
            await login(email, password);
            // go to dashboard if works
            navigate('/dashboard');
        } catch (err) {
            console.log(err);
            const msg = err.response?.data?.message || 'Login failed... try again?';
            setError(msg);
        }
    };

    return (
        <div className="auth-container card">
            <h2 style={{ marginBottom: '20px', textAlign: 'center' }}>Welcome Back</h2>
            {error && <div style={{ color: 'var(--danger)', marginBottom: '15px', textAlign: 'center' }}>{error}</div>}
            <form onSubmit={doLogin}>
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
