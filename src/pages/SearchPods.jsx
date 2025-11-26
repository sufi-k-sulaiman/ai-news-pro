import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { 
    Play, Pause, SkipBack, SkipForward, Volume2, VolumeX,
    Sparkles, Home, Radio, Menu, ChevronLeft, Loader2,
    ChevronRight, Plus, Cpu, BookOpen, Film, Trophy, Building2, Plane,
    BarChart3, Settings
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import SmartSearchBar from '../components/SmartSearchBar';

const LOGO_URL = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/692729a5f5180fbd43f297e9/868a98750_1cPublishing-logo.png";

const VOICE_OPTIONS = [
    { id: 'default', name: 'Default', description: 'System voice' },
    { id: 'female', name: 'Female', description: 'Higher pitch' },
    { id: 'male', name: 'Male', description: 'Lower pitch' },
];

const CATEGORY_ICONS = {
    'Technology': Cpu,
    'Education': BookOpen,
    'Entertainment': Film,
    'Sports': Trophy,
    'Politics': Building2,
    'Travel': Plane,
};

const CATEGORIES = [
    { name: 'Technology', icon: Cpu, color: '#6B4EE6' },
    { name: 'Education', icon: BookOpen, color: '#3B82F6' },
    { name: 'Entertainment', icon: Film, color: '#EC4899' },
    { name: 'Sports', icon: Trophy, color: '#10B981' },
    { name: 'Politics', icon: Building2, color: '#F59E0B' },
    { name: 'Travel', icon: Plane, color: '#06B6D4' },
];

const menuItems = [
    { icon: Home, label: "Home", href: createPageUrl('Home') },
    { icon: Sparkles, label: "AI Hub", href: createPageUrl('AIHub') },
    { icon: Radio, label: "SearchPods", href: createPageUrl('SearchPods'), active: true },
    { icon: BarChart3, label: "Dashboard", href: createPageUrl('DashboardComponents') },
    { icon: Settings, label: "Settings", href: createPageUrl('Settings') },
];

export default function SearchPods() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showPlayer, setShowPlayer] = useState(false);
    const [currentEpisode, setCurrentEpisode] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(300);
    const [volume, setVolume] = useState(80);
    const [isMuted, setIsMuted] = useState(false);
    const [selectedVoice, setSelectedVoice] = useState('default');
    const [playbackSpeed, setPlaybackSpeed] = useState(1);
    const [generatingCategory, setGeneratingCategory] = useState(null);
    const [currentCaption, setCurrentCaption] = useState('');
    const [captions, setCaptions] = useState([]);
    const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
    const [hideIcons] = useState(() => localStorage.getItem('hideIcons') === 'true');
    const [blackWhiteMode] = useState(() => localStorage.getItem('blackWhiteMode') === 'true');
    
    // Equalizer state
    const [bass, setBass] = useState(50);
    const [mid, setMid] = useState(50);
    const [treble, setTreble] = useState(50);
    
    const speechRef = useRef(null);
    const captionIndexRef = useRef(0);

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        setIsLoading(true);
        try {
            const results = await Promise.all(
                CATEGORIES.map(async (cat) => {
                    const response = await base44.integrations.Core.InvokeLLM({
                        prompt: `Generate 4 podcast episode topics for "${cat.name}". Include subtopic filters.`,
                        add_context_from_internet: true,
                        response_json_schema: {
                            type: "object",
                            properties: {
                                episodes: {
                                    type: "array",
                                    items: {
                                        type: "object",
                                        properties: {
                                            title: { type: "string" },
                                            duration: { type: "string" },
                                            plays: { type: "number" }
                                        }
                                    }
                                },
                                subtopics: { type: "array", items: { type: "string" } }
                            }
                        }
                    });

                    const episodesWithThumbs = await Promise.all(
                        (response?.episodes || []).slice(0, 4).map(async (ep) => {
                            try {
                                const img = await base44.integrations.Core.GenerateImage({
                                    prompt: `Podcast thumbnail for "${ep.title}" - ${cat.name} theme, professional light style`
                                });
                                return { ...ep, thumbnail: img?.url, category: cat.name };
                            } catch {
                                return { ...ep, thumbnail: null, category: cat.name };
                            }
                        })
                    );

                    return {
                        ...cat,
                        episodes: episodesWithThumbs,
                        subtopics: response?.subtopics || [],
                        episodeCount: episodesWithThumbs.length
                    };
                })
            );
            setCategories(results);
        } catch (error) {
            console.error('Error loading categories:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const generateMoreEpisodes = async (categoryName) => {
        setGeneratingCategory(categoryName);
        try {
            const response = await base44.integrations.Core.InvokeLLM({
                prompt: `Generate 3 new podcast episode topics for "${categoryName}".`,
                add_context_from_internet: true,
                response_json_schema: {
                    type: "object",
                    properties: {
                        episodes: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    title: { type: "string" },
                                    duration: { type: "string" },
                                    plays: { type: "number" }
                                }
                            }
                        }
                    }
                }
            });

            const newEpisodes = await Promise.all(
                (response?.episodes || []).map(async (ep) => {
                    try {
                        const img = await base44.integrations.Core.GenerateImage({
                            prompt: `Podcast thumbnail for "${ep.title}" - ${categoryName} theme, professional light style`
                        });
                        return { ...ep, thumbnail: img?.url, category: categoryName };
                    } catch {
                        return { ...ep, thumbnail: null, category: categoryName };
                    }
                })
            );

            setCategories(prev => prev.map(cat => 
                cat.name === categoryName 
                    ? { ...cat, episodes: [...cat.episodes, ...newEpisodes], episodeCount: cat.episodeCount + newEpisodes.length }
                    : cat
            ));
        } catch (error) {
            console.error('Error generating episodes:', error);
        } finally {
            setGeneratingCategory(null);
        }
    };

    const playEpisode = async (episode) => {
        setCurrentEpisode(episode);
        setShowPlayer(true);
        setCurrentTime(0);
        setIsPlaying(false);
        setIsGeneratingAudio(true);
        setCurrentCaption('Generating podcast content...');

        try {
            // Generate podcast script
            const scriptResponse = await base44.integrations.Core.InvokeLLM({
                prompt: `Create a detailed 5-minute podcast script about "${episode.title}". 
                Write it as natural spoken content with engaging facts, insights, and a conversational tone.
                Split into sentences for captions.`,
                add_context_from_internet: true,
                response_json_schema: {
                    type: "object",
                    properties: {
                        script: { type: "string" },
                        sentences: {
                            type: "array",
                            items: { type: "string" }
                        }
                    }
                }
            });

            const sentences = scriptResponse?.sentences || scriptResponse?.script?.split(/[.!?]+/).filter(s => s.trim()) || [];
            setCaptions(sentences);
            setDuration(sentences.length * 4); // ~4 seconds per sentence
            setIsGeneratingAudio(false);
            
            // Start playing with TTS
            startAudioPlayback(sentences);

        } catch (error) {
            console.error('Error generating script:', error);
            setIsGeneratingAudio(false);
            const fallback = [`Welcome to this episode about ${episode.title}`, 'Let us explore this fascinating topic together.'];
            setCaptions(fallback);
            startAudioPlayback(fallback);
        }
    };

    const startAudioPlayback = (sentences) => {
        if (!('speechSynthesis' in window)) {
            alert('Text-to-speech not supported in this browser');
            return;
        }

        window.speechSynthesis.cancel();
        captionIndexRef.current = 0;
        setIsPlaying(true);
        speakNextSentence(sentences);
    };

    const speakNextSentence = (sentences) => {
        if (captionIndexRef.current >= sentences.length) {
            setIsPlaying(false);
            return;
        }

        const sentence = sentences[captionIndexRef.current];
        setCurrentCaption(sentence);
        setCurrentTime(captionIndexRef.current * 4);

        const utterance = new SpeechSynthesisUtterance(sentence);
        utterance.rate = playbackSpeed;
        utterance.volume = isMuted ? 0 : volume / 100;
        
        // Voice selection
        const voices = window.speechSynthesis.getVoices();
        if (selectedVoice === 'female') {
            const femaleVoice = voices.find(v => v.name.includes('Female') || v.name.includes('Samantha') || v.name.includes('Victoria'));
            if (femaleVoice) utterance.voice = femaleVoice;
        } else if (selectedVoice === 'male') {
            const maleVoice = voices.find(v => v.name.includes('Male') || v.name.includes('Daniel') || v.name.includes('Alex'));
            if (maleVoice) utterance.voice = maleVoice;
        }

        utterance.onend = () => {
            captionIndexRef.current++;
            if (isPlaying) {
                speakNextSentence(sentences);
            }
        };

        speechRef.current = utterance;
        window.speechSynthesis.speak(utterance);
    };

    const togglePlayPause = () => {
        if (isPlaying) {
            window.speechSynthesis.pause();
            setIsPlaying(false);
        } else {
            if (window.speechSynthesis.paused) {
                window.speechSynthesis.resume();
            } else {
                speakNextSentence(captions);
            }
            setIsPlaying(true);
        }
    };

    const handleSearch = async (query) => {
        const episode = {
            title: query,
            category: 'Search',
            duration: '5:00',
            plays: 0
        };
        
        try {
            const img = await base44.integrations.Core.GenerateImage({
                prompt: `Podcast thumbnail for "${query}" - professional style`
            });
            episode.thumbnail = img?.url;
        } catch {}
        
        playEpisode(episode);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const closePlayer = () => {
        window.speechSynthesis.cancel();
        setShowPlayer(false);
        setIsPlaying(false);
    };

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
                        <div className="flex items-center gap-3">
                            <img src={LOGO_URL} alt="1cPublishing" className="h-10 w-10 object-contain" />
                            <div>
                                <span className="text-xl font-bold text-black">1cPublishing</span>
                                <p className="text-xs font-medium text-purple-600">AI Powered</p>
                            </div>
                        </div>
                    </div>

                    <SmartSearchBar 
                        onSearch={handleSearch}
                        placeholder="Search for any topic..."
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
                                    item.active
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
                <main className="flex-1 p-6 overflow-auto">
                    {isLoading ? (
                        <div className="flex items-center justify-center h-64">
                            <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {categories.map((category) => {
                                const IconComponent = CATEGORY_ICONS[category.name] || Radio;
                                return (
                                    <div key={category.name} className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
                                        {/* Category Header */}
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${category.color}15` }}>
                                                    <IconComponent className="w-5 h-5" style={{ color: category.color }} />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-gray-800">{category.name}</h3>
                                                    <p className="text-xs text-gray-500">{category.episodeCount} episodes</p>
                                                </div>
                                            </div>
                                            <button className="flex items-center gap-1 text-sm text-purple-600 hover:text-purple-700">
                                                More <ChevronRight className="w-4 h-4" />
                                            </button>
                                        </div>

                                        {/* Subtopic Filters */}
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-600 text-white">All</span>
                                            {category.subtopics?.slice(0, 2).map((sub, i) => (
                                                <span key={i} className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 cursor-pointer">
                                                    {sub}
                                                </span>
                                            ))}
                                            <button className="px-3 py-1 rounded-full text-xs font-medium border border-dashed border-gray-300 text-gray-400 hover:border-purple-500 hover:text-purple-600 flex items-center gap-1">
                                                <Plus className="w-3 h-3" /> More
                                            </button>
                                        </div>

                                        {/* Episodes List */}
                                        <div className="space-y-3">
                                            {category.episodes?.map((episode, i) => (
                                                <div 
                                                    key={i} 
                                                    onClick={() => playEpisode(episode)}
                                                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer group"
                                                >
                                                    <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0 relative">
                                                        {episode.thumbnail ? (
                                                            <img src={episode.thumbnail} alt={episode.title} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center">
                                                                <Radio className="w-5 h-5 text-gray-400" />
                                                            </div>
                                                        )}
                                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                            <Play className="w-5 h-5 text-white" fill="white" />
                                                        </div>
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="text-sm font-medium text-gray-800 truncate">{episode.title}</h4>
                                                        <p className="text-xs text-gray-500">{episode.duration || '5:00'} • {episode.plays || 0} plays</p>
                                                    </div>
                                                    <Play className="w-5 h-5 text-gray-400 group-hover:text-purple-600 flex-shrink-0" />
                                                </div>
                                            ))}
                                        </div>

                                        {/* Generate More */}
                                        <button 
                                            onClick={() => generateMoreEpisodes(category.name)}
                                            disabled={generatingCategory === category.name}
                                            className="w-full mt-4 py-3 rounded-xl border border-dashed border-gray-300 text-gray-500 hover:border-purple-500 hover:text-purple-600 flex flex-col items-center gap-1 transition-colors"
                                        >
                                            {generatingCategory === category.name ? (
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                            ) : (
                                                <Sparkles className="w-5 h-5" />
                                            )}
                                            <span className="text-sm font-medium">Generate More</span>
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </main>
            </div>

            {/* Player Modal */}
            <Dialog open={showPlayer} onOpenChange={closePlayer}>
                <DialogContent className="max-w-2xl p-0 bg-white border-gray-200 overflow-hidden max-h-[90vh] overflow-y-auto">
                    <div className="p-6">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-6">
                            <button onClick={closePlayer} className="text-gray-400 hover:text-gray-600">
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                            <span className="text-sm text-gray-500 uppercase tracking-wider">Now Playing</span>
                            <div className="w-6" />
                        </div>

                        {/* Album Art */}
                        <div className="flex justify-center mb-6">
                            <div className="w-48 h-48 rounded-2xl bg-gray-100 overflow-hidden relative shadow-lg">
                                {currentEpisode?.thumbnail ? (
                                    <img src={currentEpisode.thumbnail} alt={currentEpisode?.title} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-500 to-blue-500">
                                        <Radio className="w-16 h-16 text-white" />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Title */}
                        <div className="text-center mb-4">
                            <h2 className="text-xl font-semibold text-gray-800 mb-1">{currentEpisode?.title}</h2>
                            <p className="text-sm text-purple-600">{currentEpisode?.category}</p>
                        </div>

                        {/* Loading State */}
                        {isGeneratingAudio && (
                            <div className="flex items-center justify-center gap-3 py-4">
                                <Loader2 className="w-5 h-5 animate-spin text-purple-600" />
                                <span className="text-gray-600">Generating audio content...</span>
                            </div>
                        )}

                        {/* Equalizer Controls */}
                        <div className="bg-gray-50 rounded-xl p-4 mb-4">
                            <h4 className="text-sm font-medium text-gray-700 mb-3">Equalizer</h4>
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="text-xs text-gray-500 block mb-1">Bass</label>
                                    <Slider value={[bass]} max={100} onValueChange={([v]) => setBass(v)} />
                                    <span className="text-xs text-gray-400">{bass}%</span>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 block mb-1">Mid</label>
                                    <Slider value={[mid]} max={100} onValueChange={([v]) => setMid(v)} />
                                    <span className="text-xs text-gray-400">{mid}%</span>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 block mb-1">Treble</label>
                                    <Slider value={[treble]} max={100} onValueChange={([v]) => setTreble(v)} />
                                    <span className="text-xs text-gray-400">{treble}%</span>
                                </div>
                            </div>
                        </div>

                        {/* Live Caption */}
                        <div className="bg-purple-50 rounded-xl p-4 mb-6 min-h-[80px] flex items-center justify-center border border-purple-100">
                            <p className="text-center text-gray-700 leading-relaxed">{currentCaption}</p>
                        </div>

                        {/* Voice & Volume */}
                        <div className="flex items-center gap-4 mb-6">
                            <Select value={selectedVoice} onValueChange={setSelectedVoice}>
                                <SelectTrigger className="w-32 bg-gray-50 border-gray-200">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {VOICE_OPTIONS.map(voice => (
                                        <SelectItem key={voice.id} value={voice.id}>
                                            {voice.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            
                            <div className="flex items-center gap-2 flex-1">
                                <button onClick={() => setIsMuted(!isMuted)}>
                                    {isMuted ? <VolumeX className="w-5 h-5 text-gray-400" /> : <Volume2 className="w-5 h-5 text-gray-600" />}
                                </button>
                                <Slider
                                    value={[isMuted ? 0 : volume]}
                                    max={100}
                                    onValueChange={([v]) => { setVolume(v); setIsMuted(false); }}
                                    className="flex-1"
                                />
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mb-6">
                            <Slider
                                value={[currentTime]}
                                max={duration || 100}
                                step={1}
                                className="w-full"
                            />
                            <div className="flex justify-between text-xs text-gray-500 mt-2">
                                <span>{formatTime(currentTime)}</span>
                                <span>{formatTime(duration)}</span>
                            </div>
                        </div>

                        {/* Controls */}
                        <div className="flex items-center justify-center gap-6 mb-6">
                            <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-700">
                                <SkipBack className="w-6 h-6" />
                            </Button>
                            <Button
                                size="icon"
                                className="w-16 h-16 rounded-full bg-purple-600 text-white hover:bg-purple-700"
                                onClick={togglePlayPause}
                                disabled={isGeneratingAudio}
                            >
                                {isPlaying ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7 ml-1" />}
                            </Button>
                            <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-700">
                                <SkipForward className="w-6 h-6" />
                            </Button>
                        </div>

                        {/* Speed Controls */}
                        <div className="flex justify-center gap-2">
                            {[0.5, 0.75, 1, 1.25, 1.5, 2].map((speed) => (
                                <button
                                    key={speed}
                                    onClick={() => setPlaybackSpeed(speed)}
                                    className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                                        playbackSpeed === speed 
                                            ? 'bg-purple-600 text-white' 
                                            : 'text-gray-500 hover:bg-gray-100'
                                    }`}
                                >
                                    {speed}x
                                </button>
                            ))}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Footer */}
            <footer className="py-6 bg-white border-t border-gray-200">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <img src={LOGO_URL} alt="1cPublishing" className="h-8 w-8 object-contain grayscale" />
                        <nav className="flex flex-wrap justify-center gap-6 text-sm">
                            <a href="#" className="text-gray-600 hover:text-purple-600 transition-colors">Contact Us</a>
                            <a href="#" className="text-gray-600 hover:text-purple-600 transition-colors">Governance</a>
                            <a href="#" className="text-gray-600 hover:text-purple-600 transition-colors">Cookie Policy</a>
                            <a href="#" className="text-gray-600 hover:text-purple-600 transition-colors">Terms of Use</a>
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