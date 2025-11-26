import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { MoreHorizontal, ArrowUp } from 'lucide-react';

export default function SalesPieCard({ 
    title = "Total Sales Unit",
    data = [
        { name: 'Desktop', value: 25.81, color: '#0D1321' },
        { name: 'Mobile', value: 35, color: '#EC4899' },
        { name: 'Tablet', value: 25, color: '#50C8E8' },
        { name: 'Other', value: 14.19, color: '#64748B' }
    ],
    revenue1 = { label: 'This Month Revenue', value: '$57k', change: '14.5%' },
    revenue2 = { label: 'This Month Revenue', value: '$14k', change: '14.5%' }
}) {
    return (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-gray-800">{title}</h3>
                    <button className="p-2 hover:bg-gray-100 rounded-lg">
                        <MoreHorizontal className="w-5 h-5" style={{ color: '#6B4EE6' }} />
                    </button>
                </div>
                
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={40}
                                outerRadius={100}
                                paddingAngle={2}
                                dataKey="value"
                            >
                                {data.map((entry, index) => (
                                    <Cell key={index} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip 
                                formatter={(value, name) => [`${value}%`, name]}
                                contentStyle={{ 
                                    backgroundColor: '#374151', 
                                    border: 'none', 
                                    borderRadius: '8px',
                                    color: 'white'
                                }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
            
            <div className="grid grid-cols-2" style={{ backgroundColor: '#0D1321' }}>
                <div className="p-4 border-r border-gray-700">
                    <p className="text-xs text-gray-400">{revenue1.label}</p>
                    <p className="text-2xl font-bold text-white">{revenue1.value}</p>
                    <div className="flex items-center gap-1 text-green-400 text-sm">
                        <ArrowUp className="w-3 h-3" />
                        {revenue1.change} Up From Last Month
                    </div>
                </div>
                <div className="p-4">
                    <p className="text-xs text-gray-400">{revenue2.label}</p>
                    <p className="text-2xl font-bold text-gray-400">{revenue2.value}</p>
                    <div className="flex items-center gap-1 text-gray-500 text-sm">
                        <ArrowUp className="w-3 h-3" />
                        {revenue2.change} Up From Last Month
                    </div>
                </div>
            </div>
        </div>
    );
}