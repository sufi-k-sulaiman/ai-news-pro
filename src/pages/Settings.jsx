import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { 
    Home, Sparkles, FileText, BookOpen, Settings as SettingsIcon,
    Menu, ChevronLeft, Moon, Sun, Type, EyeOff, Eye, BarChart3, Radio,
    Volume2, VolumeX, Contrast
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";

const LOGO_URL = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/692729a5f5180fbd43f297e9/868a98750_1cPublishing-logo.png";

const menuItems = [
    { icon: Home, label: "Home", href: createPageUrl('Home') },
    { icon: Sparkles, label: "AI Hub", href: createPageUrl('AIHub') },
    { icon: Radio, label: "SearchPods", href: createPageUrl('SearchPods') },
    { icon: BarChart3, label: "Dashboard", href: createPageUrl('DashboardComponents') },
    { icon: SettingsIcon, label: "Settings", href: createPageUrl('Settings'), active: true },
];

// Voice prompt utility
const speakText = (text) => {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1;
        utterance.pitch = 1;
        window.speechSynthesis.speak(utterance);
    }
};

export default function Settings() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');
    const [fontSize, setFontSize] = useState(() => parseInt(localStorage.getItem('fontSize') || '16'));
    const [hideIcons, setHideIcons] = useState(() => localStorage.getItem('hideIcons') === 'true');
    const [blackWhiteMode, setBlackWhiteMode] = useState(() => localStorage.getItem('blackWhiteMode') === 'true');
    const [voicePrompts, setVoicePrompts] = useState(() => localStorage.getItem('voicePrompts') === 'true');

    useEffect(() => {
        localStorage.setItem('theme', darkMode ? 'dark' : 'light');
        document.documentElement.classList.toggle('dark', darkMode);
    }, [darkMode]);

    useEffect(() => {
        localStorage.setItem('fontSize', fontSize.toString());
        document.documentElement.style.fontSize = `${fontSize}px`;
    }, [fontSize]);

    useEffect(() => {
        localStorage.setItem('hideIcons', hideIcons.toString());
    }, [hideIcons]);

    useEffect(() => {
        localStorage.setItem('blackWhiteMode', blackWhiteMode.toString());
        document.documentElement.classList.toggle('grayscale', blackWhiteMode);
    }, [blackWhiteMode]);

    useEffect(() => {
        localStorage.setItem('voicePrompts', voicePrompts.toString());
    }, [voicePrompts]);

    const handleFocus = (text) => {
        if (voicePrompts) {
            speakText(text);
        }
    };

    return (
        <div className={`min-h-screen flex flex-col ${darkMode ? 'bg-[#0D1321]' : 'bg-gray-50'} ${blackWhiteMode ? 'grayscale' : ''}`}>
            {/* Header */}
            <header className={`sticky top-0 z-50 border-b ${darkMode ? 'bg-[#1A1F2E] border-gray-800' : 'bg-white border-gray-200'}`}>
                <div className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            onFocus={() => handleFocus('Toggle sidebar')}
                            onMouseEnter={() => handleFocus('Toggle sidebar')}
                            className={darkMode ? 'text-gray-400 hover:text-white hover:bg-gray-800' : 'hover:bg-gray-100'}
                        >
                            {sidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </Button>
                        <div className="flex items-center gap-3">
                            <img src={LOGO_URL} alt="1cPublishing" className="h-10 w-10 object-contain" />
                            <div>
                                <span className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-black'}`}>1cPublishing</span>
                                <p className="text-xs font-medium text-purple-600">AI Powered</p>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex flex-1">
                {/* Sidebar */}
                <aside className={`${sidebarOpen ? 'w-64' : 'w-0'} transition-all duration-300 overflow-hidden border-r flex-shrink-0 ${darkMode ? 'bg-[#1A1F2E] border-gray-800' : 'bg-white border-gray-200'}`}>
                    <nav className="p-4 space-y-2">
                        {menuItems.map((item, index) => (
                            <Link
                                key={index}
                                to={item.href}
                                onFocus={() => handleFocus(item.label)}
                                onMouseEnter={() => handleFocus(item.label)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                                    item.active
                                        ? 'bg-purple-600/20 text-purple-500'
                                        : darkMode 
                                            ? 'text-gray-400 hover:bg-gray-800 hover:text-white'
                                            : 'text-gray-700 hover:bg-purple-50 hover:text-purple-600'
                                }`}
                            >
                                {!hideIcons && <item.icon className="w-5 h-5" />}
                                <span className="font-medium">{item.label}</span>
                            </Link>
                        ))}
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-8 overflow-auto">
                    <div className="max-w-2xl mx-auto">
                        <h1 className={`text-3xl font-bold mb-8 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Settings</h1>

                        <div className="space-y-6">
                            {/* Theme Toggle */}
                            <div 
                                className={`p-6 rounded-2xl border ${darkMode ? 'bg-[#1A1F2E] border-gray-800' : 'bg-white border-gray-200'}`}
                                onFocus={() => handleFocus('Dark mode toggle')}
                                onMouseEnter={() => handleFocus('Dark mode toggle')}
                                tabIndex={0}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        {darkMode ? <Moon className="w-6 h-6 text-purple-500" /> : <Sun className="w-6 h-6 text-yellow-500" />}
                                        <div>
                                            <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Dark Mode</h3>
                                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Switch between light and dark themes</p>
                                        </div>
                                    </div>
                                    <Switch checked={darkMode} onCheckedChange={setDarkMode} />
                                </div>
                            </div>

                            {/* Black & White Mode */}
                            <div 
                                className={`p-6 rounded-2xl border ${darkMode ? 'bg-[#1A1F2E] border-gray-800' : 'bg-white border-gray-200'}`}
                                onFocus={() => handleFocus('Black and white mode for color accessibility')}
                                onMouseEnter={() => handleFocus('Black and white mode for color accessibility')}
                                tabIndex={0}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <Contrast className="w-6 h-6 text-purple-500" />
                                        <div>
                                            <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Black & White Mode</h3>
                                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>For users with color vision difficulties</p>
                                        </div>
                                    </div>
                                    <Switch checked={blackWhiteMode} onCheckedChange={setBlackWhiteMode} />
                                </div>
                            </div>

                            {/* Voice Prompts */}
                            <div 
                                className={`p-6 rounded-2xl border ${darkMode ? 'bg-[#1A1F2E] border-gray-800' : 'bg-white border-gray-200'}`}
                                onFocus={() => handleFocus('Voice prompts for screen reader assistance')}
                                onMouseEnter={() => handleFocus('Voice prompts setting')}
                                tabIndex={0}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        {voicePrompts ? <Volume2 className="w-6 h-6 text-purple-500" /> : <VolumeX className="w-6 h-6 text-gray-400" />}
                                        <div>
                                            <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Voice Prompts</h3>
                                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Speak button and tab names on hover/focus</p>
                                        </div>
                                    </div>
                                    <Switch checked={voicePrompts} onCheckedChange={setVoicePrompts} />
                                </div>
                            </div>

                            {/* Font Size */}
                            <div 
                                className={`p-6 rounded-2xl border ${darkMode ? 'bg-[#1A1F2E] border-gray-800' : 'bg-white border-gray-200'}`}
                                onFocus={() => handleFocus(`Font size slider, current size ${fontSize} pixels`)}
                                onMouseEnter={() => handleFocus('Font size adjustment')}
                                tabIndex={0}
                            >
                                <div className="flex items-center gap-4 mb-4">
                                    <Type className="w-6 h-6 text-purple-500" />
                                    <div>
                                        <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Font Size</h3>
                                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Adjust the base font size ({fontSize}px)</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>A</span>
                                    <Slider
                                        value={[fontSize]}
                                        min={12}
                                        max={24}
                                        step={1}
                                        onValueChange={([val]) => setFontSize(val)}
                                        className="flex-1"
                                    />
                                    <span className={`text-lg font-bold ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>A</span>
                                </div>
                            </div>

                            {/* Hide Icons */}
                            <div 
                                className={`p-6 rounded-2xl border ${darkMode ? 'bg-[#1A1F2E] border-gray-800' : 'bg-white border-gray-200'}`}
                                onFocus={() => handleFocus('Hide icons toggle')}
                                onMouseEnter={() => handleFocus('Hide icons in navigation')}
                                tabIndex={0}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        {hideIcons ? <EyeOff className="w-6 h-6 text-purple-500" /> : <Eye className="w-6 h-6 text-purple-500" />}
                                        <div>
                                            <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Hide Icons</h3>
                                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Hide icons in navigation menus</p>
                                        </div>
                                    </div>
                                    <Switch checked={hideIcons} onCheckedChange={setHideIcons} />
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            {/* Footer */}
            <footer className={`py-6 border-t ${darkMode ? 'bg-[#1A1F2E] border-gray-800' : 'bg-white border-gray-200'}`}>
                <div className="max-w-6xl mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <img src={LOGO_URL} alt="1cPublishing" className="h-8 w-8 object-contain grayscale" />
                        <nav className="flex flex-wrap justify-center gap-6 text-sm">
                            <a href="#" className={`transition-colors ${darkMode ? 'text-gray-500 hover:text-purple-400' : 'text-gray-600 hover:text-purple-600'}`}>Contact Us</a>
                            <a href="#" className={`transition-colors ${darkMode ? 'text-gray-500 hover:text-purple-400' : 'text-gray-600 hover:text-purple-600'}`}>Governance</a>
                            <a href="#" className={`transition-colors ${darkMode ? 'text-gray-500 hover:text-purple-400' : 'text-gray-600 hover:text-purple-600'}`}>Cookie Policy</a>
                            <a href="#" className={`transition-colors ${darkMode ? 'text-gray-500 hover:text-purple-400' : 'text-gray-600 hover:text-purple-600'}`}>Terms of Use</a>
                        </nav>
                    </div>
                    <div className={`mt-4 pt-4 border-t text-center text-sm ${darkMode ? 'border-gray-800 text-gray-600' : 'border-gray-200 text-gray-500'}`}>
                        © 2025 1cPublishing.com
                    </div>
                </div>
            </footer>
        </div>
    );
}