import React, { useState, useEffect, useRef } from 'react';
import { TrendingUp, TrendingDown, Award, AlertTriangle, Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const CATEGORY_LABELS = {
    carbon: 'Carbon & Climate',
    airwater: 'Air & Water Quality',
    forests: 'Forests & Biodiversity',
    resources: 'Natural Resources',
    sustainability: 'Sustainability',
    health: 'Environmental Health',
    treasures: 'National Treasures & Protected Areas',
};

export default function CountryComparison({ selectedCategories = [] }) {
    const [topCountries, setTopCountries] = useState([]);
    const [bottomCountries, setBottomCountries] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const lastFetchRef = useRef('');

    useEffect(() => {
        const categoriesKey = selectedCategories.sort().join(',');
        if (categoriesKey === lastFetchRef.current) return;
        if (selectedCategories.length === 0) return;
        
        lastFetchRef.current = categoriesKey;
        fetchCountryData();
    }, [selectedCategories]);

    const fetchCountryData = async () => {
        setLoading(true);
        setError(null);
        
        try {
            const categoryNames = selectedCategories
                .map(c => CATEGORY_LABELS[c] || c)
                .join(', ');

            const response = await base44.integrations.Core.InvokeLLM({
                prompt: `Analyze countries based on these environmental categories: ${categoryNames}.

Provide the top 5 best-performing countries and bottom 5 worst-performing countries with current 2024 data.

For each country include:
- Country name
- Score (0-100 based on performance in these categories)
- Brief reason explaining their ranking with specific facts/statistics

Consider factors like: emissions data, renewable energy %, forest coverage, air quality index, water quality, protected areas, environmental policies, and sustainability initiatives.`,
                add_context_from_internet: true,
                response_json_schema: {
                    type: "object",
                    properties: {
                        top_performers: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    name: { type: "string" },
                                    score: { type: "number" },
                                    reason: { type: "string" }
                                }
                            }
                        },
                        needs_improvement: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    name: { type: "string" },
                                    score: { type: "number" },
                                    reason: { type: "string" }
                                }
                            }
                        }
                    }
                }
            });

            setTopCountries(response?.top_performers || []);
            setBottomCountries(response?.needs_improvement || []);
        } catch (err) {
            console.error('Error fetching country data:', err);
            setError('Failed to load country data');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12 my-6 bg-gray-50 rounded-xl border border-gray-200">
                <Loader2 className="w-6 h-6 text-purple-600 animate-spin mr-3" />
                <span className="text-gray-600">Analyzing country performance...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center py-12 my-6 bg-red-50 rounded-xl border border-red-200">
                <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
                <span className="text-red-600">{error}</span>
            </div>
        );
    }

    if (topCountries.length === 0 && bottomCountries.length === 0) {
        return null;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
            {/* Top Performers */}
            <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl border border-emerald-200 p-5">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                        <Award className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900">Top Performers</h3>
                        <p className="text-xs text-gray-500">Leading in environmental metrics</p>
                    </div>
                </div>
                <div className="space-y-3">
                    {TOP_COUNTRIES.map((country, i) => (
                        <div 
                            key={country.name}
                            className="bg-white rounded-lg p-3 border border-emerald-100 hover:border-emerald-300 transition-colors cursor-pointer"
                        >
                            <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center gap-2">
                                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold flex items-center justify-center">
                                        {i + 1}
                                    </span>
                                    <span className="font-medium text-gray-900">{country.name}</span>
                                </div>
                                <div className="flex items-center gap-1 text-emerald-600">
                                    <TrendingUp className="w-3 h-3" />
                                    <span className="text-sm font-semibold">{country.score}</span>
                                </div>
                            </div>
                            <p className="text-xs text-gray-500 ml-7 line-clamp-2">{country.reason}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Needs Improvement */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-200 p-5">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                        <AlertTriangle className="w-4 h-4 text-amber-600" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900">Needs Improvement</h3>
                        <p className="text-xs text-gray-500">Opportunities for progress</p>
                    </div>
                </div>
                <div className="space-y-3">
                    {BOTTOM_COUNTRIES.map((country, i) => (
                        <div 
                            key={country.name}
                            className="bg-white rounded-lg p-3 border border-amber-100 hover:border-amber-300 transition-colors cursor-pointer"
                        >
                            <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center gap-2">
                                    <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-700 text-xs font-bold flex items-center justify-center">
                                        {i + 1}
                                    </span>
                                    <span className="font-medium text-gray-900">{country.name}</span>
                                </div>
                                <div className="flex items-center gap-1 text-amber-600">
                                    <TrendingDown className="w-3 h-3" />
                                    <span className="text-sm font-semibold">{country.score}</span>
                                </div>
                            </div>
                            <p className="text-xs text-gray-500 ml-7 line-clamp-2">{country.reason}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}