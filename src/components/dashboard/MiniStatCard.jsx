import React from 'react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

export default function MiniStatCard({ 
    value = '$874',
    label = 'sales last month',
    accentColor = '#6B4EE6',
    chartData = [
        { v: 30 }, { v: 45 }, { v: 35 }, { v: 50 }, { v: 40 }, { v: 60 }, 
        { v: 45 }, { v: 55 }, { v: 50 }, { v: 45 }, { v: 55 }, { v: 50 }
    ]
}) {
    return (
        <div 
            className="bg-white rounded-xl p-5 shadow-sm border-b-4"
            style={{ borderBottomColor: accentColor }}
        >
            <p className="text-2xl font-bold text-gray-800">{value}</p>
            <p className="text-sm text-gray-500 mb-4">{label}</p>
            
            <div className="h-16">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                        <Line 
                            type="monotone" 
                            dataKey="v" 
                            stroke={accentColor} 
                            strokeWidth={2}
                            dot={false}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}