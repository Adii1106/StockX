import { createContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [watchlist, setWatchlist] = useState([]); // global watchlist state

    // fetch watchlist from server
    const refreshWatchlist = async () => {
        try {
            const { data } = await api.get('/watchlist');
            setWatchlist(data);
        } catch (err) {
            console.log('failed to load watchlist context', err);
        }
    };

    useEffect(() => {
        const checkUserLoggedIn = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const { data } = await api.get('/auth/me');
                    setUser(data);
                    // also get watchlist if they have a token
                    refreshWatchlist();
                } catch (error) {
                    console.error("Auth check failed:", error);
                    localStorage.removeItem('token');
                }
            }
            setLoading(false);
        };

        checkUserLoggedIn();
    }, []);

    const handleLogin = async (e, p) => {
        // just post data and let the component catch any errors
        const res = await api.post('/auth/login', { email: e, password: p });

        localStorage.setItem('token', res.data.token);
        setUser(res.data);
        // refresh list after login
        refreshWatchlist();
    };

    const signup = async (name, email, password) => {
        const { data } = await api.post('/auth/signup', { name, email, password });
        localStorage.setItem('token', data.token);
        setUser(data);
        refreshWatchlist();
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        setWatchlist([]); // clear it
    };

    return (
        <AuthContext.Provider value={{
            user,
            login: handleLogin,
            signup,
            logout,
            loading,
            watchlist,      // added
            setWatchlist,   // added
            refreshWatchlist // helper
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
