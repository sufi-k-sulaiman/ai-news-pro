import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { 
    Search, Brain, Sparkles, ChevronRight, X, Menu, ChevronLeft, Settings,
    BookOpen, Users, Briefcase, Clock, BarChart3, FileText, Globe, Lightbulb,
    Target, Award, GraduationCap, Building, Calendar, TrendingUp, Loader2,
    Radio, ArrowRight, Compass, Network, Layers, Zap
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import MetricCard from '../components/dashboard/MetricCard';
import PieChartCard from '../components/dashboard/PieChartCard';
import HorizontalBarChart from '../components/dashboard/HorizontalBarChart';

const LOGO_URL = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/692729a5f5180fbd43f297e9/868a98750_1cPublishing-logo.png";

const menuItems = [
    { icon: Sparkles, label: "AI Hub", href: createPageUrl('AIHub') },
    { icon: Radio, label: "SearchPods", href: createPageUrl('SearchPods') },
    { icon: Brain, label: "MindMap", href: createPageUrl('MindMap'), active: true },
    { icon: Settings, label: "Settings", href: createPageUrl('Settings') },
];

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

    const generateMindMap = async (topic) => {
        setIsLoading(true);
        setCenterTopic(topic);
        setNodes([]);

        try {
            const response = await base44.integrations.Core.InvokeLLM({
                prompt: `Generate a mind map for the topic "${topic}". Create 6-8 related keywords/concepts that branch from this topic. For each keyword, include a brief description.`,
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
                children: []
            })));
        } catch (error) {
            console.error('Error generating mind map:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const expandNode = async (node) => {
        const updatedNodes = nodes.map(n => {
            if (n.id === node.id) {
                return { ...n, loading: true };
            }
            return n;
        });
        setNodes(updatedNodes);

        try {
            const response = await base44.integrations.Core.InvokeLLM({
                prompt: `Generate 4-5 sub-topics/related concepts for "${node.keyword}" in the context of "${centerTopic}".`,
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

            setNodes(nodes.map(n => {
                if (n.id === node.id) {
                    return {
                        ...n,
                        expanded: true,
                        loading: false,
                        children: response?.subtopics || []
                    };
                }
                return n;
            }));
        } catch (error) {
            console.error('Error expanding node:', error);
            setNodes(nodes.map(n => n.id === node.id ? { ...n, loading: false } : n));
        }
    };

    const learnMore = async (keyword) => {
        setSelectedNode(keyword);
        setShowDetailModal(true);
        setLoadingDetails(true);
        setNodeDetails(null);

        try {
            const [overview, professional, timeline, insights, documents] = await Promise.all([
                // Overview
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
                // Professional info
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
                // Timeline
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
                                    properties: {
                                        year: { type: "string" },
                                        title: { type: "string" },
                                        description: { type: "string" }
                                    }
                                }
                            }
                        }
                    }
                }),
                // Insights with data
                base44.integrations.Core.InvokeLLM({
                    prompt: `Provide deep insights about "${keyword}" with statistical data, market trends, and key metrics.`,
                    add_context_from_internet: true,
                    response_json_schema: {
                        type: "object",
                        properties: {
                            metrics: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        label: { type: "string" },
                                        value: { type: "string" },
                                        change: { type: "string" }
                                    }
                                }
                            },
                            distribution: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        name: { type: "string" },
                                        value: { type: "number" }
                                    }
                                }
                            }
                        }
                    }
                }),
                // Documents
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
                                            items: {
                                                type: "object",
                                                properties: {
                                                    title: { type: "string" },
                                                    description: { type: "string" },
                                                    type: { type: "string" },
                                                    source: { type: "string" }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                })
            ]);

            setNodeDetails({
                overview,
                professional,
                timeline,
                insights,
                documents
            });
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

    const nodeColors = ['#6B4EE6', '#3B82F6', '#EC4899', '#F59E0B', '#10B981', '#8B5CF6', '#06B6D4', '#EF4444'];

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            {/* Header */}
            <header className="bg-white sticky top-0 z-50 border-b border-gray-200 shadow-sm">
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
                            <Link key={index} to={item.href} className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${item.active ? 'bg-purple-100 text-purple-700' : 'text-gray-700 hover:bg-purple-50 hover:text-purple-600'}`}>
                                <item.icon className="w-5 h-5 text-purple-600" />
                                <span className="font-medium">{item.label}</span>
                            </Link>
                        ))}
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="flex-1 overflow-auto p-6">
                    <div className="max-w-6xl mx-auto">
                        {/* Header */}
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                                <Brain className="w-6 h-6 text-purple-600" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Neural Mind Map Explorer</h1>
                                <p className="text-gray-500">AI-powered knowledge visualization and topic exploration</p>
                            </div>
                        </div>

                        {/* Empty State */}
                        {!centerTopic && !isLoading && (
                            <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
                                <Network className="w-16 h-16 text-purple-300 mx-auto mb-4" />
                                <h2 className="text-xl font-semibold text-gray-800 mb-2">Start Exploring Knowledge</h2>
                                <p className="text-gray-500 mb-6">Enter a topic above to generate an AI-powered mind map</p>
                                <div className="flex flex-wrap justify-center gap-2">
                                    {['Artificial Intelligence', 'Climate Change', 'Blockchain', 'Quantum Computing'].map(topic => (
                                        <button key={topic} onClick={() => { setSearchQuery(topic); generateMindMap(topic); }} className="px-4 py-2 rounded-full bg-purple-50 text-purple-600 hover:bg-purple-100 text-sm">
                                            {topic}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Loading */}
                        {isLoading && (
                            <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
                                <Loader2 className="w-12 h-12 text-purple-600 mx-auto mb-4 animate-spin" />
                                <h2 className="text-xl font-semibold text-gray-800 mb-2">Generating Mind Map</h2>
                                <p className="text-gray-500">Exploring connections for "{searchQuery}"...</p>
                            </div>
                        )}

                        {/* Mind Map */}
                        {centerTopic && !isLoading && (
                            <div className="space-y-6">
                                {/* Center Topic */}
                                <div className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl p-6 text-white text-center">
                                    <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
                                        <Zap className="w-8 h-8" />
                                    </div>
                                    <h2 className="text-2xl font-bold mb-2">{centerTopic}</h2>
                                    <p className="text-white/80">{nodes.length} related concepts discovered</p>
                                </div>

                                {/* Nodes Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {nodes.map((node, i) => (
                                        <div key={node.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                                            <div className="p-4" style={{ borderLeft: `4px solid ${nodeColors[i % nodeColors.length]}` }}>
                                                <div className="flex items-start justify-between mb-2">
                                                    <div className="flex items-center gap-2">
                                                        <Lightbulb className="w-5 h-5" style={{ color: nodeColors[i % nodeColors.length] }} />
                                                        <h3 className="font-semibold text-gray-900">{node.keyword}</h3>
                                                    </div>
                                                    {node.category && (
                                                        <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">{node.category}</span>
                                                    )}
                                                </div>
                                                <p className="text-sm text-gray-600 mb-4">{node.description}</p>
                                                
                                                <div className="flex gap-2">
                                                    <Button size="sm" variant="outline" onClick={() => expandNode(node)} disabled={node.loading || node.expanded} className="flex-1">
                                                        {node.loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Compass className="w-4 h-4 mr-1" /> Explore</>}
                                                    </Button>
                                                    <Button size="sm" onClick={() => learnMore(node.keyword)} className="flex-1 bg-purple-600 hover:bg-purple-700 text-white">
                                                        <BookOpen className="w-4 h-4 mr-1" /> Learn More
                                                    </Button>
                                                </div>
                                            </div>

                                            {/* Expanded Children */}
                                            {node.expanded && node.children?.length > 0 && (
                                                <div className="bg-gray-50 p-3 border-t border-gray-200">
                                                    <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Related Topics</p>
                                                    <div className="space-y-2">
                                                        {node.children.map((child, j) => (
                                                            <div key={j} onClick={() => learnMore(child.keyword)} className="p-2 bg-white rounded-lg hover:bg-purple-50 cursor-pointer flex items-center gap-2">
                                                                <ChevronRight className="w-4 h-4 text-purple-600" />
                                                                <span className="text-sm text-gray-700">{child.keyword}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>

            {/* Footer */}
            <footer className="py-6 bg-white border-t border-gray-200">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <img src={LOGO_URL} alt="1cPublishing" className="h-8 w-8 object-contain grayscale" />
                        <nav className="flex flex-wrap justify-center gap-6 text-sm">
                            <a href="#" className="text-gray-600 hover:text-purple-600">Contact Us</a>
                            <a href="#" className="text-gray-600 hover:text-purple-600">Governance</a>
                            <a href="#" className="text-gray-600 hover:text-purple-600">Cookie Policy</a>
                            <a href="#" className="text-gray-600 hover:text-purple-600">Terms of Use</a>
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

                                {/* Overview Tab */}
                                <TabsContent value="overview" className="space-y-6">
                                    <div className="bg-purple-50 rounded-xl p-6">
                                        <h3 className="font-semibold text-gray-900 mb-3">Summary</h3>
                                        <p className="text-gray-700">{nodeDetails.overview?.summary}</p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-white border border-gray-200 rounded-xl p-4">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Target className="w-5 h-5 text-purple-600" />
                                                <h4 className="font-semibold text-gray-900">What</h4>
                                            </div>
                                            <p className="text-sm text-gray-600">{nodeDetails.overview?.what}</p>
                                        </div>
                                        <div className="bg-white border border-gray-200 rounded-xl p-4">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Calendar className="w-5 h-5 text-blue-600" />
                                                <h4 className="font-semibold text-gray-900">When</h4>
                                            </div>
                                            <p className="text-sm text-gray-600">{nodeDetails.overview?.when}</p>
                                        </div>
                                        <div className="bg-white border border-gray-200 rounded-xl p-4">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Users className="w-5 h-5 text-green-600" />
                                                <h4 className="font-semibold text-gray-900">Who</h4>
                                            </div>
                                            <p className="text-sm text-gray-600">{nodeDetails.overview?.who}</p>
                                        </div>
                                        <div className="bg-white border border-gray-200 rounded-xl p-4">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Globe className="w-5 h-5 text-orange-600" />
                                                <h4 className="font-semibold text-gray-900">Where</h4>
                                            </div>
                                            <p className="text-sm text-gray-600">{nodeDetails.overview?.where}</p>
                                        </div>
                                    </div>
                                </TabsContent>

                                {/* Professional Tab */}
                                <TabsContent value="professional" className="space-y-6">
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="bg-white border border-gray-200 rounded-xl p-4">
                                            <div className="flex items-center gap-2 mb-3">
                                                <Zap className="w-5 h-5 text-purple-600" />
                                                <h4 className="font-semibold text-gray-900">Required Skills</h4>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {nodeDetails.professional?.skills?.map((skill, i) => (
                                                    <span key={i} className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm">{skill}</span>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="bg-white border border-gray-200 rounded-xl p-4">
                                            <div className="flex items-center gap-2 mb-3">
                                                <GraduationCap className="w-5 h-5 text-blue-600" />
                                                <h4 className="font-semibold text-gray-900">Related Subjects</h4>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {nodeDetails.professional?.subjects?.map((subject, i) => (
                                                    <span key={i} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">{subject}</span>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="bg-white border border-gray-200 rounded-xl p-4">
                                            <div className="flex items-center gap-2 mb-3">
                                                <Award className="w-5 h-5 text-green-600" />
                                                <h4 className="font-semibold text-gray-900">Subject Matter Experts</h4>
                                            </div>
                                            <div className="space-y-2">
                                                {nodeDetails.professional?.experts?.slice(0, 4).map((expert, i) => (
                                                    <div key={i} className="flex items-center gap-2">
                                                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">
                                                            {expert.name?.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-900">{expert.name}</p>
                                                            <p className="text-xs text-gray-500">{expert.role}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="bg-white border border-gray-200 rounded-xl p-4">
                                            <div className="flex items-center gap-2 mb-3">
                                                <Briefcase className="w-5 h-5 text-orange-600" />
                                                <h4 className="font-semibold text-gray-900">Relevant Job Titles</h4>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {nodeDetails.professional?.jobTitles?.map((job, i) => (
                                                    <span key={i} className="px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-sm">{job}</span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </TabsContent>

                                {/* Timeline Tab */}
                                <TabsContent value="timeline">
                                    <div className="relative">
                                        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-purple-200" />
                                        <div className="space-y-6">
                                            {nodeDetails.timeline?.events?.map((event, i) => (
                                                <div key={i} className="relative pl-10">
                                                    <div className="absolute left-2 w-5 h-5 rounded-full bg-purple-600 border-4 border-white" />
                                                    <div className="bg-white border border-gray-200 rounded-xl p-4">
                                                        <span className="text-xs font-bold text-purple-600">{event.year}</span>
                                                        <h4 className="font-semibold text-gray-900 mt-1">{event.title}</h4>
                                                        <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </TabsContent>

                                {/* Insights Tab */}
                                <TabsContent value="insights" className="space-y-6">
                                    <div className="grid grid-cols-3 gap-4">
                                        {nodeDetails.insights?.metrics?.slice(0, 3).map((metric, i) => (
                                            <MetricCard
                                                key={i}
                                                title={metric.label}
                                                value={metric.value}
                                                change={metric.change}
                                                changeType="positive"
                                                variant="white"
                                            />
                                        ))}
                                    </div>

                                    {nodeDetails.insights?.distribution?.length > 0 && (
                                        <div className="grid grid-cols-2 gap-6">
                                            <PieChartCard
                                                title="Distribution"
                                                variant="donut"
                                                data={nodeDetails.insights.distribution}
                                            />
                                            <HorizontalBarChart
                                                title="Comparison"
                                                data={nodeDetails.insights.distribution.map(d => ({ name: d.name, value1: d.value, value2: Math.floor(d.value * 0.7) }))}
                                            />
                                        </div>
                                    )}
                                </TabsContent>

                                {/* Documents Tab */}
                                <TabsContent value="documents" className="space-y-6">
                                    {nodeDetails.documents?.groups?.map((group, i) => (
                                        <div key={i}>
                                            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                                <Layers className="w-5 h-5 text-purple-600" />
                                                {group.category}
                                            </h3>
                                            <div className="grid grid-cols-2 gap-3">
                                                {group.documents?.map((doc, j) => (
                                                    <div key={j} className="bg-white border border-gray-200 rounded-xl p-4 hover:border-purple-300 hover:shadow-sm transition-all cursor-pointer">
                                                        <div className="flex items-start gap-3">
                                                            <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0">
                                                                <FileText className="w-5 h-5 text-purple-600" />
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <h4 className="font-medium text-gray-900 truncate">{doc.title}</h4>
                                                                <p className="text-sm text-gray-500 line-clamp-2">{doc.description}</p>
                                                                <div className="flex items-center gap-2 mt-2">
                                                                    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{doc.type}</span>
                                                                    <span className="text-xs text-gray-400">{doc.source}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
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