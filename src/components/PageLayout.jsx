import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Menu, ChevronLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import GlobalSearchBar from './GlobalSearchBar';
import { LOGO_URL, menuItems, footerLinks } from './NavigationConfig';

export default function PageLayout({ children, activePage, onSearch, searchPlaceholder = "Search anything..." }) {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [blackWhiteMode] = useState(() => localStorage.getItem('blackWhiteMode') === 'true');
    const [hideIcons] = useState(() => localStorage.getItem('hideIcons') === 'true');

    return (
        <div className={`min-h-screen flex flex-col bg-gray-50 ${blackWhiteMode ? 'grayscale' : ''}`}>
            {/* Header */}
            <header className="bg-white sticky top-0 z-50 border-b border-gray-200 shadow-sm">
                <div className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="hover:bg-gray-100"
                        >
                            {sidebarOpen ? <ChevronLeft className="w-5 h-5 text-purple-600" /> : <Menu className="w-5 h-5 text-purple-600" />}
                        </Button>
                        <Link to={createPageUrl('Home')} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                            <img src={LOGO_URL} alt="1cPublishing" className="h-10 w-10 object-contain" />
                            <div>
                                <span className="text-xl font-bold text-black">1cPublishing</span>
                                <p className="text-xs font-medium text-purple-600">AI Powered</p>
                            </div>
                        </Link>
                    </div>

                    <GlobalSearchBar 
                        onSearch={onSearch || ((q) => console.log('Search:', q))}
                        placeholder={searchPlaceholder}
                        className="flex-1 max-w-xl mx-8"
                    />

                    <div className="w-20" />
                </div>
            </header>

            <div className="flex flex-1">
                {/* Sidebar */}
                <aside className={`${sidebarOpen ? 'w-64' : 'w-0'} transition-all duration-300 overflow-hidden bg-white border-r border-gray-200 flex-shrink-0`}>
                    <nav className="p-4 space-y-2">
                        {menuItems.map((item, index) => (
                            <Link
                                key={index}
                                to={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                                    item.label === activePage
                                        ? 'bg-purple-100 text-purple-700'
                                        : 'text-gray-700 hover:bg-purple-50 hover:text-purple-600'
                                }`}
                            >
                                {!hideIcons && <item.icon className="w-5 h-5" style={{ color: '#6B4EE6' }} />}
                                <span className="font-medium">{item.label}</span>
                            </Link>
                        ))}
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="flex-1 overflow-auto">
                    {children}
                </main>
            </div>

            {/* Footer */}
            <footer className="py-6 bg-white border-t border-gray-200">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <img src={LOGO_URL} alt="1cPublishing" className="h-8 w-8 object-contain grayscale" />
                        <nav className="flex flex-wrap justify-center gap-6 text-sm">
                            {footerLinks.map((link, i) => (
                                <a key={i} href={link.href} className="text-gray-600 hover:text-purple-600 transition-colors">{link.label}</a>
                            ))}
                        </nav>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-200 text-center text-sm text-gray-500">
                        © 2025 1cPublishing.com
                    </div>
                </div>
            </footer>
        </div>
    );
}