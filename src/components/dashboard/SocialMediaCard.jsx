import React from 'react';

const FollowerCard = ({ label, value, bgColor, textColor }) => (
    <div 
        className="rounded-2xl p-6 flex flex-col justify-end h-32"
        style={{ backgroundColor: bgColor }}
    >
        <p className="text-sm font-medium" style={{ color: textColor }}>{label}</p>
        <p className="text-3xl font-bold" style={{ color: textColor }}>{value}</p>
    </div>
);

export default function SocialMediaCard({ 
    title = "Social Media",
    subtitle = "About Your Social Popularity",
    stats = [
        { label: 'Facebook', value: '35.6K', bgColor: '#FEF3C7', textColor: '#F59E0B' },
        { label: 'Twitter', value: '35.6K', bgColor: '#D1FAE5', textColor: '#10B981' },
        { label: 'Instagram', value: '35.6K', bgColor: '#FEE2E2', textColor: '#EF4444' },
        { label: 'LinkedIn', value: '35.6K', bgColor: '#DBEAFE', textColor: '#3B82F6' }
    ]
}) {
    return (
        <div className="rounded-2xl p-6" style={{ backgroundColor: '#F5F3FF' }}>
            <h3 className="text-xl font-bold text-gray-800 mb-1">{title}</h3>
            <p className="text-sm text-gray-500 mb-6">{subtitle}</p>
            
            <div className="grid grid-cols-2 gap-4">
                {stats.map((stat, index) => (
                    <FollowerCard key={index} {...stat} />
                ))}
            </div>
        </div>
    );
}