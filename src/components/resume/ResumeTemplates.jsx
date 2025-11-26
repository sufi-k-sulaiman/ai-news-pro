import React from 'react';
import { Check } from 'lucide-react';

export const RESUME_TEMPLATES = [
    // Modern
    { id: 'modern-professional', name: 'Modern Professional', category: 'Modern', color: '#6B4EE6', headerStyle: 'centered', accentPosition: 'top' },
    { id: 'clean-minimal', name: 'Clean Minimal', category: 'Modern', color: '#3B82F6', headerStyle: 'left', accentPosition: 'left' },
    { id: 'bold-impact', name: 'Bold Impact', category: 'Modern', color: '#EC4899', headerStyle: 'centered', accentPosition: 'full' },
    { id: 'tech-forward', name: 'Tech Forward', category: 'Modern', color: '#10B981', headerStyle: 'left', accentPosition: 'sidebar' },
    { id: 'creative-edge', name: 'Creative Edge', category: 'Modern', color: '#F59E0B', headerStyle: 'centered', accentPosition: 'diagonal' },
    // Classic
    { id: 'executive-classic', name: 'Executive Classic', category: 'Classic', color: '#1E3A5F', headerStyle: 'centered', accentPosition: 'underline' },
    { id: 'traditional-pro', name: 'Traditional Pro', category: 'Classic', color: '#374151', headerStyle: 'left', accentPosition: 'none' },
    { id: 'timeless-elegant', name: 'Timeless Elegant', category: 'Classic', color: '#1F2937', headerStyle: 'centered', accentPosition: 'border' },
    { id: 'corporate-standard', name: 'Corporate Standard', category: 'Classic', color: '#4B5563', headerStyle: 'left', accentPosition: 'top' },
    { id: 'professional-plus', name: 'Professional Plus', category: 'Classic', color: '#111827', headerStyle: 'centered', accentPosition: 'left' },
    // Creative
    { id: 'designer-portfolio', name: 'Designer Portfolio', category: 'Creative', color: '#8B5CF6', headerStyle: 'sidebar', accentPosition: 'full' },
    { id: 'artistic-flair', name: 'Artistic Flair', category: 'Creative', color: '#EC4899', headerStyle: 'centered', accentPosition: 'gradient' },
    { id: 'visual-impact', name: 'Visual Impact', category: 'Creative', color: '#06B6D4', headerStyle: 'left', accentPosition: 'blocks' },
    { id: 'creative-canvas', name: 'Creative Canvas', category: 'Creative', color: '#F97316', headerStyle: 'centered', accentPosition: 'shapes' },
    { id: 'bold-statement', name: 'Bold Statement', category: 'Creative', color: '#EF4444', headerStyle: 'full', accentPosition: 'header' },
    // Technical
    { id: 'developer-dark', name: 'Developer Dark', category: 'Technical', color: '#7C3AED', headerStyle: 'left', accentPosition: 'sidebar' },
    { id: 'engineer-pro', name: 'Engineer Pro', category: 'Technical', color: '#2563EB', headerStyle: 'left', accentPosition: 'minimal' },
    { id: 'data-driven', name: 'Data Driven', category: 'Technical', color: '#059669', headerStyle: 'centered', accentPosition: 'charts' },
    { id: 'tech-minimal', name: 'Tech Minimal', category: 'Technical', color: '#475569', headerStyle: 'left', accentPosition: 'code' },
    { id: 'system-architect', name: 'System Architect', category: 'Technical', color: '#0EA5E9', headerStyle: 'left', accentPosition: 'grid' },
];

export function TemplateCard({ template, isSelected, onSelect }) {
    return (
        <div
            onClick={() => onSelect(template.id)}
            className={`relative p-2 rounded-xl border-2 cursor-pointer transition-all ${
                isSelected ? 'border-purple-500 bg-purple-50 shadow-md' : 'border-gray-200 hover:border-gray-300'
            }`}
        >
            {isSelected && (
                <div className="absolute top-2 right-2 w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                </div>
            )}
            <div className="aspect-[3/4] rounded-lg mb-2 overflow-hidden" style={{ backgroundColor: '#F8FAFC' }}>
                <TemplateThumbnail template={template} />
            </div>
            <p className="text-xs font-medium text-gray-700 truncate text-center">{template.name}</p>
        </div>
    );
}

export function TemplateThumbnail({ template }) {
    const { color, headerStyle, accentPosition } = template;
    
    return (
        <div className="w-full h-full p-2 flex flex-col">
            {/* Header Area */}
            {accentPosition === 'full' && (
                <div className="w-full h-8 rounded mb-2" style={{ backgroundColor: color }} />
            )}
            {accentPosition === 'top' && (
                <div className="w-full h-1 rounded mb-2" style={{ backgroundColor: color }} />
            )}
            
            <div className={`flex ${headerStyle === 'centered' ? 'justify-center' : 'justify-start'} mb-2`}>
                <div>
                    <div className="h-2 w-16 rounded mb-1" style={{ backgroundColor: color }} />
                    <div className="h-1 w-12 bg-gray-300 rounded" />
                </div>
            </div>
            
            {accentPosition === 'underline' && (
                <div className="w-full h-0.5 mb-2" style={{ backgroundColor: color }} />
            )}
            
            {/* Content */}
            <div className="flex-1 space-y-2">
                <div className="flex items-center gap-1">
                    {accentPosition === 'left' && <div className="w-0.5 h-3" style={{ backgroundColor: color }} />}
                    <div className="h-1.5 w-8 rounded" style={{ backgroundColor: color }} />
                </div>
                <div className="space-y-1">
                    <div className="h-1 bg-gray-200 rounded w-full" />
                    <div className="h-1 bg-gray-200 rounded w-4/5" />
                    <div className="h-1 bg-gray-200 rounded w-3/4" />
                </div>
                
                <div className="flex items-center gap-1 pt-1">
                    {accentPosition === 'left' && <div className="w-0.5 h-3" style={{ backgroundColor: color }} />}
                    <div className="h-1.5 w-6 rounded" style={{ backgroundColor: color }} />
                </div>
                <div className="space-y-1">
                    <div className="h-1 bg-gray-200 rounded w-full" />
                    <div className="h-1 bg-gray-200 rounded w-2/3" />
                </div>
                
                {/* Skills */}
                <div className="flex gap-1 pt-1">
                    <div className="h-2 w-6 rounded-full" style={{ backgroundColor: `${color}30`, border: `1px solid ${color}` }} />
                    <div className="h-2 w-8 rounded-full" style={{ backgroundColor: `${color}30`, border: `1px solid ${color}` }} />
                    <div className="h-2 w-5 rounded-full" style={{ backgroundColor: `${color}30`, border: `1px solid ${color}` }} />
                </div>
            </div>
        </div>
    );
}

export function TemplateSelector({ selectedTemplate, onSelect }) {
    const categories = ['Modern', 'Classic', 'Creative', 'Technical'];
    
    return (
        <div className="space-y-6">
            <h2 className="font-semibold text-gray-900">Choose Template ({RESUME_TEMPLATES.length} designs)</h2>
            
            {categories.map(category => (
                <div key={category}>
                    <h3 className="text-sm font-medium text-gray-600 mb-3">{category}</h3>
                    <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-2">
                        {RESUME_TEMPLATES.filter(t => t.category === category).map(template => (
                            <TemplateCard
                                key={template.id}
                                template={template}
                                isSelected={selectedTemplate === template.id}
                                onSelect={onSelect}
                            />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}