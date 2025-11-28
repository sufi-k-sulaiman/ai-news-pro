import React, { useState } from 'react';
import { 
    Brain, TrendingUp, Target, Sparkles, Play, Loader2, Activity, Lightbulb, Zap,
    LineChart, GitBranch, Shield, AlertTriangle, CheckCircle2, Clock, Cpu, ChevronRight,
    Download, Globe, Layers
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { base44 } from '@/api/base44Client';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, BarChart, Bar } from 'recharts';
import CountrySelectModal from '@/components/shared/CountrySelectModal';

const MODULES = [
    { id: 'forecast', name: 'Forecast', subtitle: '5-year predictions', icon: LineChart, color: '#F59E0B' },
    { id: 'projection', name: 'Projection', subtitle: 'Decade trajectories', icon: TrendingUp, color: '#10B981' },
    { id: 'prophesy', name: 'Prophesy', subtitle: 'Long-term vision', icon: Sparkles, color: '#8B5CF6' },
    { id: 'model', name: 'Model', subtitle: 'Systems modeling', icon: Cpu, color: '#0EA5E9' },
    { id: 'emulation', name: 'Emulation', subtitle: 'Crisis simulation', icon: Activity, color: '#EF4444' },
    { id: 'hypothetical', name: 'Hypothetical', subtitle: 'Policy analysis', icon: Lightbulb, color: '#84CC16' },
    { id: 'simulation', name: 'Simulation', subtitle: 'Monte Carlo runs', icon: GitBranch, color: '#0EA5E9' },
    { id: 'scenario', name: 'Scenario', subtitle: 'Alternative futures', icon: Layers, color: '#10B981' },
];

const COLORS = ['#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#3B82F6', '#EC4899'];

