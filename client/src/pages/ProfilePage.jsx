import { useContext, useEffect } from 'react';
import AuthContext from '../context/AuthContext';
import api from '../api/axios';
import Watchlist from '../components/Watchlist';
import DashboardHeader from '../components/DashboardHeader';
import PortfolioOverview from '../components/PortfolioOverview';
import TransactionHistory from '../components/TransactionHistory';
import { useNavigate } from 'react-router-dom';
import { useState, useCallback } from 'react';

const ProfilePage = () => {
    const { user, logout, watchlist, refreshWatchlist, setWatchlist } = useContext(AuthContext);
    const navigate = useNavigate();
    const [portfolio, setPortfolio] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [loadingPortfolio, setLoadingPortfolio] = useState(false);
    const [loadingHistory, setLoadingHistory] = useState(false);

    const fetchPortfolio = useCallback(async () => {
        setLoadingPortfolio(true);
        try {
            const { data } = await api.get('/portfolio');
            setPortfolio(data);
        } catch (err) {
            console.log('failed to load portfolio', err);
        } finally {
            setLoadingPortfolio(false);
        }
    }, []);

    const fetchHistory = useCallback(async () => {
        setLoadingHistory(true);
        try {
            const { data } = await api.get('/portfolio/transactions');
            setTransactions(data);
        } catch (err) {
            console.log('failed to load history', err);
        } finally {
            setLoadingHistory(false);
        }
    }, []);

    useEffect(() => {
        if (watchlist.length === 0) {
            refreshWatchlist();
        }
        fetchPortfolio();
        fetchHistory();
    }, [refreshWatchlist, fetchPortfolio, fetchHistory]);

    const deleteItem = async (id) => {
        try {
            await api.delete(`/watchlist/${id}`);
            // update global state
            const newList = watchlist.filter(item => item._id !== id);
            setWatchlist(newList);
        } catch (err) {
            console.log('error deleting item', err);
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
                            <div style={{ fontSize: '1.1rem' }}>
                                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Loading...'}
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{ marginBottom: '40px' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '20px' }}>Portfolio Summary</h2>
                    <PortfolioOverview 
                        portfolio={portfolio} 
                        loading={loadingPortfolio}
                        onSelect={(symbol) => navigate('/dashboard')} 
                    />
                </div>

                <div style={{ marginBottom: '40px' }}>
                    <TransactionHistory 
                        transactions={transactions} 
                        loading={loadingHistory} 
                    />
                </div>

                <h2 style={{ fontSize: '1.5rem', marginBottom: '20px' }}>My Watchlist</h2>
                <Watchlist
                    watchlist={watchlist}
                    onSelect={() => { }} // doing nothing here for now
                    onRemove={deleteItem}
                />
            </div>
        </div>
    );
};

export default ProfilePage;
