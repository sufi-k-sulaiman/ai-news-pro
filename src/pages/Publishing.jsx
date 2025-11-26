import React, { useState, useEffect, useRef } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Mic, Menu, X, Home, FileText, Users, Settings, HelpCircle, BookOpen } from "lucide-react";

const LOGO_URL = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/692729a5f5180fbd43f297e9/868a98750_1cPublishing-logo.png";

export default function Publishing() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const searchRef = useRef(null);

    // Sample suggestions - in production, fetch dynamically
    const allSuggestions = [
        "Publishing guidelines",
        "Content management",
        "Author submissions",
        "Editorial process",
        "Copyright policies",
        "Digital publishing",
        "Print on demand",
        "Marketing resources",
        "Distribution channels",
        "Royalty information"
    ];

    useEffect(() => {
        if (searchQuery.length > 0) {
            const filtered = allSuggestions.filter(s => 
                s.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setSuggestions(filtered);
            setShowSuggestions(true);
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    }, [searchQuery]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (searchRef.current && !searchRef.current.contains(e.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleVoiceSearch = () => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            const recognition = new SpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = false;

            recognition.onstart = () => setIsListening(true);
            recognition.onend = () => setIsListening(false);
            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setSearchQuery(transcript);
            };
            recognition.onerror = () => setIsListening(false);

            recognition.start();
        } else {
            alert('Voice search is not supported in this browser.');
        }
    };

    const menuItems = [
        { icon: Home, label: "Dashboard", href: "#" },
        { icon: BookOpen, label: "Publications", href: "#" },
        { icon: FileText, label: "Documents", href: "#" },
        { icon: Users, label: "Authors", href: "#" },
        { icon: Settings, label: "Settings", href: "#" },
        { icon: HelpCircle, label: "Help", href: "#" },
    ];

    return (
        <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F5F5F5' }}>
            {/* Header */}
            <header className="shadow-sm sticky top-0 z-50" style={{ backgroundColor: '#0D1321' }}>
                <div className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="text-white hover:bg-white/10"
                        >
                            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </Button>
                        <div className="flex items-center gap-3">
                            <img src={LOGO_URL} alt="1cPublishing" className="h-10 w-10 object-contain" />
                            <span className="text-xl font-bold" style={{ color: '#8BC34A' }}>1cPublishing</span>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div ref={searchRef} className="flex-1 max-w-2xl mx-8 relative">
                        <div className="relative flex items-center">
                            <Search className="absolute left-4 w-5 h-5" style={{ color: '#6B4EE6' }} />
                            <Input
                                type="text"
                                placeholder="Search publications, authors, documents..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() => searchQuery && setShowSuggestions(true)}
                                className="w-full pl-12 pr-12 py-6 text-lg rounded-full border-2"
                                style={{ borderColor: '#50C8E8', backgroundColor: 'white' }}
                            />
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleVoiceSearch}
                                className={`absolute right-2 rounded-full ${isListening ? 'text-red-500 animate-pulse' : ''}`}
                                style={{ color: isListening ? undefined : '#6B4EE6' }}
                            >
                                <Mic className="w-5 h-5" />
                            </Button>
                        </div>

                        {/* Suggestions Dropdown */}
                        {showSuggestions && suggestions.length > 0 && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg overflow-hidden z-50" style={{ borderColor: '#E0E0E0', borderWidth: 1 }}>
                                {suggestions.map((suggestion, index) => (
                                    <button
                                        key={index}
                                        onClick={() => {
                                            setSearchQuery(suggestion);
                                            setShowSuggestions(false);
                                        }}
                                        className="w-full px-4 py-3 text-left flex items-center gap-3 hover:opacity-80"
                                        style={{ backgroundColor: index % 2 === 0 ? 'white' : '#F5F5F5', color: '#0D1321' }}
                                    >
                                        <Search className="w-4 h-4" style={{ color: '#50C8E8' }} />
                                        {suggestion}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="w-32" /> {/* Spacer for balance */}
                </div>
            </header>

            <div className="flex flex-1">
                {/* Left Sidebar */}
                <aside 
                    className={`${sidebarOpen ? 'w-64' : 'w-0'} transition-all duration-300 overflow-hidden`}
                    style={{ backgroundColor: '#0D1321' }}
                >
                    <nav className="p-4 space-y-2">
                        {menuItems.map((item, index) => (
                            <a
                                key={index}
                                href={item.href}
                                className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors hover:opacity-90"
                                style={{ color: '#E0E0E0' }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#6B4EE6'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                            >
                                <item.icon className="w-5 h-5" style={{ color: '#50C8E8' }} />
                                <span className="font-medium">{item.label}</span>
                            </a>
                        ))}
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-8" style={{ backgroundColor: '#E0E0E0' }}>
                    <div className="max-w-4xl mx-auto">
                        <h1 className="text-3xl font-bold mb-4" style={{ color: '#0D1321' }}>Welcome to 1cPublishing</h1>
                        <p className="mb-8" style={{ color: '#0D1321' }}>Your comprehensive publishing management platform.</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow" style={{ borderLeft: '4px solid #8BC34A' }}>
                                    <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: '#50C8E8' }}>
                                        <BookOpen className="w-6 h-6 text-white" />
                                    </div>
                                    <h3 className="font-semibold mb-2" style={{ color: '#0D1321' }}>Content Block {i}</h3>
                                    <p className="text-sm" style={{ color: '#6B4EE6' }}>Dynamic content will be displayed here based on your data.</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </main>
            </div>

            {/* Footer */}
            <footer className="py-8 mt-auto" style={{ backgroundColor: '#0D1321' }}>
                <div className="max-w-6xl mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex items-center gap-3">
                            <img src={LOGO_URL} alt="1cPublishing" className="h-8 w-8 object-contain brightness-0 invert" />
                            <span className="font-semibold" style={{ color: '#8BC34A' }}>1cPublishing</span>
                        </div>
                        
                        <nav className="flex flex-wrap justify-center gap-6 text-sm">
                            <a href="#" className="transition-colors" style={{ color: '#E0E0E0' }} onMouseEnter={(e) => e.currentTarget.style.color = '#50C8E8'} onMouseLeave={(e) => e.currentTarget.style.color = '#E0E0E0'}>Contact Us</a>
                            <a href="#" className="transition-colors" style={{ color: '#E0E0E0' }} onMouseEnter={(e) => e.currentTarget.style.color = '#50C8E8'} onMouseLeave={(e) => e.currentTarget.style.color = '#E0E0E0'}>Governance</a>
                            <a href="#" className="transition-colors" style={{ color: '#E0E0E0' }} onMouseEnter={(e) => e.currentTarget.style.color = '#50C8E8'} onMouseLeave={(e) => e.currentTarget.style.color = '#E0E0E0'}>Cookie Policy</a>
                            <a href="#" className="transition-colors" style={{ color: '#E0E0E0' }} onMouseEnter={(e) => e.currentTarget.style.color = '#50C8E8'} onMouseLeave={(e) => e.currentTarget.style.color = '#E0E0E0'}>Terms of Use</a>
                        </nav>
                    </div>
                    
                    <div className="mt-6 pt-6 text-center text-sm" style={{ borderTopColor: '#6B4EE6', borderTopWidth: 1, color: '#E0E0E0' }}>
                        © {new Date().getFullYear()} 1cPublishing. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
}