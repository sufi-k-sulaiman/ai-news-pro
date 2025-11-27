import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, CheckCircle, XCircle, Send, FileText, Download, CreditCard, MessageSquare, Bot, Sparkles, Image, Mail, Grid3X3, Search, Home, Settings, Radio, BarChart3, TestTube } from "lucide-react";
const allPages = [
    { name: 'Home', page: 'Home', icon: Home },
    { name: 'AI Hub', page: 'AIHub', icon: Sparkles },
    { name: 'SearchPods', page: 'SearchPods', icon: Radio },
    { name: 'Settings', page: 'Settings', icon: Settings },
    { name: 'Dashboard', page: 'DashboardComponents', icon: BarChart3 },
    { name: 'Template', page: 'Template', icon: FileText },
];

export default function TestFunctions() {
    const [loading, setLoading] = useState({});
    const [results, setResults] = useState({});
    const [errors, setErrors] = useState({});
    const [llmPrompt, setLlmPrompt] = useState("What is the capital of France?");
    const [imagePrompt, setImagePrompt] = useState("A beautiful sunset over mountains");
    const [emailTo, setEmailTo] = useState("");
    const [emailSubject, setEmailSubject] = useState("Test Email");
    const [emailBody, setEmailBody] = useState("This is a test email.");

    const testLLM = async (name, prompt, options = {}) => {
        setLoading(prev => ({ ...prev, [name]: true }));
        setResults(prev => ({ ...prev, [name]: null }));
        setErrors(prev => ({ ...prev, [name]: null }));
        try {
            const response = await base44.integrations.Core.InvokeLLM({ prompt, ...options });
            setResults(prev => ({ ...prev, [name]: response }));
        } catch (err) {
            setErrors(prev => ({ ...prev, [name]: err.message || 'Failed' }));
        } finally {
            setLoading(prev => ({ ...prev, [name]: false }));
        }
    };

    const testGenerateImage = async () => {
        setLoading(prev => ({ ...prev, generateImage: true }));
        try {
            const response = await base44.integrations.Core.GenerateImage({ prompt: imagePrompt });
            setResults(prev => ({ ...prev, generateImage: response }));
        } catch (err) {
            setErrors(prev => ({ ...prev, generateImage: err.message }));
        } finally {
            setLoading(prev => ({ ...prev, generateImage: false }));
        }
    };

    const ResultDisplay = ({ name }) => (
        <>
            {results[name] && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm">
                    <div className="flex items-center gap-2 text-green-700 mb-1">
                        <CheckCircle className="w-4 h-4" />
                        <span className="font-medium">Success</span>
                    </div>
                    <pre className="text-xs text-gray-600 overflow-auto max-h-40 whitespace-pre-wrap">
                        {typeof results[name] === 'object' ? JSON.stringify(results[name], null, 2) : results[name]}
                    </pre>
                </div>
            )}
            {errors[name] && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center gap-2 text-red-700 text-sm">
                        <XCircle className="w-4 h-4" />
                        <span>{errors[name]}</span>
                    </div>
                </div>
            )}
        </>
    );

    const TestButton = ({ name, onClick, children }) => (
        <Button onClick={onClick} disabled={loading[name]} size="sm">
            {loading[name] && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {children}
        </Button>
    );

    return (
            <div className="p-6">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl font-bold mb-2">Test Functions</h1>
                    <p className="text-gray-500 mb-6">Test backend integrations and view all pages</p>

                    {/* All Pages */}
                    <div className="mb-8">
                        <h2 className="text-lg font-semibold mb-3">All Pages</h2>
                        <div className="flex flex-wrap gap-2">
                            {allPages.map((page) => (
                                <Link key={page.name} to={createPageUrl(page.page)}>
                                    <Button variant="outline" size="sm" className="gap-2">
                                        <page.icon className="w-4 h-4" />
                                        {page.name}
                                    </Button>
                                </Link>
                            ))}
                        </div>
                    </div>
                    
                    <Tabs defaultValue="llm" className="space-y-4">
                        <TabsList className="flex flex-wrap gap-1 h-auto p-1">
                            <TabsTrigger value="llm"><Sparkles className="w-4 h-4 mr-1" /> LLMs</TabsTrigger>
                            <TabsTrigger value="integrations"><Image className="w-4 h-4 mr-1" /> Integrations</TabsTrigger>
                            <TabsTrigger value="openai"><Bot className="w-4 h-4 mr-1" /> OpenAI</TabsTrigger>
                            <TabsTrigger value="stripe"><CreditCard className="w-4 h-4 mr-1" /> Stripe</TabsTrigger>
                            <TabsTrigger value="twilio"><MessageSquare className="w-4 h-4 mr-1" /> Twilio</TabsTrigger>
                        </TabsList>

                        <TabsContent value="llm" className="space-y-4">
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-lg">Test Prompt</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Textarea value={llmPrompt} onChange={(e) => setLlmPrompt(e.target.value)} rows={2} />
                                </CardContent>
                            </Card>

                            <div className="grid gap-4 md:grid-cols-2">
                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-lg">GPT-4o</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <TestButton name="gpt4o" onClick={() => testLLM('gpt4o', llmPrompt)}>Test GPT-4o</TestButton>
                                        <ResultDisplay name="gpt4o" />
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-lg">With Internet</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <TestButton name="llmInternet" onClick={() => testLLM('llmInternet', llmPrompt, { add_context_from_internet: true })}>Test with Internet</TestButton>
                                        <ResultDisplay name="llmInternet" />
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>

                        <TabsContent value="integrations" className="space-y-4">
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-lg">Generate Image</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <Textarea value={imagePrompt} onChange={(e) => setImagePrompt(e.target.value)} rows={2} />
                                    <TestButton name="generateImage" onClick={testGenerateImage}>Generate Image</TestButton>
                                    {results.generateImage?.url && (
                                        <img src={results.generateImage.url} alt="Generated" className="rounded max-h-48" />
                                    )}
                                    {errors.generateImage && <ResultDisplay name="generateImage" />}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="openai">
                            <Card>
                                <CardContent className="pt-6">
                                    <p className="text-gray-500">OpenAI functions available. Configure in backend.</p>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="stripe">
                            <Card>
                                <CardContent className="pt-6">
                                    <p className="text-gray-500">Stripe integration configured. Test payments in backend.</p>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="twilio">
                            <Card>
                                <CardContent className="pt-6">
                                    <p className="text-gray-500">Twilio SMS/WhatsApp configured. Test in backend.</p>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
    );
}