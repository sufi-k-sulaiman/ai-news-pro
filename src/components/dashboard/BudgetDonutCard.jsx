import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

export default function BudgetDonutCard({ 
    title = "% of Income Budget",
    percentage = 67,
    label = "Budget",
    balance1 = '-$18,570',
    balance2 = '$31,430',
    color1 = '#6B4EE6',
    color2 = '#50C8E8'
}) {
    const data = [
        { value: percentage },
        { value: 100 - percentage }
    ];

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-800 mb-4">{title}</h3>
            
            <div className="relative h-48">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            startAngle={90}
                            endAngle={-270}
                            dataKey="value"
                        >
                            <Cell fill={color1} />
                            <Cell fill={color2} />
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold text-gray-800">{percentage}%</span>
                    <span className="text-sm text-gray-500">{label}</span>
                </div>
            </div>
            
            <div className="flex justify-between mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color2 }} />
                    <span className="text-sm text-gray-500">Balance</span>
                    <span className="text-sm font-medium text-gray-700">{balance1}</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color1 }} />
                    <span className="text-sm text-gray-500">Balance</span>
                    <span className="text-sm font-medium text-gray-700">{balance2}</span>
                </div>
            </div>
            
            <button className="w-full mt-4 text-center text-sm font-medium" style={{ color: '#6B4EE6' }}>
                View Full Report
            </button>
        </div>
    );
}