import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const SignupPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { signup } = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const doSignup = async (e) => {
        e.preventDefault();

        // TODO: add stronger password checks later
        if (password.length < 6) {
            setError('Password too short (min 6 chars)');
            return;
        }

        try {
            await signup(name, email, password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Error signing up');
        }
    };

    return (
        <div className="auth-container card">
            <h2 style={{ marginBottom: '20px', textAlign: 'center' }}>Create Account</h2>
            {error && <div style={{ color: 'var(--danger)', marginBottom: '15px', textAlign: 'center' }}>{error}</div>}
            <form onSubmit={doSignup}>
                <div className="form-group">
                    <label>Full Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
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
                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Sign Up</button>
            </form>
            <p style={{ textAlign: 'center', marginTop: '20px', color: 'var(--text-secondary)' }}>
                Already have an account? <Link to="/login" style={{ color: 'var(--accent-primary)' }}>Login</Link>
            </p>
        </div>
    );
};

export default SignupPage;
