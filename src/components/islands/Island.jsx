import React, { useState } from 'react';
import { Home, CheckCircle, MapPin, TreePine, Droplets } from 'lucide-react';

// Interactive element component
const InteractiveMarker = ({ type, x, y, status, onClick, label }) => {
    const [hovered, setHovered] = useState(false);
    
    const getIcon = () => {
        switch(type) {
            case 'house':
                return (
                    <div className={`w-8 h-6 ${status === 'completed' ? 'bg-blue-900' : 'bg-white'} rounded-t-sm relative`}>
                        <div className={`absolute -top-2 left-0 right-0 h-3 ${status === 'completed' ? 'bg-blue-800' : 'bg-blue-200'}`} 
                            style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }} />
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-3 bg-amber-600" />
                    </div>
                );
            case 'pond':
                return <Droplets className="w-5 h-5 text-cyan-400" />;
            case 'tree':
                return <TreePine className="w-5 h-5 text-green-700" />;
            default:
                return <MapPin className="w-5 h-5" />;
        }
    };

    const getStatusBadge = () => {
        if (status === 'completed') {
            return (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-900 rounded-full flex items-center justify-center border-2 border-white">
                    <CheckCircle className="w-4 h-4 text-white" />
                </div>
            );
        } else if (status === 'pending') {
            return (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-cyan-400 rounded-full flex items-center justify-center border-2 border-white">
                    <MapPin className="w-3 h-3 text-white" />
                </div>
            );
        }
        return null;
    };

    return (
        <div 
            className={`absolute cursor-pointer transition-transform ${hovered ? 'scale-125 z-20' : 'z-10'}`}
            style={{ left: `${x}%`, top: `${y}%` }}
            onClick={() => onClick({ type, label, status, x, y })}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <div className="relative">
                {getIcon()}
                {getStatusBadge()}
            </div>
            {hovered && (
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                    {label}
                </div>
            )}
        </div>
    );
};

// Tree cluster component
const TreeCluster = ({ x, y, variant = 1 }) => {
    const colors = variant % 2 === 0 ? ['#166534', '#15803d'] : ['#22c55e', '#4ade80'];
    return (
        <div className="absolute" style={{ left: `${x}%`, top: `${y}%` }}>
            <svg width="30" height="30" viewBox="0 0 30 30">
                <path d="M15 5 L5 25 L25 25 Z" fill={colors[0]} />
                <path d="M10 10 L2 25 L18 25 Z" fill={colors[1]} opacity="0.8" />
            </svg>
        </div>
    );
};

// Water/Pond component
const Pond = ({ path, onClick }) => (
    <path 
        d={path} 
        fill="#67e8f9" 
        className="cursor-pointer hover:fill-cyan-300 transition-colors"
        onClick={onClick}
    />
);

// River/Stream component
const River = ({ path }) => (
    <path d={path} fill="none" stroke="#67e8f9" strokeWidth="8" strokeLinecap="round" />
);

export default function Island({ 
    id, 
    name, 
    shape, 
    elements, 
    ponds, 
    rivers, 
    trees, 
    width = 400, 
    height = 350,
    onElementClick 
}) {
    const handleClick = (element) => {
        if (onElementClick) {
            onElementClick({ ...element, islandId: id, islandName: name });
        }
    };

    return (
        <div className="relative" style={{ width, height }}>
            {/* Island base with SVG */}
            <svg 
                viewBox="0 0 400 350" 
                className="absolute inset-0 w-full h-full"
                style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.3))' }}
            >
                {/* Ocean border */}
                <path d={shape} fill="#4a6670" transform="translate(3, 3) scale(1.02)" />
                
                {/* Island grass */}
                <path d={shape} fill="#4ade80" />
                
                {/* Inner grass (darker) */}
                <path d={shape} fill="#22c55e" transform="translate(10, 10) scale(0.95)" />
                
                {/* Ponds */}
                {ponds?.map((pond, i) => (
                    <Pond key={i} path={pond.path} onClick={() => handleClick({ type: 'pond', label: pond.name || `Pond ${i+1}` })} />
                ))}
                
                {/* Rivers */}
                {rivers?.map((river, i) => (
                    <River key={i} path={river} />
                ))}
            </svg>

            {/* Tree clusters */}
            {trees?.map((tree, i) => (
                <TreeCluster key={i} x={tree.x} y={tree.y} variant={i} />
            ))}

            {/* Interactive elements */}
            {elements?.map((el, i) => (
                <InteractiveMarker 
                    key={i}
                    type={el.type}
                    x={el.x}
                    y={el.y}
                    status={el.status}
                    label={el.label}
                    onClick={handleClick}
                />
            ))}

            {/* Island name tag */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-gray-800/80 text-white text-xs px-3 py-1 rounded-full">
                {name}
            </div>
        </div>
    );
}