import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Toaster } from 'sonner';
import { Menu, X, Globe, Sparkles, BarChart3, Gamepad2, Settings, Radio, Brain, FileText, GraduationCap, ListTodo, StickyNote, Lightbulb, ScrollText, Search } from 'lucide-react';

const LOGO_URL = 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/692729a5f5180fbd43f297e9/a1a505225_1cPublishing-logo.png';

const menuItems = [
    { label: 'Home', icon: Globe, href: createPageUrl('Home') },
    { label: 'Qwirey', icon: Sparkles, href: createPageUrl('Qwirey') },
    { label: 'MindMap', icon: Brain, href: createPageUrl('MindMap') },
    { label: 'SearchPods', icon: Radio, href: createPageUrl('SearchPods') },
    { label: 'Markets', icon: BarChart3, href: createPageUrl('Markets') },
    { label: 'Learning', icon: GraduationCap, href: createPageUrl('Learning') },
    { label: 'Geospatial', icon: Globe, href: createPageUrl('Geospatial') },
    { label: 'Intelligence', icon: Lightbulb, href: createPageUrl('Intelligence') },
    { label: 'Resume Builder', icon: FileText, href: createPageUrl('ResumeBuilder') },
    { label: 'Tasks', icon: ListTodo, href: createPageUrl('Tasks') },
    { label: 'Notes', icon: StickyNote, href: createPageUrl('Notes') },
    { label: 'Games', icon: Gamepad2, href: createPageUrl('Games') },
    { label: 'Terms of Use', icon: ScrollText, href: createPageUrl('TermsOfUse') },
    { label: 'Settings', icon: Settings, href: createPageUrl('Settings') },
];

export default function PageLayout({ children, activePage }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Toaster position="bottom-right" />
            
            {/* Header */}
            <header className="bg-white sticky top-0 z-40 border-b border-gray-200 h-16">
                <div className="flex items-center justify-between px-4 h-full">
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="p-2 rounded-lg hover:bg-gray-100"
                        >
                            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                        <Link to={createPageUrl('Home')} className="flex items-center gap-2">
                            <img src={LOGO_URL} alt="Logo" className="h-8 w-8" />
                            <span className="font-bold text-gray-900 hidden sm:block">1cPublishing</span>
                        </Link>
                    </div>
                    <Link 
                        to={createPageUrl('Search')}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200"
                    >
                        <Search className="w-4 h-4" />
                        <span className="hidden sm:inline">Search...</span>
                    </Link>
                </div>
            </header>
            
            <div className="flex flex-1">
                {/* Sidebar */}
                {sidebarOpen && (
                    <>
                        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
                        <aside className="fixed md:relative z-50 w-64 bg-white border-r border-gray-200 h-[calc(100vh-64px)] overflow-auto">
                            <nav className="p-4 space-y-1">
                                {menuItems.map((item) => (
                                    <Link
                                        key={item.label}
                                        to={item.href}
                                        onClick={() => setSidebarOpen(false)}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                                            item.label === activePage
                                                ? 'bg-purple-100 text-purple-700'
                                                : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                    >
                                        <item.icon className="w-5 h-5" />
                                        <span>{item.label}</span>
                                    </Link>
                                ))}
                            </nav>
                        </aside>
                    </>
                )}
                
                {/* Main Content */}
                <main className="flex-1 overflow-auto">
                    {children}
                </main>
            </div>
            
            {/* Footer */}
            <footer className="py-4 bg-white border-t border-gray-200 text-center text-sm text-gray-500">
                © 2025 1cPublishing.com
            </footer>
        </div>
    );
}