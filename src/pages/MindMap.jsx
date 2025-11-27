import React, { useState, useRef, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Brain, Search, Loader2, Sparkles, Maximize2, Minimize2, Network } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import LearnMoreModal from '../components/mindmap/LearnMoreModal';

const NODE_COLORS = [
    { bg: 'bg-purple-500', text: 'text-white', border: 'border-purple-600' },
    { bg: 'bg-green-500', text: 'text-white', border: 'border-green-600' },
    { bg: 'bg-blue-500', text: 'text-white', border: 'border-blue-600' },
    { bg: 'bg-orange-500', text: 'text-white', border: 'border-orange-600' },
    { bg: 'bg-pink-500', text: 'text-white', border: 'border-pink-600' },
    { bg: 'bg-cyan-500', text: 'text-white', border: 'border-cyan-600' },
    { bg: 'bg-amber-500', text: 'text-white', border: 'border-amber-600' },
    { bg: 'bg-rose-500', text: 'text-white', border: 'border-rose-600' },
];

function MindMapNode({ node, colorIndex, onExplore, onLearn, level = 0 }) {
    const color = NODE_COLORS[colorIndex % NODE_COLORS.length];
    const hasChildren = node.children && node.children.length > 0;
    
    return (
        <div className="flex flex-col items-center">
            {/* Node */}
            <div className={`${color.bg} ${color.text} rounded-xl px-4 py-3 shadow-lg min-w-[140px] max-w-[200px] text-center`}>
                <p className="font-semibold text-sm leading-tight mb-2">{node.name}</p>
                <div className="flex gap-1.5 justify-center">
                    <button
                        onClick={() => onExplore(node)}
                        className="flex items-center gap-1 px-2 py-1 bg-white/20 hover:bg-white/30 rounded-md text-xs font-medium transition-colors"
                    >
                        <Sparkles className="w-3 h-3" />
                        Explore
                    </button>
                    <button
                        onClick={() => onLearn(node)}
                        className="flex items-center gap-1 px-2 py-1 bg-white/20 hover:bg-white/30 rounded-md text-xs font-medium transition-colors"
                    >
                        <Brain className="w-3 h-3" />
                        Learn
                    </button>
                </div>
            </div>
            
            {/* Connection line and children */}
            {hasChildren && (
                <>
                    <div className="w-0.5 h-6 bg-gray-300" />
                    <div className="flex gap-4 flex-wrap justify-center">
                        {node.children.map((child, i) => (
                            <div key={i} className="flex flex-col items-center">
                                <div className="w-0.5 h-4 bg-gray-300" />
                                <MindMapNode
                                    node={child}
                                    colorIndex={colorIndex + i + 1}
                                    onExplore={onExplore}
                                    onLearn={onLearn}
                                    level={level + 1}
                                />
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

export default function MindMapPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [treeData, setTreeData] = useState(null);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [selectedKeyword, setSelectedKeyword] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const containerRef = useRef(null);

    const handleSearch = async (topic) => {
        if (!topic?.trim()) return;
        setLoading(true);
        
        try {
            const response = await base44.integrations.Core.InvokeLLM({
                prompt: `Create a hierarchical topic tree for "${topic}". Generate a root topic with 2-3 main branches, each having 2-4 sub-branches, and some of those having 1-3 leaf nodes. Return as a nested tree structure.`,
                add_context_from_internet: true,
                response_json_schema: {
                    type: "object",
                    properties: {
                        name: { type: "string" },
                        description: { type: "string" },
                        children: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    name: { type: "string" },
                                    description: { type: "string" },
                                    children: {
                                        type: "array",
                                        items: {
                                            type: "object",
                                            properties: {
                                                name: { type: "string" },
                                                description: { type: "string" },
                                                children: {
                                                    type: "array",
                                                    items: {
                                                        type: "object",
                                                        properties: {
                                                            name: { type: "string" },
                                                            description: { type: "string" }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            });

            setTreeData(response);
            setSearchTerm('');
        } catch (error) {
            console.error('Search failed:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleExplore = (node) => {
        handleSearch(node.name);
    };

    const handleLearn = (node) => {
        setSelectedKeyword(node);
        setShowModal(true);
    };

    const toggleFullscreen = () => {
        if (!isFullscreen) {
            containerRef.current?.requestFullscreen?.();
        } else {
            document.exitFullscreen?.();
        }
    };

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    return (
        <div 
            ref={containerRef}
            className={`min-h-screen bg-gray-50 ${isFullscreen ? 'p-4' : 'p-4 md:p-6'}`}
        >
            <div className={`${isFullscreen ? 'max-w-none' : 'max-w-7xl mx-auto'}`}>
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center">
                            <Network className="w-5 h-5 text-white" />
                        </div>
                        <h1 className="text-xl font-bold text-gray-900">Neural Topic Network</h1>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        {/* Search */}
                        <div className="flex gap-2">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Input
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="AI-Powered search..."
                                    className="pl-9 w-64 bg-white"
                                    onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(searchTerm); }}
                                />
                            </div>
                            <Button
                                onClick={() => handleSearch(searchTerm)}
                                disabled={loading || !searchTerm.trim()}
                                className="bg-purple-600 hover:bg-purple-700"
                            >
                                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                            </Button>
                        </div>
                        
                        {/* Fullscreen toggle */}
                        <Button
                            variant="outline"
                            onClick={toggleFullscreen}
                            className="gap-2"
                        >
                            {isFullscreen ? (
                                <>
                                    <Minimize2 className="w-4 h-4" />
                                    Exit Fullscreen
                                </>
                            ) : (
                                <>
                                    <Maximize2 className="w-4 h-4" />
                                    Fullscreen
                                </>
                            )}
                        </Button>
                    </div>
                </div>

                {/* Mind Map Content */}
                <div className={`bg-white rounded-2xl border border-gray-200 ${isFullscreen ? 'min-h-[calc(100vh-100px)]' : 'min-h-[600px]'} overflow-auto p-8`}>
                    {!treeData && !loading ? (
                        <div className="h-full flex flex-col items-center justify-center py-20">
                            <div className="w-20 h-20 rounded-2xl bg-purple-100 flex items-center justify-center mb-6">
                                <Network className="w-10 h-10 text-purple-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-3">Start Exploring</h2>
                            <p className="text-gray-500 max-w-md text-center mb-6">
                                Search for any topic to generate an interactive knowledge tree. Click Explore to dive deeper or Learn for detailed insights.
                            </p>
                            <div className="flex flex-wrap justify-center gap-2">
                                {['Technology', 'Science', 'History', 'Business', 'Art'].map(topic => (
                                    <Button
                                        key={topic}
                                        variant="outline"
                                        onClick={() => handleSearch(topic)}
                                        className="rounded-full"
                                    >
                                        {topic}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    ) : loading ? (
                        <div className="h-full flex flex-col items-center justify-center py-20">
                            <Loader2 className="w-12 h-12 animate-spin text-purple-600 mb-4" />
                            <p className="text-gray-600">Building knowledge network...</p>
                        </div>
                    ) : (
                        <div className="flex justify-center py-8 overflow-x-auto">
                            <MindMapNode
                                node={treeData}
                                colorIndex={0}
                                onExplore={handleExplore}
                                onLearn={handleLearn}
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Learn More Modal */}
            <LearnMoreModal
                keyword={selectedKeyword}
                isOpen={showModal}
                onClose={() => setShowModal(false)}
            />
        </div>
    );
}