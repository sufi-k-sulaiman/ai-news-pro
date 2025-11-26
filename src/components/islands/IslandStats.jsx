import React from 'react';
import { Building2, Building, Landmark, Factory, Warehouse, Video, DoorOpen, Server, Cpu } from 'lucide-react';

const VerticalIcon = ({ icon: Icon, active }) => (
    <div className={`p-2 ${active ? 'text-white' : 'text-blue-300'}`}>
        <Icon className="w-8 h-8" />
    </div>
);

const StatBar = ({ label, value, icon: Icon, maxValue = 6000 }) => {
    const percentage = Math.min((value / maxValue) * 100, 100);
    
    return (
        <div className="mb-6">
            <div className="text-white font-medium mb-2">{label}</div>
            <div className="relative h-10 bg-blue-950 rounded-full overflow-hidden">
                <div 
                    className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-800 to-blue-700 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                />
                <div 
                    className="absolute top-1/2 -translate-y-1/2 bg-white rounded-full px-3 py-1 flex items-center gap-2 shadow-lg transition-all duration-500"
                    style={{ left: `${Math.max(percentage - 5, 5)}%` }}
                >
                    <Icon className="w-4 h-4 text-blue-600" />
                    <span className="text-blue-900 font-bold">{value.toLocaleString()}</span>
                </div>
            </div>
        </div>
    );
};

export default function IslandStats({ stats = {} }) {
    const {
        cameras = 200,
        access = 16,
        appliances = 24,
        devices = 5540,
        activeVertical = 0
    } = stats;

    const verticals = [
        { icon: Building2, label: 'Corporate' },
        { icon: Building, label: 'Commercial' },
        { icon: Landmark, label: 'Government' },
        { icon: Factory, label: 'Industrial' },
        { icon: Warehouse, label: 'Warehouse' },
    ];

    return (
        <div className="bg-blue-800 rounded-2xl p-6 min-w-[300px]">
            {/* Vertical selector */}
            <div className="mb-6">
                <div className="text-blue-200 text-sm mb-3">Vertical</div>
                <div className="flex gap-2">
                    {verticals.map((v, i) => (
                        <VerticalIcon key={i} icon={v.icon} active={i === activeVertical} />
                    ))}
                </div>
            </div>

            {/* Stats bars */}
            <StatBar label="Cameras" value={cameras} icon={Video} maxValue={500} />
            <StatBar label="Access" value={access} icon={DoorOpen} maxValue={50} />
            <StatBar label="Managed appliances" value={appliances} icon={Server} maxValue={100} />
            <StatBar label="Devices" value={devices} icon={Cpu} maxValue={10000} />
        </div>
    );
}