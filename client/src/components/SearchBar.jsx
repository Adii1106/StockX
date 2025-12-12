import { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import api from '../api/axios';

const SearchBar = ({ onSearch }) => {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const wrapperRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const fetchSuggestions = async () => {
            if (query.length < 2) {
                setSuggestions([]);
                return;
            }
            try {
                const { data } = await api.get(`/stocks/search?query=${query}`);
                setSuggestions(data);
                setShowSuggestions(true);
            } catch (error) {
                console.error('Error fetching suggestions', error);
            }
        };

        const timeoutId = setTimeout(fetchSuggestions, 300); // 300ms debounce
        return () => clearTimeout(timeoutId);
    }, [query]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (query.trim()) {
            onSearch(query.toUpperCase().trim());
            setShowSuggestions(false);
            // Don't clear query immediately so user sees what they typed
        }
    };

    const handleSuggestionClick = (symbol) => {
        setQuery(symbol);
        onSearch(symbol);
        setShowSuggestions(false);
    };

    return (
        <div ref={wrapperRef} style={{ position: 'relative', width: '100%', maxWidth: '600px' }}>
            <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                <div style={{ position: 'relative' }}>
                    <input
                        type="text"
                        placeholder="Search for a stock symbol or company..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onFocus={() => query.length >= 2 && setShowSuggestions(true)}
                        style={{
                            paddingLeft: '44px',
                            width: '100%',
                            height: '48px',
                            background: 'var(--bg-secondary)',
                            border: '1px solid var(--border-color)',
                            color: 'var(--text-primary)',
                            borderRadius: '8px',
                            fontSize: '1rem',
                            boxShadow: 'var(--shadow-sm)'
                        }}
                    />
                    <Search
                        size={20}
                        color="var(--text-muted)"
                        style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }}
                    />
                </div>
            </form>

            {showSuggestions && suggestions.length > 0 && (
                <div style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    left: 0,
                    right: 0,
                    backgroundColor: 'var(--card-bg)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    zIndex: 100, /* Fixed z-index overlap */
                    maxHeight: '320px',
                    overflowY: 'auto',
                    boxShadow: 'var(--shadow-lg)'
                }}>
                    <div style={{ padding: '8px 0' }}>
                        {suggestions.map((item) => (
                            <div
                                key={item.symbol}
                                onClick={() => handleSuggestionClick(item.symbol)}
                                style={{
                                    padding: '12px 16px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    borderBottom: '1px solid rgba(255,255,255,0.02)',
                                    transition: 'background-color 0.15s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--card-hover)'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                            >
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{item.symbol}</span>
                                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{item.name}</span>
                                </div>
                                <span style={{
                                    fontSize: '0.75rem',
                                    color: 'var(--text-muted)',
                                    backgroundColor: 'rgba(255,255,255,0.05)',
                                    padding: '2px 6px',
                                    borderRadius: '4px'
                                }}>
                                    {item.exchange}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SearchBar;
