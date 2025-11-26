import React, { useState } from 'react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { ArrowUp } from 'lucide-react';

export default function RevenueCard({ 
    totalValue = '254856',
    changeValue = '125648',
    changePercent = '20%',
    chartData = [
        { value: 60 }, { value: 80 }, { value: 65 }, { value: 90 }, { value: 75 },
        { value: 85 }, { value: 50 }, { value: 40 }, { value: 55 }, { value: 70 },
        { value: 45 }, { value: 60 }, { value: 75 }, { value: 85 }, { value: 70 }
    ]
}) {
    const [activeTab, setActiveTab] = useState('1M');
    const tabs = ['All', '1M', '6M', '1Y', 'YTD'];

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <p className="text-2xl font-bold text-gray-800">{totalValue} USD</p>
                    <p className="text-sm text-gray-500">{changeValue} USD ({changePercent})</p>
                </div>
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
            
            <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                        <defs>
                            <linearGradient id="blueAreaGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#50C8E8" stopOpacity={0.2}/>
                                <stop offset="95%" stopColor="#50C8E8" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <Area 
                            type="monotone" 
                            dataKey="value" 
                            stroke="#50C8E8" 
                            strokeWidth={2}
                            fill="url(#blueAreaGradient)" 
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}