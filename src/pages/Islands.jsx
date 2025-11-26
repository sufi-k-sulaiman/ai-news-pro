import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Menu, ChevronLeft, X, Users, Shield, Trophy } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { LOGO_URL, menuItems, footerLinks } from '../components/NavigationConfig';
import Island from '../components/islands/Island';
import IslandStats from '../components/islands/IslandStats';
import IslandLegend from '../components/islands/IslandLegend';
import { ISLANDS } from '../components/islands/IslandData';

export default function Islands() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [selectedElement, setSelectedElement] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [activeTrack, setActiveTrack] = useState('technical');
    const [stats, setStats] = useState({
        cameras: 200,
        access: 16,
        appliances: 24,
        devices: 5540,
        activeVertical: 0
    });

    const handleElementClick = (element) => {
        setSelectedElement(element);
        setShowModal(true);
    };

    const tracks = [
        { id: 'technical', label: 'Technical track', icon: Users },
        { id: 'admin', label: 'Admin track', icon: Shield },
    ];

    return (
        <div className="min-h-screen flex flex-col bg-slate-900">
            {/* Header */}
            <header className="bg-slate-800 sticky top-0 z-50 border-b border-slate-700 shadow-sm h-[72px]">
                <div className="flex items-center justify-between px-4 h-full">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)} className="hover:bg-slate-700 md:hidden">
                            <Menu className="w-5 h-5 text-purple-400" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)} className="hover:bg-slate-700 hidden md:flex">
                            {sidebarOpen ? <ChevronLeft className="w-5 h-5 text-purple-400" /> : <Menu className="w-5 h-5 text-purple-400" />}
                        </Button>
                        <Link to={createPageUrl('Home')} className="flex items-center gap-3 hover:opacity-80">
                            <img src={LOGO_URL} alt="1cPublishing" className="h-10 w-10 object-contain" />
                            <div className="hidden sm:block">
                                <span className="text-xl font-bold text-white">1cPublishing</span>
                                <p className="text-xs font-medium text-purple-400">Ai Islands</p>
                            </div>
                        </Link>
                    </div>

                    {/* Track selector */}
                    <div className="flex items-center gap-3">
                        {tracks.map(track => (
                            <button
                                key={track.id}
                                onClick={() => setActiveTrack(track.id)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                                    activeTrack === track.id
                                        ? 'bg-slate-700 text-white'
                                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                                }`}
                            >
                                <track.icon className="w-4 h-4" />
                                <span className="text-sm font-medium hidden md:inline">{track.label}</span>
                            </button>
                        ))}
                        <div className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg">
                            <Shield className="w-4 h-4" />
                            <span className="font-medium">Lieutenant</span>
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex flex-1">
                {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />}

                <aside className={`${sidebarOpen ? 'w-64 translate-x-0' : 'w-0 -translate-x-full md:translate-x-0'} transition-all duration-300 overflow-hidden bg-slate-800 border-r border-slate-700 flex-shrink-0 fixed md:relative z-50 md:z-auto h-[calc(100vh-72px)] md:h-auto`}>
                    <nav className="p-4 space-y-2">
                        {menuItems.map((item, index) => (
                            <Link key={index} to={item.href} onClick={() => window.innerWidth < 768 && setSidebarOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-slate-300 hover:bg-slate-700 hover:text-purple-400">
                                <item.icon className="w-5 h-5 text-purple-400" />
                                <span className="font-medium">{item.label}</span>
                            </Link>
                        ))}
                    </nav>
                </aside>

                <main className="flex-1 overflow-auto p-4 md:p-6">
                    <div className="flex gap-6">
                        {/* Islands Grid */}
                        <div className="flex-1">
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {ISLANDS.map(island => (
                                    <div key={island.id} className="bg-slate-800/50 rounded-2xl p-4 hover:bg-slate-800 transition-colors">
                                        <Island 
                                            {...island}
                                            onElementClick={handleElementClick}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Side Panel */}
                        <div className="hidden lg:block w-[320px] space-y-4">
                            <IslandStats stats={stats} />
                            <IslandLegend globalRank={137} />
                        </div>
                    </div>
                </main>
            </div>

            {/* Footer */}
            <footer className="py-6 bg-slate-800 border-t border-slate-700">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <img src={LOGO_URL} alt="1cPublishing" className="h-8 w-8 object-contain opacity-50" />
                        <nav className="flex flex-wrap justify-center gap-6 text-sm">
                            {footerLinks.map((link, i) => (
                                <a key={i} href={link.href} className="text-slate-400 hover:text-purple-400 transition-colors">{link.label}</a>
                            ))}
                        </nav>
                    </div>
                    <div className="mt-4 pt-4 border-t border-slate-700 text-center text-sm text-slate-500">
                        © 2025 1cPublishing.com
                    </div>
                </div>
            </footer>

            {/* Element Detail Modal */}
            <Dialog open={showModal} onOpenChange={setShowModal}>
                <DialogContent className="bg-slate-800 border-slate-700 text-white">
                    <DialogHeader>
                        <DialogTitle className="text-xl">{selectedElement?.label}</DialogTitle>
                    </DialogHeader>
                    {selectedElement && (
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className={`px-3 py-1 rounded-full text-sm ${
                                    selectedElement.status === 'completed' 
                                        ? 'bg-emerald-500/20 text-emerald-400' 
                                        : 'bg-cyan-500/20 text-cyan-400'
                                }`}>
                                    {selectedElement.status === 'completed' ? 'Completed' : 'Pending'}
                                </div>
                                <span className="text-slate-400">on {selectedElement.islandName}</span>
                            </div>
                            <div className="bg-slate-700/50 rounded-lg p-4">
                                <p className="text-slate-300">
                                    This {selectedElement.type} is located at coordinates ({selectedElement.x}%, {selectedElement.y}%) on the island.
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <Button className="flex-1 bg-purple-600 hover:bg-purple-700">
                                    View Details
                                </Button>
                                {selectedElement.status === 'pending' && (
                                    <Button variant="outline" className="flex-1 border-slate-600 text-white hover:bg-slate-700">
                                        Mark Complete
                                    </Button>
                                )}
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}