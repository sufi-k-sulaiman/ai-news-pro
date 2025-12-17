import React, { useState, useEffect, useRef } from 'react';
import PageMeta from '@/components/PageMeta';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const pulseAnimation = `
@keyframes pulse {
    0%, 100% { opacity: 0.4; transform: scale(1); }
    50% { opacity: 0.8; transform: scale(1.05); }
}
`;
import { base44 } from '@/api/base44Client';
import { Newspaper, Search, Loader2, ExternalLink, RefreshCw, TrendingUp, Clock, Globe, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ErrorDisplay, { LoadingState, getErrorCode } from '@/components/ErrorDisplay';

import { Monitor, TrendingUp as BusinessIcon, FlaskConical, HeartPulse, Landmark, Trophy, Clapperboard, Globe2, ChevronDown, ChevronUp, Plane } from 'lucide-react';

const ARTICLES_PER_PAGE = 8;
const TOTAL_PAGES = 4;

const NewsGrid = ({ news, currentPage, onPageChange }) => {
    // RSS feeds provide real URLs - no validation needed
    const startIndex = (currentPage - 1) * ARTICLES_PER_PAGE;
    const endIndex = startIndex + ARTICLES_PER_PAGE;
    const articles = news.slice(startIndex, endIndex);
    const totalPages = Math.min(Math.ceil(news.length / ARTICLES_PER_PAGE), TOTAL_PAGES);
    const [loadedImages, setLoadedImages] = useState(0);
    const [timeRemaining, setTimeRemaining] = useState(0);
    const [generatedPages, setGeneratedPages] = useState(new Set());

    // Generate images in background when page changes
    const newsKey = JSON.stringify(news.map(a => a.title).slice(0, 3));
    useEffect(() => {
        if (news.length === 0) return;
        
        // Check if this page's images are already generated
        const pageKey = `${newsKey}-page${currentPage}`;
        if (generatedPages.has(pageKey)) {
            setLoadedImages(ARTICLES_PER_PAGE);
            setTimeRemaining(0);
            return;
        }
        
        // Try to load from localStorage first
        const cachedImages = loadImagesFromLocalStorage(pageKey);
        if (cachedImages) {
            console.log('Loading images from cache for', pageKey);
            cachedImages.forEach((url, index) => {
                if (url) {
                    const globalIndex = startIndex + index;
                    imageCache.set(`${newsKey}-${globalIndex}`, url);
                    const callback = updateCallbacks.get(`${newsKey}-${globalIndex}`);
                    if (callback) callback(url);
                }
            });
            setLoadedImages(ARTICLES_PER_PAGE);
            setTimeRemaining(0);
            setGeneratedPages(prev => new Set([...prev, pageKey]));
            return;
        }
        
        setLoadedImages(0);
        setTimeRemaining(8);
        
        const progressCallback = (loaded) => {
            setLoadedImages(loaded);
        };
        progressCallbacks.add(progressCallback);
        
        // Generate images for current page only
        const pageArticles = news.slice(startIndex, endIndex);
        generateImagesInBackground(pageArticles, newsKey, startIndex, pageKey);
        
        // Timer countdown
        const interval = setInterval(() => {
            setTimeRemaining(prev => {
                if (prev <= 1) {
                    clearInterval(interval);
                    setGeneratedPages(prev => new Set([...prev, pageKey]));
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        
        return () => {
            progressCallbacks.delete(progressCallback);
            clearInterval(interval);
        };
    }, [newsKey, currentPage]);

    if (articles.length === 0) {
        return (
            <div className="text-center py-20 bg-white rounded-2xl border" style={{ borderColor: '#6209e6' }}>
                <Globe className="w-16 h-16 mx-auto mb-4" style={{ color: '#6209e6', opacity: 0.3 }} />
                <h2 className="text-xl font-semibold text-gray-800 mb-2">No Articles Found</h2>
                <p className="text-gray-500">Try a different topic</p>
            </div>
        );
    }

    return (
        <>
            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center gap-2 mb-6">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                            key={page}
                            onClick={() => onPageChange(page)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                                currentPage === page ? 'text-white shadow-md' : 'hover:opacity-80'
                            }`}
                            style={currentPage === page ? { backgroundColor: '#6209e6' } : { background: 'linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%)', color: '#6209e6' }}
                        >
                            {page}
                        </button>
                    ))}
                </div>
            )}
            
            {loadedImages < ARTICLES_PER_PAGE && (
                <div className="mb-4 bg-gray-50 rounded-xl p-4">
                    <div className="mb-3">
                        <span className="text-sm text-gray-600">Generating images for page {currentPage}...</span>
                    </div>
                    {timeRemaining > 0 && (
                        <div className="flex items-center gap-3">
                            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div 
                                    className="h-full transition-all duration-1000 ease-linear"
                                    style={{ 
                                        width: `${(timeRemaining / 8) * 100}%`,
                                        backgroundColor: '#6209e6'
                                    }}
                                />
                            </div>
                            <span className="text-xs font-medium text-gray-500 min-w-[40px]">{timeRemaining}s</span>
                        </div>
                    )}
                </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {articles.map((article, index) => (
                    <NewsCardSimple key={`${newsKey}-${startIndex + index}`} article={article} index={startIndex + index} cacheKey={newsKey} />
                ))}
            </div>
        </>
    );
};

const cleanHtmlFromText = (text) => {
    if (!text) return '';
    return text
        .replace(/<a[^>]*>.*?<\/a>/gi, '')
        .replace(/<[^>]*>/g, '')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&nbsp;/g, ' ')
        .replace(/https?:\/\/[^\s]+/g, '')
        .replace(/\s+/g, ' ')
        .replace(/\s*[-|–—]\s*(Google News|Yahoo News|Reuters|AP News|CNN|BBC|Fox News|NBC News|CBS News|ABC News).*$/gi, '')
        .trim();
};

// Store for generated image URLs with category prefix
const imageCache = new Map();
let currentCacheKey = '';
const updateCallbacks = new Map();
const progressCallbacks = new Set();

// Load cached images from localStorage
const loadImagesFromLocalStorage = (cacheKey) => {
    try {
        const cached = localStorage.getItem(`news-images-${cacheKey}`);
        if (cached) {
            const data = JSON.parse(cached);
            // Check if cache is less than 72 hours old
            if (Date.now() - data.timestamp < 72 * 60 * 60 * 1000) {
                return data.images;
            }
        }
    } catch (error) {
        console.error('Error loading cached images:', error);
    }
    return null;
};

// Save images to localStorage
const saveImagesToLocalStorage = (cacheKey, images) => {
    try {
        localStorage.setItem(`news-images-${cacheKey}`, JSON.stringify({
            images,
            timestamp: Date.now()
        }));
    } catch (error) {
        console.error('Error saving images to cache:', error);
    }
};

const generateImagesInBackground = async (articles, cacheKey, startIndex = 0, pageKey = '') => {
    currentCacheKey = cacheKey;
    
    try {
        console.log(`Generating ${articles.length} images starting at index ${startIndex}...`);
        const response = await base44.functions.invoke('generateNewsImages', {
            articles: articles.map(a => ({ title: a.title }))
        });
        
        if (response.data?.images && currentCacheKey === cacheKey) {
            response.data.images.forEach((url, index) => {
                if (url) {
                    const globalIndex = startIndex + index;
                    imageCache.set(`${cacheKey}-${globalIndex}`, url);
                    const callback = updateCallbacks.get(`${cacheKey}-${globalIndex}`);
                    if (callback) callback(url);
                    progressCallbacks.forEach(cb => cb(index + 1));
                }
            });
            
            // Save to localStorage
            if (pageKey) {
                saveImagesToLocalStorage(pageKey, response.data.images);
            }
            
            console.log(`Generated and cached ${response.data.images.filter(Boolean).length} images`);
        }
    } catch (error) {
        console.error('Image generation failed:', error);
    }
};

const NewsCardSimple = ({ article, index, imageUrl: preloadedImageUrl, cacheKey }) => {
    const [imageUrl, setImageUrl] = useState(preloadedImageUrl || imageCache.get(`${cacheKey}-${index}`) || null);
    const [imageLoading, setImageLoading] = useState(!preloadedImageUrl && !imageCache.get(`${cacheKey}-${index}`));
    
    const cleanTitle = cleanHtmlFromText(article.title);
    const cleanDescription = cleanHtmlFromText(article.description);

    useEffect(() => {
        const key = `${cacheKey}-${index}`;
        
        if (preloadedImageUrl) {
            setImageUrl(preloadedImageUrl);
            setImageLoading(false);
            return;
        }
        

        
        // Check if already in cache
        const cached = imageCache.get(key);
        if (cached) {
            setImageUrl(cached);
            setImageLoading(false);
            return;
        }
        
        // Subscribe to this specific image update
        const updateCallback = (url) => {
            setImageUrl(url);
            setImageLoading(false);
        };
        updateCallbacks.set(key, updateCallback);
        
        const timeout = setTimeout(() => {
            setImageLoading(false);
        }, 60000);
        
        return () => {
            updateCallbacks.delete(key);
            clearTimeout(timeout);
        };
    }, [index, preloadedImageUrl, cacheKey]);

    return (
        <div className="block bg-gray-50 rounded-xl overflow-hidden hover:shadow-lg transition-shadow group border border-gray-200">
            <div className="aspect-video bg-white relative overflow-hidden">
                {imageLoading ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-white">
                        <div className="flex flex-col items-center gap-3">
                            <div className="relative">
                                <img 
                                    src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/692729a5f5180fbd43f297e9/622024f26_image-loading-logo.png" 
                                    alt="Loading" 
                                    className="w-10 h-10 object-contain"
                                    style={{ animation: 'pulse 1.5s ease-in-out infinite' }}
                                />
                            </div>
                            <span className="text-xs" style={{ color: '#6209e6', opacity: 0.6 }}>Loading...</span>
                        </div>
                    </div>
                ) : imageUrl ? (
                    <img 
                        src={imageUrl} 
                        alt={article.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-white">
                        <Newspaper className="w-10 h-10" style={{ color: '#6209e6', opacity: 0.2 }} />
                    </div>
                )}
            </div>
            <div className="p-5">
                {article.time && (
                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {article.time}
                        </span>
                    </div>
                )}
                <h3 
                    className="font-semibold text-gray-900 mb-2 line-clamp-2 cursor-pointer hover:transition-colors" 
                    style={{ '--hover-color': '#6209e6' }} 
                    onMouseEnter={(e) => e.currentTarget.style.color = '#6209e6'} 
                    onMouseLeave={(e) => e.currentTarget.style.color = ''}
                    onClick={() => window.open(article.url, '_blank')}
                >
                    {cleanTitle}
                </h3>

                <a 
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm font-medium" 
                    style={{ color: '#6209e6' }}
                >
                    Read more <ExternalLink className="w-3 h-3" />
                </a>
            </div>
            </div>
            );
            };

const CATEGORIES = [
    { id: 'technology', label: 'Technology', icon: Monitor, subtopics: ['AI', 'Startups', 'Gadgets', 'Cybersecurity', 'Software', 'Cloud Computing', 'Blockchain', 'Robotics', '5G Networks', 'IoT', 'Data Science', 'Machine Learning'] },
    { id: 'business', label: 'Business', icon: BusinessIcon, subtopics: ['Stocks', 'Economy', 'Crypto', 'Real Estate', 'Finance', 'Mergers', 'IPOs', 'Venture Capital', 'Banking', 'Commodities', 'E-commerce', 'Retail'] },
    { id: 'science', label: 'Science', icon: FlaskConical, subtopics: ['Space', 'Physics', 'Biology', 'Climate', 'Research', 'Astronomy', 'Genetics', 'Archaeology', 'Chemistry', 'Quantum', 'Neuroscience', 'Marine Biology'] },
    { id: 'health', label: 'Health', icon: HeartPulse, subtopics: ['Medicine', 'Wellness', 'Mental Health', 'Nutrition', 'Fitness', 'Vaccines', 'Aging', 'Sleep', 'Diseases', 'Healthcare Policy', 'Hospitals', 'Clinical Trials'] },
    { id: 'politics', label: 'Politics', icon: Landmark, subtopics: ['Elections', 'Policy', 'Congress', 'International', 'Law', 'Supreme Court', 'Diplomacy', 'Defense', 'Immigration', 'Trade', 'Senate', 'White House'] },
    { id: 'sports', label: 'Sports', icon: Trophy, subtopics: ['Football', 'Basketball', 'Soccer', 'Tennis', 'Olympics', 'Baseball', 'Golf', 'MMA', 'Formula 1', 'Cricket', 'Hockey', 'Boxing'] },
    { id: 'entertainment', label: 'Entertainment', icon: Clapperboard, subtopics: ['Movies', 'Music', 'TV Shows', 'Celebrities', 'Gaming', 'Streaming', 'Broadway', 'Awards', 'Podcasts', 'Anime', 'Netflix', 'Fashion'] },
    { id: 'travel', label: 'Travel', icon: Plane, subtopics: ['Destinations', 'Hotels', 'Airlines', 'Cruises', 'Adventure', 'Luxury Travel', 'Budget Travel', 'Road Trips', 'Beach', 'Mountains', 'City Breaks', 'National Parks'] },
    { id: 'world', label: 'World', icon: Globe2, subtopics: ['Europe', 'Asia', 'Americas', 'Africa', 'Middle East', 'Australia', 'Russia', 'India', 'China', 'Latin America', 'Japan', 'UK'] },
];

export default function News() {
    // Update URL for display only (aesthetic, not parsed)
    const updateUrl = (category, query) => {
        const basePath = window.location.pathname;
        let displayPath = basePath;
        if (category) {
            displayPath = `${basePath}/${category}`;
            if (query) {
                const querySlug = query.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
                displayPath = `${basePath}/${category}/${querySlug}`;
            }
        }
        window.history.pushState({ category, query }, '', displayPath);
    };

    useEffect(() => {
        
        // Handle browser back/forward - restore from history state only
        const handlePopState = (event) => {
            const state = event.state || {};
            setActiveCategory(state.category || 'technology');
            setSearchQuery(state.query || '');
        };
        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []);

    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('technology');
    const [expandedCategory, setExpandedCategory] = useState(null);
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(null);
    const [activeSubtopic, setActiveSubtopic] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const searchRef = useRef(null);

    // Dynamic trending topics based on current category and all subtopics
    const getDynamicSuggestions = () => {
        const currentCategory = CATEGORIES.find(c => c.id === activeCategory);
        const currentSubtopics = currentCategory?.subtopics || [];
        
        // Get all subtopics from all categories
        const allSubtopics = CATEGORIES.flatMap(cat => cat.subtopics);
        
        // Prioritize current category subtopics, then others
        const suggestions = [...new Set([...currentSubtopics, ...allSubtopics])];
        
        return suggestions;
    };
    
    const filteredSuggestions = searchQuery.trim() 
        ? getDynamicSuggestions().filter(topic => topic.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 8)
        : getDynamicSuggestions().slice(0, 10);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fetchNews = async (keyword) => {
        setLoading(true);
        setError(null);
        try {
            // Use backend function with RSS
            const response = await base44.functions.invoke('fetchNews', {
                query: keyword,
                category: CATEGORIES.find(c => c.id === keyword)?.id || null,
                limit: 30
            });

            const articles = response.data?.articles || [];
            const backendError = response.data?.error;
            console.log('Fetched articles:', articles.length, 'Source:', response.data?.source, 'Error:', backendError);

            if (articles.length === 0) {
                if (backendError) {
                    console.error('Backend error:', backendError);
                }
                setError('E200');
                setNews([]);
            } else {
                setNews(articles);
                setError(null);
            }
            setLastUpdated(new Date());
        } catch (err) {
            console.error('Error fetching news:', err);
            const errorMessage = err?.message?.toLowerCase() || '';
            if (errorMessage.includes('network') || errorMessage.includes('fetch') || errorMessage.includes('timeout')) {
                setError('E100');
            } else {
                setError('E200');
            }
            setNews([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNews(activeCategory);
    }, [activeCategory]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            setCurrentPage(1);
            updateUrl(activeCategory, searchQuery.trim());
            fetchNews(searchQuery.trim());
        }
    };

    const handleCategoryClick = (categoryId) => {
        setActiveCategory(categoryId);
        setSearchQuery('');
        setActiveSubtopic(null);
        setCurrentPage(1);
        updateUrl(categoryId, '');
    };

    return (
        <>
            <PageMeta 
                title="Ai News Pro"
                description="AI-powered news aggregation platform delivering real-time global news with intelligent categorization."
                keywords="AI news, news aggregator, breaking news, global news, AI News Pro"
            />
            <div className="min-h-screen bg-white">
                <style>{pulseAnimation}</style>

                {/* Top Header with Logo */}
                <div className="sticky top-0 z-50 bg-white shadow-sm">
                    <div className="max-w-[82rem] mx-auto px-4 py-3 relative">
                        {/* Left - Logo */}
                        <Link to={createPageUrl('News')} className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2.5 hover:opacity-80 transition-opacity">
                            <img 
                                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/692729a5f5180fbd43f297e9/a182b15e6_1c-logo.png" 
                                alt="Ai News Pro" 
                                className="h-8 w-8 object-contain" 
                            />
                            <h1 className="text-base font-bold text-gray-900 whitespace-nowrap">Ai News Pro</h1>
                        </Link>

                        {/* Center - Search Bar */}
                        <div className="flex justify-center">
                            <form onSubmit={handleSearch} className="w-full max-w-xl relative" ref={searchRef}>
                                <div className="relative">
                                    <Input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        onFocus={() => setShowSuggestions(true)}
                                        placeholder="Search for any news topic..."
                                        className="w-full h-11 pl-5 pr-14 rounded-full bg-white shadow-sm"
                                        style={{ borderColor: '#6209e6' }}
                                    />
                                    <button
                                        type="submit"
                                        className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                                        style={{ backgroundColor: '#6209e6' }}
                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#5208c5'}
                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#6209e6'}
                                    >
                                        <Search className="w-4 h-4 text-white" />
                                    </button>
                                </div>

                                {/* Suggestions Dropdown */}
                                {showSuggestions && filteredSuggestions.length > 0 && (
                                    <div className="absolute top-full mt-2 w-full bg-white rounded-2xl shadow-lg border border-gray-200 py-2 z-50 max-h-[400px] overflow-y-auto">
                                        <div className="px-4 py-2 text-xs font-semibold text-gray-500 flex items-center gap-2">
                                            <TrendingUp className="w-3 h-3" />
                                            {searchQuery.trim() ? 'Matching Topics' : `Popular in ${CATEGORIES.find(c => c.id === activeCategory)?.label}`}
                                        </div>
                                        {filteredSuggestions.map((topic) => (
                                            <button
                                                key={topic}
                                                type="button"
                                                onClick={() => {
                                                    setSearchQuery(topic);
                                                    setCurrentPage(1);
                                                    updateUrl(activeCategory, topic);
                                                    fetchNews(topic);
                                                    setShowSuggestions(false);
                                                }}
                                                className="w-full px-4 py-2.5 text-left hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm"
                                            >
                                                <Search className="w-4 h-4 text-gray-400" />
                                                <span className="text-gray-900">{topic}</span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </form>
                        </div>

                        {/* Right - Refresh Button and Time */}
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col items-end gap-0.5">
                                                {lastUpdated && (
                                <span className="text-xs text-gray-500">
                                    {lastUpdated.toLocaleTimeString()}
                                </span>
                            )}
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => fetchNews(searchQuery || activeCategory)}
                                disabled={loading}
                                className="gap-2 hover:opacity-80 h-9"
                                style={{ background: 'linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%)', color: '#6209e6' }}
                            >
                                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                                Refresh
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="max-w-[82rem] mx-auto p-4 md:p-6">

                {/* Categories */}
                <div className="bg-gray-100 rounded-full p-1.5 inline-flex gap-1 mb-2">
                    {CATEGORIES.map((cat) => {
                        const IconComponent = cat.icon;
                        const isExpanded = expandedCategory === cat.id;
                        return (
                            <button
                                key={cat.id}
                                onClick={() => {
                                    handleCategoryClick(cat.id);
                                    setExpandedCategory(isExpanded ? null : cat.id);
                                }}
                                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap ${
                                    activeCategory === cat.id
                                        ? 'text-white shadow-sm'
                                        : 'text-gray-600 hover:text-gray-900'
                                }`}
                                style={activeCategory === cat.id ? { backgroundColor: '#6209e6' } : { backgroundColor: 'transparent' }}
                            >
                                <IconComponent className="w-4 h-4" />
                                {cat.label}
                                {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                            </button>
                        );
                    })}
                </div>

                {/* Subtopics */}
                {expandedCategory && (
                    <div className="flex flex-wrap justify-center gap-2 mb-6 animate-in fade-in slide-in-from-top-2 duration-200">
                        {CATEGORIES.find(c => c.id === expandedCategory)?.subtopics.map((subtopic) => (
                            <button
                                key={subtopic}
                                onClick={() => {
                                    setSearchQuery(subtopic);
                                    setActiveSubtopic(subtopic);
                                    setCurrentPage(1);
                                    updateUrl(activeCategory, subtopic);
                                    fetchNews(subtopic);
                                }}
                                className={`font-medium rounded-full transition-colors ${
                                    activeSubtopic === subtopic
                                        ? 'text-white'
                                        : 'hover:opacity-80'
                                }`}
                                style={activeSubtopic === subtopic ? { backgroundColor: '#6209e6', fontSize: '0.882rem', padding: '0.441rem 0.882rem' } : { background: 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)', color: '#6209e6', fontSize: '0.882rem', padding: '0.441rem 0.882rem' }}
                            >
                                {subtopic}
                            </button>
                        ))}
                    </div>
                )}

                {!expandedCategory && <div className="mb-4" />}

                {/* News Grid */}
                {loading ? (
                    <LoadingState message="Fetching latest news..." size="large" />
                ) : error ? (
                    <div className="bg-white rounded-2xl border" style={{ borderColor: '#6209e6' }}>
                        <ErrorDisplay 
                            errorCode={error} 
                            onRetry={() => fetchNews(searchQuery || activeCategory)}
                        />
                    </div>
                ) : news.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl border" style={{ borderColor: '#6209e6' }}>
                        <Globe className="w-16 h-16 mx-auto mb-4" style={{ color: '#6209e6', opacity: 0.3 }} />
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">No News Found</h2>
                        <p className="text-gray-500">Try searching for a different topic</p>
                    </div>
                ) : (
                    <NewsGrid 
                        news={news} 
                        currentPage={currentPage} 
                        onPageChange={setCurrentPage} 
                        onArticleClick={(url, title) => {
                            navigate(`${createPageUrl('ArticleView')}?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`);
                        }} 
                    />
                )}

                {/* Trending Section */}
                {!loading && news.length > 0 && (
                    <div className="mt-8 bg-white rounded-2xl border p-6" style={{ borderColor: '#6209e6' }}>
                        <div className="flex items-center gap-2 mb-4">
                            <TrendingUp className="w-5 h-5" style={{ color: '#6209e6' }} />
                            <h2 className="font-semibold text-gray-900">Trending Topics</h2>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {['AI', 'Climate', 'Economy', 'Elections', 'Space', 'Crypto', 'Tech Stocks', 'Healthcare'].map((topic) => (
                                <button
                                    key={topic}
                                    onClick={() => {
                                        setSearchQuery(topic);
                                        setCurrentPage(1);
                                        fetchNews(topic);
                                    }}
                                    className="px-3 py-1.5 text-sm rounded-full transition-colors hover:opacity-80"
                                    style={{ background: 'linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%)', color: '#6209e6' }}
                                >
                                    #{topic}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
                </div>
                </div>
                </>
                );
                }