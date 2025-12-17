import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import PageMeta from '@/components/PageMeta';
import { base44 } from '@/api/base44Client';
import { 
    X, Star, TrendingUp, TrendingDown, Eye, DollarSign, BarChart3, 
    LineChart, Activity, Brain, Shield, AlertTriangle, List, 
    Sparkles, ChevronRight, Info, Loader2, Target, Zap, Building,
    Users, Globe, Calendar, FileText, PieChart, Percent, ArrowUpRight, ArrowDownRight,
    Calculator, ThumbsUp, ThumbsDown, Download, ExternalLink, Play, ArrowLeft
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, PieChart as RePieChart, Pie, Cell, LineChart as ReLineChart, Line } from 'recharts';
import { Award } from 'lucide-react';

const NAV_ITEMS = [
    { id: 'overview', label: 'Overview', icon: Eye },
    { id: 'moat', label: 'MOAT Analysis', icon: Shield },
    { id: 'valuation', label: 'Valuation', icon: BarChart3 },
    { id: 'simulator', label: 'Simulator', icon: Target },
    { id: 'dcf', label: 'DCF Calculator', icon: Activity },
    { id: 'bullbear', label: 'Bull/Bear Case', icon: TrendingUp },
    { id: 'fundamentals', label: 'Fundamentals', icon: LineChart },
    { id: 'financials', label: 'Financials', icon: Activity },
    { id: 'technicals', label: 'Technicals', icon: TrendingUp },
    { id: 'sentiment', label: 'Sentiment', icon: Brain },
    { id: 'risk', label: 'Risk & Macro', icon: AlertTriangle },
    { id: 'dividends', label: 'Dividends', icon: Percent },
    { id: 'peers', label: 'Peers', icon: Users },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'investor-relations', label: 'Investor Relations', icon: Building },
    { id: 'legends', label: 'Legends', icon: Award },
];

const CHART_COLORS = ['#8B5CF6', '#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#EC4899'];

function MoatBar({ label, value, color = '#8B5CF6' }) {
    return (
        <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600 w-32">{label}</span>
            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all" style={{ width: `${value}%`, backgroundColor: color }} />
            </div>
            <span className="text-sm font-medium text-gray-700 w-12 text-right">{value}%</span>
        </div>
    );
}

