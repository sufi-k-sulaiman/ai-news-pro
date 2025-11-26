import React from 'react';
import { FileText, Download, CheckCircle, Info } from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function ExportOptions({ onExport, isGenerating }) {
    const formats = [
        { 
            id: 'pdf', 
            name: 'PDF Document', 
            description: 'High-fidelity, print-ready',
            icon: FileText,
            color: '#EF4444'
        },
        { 
            id: 'docx', 
            name: 'Word Document', 
            description: 'Editable .docx format',
            icon: FileText,
            color: '#3B82F6'
        },
        { 
            id: 'txt', 
            name: 'Plain Text', 
            description: 'ATS-safe text format',
            icon: FileText,
            color: '#6B7280'
        },
    ];

    const tips = [
        'Use PDF for online applications',
        'Use TXT for maximum ATS compatibility',
        'Use DOCX for further editing'
    ];

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Export Resume</h3>
                
                <div className="space-y-3 mb-6">
                    {formats.map(format => (
                        <button
                            key={format.id}
                            onClick={() => onExport?.(format.id)}
                            disabled={isGenerating}
                            className="w-full flex items-center gap-4 p-4 rounded-xl border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all text-left disabled:opacity-50"
                        >
                            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${format.color}15` }}>
                                <format.icon className="w-5 h-5" style={{ color: format.color }} />
                            </div>
                            <div className="flex-1">
                                <p className="font-medium text-gray-900">{format.name}</p>
                                <p className="text-sm text-gray-500">{format.description}</p>
                            </div>
                            <Download className="w-5 h-5 text-gray-400" />
                        </button>
                    ))}
                </div>

                <Button 
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => onExport?.('all')}
                    disabled={isGenerating}
                >
                    <Download className="w-5 h-5 mr-2" />
                    Download All Formats
                </Button>
                <p className="text-xs text-center text-gray-500 mt-2">PDF + DOCX + TXT bundle</p>
            </div>

            {/* Export Tips */}
            <div className="bg-blue-50 rounded-2xl border border-blue-200 p-6">
                <h4 className="font-medium text-blue-900 mb-3 flex items-center gap-2">
                    <Info className="w-5 h-5" />
                    Export Tips
                </h4>
                <ul className="space-y-2">
                    {tips.map((tip, i) => (
                        <li key={i} className="text-sm text-blue-800 flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 mt-0.5 text-blue-500 flex-shrink-0" />
                            {tip}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}