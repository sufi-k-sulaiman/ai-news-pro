import React, { useMemo } from 'react';
import { Link2, BookOpen } from 'lucide-react';

const COLORS = [
    '#A855F7', // Purple
    '#3B82F6', // Blue
    '#22C55E', // Green
    '#F97316', // Orange
    '#EC4899', // Pink
    '#06B6D4', // Cyan
    '#EF4444', // Red
    '#8B5CF6', // Violet
    '#14B8A6', // Teal
    '#F59E0B', // Amber
];

// Simple hash function to get consistent but varied colors per topic
const getColorForTopic = (topic) => {
    let hash = 0;
    for (let i = 0; i < topic.length; i++) {
        hash = topic.charCodeAt(i) + ((hash << 5) - hash);
    }
    return COLORS[Math.abs(hash) % COLORS.length];
};

export default function TopicThumbnail({ topic, onClick }) {
    const bgColor = useMemo(() => getColorForTopic(topic), [topic]);

    return (
        <button
            onClick={() => onClick(topic)}
            className="group relative rounded-2xl p-4 hover:scale-105 hover:shadow-xl transition-all duration-300 text-left min-h-[100px] flex flex-col justify-between"
            style={{ backgroundColor: bgColor }}
        >
            {/* Topic name */}
            <h3 className="font-bold text-white text-sm text-center mb-3">
                {topic}
            </h3>
            
            {/* Buttons */}
            <div className="flex items-center justify-center gap-2">
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/20 text-white text-xs font-medium hover:bg-white/30 transition-colors">
                    <Link2 className="w-3 h-3" />
                    Explore
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/20 text-white text-xs font-medium hover:bg-white/30 transition-colors">
                    <BookOpen className="w-3 h-3" />
                    Learn
                </span>
            </div>
        </button>
    );
}