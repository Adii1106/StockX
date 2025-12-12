import { useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import AuthContext from '../context/AuthContext';
import SearchBar from '../components/SearchBar';
import StockCard from '../components/StockCard';
import PriceChart from '../components/PriceChart';
import MarketList from '../components/MarketList'; // Replaces PopularStocks
import Watchlist from '../components/Watchlist';
import DashboardHeader from '../components/DashboardHeader';
import { TrendingUp, Newspaper, Globe, LogOut, TrendingDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DashboardPage = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [currentSymbol, setCurrentSymbol] = useState('');
    const [stockData, setStockData] = useState(null);
    const [chartData, setChartData] = useState([]);
    const [watchlist, setWatchlist] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Phase 1.5 & 3 State
    const [news, setNews] = useState([]);
    const [generalNews, setGeneralNews] = useState([]);
    const [currency, setCurrency] = useState('USD');
    const [rates, setRates] = useState({ USD: 1 });
    const [loadingNews, setLoadingNews] = useState(false);

    // Mock Data for "Market Movers" with Categories and Domains
    const marketMovers = [
        // Technology
        { symbol: 'AAPL', name: 'Apple Inc.', price: 195.40, change: 1.25, category: 'Technology', domain: 'apple.com' },
        { symbol: 'NVDA', name: 'NVIDIA Corp', price: 824.50, change: 3.40, category: 'Technology', domain: 'nvidia.com' },
        { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 173.80, change: -0.45, category: 'Technology', domain: 'google.com' },
        { symbol: 'MSFT', name: 'Microsoft Corp', price: 425.00, change: 0.60, category: 'Technology', domain: 'microsoft.com' },

        // Financial
        { symbol: 'JPM', name: 'JPMorgan Chase', price: 198.50, change: 0.85, category: 'Financial', domain: 'jpmorganchase.com' },
        { symbol: 'BAC', name: 'Bank of America', price: 39.40, change: 0.30, category: 'Financial', domain: 'bankofamerica.com' },
        { symbol: 'V', name: 'Visa Inc.', price: 275.20, change: -0.15, category: 'Financial', domain: 'visa.com' },
        { symbol: 'MA', name: 'Mastercard', price: 450.10, change: 1.10, category: 'Financial', domain: 'mastercard.com' },

        // Services
        { symbol: 'AMZN', name: 'Amazon.com', price: 182.10, change: 0.85, category: 'Services', domain: 'amazon.com' },
        { symbol: 'DIS', name: 'Walt Disney Co', price: 105.60, change: -1.20, category: 'Services', domain: 'thewaltdisneycompany.com' }, // explicit domain for better logo
        { symbol: 'NFLX', name: 'Netflix Inc.', price: 620.00, change: 2.50, category: 'Services', domain: 'netflix.com' },
        { symbol: 'MCD', name: 'McDonald\'s', price: 265.40, change: 0.45, category: 'Services', domain: 'mcdonalds.com' },
    ];

    useEffect(() => {
        fetchWatchlist();
        fetchRates();
        fetchGeneralNews();
    }, []);

    useEffect(() => {
        if (currentSymbol) {
            fetchStockData(currentSymbol);
            fetchNews(currentSymbol);
        }
    }, [currentSymbol]);

    const fetchRates = async () => {
        try {
            const { data } = await api.get('/stocks/rates');
            setRates(data);
        } catch (error) {
            console.error('Error fetching rates', error);
        }
    };

    const fetchGeneralNews = async () => {
        try {
            const { data } = await api.get('/stocks/news/general');
            setGeneralNews(data);
        } catch (error) {
            console.error('Error fetching general news', error);
        }
    };

    const fetchWatchlist = async () => {
        try {
            const { data } = await api.get('/watchlist');
            setWatchlist(data);
        } catch (err) {
            console.error('Error fetching watchlist', err);
        }
    };

    const fetchStockData = async (symbol) => {
        setLoading(true);
        setError(null);
        try {
            const quoteRes = await api.get(`/stocks/quote/${symbol}`);
            const historyRes = await api.get(`/stocks/history/${symbol}`);

            setStockData(quoteRes.data);
            setChartData(historyRes.data);
        } catch (err) {
            console.error(err);
            setError('Could not fetch stock data. Please try again.');
            setStockData(null);
            setChartData([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchNews = async (symbol) => {
        setLoadingNews(true);
        try {
            const { data } = await api.get(`/stocks/news/${symbol}`);
            setNews(data);
        } catch (error) {
            console.error('Error fetching news', error);
        } finally {
            setLoadingNews(false);
        }
    };

    const handleSearch = (symbol) => {
        setCurrentSymbol(symbol);
    };

    const addToWatchlist = async () => {
        if (!stockData) return;
        try {
            const { data } = await api.post('/watchlist', {
                symbol: stockData.symbol,
                name: stockData.name,
            });
            setWatchlist([data, ...watchlist]);
        } catch (err) {
            console.error(err);
        }
    };

    const removeFromWatchlist = async (id) => {
        try {
            await api.delete(`/watchlist/${id}`);
            setWatchlist(watchlist.filter(item => item._id !== id));
        } catch (err) {
            console.error(err);
        }
    };



    const isWatchlisted = stockData && watchlist.some(item => item.symbol === stockData.symbol);

    // Currency Helper
    const getConvertedPrice = (price) => {
        if (!price) return 0;
        return price * (rates[currency] || 1);
    };

    const getCurrencySymbol = () => {
        switch (currency) {
            case 'INR': return '₹';
            case 'EUR': return '€';
            case 'GBP': return '£';
            case 'JPY': return '¥';
            default: return '$';
        }
    };

    const rate = rates[currency] || 1;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg-primary)' }}>

            <DashboardHeader
                user={user}
                logout={() => { logout(); navigate('/'); }}
                currency={currency}
                setCurrency={setCurrency}
            />

            {/* Main Content Area */}
            <main className="container" style={{ paddingTop: '30px', paddingBottom: '60px', flex: 1 }}>

                {/* Search Hero Section */}
                <div style={{ marginBottom: '40px', maxWidth: '600px', margin: '0 auto 40px auto' }}>
                    <h1 style={{ textAlign: 'center', marginBottom: '24px', fontSize: '2rem' }}>
                        Search the Market
                    </h1>
                    <SearchBar onSearch={handleSearch} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 350px', gap: '30px', alignItems: 'start' }}>

                    {/* Left Column: Charts & Data */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

                        {error && <div className="card" style={{ color: 'var(--danger)', background: 'rgba(239, 68, 68, 0.1)', borderColor: 'rgba(239, 68, 68, 0.2)' }}>{error}</div>}

                        {loading ? (
                            <div className="card" style={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                                    <div className="spinner" style={{ width: '24px', height: '24px', border: '2px solid var(--accent-primary)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                                    <span style={{ color: 'var(--text-secondary)' }}>Loading market data...</span>
                                </div>
                            </div>
                        ) : stockData ? (
                            <>
                                <StockCard
                                    stock={stockData}
                                    onAddToWatchlist={addToWatchlist}
                                    isWatchlisted={isWatchlisted}
                                    currencySymbol={getCurrencySymbol()}
                                    convertedPrice={getConvertedPrice(stockData.price)}
                                    rate={rate}
                                />

                                <PriceChart
                                    data={chartData}
                                    currencySymbol={getCurrencySymbol()}
                                    rate={rate}
                                />

                                {/* Specific Stock News */}
                                <div style={{ marginTop: '20px' }}>
                                    <h3 style={{ fontSize: '1.5rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <Newspaper size={24} color="var(--accent-primary)" />
                                        Latest on {stockData.symbol}
                                    </h3>
                                    {/* News Grid (Reusable) */}
                                    <NewsGrid news={news} loading={loadingNews} />
                                </div>
                            </>
                        ) : (
                            <div className="card" style={{ padding: '80px 20px', textAlign: 'center', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(59, 130, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                                    <TrendingUp size={40} color="var(--accent-primary)" />
                                </div>
                                <h3 style={{ color: 'var(--text-primary)', fontSize: '1.5rem', marginBottom: '12px' }}>Market Snapshot</h3>
                                <p style={{ maxWidth: '400px', lineHeight: '1.6', marginBottom: '30px' }}>
                                    Use the search bar above to dive deep into any company.
                                </p>

                                {/* General Market News (Displayed when no stock selected) */}
                                <div style={{ width: '100%', textAlign: 'left' }}>
                                    <h3 style={{ fontSize: '1.25rem', marginBottom: '16px', color: 'var(--text-primary)' }}>Global Market Headlines</h3>
                                    <NewsGrid news={generalNews} loading={!generalNews.length} limit={6} />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Sidebar */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

                        {/* Watchlist Section */}
                        <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
                            <div style={{ padding: '20px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h3 style={{ fontSize: '1.1rem' }}>Your Watchlist</h3>
                                <LogOut size={16} style={{ opacity: 0 }} /> {/* Spacer */}
                            </div>
                            <Watchlist
                                watchlist={watchlist}
                                onSelect={handleSearch}
                                onRemove={removeFromWatchlist}
                            />
                        </div>

                        {/* Market Movers (New) */}
                        <MarketList
                            title="Market Movers"
                            stocks={marketMovers}
                            onSelect={handleSearch}
                            currencySymbol={getCurrencySymbol()}
                            rate={rate}
                        />
                    </div>

                </div>
            </main>

            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

// Helper Component for News Grid
const NewsGrid = ({ news, loading, limit }) => {
    if (loading) return <div style={{ padding: '20px', color: 'var(--text-secondary)' }}>Loading news...</div>;
    if (!news || news.length === 0) return <div className="card" style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>No news found.</div>;

    const displayNews = limit ? news.slice(0, limit) : news;

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
            {displayNews.map((item, index) => (
                <a
                    key={index}
                    href={item.link}
                    target="_blank"
                    rel="noreferrer"
                    className="card"
                    style={{
                        textDecoration: 'none',
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100%',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        padding: '0',
                        overflow: 'hidden'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-4px)';
                        e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                    }}
                >
                    {item.thumbnail && item.thumbnail.resolutions && item.thumbnail.resolutions.length > 0 ? (
                        <div style={{ height: '140px', background: '#000' }}>
                            <img
                                src={item.thumbnail.resolutions[0].url}
                                alt="News thumbnail"
                                style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.9 }}
                            />
                        </div>
                    ) : (
                        <div style={{ height: '140px', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Newspaper size={32} color="var(--text-muted)" />
                        </div>
                    )}
                    <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', textTransform: 'uppercase', fontWeight: '600', marginBottom: '8px' }}>
                            {item.publisher}
                        </div>
                        <h4 style={{ color: 'var(--text-primary)', marginBottom: '12px', fontSize: '1rem', lineHeight: '1.4' }}>
                            {item.title}
                        </h4>
                        <div style={{ marginTop: 'auto', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                            {(() => {
                                try {
                                    if (!item.providerPublishTime) return 'Just now';
                                    const date = new Date(item.providerPublishTime);
                                    // If it's a valid date object or ISO string, use it. 
                                    // If it's a Unix timestamp (seconds), the Date(number) constructor expects millis.
                                    if (!isNaN(date.getTime()) && date.getFullYear() > 1971) {
                                        return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
                                    }
                                    // Try assuming seconds
                                    const dateFromSeconds = new Date(item.providerPublishTime * 1000);
                                    if (!isNaN(dateFromSeconds.getTime())) {
                                        return dateFromSeconds.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
                                    }
                                    return 'Recent';
                                } catch (e) {
                                    return(e,'Recent');
                                }
                            })()}
                        </div>
                    </div>
                </a>
            ))}
        </div>
    );
};

export default DashboardPage;
