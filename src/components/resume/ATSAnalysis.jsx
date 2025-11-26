import React from 'react';
import { CheckCircle, AlertCircle, Plus, RefreshCw } from 'lucide-react';
import { Button } from "@/components/ui/button";

function CircularProgress({ value, size = 100, strokeWidth = 8 }) {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (value / 100) * circumference;
    
    const getColor = () => {
        if (value >= 80) return '#10B981';
        if (value >= 60) return '#F59E0B';
        return '#EF4444';
    };

    return (
        <div className="relative" style={{ width: size, height: size }}>
            <svg className="transform -rotate-90" width={size} height={size}>
                <circle
                    className="text-gray-200"
                    strokeWidth={strokeWidth}
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                />
                <circle
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    stroke={getColor()}
                    fill="transparent"
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                    style={{ transition: 'stroke-dashoffset 0.5s ease' }}
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold" style={{ color: getColor() }}>{value}</span>
                <span className="text-xs text-gray-500">score</span>
            </div>
        </div>
    );
}

function ScoreBar({ label, value, icon }) {
    const getColor = () => {
        if (value >= 80) return '#10B981';
        if (value >= 60) return '#F59E0B';
        return '#EF4444';
    };

    return (
        <div className="flex items-center gap-3">
            <span className="text-gray-400">{icon}</span>
            <span className="text-sm text-gray-600 flex-1">{label}</span>
            <div className="w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all" style={{ width: `${value}%`, backgroundColor: getColor() }} />
            </div>
            <span className="text-xs font-medium w-8" style={{ color: getColor() }}>{value}%</span>
        </div>
    );
}

export default function ATSAnalysis({ analysis, onAddKeyword, onRefresh }) {
    if (!analysis) return null;

    return (
        <div className="space-y-6">
            {/* ATS Compatibility */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    ATS Compatibility
                </h3>
                
                <div className="flex items-center gap-6">
                    <CircularProgress value={analysis.atsScore || 85} />
                    <div className="flex-1">
                        <p className="text-lg font-semibold text-green-600 mb-1">
                            {analysis.atsScore >= 80 ? 'Excellent' : analysis.atsScore >= 60 ? 'Good' : 'Needs Work'}
                        </p>
                        <p className="text-sm text-gray-500">ATS Pass Rate</p>
                    </div>
                </div>

                {/* Matched Keywords */}
                {analysis.matchedKeywords?.length > 0 && (
                    <div className="mt-4">
                        <p className="text-sm text-gray-600 mb-2">
                            <CheckCircle className="w-4 h-4 inline mr-1 text-green-500" />
                            Matched ({analysis.matchedKeywords.length})
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {analysis.matchedKeywords.map((kw, i) => (
                                <span key={i} className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded-full border border-green-200">
                                    {kw}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Missing Keywords */}
                {analysis.suggestedKeywords?.length > 0 && (
                    <div className="mt-4">
                        <p className="text-sm text-gray-600 mb-2">
                            <Plus className="w-4 h-4 inline mr-1 text-blue-500" />
                            Add These Keywords
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {analysis.suggestedKeywords.map((kw, i) => (
                                <button
                                    key={i}
                                    onClick={() => onAddKeyword?.(kw)}
                                    className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full border border-blue-200 hover:bg-blue-100 flex items-center gap-1"
                                >
                                    <Plus className="w-3 h-3" /> {kw}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                <Button variant="outline" size="sm" className="mt-4 w-full" onClick={onRefresh}>
                    <RefreshCw className="w-4 h-4 mr-2" /> View Updated Resume
                </Button>
            </div>

            {/* HR Clinical Analysis */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-purple-500" />
                    HR Clinical Analysis
                </h3>

                <div className="space-y-4">
                    {/* Readability */}
                    <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Readability & Clarity</p>
                        <div className="space-y-2">
                            <ScoreBar label="Sentence Simplicity" value={analysis.sentenceSimplicity || 88} icon="T" />
                            <ScoreBar label="Bullet Point Usage" value={analysis.bulletPointUsage || 95} icon="•" />
                            <ScoreBar label="Jargon Avoidance" value={analysis.jargonAvoidance || 82} icon="✓" />
                        </div>
                    </div>

                    {/* Relevance */}
                    <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Relevance & Alignment</p>
                        <div className="space-y-2">
                            <ScoreBar label="Skills Alignment" value={analysis.skillsAlignment || 85} icon="⚡" />
                            <ScoreBar label="Industry Terms" value={analysis.industryTerms || 83} icon="🏢" />
                            <ScoreBar label="Quantified Achievements" value={analysis.quantifiedAchievements || 78} icon="📊" />
                        </div>
                    </div>

                    {/* Consistency */}
                    <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Consistency & Quality</p>
                        <div className="space-y-2">
                            <ScoreBar label="Format Uniformity" value={analysis.formatUniformity || 92} icon="📐" />
                            <ScoreBar label="Grammar & Spelling" value={analysis.grammarSpelling || 98} icon="✏️" />
                            <ScoreBar label="Tense Consistency" value={analysis.tenseConsistency || 90} icon="⏱️" />
                        </div>
                    </div>

                    {/* Impact */}
                    <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Impact & Results</p>
                        <div className="space-y-2">
                            <ScoreBar label="Quantified Results" value={analysis.quantifiedResults || 80} icon="💰" />
                            <ScoreBar label="Scope of Work" value={analysis.scopeOfWork || 85} icon="🎯" />
                            <ScoreBar label="Career Growth" value={analysis.careerGrowth || 88} icon="📈" />
                        </div>
                    </div>

                    {/* Engagement */}
                    <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Engagement & Branding</p>
                        <div className="space-y-2">
                            <ScoreBar label="Action Verbs" value={analysis.actionVerbs || 92} icon="🚀" />
                            <ScoreBar label="Value Proposition" value={analysis.valueProposition || 78} icon="💎" />
                            <ScoreBar label="Professional Summary" value={analysis.professionalSummary || 85} icon="📝" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}