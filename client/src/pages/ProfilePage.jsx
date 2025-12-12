import { useContext, useEffect, useState } from 'react';
import AuthContext from '../context/AuthContext';
import api from '../api/axios';
import Watchlist from '../components/Watchlist';
import DashboardHeader from '../components/DashboardHeader';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
    const { user, logout } = useContext(AuthContext);
    const [watchlist, setWatchlist] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchWatchlist = async () => {
            try {
                const { data } = await api.get('/watchlist');
                setWatchlist(data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchWatchlist();
    }, []);

    const removeFromWatchlist = async (id) => {
        try {
            await api.delete(`/watchlist/${id}`);
            setWatchlist(watchlist.filter(item => item._id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div style={{ background: 'var(--bg-primary)', minHeight: '100vh' }}>
            <DashboardHeader
                user={user}
                logout={() => { logout(); navigate('/'); }}
            // No search or currency on profile page for now
            />
            <div className="container" style={{ marginTop: '40px', maxWidth: '800px' }}>
                <h1 style={{ marginBottom: '30px' }}>My Profile</h1>

                <div className="card" style={{ marginBottom: '30px' }}>
                    <h2 style={{ fontSize: '1.2rem', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>Account Details</h2>
                    <div style={{ display: 'grid', gap: '15px' }}>
                        <div>
                            <label>Full Name</label>
                            <div style={{ fontSize: '1.1rem' }}>{user?.name}</div>
                        </div>
                        <div>
                            <label>Email Address</label>
                            <div style={{ fontSize: '1.1rem' }}>{user?.email}</div>
                        </div>
                        <div>
                            <label>Member Since</label>
                            <div style={{ fontSize: '1.1rem' }}>{new Date(user?.createdAt).toLocaleDateString()}</div>
                        </div>
                    </div>
                </div>

                <h2 style={{ fontSize: '1.5rem', marginBottom: '20px' }}>My Watchlist</h2>
                <Watchlist
                    watchlist={watchlist}
                    onSelect={() => { }} // No-op on profile page or could redirect to dashboard
                    onRemove={removeFromWatchlist}
                />
            </div>
        </div>
    );
};

export default ProfilePage;
