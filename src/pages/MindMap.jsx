import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { 
    Search, Brain, Sparkles, ChevronRight, X, Menu, ChevronLeft,
    BookOpen, Users, Briefcase, Clock, BarChart3, FileText, Globe, Lightbulb,
    Target, Award, GraduationCap, Calendar, Loader2, Compass, Network, Zap, Maximize2, Minimize2
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LOGO_URL, menuItems, footerLinks } from '../components/NavigationConfig';
import MetricCard from '../components/dashboard/MetricCard';
import PieChartCard from '../components/dashboard/PieChartCard';
import HorizontalBarChart from '../components/dashboard/HorizontalBarChart';

const NODE_COLORS = [
    { bg: '#6B4EE6', text: 'white' },      // Purple
    { bg: '#3B82F6', text: 'white' },      // Blue
    { bg: '#10B981', text: 'white' },      // Green
    { bg: '#F59E0B', text: 'white' },      // Orange
    { bg: '#EC4899', text: 'white' },      // Pink
    { bg: '#06B6D4', text: 'white' },      // Cyan
    { bg: '#8B5CF6', text: 'white' },      // Violet
    { bg: '#EF4444', text: 'white' },      // Red
];

function MindMapNode({ node, color, onExplore, onLearn, isCenter = false, level = 0 }) {
    return (
        <div className={`flex flex-col items-center ${isCenter ? '' : ''}`}>
            <div 
                className={`rounded-full px-4 py-2 shadow-lg transition-all hover:scale-105 ${isCenter ? 'px-6 py-3' : ''}`}
                style={{ backgroundColor: color.bg, color: color.text }}
            >
                <span className={`font-semibold ${isCenter ? 'text-lg' : 'text-sm'}`}>{node.keyword}</span>
            </div>
            <div className="flex gap-2 mt-2">
                <button
                    onClick={() => onExplore(node)}
                    className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-gray-800 text-white hover:bg-gray-700 transition-colors"
                >
                    <Compass className="w-3 h-3" /> Explore
                </button>
                <button
                    onClick={() => onLearn(node.keyword)}
                    className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-white text-gray-800 border border-gray-300 hover:bg-gray-100 transition-colors"
                >
                    <BookOpen className="w-3 h-3" /> Learn
                </button>
            </div>
        </div>
    );
}

