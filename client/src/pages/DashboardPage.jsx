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
import './DashboardPage.css';

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

    // Market Movers State
    const [marketMovers, setMarketMovers] = useState([]);
    const [loadingMarketMovers, setLoadingMarketMovers] = useState(false);

    // Static data for now... need to move to DB later
    const MOVERS_DATA = [
        // Tech stocks
        { symbol: 'AAPL', category: 'Technology', domain: 'apple.com' },
        { symbol: 'NVDA', category: 'Technology', domain: 'nvidia.com' },
        { symbol: 'GOOGL', category: 'Technology', domain: 'google.com' },
        { symbol: 'MSFT', category: 'Technology', domain: 'microsoft.com' },

        // Bank stuff
        { symbol: 'JPM', category: 'Financial', domain: 'jpmorganchase.com' },
        { symbol: 'BAC', category: 'Financial', domain: 'bankofamerica.com' },
        { symbol: 'V', category: 'Financial', domain: 'visa.com' },
        { symbol: 'MA', category: 'Financial', domain: 'mastercard.com' },

        // Others
        { symbol: 'AMZN', category: 'Services', domain: 'amazon.com' },
        { symbol: 'DIS', category: 'Services', domain: 'thewaltdisneycompany.com' },
        { symbol: 'NFLX', category: 'Services', domain: 'netflix.com' },
        { symbol: 'MCD', category: 'Services', domain: 'mcdonalds.com' },
    ];

    useEffect(() => {
        // load everything on start
        const loadAll = async () => {
            fetchWatchlist();
            fetchRates();
            fetchGeneralNews();
            fetchMarketMovers();
        };

        loadAll();
    }, []);

    useEffect(() => {
        if (currentSymbol) {
            fetchStockData(currentSymbol);
            fetchNews(currentSymbol);
        }
    }, [currentSymbol]);

    const fetchMarketMovers = async () => {
        setLoadingMarketMovers(true);
        try {
            // join symbols with comma
            const symbols = MOVERS_DATA.map(s => s.symbol).join(',');

            const response = await api.get(`/stocks/batch?symbols=${symbols}`);
            const data = response.data;

            // combine api data with our static list
            const finalData = data.map(stock => {
                const meta = MOVERS_DATA.find(m => m.symbol === stock.symbol);
                return {
                    ...stock,
                    category: meta?.category || 'Other',
                    domain: meta?.domain || stock.symbol.toLowerCase() + '.com',
                };
            });

            setMarketMovers(finalData);
        } catch (err) {
            console.log('failed to get movers', err);
        } finally {
            setLoadingMarketMovers(false);
        }
    };

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
            // get quote and history in parallel? nah just await both
            const q = await api.get(`/stocks/quote/${symbol}`);
            const h = await api.get(`/stocks/history/${symbol}`);

            setStockData(q.data);
            setChartData(h.data);

        } catch (err) {
            console.log(err);
            setError('Could not fetch stock data... try again later');
            setStockData(null);
            setChartData([]);
        }
        setLoading(false);
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



    const isWatchlisted = stockData && watchlist.some(w => w.symbol === stockData.symbol);

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

                <div className="dashboard-layout">

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
                            <div className="card market-snapshot-card">
                                <div className="market-snapshot-icon-wrapper">
                                    <TrendingUp size={40} color="var(--accent-primary)" />
                                </div>
                                <h3 className="market-snapshot-title">Market Snapshot</h3>
                                <p className="market-snapshot-desc">
                                    Use the search bar above to dive deep into any company.
                                </p>

                                {/* General Market News (Displayed when no stock selected) */}
                                <div className="global-headlines-section">
                                    <h3 className="global-headlines-title">Global Market Headlines</h3>
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
                            loading={loadingMarketMovers}
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
                                    return (e, 'Recent');
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
