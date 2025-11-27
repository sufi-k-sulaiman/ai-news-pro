import React, { useState } from 'react';
import { Sparkles, Send, Loader2, Bot, User, Wand2, Image, FileText, Code, MessageSquare } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { base44 } from '@/api/base44Client';

const QUICK_PROMPTS = [
    { icon: Wand2, label: 'Write a story', prompt: 'Write a short creative story about' },
    { icon: Image, label: 'Describe image', prompt: 'Describe an image of' },
    { icon: FileText, label: 'Summarize', prompt: 'Summarize the following text:' },
    { icon: Code, label: 'Write code', prompt: 'Write code to' },
    { icon: MessageSquare, label: 'Explain', prompt: 'Explain in simple terms:' },
];

export default function AIHub() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    const sendMessage = async () => {
        if (!input.trim() || loading) return;

        const userMessage = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            const response = await base44.integrations.Core.InvokeLLM({
                prompt: input,
                add_context_from_internet: true
            });

            const assistantMessage = { role: 'assistant', content: response || 'I apologize, I could not generate a response.' };
            setMessages(prev => [...prev, assistantMessage]);
        } catch (error) {
            console.error('AI error:', error);
            setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, something went wrong. Please try again.' }]);
        } finally {
            setLoading(false);
        }
    };

    const handleQuickPrompt = (prompt) => {
        setInput(prompt + ' ');
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-6 mb-6 text-white">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center">
                            <Sparkles className="w-7 h-7" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold">AI Hub</h1>
                            <p className="text-white/80 text-sm">Your all-in-one AI assistant powered by Qwirey</p>
                        </div>
                    </div>
                </div>

                {/* Quick Prompts */}
                <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                    {QUICK_PROMPTS.map((item, i) => (
                        <button key={i} onClick={() => handleQuickPrompt(item.prompt)}
                            className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all whitespace-nowrap">
                            <item.icon className="w-4 h-4 text-purple-600" />
                            <span className="text-sm text-gray-700">{item.label}</span>
                        </button>
                    ))}
                </div>

                {/* Chat Area */}
                <div className="bg-white rounded-2xl border border-gray-200 min-h-[400px] flex flex-col">
                    {/* Messages */}
                    <div className="flex-1 p-4 space-y-4 overflow-y-auto max-h-[500px]">
                        {messages.length === 0 && (
                            <div className="text-center py-12 text-gray-400">
                                <Bot className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                <p>Start a conversation with AI</p>
                            </div>
                        )}
                        {messages.map((msg, i) => (
                            <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                {msg.role === 'assistant' && (
                                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                                        <Bot className="w-4 h-4 text-purple-600" />
                                    </div>
                                )}
                                <div className={`max-w-[80%] p-4 rounded-2xl ${
                                    msg.role === 'user' 
                                        ? 'bg-purple-600 text-white' 
                                        : 'bg-gray-100 text-gray-800'
                                }`}>
                                    <p className="whitespace-pre-wrap text-sm">{msg.content}</p>
                                </div>
                                {msg.role === 'user' && (
                                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                                        <User className="w-4 h-4 text-gray-600" />
                                    </div>
                                )}
                            </div>
                        ))}
                        {loading && (
                            <div className="flex gap-3">
                                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                                    <Bot className="w-4 h-4 text-purple-600" />
                                </div>
                                <div className="bg-gray-100 p-4 rounded-2xl">
                                    <Loader2 className="w-5 h-5 animate-spin text-purple-600" />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input */}
                    <div className="p-4 border-t border-gray-100">
                        <div className="flex gap-3">
                            <Textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                                placeholder="Ask me anything..."
                                className="flex-1 min-h-[50px] max-h-[150px] resize-none"
                            />
                            <Button onClick={sendMessage} disabled={loading || !input.trim()} 
                                className="bg-purple-600 hover:bg-purple-700 px-6">
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}