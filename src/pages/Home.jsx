import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Globe, Sparkles, BarChart3, Gamepad2, Settings, Radio, Brain, FileText, GraduationCap, ListTodo, StickyNote, Lightbulb, ScrollText, ArrowRight } from 'lucide-react';

const LOGO_URL = 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/692729a5f5180fbd43f297e9/a1a505225_1cPublishing-logo.png';

const features = [
    { label: 'Qwirey', icon: Sparkles, href: createPageUrl('Qwirey'), description: 'Advanced AI assistant', color: 'bg-purple-100 text-purple-600' },
    { label: 'MindMap', icon: Brain, href: createPageUrl('MindMap'), description: 'Visual knowledge exploration', color: 'bg-blue-100 text-blue-600' },
    { label: 'SearchPods', icon: Radio, href: createPageUrl('SearchPods'), description: 'AI-powered podcasts', color: 'bg-orange-100 text-orange-600' },
    { label: 'Markets', icon: BarChart3, href: createPageUrl('Markets'), description: 'Stock market analysis', color: 'bg-green-100 text-green-600' },
    { label: 'Learning', icon: GraduationCap, href: createPageUrl('Learning'), description: 'Interactive learning platform', color: 'bg-indigo-100 text-indigo-600' },
    { label: 'Geospatial', icon: Globe, href: createPageUrl('Geospatial'), description: 'Geographic intelligence', color: 'bg-cyan-100 text-cyan-600' },
    { label: 'Intelligence', icon: Lightbulb, href: createPageUrl('Intelligence'), description: 'Data-driven insights', color: 'bg-amber-100 text-amber-600' },
    { label: 'Resume Builder', icon: FileText, href: createPageUrl('ResumeBuilder'), description: 'Professional resume creator', color: 'bg-rose-100 text-rose-600' },
    { label: 'Tasks', icon: ListTodo, href: createPageUrl('Tasks'), description: 'Task management', color: 'bg-emerald-100 text-emerald-600' },
    { label: 'Notes', icon: StickyNote, href: createPageUrl('Notes'), description: 'Smart note-taking', color: 'bg-yellow-100 text-yellow-600' },
    { label: 'Games', icon: Gamepad2, href: createPageUrl('Games'), description: 'Fun arcade games', color: 'bg-pink-100 text-pink-600' },
];

export default function Home() {
    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="max-w-6xl mx-auto">
                {/* Hero Section */}
                <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-3xl p-8 md:p-12 mb-8 text-white">
                    <div className="flex items-center gap-4 mb-6">
                        <img src={LOGO_URL} alt="1cPublishing" className="w-16 h-16 rounded-xl" />
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold">Welcome to 1cPublishing</h1>
                            <p className="text-purple-200">Your intelligent productivity platform</p>
                        </div>
                    </div>
                    <p className="text-lg text-purple-100 max-w-2xl">
                        Explore AI-powered tools for research, learning, productivity, and more. 
                        Everything you need to work smarter, all in one place.
                    </p>
                </div>

                {/* Features Grid */}
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Explore Features</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {features.map((feature) => (
                        <Link
                            key={feature.label}
                            to={feature.href}
                            className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-purple-300 hover:shadow-lg transition-all group"
                        >
                            <div className="flex items-start gap-4">
                                <div className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center flex-shrink-0`}>
                                    <feature.icon className="w-6 h-6" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors flex items-center gap-2">
                                        {feature.label}
                                        <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </h3>
                                    <p className="text-sm text-gray-500 mt-1">{feature.description}</p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Quick Links */}
                <div className="mt-8 flex flex-wrap gap-3">
                    <Link
                        to={createPageUrl('Settings')}
                        className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-gray-200 text-gray-600 hover:border-purple-300 hover:text-purple-600 transition-all"
                    >
                        <Settings className="w-4 h-4" />
                        Settings
                    </Link>
                    <Link
                        to={createPageUrl('TermsOfUse')}
                        className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-gray-200 text-gray-600 hover:border-purple-300 hover:text-purple-600 transition-all"
                    >
                        <ScrollText className="w-4 h-4" />
                        Terms of Use
                    </Link>
                </div>
            </div>
        </div>
    );
}