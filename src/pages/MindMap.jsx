import React, { useState } from 'react';
import { Brain, Search, Expand, BookOpen, Loader2, X, Sparkles, ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { base44 } from '@/api/base44Client';

const COLORS = ['#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#3B82F6', '#EC4899', '#0EA5E9', '#6366F1'];

export default function MindMap() {
    const [query, setQuery] = useState('');
    const [mindMap, setMindMap] = useState(null);
    const [loading, setLoading] = useState(false);
    const [expandingNode, setExpandingNode] = useState(null);
    const [selectedNode, setSelectedNode] = useState(null);
    const [nodeDetails, setNodeDetails] = useState(null);
    const [detailsLoading, setDetailsLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const generateMindMap = async () => {
        if (!query.trim()) return;
        setLoading(true);
        setMindMap(null);

        try {
            const response = await base44.integrations.Core.InvokeLLM({
                prompt: `Generate a mind map for the topic "${query}". Return JSON with:
- central: the main topic
- branches: array of 5-6 main branches, each with:
  - name: branch name
  - children: array of 3-4 sub-topics (strings)`,
                add_context_from_internet: true,
                response_json_schema: {
                    type: "object",
                    properties: {
                        central: { type: "string" },
                        branches: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    name: { type: "string" },
                                    children: { type: "array", items: { type: "string" } }
                                }
                            }
                        }
                    }
                }
            });
            setMindMap(response);
        } catch (error) {
            console.error('Error generating mind map:', error);
        } finally {
            setLoading(false);
        }
    };

    const expandNode = async (branchIndex, nodeName) => {
        setExpandingNode(`${branchIndex}-${nodeName}`);
        try {
            const response = await base44.integrations.Core.InvokeLLM({
                prompt: `Expand on "${nodeName}" in the context of "${mindMap?.central}". Provide 4-5 more detailed sub-topics.`,
                response_json_schema: {
                    type: "object",
                    properties: { subtopics: { type: "array", items: { type: "string" } } }
                }
            });
            if (response?.subtopics) {
                setMindMap(prev => ({
                    ...prev,
                    branches: prev.branches.map((b, i) => 
                        i === branchIndex 
                            ? { ...b, children: [...b.children, ...response.subtopics] }
                            : b
                    )
                }));
            }
        } catch (error) {
            console.error('Error expanding node:', error);
        } finally {
            setExpandingNode(null);
        }
    };

    const fetchNodeDetails = async (nodeName) => {
        setSelectedNode(nodeName);
        setShowModal(true);
        setDetailsLoading(true);
        setNodeDetails(null);

        try {
            const response = await base44.integrations.Core.InvokeLLM({
                prompt: `Provide detailed information about "${nodeName}" in the context of "${mindMap?.central}":
1. Overview (2-3 sentences)
2. Key points (5 bullet points)
3. Examples (3 real-world examples)
4. Related topics (5 related concepts)`,
                add_context_from_internet: true,
                response_json_schema: {
                    type: "object",
                    properties: {
                        overview: { type: "string" },
                        keyPoints: { type: "array", items: { type: "string" } },
                        examples: { type: "array", items: { type: "string" } },
                        relatedTopics: { type: "array", items: { type: "string" } }
                    }
                }
            });
            setNodeDetails(response);
        } catch (error) {
            console.error('Error fetching details:', error);
        } finally {
            setDetailsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="bg-gradient-to-r from-pink-600 to-rose-600 rounded-2xl p-6 mb-6 text-white">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center">
                            <Brain className="w-7 h-7" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold">MindMap Explorer</h1>
                            <p className="text-white/80 text-sm">AI-powered knowledge visualization</p>
                        </div>
                    </div>
                </div>

                {/* Search */}
                <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
                    <div className="flex gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <Input
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && generateMindMap()}
                                placeholder="Enter a topic to explore..."
                                className="pl-10"
                            />
                        </div>
                        <Button onClick={generateMindMap} disabled={loading} className="bg-pink-600 hover:bg-pink-700">
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                            <span className="ml-2">Generate</span>
                        </Button>
                    </div>
                </div>

                {/* Mind Map */}
                {loading && (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin text-pink-600" />
                        <span className="ml-3 text-gray-600">Generating mind map...</span>
                    </div>
                )}

                {mindMap && !loading && (
                    <div className="bg-white rounded-xl border border-gray-200 p-6 overflow-x-auto">
                        {/* Central Node */}
                        <div className="flex flex-col items-center">
                            <div className="px-6 py-4 bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-2xl font-bold text-lg shadow-lg mb-8">
                                {mindMap.central}
                            </div>

                            {/* Branches */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                                {mindMap.branches?.map((branch, branchIndex) => (
                                    <div key={branchIndex} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                                        <div className="flex items-center gap-2 mb-4">
                                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[branchIndex % COLORS.length] }} />
                                            <h3 className="font-semibold text-gray-900">{branch.name}</h3>
                                        </div>
                                        <div className="space-y-2">
                                            {branch.children?.map((child, childIndex) => (
                                                <div key={childIndex} 
                                                    className="flex items-center justify-between p-2 bg-white rounded-lg border border-gray-100 hover:border-pink-200 transition-all group">
                                                    <span className="text-sm text-gray-700">{child}</span>
                                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button onClick={() => expandNode(branchIndex, child)}
                                                            disabled={expandingNode === `${branchIndex}-${child}`}
                                                            className="p-1 hover:bg-gray-100 rounded">
                                                            {expandingNode === `${branchIndex}-${child}` 
                                                                ? <Loader2 className="w-4 h-4 animate-spin text-pink-600" />
                                                                : <Expand className="w-4 h-4 text-gray-400" />}
                                                        </button>
                                                        <button onClick={() => fetchNodeDetails(child)}
                                                            className="p-1 hover:bg-gray-100 rounded">
                                                            <BookOpen className="w-4 h-4 text-gray-400" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {!mindMap && !loading && (
                    <div className="text-center py-20 text-gray-400">
                        <Brain className="w-16 h-16 mx-auto mb-4 opacity-30" />
                        <p>Enter a topic to generate a mind map</p>
                    </div>
                )}
            </div>

            {/* Details Modal */}
            <Dialog open={showModal} onOpenChange={setShowModal}>
                <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-pink-600" />
                            {selectedNode}
                        </DialogTitle>
                    </DialogHeader>
                    {detailsLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="w-6 h-6 animate-spin text-pink-600" />
                        </div>
                    ) : nodeDetails && (
                        <Tabs defaultValue="overview" className="mt-4">
                            <TabsList className="grid grid-cols-4 w-full">
                                <TabsTrigger value="overview">Overview</TabsTrigger>
                                <TabsTrigger value="points">Key Points</TabsTrigger>
                                <TabsTrigger value="examples">Examples</TabsTrigger>
                                <TabsTrigger value="related">Related</TabsTrigger>
                            </TabsList>
                            <TabsContent value="overview" className="mt-4">
                                <p className="text-gray-700">{nodeDetails.overview}</p>
                            </TabsContent>
                            <TabsContent value="points" className="mt-4">
                                <ul className="space-y-2">
                                    {nodeDetails.keyPoints?.map((point, i) => (
                                        <li key={i} className="flex items-start gap-2">
                                            <ChevronRight className="w-4 h-4 text-pink-600 mt-0.5 flex-shrink-0" />
                                            <span className="text-gray-700 text-sm">{point}</span>
                                        </li>
                                    ))}
                                </ul>
                            </TabsContent>
                            <TabsContent value="examples" className="mt-4">
                                <ul className="space-y-2">
                                    {nodeDetails.examples?.map((example, i) => (
                                        <li key={i} className="p-3 bg-gray-50 rounded-lg text-sm text-gray-700">{example}</li>
                                    ))}
                                </ul>
                            </TabsContent>
                            <TabsContent value="related" className="mt-4">
                                <div className="flex flex-wrap gap-2">
                                    {nodeDetails.relatedTopics?.map((topic, i) => (
                                        <span key={i} className="px-3 py-1 bg-pink-50 text-pink-700 rounded-full text-sm">{topic}</span>
                                    ))}
                                </div>
                            </TabsContent>
                        </Tabs>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}