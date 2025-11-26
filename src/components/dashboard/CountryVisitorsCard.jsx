import React from 'react';

const ProgressBar = ({ label, percentage, color }) => (
    <div className="mb-4">
        <div className="flex justify-between mb-1">
            <span className="text-sm font-medium text-gray-700">{label}</span>
            <span className="text-sm text-gray-500">{percentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
                className="h-2 rounded-full transition-all duration-500"
                style={{ width: `${percentage}%`, backgroundColor: color }}
            />
        </div>
    </div>
);

export default function CountryVisitorsCard({ 
    title = "Visitors from Country",
    subtitle = "Visitors all over the world",
    countries = [
        { label: 'USA', percentage: 81, color: '#EC4899' },
        { label: 'Australia', percentage: 58, color: '#6B4EE6' },
        { label: 'Brazil', percentage: 42, color: '#50C8E8' },
        { label: 'Latvia', percentage: 55, color: '#F59E0B' }
    ]
}) {
    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-xl font-bold text-gray-800 mb-1">{title}</h3>
            <p className="text-sm text-gray-500 mb-6">{subtitle}</p>
            
            {/* Simple world map placeholder */}
            <div className="h-48 rounded-xl mb-6 flex items-center justify-center" style={{ backgroundColor: '#E0E7FF' }}>
                <div className="relative w-full h-full p-4">
                    <svg viewBox="0 0 200 100" className="w-full h-full opacity-40">
                        <ellipse cx="50" cy="40" rx="25" ry="20" fill="#6B4EE6" opacity="0.3" />
                        <ellipse cx="100" cy="35" rx="30" ry="25" fill="#6B4EE6" opacity="0.3" />
                        <ellipse cx="150" cy="45" rx="20" ry="15" fill="#6B4EE6" opacity="0.3" />
                        <ellipse cx="170" cy="70" rx="15" ry="12" fill="#6B4EE6" opacity="0.3" />
                    </svg>
                    {/* Dots for countries */}
                    <div className="absolute top-8 left-12 w-3 h-3 rounded-full" style={{ backgroundColor: '#EC4899' }} />
                    <div className="absolute top-12 left-8 w-3 h-3 rounded-full" style={{ backgroundColor: '#50C8E8' }} />
                    <div className="absolute top-6 right-20 w-3 h-3 rounded-full" style={{ backgroundColor: '#6B4EE6' }} />
                    <div className="absolute bottom-8 right-8 w-3 h-3 rounded-full" style={{ backgroundColor: '#F59E0B' }} />
                </div>
            </div>
            
            <div className="grid grid-cols-2 gap-x-6">
                {countries.map((country, index) => (
                    <ProgressBar key={index} {...country} />
                ))}
            </div>
        </div>
    );
}