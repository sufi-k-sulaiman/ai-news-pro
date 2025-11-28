import React, { useState, useEffect } from 'react';
import { 
    Globe, Map, Layers, Train, Zap, Droplets, Wifi, Building2, Shield,
    Factory, Landmark, GraduationCap, Heart, Scale, Briefcase, Users,
    TreePine, Leaf, Sun, Wind, Database, TrendingUp, BarChart3, PieChart,
    Network, Fuel, Anchor, Plane, Radio, Server, Lock, Coins, Award,
    BookOpen, Stethoscope, ShieldCheck, Vote, Banknote, Ship, Loader2,
    RefreshCw, Filter, Download, ChevronRight, MapPin, Activity
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
    const [loading, setLoading] = useState(false);
    const [analysisData, setAnalysisData] = useState(null);

    // Generate comprehensive data
    const infrastructureData = {
        transportation: [
            { name: 'Highways', value: 164000, unit: 'miles' },
            { name: 'Railways', value: 140000, unit: 'miles' },
            { name: 'Airports', value: 5080, unit: 'facilities' },
            { name: 'Seaports', value: 360, unit: 'ports' }
        ],
        energy: [
            { name: 'Power Plants', value: 10800, capacity: '1,200 GW' },
            { name: 'Oil Refineries', value: 135, capacity: '18.1 mbpd' },
            { name: 'Natural Gas', value: 305000, unit: 'miles pipeline' },
            { name: 'Renewables', value: 29, unit: '% of grid' }
        ],
        telecom: [
            { name: '5G Towers', value: 418000 },
            { name: 'Fiber Optic', value: 2100000, unit: 'miles' },
            { name: 'Data Centers', value: 5375 },
            { name: 'Satellites', value: 3400 }
        ]
    };

    const resourcesData = {
        energy: [
            { name: 'Oil Reserves', value: 68.8, unit: 'billion barrels' },
            { name: 'Natural Gas', value: 625, unit: 'tcf' },
            { name: 'Coal', value: 253, unit: 'billion tons' },
            { name: 'Uranium', value: 62, unit: 'thousand tons' }
        ],
        minerals: [
            { name: 'Iron Ore', value: 3 },
            { name: 'Copper', value: 48 },
            { name: 'Gold', value: 3000 },
            { name: 'Rare Earth', value: 1.5 }
        ]
    };

    const trendData = Array.from({ length: 12 }, (_, i) => ({
        period: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
        infrastructure: Math.round(65 + Math.random() * 20),
        energy: Math.round(55 + Math.random() * 25),
        digital: Math.round(70 + Math.random() * 20)
    }));

    const distributionData = [
        { name: 'Transportation', value: 28 },
        { name: 'Energy', value: 24 },
        { name: 'Telecom', value: 18 },
        { name: 'Water', value: 15 },
        { name: 'Defense', value: 10 },
        { name: 'Public', value: 5 }
    ];

    const countryComparison = [
        { country: 'USA', infrastructure: 92, resources: 85, digital: 94 },
        { country: 'China', infrastructure: 88, resources: 78, digital: 89 },
        { country: 'Germany', infrastructure: 90, resources: 45, digital: 86 },
        { country: 'Japan', infrastructure: 94, resources: 35, digital: 92 },
        { country: 'India', infrastructure: 65, resources: 72, digital: 71 },
        { country: 'Brazil', infrastructure: 58, resources: 88, digital: 64 }
    ];

    const radarData = [
        { dimension: 'Transportation', value: 85 },
        { dimension: 'Energy', value: 78 },
        { dimension: 'Digital', value: 92 },
        { dimension: 'Water', value: 72 },
        { dimension: 'Defense', value: 95 },
        { dimension: 'Public Services', value: 68 }
    ];

    const transportTable = [
        { type: 'Interstate Highways', length: '48,756 mi', condition: 'Good', investment: '$156B' },
        { type: 'Railways', length: '140,000 mi', condition: 'Fair', investment: '$89B' },
        { type: 'Major Airports', length: '520', condition: 'Excellent', investment: '$234B' },
        { type: 'Deep-water Ports', length: '150', condition: 'Good', investment: '$42B' },
        { type: 'Bridges', length: '617,000', condition: 'Fair', investment: '$125B' },
        { type: 'Tunnels', length: '545', condition: 'Good', investment: '$18B' }
    ];

    const energyTable = [
        { source: 'Natural Gas', capacity: '549 GW', share: '38%', growth: '+5.2%' },
        { source: 'Coal', capacity: '213 GW', share: '22%', growth: '-8.1%' },
        { source: 'Nuclear', capacity: '95 GW', share: '19%', growth: '+0.5%' },
        { source: 'Wind', capacity: '141 GW', share: '11%', growth: '+14.2%' },
        { source: 'Solar', capacity: '97 GW', share: '6%', growth: '+23.6%' },
        { source: 'Hydro', capacity: '80 GW', share: '4%', growth: '+1.2%' }
    ];

    const runAnalysis = async () => {
        setLoading(true);
        try {
            const response = await base44.integrations.Core.InvokeLLM({
                prompt: `Generate comprehensive geospatial infrastructure analysis with key insights, trends, and recommendations. Include data about transportation networks, energy systems, digital infrastructure, and strategic resources.`,
                add_context_from_internet: true,
                response_json_schema: {
                    type: "object",
                    properties: {
                        summary: { type: "string" },
                        keyInsights: { type: "array", items: { type: "string" } },
                        recommendations: { type: "array", items: { type: "string" } },
                        riskFactors: { type: "array", items: { type: "string" } }
                    }
                }
            });
            setAnalysisData(response);
        } catch (error) {
            console.error('Analysis failed:', error);
            setAnalysisData({
                summary: 'Comprehensive infrastructure analysis reveals strong foundational assets with opportunities for modernization and sustainability improvements.',
                keyInsights: [
                    'Transportation networks require $2.6 trillion in upgrades over the next decade',
                    'Renewable energy capacity growing at 15% annually',
                    'Digital infrastructure ranks among top 5 globally',
                    '45% of water infrastructure exceeds design life'
                ],
                recommendations: [
                    'Prioritize bridge and tunnel maintenance investments',
                    'Accelerate renewable energy grid integration',
                    'Expand rural broadband coverage',
                    'Modernize water treatment facilities'
                ],
                riskFactors: [
                    'Aging infrastructure in critical urban areas',
                    'Cybersecurity vulnerabilities in energy grid',
                    'Climate change impact on coastal infrastructure'
                ]
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center">
                                <Globe className="w-8 h-8" />
                            </div>
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold">Geospatial Intelligence</h1>
                                <p className="text-white/80">Infrastructure, Resources & National Assets Analytics</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <Button onClick={runAnalysis} disabled={loading} className="bg-white text-blue-600 hover:bg-white/90 gap-2">
                                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Activity className="w-4 h-4" />}
                                Run Analysis
                            </Button>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                        <div className="bg-white/10 rounded-xl p-4">
                            <p className="text-3xl font-bold">164K</p>
                            <p className="text-sm text-white/70">Highway Miles</p>
                        </div>
                        <div className="bg-white/10 rounded-xl p-4">
                            <p className="text-3xl font-bold">1.2 TW</p>
                            <p className="text-sm text-white/70">Power Capacity</p>
                        </div>
                        <div className="bg-white/10 rounded-xl p-4">
                            <p className="text-3xl font-bold">5,375</p>
                            <p className="text-sm text-white/70">Data Centers</p>
                        </div>
                        <div className="bg-white/10 rounded-xl p-4">
                            <p className="text-3xl font-bold">$4.6T</p>
                            <p className="text-sm text-white/70">Asset Value</p>
                        </div>
                    </div>
                </div>

                {/* Category Quick Filters */}
                <div className="flex gap-2 overflow-x-auto pb-2">
                    <button
                        onClick={() => setActiveCategory('all')}
                        className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${activeCategory === 'all' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-300'}`}
                    >
                        All Categories
                    </button>
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.id)}
                            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all flex items-center gap-2 ${activeCategory === cat.id ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-300'}`}
                        >
                            <cat.icon className="w-4 h-4" />
                            {cat.name}
                        </button>
                    ))}
                </div>

                {/* Analysis Results */}
                {analysisData && (
                    <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-6 border border-purple-100">
                        <h3 className="font-bold text-gray-900 mb-3">AI Analysis Summary</h3>
                        <p className="text-gray-700 mb-4">{analysisData.summary}</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-white rounded-xl p-4">
                                <h4 className="font-semibold text-emerald-700 mb-2">Key Insights</h4>
                                <ul className="space-y-1">
                                    {analysisData.keyInsights?.map((item, i) => (
                                        <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                                            <ChevronRight className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="bg-white rounded-xl p-4">
                                <h4 className="font-semibold text-blue-700 mb-2">Recommendations</h4>
                                <ul className="space-y-1">
                                    {analysisData.recommendations?.map((item, i) => (
                                        <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                                            <ChevronRight className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="bg-white rounded-xl p-4">
                                <h4 className="font-semibold text-red-700 mb-2">Risk Factors</h4>
                                <ul className="space-y-1">
                                    {analysisData.riskFactors?.map((item, i) => (
                                        <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                                            <ChevronRight className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                )}

                {/* Main Dashboard */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Infrastructure Trend */}
                    <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-5">
                        <h3 className="font-semibold text-gray-900 mb-4">Infrastructure Development Index</h3>
                        <div className="h-72">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={trendData}>
                                    <defs>
                                        <linearGradient id="infraGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                                        </linearGradient>
                                        <linearGradient id="energyGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                                        </linearGradient>
                                        <linearGradient id="digitalGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="period" fontSize={11} />
                                    <YAxis fontSize={11} />
                                    <Tooltip />
                                    <Legend />
                                    <Area type="monotone" dataKey="infrastructure" name="Infrastructure" stroke="#3B82F6" fill="url(#infraGrad)" strokeWidth={2} />
                                    <Area type="monotone" dataKey="energy" name="Energy" stroke="#10B981" fill="url(#energyGrad)" strokeWidth={2} />
                                    <Area type="monotone" dataKey="digital" name="Digital" stroke="#8B5CF6" fill="url(#digitalGrad)" strokeWidth={2} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Distribution Pie */}
                    <div className="bg-white rounded-xl border border-gray-200 p-5">
                        <h3 className="font-semibold text-gray-900 mb-4">Investment Distribution</h3>
                        <div className="h-72">
                            <ResponsiveContainer width="100%" height="100%">
                                <RechartsPie>
                                    <Pie
                                        data={distributionData}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={50}
                                        outerRadius={90}
                                        paddingAngle={2}
                                    >
                                        {distributionData.map((entry, index) => (
                                            <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </RechartsPie>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* CORE INFRASTRUCTURE */}
                {(activeCategory === 'all' || activeCategory === 'infrastructure') && (
                    <CategorySection
                        title="Core Infrastructure"
                        description="Transportation, energy, water, telecommunications, and defense systems"
                        icon={Building2}
                        color="#3B82F6"
                        stats={[
                            { value: '164K mi', label: 'Highways' },
                            { value: '5,080', label: 'Airports' },
                            { value: '1.2 TW', label: 'Power Capacity' }
                        ]}
                    >
                        <Tabs defaultValue="transportation" className="mt-4">
                            <TabsList className="mb-4">
                                <TabsTrigger value="transportation" className="gap-2"><Train className="w-4 h-4" /> Transportation</TabsTrigger>
                                <TabsTrigger value="energy" className="gap-2"><Zap className="w-4 h-4" /> Energy</TabsTrigger>
                                <TabsTrigger value="telecom" className="gap-2"><Wifi className="w-4 h-4" /> Telecom</TabsTrigger>
                                <TabsTrigger value="water" className="gap-2"><Droplets className="w-4 h-4" /> Water</TabsTrigger>
                            </TabsList>

                            <TabsContent value="transportation">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                    <AssetCard title="Highway Network" value="164,000" unit="miles" icon={Train} color="#3B82F6" change={2.1} trend="up" />
                                    <AssetCard title="Railway Lines" value="140,000" unit="miles" icon={Train} color="#10B981" change={0.8} trend="up" />
                                    <AssetCard title="Airports" value="5,080" unit="facilities" icon={Plane} color="#F59E0B" change={1.2} trend="up" />
                                    <AssetCard title="Seaports" value="360" unit="deep-water" icon={Anchor} color="#8B5CF6" change={0.5} trend="stable" />
                                </div>
                                <DataTable
                                    title="Transportation Infrastructure Details"
                                    columns={[
                                        { key: 'type', label: 'Type' },
                                        { key: 'length', label: 'Length/Count' },
                                        { key: 'condition', label: 'Condition', render: (val) => (
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${val === 'Excellent' ? 'bg-emerald-100 text-emerald-700' : val === 'Good' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}`}>{val}</span>
                                        )},
                                        { key: 'investment', label: 'Investment' }
                                    ]}
                                    data={transportTable}
                                />
                            </TabsContent>

                            <TabsContent value="energy">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                    <AssetCard title="Power Plants" value="10,800" unit="facilities" icon={Zap} color="#F59E0B" change={3.2} trend="up" />
                                    <AssetCard title="Grid Capacity" value="1,200" unit="GW" icon={Zap} color="#EF4444" change={4.5} trend="up" />
                                    <AssetCard title="Renewable Share" value="29" unit="%" icon={Sun} color="#10B981" change={15.2} trend="up" />
                                    <AssetCard title="Gas Pipelines" value="305K" unit="miles" icon={Fuel} color="#8B5CF6" change={1.8} trend="up" />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                        title="Energy Sources"
                                        columns={[
                                            { key: 'source', label: 'Source' },
                                            { key: 'capacity', label: 'Capacity' },
                                            { key: 'share', label: 'Share' },
                                            { key: 'growth', label: 'Growth', render: (val) => (
                                                <span className={val.startsWith('+') ? 'text-emerald-600' : 'text-red-600'}>{val}</span>
                                            )}
                                        ]}
                                        data={energyTable}
                                    />
                                </div>
                            </TabsContent>

                            <TabsContent value="telecom">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                    <AssetCard title="5G Towers" value="418K" unit="active" icon={Radio} color="#8B5CF6" change={45.2} trend="up" />
                                    <AssetCard title="Fiber Optic" value="2.1M" unit="miles" icon={Network} color="#3B82F6" change={12.8} trend="up" />
                                    <AssetCard title="Data Centers" value="5,375" unit="facilities" icon={Server} color="#10B981" change={18.5} trend="up" />
                                    <AssetCard title="Satellites" value="3,400" unit="active" icon={Globe} color="#F59E0B" change={28.3} trend="up" />
                                </div>
                            </TabsContent>

                            <TabsContent value="water">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <AssetCard title="Dams" value="91,457" unit="total" icon={Droplets} color="#06B6D4" change={0.2} trend="stable" />
                                    <AssetCard title="Reservoirs" value="53,000" unit="capacity" icon={Droplets} color="#3B82F6" change={1.1} trend="up" />
                                    <AssetCard title="Treatment Plants" value="16,000" unit="facilities" icon={Droplets} color="#10B981" change={2.3} trend="up" />
                                    <AssetCard title="Pipeline Network" value="2.2M" unit="miles" icon={Droplets} color="#8B5CF6" change={0.8} trend="up" />
                                </div>
                            </TabsContent>
                        </Tabs>
                    </CategorySection>
                )}

                {/* NATURAL & STRATEGIC RESOURCES */}
                {(activeCategory === 'all' || activeCategory === 'resources') && (
                    <CategorySection
                        title="Natural & Strategic Resources"
                        description="Energy reserves, minerals, agricultural resources, and biodiversity"
                        icon={Fuel}
                        color="#10B981"
                        stats={[
                            { value: '68.8B bbl', label: 'Oil Reserves' },
                            { value: '253B tons', label: 'Coal' },
                            { value: '915M acres', label: 'Farmland' }
                        ]}
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                            <ResourcesChart 
                                title="Energy Reserves" 
                                data={resourcesData.energy}
                                type="horizontal"
                            />
                            <ResourcesChart 
                                title="Mineral Resources" 
                                data={resourcesData.minerals}
                                type="bar"
                            />
                            <div className="bg-white rounded-xl border border-gray-200 p-5">
                                <h3 className="font-semibold text-gray-900 mb-4">Resource Assessment</h3>
                                <div className="h-64">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RadarChart data={radarData}>
                                            <PolarGrid />
                                            <PolarAngleAxis dataKey="dimension" fontSize={10} />
                                            <PolarRadiusAxis angle={30} domain={[0, 100]} fontSize={10} />
                                            <Radar name="Score" dataKey="value" stroke="#10B981" fill="#10B981" fillOpacity={0.3} />
                                            <Tooltip />
                                        </RadarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                            <AssetCard title="Oil Reserves" value="68.8" unit="billion bbl" icon={Fuel} color="#F59E0B" />
                            <AssetCard title="Natural Gas" value="625" unit="tcf" icon={Fuel} color="#3B82F6" />
                            <AssetCard title="Arable Land" value="915M" unit="acres" icon={Leaf} color="#10B981" />
                            <AssetCard title="Fresh Water" value="6%" unit="of global" icon={Droplets} color="#06B6D4" />
                        </div>
                    </CategorySection>
                )}

                {/* NATIONAL ASSETS */}
                {(activeCategory === 'all' || activeCategory === 'assets') && (
                    <CategorySection
                        title="National Assets"
                        description="Financial, industrial, cultural, intellectual, and strategic reserves"
                        icon={Landmark}
                        color="#F59E0B"
                        stats={[
                            { value: '$8.1T', label: 'Gold Reserves' },
                            { value: '$156B', label: 'Strategic Reserve' },
                            { value: '24', label: 'World Heritage Sites' }
                        ]}
                    >
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                            <AssetCard title="Gold Reserves" value="8,133" unit="tonnes" icon={Coins} color="#F59E0B" change={2.1} trend="up" />
                            <AssetCard title="Foreign Reserves" value="$242B" icon={Banknote} color="#10B981" change={-1.2} trend="down" />
                            <AssetCard title="Patents" value="3.4M" unit="active" icon={Award} color="#8B5CF6" change={8.5} trend="up" />
                            <AssetCard title="Heritage Sites" value="24" unit="UNESCO" icon={Landmark} color="#EF4444" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                            <InfrastructureStats 
                                title="Asset Value Growth"
                                data={trendData.map(d => ({ period: d.period, value: 50 + Math.random() * 40 }))}
                            />
                            <div className="bg-white rounded-xl border border-gray-200 p-5">
                                <h3 className="font-semibold text-gray-900 mb-4">Strategic Reserves Status</h3>
                                <div className="space-y-4">
                                    {[
                                        { name: 'Strategic Petroleum Reserve', level: 78, capacity: '714M barrels' },
                                        { name: 'National Defense Stockpile', level: 92, capacity: '$1.2B value' },
                                        { name: 'Emergency Food Reserves', level: 65, capacity: '120 days supply' },
                                        { name: 'Medical Countermeasures', level: 84, capacity: '$12B inventory' }
                                    ].map((item, i) => (
                                        <div key={i}>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="text-gray-700">{item.name}</span>
                                                <span className="text-gray-500">{item.capacity}</span>
                                            </div>
                                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                                <div 
                                                    className="h-full rounded-full transition-all"
                                                    style={{ 
                                                        width: `${item.level}%`,
                                                        backgroundColor: item.level > 80 ? '#10B981' : item.level > 50 ? '#F59E0B' : '#EF4444'
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </CategorySection>
                )}

                {/* ECONOMIC SYSTEMS */}
                {(activeCategory === 'all' || activeCategory === 'economic') && (
                    <CategorySection
                        title="Economic Systems"
                        description="Financial infrastructure, trade networks, industrial base, and labor markets"
                        icon={Briefcase}
                        color="#EF4444"
                        stats={[
                            { value: '$25.5T', label: 'GDP' },
                            { value: '4,800', label: 'Banks' },
                            { value: '164M', label: 'Workforce' }
                        ]}
                    >
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                            <AssetCard title="GDP" value="$25.5T" icon={TrendingUp} color="#EF4444" change={2.4} trend="up" />
                            <AssetCard title="Stock Exchanges" value="13" unit="major" icon={BarChart3} color="#3B82F6" />
                            <AssetCard title="Trade Volume" value="$5.8T" unit="annual" icon={Ship} color="#10B981" change={4.2} trend="up" />
                            <AssetCard title="Industrial Output" value="$2.3T" icon={Factory} color="#F59E0B" change={1.8} trend="up" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                            <div className="bg-white rounded-xl border border-gray-200 p-5">
                                <h3 className="font-semibold text-gray-900 mb-4">Global Comparison</h3>
                                <div className="h-64">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={countryComparison}>
                                            <XAxis dataKey="country" fontSize={10} />
                                            <YAxis fontSize={10} />
                                            <Tooltip />
                                            <Legend />
                                            <Bar dataKey="infrastructure" name="Infrastructure" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                                            <Bar dataKey="resources" name="Resources" fill="#10B981" radius={[4, 4, 0, 0]} />
                                            <Bar dataKey="digital" name="Digital" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                            <InfrastructureStats 
                                title="Trade Volume Trend"
                                type="multi"
                                data={trendData}
                                lines={[
                                    { key: 'infrastructure', color: '#3B82F6', name: 'Exports' },
                                    { key: 'energy', color: '#10B981', name: 'Imports' },
                                    { key: 'digital', color: '#8B5CF6', name: 'Services' }
                                ]}
                                height={240}
                            />
                        </div>
                    </CategorySection>
                )}

                {/* SOCIAL & HUMAN DEVELOPMENT */}
                {(activeCategory === 'all' || activeCategory === 'social') && (
                    <CategorySection
                        title="Social & Human Development"
                        description="Education, healthcare, social safety nets, and cultural institutions"
                        icon={Users}
                        color="#EC4899"
                        stats={[
                            { value: '130K', label: 'Schools' },
                            { value: '6,090', label: 'Hospitals' },
                            { value: '92%', label: 'Literacy' }
                        ]}
                    >
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                            <AssetCard title="K-12 Schools" value="130,930" icon={GraduationCap} color="#EC4899" />
                            <AssetCard title="Universities" value="5,916" icon={BookOpen} color="#8B5CF6" />
                            <AssetCard title="Hospitals" value="6,090" icon={Stethoscope} color="#EF4444" />
                            <AssetCard title="Healthcare Spending" value="$4.3T" icon={Heart} color="#10B981" change={5.2} trend="up" />
                        </div>
                    </CategorySection>
                )}

                {/* ENVIRONMENTAL & SUSTAINABILITY */}
                {(activeCategory === 'all' || activeCategory === 'environment') && (
                    <CategorySection
                        title="Environmental & Sustainability Assets"
                        description="Climate resilience, protected areas, and renewable energy potential"
                        icon={Leaf}
                        color="#84CC16"
                        stats={[
                            { value: '640M acres', label: 'Protected Land' },
                            { value: '423', label: 'National Parks' },
                            { value: '29%', label: 'Renewable Energy' }
                        ]}
                    >
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                            <AssetCard title="National Parks" value="423" icon={TreePine} color="#84CC16" />
                            <AssetCard title="Protected Areas" value="640M" unit="acres" icon={Leaf} color="#10B981" />
                            <AssetCard title="Solar Potential" value="97" unit="GW installed" icon={Sun} color="#F59E0B" change={23.6} trend="up" />
                            <AssetCard title="Wind Capacity" value="141" unit="GW" icon={Wind} color="#3B82F6" change={14.2} trend="up" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                            <ResourcesChart 
                                title="Renewable Energy Growth" 
                                data={[
                                    { name: 'Solar', value: 97 },
                                    { name: 'Wind', value: 141 },
                                    { name: 'Hydro', value: 80 },
                                    { name: 'Geothermal', value: 3.7 },
                                    { name: 'Biomass', value: 12 }
                                ]}
                            />
                            <div className="bg-white rounded-xl border border-gray-200 p-5">
                                <h3 className="font-semibold text-gray-900 mb-4">Climate Resilience Index</h3>
                                <div className="h-64">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RadarChart data={[
                                            { dimension: 'Flood Defense', value: 72 },
                                            { dimension: 'Wildfire Mgmt', value: 58 },
                                            { dimension: 'Drought Response', value: 65 },
                                            { dimension: 'Storm Readiness', value: 78 },
                                            { dimension: 'Heat Resilience', value: 55 },
                                            { dimension: 'Sea Level Prep', value: 48 }
                                        ]}>
                                            <PolarGrid />
                                            <PolarAngleAxis dataKey="dimension" fontSize={10} />
                                            <PolarRadiusAxis angle={30} domain={[0, 100]} />
                                            <Radar name="Score" dataKey="value" stroke="#84CC16" fill="#84CC16" fillOpacity={0.3} />
                                            <Tooltip />
                                        </RadarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    </CategorySection>
                )}
            </div>
        </div>
    );
}