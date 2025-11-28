import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { 
    Globe, Map, Layers, Train, Zap, Droplets, Wifi, Building2, Shield,
    Factory, Landmark, GraduationCap, Heart, Scale, Briefcase, Users,
    TreePine, Leaf, Sun, Wind, Database, TrendingUp, BarChart3, PieChart,
    Network, Fuel, Anchor, Plane, Radio, Server, Lock, Coins, Award,
    BookOpen, Stethoscope, ShieldCheck, Vote, Banknote, Ship, Loader2,
    RefreshCw, Filter, Download, ChevronRight, MapPin, Activity, Cpu, Lightbulb
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { base44 } from '@/api/base44Client';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, PieChart as RechartsPie, Pie, Legend, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, LineChart, Line } from 'recharts';

import CategorySection from '@/components/geospatial/CategorySection';
import AssetCard from '@/components/geospatial/AssetCard';
import ResourcesChart from '@/components/geospatial/ResourcesChart';
import InfrastructureStats from '@/components/geospatial/InfrastructureStats';
import DataTable from '@/components/geospatial/DataTable';
import MultiSelectDropdown from '@/components/intelligence/MultiSelectDropdown';
import GeographicalModels from '@/components/geospatial/GeographicalModels';
import AnomalyDetection from '@/components/geospatial/AnomalyDetection';
import CountrySelectModal from '@/components/shared/CountrySelectModal';

const COLORS = ['#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#3B82F6', '#EC4899', '#06B6D4', '#84CC16'];

const CATEGORIES = [
    { id: 'infrastructure', name: 'Core Infrastructure', icon: Building2, color: '#3B82F6' },
    { id: 'resources', name: 'Natural & Strategic Resources', icon: Fuel, color: '#10B981' },
    { id: 'assets', name: 'National Assets', icon: Landmark, color: '#F59E0B' },
    { id: 'governance', name: 'Governance & Institutions', icon: Scale, color: '#8B5CF6' },
    { id: 'economic', name: 'Economic Systems', icon: Briefcase, color: '#EF4444' },
    { id: 'social', name: 'Social & Human Development', icon: Users, color: '#EC4899' },
    { id: 'global', name: 'Global & Strategic Positioning', icon: Globe, color: '#06B6D4' },
    { id: 'environment', name: 'Environmental & Sustainability', icon: Leaf, color: '#84CC16' }
];

