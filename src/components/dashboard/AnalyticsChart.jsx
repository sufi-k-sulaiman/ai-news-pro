import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, TrendingUp } from 'lucide-react';

export default function AnalyticsChart({ 
    title = "Real-time Analytics",
    sessions = '47,829',
    pageViews = '186,247',
    data = [
        { name: 'Jan', sessions: 87, views: 31 },
        { name: 'Feb', sessions: 76, views: 40 },
        { name: 'Mar', sessions: 65, views: 28 },
        { name: 'Apr', sessions: 89, views: 51 },
        { name: 'May', sessions: 95, views: 42 },
        { name: 'Jun', sessions: 85, views: 76 },
        { name: 'Jul', sessions: 89, views: 77 },
        { name: 'Aug', sessions: 95, views: 67 },
        { name: 'Sep', sessions: 87, views: 78 },
        { name: 'Oct', sessions: 95, views: 73 },
        { name: 'Nov', sessions: 87, views: 69 },
        { name: 'Dec', sessions: 92, views: 85 }
    ]
}) {
    const [activeTab, setActiveTab] = useState('30D');
    const tabs = ['7D', '30D', '90D'];

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-start mb-6">
                <h3 className="text-lg font-bold text-gray-800">{title}</h3>
                <div className="flex bg-gray-100 rounded-lg p-1">
                    {tabs.map((tab) => (
                        <button 
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                                activeTab === tab ? 'text-white' : 'text-gray-600'
                            }`}
                            style={{ backgroundColor: activeTab === tab ? '#6B4EE6' : 'transparent' }}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>
            
            <div className="flex gap-8 mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#E0E7FF' }}>
                        <Users className="w-5 h-5" style={{ color: '#6B4EE6' }} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Sessions</p>
                        <p className="text-xl font-bold text-gray-800">{sessions}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#D1FAE5' }}>
                        <TrendingUp className="w-5 h-5" style={{ color: '#50C8E8' }} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Page Views</p>
                        <p className="text-xl font-bold text-gray-800">{pageViews}</p>
                    </div>
                </div>
            </div>
            
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="sessionsGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#6B4EE6" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#6B4EE6" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="viewsGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#50C8E8" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#50C8E8" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                        <Tooltip 
                            contentStyle={{ 
                                backgroundColor: 'white', 
                                border: '1px solid #E5E7EB', 
                                borderRadius: '8px' 
                            }}
                        />
                        <Area 
                            type="monotone" 
                            dataKey="sessions" 
                            stroke="#6B4EE6" 
                            strokeWidth={2}
                            fill="url(#sessionsGradient)" 
                        />
                        <Area 
                            type="monotone" 
                            dataKey="views" 
                            stroke="#50C8E8" 
                            strokeWidth={2}
                            fill="url(#viewsGradient)" 
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
            
            <div className="flex justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#6B4EE6' }} />
                    <span className="text-sm text-gray-500">Sessions</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#50C8E8' }} />
                    <span className="text-sm text-gray-500">Page Views</span>
                </div>
            </div>
        </div>
    );
}