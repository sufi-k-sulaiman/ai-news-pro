import React, { useState, useEffect } from 'react';
import { 
    Loader2, Globe, Sparkles, BookOpen, Brain, Lightbulb, Heart,
    TrendingUp, BarChart3, Mountain, Leaf, History, Users, Shield,
    GraduationCap, Map, Compass, Wind, Droplets, Sun, ChevronRight,
    CheckCircle, AlertTriangle, Info, Play, FileText
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { base44 } from '@/api/base44Client';
import { 
    AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, 
    BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, Legend,
    RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';

const CHART_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'];

function StatCard({ icon: Icon, label, value, color }) {
    return (
        <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${color}15` }}>
                    <Icon className="w-5 h-5" style={{ color }} />
                </div>
                <div>
                    <p className="text-xs text-gray-500">{label}</p>
                    <p className="font-semibold text-gray-900">{value}</p>
                </div>
            </div>
        </div>
    );
}

function WisdomCard({ title, items, icon: Icon, color }) {
    return (
        <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-3">
                <Icon className="w-5 h-5" style={{ color }} />
                <h4 className="font-semibold text-gray-900">{title}</h4>
            </div>
            <ul className="space-y-2">
                {items?.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

function QuizCard({ question, options, color }) {
    const [selected, setSelected] = useState(null);
    const [revealed, setRevealed] = useState(false);
    
    return (
        <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-3">
                <GraduationCap className="w-5 h-5" style={{ color }} />
                <h4 className="font-semibold text-gray-900">Quick Quiz</h4>
            </div>
            <p className="text-gray-700 mb-3">{question}</p>
            <div className="space-y-2">
                {options?.map((opt, i) => (
                    <button
                        key={i}
                        onClick={() => { setSelected(i); setRevealed(true); }}
                        className={`w-full text-left p-3 rounded-lg border transition-all text-sm ${
                            revealed && opt.correct 
                                ? 'bg-green-50 border-green-300' 
                                : revealed && selected === i && !opt.correct
                                    ? 'bg-red-50 border-red-300'
                                    : selected === i 
                                        ? 'border-blue-300 bg-blue-50' 
                                        : 'border-gray-200 hover:border-gray-300'
                        }`}
                    >
                        {opt.text}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default function ItemDetailView({ item, category }) {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        fetchItemData();
    }, [item]);

    const fetchItemData = async () => {
        setLoading(true);
        setData(null);
        try {
            const response = await base44.integrations.Core.InvokeLLM({
                prompt: `Provide comprehensive encyclopedia-style intelligence data about "${item}" in the context of ${category?.name || 'natural world'}. 

Return a detailed JSON with:
1. overview: 3-4 sentence description
2. keyFacts: Array of 5 important facts
3. compressedSummary: 2-3 key statistics (e.g., "Covers 22% of Earth's land")
4. science: Object with { formation: string, processes: array of 4 processes, connections: array of 4 ecosystem connections }
5. culture: Object with { traditions: array of 3 cultural perspectives, myths: array of 2 myths/legends, significance: string }
6. wisdom: Object with { conservation: array of 4 tips, lifestyle: array of 3 recommendations, safety: array of 3 safety tips, health: array of 2 health insights }
7. education: Object with { glossary: array of 4 terms with definitions, caseStudies: array of 2 famous examples, quiz: object with question and 4 options (one marked correct:true) }
8. charts: Object with:
   - elevationData: array of 6 objects with { name: string, value: number } for elevation/measurement profile
   - biodiversityData: array of 5 objects with { name: string, species: number } for species comparison
   - climateData: array of 12 objects with { month: string, temp: number, precip: number } for climate patterns
   - compositionData: array of 4 objects with { name: string, value: number } for composition breakdown (should sum to 100)
   - trendData: array of 6 objects with { year: string, value: number, projected: number } for historical trends
9. relatedTopics: Array of 5 related concepts
10. dailyHighlight: A short engaging fact for "today's highlight"`,
                add_context_from_internet: true,
                response_json_schema: {
                    type: "object",
                    properties: {
                        overview: { type: "string" },
                        keyFacts: { type: "array", items: { type: "string" } },
                        compressedSummary: { type: "array", items: { type: "string" } },
                        science: { 
                            type: "object", 
                            properties: { 
                                formation: { type: "string" }, 
                                processes: { type: "array", items: { type: "string" } },
                                connections: { type: "array", items: { type: "string" } }
                            } 
                        },
                        culture: { 
                            type: "object", 
                            properties: { 
                                traditions: { type: "array", items: { type: "string" } },
                                myths: { type: "array", items: { type: "string" } },
                                significance: { type: "string" }
                            } 
                        },
                        wisdom: { 
                            type: "object", 
                            properties: { 
                                conservation: { type: "array", items: { type: "string" } },
                                lifestyle: { type: "array", items: { type: "string" } },
                                safety: { type: "array", items: { type: "string" } },
                                health: { type: "array", items: { type: "string" } }
                            } 
                        },
                        education: { 
                            type: "object", 
                            properties: { 
                                glossary: { type: "array", items: { type: "object", properties: { term: { type: "string" }, definition: { type: "string" } } } },
                                caseStudies: { type: "array", items: { type: "string" } },
                                quiz: { type: "object", properties: { question: { type: "string" }, options: { type: "array", items: { type: "object", properties: { text: { type: "string" }, correct: { type: "boolean" } } } } } }
                            } 
                        },
                        charts: { 
                            type: "object", 
                            properties: { 
                                elevationData: { type: "array", items: { type: "object" } },
                                biodiversityData: { type: "array", items: { type: "object" } },
                                climateData: { type: "array", items: { type: "object" } },
                                compositionData: { type: "array", items: { type: "object" } },
                                trendData: { type: "array", items: { type: "object" } }
                            } 
                        },
                        relatedTopics: { type: "array", items: { type: "string" } },
                        dailyHighlight: { type: "string" }
                    }
                }
            });
            setData(response);
        } catch (error) {
            console.error('Failed to fetch item data:', error);
            // Fallback data
            setData({
                overview: `${item} is a fascinating subject within ${category?.name || 'the natural world'}.`,
                keyFacts: ['Data is being compiled...'],
                compressedSummary: ['Key statistics loading...'],
                science: { formation: 'Formation details loading...', processes: ['Process 1'], connections: ['Connection 1'] },
                culture: { traditions: ['Tradition 1'], myths: ['Myth 1'], significance: 'Cultural significance loading...' },
                wisdom: { conservation: ['Tip 1'], lifestyle: ['Recommendation 1'], safety: ['Safety tip 1'], health: ['Health insight 1'] },
                education: { glossary: [{ term: 'Term', definition: 'Definition' }], caseStudies: ['Case study 1'], quiz: { question: 'Sample question?', options: [{ text: 'Option A', correct: true }, { text: 'Option B', correct: false }] } },
                charts: {
                    elevationData: [{ name: 'Point 1', value: 100 }, { name: 'Point 2', value: 150 }],
                    biodiversityData: [{ name: 'Region 1', species: 500 }],
                    climateData: [{ month: 'Jan', temp: 20, precip: 50 }],
                    compositionData: [{ name: 'Component 1', value: 50 }, { name: 'Component 2', value: 50 }],
                    trendData: [{ year: '2020', value: 100, projected: 95 }]
                },
                relatedTopics: ['Related topic 1'],
                dailyHighlight: 'Interesting fact loading...'
            });
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-10 h-10 animate-spin mb-4" style={{ color: category?.color }} />
                <p className="text-gray-500">Loading comprehensive intelligence data...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className={`bg-gradient-to-r ${category?.gradient || 'from-purple-600 to-indigo-600'} rounded-2xl p-6 text-white`}>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center">
                            <Sparkles className="w-7 h-7" />
                        </div>
                        <div>
                            <p className="text-white/70 text-sm">{category?.name}</p>
                            <h2 className="text-2xl font-bold">{item}</h2>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        {data?.compressedSummary?.slice(0, 3).map((stat, i) => (
                            <div key={i} className="text-center px-4 py-2 bg-white/10 rounded-lg">
                                <p className="text-sm text-white/90">{stat}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Daily Highlight */}
            {data?.dailyHighlight && (
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                            <Sun className="w-5 h-5 text-amber-600" />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-amber-600 mb-1">TODAY'S HIGHLIGHT</p>
                            <p className="text-gray-700">{data.dailyHighlight}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Core Philosophy */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {[
                    { icon: Brain, label: 'Understanding', color: '#3B82F6' },
                    { icon: GraduationCap, label: 'Education', color: '#10B981' },
                    { icon: BarChart3, label: 'Compression', color: '#F59E0B' },
                    { icon: BookOpen, label: 'Knowledge', color: '#8B5CF6' },
                    { icon: Lightbulb, label: 'Wisdom', color: '#EC4899' }
                ].map((item, i) => (
                    <div key={i} className="bg-white rounded-xl border border-gray-200 p-3 text-center">
                        <item.icon className="w-6 h-6 mx-auto mb-1" style={{ color: item.color }} />
                        <p className="text-xs font-medium text-gray-700">{item.label}</p>
                    </div>
                ))}
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="w-full flex flex-wrap h-auto gap-1 bg-gray-100 p-1 rounded-xl">
                    <TabsTrigger value="overview" className="flex-1 min-w-[80px] text-xs md:text-sm">Overview</TabsTrigger>
                    <TabsTrigger value="science" className="flex-1 min-w-[80px] text-xs md:text-sm">Science</TabsTrigger>
                    <TabsTrigger value="culture" className="flex-1 min-w-[80px] text-xs md:text-sm">Culture</TabsTrigger>
                    <TabsTrigger value="charts" className="flex-1 min-w-[80px] text-xs md:text-sm">Charts</TabsTrigger>
                    <TabsTrigger value="wisdom" className="flex-1 min-w-[80px] text-xs md:text-sm">Wisdom</TabsTrigger>
                    <TabsTrigger value="learn" className="flex-1 min-w-[80px] text-xs md:text-sm">Learn</TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="mt-6 space-y-6">
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <Globe className="w-5 h-5" style={{ color: category?.color }} />
                            Encyclopedia Entry
                        </h3>
                        <p className="text-gray-700 leading-relaxed mb-4">{data?.overview}</p>
                        
                        <h4 className="font-medium text-gray-900 mb-2">Key Facts</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {data?.keyFacts?.map((fact, i) => (
                                <div key={i} className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg">
                                    <span className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ backgroundColor: category?.color }}>
                                        {i + 1}
                                    </span>
                                    <p className="text-gray-700 text-sm">{fact}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="font-medium text-gray-900 mb-3">Related Topics</h4>
                        <div className="flex flex-wrap gap-2">
                            {data?.relatedTopics?.map((topic, i) => (
                                <span key={i} className="px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1" style={{ backgroundColor: `${category?.color}15`, color: category?.color }}>
                                    <ChevronRight className="w-3 h-3" />
                                    {topic}
                                </span>
                            ))}
                        </div>
                    </div>
                </TabsContent>

                {/* Science Tab */}
                <TabsContent value="science" className="mt-6 space-y-6">
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <Mountain className="w-5 h-5" style={{ color: category?.color }} />
                            Formation & Processes
                        </h3>
                        <p className="text-gray-700 leading-relaxed mb-4">{data?.science?.formation}</p>
                        
                        <h4 className="font-medium text-gray-900 mb-2">Key Processes</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
                            {data?.science?.processes?.map((process, i) => (
                                <div key={i} className="p-3 bg-blue-50 rounded-lg text-center">
                                    <p className="text-sm font-medium text-blue-700">{process}</p>
                                </div>
                            ))}
                        </div>
                        
                        <h4 className="font-medium text-gray-900 mb-2">Ecosystem Connections</h4>
                        <div className="grid grid-cols-2 gap-2">
                            {data?.science?.connections?.map((conn, i) => (
                                <div key={i} className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                                    <Leaf className="w-4 h-4 text-green-600" />
                                    <p className="text-sm text-green-700">{conn}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </TabsContent>

                {/* Culture Tab */}
                <TabsContent value="culture" className="mt-6 space-y-6">
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <Users className="w-5 h-5" style={{ color: category?.color }} />
                            Cultural Perspectives
                        </h3>
                        <p className="text-gray-700 leading-relaxed mb-4">{data?.culture?.significance}</p>
                        
                        <h4 className="font-medium text-gray-900 mb-2">Traditions</h4>
                        <div className="space-y-2 mb-4">
                            {data?.culture?.traditions?.map((trad, i) => (
                                <div key={i} className="flex items-start gap-2 p-3 bg-purple-50 rounded-lg">
                                    <Heart className="w-4 h-4 text-purple-600 mt-0.5" />
                                    <p className="text-sm text-purple-700">{trad}</p>
                                </div>
                            ))}
                        </div>
                        
                        <h4 className="font-medium text-gray-900 mb-2">Myths & Legends</h4>
                        <div className="space-y-2">
                            {data?.culture?.myths?.map((myth, i) => (
                                <div key={i} className="flex items-start gap-2 p-3 bg-amber-50 rounded-lg">
                                    <Sparkles className="w-4 h-4 text-amber-600 mt-0.5" />
                                    <p className="text-sm text-amber-700">{myth}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </TabsContent>

                {/* Charts Tab */}
                <TabsContent value="charts" className="mt-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Elevation/Measurement Profile */}
                        <div className="bg-white rounded-xl border border-gray-200 p-4">
                            <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                                <TrendingUp className="w-4 h-4" style={{ color: category?.color }} />
                                Measurement Profile
                            </h4>
                            <div className="h-48">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={data?.charts?.elevationData || []}>
                                        <XAxis dataKey="name" fontSize={10} />
                                        <YAxis fontSize={10} />
                                        <Tooltip />
                                        <Area type="monotone" dataKey="value" stroke={category?.color} fill={`${category?.color}30`} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Biodiversity */}
                        <div className="bg-white rounded-xl border border-gray-200 p-4">
                            <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                                <Leaf className="w-4 h-4 text-green-600" />
                                Biodiversity Comparison
                            </h4>
                            <div className="h-48">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={data?.charts?.biodiversityData || []}>
                                        <XAxis dataKey="name" fontSize={10} />
                                        <YAxis fontSize={10} />
                                        <Tooltip />
                                        <Bar dataKey="species" fill="#10B981" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Climate Patterns */}
                        <div className="bg-white rounded-xl border border-gray-200 p-4">
                            <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                                <Sun className="w-4 h-4 text-amber-500" />
                                Climate Patterns
                            </h4>
                            <div className="h-48">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={data?.charts?.climateData || []}>
                                        <XAxis dataKey="month" fontSize={10} />
                                        <YAxis fontSize={10} />
                                        <Tooltip />
                                        <Legend />
                                        <Line type="monotone" dataKey="temp" stroke="#F59E0B" name="Temperature" />
                                        <Line type="monotone" dataKey="precip" stroke="#3B82F6" name="Precipitation" />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Composition */}
                        <div className="bg-white rounded-xl border border-gray-200 p-4">
                            <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                                <BarChart3 className="w-4 h-4" style={{ color: category?.color }} />
                                Composition Breakdown
                            </h4>
                            <div className="h-48">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={data?.charts?.compositionData || []}
                                            dataKey="value"
                                            nameKey="name"
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={60}
                                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                            labelLine={false}
                                        >
                                            {data?.charts?.compositionData?.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    {/* Trend Data */}
                    <div className="bg-white rounded-xl border border-gray-200 p-4">
                        <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                            <History className="w-4 h-4" style={{ color: category?.color }} />
                            Historical Trends & Projections
                        </h4>
                        <div className="h-48">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={data?.charts?.trendData || []}>
                                    <XAxis dataKey="year" fontSize={10} />
                                    <YAxis fontSize={10} />
                                    <Tooltip />
                                    <Legend />
                                    <Area type="monotone" dataKey="value" stroke="#8B5CF6" fill="#8B5CF620" name="Historical" />
                                    <Area type="monotone" dataKey="projected" stroke="#EF4444" fill="#EF444420" strokeDasharray="5 5" name="Projected" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </TabsContent>

                {/* Wisdom Tab */}
                <TabsContent value="wisdom" className="mt-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <WisdomCard 
                            title="Conservation Tips" 
                            items={data?.wisdom?.conservation} 
                            icon={Leaf} 
                            color="#10B981" 
                        />
                        <WisdomCard 
                            title="Lifestyle Recommendations" 
                            items={data?.wisdom?.lifestyle} 
                            icon={Heart} 
                            color="#EC4899" 
                        />
                        <WisdomCard 
                            title="Safety Guidance" 
                            items={data?.wisdom?.safety} 
                            icon={Shield} 
                            color="#F59E0B" 
                        />
                        <WisdomCard 
                            title="Health Insights" 
                            items={data?.wisdom?.health} 
                            icon={Sun} 
                            color="#3B82F6" 
                        />
                    </div>
                </TabsContent>

                {/* Learn Tab */}
                <TabsContent value="learn" className="mt-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Glossary */}
                        <div className="bg-white rounded-xl border border-gray-200 p-4">
                            <div className="flex items-center gap-2 mb-3">
                                <BookOpen className="w-5 h-5" style={{ color: category?.color }} />
                                <h4 className="font-semibold text-gray-900">Glossary</h4>
                            </div>
                            <div className="space-y-2">
                                {data?.education?.glossary?.map((item, i) => (
                                    <div key={i} className="p-3 bg-gray-50 rounded-lg">
                                        <p className="font-medium text-gray-900 text-sm">{item.term}</p>
                                        <p className="text-gray-600 text-xs mt-1">{item.definition}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Quiz */}
                        <QuizCard 
                            question={data?.education?.quiz?.question}
                            options={data?.education?.quiz?.options}
                            color={category?.color}
                        />
                    </div>

                    {/* Case Studies */}
                    <div className="bg-white rounded-xl border border-gray-200 p-4">
                        <div className="flex items-center gap-2 mb-3">
                            <Map className="w-5 h-5" style={{ color: category?.color }} />
                            <h4 className="font-semibold text-gray-900">Case Studies</h4>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {data?.education?.caseStudies?.map((study, i) => (
                                <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors">
                                    <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${category?.color}15` }}>
                                        <FileText className="w-5 h-5" style={{ color: category?.color }} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-900 text-sm">{study}</p>
                                        <p className="text-xs text-gray-500">Tap to explore</p>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-gray-400" />
                                </div>
                            ))}
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}