export default function Geospatial() {
    useEffect(() => {
        document.title = 'Geospatial Infrastructure & Resources Analytics';
        document.querySelector('meta[name="description"]')?.setAttribute('content', 'Comprehensive geospatial analysis of infrastructure, resources, and national assets.');
    }, []);

    const [activeCategory, setActiveCategory] = useState('all');
    const [selectedCountry, setSelectedCountry] = useState('');
    const [showCountryModal, setShowCountryModal] = useState(false);
    const selectedCountries = selectedCountry ? [selectedCountry] : [];
    const [dynamicData, setDynamicData] = useState(null);
    const [analysisData, setAnalysisData] = useState(null);
    const [loadingSections, setLoadingSections] = useState({});
    const [mainTab, setMainTab] = useState('geomatics');
    const [loadedSections, setLoadedSections] = useState({});

    // Only load summary when countries change
    useEffect(() => {
        if (selectedCountries.length > 0) {
            setDynamicData({});
            setAnalysisData(null);
            setLoadedSections({});
            loadSummaryOnly();
        } else {
            setDynamicData(null);
            setAnalysisData(null);
            setLoadingSections({});
            setLoadedSections({});
        }
    }, [selectedCountries]);

    // Load section data when category is selected
    useEffect(() => {
        if (selectedCountries.length > 0 && activeCategory !== 'all') {
            loadCategoryData(activeCategory);
        }
    }, [activeCategory, selectedCountries]);

    const loadSectionData = async (sectionName, prompt, schema) => {
        const countriesStr = selectedCountries.join(', ');
        setLoadingSections(prev => ({ ...prev, [sectionName]: true }));
        try {
            const response = await base44.integrations.Core.InvokeLLM({
                prompt: `For ${countriesStr}: ${prompt}`,
                add_context_from_internet: true,
                response_json_schema: schema
            });
            if (response) {
                setDynamicData(prev => ({ ...prev, ...response }));
            }
        } catch (error) {
            console.error(`Failed to load ${sectionName}:`, error);
        } finally {
            setLoadingSections(prev => ({ ...prev, [sectionName]: false }));
            setLoadedSections(prev => ({ ...prev, [sectionName]: true }));
        }
    };

    const loadSummaryOnly = async () => {
        const countriesStr = selectedCountries.join(', ');
        setLoadingSections(prev => ({ ...prev, summary: true }));
        try {
            const response = await base44.integrations.Core.InvokeLLM({
                prompt: `For ${countriesStr}: Generate summary analysis. Return: summary (string with key findings), keyInsights (4 strings).`,
                add_context_from_internet: true,
                response_json_schema: { type: "object", properties: { summary: { type: "string" }, keyInsights: { type: "array", items: { type: "string" } } } }
            });
            if (response) {
                setDynamicData(prev => ({ ...prev, ...response }));
                setAnalysisData({ summary: response.summary, keyInsights: response.keyInsights });
            }
        } catch (error) {
            console.error('Failed to load summary:', error);
        } finally {
            setLoadingSections(prev => ({ ...prev, summary: false }));
        }
    };

    const loadCategoryData = async (category) => {
        if (loadedSections[category]) return;

        const sectionConfigs = {
            infrastructure: {
                prompt: `Generate transportation, energy, telecom, water infrastructure data. Also add defense and public facilities. Return: transportData (5 items: type, count, capacity, condition, investment), transportStats (4 items: title, value, unit), energyData (6 items: source, capacity, share, growth, plants), energyStats (4), telecomData (4 items: type, count, coverage, investment, growth), telecomStats (4), waterData (4 items: type, count, capacity, condition, age), waterStats (4), defenseData (4 items: type, count, personnel, status, budget), defenseStats (4), publicFacilitiesData (4 items: type, count, capacity, condition, funding), publicFacilitiesStats (4).`,
                schema: { type: "object", properties: { transportData: { type: "array" }, transportStats: { type: "array" }, energyData: { type: "array" }, energyStats: { type: "array" }, telecomData: { type: "array" }, telecomStats: { type: "array" }, waterData: { type: "array" }, waterStats: { type: "array" }, defenseData: { type: "array" }, defenseStats: { type: "array" }, publicFacilitiesData: { type: "array" }, publicFacilitiesStats: { type: "array" } } }
            },
            resources: {
                prompt: `Generate natural resources data. Return: resourcesData (5 items: resource, reserves, production, value, rank), resourceStats (4), mineralsData (5 items: mineral, reserves, production, globalRank, value), mineralStats (4), agriculturalData (4 items: resource, amount, utilization, output, globalRank), agriculturalStats (4), humanCapitalData (4 items: metric, value, growth, globalRank), humanCapitalStats (4).`,
                schema: { type: "object", properties: { resourcesData: { type: "array" }, resourceStats: { type: "array" }, mineralsData: { type: "array" }, mineralStats: { type: "array" }, agriculturalData: { type: "array" }, agriculturalStats: { type: "array" }, humanCapitalData: { type: "array" }, humanCapitalStats: { type: "array" } } }
            },
            assets: {
                prompt: `Generate national assets data. Return: financialData (4 items: asset, value, change, type), financialStats (4), industrialData (4 items: sector, count, employment, output, growth), industrialStats (4), intellectualData (4 items: category, count, annual, value, globalShare), intellectualStats (4), strategicReservesData (4 items: reserve, capacity, current, value, days), strategicStats (4), digitalAssetsData (4 items: asset, count, capacity, investment, growth), digitalStats (4).`,
                schema: { type: "object", properties: { financialData: { type: "array" }, financialStats: { type: "array" }, industrialData: { type: "array" }, industrialStats: { type: "array" }, intellectualData: { type: "array" }, intellectualStats: { type: "array" }, strategicReservesData: { type: "array" }, strategicStats: { type: "array" }, digitalAssetsData: { type: "array" }, digitalStats: { type: "array" } } }
            },
            governance: {
                prompt: `Generate governance data. Return: governanceData (4 items: institution, count, personnel, budget, efficiency), governanceStats (4), lawEnforcementData (4 items: agency, personnel, budget, jurisdiction, clearRate), lawEnforcementStats (4).`,
                schema: { type: "object", properties: { governanceData: { type: "array" }, governanceStats: { type: "array" }, lawEnforcementData: { type: "array" }, lawEnforcementStats: { type: "array" } } }
            },
            economic: {
                prompt: `Generate economic data. Return: financialInfraData (4 items: type, count, assets, coverage, rating), financialInfraStats (4), tradeNetworksData (4 items: network, count, volume, value, globalRank), tradeStats (4), laborMarketData (4 items: metric, value, change, rate), laborStats (4).`,
                schema: { type: "object", properties: { financialInfraData: { type: "array" }, financialInfraStats: { type: "array" }, tradeNetworksData: { type: "array" }, tradeStats: { type: "array" }, laborMarketData: { type: "array" }, laborStats: { type: "array" } } }
            },
            social: {
                prompt: `Generate social data. Return: educationData (4 items: level, institutions, enrollment, teachers, spending), educationStats (4), healthcareData (4 items: facility, count, capacity, staff, spending), healthcareStats (4), socialSafetyData (4 items: program, beneficiaries, annual, coverage, fundStatus), socialSafetyStats (4).`,
                schema: { type: "object", properties: { educationData: { type: "array" }, educationStats: { type: "array" }, healthcareData: { type: "array" }, healthcareStats: { type: "array" }, socialSafetyData: { type: "array" }, socialSafetyStats: { type: "array" } } }
            },
            global: {
                prompt: `Generate global positioning data. Return: diplomaticData (4 items: type, count, personnel, regions, budget), diplomaticStats (4), geopoliticalData (4 items: asset, size, value, rank, control), geopoliticalStats (4), softPowerData (4 items: category, value, reach, rank, growth), softPowerStats (4).`,
                schema: { type: "object", properties: { diplomaticData: { type: "array" }, diplomaticStats: { type: "array" }, geopoliticalData: { type: "array" }, geopoliticalStats: { type: "array" }, softPowerData: { type: "array" }, softPowerStats: { type: "array" } } }
            },
            environment: {
                prompt: `Generate environment data. Return: climateResilienceData (4 items: system, count, capacity, investment, condition), climateStats (4), protectedAreasData (4 items: type, count, area, visitors, budget), protectedStats (4), renewablePotentialData (4 items: source, potential, installed, utilization, growth), renewableStats (4).`,
                schema: { type: "object", properties: { climateResilienceData: { type: "array" }, climateStats: { type: "array" }, protectedAreasData: { type: "array" }, protectedStats: { type: "array" }, renewablePotentialData: { type: "array" }, renewableStats: { type: "array" } } }
            }
        };

        const config = sectionConfigs[category];
        if (config) {
            await loadSectionData(category, config.prompt, config.schema);
        }
    };

    const energyTable = [
        { source: 'Natural Gas', capacity: '549 GW', share: '38%', growth: '+5.2%', plants: '1,875' },
        { source: 'Coal', capacity: '213 GW', share: '22%', growth: '-8.1%', plants: '241' },
        { source: 'Nuclear', capacity: '95 GW', share: '19%', growth: '+0.5%', plants: '93' },
        { source: 'Wind', capacity: '141 GW', share: '11%', growth: '+14.2%', plants: '72,000+' },
        { source: 'Solar', capacity: '97 GW', share: '6%', growth: '+23.6%', plants: '2.5M+' },
        { source: 'Hydro', capacity: '80 GW', share: '4%', growth: '+1.2%', plants: '2,198' }
    ];

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold">Geospatial Data</h1>
                            <p className="text-white/80">Infrastructure, Resources & National Assets Analytics</p>
                        </div>
                        <div className="flex gap-3 items-center">
                            <button
                                onClick={() => setShowCountryModal(true)}
                                className="flex items-center gap-2 px-4 py-3 bg-white/20 border-2 border-white/30 rounded-xl hover:bg-white/30 transition-all min-w-[200px]"
                            >
                                <Globe className="w-5 h-5 text-white" />
                                <span className="text-white font-medium">{selectedCountry || 'Select Country'}</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Tabs */}
                <div className="flex gap-1 bg-white rounded-xl p-1.5 border border-gray-200 w-fit">
                    <button
                        onClick={() => setMainTab('geomatics')}
                        className={`px-6 py-2.5 rounded-lg font-medium transition-all ${mainTab === 'geomatics' ? 'bg-purple-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                        Geomatics
                    </button>
                    <button
                        onClick={() => setMainTab('anomaly')}
                        className={`px-6 py-2.5 rounded-lg font-medium transition-all ${mainTab === 'anomaly' ? 'bg-purple-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                        Anomaly Detection
                    </button>
                    <button
                        onClick={() => setMainTab('models')}
                        className={`px-6 py-2.5 rounded-lg font-medium transition-all ${mainTab === 'models' ? 'bg-purple-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                        Geographical Models
                    </button>
                </div>

                {/* Geomatics Tab */}
                {mainTab === 'geomatics' && (
                    selectedCountries.length === 0 ? (
                        <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center">
                            <Globe className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-700 mb-2">Select Countries to Begin</h3>
                            <p className="text-sm text-gray-500">Choose one or more countries from the dropdown above to view infrastructure and resource data</p>
                        </div>
                    ) : (
                    <>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setActiveCategory(activeCategory === cat.id ? 'all' : cat.id)}
                                className={`p-4 rounded-xl border transition-all text-left ${activeCategory === cat.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white hover:border-gray-300'}`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${cat.color}15` }}>
                                        <cat.icon className="w-5 h-5" style={{ color: cat.color }} />
                                    </div>
                                    <div className="flex-1">
                                        <span className="font-medium text-gray-900 text-sm">{cat.name}</span>
                                        {loadedSections[cat.id] && (
                                            <span className="ml-2 text-xs text-green-600">✓</span>
                                        )}
                                        {loadingSections[cat.id] && (
                                            <Loader2 className="inline-block w-3 h-3 ml-2 animate-spin text-blue-600" />
                                        )}
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>

                    {activeCategory === 'all' && (
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
                            <Layers className="w-10 h-10 text-blue-500 mx-auto mb-3" />
                            <h3 className="text-lg font-semibold text-blue-900 mb-2">Select a Category</h3>
                            <p className="text-sm text-blue-700">Click on any category tile above to load and view its data</p>
                        </div>
                    )}

                {/* Analysis Summary */}
                {selectedCountries.length > 0 && loadingSections.summary && (
                    <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-6 border border-purple-100">
                        <div className="flex items-center justify-center py-8">
                            <Loader2 className="w-8 h-8 text-purple-600 animate-spin mr-3" />
                            <span className="text-gray-600">Generating AI analysis...</span>
                        </div>
                    </div>
                )}
                {selectedCountries.length > 0 && !loadingSections.summary && analysisData && (
                    <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-6 border border-purple-100">
                        <h3 className="font-bold text-gray-900 mb-3">AI Analysis Summary - {selectedCountries.join(', ')}</h3>
                        <div className="text-gray-700 mb-4 prose prose-sm max-w-none">
                            <ReactMarkdown>{analysisData.summary || ''}</ReactMarkdown>
                        </div>
                        {analysisData.keyInsights?.length > 0 && (
                            <div className="bg-white rounded-xl p-4">
                                <h4 className="font-semibold text-emerald-700 mb-2">Key Insights</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    {analysisData.keyInsights.map((item, i) => (
                                        <div key={i} className="text-sm text-gray-600 flex items-start gap-2">
                                            <ChevronRight className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                                            <span>{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* CORE INFRASTRUCTURE */}
                {selectedCountries.length > 0 && activeCategory === 'infrastructure' && (
                    <CategorySection
                        title={`Core Infrastructure - ${selectedCountries.join(', ')}`}
                        description="Transportation, energy, water, telecommunications, and defense systems"
                        icon={Building2}
                        color="#3B82F6"
                        stats={[]}
                    >
                        <Tabs defaultValue="transportation" className="mt-4">
                            <TabsList className="mb-4 flex-wrap">
                                <TabsTrigger value="transportation" className="gap-2"><Train className="w-4 h-4" /> Transportation</TabsTrigger>
                                <TabsTrigger value="energy" className="gap-2"><Zap className="w-4 h-4" /> Energy</TabsTrigger>
                                <TabsTrigger value="telecom" className="gap-2"><Wifi className="w-4 h-4" /> Telecom</TabsTrigger>
                                <TabsTrigger value="water" className="gap-2"><Droplets className="w-4 h-4" /> Water</TabsTrigger>
                                <TabsTrigger value="public" className="gap-2"><Building2 className="w-4 h-4" /> Public Facilities</TabsTrigger>
                                <TabsTrigger value="defense" className="gap-2"><Shield className="w-4 h-4" /> Defense</TabsTrigger>
                            </TabsList>

                            <TabsContent value="transportation">
                                {loadingSections.infrastructure ? (
                                    <div className="flex items-center justify-center py-16">
                                        <Loader2 className="w-8 h-8 text-blue-600 animate-spin mr-3" />
                                        <span className="text-gray-600">Loading transportation data...</span>
                                    </div>
                                ) : (
                                <>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                    {(dynamicData?.transportStats || []).map((stat, i) => (
                                        <AssetCard key={i} title={stat.title} value={stat.value} unit={stat.unit} icon={[Train, Train, Plane, Anchor][i]} color={['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6'][i]} />
                                    ))}
                                </div>
                                <DataTable
                                    title={`Transportation Infrastructure - ${selectedCountries.join(', ')}`}
                                    columns={[
                                        { key: 'type', label: 'Type' },
                                        { key: 'count', label: 'Count' },
                                        { key: 'capacity', label: 'Capacity' },
                                        { key: 'condition', label: 'Condition', render: (val) => (
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${val === 'Excellent' ? 'bg-emerald-100 text-emerald-700' : val === 'Good' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}`}>{val}</span>
                                        )},
                                        { key: 'investment', label: 'Investment' }
                                    ]}
                                    data={dynamicData?.transportData || []}
                                    maxRows={10}
                                />
                                </>
                                )}
                            </TabsContent>

                            <TabsContent value="energy">
                                {loadingSections.infrastructure ? (
                                    <div className="flex items-center justify-center py-16">
                                        <Loader2 className="w-8 h-8 text-blue-600 animate-spin mr-3" />
                                        <span className="text-gray-600">Loading energy data...</span>
                                    </div>
                                ) : (
                                <>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                    {(dynamicData?.energyStats || []).map((stat, i) => (
                                        <AssetCard key={i} title={stat.title} value={stat.value} unit={stat.unit} icon={[Zap, Zap, Sun, Fuel][i]} color={['#F59E0B', '#EF4444', '#10B981', '#8B5CF6'][i]} />
                                    ))}
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div className="bg-gray-50 rounded-xl p-5">
                                        <h4 className="font-semibold text-gray-900 mb-4">Energy Mix</h4>
                                        <div className="h-64">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <BarChart data={energyTable} layout="vertical">
                                                    <XAxis type="number" fontSize={10} />
                                                    <YAxis type="category" dataKey="source" fontSize={10} width={80} />
                                                    <Tooltip />
                                                    <Bar dataKey="share" radius={[0, 4, 4, 0]}>
                                                        {energyTable.map((entry, index) => (
                                                            <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                                        ))}
                                                    </Bar>
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>
                                    <DataTable
                                        title={`Power Generation - ${selectedCountries.join(', ')}`}
                                        columns={[
                                            { key: 'source', label: 'Source' },
                                            { key: 'capacity', label: 'Capacity' },
                                            { key: 'share', label: 'Share' },
                                            { key: 'plants', label: 'Plants' },
                                            { key: 'growth', label: 'Growth', render: (val) => (
                                                <span className={val?.startsWith?.('+') ? 'text-emerald-600' : 'text-red-600'}>{val}</span>
                                            )}
                                        ]}
                                        data={dynamicData?.energyData || []}
                                    />
                                </div>
                                <DataTable
                                    title={`Energy Resources - ${selectedCountries.join(', ')}`}
                                    columns={[
                                        { key: 'resource', label: 'Resource' },
                                        { key: 'reserves', label: 'Reserves' },
                                        { key: 'production', label: 'Production' },
                                        { key: 'value', label: 'Value' },
                                        { key: 'rank', label: 'Rank' }
                                    ]}
                                    data={dynamicData?.resourcesData || []}
                                />
                                </>
                                )}
                            </TabsContent>

                            <TabsContent value="telecom">
                                {loadingSections.infrastructure ? (
                                    <div className="flex items-center justify-center py-16">
                                        <Loader2 className="w-8 h-8 text-blue-600 animate-spin mr-3" />
                                        <span className="text-gray-600">Loading telecom data...</span>
                                    </div>
                                ) : (
                                <>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                    {(dynamicData?.telecomStats || []).map((stat, i) => (
                                        <AssetCard key={i} title={stat.title} value={stat.value} unit={stat.unit} icon={[Radio, Network, Server, Globe][i]} color={['#8B5CF6', '#3B82F6', '#10B981', '#F59E0B'][i]} />
                                    ))}
                                </div>
                                <DataTable
                                    title={`Telecommunications - ${selectedCountries.join(', ')}`}
                                    columns={[
                                        { key: 'type', label: 'Type' },
                                        { key: 'count', label: 'Count' },
                                        { key: 'coverage', label: 'Coverage' },
                                        { key: 'investment', label: 'Investment' },
                                        { key: 'growth', label: 'Growth', render: (val) => (
                                            <span className="text-emerald-600">{val}</span>
                                        )}
                                    ]}
                                    data={dynamicData?.telecomData || []}
                                />
                                </>
                                )}
                            </TabsContent>

                            <TabsContent value="water">
                                {loadingSections.infrastructure ? (
                                    <div className="flex items-center justify-center py-16">
                                        <Loader2 className="w-8 h-8 text-blue-600 animate-spin mr-3" />
                                        <span className="text-gray-600">Loading water data...</span>
                                    </div>
                                ) : (
                                <>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                    {(dynamicData?.waterStats || []).map((stat, i) => (
                                        <AssetCard key={i} title={stat.title} value={stat.value} unit={stat.unit} icon={Droplets} color={['#06B6D4', '#3B82F6', '#10B981', '#8B5CF6'][i]} />
                                    ))}
                                </div>
                                <DataTable
                                    title={`Water Infrastructure - ${selectedCountries.join(', ')}`}
                                    columns={[
                                        { key: 'type', label: 'Type' },
                                        { key: 'count', label: 'Count' },
                                        { key: 'capacity', label: 'Capacity' },
                                        { key: 'condition', label: 'Condition', render: (val) => (
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${val === 'Excellent' ? 'bg-emerald-100 text-emerald-700' : val === 'Good' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}`}>{val}</span>
                                        )},
                                        { key: 'age', label: 'Avg Age' }
                                    ]}
                                    data={dynamicData?.waterData || []}
                                />
                                </>
                                )}
                            </TabsContent>

                            <TabsContent value="public">
                                {loadingSections.infrastructure ? (
                                    <div className="flex items-center justify-center py-16">
                                        <Loader2 className="w-8 h-8 text-blue-600 animate-spin mr-3" />
                                        <span className="text-gray-600">Loading public facilities...</span>
                                    </div>
                                ) : (
                                <>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                    {(dynamicData?.publicFacilitiesStats || []).map((stat, i) => (
                                        <AssetCard key={i} title={stat.title} value={stat.value} unit={stat.unit} icon={[GraduationCap, Stethoscope, Shield, ShieldCheck][i]} color={['#EC4899', '#EF4444', '#F59E0B', '#3B82F6'][i]} />
                                    ))}
                                </div>
                                <DataTable
                                    title={`Public Facilities - ${selectedCountries.join(', ')}`}
                                    columns={[
                                        { key: 'type', label: 'Type' },
                                        { key: 'count', label: 'Count' },
                                        { key: 'capacity', label: 'Capacity' },
                                        { key: 'condition', label: 'Condition', render: (val) => (
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${val === 'Excellent' ? 'bg-emerald-100 text-emerald-700' : val === 'Good' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}`}>{val}</span>
                                        )},
                                        { key: 'funding', label: 'Annual Funding' }
                                    ]}
                                    data={dynamicData?.publicFacilitiesData || []}
                                />
                                </>
                                )}
                            </TabsContent>

                            <TabsContent value="defense">
                                {loadingSections.infrastructure ? (
                                    <div className="flex items-center justify-center py-16">
                                        <Loader2 className="w-8 h-8 text-blue-600 animate-spin mr-3" />
                                        <span className="text-gray-600">Loading defense data...</span>
                                    </div>
                                ) : (
                                <>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                    {(dynamicData?.defenseStats || []).map((stat, i) => (
                                        <AssetCard key={i} title={stat.title} value={stat.value} unit={stat.unit} icon={[Shield, Anchor, Plane, Shield][i]} color={['#EF4444', '#3B82F6', '#8B5CF6', '#10B981'][i]} />
                                    ))}
                                </div>
                                <DataTable
                                    title={`Defense Infrastructure - ${selectedCountries.join(', ')}`}
                                    columns={[
                                        { key: 'type', label: 'Type' },
                                        { key: 'count', label: 'Count' },
                                        { key: 'personnel', label: 'Personnel' },
                                        { key: 'status', label: 'Status', render: (val) => (
                                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">{val}</span>
                                        )},
                                        { key: 'budget', label: 'Budget' }
                                    ]}
                                    data={dynamicData?.defenseData || []}
                                />
                                </>
                                )}
                            </TabsContent>
                        </Tabs>
                    </CategorySection>
                )}

                {/* NATURAL & STRATEGIC RESOURCES */}
                {selectedCountries.length > 0 && activeCategory === 'resources' && (
                    <CategorySection
                        title={`Natural & Strategic Resources - ${selectedCountries.join(', ')}`}
                        description="Energy reserves, minerals, agricultural resources, human capital, and biodiversity"
                        icon={Fuel}
                        color="#10B981"
                        stats={[]}
                    >
                        <Tabs defaultValue="energy" className="mt-4">
                            <TabsList className="mb-4 flex-wrap">
                                <TabsTrigger value="energy" className="gap-2"><Fuel className="w-4 h-4" /> Energy Resources</TabsTrigger>
                                <TabsTrigger value="minerals" className="gap-2"><Database className="w-4 h-4" /> Minerals</TabsTrigger>
                                <TabsTrigger value="agricultural" className="gap-2"><Leaf className="w-4 h-4" /> Agricultural</TabsTrigger>
                                <TabsTrigger value="human" className="gap-2"><Users className="w-4 h-4" /> Human Capital</TabsTrigger>
                            </TabsList>

                            <TabsContent value="energy">
                                {loadingSections.resources ? (
                                    <div className="flex items-center justify-center py-16">
                                        <Loader2 className="w-8 h-8 text-green-600 animate-spin mr-3" />
                                        <span className="text-gray-600">Loading energy resources...</span>
                                    </div>
                                ) : (
                                <>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                    {(dynamicData?.resourceStats || []).map((stat, i) => (
                                        <AssetCard key={i} title={stat.title} value={stat.value} unit={stat.unit} icon={Fuel} color={['#F59E0B', '#3B82F6', '#6B7280', '#8B5CF6'][i]} />
                                    ))}
                                </div>
                                <DataTable
                                    title={`Energy Resources - ${selectedCountries.join(', ')}`}
                                    columns={[
                                        { key: 'resource', label: 'Resource' },
                                        { key: 'reserves', label: 'Reserves' },
                                        { key: 'production', label: 'Production' },
                                        { key: 'value', label: 'Value' },
                                        { key: 'rank', label: 'Rank' }
                                    ]}
                                    data={dynamicData?.resourcesData || []}
                                />
                                </>
                                )}
                            </TabsContent>

                            <TabsContent value="minerals">
                                {loadingSections.resources ? (
                                    <div className="flex items-center justify-center py-16">
                                        <Loader2 className="w-8 h-8 text-green-600 animate-spin mr-3" />
                                        <span className="text-gray-600">Loading minerals data...</span>
                                    </div>
                                ) : (
                                <>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                    {(dynamicData?.mineralStats || []).map((stat, i) => (
                                        <AssetCard key={i} title={stat.title} value={stat.value} unit={stat.unit} icon={[Database, Database, Coins, Database][i]} color={['#EF4444', '#F59E0B', '#F59E0B', '#8B5CF6'][i]} />
                                    ))}
                                </div>
                                <DataTable
                                    title={`Mineral Resources - ${selectedCountries.join(', ')}`}
                                    columns={[
                                        { key: 'mineral', label: 'Mineral' },
                                        { key: 'reserves', label: 'Reserves' },
                                        { key: 'production', label: 'Annual Production' },
                                        { key: 'globalRank', label: 'Global Rank' },
                                        { key: 'value', label: 'Annual Value' }
                                    ]}
                                    data={dynamicData?.mineralsData || []}
                                />
                                </>
                                )}
                            </TabsContent>

                            <TabsContent value="agricultural">
                                {loadingSections.resources ? (
                                    <div className="flex items-center justify-center py-16">
                                        <Loader2 className="w-8 h-8 text-green-600 animate-spin mr-3" />
                                        <span className="text-gray-600">Loading agricultural data...</span>
                                    </div>
                                ) : (
                                <>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                    {(dynamicData?.agriculturalStats || []).map((stat, i) => (
                                        <AssetCard key={i} title={stat.title} value={stat.value} unit={stat.unit} icon={[Leaf, TreePine, Droplets, Anchor][i]} color={['#10B981', '#059669', '#06B6D4', '#3B82F6'][i]} />
                                    ))}
                                </div>
                                <DataTable
                                    title={`Agricultural & Natural Resources - ${selectedCountries.join(', ')}`}
                                    columns={[
                                        { key: 'resource', label: 'Resource' },
                                        { key: 'amount', label: 'Amount' },
                                        { key: 'utilization', label: 'Utilization' },
                                        { key: 'output', label: 'Annual Output' },
                                        { key: 'globalRank', label: 'Global Rank' }
                                    ]}
                                    data={dynamicData?.agriculturalData || []}
                                />
                                </>
                                )}
                            </TabsContent>

                            <TabsContent value="human">
                                {loadingSections.resources ? (
                                    <div className="flex items-center justify-center py-16">
                                        <Loader2 className="w-8 h-8 text-green-600 animate-spin mr-3" />
                                        <span className="text-gray-600">Loading human capital data...</span>
                                    </div>
                                ) : (
                                <>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                    {(dynamicData?.humanCapitalStats || []).map((stat, i) => (
                                        <AssetCard key={i} title={stat.title} value={stat.value} unit={stat.unit} icon={[Users, Briefcase, GraduationCap, Award][i]} color={['#EC4899', '#3B82F6', '#8B5CF6', '#10B981'][i]} />
                                    ))}
                                </div>
                                <DataTable
                                    title={`Human Capital - ${selectedCountries.join(', ')}`}
                                    columns={[
                                        { key: 'metric', label: 'Metric' },
                                        { key: 'value', label: 'Value' },
                                        { key: 'growth', label: 'Growth' },
                                        { key: 'globalRank', label: 'Global Rank' }
                                    ]}
                                    data={dynamicData?.humanCapitalData || []}
                                />
                                </>
                                )}
                            </TabsContent>
                        </Tabs>
                    </CategorySection>
                )}

                {/* NATIONAL ASSETS */}
                {selectedCountries.length > 0 && activeCategory === 'assets' && (
                    <CategorySection
                        title={`National Assets - ${selectedCountries.join(', ')}`}
                        description="Financial, industrial, cultural, intellectual, strategic reserves, and digital assets"
                        icon={Landmark}
                        color="#F59E0B"
                        stats={[]}
                    >
                        <Tabs defaultValue="financial" className="mt-4">
                            <TabsList className="mb-4 flex-wrap">
                                <TabsTrigger value="financial" className="gap-2"><Banknote className="w-4 h-4" /> Financial</TabsTrigger>
                                <TabsTrigger value="industrial" className="gap-2"><Factory className="w-4 h-4" /> Industrial</TabsTrigger>
                                <TabsTrigger value="intellectual" className="gap-2"><Award className="w-4 h-4" /> Intellectual</TabsTrigger>
                                <TabsTrigger value="strategic" className="gap-2"><Shield className="w-4 h-4" /> Strategic Reserves</TabsTrigger>
                                <TabsTrigger value="digital" className="gap-2"><Server className="w-4 h-4" /> Digital Assets</TabsTrigger>
                            </TabsList>

                            <TabsContent value="financial">
                                {loadingSections.assets ? (
                                    <div className="flex items-center justify-center py-16">
                                        <Loader2 className="w-8 h-8 text-amber-600 animate-spin mr-3" />
                                        <span className="text-gray-600">Loading financial data...</span>
                                    </div>
                                ) : (
                                <>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                    {(dynamicData?.financialStats || []).map((stat, i) => (
                                        <AssetCard key={i} title={stat.title} value={stat.value} unit={stat.unit} icon={[Coins, Banknote, Landmark, Landmark][i]} color={['#F59E0B', '#10B981', '#3B82F6', '#8B5CF6'][i]} />
                                    ))}
                                </div>
                                <DataTable
                                    title={`Financial Assets - ${selectedCountries.join(', ')}`}
                                    columns={[
                                        { key: 'asset', label: 'Asset' },
                                        { key: 'value', label: 'Value' },
                                        { key: 'change', label: 'Change', render: (val) => (
                                            <span className={val?.startsWith?.('+') ? 'text-emerald-600' : 'text-red-600'}>{val}</span>
                                        )},
                                        { key: 'type', label: 'Type' }
                                    ]}
                                    data={dynamicData?.financialData || []}
                                />
                                </>
                                )}
                            </TabsContent>

                            <TabsContent value="industrial">
                                {loadingSections.assets ? (
                                    <div className="flex items-center justify-center py-16">
                                        <Loader2 className="w-8 h-8 text-amber-600 animate-spin mr-3" />
                                        <span className="text-gray-600">Loading industrial data...</span>
                                    </div>
                                ) : (
                                <>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                    {(dynamicData?.industrialStats || []).map((stat, i) => (
                                        <AssetCard key={i} title={stat.title} value={stat.value} unit={stat.unit} icon={[Factory, Cpu, Building2, Lightbulb][i]} color={['#EF4444', '#8B5CF6', '#3B82F6', '#10B981'][i]} />
                                    ))}
                                </div>
                                <DataTable
                                    title={`Industrial Assets - ${selectedCountries.join(', ')}`}
                                    columns={[
                                        { key: 'sector', label: 'Sector' },
                                        { key: 'count', label: 'Count' },
                                        { key: 'employment', label: 'Employment' },
                                        { key: 'output', label: 'Output' },
                                        { key: 'growth', label: 'Growth', render: (val) => (
                                            <span className="text-emerald-600">{val}</span>
                                        )}
                                    ]}
                                    data={dynamicData?.industrialData || []}
                                />
                                </>
                                )}
                            </TabsContent>

                            <TabsContent value="intellectual">
                                {loadingSections.assets ? (
                                    <div className="flex items-center justify-center py-16">
                                        <Loader2 className="w-8 h-8 text-amber-600 animate-spin mr-3" />
                                        <span className="text-gray-600">Loading intellectual assets...</span>
                                    </div>
                                ) : (
                                <>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                    {(dynamicData?.intellectualStats || []).map((stat, i) => (
                                        <AssetCard key={i} title={stat.title} value={stat.value} unit={stat.unit} icon={[Award, GraduationCap, Award, Lightbulb][i]} color={['#8B5CF6', '#3B82F6', '#F59E0B', '#10B981'][i]} />
                                    ))}
                                </div>
                                <DataTable
                                    title={`Intellectual Assets - ${selectedCountries.join(', ')}`}
                                    columns={[
                                        { key: 'category', label: 'Category' },
                                        { key: 'count', label: 'Count' },
                                        { key: 'annual', label: 'Annual' },
                                        { key: 'value', label: 'Value' },
                                        { key: 'globalShare', label: 'Global Share' }
                                    ]}
                                    data={dynamicData?.intellectualData || []}
                                />
                                </>
                                )}
                            </TabsContent>

                            <TabsContent value="strategic">
                                {loadingSections.assets ? (
                                    <div className="flex items-center justify-center py-16">
                                        <Loader2 className="w-8 h-8 text-amber-600 animate-spin mr-3" />
                                        <span className="text-gray-600">Loading strategic reserves...</span>
                                    </div>
                                ) : (
                                <>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                    {(dynamicData?.strategicStats || []).map((stat, i) => (
                                        <AssetCard key={i} title={stat.title} value={stat.value} unit={stat.unit} icon={[Fuel, Shield, Leaf, Stethoscope][i]} color={['#F59E0B', '#EF4444', '#10B981', '#8B5CF6'][i]} />
                                    ))}
                                </div>
                                <DataTable
                                    title={`Strategic Reserves - ${selectedCountries.join(', ')}`}
                                    columns={[
                                        { key: 'reserve', label: 'Reserve' },
                                        { key: 'capacity', label: 'Capacity' },
                                        { key: 'current', label: 'Current Level' },
                                        { key: 'value', label: 'Value' },
                                        { key: 'days', label: 'Coverage' }
                                    ]}
                                    data={dynamicData?.strategicReservesData || []}
                                />
                                </>
                                )}
                            </TabsContent>

                            <TabsContent value="digital">
                                {loadingSections.assets ? (
                                    <div className="flex items-center justify-center py-16">
                                        <Loader2 className="w-8 h-8 text-amber-600 animate-spin mr-3" />
                                        <span className="text-gray-600">Loading digital assets...</span>
                                    </div>
                                ) : (
                                <>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                    {(dynamicData?.digitalStats || []).map((stat, i) => (
                                        <AssetCard key={i} title={stat.title} value={stat.value} unit={stat.unit} icon={[Server, Globe, Cpu, Lock][i]} color={['#8B5CF6', '#3B82F6', '#10B981', '#EF4444'][i]} />
                                    ))}
                                </div>
                                <DataTable
                                    title={`Digital Assets - ${selectedCountries.join(', ')}`}
                                    columns={[
                                        { key: 'asset', label: 'Asset' },
                                        { key: 'count', label: 'Count' },
                                        { key: 'capacity', label: 'Capacity' },
                                        { key: 'investment', label: 'Investment' },
                                        { key: 'growth', label: 'Growth', render: (val) => (
                                            <span className="text-emerald-600">{val}</span>
                                        )}
                                    ]}
                                    data={dynamicData?.digitalAssetsData || []}
                                />
                                </>
                                )}
                            </TabsContent>
                        </Tabs>
                    </CategorySection>
                )}

                {/* GOVERNANCE & INSTITUTIONS */}
                {selectedCountries.length > 0 && activeCategory === 'governance' && (
                    <CategorySection
                        title={`Governance & Institutions - ${selectedCountries.join(', ')}`}
                        description="Legal system, political institutions, law enforcement, and public administration"
                        icon={Scale}
                        color="#8B5CF6"
                        stats={[]}
                    >
                        <Tabs defaultValue="legal" className="mt-4">
                            <TabsList className="mb-4 flex-wrap">
                                <TabsTrigger value="legal" className="gap-2"><Scale className="w-4 h-4" /> Legal System</TabsTrigger>
                                <TabsTrigger value="law" className="gap-2"><ShieldCheck className="w-4 h-4" /> Law Enforcement</TabsTrigger>
                            </TabsList>

                            <TabsContent value="legal">
                                {loadingSections.governance ? (
                                    <div className="flex items-center justify-center py-16">
                                        <Loader2 className="w-8 h-8 text-purple-600 animate-spin mr-3" />
                                        <span className="text-gray-600">Loading governance data...</span>
                                    </div>
                                ) : (
                                <>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                    {(dynamicData?.governanceStats || []).map((stat, i) => (
                                        <AssetCard key={i} title={stat.title} value={stat.value} unit={stat.unit} icon={[Scale, Scale, Building2, ShieldCheck][i]} color={['#8B5CF6', '#3B82F6', '#10B981', '#F59E0B'][i]} />
                                    ))}
                                </div>
                                <DataTable
                                    title={`Government Institutions - ${selectedCountries.join(', ')}`}
                                    columns={[
                                        { key: 'institution', label: 'Institution' },
                                        { key: 'count', label: 'Count' },
                                        { key: 'personnel', label: 'Personnel' },
                                        { key: 'budget', label: 'Budget' },
                                        { key: 'efficiency', label: 'Efficiency' }
                                    ]}
                                    data={dynamicData?.governanceData || []}
                                />
                                </>
                                )}
                            </TabsContent>

                            <TabsContent value="law">
                                {loadingSections.governance ? (
                                    <div className="flex items-center justify-center py-16">
                                        <Loader2 className="w-8 h-8 text-purple-600 animate-spin mr-3" />
                                        <span className="text-gray-600">Loading law enforcement...</span>
                                    </div>
                                ) : (
                                <>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                    {(dynamicData?.lawEnforcementStats || []).map((stat, i) => (
                                        <AssetCard key={i} title={stat.title} value={stat.value} unit={stat.unit} icon={[ShieldCheck, ShieldCheck, Shield, Lock][i]} color={['#EF4444', '#3B82F6', '#10B981', '#8B5CF6'][i]} />
                                    ))}
                                </div>
                                <DataTable
                                    title={`Law Enforcement - ${selectedCountries.join(', ')}`}
                                    columns={[
                                        { key: 'agency', label: 'Agency' },
                                        { key: 'personnel', label: 'Personnel' },
                                        { key: 'budget', label: 'Budget' },
                                        { key: 'jurisdiction', label: 'Jurisdiction' },
                                        { key: 'clearRate', label: 'Clear Rate' }
                                    ]}
                                    data={dynamicData?.lawEnforcementData || []}
                                />
                                </>
                                )}
                            </TabsContent>
                        </Tabs>
                    </CategorySection>
                )}

                {/* ECONOMIC SYSTEMS */}
                {selectedCountries.length > 0 && activeCategory === 'economic' && (
                    <CategorySection
                        title={`Economic Systems - ${selectedCountries.join(', ')}`}
                        description="Financial infrastructure, trade networks, industrial base, and labor markets"
                        icon={Briefcase}
                        color="#EF4444"
                        stats={[]}
                    >
                        <Tabs defaultValue="financial" className="mt-4">
                            <TabsList className="mb-4 flex-wrap">
                                <TabsTrigger value="financial" className="gap-2"><Banknote className="w-4 h-4" /> Financial Infra</TabsTrigger>
                                <TabsTrigger value="trade" className="gap-2"><Ship className="w-4 h-4" /> Trade Networks</TabsTrigger>
                                <TabsTrigger value="labor" className="gap-2"><Users className="w-4 h-4" /> Labor Market</TabsTrigger>
                            </TabsList>

                            <TabsContent value="financial">
                                {loadingSections.economic ? (
                                    <div className="flex items-center justify-center py-16">
                                        <Loader2 className="w-8 h-8 text-red-600 animate-spin mr-3" />
                                        <span className="text-gray-600">Loading financial infrastructure...</span>
                                    </div>
                                ) : (
                                <>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                    {(dynamicData?.financialInfraStats || []).map((stat, i) => (
                                        <AssetCard key={i} title={stat.title} value={stat.value} unit={stat.unit} icon={[Landmark, BarChart3, Shield, TrendingUp][i]} color={['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6'][i]} />
                                    ))}
                                </div>
                                <DataTable
                                    title={`Financial Infrastructure - ${selectedCountries.join(', ')}`}
                                    columns={[
                                        { key: 'type', label: 'Type' },
                                        { key: 'count', label: 'Count' },
                                        { key: 'assets', label: 'Assets/Volume' },
                                        { key: 'coverage', label: 'Coverage' },
                                        { key: 'rating', label: 'Rating' }
                                    ]}
                                    data={dynamicData?.financialInfraData || []}
                                />
                                </>
                                )}
                            </TabsContent>

                            <TabsContent value="trade">
                                {loadingSections.economic ? (
                                    <div className="flex items-center justify-center py-16">
                                        <Loader2 className="w-8 h-8 text-red-600 animate-spin mr-3" />
                                        <span className="text-gray-600">Loading trade networks...</span>
                                    </div>
                                ) : (
                                <>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                    {(dynamicData?.tradeStats || []).map((stat, i) => (
                                        <AssetCard key={i} title={stat.title} value={stat.value} unit={stat.unit} icon={[Anchor, Ship, Globe, Network][i]} color={['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B'][i]} />
                                    ))}
                                </div>
                                <DataTable
                                    title={`Trade Networks - ${selectedCountries.join(', ')}`}
                                    columns={[
                                        { key: 'network', label: 'Network' },
                                        { key: 'count', label: 'Count' },
                                        { key: 'volume', label: 'Volume' },
                                        { key: 'value', label: 'Value' },
                                        { key: 'globalRank', label: 'Global Rank' }
                                    ]}
                                    data={dynamicData?.tradeNetworksData || []}
                                />
                                </>
                                )}
                            </TabsContent>

                            <TabsContent value="labor">
                                {loadingSections.economic ? (
                                    <div className="flex items-center justify-center py-16">
                                        <Loader2 className="w-8 h-8 text-red-600 animate-spin mr-3" />
                                        <span className="text-gray-600">Loading labor market...</span>
                                    </div>
                                ) : (
                                <>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                    {(dynamicData?.laborStats || []).map((stat, i) => (
                                        <AssetCard key={i} title={stat.title} value={stat.value} unit={stat.unit} icon={[Users, Cpu, Briefcase, Users][i]} color={['#10B981', '#8B5CF6', '#F59E0B', '#3B82F6'][i]} />
                                    ))}
                                </div>
                                <DataTable
                                    title={`Labor Market - ${selectedCountries.join(', ')}`}
                                    columns={[
                                        { key: 'metric', label: 'Metric' },
                                        { key: 'value', label: 'Value' },
                                        { key: 'change', label: 'Change' },
                                        { key: 'rate', label: 'Rate/Share' }
                                    ]}
                                    data={dynamicData?.laborMarketData || []}
                                />
                                </>
                                )}
                            </TabsContent>
                        </Tabs>
                    </CategorySection>
                )}

                {/* SOCIAL & HUMAN DEVELOPMENT */}
                {selectedCountries.length > 0 && activeCategory === 'social' && (
                    <CategorySection
                        title={`Social & Human Development - ${selectedCountries.join(', ')}`}
                        description="Education systems, healthcare, social safety nets, and cultural institutions"
                        icon={Users}
                        color="#EC4899"
                        stats={[]}
                    >
                        <Tabs defaultValue="education" className="mt-4">
                            <TabsList className="mb-4 flex-wrap">
                                <TabsTrigger value="education" className="gap-2"><GraduationCap className="w-4 h-4" /> Education</TabsTrigger>
                                <TabsTrigger value="healthcare" className="gap-2"><Stethoscope className="w-4 h-4" /> Healthcare</TabsTrigger>
                                <TabsTrigger value="safety" className="gap-2"><Shield className="w-4 h-4" /> Social Safety Nets</TabsTrigger>
                            </TabsList>

                            <TabsContent value="education">
                                {loadingSections.social ? (
                                    <div className="flex items-center justify-center py-16">
                                        <Loader2 className="w-8 h-8 text-pink-600 animate-spin mr-3" />
                                        <span className="text-gray-600">Loading education data...</span>
                                    </div>
                                ) : (
                                <>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                    {(dynamicData?.educationStats || []).map((stat, i) => (
                                        <AssetCard key={i} title={stat.title} value={stat.value} unit={stat.unit} icon={[GraduationCap, BookOpen, GraduationCap, Banknote][i]} color={['#EC4899', '#8B5CF6', '#3B82F6', '#10B981'][i]} />
                                    ))}
                                </div>
                                <DataTable
                                    title={`Education Systems - ${selectedCountries.join(', ')}`}
                                    columns={[
                                        { key: 'level', label: 'Level' },
                                        { key: 'institutions', label: 'Institutions' },
                                        { key: 'enrollment', label: 'Enrollment' },
                                        { key: 'teachers', label: 'Teachers' },
                                        { key: 'spending', label: 'Spending' }
                                    ]}
                                    data={dynamicData?.educationData || []}
                                />
                                </>
                                )}
                            </TabsContent>

                            <TabsContent value="healthcare">
                                {loadingSections.social ? (
                                    <div className="flex items-center justify-center py-16">
                                        <Loader2 className="w-8 h-8 text-pink-600 animate-spin mr-3" />
                                        <span className="text-gray-600">Loading healthcare data...</span>
                                    </div>
                                ) : (
                                <>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                    {(dynamicData?.healthcareStats || []).map((stat, i) => (
                                        <AssetCard key={i} title={stat.title} value={stat.value} unit={stat.unit} icon={[Stethoscope, Heart, Stethoscope, Banknote][i]} color={['#EF4444', '#EC4899', '#10B981', '#3B82F6'][i]} />
                                    ))}
                                </div>
                                <DataTable
                                    title={`Healthcare Systems - ${selectedCountries.join(', ')}`}
                                    columns={[
                                        { key: 'facility', label: 'Facility Type' },
                                        { key: 'count', label: 'Count' },
                                        { key: 'capacity', label: 'Capacity' },
                                        { key: 'staff', label: 'Staff' },
                                        { key: 'spending', label: 'Spending' }
                                    ]}
                                    data={dynamicData?.healthcareData || []}
                                />
                                </>
                                )}
                            </TabsContent>

                            <TabsContent value="safety">
                                {loadingSections.social ? (
                                    <div className="flex items-center justify-center py-16">
                                        <Loader2 className="w-8 h-8 text-pink-600 animate-spin mr-3" />
                                        <span className="text-gray-600">Loading social safety nets...</span>
                                    </div>
                                ) : (
                                <>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                    {(dynamicData?.socialSafetyStats || []).map((stat, i) => (
                                        <AssetCard key={i} title={stat.title} value={stat.value} unit={stat.unit} icon={[Users, Heart, Heart, Leaf][i]} color={['#8B5CF6', '#EF4444', '#10B981', '#F59E0B'][i]} />
                                    ))}
                                </div>
                                <DataTable
                                    title={`Social Safety Net - ${selectedCountries.join(', ')}`}
                                    columns={[
                                        { key: 'program', label: 'Program' },
                                        { key: 'beneficiaries', label: 'Beneficiaries' },
                                        { key: 'annual', label: 'Annual Budget' },
                                        { key: 'coverage', label: 'Coverage' },
                                        { key: 'fundStatus', label: 'Fund Status' }
                                    ]}
                                    data={dynamicData?.socialSafetyData || []}
                                />
                                </>
                                )}
                            </TabsContent>
                        </Tabs>
                    </CategorySection>
                )}

                {/* GLOBAL & STRATEGIC POSITIONING */}
                {selectedCountries.length > 0 && activeCategory === 'global' && (
                    <CategorySection
                        title={`Global & Strategic Positioning - ${selectedCountries.join(', ')}`}
                        description="Diplomatic networks, geopolitical assets, soft power, and cyber infrastructure"
                        icon={Globe}
                        color="#06B6D4"
                        stats={[]}
                    >
                        <Tabs defaultValue="diplomatic" className="mt-4">
                            <TabsList className="mb-4 flex-wrap">
                                <TabsTrigger value="diplomatic" className="gap-2"><Globe className="w-4 h-4" /> Diplomatic</TabsTrigger>
                                <TabsTrigger value="geopolitical" className="gap-2"><Map className="w-4 h-4" /> Geopolitical</TabsTrigger>
                                <TabsTrigger value="softpower" className="gap-2"><Award className="w-4 h-4" /> Soft Power</TabsTrigger>
                            </TabsList>

                            <TabsContent value="diplomatic">
                                {loadingSections.global ? (
                                    <div className="flex items-center justify-center py-16">
                                        <Loader2 className="w-8 h-8 text-cyan-600 animate-spin mr-3" />
                                        <span className="text-gray-600">Loading diplomatic data...</span>
                                    </div>
                                ) : (
                                <>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                    {(dynamicData?.diplomaticStats || []).map((stat, i) => (
                                        <AssetCard key={i} title={stat.title} value={stat.value} unit={stat.unit} icon={[Building2, Building2, Shield, Briefcase][i]} color={['#06B6D4', '#3B82F6', '#EF4444', '#10B981'][i]} />
                                    ))}
                                </div>
                                <DataTable
                                    title={`Diplomatic Networks - ${selectedCountries.join(', ')}`}
                                    columns={[
                                        { key: 'type', label: 'Type' },
                                        { key: 'count', label: 'Count' },
                                        { key: 'personnel', label: 'Personnel' },
                                        { key: 'regions', label: 'Regions' },
                                        { key: 'budget', label: 'Budget' }
                                    ]}
                                    data={dynamicData?.diplomaticData || []}
                                />
                                </>
                                )}
                            </TabsContent>

                            <TabsContent value="geopolitical">
                                {loadingSections.global ? (
                                    <div className="flex items-center justify-center py-16">
                                        <Loader2 className="w-8 h-8 text-cyan-600 animate-spin mr-3" />
                                        <span className="text-gray-600">Loading geopolitical data...</span>
                                    </div>
                                ) : (
                                <>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                    {(dynamicData?.geopoliticalStats || []).map((stat, i) => (
                                        <AssetCard key={i} title={stat.title} value={stat.value} unit={stat.unit} icon={[Anchor, Plane, Globe, Ship][i]} color={['#3B82F6', '#8B5CF6', '#F59E0B', '#10B981'][i]} />
                                    ))}
                                </div>
                                <DataTable
                                    title={`Geopolitical Assets - ${selectedCountries.join(', ')}`}
                                    columns={[
                                        { key: 'asset', label: 'Asset' },
                                        { key: 'size', label: 'Size/Count' },
                                        { key: 'value', label: 'Value' },
                                        { key: 'rank', label: 'Global Rank' },
                                        { key: 'control', label: 'Control' }
                                    ]}
                                    data={dynamicData?.geopoliticalData || []}
                                />
                                </>
                                )}
                            </TabsContent>

                            <TabsContent value="softpower">
                                {loadingSections.global ? (
                                    <div className="flex items-center justify-center py-16">
                                        <Loader2 className="w-8 h-8 text-cyan-600 animate-spin mr-3" />
                                        <span className="text-gray-600">Loading soft power data...</span>
                                    </div>
                                ) : (
                                <>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                    {(dynamicData?.softPowerStats || []).map((stat, i) => (
                                        <AssetCard key={i} title={stat.title} value={stat.value} unit={stat.unit} icon={[Award, GraduationCap, Radio, Globe][i]} color={['#EC4899', '#8B5CF6', '#3B82F6', '#10B981'][i]} />
                                    ))}
                                </div>
                                <DataTable
                                    title={`Soft Power - ${selectedCountries.join(', ')}`}
                                    columns={[
                                        { key: 'category', label: 'Category' },
                                        { key: 'value', label: 'Value' },
                                        { key: 'reach', label: 'Reach' },
                                        { key: 'rank', label: 'Global Rank' },
                                        { key: 'growth', label: 'Growth', render: (val) => (
                                            <span className="text-emerald-600">{val}</span>
                                        )}
                                    ]}
                                    data={dynamicData?.softPowerData || []}
                                />
                                </>
                                )}
                            </TabsContent>
                        </Tabs>
                    </CategorySection>
                )}

                {/* ENVIRONMENTAL & SUSTAINABILITY */}
                {selectedCountries.length > 0 && activeCategory === 'environment' && (
                    <CategorySection
                        title={`Environmental & Sustainability - ${selectedCountries.join(', ')}`}
                        description="Climate resilience, protected areas, and renewable energy potential"
                        icon={Leaf}
                        color="#84CC16"
                        stats={[]}
                    >
                        <Tabs defaultValue="climate" className="mt-4">
                            <TabsList className="mb-4 flex-wrap">
                                <TabsTrigger value="climate" className="gap-2"><Shield className="w-4 h-4" /> Climate Resilience</TabsTrigger>
                                <TabsTrigger value="protected" className="gap-2"><TreePine className="w-4 h-4" /> Protected Areas</TabsTrigger>
                                <TabsTrigger value="renewable" className="gap-2"><Sun className="w-4 h-4" /> Renewable Potential</TabsTrigger>
                            </TabsList>

                            <TabsContent value="climate">
                                {loadingSections.environment ? (
                                    <div className="flex items-center justify-center py-16">
                                        <Loader2 className="w-8 h-8 text-lime-600 animate-spin mr-3" />
                                        <span className="text-gray-600">Loading climate resilience...</span>
                                    </div>
                                ) : (
                                <>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                    {(dynamicData?.climateStats || []).map((stat, i) => (
                                        <AssetCard key={i} title={stat.title} value={stat.value} unit={stat.unit} icon={[Droplets, Zap, Shield, Shield][i]} color={['#06B6D4', '#EF4444', '#3B82F6', '#10B981'][i]} />
                                    ))}
                                </div>
                                <DataTable
                                    title={`Climate Resilience - ${selectedCountries.join(', ')}`}
                                    columns={[
                                        { key: 'system', label: 'System' },
                                        { key: 'count', label: 'Count' },
                                        { key: 'capacity', label: 'Capacity' },
                                        { key: 'investment', label: 'Investment' },
                                        { key: 'condition', label: 'Condition', render: (val) => (
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${val === 'Excellent' ? 'bg-emerald-100 text-emerald-700' : val === 'Good' ? 'bg-blue-100 text-blue-700' : val === 'Strained' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>{val}</span>
                                        )}
                                    ]}
                                    data={dynamicData?.climateResilienceData || []}
                                />
                                </>
                                )}
                            </TabsContent>

                            <TabsContent value="protected">
                                {loadingSections.environment ? (
                                    <div className="flex items-center justify-center py-16">
                                        <Loader2 className="w-8 h-8 text-lime-600 animate-spin mr-3" />
                                        <span className="text-gray-600">Loading protected areas...</span>
                                    </div>
                                ) : (
                                <>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                    {(dynamicData?.protectedStats || []).map((stat, i) => (
                                        <AssetCard key={i} title={stat.title} value={stat.value} unit={stat.unit} icon={[TreePine, TreePine, Leaf, Anchor][i]} color={['#84CC16', '#10B981', '#059669', '#06B6D4'][i]} />
                                    ))}
                                </div>
                                <DataTable
                                    title={`Protected Areas - ${selectedCountries.join(', ')}`}
                                    columns={[
                                        { key: 'type', label: 'Type' },
                                        { key: 'count', label: 'Count' },
                                        { key: 'area', label: 'Area' },
                                        { key: 'visitors', label: 'Annual Visitors' },
                                        { key: 'budget', label: 'Budget' }
                                    ]}
                                    data={dynamicData?.protectedAreasData || []}
                                />
                                </>
                                )}
                            </TabsContent>

                            <TabsContent value="renewable">
                                {loadingSections.environment ? (
                                    <div className="flex items-center justify-center py-16">
                                        <Loader2 className="w-8 h-8 text-lime-600 animate-spin mr-3" />
                                        <span className="text-gray-600">Loading renewable potential...</span>
                                    </div>
                                ) : (
                                <>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                    {(dynamicData?.renewableStats || []).map((stat, i) => (
                                        <AssetCard key={i} title={stat.title} value={stat.value} unit={stat.unit} icon={[Sun, Wind, Droplets, Zap][i]} color={['#F59E0B', '#3B82F6', '#06B6D4', '#EF4444'][i]} />
                                    ))}
                                </div>
                                <DataTable
                                    title={`Renewable Energy - ${selectedCountries.join(', ')}`}
                                    columns={[
                                        { key: 'source', label: 'Source' },
                                        { key: 'potential', label: 'Potential' },
                                        { key: 'installed', label: 'Installed' },
                                        { key: 'utilization', label: 'Utilization' },
                                        { key: 'growth', label: 'Growth', render: (val) => (
                                            <span className="text-emerald-600">{val}</span>
                                        )}
                                    ]}
                                    data={dynamicData?.renewablePotentialData || []}
                                />
                                </>
                                )}
                            </TabsContent>
                        </Tabs>
                    </CategorySection>
                )}
                </>
                )
                )}

                {/* Anomaly Detection Tab */}
                {mainTab === 'anomaly' && (
                    <AnomalyDetection selectedCountries={selectedCountries} />
                )}

                {/* Geographical Models Tab */}
                {mainTab === 'models' && (
                    <GeographicalModels selectedCountries={selectedCountries} />
                )}

                <CountrySelectModal
                    isOpen={showCountryModal}
                    onClose={() => setShowCountryModal(false)}
                    selectedCountry={selectedCountry}
                    onSelect={setSelectedCountry}
                    title="Select Country for Analysis"
                />
            </div>
        </div>
    );
}