import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

// Mini sparkline component
const Sparkline = ({ data, color = '#6B4EE6', height = 60 }) => {
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    
    const points = data.map((value, i) => {
        const x = (i / (data.length - 1)) * 100;
        const y = 100 - ((value - min) / range) * 100;
        return `${x},${y}`;
    }).join(' ');

    return (
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full" style={{ height }}>
            <polyline
                points={points}
                fill="none"
                stroke={color}
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
};

export default function MetricCard({ 
    title, 
    subtitle, 
    value, 
    change, 
    changeType = 'positive',
    sparklineData,
    bgColor = '#6B4EE6',
    textColor = 'white'
}) {
    const isPositive = changeType === 'positive';
    
    return (
        <div 
            className="rounded-2xl p-6 h-full"
            style={{ backgroundColor: bgColor }}
        >
            <div className="flex justify-between items-start mb-2">
                <div>
                    <h3 className="text-lg font-semibold" style={{ color: textColor }}>{title}</h3>
                    <p className="text-sm opacity-80" style={{ color: textColor }}>{subtitle}</p>
                </div>
                {change && (
                    <div className={`flex items-center gap-1 text-sm font-medium ${isPositive ? 'text-green-300' : 'text-red-300'}`}>
                        {isPositive ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                        {change}
                    </div>
                )}
            </div>
            
            {sparklineData && (
                <div className="my-4">
                    <Sparkline data={sparklineData} color="rgba(255,255,255,0.8)" />
                </div>
            )}
            
            <div className="mt-4">
                <span className="text-3xl font-bold" style={{ color: textColor }}>{value}</span>
            </div>
        </div>
    );
}