import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { 
    Globe, Map, Train, Zap, Droplets, Wifi, Building2, Shield,
    Factory, Landmark, GraduationCap, Scale, Briefcase, Users,
    TreePine, Leaf, Sun, Wind, Database, TrendingUp, BarChart3,
    Fuel, Anchor, Plane, Radio, Server, Lock, Coins, Award,
    BookOpen, Stethoscope, ShieldCheck, Banknote, Ship, Loader2, ChevronRight, Layers
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { base44 } from '@/api/base44Client';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';

import DataTable from '@/components/geospatial/DataTable';
import GeographicalModels from '@/components/geospatial/GeographicalModels';
import AnomalyDetection from '@/components/geospatial/AnomalyDetection';
import CountrySelectModal from '@/components/shared/CountrySelectModal';

const COLORS = ['#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#3B82F6', '#EC4899'];

const CATEGORIES = [
    { id: 'infrastructure', name: 'Infrastructure', icon: Building2, color: '#3B82F6' },
    { id: 'resources', name: 'Resources', icon: Fuel, color: '#10B981' },
    { id: 'assets', name: 'Assets', icon: Landmark, color: '#F59E0B' },
    { id: 'governance', name: 'Governance', icon: Scale, color: '#8B5CF6' },
    { id: 'economic', name: 'Economic', icon: Briefcase, color: '#EF4444' },
    { id: 'social', name: 'Social', icon: Users, color: '#EC4899' },
    { id: 'global', name: 'Global', icon: Globe, color: '#06B6D4' },
    { id: 'environment', name: 'Environment', icon: Leaf, color: '#84CC16' }
];

const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${color}15` }}>
                <Icon className="w-5 h-5" style={{ color }} />
            </div>
            <div>
                <p className="text-xs text-gray-500">{title}</p>
                <p className="font-bold text-gray-900">{value}</p>
            </div>
        </div>
    </div>
);

export default function Geospatial() {
    const [activeCategory, setActiveCategory] = useState(null);
    const [selectedCountry, setSelectedCountry] = useState('');
    const [showCountryModal, setShowCountryModal] = useState(false);
    const [mainTab, setMainTab] = useState('geomatics');
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState({});
    const [summary, setSummary] = useState(null);

    const selectedCountries = selectedCountry ? [selectedCountry] : [];

    // Load summary when country changes
    useEffect(() => {
        if (selectedCountry) {
            loadSummary();
        } else {
            setSummary(null);
            setData({});
        }
    }, [selectedCountry]);

    // Load category data when selected
    useEffect(() => {
        if (selectedCountry && activeCategory) {
            loadCategoryData(activeCategory);
        }
    }, [activeCategory, selectedCountry]);

    const loadSummary = async () => {
        setLoading(true);
        try {
            const response = await base44.integrations.Core.InvokeLLM({
                prompt: `For ${selectedCountry}: Generate brief summary analysis with key insights (4 points).`,
                add_context_from_internet: true,
                response_json_schema: { type: "object", properties: { summary: { type: "string" }, keyInsights: { type: "array", items: { type: "string" } } } }
            });
            setSummary(response);
        } catch (error) {
            console.error('Failed to load summary:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadCategoryData = async (category) => {
        if (data[category]) return;
        setLoading(true);
        
        const prompts = {
            infrastructure: `Generate infrastructure data for ${selectedCountry}. Return: stats (4 items with title, value), tableData (5 items with type, count, capacity, condition, investment).`,
            resources: `Generate resources data for ${selectedCountry}. Return: stats (4 items with title, value), tableData (5 items with resource, reserves, production, value, rank).`,
            assets: `Generate national assets data for ${selectedCountry}. Return: stats (4 items with title, value), tableData (5 items with asset, value, change, type).`,
            governance: `Generate governance data for ${selectedCountry}. Return: stats (4 items with title, value), tableData (5 items with institution, count, personnel, budget, efficiency).`,
            economic: `Generate economic data for ${selectedCountry}. Return: stats (4 items with title, value), tableData (5 items with type, count, assets, coverage, rating).`,
            social: `Generate social data for ${selectedCountry}. Return: stats (4 items with title, value), tableData (5 items with level, institutions, enrollment, teachers, spending).`,
            global: `Generate global positioning data for ${selectedCountry}. Return: stats (4 items with title, value), tableData (5 items with type, count, personnel, regions, budget).`,
            environment: `Generate environment data for ${selectedCountry}. Return: stats (4 items with title, value), tableData (5 items with type, count, area, condition, budget).`
        };

        try {
            const response = await base44.integrations.Core.InvokeLLM({
                prompt: prompts[category],
                add_context_from_internet: true,
                response_json_schema: { type: "object", properties: { stats: { type: "array" }, tableData: { type: "array" } } }
            });
            setData(prev => ({ ...prev, [category]: response }));
        } catch (error) {
            console.error(`Failed to load ${category}:`, error);
        } finally {
            setLoading(false);
        }
    };

    const getCategoryIcon = (category) => {
        const icons = { infrastructure: Building2, resources: Fuel, assets: Landmark, governance: Scale, economic: Briefcase, social: Users, global: Globe, environment: Leaf };
        return icons[category] || Building2;
    };

    const getCategoryColumns = (category) => {
        const columns = {
            infrastructure: [{ key: 'type', label: 'Type' }, { key: 'count', label: 'Count' }, { key: 'capacity', label: 'Capacity' }, { key: 'condition', label: 'Condition' }, { key: 'investment', label: 'Investment' }],
            resources: [{ key: 'resource', label: 'Resource' }, { key: 'reserves', label: 'Reserves' }, { key: 'production', label: 'Production' }, { key: 'value', label: 'Value' }, { key: 'rank', label: 'Rank' }],
            assets: [{ key: 'asset', label: 'Asset' }, { key: 'value', label: 'Value' }, { key: 'change', label: 'Change' }, { key: 'type', label: 'Type' }],
            governance: [{ key: 'institution', label: 'Institution' }, { key: 'count', label: 'Count' }, { key: 'personnel', label: 'Personnel' }, { key: 'budget', label: 'Budget' }, { key: 'efficiency', label: 'Efficiency' }],
            economic: [{ key: 'type', label: 'Type' }, { key: 'count', label: 'Count' }, { key: 'assets', label: 'Assets' }, { key: 'coverage', label: 'Coverage' }, { key: 'rating', label: 'Rating' }],
            social: [{ key: 'level', label: 'Level' }, { key: 'institutions', label: 'Institutions' }, { key: 'enrollment', label: 'Enrollment' }, { key: 'teachers', label: 'Teachers' }, { key: 'spending', label: 'Spending' }],
            global: [{ key: 'type', label: 'Type' }, { key: 'count', label: 'Count' }, { key: 'personnel', label: 'Personnel' }, { key: 'regions', label: 'Regions' }, { key: 'budget', label: 'Budget' }],
            environment: [{ key: 'type', label: 'Type' }, { key: 'count', label: 'Count' }, { key: 'area', label: 'Area' }, { key: 'condition', label: 'Condition' }, { key: 'budget', label: 'Budget' }]
        };
        return columns[category] || [];
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold">Geospatial Data</h1>
                            <p className="text-white/80">Infrastructure, Resources & National Assets</p>
                        </div>
                        <button
                            onClick={() => setShowCountryModal(true)}
                            className="flex items-center gap-2 px-4 py-3 bg-white/20 border-2 border-white/30 rounded-xl hover:bg-white/30 transition-all"
                        >
                            <Globe className="w-5 h-5" />
                            <span className="font-medium">{selectedCountry || 'Select Country'}</span>
                        </button>
                    </div>
                </div>

                {/* Main Tabs */}
                <div className="flex gap-1 bg-white rounded-xl p-1.5 border border-gray-200 w-fit">
                    {['geomatics', 'anomaly', 'models'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setMainTab(tab)}
                            className={`px-6 py-2.5 rounded-lg font-medium transition-all capitalize ${mainTab === tab ? 'bg-purple-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                        >
                            {tab === 'geomatics' ? 'Geomatics' : tab === 'anomaly' ? 'Anomaly Detection' : 'Geographical Models'}
                        </button>
                    ))}
                </div>

                {/* Geomatics Tab */}
                {mainTab === 'geomatics' && (
                    !selectedCountry ? (
                        <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center">
                            <Globe className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-700 mb-2">Select a Country</h3>
                            <p className="text-sm text-gray-500">Choose a country to view infrastructure and resource data</p>
                        </div>
                    ) : (
                        <>
                            {/* Category Tiles */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {CATEGORIES.map(cat => (
                                    <button
                                        key={cat.id}
                                        onClick={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)}
                                        className={`p-4 rounded-xl border transition-all text-left ${activeCategory === cat.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white hover:border-gray-300'}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${cat.color}15` }}>
                                                <cat.icon className="w-4 h-4" style={{ color: cat.color }} />
                                            </div>
                                            <span className="font-medium text-gray-900 text-sm">{cat.name}</span>
                                            {data[cat.id] && <span className="ml-auto text-xs text-green-600">✓</span>}
                                        </div>
                                    </button>
                                ))}
                            </div>

                            {/* Summary */}
                            {loading && !activeCategory && (
                                <div className="flex items-center justify-center py-12">
                                    <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
                                </div>
                            )}
                            {summary && !activeCategory && (
                                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-5 border border-purple-100">
                                    <h3 className="font-bold text-gray-900 mb-2">AI Summary - {selectedCountry}</h3>
                                    <p className="text-gray-700 text-sm mb-3">{summary.summary}</p>
                                    {summary.keyInsights?.length > 0 && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                            {summary.keyInsights.map((item, i) => (
                                                <div key={i} className="text-sm text-gray-600 flex items-start gap-2">
                                                    <ChevronRight className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                                                    <span>{item}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Category Content */}
                            {activeCategory && (
                                <div className="bg-white rounded-xl border border-gray-200 p-5">
                                    <div className="flex items-center gap-3 mb-4">
                                        {React.createElement(getCategoryIcon(activeCategory), { className: "w-6 h-6", style: { color: CATEGORIES.find(c => c.id === activeCategory)?.color } })}
                                        <h3 className="font-bold text-gray-900 capitalize">{activeCategory} - {selectedCountry}</h3>
                                    </div>
                                    
                                    {loading ? (
                                        <div className="flex items-center justify-center py-12">
                                            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                                        </div>
                                    ) : data[activeCategory] ? (
                                        <>
                                            {data[activeCategory].stats?.length > 0 && (
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                                    {data[activeCategory].stats.map((stat, i) => (
                                                        <StatCard 
                                                            key={i} 
                                                            title={stat.title} 
                                                            value={stat.value} 
                                                            icon={getCategoryIcon(activeCategory)} 
                                                            color={COLORS[i % COLORS.length]} 
                                                        />
                                                    ))}
                                                </div>
                                            )}
                                            {data[activeCategory].tableData?.length > 0 && (
                                                <DataTable
                                                    title={`${activeCategory} Data`}
                                                    columns={getCategoryColumns(activeCategory)}
                                                    data={data[activeCategory].tableData}
                                                />
                                            )}
                                        </>
                                    ) : (
                                        <p className="text-gray-500 text-center py-8">No data available</p>
                                    )}
                                </div>
                            )}

                            {!activeCategory && !loading && summary && (
                                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
                                    <Layers className="w-10 h-10 text-blue-500 mx-auto mb-3" />
                                    <h3 className="text-lg font-semibold text-blue-900 mb-2">Select a Category</h3>
                                    <p className="text-sm text-blue-700">Click on any category tile above to load detailed data</p>
                                </div>
                            )}
                        </>
                    )
                )}

                {/* Anomaly Detection Tab */}
                {mainTab === 'anomaly' && <AnomalyDetection selectedCountries={selectedCountries} />}

                {/* Geographical Models Tab */}
                {mainTab === 'models' && <GeographicalModels selectedCountries={selectedCountries} />}

                <CountrySelectModal
                    isOpen={showCountryModal}
                    onClose={() => setShowCountryModal(false)}
                    selectedCountry={selectedCountry}
                    onSelect={setSelectedCountry}
                    title="Select Country"
                />
            </div>
        </div>
    );
}