export default function Intelligence() {
    const [selectedCountry, setSelectedCountry] = useState('');
    const [showCountryModal, setShowCountryModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState(null);
    const [activeModule, setActiveModule] = useState(null);

    const runAnalysis = async (module) => {
        if (!selectedCountry) {
            setShowCountryModal(true);
            return;
        }
        
        setLoading(true);
        setActiveModule(module);
        
        try {
            const response = await base44.integrations.Core.InvokeLLM({
                prompt: `Generate ${module.name} analysis for ${selectedCountry}. Provide: summary (2 paragraphs), findings (5 items), riskLevel (Low/Medium/High), confidenceScore (0-100), recommendations (5 items), forecastData (12 periods with period, actual for first 8, forecast for last 5), distributionData (5 segments with name, value summing to 100), radarData (6 dimensions with dimension, current, target 0-100).`,
                add_context_from_internet: true,
                response_json_schema: {
                    type: "object",
                    properties: {
                        summary: { type: "string" },
                        findings: { type: "array", items: { type: "string" } },
                        riskLevel: { type: "string" },
                        confidenceScore: { type: "number" },
                        recommendations: { type: "array", items: { type: "string" } },
                        forecastData: { type: "array", items: { type: "object" } },
                        distributionData: { type: "array", items: { type: "object" } },
                        radarData: { type: "array", items: { type: "object" } }
                    }
                }
            });
            setResults({ ...response, module, country: selectedCountry });
        } catch (error) {
            console.error('Analysis failed:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-6 text-white">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold">Intelligence</h1>
                            <p className="text-white/80">AI-Powered Analytics & Forecasting</p>
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

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="w-12 h-12 text-purple-600 animate-spin mb-4" />
                        <span className="text-gray-600">Generating {activeModule?.name} analysis...</span>
                    </div>
                ) : results ? (
                    /* Results View */
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <results.module.icon className="w-6 h-6" style={{ color: results.module.color }} />
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">{results.module.name} Analysis</h2>
                                    <p className="text-sm text-gray-500">{results.country}</p>
                                </div>
                            </div>
                            <Button onClick={() => setResults(null)} variant="outline">New Analysis</Button>
                        </div>

                        {/* Summary */}
                        <div className="bg-white rounded-xl border border-gray-200 p-5">
                            <div className="flex items-center gap-2 mb-3">
                                <Brain className="w-5 h-5 text-purple-600" />
                                <h3 className="font-semibold">Executive Summary</h3>
                            </div>
                            <p className="text-gray-700 mb-4">{results.summary}</p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className={`p-3 rounded-lg ${results.riskLevel === 'High' ? 'bg-red-50' : results.riskLevel === 'Medium' ? 'bg-amber-50' : 'bg-emerald-50'}`}>
                                    <p className="text-xs text-gray-500">Risk Level</p>
                                    <p className={`font-bold ${results.riskLevel === 'High' ? 'text-red-600' : results.riskLevel === 'Medium' ? 'text-amber-600' : 'text-emerald-600'}`}>{results.riskLevel}</p>
                                </div>
                                <div className="p-3 rounded-lg bg-purple-50">
                                    <p className="text-xs text-gray-500">Confidence</p>
                                    <p className="font-bold text-purple-600">{results.confidenceScore}%</p>
                                </div>
                            </div>
                        </div>

                        {/* Charts */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {results.forecastData?.length > 0 && (
                                <div className="bg-white rounded-xl border border-gray-200 p-5">
                                    <h3 className="font-semibold mb-4">Forecast Trend</h3>
                                    <div className="h-64">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={results.forecastData}>
                                                <XAxis dataKey="period" fontSize={10} />
                                                <YAxis fontSize={10} />
                                                <Tooltip />
                                                <Area type="monotone" dataKey="actual" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.3} />
                                                <Area type="monotone" dataKey="forecast" stroke="#10B981" fill="transparent" strokeDasharray="5 5" />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            )}

                            {results.distributionData?.length > 0 && (
                                <div className="bg-white rounded-xl border border-gray-200 p-5">
                                    <h3 className="font-semibold mb-4">Distribution</h3>
                                    <div className="h-64">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie data={results.distributionData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80}>
                                                    {results.distributionData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                                                </Pie>
                                                <Tooltip />
                                                <Legend />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            )}

                            {results.radarData?.length > 0 && (
                                <div className="bg-white rounded-xl border border-gray-200 p-5">
                                    <h3 className="font-semibold mb-4">Performance Radar</h3>
                                    <div className="h-64">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <RadarChart data={results.radarData}>
                                                <PolarGrid />
                                                <PolarAngleAxis dataKey="dimension" fontSize={10} />
                                                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                                                <Radar name="Current" dataKey="current" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.3} />
                                                <Radar name="Target" dataKey="target" stroke="#10B981" fill="#10B981" fillOpacity={0.3} />
                                                <Legend />
                                            </RadarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Findings & Recommendations */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {results.findings?.length > 0 && (
                                <div className="bg-white rounded-xl border border-gray-200 p-5">
                                    <h3 className="font-semibold mb-4">Key Findings</h3>
                                    <ul className="space-y-2">
                                        {results.findings.map((f, i) => (
                                            <li key={i} className="flex items-start gap-2 text-sm">
                                                <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                                                <span className="text-gray-700">{f}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {results.recommendations?.length > 0 && (
                                <div className="bg-white rounded-xl border border-gray-200 p-5">
                                    <h3 className="font-semibold mb-4">Recommendations</h3>
                                    <ul className="space-y-2">
                                        {results.recommendations.map((r, i) => (
                                            <li key={i} className="flex items-start gap-2 p-2 bg-purple-50 rounded-lg text-sm">
                                                <span className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs flex-shrink-0">{i+1}</span>
                                                <span className="text-gray-700">{r}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    /* Module Selection */
                    <>
                    {!selectedCountry && (
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
                            <Globe className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                            <p className="text-amber-700">Select a country to run analysis</p>
                        </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {MODULES.map(mod => (
                            <div 
                                key={mod.id} 
                                onClick={() => runAnalysis(mod)}
                                className="bg-white rounded-xl p-5 border border-gray-200 cursor-pointer transition-all hover:shadow-lg hover:border-gray-300"
                            >
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `${mod.color}15` }}>
                                        <mod.icon className="w-5 h-5" style={{ color: mod.color }} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900">{mod.name}</h3>
                                        <p className="text-xs text-gray-500">{mod.subtitle}</p>
                                    </div>
                                </div>
                                <button
                                    className="w-full py-2 rounded-lg font-medium text-white text-sm"
                                    style={{ backgroundColor: mod.color }}
                                >
                                    Run Analysis
                                </button>
                            </div>
                        ))}
                    </div>
                    </>
                )}

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