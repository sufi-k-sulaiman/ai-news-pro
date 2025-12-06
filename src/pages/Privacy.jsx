import React, { useEffect } from 'react';
import { Shield, Lock, Eye, Database, UserCheck, FileText } from 'lucide-react';

export default function Privacy() {
    useEffect(() => {
        document.title = 'Privacy Policy - 1cPublishing';
        document.querySelector('meta[name="description"]')?.setAttribute('content', 'Learn how 1cPublishing collects, uses, and protects your personal information.');
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
                        <Shield className="w-8 h-8 text-purple-600" />
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
                    <p className="text-gray-600">Last updated: December 6, 2025</p>
                </div>

                <div className="bg-white rounded-2xl border border-gray-200 p-8 space-y-8">
                    <section>
                        <div className="flex items-center gap-3 mb-4">
                            <Eye className="w-6 h-6 text-purple-600" />
                            <h2 className="text-2xl font-bold text-gray-900">Information We Collect</h2>
                        </div>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            At 1cPublishing, we collect information that you provide directly to us when using our AI-powered platform. This includes:
                        </p>
                        <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                            <li>Account information (name, email address, password)</li>
                            <li>User-generated content and queries submitted to our AI systems</li>
                            <li>Usage data and interaction patterns with our services</li>
                            <li>Device information and browser type</li>
                        </ul>
                    </section>

                    <section>
                        <div className="flex items-center gap-3 mb-4">
                            <Database className="w-6 h-6 text-purple-600" />
                            <h2 className="text-2xl font-bold text-gray-900">How We Use Your Information</h2>
                        </div>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            We use the information we collect to:
                        </p>
                        <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                            <li>Provide, maintain, and improve our AI services</li>
                            <li>Personalize your experience and deliver relevant content</li>
                            <li>Train and enhance our AI models (with proper anonymization)</li>
                            <li>Communicate with you about updates, features, and support</li>
                            <li>Ensure platform security and prevent fraud</li>
                        </ul>
                    </section>

                    <section>
                        <div className="flex items-center gap-3 mb-4">
                            <Lock className="w-6 h-6 text-purple-600" />
                            <h2 className="text-2xl font-bold text-gray-900">Data Security</h2>
                        </div>
                        <p className="text-gray-700 leading-relaxed">
                            We implement industry-standard security measures to protect your personal information. 
                            This includes encryption of data in transit and at rest, secure authentication protocols, 
                            and regular security audits. However, no method of transmission over the internet is 100% 
                            secure, and we cannot guarantee absolute security.
                        </p>
                    </section>

                    <section>
                        <div className="flex items-center gap-3 mb-4">
                            <UserCheck className="w-6 h-6 text-purple-600" />
                            <h2 className="text-2xl font-bold text-gray-900">Your Rights</h2>
                        </div>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            You have the right to:
                        </p>
                        <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                            <li>Access and review your personal information</li>
                            <li>Request correction of inaccurate data</li>
                            <li>Request deletion of your account and associated data</li>
                            <li>Opt-out of marketing communications</li>
                            <li>Export your data in a portable format</li>
                        </ul>
                    </section>

                    <section>
                        <div className="flex items-center gap-3 mb-4">
                            <FileText className="w-6 h-6 text-purple-600" />
                            <h2 className="text-2xl font-bold text-gray-900">Data Retention</h2>
                        </div>
                        <p className="text-gray-700 leading-relaxed">
                            We retain your personal information for as long as necessary to provide our services and 
                            fulfill the purposes outlined in this policy. When you delete your account, we will remove 
                            your personal information within 30 days, except where we are required to retain it for 
                            legal or regulatory purposes.
                        </p>
                    </section>

                    <section>
                        <div className="flex items-center gap-3 mb-4">
                            <Shield className="w-6 h-6 text-purple-600" />
                            <h2 className="text-2xl font-bold text-gray-900">Third-Party Services</h2>
                        </div>
                        <p className="text-gray-700 leading-relaxed">
                            Our platform may integrate with third-party services (such as payment processors and 
                            analytics tools). These services have their own privacy policies, and we encourage you 
                            to review them. We do not sell your personal information to third parties.
                        </p>
                    </section>

                    <section>
                        <div className="flex items-center gap-3 mb-4">
                            <FileText className="w-6 h-6 text-purple-600" />
                            <h2 className="text-2xl font-bold text-gray-900">Updates to This Policy</h2>
                        </div>
                        <p className="text-gray-700 leading-relaxed">
                            We may update this privacy policy from time to time. We will notify you of any material 
                            changes by posting the new policy on this page and updating the "Last updated" date. 
                            Your continued use of our services after such changes constitutes acceptance of the 
                            updated policy.
                        </p>
                    </section>

                    <section className="pt-6 border-t border-gray-200">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
                        <p className="text-gray-700 leading-relaxed">
                            If you have questions about this privacy policy or how we handle your data, please 
                            contact us at:
                        </p>
                        <p className="text-purple-600 font-medium mt-2">privacy@1cpublishing.com</p>
                    </section>
                </div>
            </div>
        </div>
    );
}