export default function StockDetail() {
    const navigate = useNavigate();
    const [stock, setStock] = useState(null);
    const [activeNav, setActiveNav] = useState('overview');
    const [isWatchlisted, setIsWatchlisted] = useState(false);
    const [sectionData, setSectionData] = useState({});
    const [loadingSection, setLoadingSection] = useState(null);
    const [investmentAmount, setInvestmentAmount] = useState(10000);
    const [yearsToHold, setYearsToHold] = useState(5);
    const [expectedReturn, setExpectedReturn] = useState(12);
    const [activeReportTab, setActiveReportTab] = useState('annual');
    const [priceChartPeriod, setPriceChartPeriod] = useState('36M');

    // Get stock ticker from URL
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const ticker = params.get('ticker');
        if (ticker) {
            loadStockData(ticker);
        }
    }, []);

    const loadStockData = async (ticker) => {
        try {
            // Call AI to get stock data
            const response = await base44.integrations.Core.InvokeLLM({
                prompt: `Provide REAL, CURRENT stock market data for ${ticker}. Return: ticker, name, sector, industry, marketCap, price, change (%), volume, moat (0-100), roe (%), roic (%), roa (%), pe, peg, zscore, eps, dividend (%), sgr (%), beta, fcf, eva, aiRating (0-100)`,
                add_context_from_internet: true,
                response_json_schema: {
                    type: "object",
                    properties: {
                        ticker: { type: "string" },
                        name: { type: "string" },
                        sector: { type: "string" },
                        industry: { type: "string" },
                        marketCap: { type: "string" },
                        price: { type: "number" },
                        change: { type: "number" },
                        volume: { type: "string" },
                        moat: { type: "number" },
                        roe: { type: "number" },
                        roic: { type: "number" },
                        roa: { type: "number" },
                        pe: { type: "number" },
                        peg: { type: "number" },
                        zscore: { type: "number" },
                        eps: { type: "number" },
                        dividend: { type: "number" },
                        sgr: { type: "number" },
                        beta: { type: "number" },
                        fcf: { type: "number" },
                        eva: { type: "number" },
                        aiRating: { type: "number" }
                    }
                }
            });
            setStock(response);
        } catch (error) {
            console.error('Error loading stock:', error);
        }
    };

    useEffect(() => {
        if (stock) {
            setSectionData({});
            setActiveNav('overview');
            setPriceChartPeriod('36M');
        }
    }, [stock?.ticker]);

    useEffect(() => {
        if (stock) {
            loadSectionData(activeNav);
        }
    }, [activeNav, stock?.ticker]);

    useEffect(() => {
        if (stock && activeNav === 'overview') {
            loadSectionData('overview');
        }
    }, [priceChartPeriod]);

    const loadSectionData = async (section) => {
        if (!stock) return;
        
        setLoadingSection(section);
        
        try {
            let prompt = '';
            let schema = {};

            switch (section) {
                case 'overview':
                    const periodDescriptions = {
                        '24H': 'hourly price data for the last 24 hours (24 data points)',
                        '72H': 'hourly price data for the last 72 hours (72 data points)',
                        '1W': 'daily price data for the last 7 days (7 data points)',
                        '3M': 'weekly price data for the last 3 months (12 data points)',
                        '6M': 'weekly price data for the last 6 months (24 data points)',
                        '12M': 'monthly price data for the last 12 months (12 data points)',
                        '24M': 'monthly price data for the last 24 months (24 data points)',
                        '36M': 'monthly price data for the last 36 months (36 data points)'
                    };
                    const periodDesc = periodDescriptions[priceChartPeriod] || periodDescriptions['36M'];
                    
                    prompt = `Provide data for ${stock.ticker}: company description, competitive advantages (3), revenue streams (3), latest developments (3), real historical price data for "${priceChartPeriod}": ${periodDesc}, MOAT analysis (brand power, switching costs, network effects, cost advantages, intangibles 0-100 each), investment thesis`;
                    schema = {
                        type: "object",
                        properties: {
                            description: { type: "string" },
                            advantages: { type: "array", items: { type: "string" } },
                            revenueStreams: { type: "array", items: { type: "string" } },
                            developments: { type: "array", items: { type: "string" } },
                            priceHistory: { type: "array", items: { type: "object", properties: { time: { type: "string" }, price: { type: "number" } } } },
                            moatBreakdown: { type: "object", properties: { brandPower: { type: "number" }, switchingCosts: { type: "number" }, networkEffects: { type: "number" }, costAdvantages: { type: "number" }, intangibles: { type: "number" } } },
                            thesis: { type: "string" }
                        }
                    };
                    break;

                case 'moat':
                    prompt = `MOAT analysis for ${stock.ticker}: scores 0-100 for brand power, switching costs, network effects, cost advantages, scale advantage, regulatory moat. Competitive position, 5 advantages, thesis`;
                    schema = {
                        type: "object",
                        properties: {
                            moatBreakdown: { type: "object", properties: { brandPower: { type: "number" }, switchingCosts: { type: "number" }, networkEffects: { type: "number" }, costAdvantages: { type: "number" }, scaleAdvantage: { type: "number" }, regulatoryMoat: { type: "number" } } },
                            position: { type: "string" },
                            advantages: { type: "array", items: { type: "string" } },
                            thesis: { type: "string" }
                        }
                    };
                    break;

                case 'valuation':
                    prompt = `Valuation for ${stock.ticker}: fair value, margin of safety %, sector average P/E, grade A-F, 5 comparable companies with P/E, 5-year historical P/E trend`;
                    schema = {
                        type: "object",
                        properties: {
                            fairValue: { type: "number" },
                            comparables: { type: "array", items: { type: "object", properties: { ticker: { type: "string" }, pe: { type: "number" } } } },
                            historicalPE: { type: "array", items: { type: "object", properties: { year: { type: "string" }, pe: { type: "number" } } } },
                            sectorAvgPE: { type: "number" },
                            marginOfSafety: { type: "number" },
                            grade: { type: "string" }
                        }
                    };
                    break;

                default:
                    return;
            }

            const response = await base44.integrations.Core.InvokeLLM({
                prompt: `${prompt}\n\nIMPORTANT: Provide SPECIFIC data for ${stock.ticker}.`,
                add_context_from_internet: true,
                response_json_schema: schema
            });

            setSectionData(prev => ({ ...prev, [section]: response }));
        } catch (error) {
            console.error('Error loading section data:', error);
        } finally {
            setLoadingSection(null);
        }
    };

    if (!stock) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
            </div>
        );
    }

    const isPositive = stock.change >= 0;
    const data = sectionData[activeNav] || {};

    return (
        <>
            <PageMeta 
                title={`${stock.ticker} - ${stock.name} Stock Analysis`}
                description={`Comprehensive AI-powered analysis for ${stock.name} (${stock.ticker}). View fundamentals, technicals, valuation, and investment insights.`}
                keywords={`${stock.ticker}, ${stock.name}, stock analysis, ${stock.sector}, ${stock.industry}`}
            />
            <div className="min-h-screen bg-gray-50">
                {/* Header with Back Button */}
                <div className="bg-white border-b border-gray-200 sticky top-0 z-20">
                    <div className="max-w-7xl mx-auto px-4 py-4">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-4">
                                <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={() => navigate(createPageUrl('Markets'))}
                                    className="gap-2"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    Back
                                </Button>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-2xl font-bold text-gray-900">{stock.ticker}</span>
                                        <span className="px-2 py-1 bg-purple-100 text-purple-700 text-sm rounded-lg font-medium">{stock.name}</span>
                                    </div>
                                    <p className="text-sm text-gray-500">{stock.sector} • {stock.industry}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="text-right">
                                    <span className="text-3xl font-bold text-gray-900">${stock.price?.toFixed(2)}</span>
                                    <span className={`ml-2 text-lg font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                                        {isPositive ? '+' : ''}{stock.change?.toFixed(2)}%
                                    </span>
                                </div>
                                <Button 
                                    onClick={() => setIsWatchlisted(!isWatchlisted)}
                                    className={`${isWatchlisted ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-purple-600 hover:bg-purple-700'}`}
                                >
                                    <Star className={`w-4 h-4 mr-2 ${isWatchlisted ? 'fill-white' : ''}`} />
                                    {isWatchlisted ? 'Watching' : 'Watchlist'}
                                </Button>
                            </div>
                        </div>

                        {/* Top Navigation Menu */}
                        <div className="flex gap-1 overflow-x-auto pb-2 hide-scrollbar">
                            {NAV_ITEMS.map(item => (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveNav(item.id)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                                        activeNav === item.id ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                                >
                                    <item.icon className="w-4 h-4" />
                                    {item.label}
                                    {loadingSection === item.id && <Loader2 className="w-3 h-3 animate-spin" />}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="max-w-7xl mx-auto px-4 py-6">
                    {loadingSection === activeNav ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <Loader2 className="w-8 h-8 text-purple-600 animate-spin mb-3" />
                            <p className="text-gray-600">Loading {activeNav} data with AI...</p>
                        </div>
                    ) : sectionData[activeNav] ? (
                        <div className="space-y-6">
                            {activeNav === 'overview' && sectionData.overview && (
                                <>
                                    <div className="bg-white rounded-2xl border border-gray-200 p-6">
                                        <h3 className="font-semibold text-gray-900 mb-3">Company Overview</h3>
                                        <p className="text-gray-600 mb-4">{sectionData.overview.description}</p>
                                        {sectionData.overview.advantages && (
                                            <div>
                                                <h4 className="font-medium text-gray-900 mb-2">Competitive Advantages</h4>
                                                <ul className="space-y-1">
                                                    {sectionData.overview.advantages.map((adv, i) => (
                                                        <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2" />
                                                            {adv}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                    {sectionData.overview.priceHistory?.length > 0 && (
                                        <div className="bg-white rounded-2xl border border-gray-200 p-6">
                                            <div className="flex items-center justify-between mb-4">
                                                <h3 className="font-semibold text-gray-900">Price History</h3>
                                                <div className="flex gap-1">
                                                    {['24H', '1W', '3M', '6M', '12M', '36M'].map(period => (
                                                        <button
                                                            key={period}
                                                            onClick={() => setPriceChartPeriod(period)}
                                                            className={`px-2 py-1 text-xs rounded-lg ${
                                                                priceChartPeriod === period ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600'
                                                            }`}
                                                        >
                                                            {period}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="h-64">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <AreaChart data={sectionData.overview.priceHistory.map(p => ({ time: p.time, price: p.price }))}>
                                                        <defs>
                                                            <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
                                                                <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                                                                <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                                                            </linearGradient>
                                                        </defs>
                                                        <XAxis dataKey="time" tick={{ fontSize: 10 }} />
                                                        <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `$${v.toFixed(0)}`} />
                                                        <Tooltip formatter={(v) => [`$${Number(v).toFixed(2)}`, 'Price']} />
                                                        <Area type="monotone" dataKey="price" stroke="#8B5CF6" strokeWidth={2} fill="url(#priceGrad)" />
                                                    </AreaChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                            {activeNav === 'moat' && sectionData.moat && (
                                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                                    <h3 className="font-semibold text-gray-900 mb-4">MOAT Analysis</h3>
                                    <div className="space-y-3">
                                        <MoatBar label="Brand Power" value={sectionData.moat.moatBreakdown?.brandPower || 0} />
                                        <MoatBar label="Switching Costs" value={sectionData.moat.moatBreakdown?.switchingCosts || 0} color="#10B981" />
                                        <MoatBar label="Network Effects" value={sectionData.moat.moatBreakdown?.networkEffects || 0} />
                                        <MoatBar label="Cost Advantages" value={sectionData.moat.moatBreakdown?.costAdvantages || 0} color="#F59E0B" />
                                        <MoatBar label="Scale Advantage" value={sectionData.moat.moatBreakdown?.scaleAdvantage || 0} color="#3B82F6" />
                                        <MoatBar label="Regulatory Moat" value={sectionData.moat.moatBreakdown?.regulatoryMoat || 0} color="#EC4899" />
                                    </div>
                                    {sectionData.moat.thesis && (
                                        <div className="mt-6 p-4 bg-purple-50 rounded-lg">
                                            <h4 className="font-medium text-gray-900 mb-2">Investment Thesis</h4>
                                            <p className="text-sm text-gray-700">{sectionData.moat.thesis}</p>
                                        </div>
                                    )}
                                </div>
                            )}
                            {activeNav === 'valuation' && sectionData.valuation && (
                                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                                    <h3 className="font-semibold text-gray-900 mb-4">Valuation Analysis</h3>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="bg-purple-50 rounded-xl p-4 text-center">
                                            <p className="text-sm text-gray-500">Fair Value</p>
                                            <p className="text-2xl font-bold text-purple-600">${sectionData.valuation.fairValue?.toFixed(2)}</p>
                                        </div>
                                        <div className="bg-green-50 rounded-xl p-4 text-center">
                                            <p className="text-sm text-gray-500">Margin of Safety</p>
                                            <p className="text-2xl font-bold text-green-600">{sectionData.valuation.marginOfSafety}%</p>
                                        </div>
                                        <div className="bg-gray-50 rounded-xl p-4 text-center">
                                            <p className="text-sm text-gray-500">Grade</p>
                                            <p className="text-2xl font-bold text-gray-900">{sectionData.valuation.grade}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="text-center text-gray-500 py-20">
                            <Info className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            <p>Click a section above to load analysis</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}