export default function MindMap() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [nodes, setNodes] = useState([]);
    const [centerTopic, setCenterTopic] = useState(null);
    const [selectedNode, setSelectedNode] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [nodeDetails, setNodeDetails] = useState(null);
    const [loadingDetails, setLoadingDetails] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);

    const generateMindMap = async (topic) => {
        setIsLoading(true);
        setCenterTopic(topic);
        setNodes([]);

        try {
            const response = await base44.integrations.Core.InvokeLLM({
                prompt: `Generate a mind map for the topic "${topic}". Create 6-8 related keywords/concepts that branch from this topic. For each keyword, include a brief description and category.`,
                add_context_from_internet: true,
                response_json_schema: {
                    type: "object",
                    properties: {
                        keywords: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    keyword: { type: "string" },
                                    description: { type: "string" },
                                    category: { type: "string" }
                                }
                            }
                        }
                    }
                }
            });

            const keywords = response?.keywords || [];
            setNodes(keywords.map((k, i) => ({
                ...k,
                id: i,
                expanded: false,
                children: [],
                colorIndex: i % NODE_COLORS.length
            })));
        } catch (error) {
            console.error('Error generating mind map:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const expandNode = async (node) => {
        setNodes(prev => prev.map(n => n.id === node.id ? { ...n, loading: true } : n));

        try {
            const response = await base44.integrations.Core.InvokeLLM({
                prompt: `Generate 3-4 sub-topics/related concepts for "${node.keyword}" in the context of "${centerTopic}".`,
                add_context_from_internet: true,
                response_json_schema: {
                    type: "object",
                    properties: {
                        subtopics: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    keyword: { type: "string" },
                                    description: { type: "string" }
                                }
                            }
                        }
                    }
                }
            });

            setNodes(prev => prev.map(n => {
                if (n.id === node.id) {
                    return {
                        ...n,
                        expanded: true,
                        loading: false,
                        children: (response?.subtopics || []).map((s, i) => ({ ...s, id: `${n.id}-${i}` }))
                    };
                }
                return n;
            }));
        } catch (error) {
            console.error('Error expanding node:', error);
            setNodes(prev => prev.map(n => n.id === node.id ? { ...n, loading: false } : n));
        }
    };

    const learnMore = async (keyword) => {
        setSelectedNode(keyword);
        setShowDetailModal(true);
        setLoadingDetails(true);
        setNodeDetails(null);

        try {
            const [overview, professional, timeline, insights, documents] = await Promise.all([
                base44.integrations.Core.InvokeLLM({
                    prompt: `Provide a comprehensive overview of "${keyword}" including: what it is, when it originated, who created/discovered it, where it's most relevant, and key facts.`,
                    add_context_from_internet: true,
                    response_json_schema: {
                        type: "object",
                        properties: {
                            what: { type: "string" },
                            when: { type: "string" },
                            who: { type: "string" },
                            where: { type: "string" },
                            summary: { type: "string" }
                        }
                    }
                }),
                base44.integrations.Core.InvokeLLM({
                    prompt: `For "${keyword}", provide professional information: required skills, related subjects, subject matter experts, and relevant job titles.`,
                    add_context_from_internet: true,
                    response_json_schema: {
                        type: "object",
                        properties: {
                            skills: { type: "array", items: { type: "string" } },
                            subjects: { type: "array", items: { type: "string" } },
                            experts: { type: "array", items: { type: "object", properties: { name: { type: "string" }, role: { type: "string" } } } },
                            jobTitles: { type: "array", items: { type: "string" } }
                        }
                    }
                }),
                base44.integrations.Core.InvokeLLM({
                    prompt: `Create a timeline showing how "${keyword}" evolved over time. Include 5-7 key milestones.`,
                    add_context_from_internet: true,
                    response_json_schema: {
                        type: "object",
                        properties: {
                            events: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: { year: { type: "string" }, title: { type: "string" }, description: { type: "string" } }
                                }
                            }
                        }
                    }
                }),
                base44.integrations.Core.InvokeLLM({
                    prompt: `Provide deep insights about "${keyword}" with statistical data, market trends, and key metrics.`,
                    add_context_from_internet: true,
                    response_json_schema: {
                        type: "object",
                        properties: {
                            metrics: {
                                type: "array",
                                items: { type: "object", properties: { label: { type: "string" }, value: { type: "string" }, change: { type: "string" } } }
                            },
                            distribution: {
                                type: "array",
                                items: { type: "object", properties: { name: { type: "string" }, value: { type: "number" } } }
                            }
                        }
                    }
                }),
                base44.integrations.Core.InvokeLLM({
                    prompt: `Find and categorize relevant documents, articles, and resources about "${keyword}". Group them by type.`,
                    add_context_from_internet: true,
                    response_json_schema: {
                        type: "object",
                        properties: {
                            groups: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        category: { type: "string" },
                                        documents: {
                                            type: "array",
                                            items: { type: "object", properties: { title: { type: "string" }, description: { type: "string" }, type: { type: "string" }, source: { type: "string" } } }
                                        }
                                    }
                                }
                            }
                        }
                    }
                })
            ]);

            setNodeDetails({ overview, professional, timeline, insights, documents });
        } catch (error) {
            console.error('Error loading details:', error);
        } finally {
            setLoadingDetails(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            generateMindMap(searchQuery.trim());
        }
    };

    const toggleFullscreen = () => setIsFullscreen(!isFullscreen);

    // Split nodes into left and right for visual layout
    const leftNodes = nodes.filter((_, i) => i % 2 === 0);
    const rightNodes = nodes.filter((_, i) => i % 2 === 1);

    const MindMapCanvas = () => (
        <div className={`bg-slate-900 rounded-2xl p-8 ${isFullscreen ? 'fixed inset-0 z-50 rounded-none' : 'min-h-[600px]'}`}>
            {/* Fullscreen Toggle */}
            <div className="flex justify-end mb-4">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleFullscreen}
                    className="bg-slate-800 border-slate-700 text-white hover:bg-slate-700"
                >
                    {isFullscreen ? <><Minimize2 className="w-4 h-4 mr-2" /> Exit Fullscreen</> : <><Maximize2 className="w-4 h-4 mr-2" /> Fullscreen</>}
                </Button>
            </div>

            {/* Empty State */}
            {!centerTopic && !isLoading && (
                <div className="flex flex-col items-center justify-center h-96 text-center">
                    <Network className="w-16 h-16 text-slate-600 mb-4" />
                    <h2 className="text-xl font-semibold text-white mb-2">Start Exploring Knowledge</h2>
                    <p className="text-slate-400 mb-6">Enter a topic above to generate an AI-powered mind map</p>
                    <div className="flex flex-wrap justify-center gap-2">
                        {['Artificial Intelligence', 'Climate Change', 'Blockchain', 'Quantum Computing'].map(topic => (
                            <button key={topic} onClick={() => { setSearchQuery(topic); generateMindMap(topic); }} className="px-4 py-2 rounded-full bg-slate-800 text-slate-300 hover:bg-slate-700 text-sm">
                                {topic}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Loading */}
            {isLoading && (
                <div className="flex flex-col items-center justify-center h-96">
                    <Loader2 className="w-12 h-12 text-purple-500 mb-4 animate-spin" />
                    <h2 className="text-xl font-semibold text-white mb-2">Generating Mind Map</h2>
                    <p className="text-slate-400">Exploring connections for "{searchQuery}"...</p>
                </div>
            )}

            {/* Mind Map Visual */}
            {centerTopic && !isLoading && (
                <div className="flex items-start justify-center gap-8 overflow-auto py-8">
                    {/* Left Branch */}
                    <div className="flex flex-col gap-6 items-end">
                        {leftNodes.map((node) => (
                            <div key={node.id} className="flex flex-col items-end gap-4">
                                <MindMapNode
                                    node={node}
                                    color={NODE_COLORS[node.colorIndex]}
                                    onExplore={expandNode}
                                    onLearn={learnMore}
                                />
                                {node.loading && <Loader2 className="w-5 h-5 text-white animate-spin" />}
                                {node.expanded && node.children?.length > 0 && (
                                    <div className="flex flex-col gap-3 mr-8">
                                        {node.children.map((child, j) => (
                                            <div key={child.id} className="flex flex-col items-end">
                                                <div 
                                                    className="rounded-full px-3 py-1.5 shadow-md"
                                                    style={{ backgroundColor: NODE_COLORS[(node.colorIndex + j + 1) % NODE_COLORS.length].bg }}
                                                >
                                                    <span className="text-xs font-medium text-white">{child.keyword}</span>
                                                </div>
                                                <div className="flex gap-1 mt-1">
                                                    <button onClick={() => learnMore(child.keyword)} className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-white text-gray-800 hover:bg-gray-100">
                                                        <BookOpen className="w-2.5 h-2.5" /> Learn
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Center */}
                    <div className="flex flex-col items-center pt-16">
                        <div className="rounded-full px-8 py-4 shadow-xl bg-purple-600">
                            <span className="text-xl font-bold text-white">{centerTopic}</span>
                        </div>
                        <div className="flex gap-2 mt-3">
                            <button onClick={() => learnMore(centerTopic)} className="flex items-center gap-1 px-4 py-1.5 rounded-full text-sm font-medium bg-gray-800 text-white hover:bg-gray-700">
                                <Compass className="w-4 h-4" /> Explore
                            </button>
                            <button onClick={() => learnMore(centerTopic)} className="flex items-center gap-1 px-4 py-1.5 rounded-full text-sm font-medium bg-white text-gray-800 hover:bg-gray-100">
                                <BookOpen className="w-4 h-4" /> Learn
                            </button>
                        </div>
                    </div>

                    {/* Right Branch */}
                    <div className="flex flex-col gap-6 items-start">
                        {rightNodes.map((node) => (
                            <div key={node.id} className="flex flex-col items-start gap-4">
                                <MindMapNode
                                    node={node}
                                    color={NODE_COLORS[node.colorIndex]}
                                    onExplore={expandNode}
                                    onLearn={learnMore}
                                />
                                {node.loading && <Loader2 className="w-5 h-5 text-white animate-spin" />}
                                {node.expanded && node.children?.length > 0 && (
                                    <div className="flex flex-col gap-3 ml-8">
                                        {node.children.map((child, j) => (
                                            <div key={child.id} className="flex flex-col items-start">
                                                <div 
                                                    className="rounded-full px-3 py-1.5 shadow-md"
                                                    style={{ backgroundColor: NODE_COLORS[(node.colorIndex + j + 1) % NODE_COLORS.length].bg }}
                                                >
                                                    <span className="text-xs font-medium text-white">{child.keyword}</span>
                                                </div>
                                                <div className="flex gap-1 mt-1">
                                                    <button onClick={() => learnMore(child.keyword)} className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-white text-gray-800 hover:bg-gray-100">
                                                        <BookOpen className="w-2.5 h-2.5" /> Learn
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            {/* Header */}
            <header className="bg-white sticky top-0 z-40 border-b border-gray-200 shadow-sm">
                <div className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)} className="hover:bg-gray-100">
                            {sidebarOpen ? <ChevronLeft className="w-5 h-5 text-purple-600" /> : <Menu className="w-5 h-5 text-purple-600" />}
                        </Button>
                        <Link to={createPageUrl('Home')} className="flex items-center gap-3 hover:opacity-80">
                            <img src={LOGO_URL} alt="1cPublishing" className="h-10 w-10 object-contain" />
                            <div>
                                <span className="text-xl font-bold text-gray-900">1cPublishing</span>
                                <p className="text-xs font-medium text-purple-600">AI Powered</p>
                            </div>
                        </Link>
                    </div>

                    <form onSubmit={handleSearch} className="flex-1 max-w-2xl mx-8 relative">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Enter any topic to generate a mind map..."
                            className="w-full pl-14 pr-24 py-4 h-14 bg-white border-2 border-purple-200 text-gray-900 placeholder:text-gray-400 rounded-full focus:border-purple-500"
                        />
                        <Button type="submit" disabled={isLoading} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-purple-600 hover:bg-purple-700 text-white px-4">
                            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Search className="w-4 h-4 mr-2" /> Generate</>}
                        </Button>
                    </form>

                    <div className="w-20" />
                </div>
            </header>

            <div className="flex flex-1">
                {/* Sidebar */}
                <aside className={`${sidebarOpen ? 'w-64' : 'w-0'} transition-all duration-300 overflow-hidden bg-white border-r border-gray-200 flex-shrink-0`}>
                    <nav className="p-4 space-y-2">
                        {menuItems.map((item, index) => (
                            <Link key={index} to={item.href} className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${item.label === 'MindMap' ? 'bg-purple-100 text-purple-700' : 'text-gray-700 hover:bg-purple-50 hover:text-purple-600'}`}>
                                <item.icon className="w-5 h-5 text-purple-600" />
                                <span className="font-medium">{item.label}</span>
                            </Link>
                        ))}
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="flex-1 overflow-auto p-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                                <Brain className="w-6 h-6 text-purple-600" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Neural Mind Map Explorer</h1>
                                <p className="text-gray-500">AI-powered knowledge visualization and topic exploration</p>
                            </div>
                        </div>

                        <MindMapCanvas />
                    </div>
                </main>
            </div>

            {/* Footer */}
            <footer className="py-6 bg-white border-t border-gray-200">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <img src={LOGO_URL} alt="1cPublishing" className="h-8 w-8 object-contain grayscale" />
                        <nav className="flex flex-wrap justify-center gap-6 text-sm">
                            {footerLinks.map((link, i) => (
                                <a key={i} href={link.href} className="text-gray-600 hover:text-purple-600">{link.label}</a>
                            ))}
                        </nav>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-200 text-center text-sm text-gray-500">© 2025 1cPublishing.com</div>
                </div>
            </footer>

            {/* Detail Modal */}
            <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 bg-white">
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                                    <Brain className="w-5 h-5 text-purple-600" />
                                </div>
                                <h2 className="text-xl font-bold text-gray-900">{selectedNode}</h2>
                            </div>
                            <button onClick={() => setShowDetailModal(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {loadingDetails ? (
                            <div className="py-12 text-center">
                                <Loader2 className="w-8 h-8 text-purple-600 mx-auto mb-4 animate-spin" />
                                <p className="text-gray-500">Loading comprehensive insights...</p>
                            </div>
                        ) : nodeDetails && (
                            <Tabs defaultValue="overview" className="w-full">
                                <TabsList className="w-full grid grid-cols-5 mb-6">
                                    <TabsTrigger value="overview"><BookOpen className="w-4 h-4 mr-1" /> Overview</TabsTrigger>
                                    <TabsTrigger value="professional"><Briefcase className="w-4 h-4 mr-1" /> Professional</TabsTrigger>
                                    <TabsTrigger value="timeline"><Clock className="w-4 h-4 mr-1" /> Timeline</TabsTrigger>
                                    <TabsTrigger value="insights"><BarChart3 className="w-4 h-4 mr-1" /> Insights</TabsTrigger>
                                    <TabsTrigger value="documents"><FileText className="w-4 h-4 mr-1" /> Documents</TabsTrigger>
                                </TabsList>

                                <TabsContent value="overview" className="space-y-6">
                                    <div className="bg-purple-50 rounded-xl p-6">
                                        <h3 className="font-semibold text-gray-900 mb-3">Summary</h3>
                                        <p className="text-gray-700">{nodeDetails.overview?.summary}</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-white border border-gray-200 rounded-xl p-4">
                                            <div className="flex items-center gap-2 mb-2"><Target className="w-5 h-5 text-purple-600" /><h4 className="font-semibold text-gray-900">What</h4></div>
                                            <p className="text-sm text-gray-600">{nodeDetails.overview?.what}</p>
                                        </div>
                                        <div className="bg-white border border-gray-200 rounded-xl p-4">
                                            <div className="flex items-center gap-2 mb-2"><Calendar className="w-5 h-5 text-blue-600" /><h4 className="font-semibold text-gray-900">When</h4></div>
                                            <p className="text-sm text-gray-600">{nodeDetails.overview?.when}</p>
                                        </div>
                                        <div className="bg-white border border-gray-200 rounded-xl p-4">
                                            <div className="flex items-center gap-2 mb-2"><Users className="w-5 h-5 text-green-600" /><h4 className="font-semibold text-gray-900">Who</h4></div>
                                            <p className="text-sm text-gray-600">{nodeDetails.overview?.who}</p>
                                        </div>
                                        <div className="bg-white border border-gray-200 rounded-xl p-4">
                                            <div className="flex items-center gap-2 mb-2"><Globe className="w-5 h-5 text-orange-600" /><h4 className="font-semibold text-gray-900">Where</h4></div>
                                            <p className="text-sm text-gray-600">{nodeDetails.overview?.where}</p>
                                        </div>
                                    </div>
                                </TabsContent>

                                <TabsContent value="professional" className="space-y-6">
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="bg-white border border-gray-200 rounded-xl p-4">
                                            <div className="flex items-center gap-2 mb-3"><Zap className="w-5 h-5 text-purple-600" /><h4 className="font-semibold text-gray-900">Required Skills</h4></div>
                                            <div className="flex flex-wrap gap-2">{nodeDetails.professional?.skills?.map((skill, i) => (<span key={i} className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm">{skill}</span>))}</div>
                                        </div>
                                        <div className="bg-white border border-gray-200 rounded-xl p-4">
                                            <div className="flex items-center gap-2 mb-3"><GraduationCap className="w-5 h-5 text-blue-600" /><h4 className="font-semibold text-gray-900">Related Subjects</h4></div>
                                            <div className="flex flex-wrap gap-2">{nodeDetails.professional?.subjects?.map((subject, i) => (<span key={i} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">{subject}</span>))}</div>
                                        </div>
                                        <div className="bg-white border border-gray-200 rounded-xl p-4">
                                            <div className="flex items-center gap-2 mb-3"><Award className="w-5 h-5 text-green-600" /><h4 className="font-semibold text-gray-900">Subject Matter Experts</h4></div>
                                            <div className="space-y-2">{nodeDetails.professional?.experts?.slice(0, 4).map((expert, i) => (<div key={i} className="flex items-center gap-2"><div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">{expert.name?.charAt(0)}</div><div><p className="text-sm font-medium text-gray-900">{expert.name}</p><p className="text-xs text-gray-500">{expert.role}</p></div></div>))}</div>
                                        </div>
                                        <div className="bg-white border border-gray-200 rounded-xl p-4">
                                            <div className="flex items-center gap-2 mb-3"><Briefcase className="w-5 h-5 text-orange-600" /><h4 className="font-semibold text-gray-900">Relevant Job Titles</h4></div>
                                            <div className="flex flex-wrap gap-2">{nodeDetails.professional?.jobTitles?.map((job, i) => (<span key={i} className="px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-sm">{job}</span>))}</div>
                                        </div>
                                    </div>
                                </TabsContent>

                                <TabsContent value="timeline">
                                    <div className="relative">
                                        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-purple-200" />
                                        <div className="space-y-6">{nodeDetails.timeline?.events?.map((event, i) => (<div key={i} className="relative pl-10"><div className="absolute left-2 w-5 h-5 rounded-full bg-purple-600 border-4 border-white" /><div className="bg-white border border-gray-200 rounded-xl p-4"><span className="text-xs font-bold text-purple-600">{event.year}</span><h4 className="font-semibold text-gray-900 mt-1">{event.title}</h4><p className="text-sm text-gray-600 mt-1">{event.description}</p></div></div>))}</div>
                                    </div>
                                </TabsContent>

                                <TabsContent value="insights" className="space-y-6">
                                    <div className="grid grid-cols-3 gap-4">{nodeDetails.insights?.metrics?.slice(0, 3).map((metric, i) => (<MetricCard key={i} title={metric.label} value={metric.value} change={metric.change} changeType="positive" variant="white" />))}</div>
                                    {nodeDetails.insights?.distribution?.length > 0 && (
                                        <div className="grid grid-cols-2 gap-6">
                                            <PieChartCard title="Distribution" variant="donut" data={nodeDetails.insights.distribution} />
                                            <HorizontalBarChart title="Comparison" data={nodeDetails.insights.distribution.map(d => ({ name: d.name, value1: d.value, value2: Math.floor(d.value * 0.7) }))} />
                                        </div>
                                    )}
                                </TabsContent>

                                <TabsContent value="documents" className="space-y-6">
                                    {nodeDetails.documents?.groups?.map((group, i) => (
                                        <div key={i}>
                                            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2"><FileText className="w-5 h-5 text-purple-600" />{group.category}</h3>
                                            <div className="grid grid-cols-2 gap-3">{group.documents?.map((doc, j) => (<div key={j} className="bg-white border border-gray-200 rounded-xl p-4 hover:border-purple-300 hover:shadow-sm transition-all cursor-pointer"><div className="flex items-start gap-3"><div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0"><FileText className="w-5 h-5 text-purple-600" /></div><div className="flex-1 min-w-0"><h4 className="font-medium text-gray-900 truncate">{doc.title}</h4><p className="text-sm text-gray-500 line-clamp-2">{doc.description}</p><div className="flex items-center gap-2 mt-2"><span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{doc.type}</span><span className="text-xs text-gray-400">{doc.source}</span></div></div></div></div>))}</div>
                                        </div>
                                    ))}
                                </TabsContent>
                            </Tabs>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}