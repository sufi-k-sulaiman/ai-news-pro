import React from 'react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { MoreHorizontal, ShoppingBag, TrendingUp, DollarSign, BarChart3 } from 'lucide-react';

const StatItem = ({ icon: Icon, iconBg, value, label }) => (
    <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: iconBg }}>
            <Icon className="w-5 h-5" style={{ color: '#6B4EE6' }} />
        </div>
        <div>
            <p className="text-xl font-bold text-gray-800">{value}</p>
            <p className="text-sm text-gray-500">{label}</p>
        </div>
    </div>
);

export default function SalesDetailsCard({ 
    authorSales = '$2,034',
    commission = '$706',
    averageBid = '$49',
    allTimeSales = '$5.8M'
}) {
    const chartData = [
        { value: 30 }, { value: 45 }, { value: 35 }, { value: 50 }, { value: 40 },
        { value: 60 }, { value: 55 }, { value: 70 }, { value: 65 }, { value: 80 }
    ];

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800">Sales Details</h3>
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <MoreHorizontal className="w-5 h-5 text-gray-400" />
                </button>
            </div>
            
            <div className="grid grid-cols-2 gap-6 mb-6">
                <StatItem icon={ShoppingBag} iconBg="#EDE9FE" value={authorSales} label="Author Sales" />
                <StatItem icon={BarChart3} iconBg="#FEE2E2" value={commission} label="Commission" />
                <StatItem icon={DollarSign} iconBg="#D1FAE5" value={averageBid} label="Average Bid" />
                <StatItem icon={TrendingUp} iconBg="#D1FAE5" value={allTimeSales} label="All Time Sales" />
            </div>
            
            <div className="h-32" style={{ backgroundColor: '#F5F3FF' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                        <defs>
                            <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#6B4EE6" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#6B4EE6" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <Area 
                            type="monotone" 
                            dataKey="value" 
                            stroke="#6B4EE6" 
                            strokeWidth={3}
                            fill="url(#purpleGradient)" 
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}