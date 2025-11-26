import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Menu, ChevronLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import GlobalSearchBar from './GlobalSearchBar';
import { LOGO_URL, menuItems, footerLinks } from './NavigationConfig';

export default function PageLayout({ children, activePage, onSearch, searchPlaceholder = "Search anything...", showSearch = true }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [blackWhiteMode] = useState(() => localStorage.getItem('blackWhiteMode') === 'true');
    const [hideIcons] = useState(() => localStorage.getItem('hideIcons') === 'true');

    // Auto-open sidebar on desktop
    React.useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setSidebarOpen(true);
            } else {
                setSidebarOpen(false);
            }
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className={`min-h-screen flex flex-col bg-gray-50 ${blackWhiteMode ? 'grayscale' : ''}`}>
            {/* Header - fixed height */}
            <header className="bg-white sticky top-0 z-50 border-b border-gray-200 shadow-sm h-[72px]">
                <div className="flex items-center justify-between px-4 h-full">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="hover:bg-gray-100 md:hidden"
                        >
                            <Menu className="w-5 h-5 text-purple-600" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="hover:bg-gray-100 hidden md:flex"
                        >
                            {sidebarOpen ? <ChevronLeft className="w-5 h-5 text-purple-600" /> : <Menu className="w-5 h-5 text-purple-600" />}
                        </Button>
                        <Link to={createPageUrl('Home')} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                            <img src={LOGO_URL} alt="1cPublishing" className="h-10 w-10 object-contain" />
                            <div className="hidden sm:block">
                                <span className="text-xl font-bold text-black">1cPublishing</span>
                                    <p className="text-xs font-medium text-purple-600">Ai Powered</p>
                            </div>
                        </Link>
                    </div>

                    {showSearch ? (
                        <GlobalSearchBar 
                            onSearch={onSearch || ((q) => console.log('Search:', q))}
                            placeholder={searchPlaceholder}
                            className="flex-1 max-w-xl mx-4 md:mx-8"
                        />
                    ) : (
                        <div className="flex-1 max-w-xl mx-4 md:mx-8 h-14" />
                    )}

                    <div className="w-10 md:w-20" />
                </div>
            </header>

            <div className="flex flex-1">
                {/* Mobile Overlay */}
                {sidebarOpen && (
                    <div 
                        className="fixed inset-0 bg-black/50 z-40 md:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                {/* Sidebar */}
                <aside className={`${sidebarOpen ? 'w-64 translate-x-0' : 'w-0 -translate-x-full md:translate-x-0'} transition-all duration-300 overflow-hidden bg-white border-r border-gray-200 flex-shrink-0 fixed md:relative z-50 md:z-auto h-[calc(100vh-72px)] md:h-auto`}>
                    <nav className="p-4 space-y-2">
                        {menuItems.map((item, index) => (
                            <Link
                                key={index}
                                to={item.href}
                                onClick={() => window.innerWidth < 768 && setSidebarOpen(false)}
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