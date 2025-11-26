import React from 'react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { ArrowUp, ArrowDown } from 'lucide-react';

export default function ColoredMetricCard({ 
    title = 'Sales Per Day',
    change = '3%',
    changeType = 'positive',
    metric1 = { value: '$4230', label: 'Total Revenue' },
    metric2 = { value: '321', label: 'Today Sales' },
    bgColor = '#6B4EE6',
    chartData = [
        { v: 50 }, { v: 70 }, { v: 45 }, { v: 80 }, { v: 60 }, { v: 75 }, 
        { v: 55 }, { v: 65 }, { v: 70 }, { v: 50 }, { v: 60 }, { v: 55 }
    ]
}) {
    const isPositive = changeType === 'positive';

    return (
        <div className="rounded-2xl overflow-hidden shadow-sm">
            <div className="p-4 text-white" style={{ backgroundColor: bgColor }}>
                <div className="flex justify-between items-start mb-4">
                    <span className="text-sm opacity-90">{title}</span>
                    <div className={`flex items-center gap-1 text-xs ${isPositive ? 'text-green-300' : 'text-red-300'}`}>
                        {isPositive ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                        {change}
                    </div>
                </div>
                
                <div className="h-20">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                            <Line 
                                type="monotone" 
                                dataKey="v" 
                                stroke="rgba(255,255,255,0.8)" 
                                strokeWidth={2}
                                dot={{ fill: 'white', strokeWidth: 0, r: 3 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
            
            <div className="bg-white p-4 flex justify-between">
                <div>
                    <p className="text-xl font-bold text-gray-800">{metric1.value}</p>
                    <p className="text-xs text-gray-500">{metric1.label}</p>
                </div>
                <div className="text-right">
                    <p className="text-xl font-bold text-gray-800">{metric2.value}</p>
                    <p className="text-xs text-gray-500">{metric2.label}</p>
                </div>
            </div>
        </div>
    );
}