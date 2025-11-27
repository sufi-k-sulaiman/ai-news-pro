import React from 'react';
import { Shield, Users, FileText, Scale } from 'lucide-react';

export default function Governance() {
    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Governance</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <Shield className="w-8 h-8 text-purple-600 mb-3" />
                    <h3 className="font-semibold text-gray-900 mb-2">Policies</h3>
                    <p className="text-gray-500 text-sm">Manage organizational policies and guidelines</p>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <Users className="w-8 h-8 text-blue-600 mb-3" />
                    <h3 className="font-semibold text-gray-900 mb-2">Committees</h3>
                    <p className="text-gray-500 text-sm">Oversight and advisory committees</p>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <FileText className="w-8 h-8 text-green-600 mb-3" />
                    <h3 className="font-semibold text-gray-900 mb-2">Compliance</h3>
                    <p className="text-gray-500 text-sm">Regulatory compliance tracking</p>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <Scale className="w-8 h-8 text-amber-600 mb-3" />
                    <h3 className="font-semibold text-gray-900 mb-2">Risk Management</h3>
                    <p className="text-gray-500 text-sm">Enterprise risk assessment</p>
                </div>
            </div>
        </div>
    );
}