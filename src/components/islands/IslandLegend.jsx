import React from 'react';
import { MapPin, CheckCircle, Trophy } from 'lucide-react';

export default function IslandLegend({ globalRank = 137 }) {
    return (
        <div className="bg-gray-800/80 rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-3">
                <span className="text-gray-300 text-sm">Pending</span>
                <div className="w-8 h-8 bg-cyan-400 rounded-full flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-white" />
                </div>
            </div>
            <div className="flex items-center gap-3">
                <span className="text-gray-300 text-sm">Completed</span>
                <div className="w-8 h-8 bg-blue-900 rounded-full flex items-center justify-center border-2 border-white">
                    <CheckCircle className="w-4 h-4 text-white" />
                </div>
            </div>
            <div className="flex items-center gap-3">
                <span className="text-gray-300 text-sm">Global #{globalRank}</span>
                <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                    <Trophy className="w-4 h-4 text-white" />
                </div>
            </div>
        </div>
    );
}