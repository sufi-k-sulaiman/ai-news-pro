import React, { useState, useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { Search, Loader2 } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SmartSearchBar({ 
    onSearch, 
    placeholder = "Search anything...",
    className = ""
}) {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const debounceRef = useRef(null);
    const wrapperRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        
        if (query.length < 2) {
            setSuggestions([]);
            return;
        }

        debounceRef.current = setTimeout(async () => {
            setIsLoading(true);
            try {
                const response = await base44.integrations.Core.InvokeLLM({
                    prompt: `Generate 5 search suggestions related to: "${query}". Return popular, trending, or helpful related searches.`,
                    add_context_from_internet: true,
                    response_json_schema: {
                        type: "object",
                        properties: {
                            suggestions: {
                                type: "array",
                                items: { type: "string" }
                            }
                        }
                    }
                });
                setSuggestions(response?.suggestions || []);
                setShowSuggestions(true);
            } catch (error) {
                console.error('Error fetching suggestions:', error);
            } finally {
                setIsLoading(false);
            }
        }, 500);

        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, [query]);

    const handleSubmit = (e) => {
        e?.preventDefault();
        if (query.trim() && onSearch) {
            onSearch(query);
            setShowSuggestions(false);
        }
    };

    const handleSuggestionClick = (suggestion) => {
        setQuery(suggestion);
        setShowSuggestions(false);
        if (onSearch) onSearch(suggestion);
    };

    return (
        <div ref={wrapperRef} className={`relative ${className}`}>
            <form onSubmit={handleSubmit} className="relative flex items-center">
                <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                    placeholder={placeholder}
                    className="w-full pl-4 pr-14 py-3 rounded-full border-gray-200 focus:border-purple-500"
                />
                <Button
                    type="submit"
                    size="icon"
                    disabled={!query.trim()}
                    className="absolute right-1.5 w-10 h-10 rounded-full bg-purple-600 hover:bg-purple-700 text-white"
                >
                    {isLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <Search className="w-5 h-5" />
                    )}
                </Button>
            </form>

            {/* Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden z-50">
                    {suggestions.map((suggestion, i) => (
                        <button
                            key={i}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 flex items-center gap-3 transition-colors"
                        >
                            <Search className="w-4 h-4 text-gray-400" />
                            <span>{suggestion}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}