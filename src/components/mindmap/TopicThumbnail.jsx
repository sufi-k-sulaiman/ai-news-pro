import React, { useMemo } from 'react';

const NODE_COLORS = [
    '#A855F7', '#3B82F6', '#22C55E', '#F97316', '#EC4899', 
    '#06B6D4', '#EF4444', '#8B5CF6', '#14B8A6', '#F59E0B'
];

const getColorsForTopic = (topic) => {
    let hash = 0;
    for (let i = 0; i < topic.length; i++) {
        hash = topic.charCodeAt(i) + ((hash << 5) - hash);
    }
    const idx = Math.abs(hash) % NODE_COLORS.length;
    return [
        NODE_COLORS[idx],
        NODE_COLORS[(idx + 3) % NODE_COLORS.length],
        NODE_COLORS[(idx + 6) % NODE_COLORS.length]
    ];
};

const SUBTOPICS = {
    'Geography': ['Continents', 'Climate', 'Mapping'],
    'Psychology': ['Behavior', 'Cognition', 'Emotion'],
    'Music': ['Theory', 'Genres', 'History'],
    'Business': ['Strategy', 'Marketing', 'Finance'],
    'Sociology': ['Culture', 'Groups', 'Behavior'],
    'Environment': ['Ecology', 'Climate', 'Conservation'],
    'Mathematics': ['Algebra', 'Geometry', 'Calculus'],
    'History': ['Ancient', 'Modern', 'Events'],
    'Literature': ['Poetry', 'Prose', 'Drama'],
    'Sports': ['Teams', 'Athletes', 'Events'],
    'Science': ['Physics', 'Chemistry', 'Biology'],
    'Culture & Anthropology': ['Traditions', 'Society', 'Artifacts'],
    'Health & Medicine': ['Anatomy', 'Treatment', 'Prevention'],
    'Education': ['Methods', 'Theory', 'Practice'],
    'Art': ['Painting', 'Sculpture', 'Digital'],
    'Economics': ['Markets', 'Trade', 'Policy'],
    'Philosophy': ['Ethics', 'Logic', 'Metaphysics'],
    'Politics': ['Systems', 'Policy', 'Law'],
};

export default function TopicThumbnail({ topic, onClick }) {
    const [primary, secondary, tertiary] = useMemo(() => getColorsForTopic(topic), [topic]);
    const subtopics = SUBTOPICS[topic] || ['Topic 1', 'Topic 2', 'Topic 3'];

    return (
        <button
            onClick={() => onClick(topic)}
            className="group relative bg-white rounded-2xl border border-gray-200 p-3 hover:shadow-lg hover:border-purple-300 transition-all duration-300 text-left"
        >
            {/* Mini mind map visualization */}
            <div className="relative h-36 mb-2">
                {/* Connecting lines */}
                <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }}>
                    <line x1="50%" y1="50%" x2="22%" y2="18%" stroke={secondary} strokeWidth="2" opacity="0.4" />
                    <line x1="50%" y1="50%" x2="78%" y2="18%" stroke={tertiary} strokeWidth="2" opacity="0.4" />
                    <line x1="50%" y1="50%" x2="50%" y2="88%" stroke={secondary} strokeWidth="2" opacity="0.4" />
                </svg>
                
                {/* Center node */}
                <div 
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full flex items-center justify-center text-white text-[10px] font-bold shadow-lg z-10 group-hover:scale-110 transition-transform text-center px-1"
                    style={{ backgroundColor: primary }}
                >
                    {topic.length > 10 ? topic.slice(0, 8) + '...' : topic}
                </div>
                
                {/* Child nodes */}
                <div 
                    className="absolute left-[12%] top-[8%] w-12 h-12 rounded-full flex items-center justify-center text-white text-[8px] font-medium shadow-md group-hover:scale-105 transition-transform"
                    style={{ backgroundColor: secondary }}
                >
                    {subtopics[0]?.slice(0, 7)}
                </div>
                <div 
                    className="absolute right-[12%] top-[8%] w-12 h-12 rounded-full flex items-center justify-center text-white text-[8px] font-medium shadow-md group-hover:scale-105 transition-transform"
                    style={{ backgroundColor: tertiary }}
                >
                    {subtopics[1]?.slice(0, 7)}
                </div>
                <div 
                    className="absolute left-1/2 -translate-x-1/2 bottom-0 w-12 h-12 rounded-full flex items-center justify-center text-white text-[8px] font-medium shadow-md group-hover:scale-105 transition-transform"
                    style={{ backgroundColor: secondary }}
                >
                    {subtopics[2]?.slice(0, 7)}
                </div>
            </div>
            
            {/* Topic name */}
            <h3 className="font-semibold text-gray-900 text-xs text-center group-hover:text-purple-700 transition-colors truncate">
                {topic}
            </h3>
        </button>
    );
}