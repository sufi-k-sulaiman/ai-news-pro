import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, CheckCircle, XCircle, Send, FileText, Download, CreditCard, MessageSquare, Bot } from "lucide-react";

export default function TestFunctions() {
    const [loading, setLoading] = useState({});
    const [results, setResults] = useState({});
    const [errors, setErrors] = useState({});

    const runTest = async (name, functionName, params = {}) => {
        setLoading(prev => ({ ...prev, [name]: true }));
        setResults(prev => ({ ...prev, [name]: null }));
        setErrors(prev => ({ ...prev, [name]: null }));
        
        try {
            const response = await base44.functions.invoke(functionName, params);
            setResults(prev => ({ ...prev, [name]: response.data }));
        } catch (err) {
            setErrors(prev => ({ ...prev, [name]: err.response?.data?.error || err.message || 'Failed' }));
        } finally {
            setLoading(prev => ({ ...prev, [name]: false }));
        }
    };

    const downloadFile = async (name, functionName, params, filename) => {
        setLoading(prev => ({ ...prev, [name]: true }));
        setErrors(prev => ({ ...prev, [name]: null }));
        
        try {
            const response = await base44.functions.invoke(functionName, params);
            const blob = new Blob([response.data], { type: response.headers['content-type'] });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            a.remove();
            setResults(prev => ({ ...prev, [name]: { success: true, message: `Downloaded ${filename}` } }));
        } catch (err) {
            setErrors(prev => ({ ...prev, [name]: err.message || 'Download failed' }));
        } finally {
            setLoading(prev => ({ ...prev, [name]: false }));
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

    // Form states
    const [chatMessage, setChatMessage] = useState("Tell me a joke about programming");
    const [embedText, setEmbedText] = useState("Hello world");
    const [smsTo, setSmsTo] = useState("");
    const [smsBody, setSmsBody] = useState("Test message from Base44");

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-2">Backend Functions Test Suite</h1>
                <p className="text-gray-500 mb-6">Test all your backend integrations</p>
                
                <Tabs defaultValue="openai" className="space-y-4">
                    <TabsList className="grid grid-cols-5 w-full">
                        <TabsTrigger value="openai"><Bot className="w-4 h-4 mr-1" /> OpenAI</TabsTrigger>
                        <TabsTrigger value="stripe"><CreditCard className="w-4 h-4 mr-1" /> Stripe</TabsTrigger>
                        <TabsTrigger value="twilio"><MessageSquare className="w-4 h-4 mr-1" /> Twilio</TabsTrigger>
                        <TabsTrigger value="files"><FileText className="w-4 h-4 mr-1" /> Files</TabsTrigger>
                        <TabsTrigger value="webhooks"><Send className="w-4 h-4 mr-1" /> Webhooks</TabsTrigger>
                    </TabsList>

                    {/* OpenAI Tab */}
                    <TabsContent value="openai" className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-lg">Chat Completions</CardTitle>
                                    <CardDescription>Test GPT-4 chat</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <Textarea 
                                        value={chatMessage} 
                                        onChange={(e) => setChatMessage(e.target.value)}
                                        placeholder="Enter message..."
                                        rows={2}
                                    />
                                    <TestButton name="chat" onClick={() => runTest('chat', 'openaiChat', {
                                        messages: [{ role: 'user', content: chatMessage }],
                                        max_tokens: 150
                                    })}>
                                        Send Chat
                                    </TestButton>
                                    <ResultDisplay name="chat" />
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-lg">Embeddings</CardTitle>
                                    <CardDescription>Generate text embeddings</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <Input 
                                        value={embedText} 
                                        onChange={(e) => setEmbedText(e.target.value)}
                                        placeholder="Text to embed..."
                                    />
                                    <TestButton name="embed" onClick={() => runTest('embed', 'openaiEmbeddings', {
                                        text: embedText
                                    })}>
                                        Generate Embedding
                                    </TestButton>
                                    <ResultDisplay name="embed" />
                                </CardContent>
                            </Card>

                            <Card className="md:col-span-2">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-lg">Assistants API</CardTitle>
                                    <CardDescription>Create assistant, thread, and run</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex gap-2 flex-wrap">
                                        <TestButton name="createAssistant" onClick={() => runTest('createAssistant', 'openaiAssistant', {
                                            action: 'create_assistant',
                                            name: 'Test Assistant',
                                            instructions: 'You are a helpful test assistant.'
                                        })}>
                                            Create Assistant
                                        </TestButton>
                                        <TestButton name="createThread" onClick={() => runTest('createThread', 'openaiAssistant', {
                                            action: 'create_thread'
                                        })}>
                                            Create Thread
                                        </TestButton>
                                    </div>
                                    <ResultDisplay name="createAssistant" />
                                    <ResultDisplay name="createThread" />
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    {/* Stripe Tab */}
                    <TabsContent value="stripe" className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-lg">Connection Test</CardTitle>
                                    <CardDescription>Verify Stripe API key</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <TestButton name="stripeTest" onClick={() => runTest('stripeTest', 'testStripe', {})}>
                                        Test Connection
                                    </TestButton>
                                    <ResultDisplay name="stripeTest" />
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-lg">Payments</CardTitle>
                                    <CardDescription>Create payment intent</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <TestButton name="paymentIntent" onClick={() => runTest('paymentIntent', 'stripePayments', {
                                        action: 'create_payment_intent',
                                        amount: 1000,
                                        currency: 'usd',
                                        description: 'Test payment'
                                    })}>
                                        Create $10 Payment Intent
                                    </TestButton>
                                    <ResultDisplay name="paymentIntent" />
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-lg">Customers</CardTitle>
                                    <CardDescription>Create Stripe customer</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <TestButton name="createCustomer" onClick={() => runTest('createCustomer', 'stripePayments', {
                                        action: 'create_customer'
                                    })}>
                                        Create Customer
                                    </TestButton>
                                    <ResultDisplay name="createCustomer" />
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-lg">List Payments</CardTitle>
                                    <CardDescription>View payment history</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <TestButton name="listPayments" onClick={() => runTest('listPayments', 'stripePayments', {
                                        action: 'list_payments'
                                    })}>
                                        List Payments
                                    </TestButton>
                                    <ResultDisplay name="listPayments" />
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    {/* Twilio Tab */}
                    <TabsContent value="twilio" className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-lg">Connection Test</CardTitle>
                                    <CardDescription>Verify Twilio credentials</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <TestButton name="twilioTest" onClick={() => runTest('twilioTest', 'testTwilio', {})}>
                                        Test Connection
                                    </TestButton>
                                    <ResultDisplay name="twilioTest" />
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-lg">Send SMS</CardTitle>
                                    <CardDescription>Send a test SMS message</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <Input 
                                        value={smsTo} 
                                        onChange={(e) => setSmsTo(e.target.value)}
                                        placeholder="Phone number (+1234567890)"
                                    />
                                    <Textarea 
                                        value={smsBody} 
                                        onChange={(e) => setSmsBody(e.target.value)}
                                        placeholder="Message..."
                                        rows={2}
                                    />
                                    <TestButton name="sendSms" onClick={() => runTest('sendSms', 'twilioSms', {
                                        action: 'send_sms',
                                        to: smsTo,
                                        body: smsBody
                                    })}>
                                        Send SMS
                                    </TestButton>
                                    <ResultDisplay name="sendSms" />
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-lg">List Messages</CardTitle>
                                    <CardDescription>View SMS history</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <TestButton name="listSms" onClick={() => runTest('listSms', 'twilioSms', {
                                        action: 'list_messages'
                                    })}>
                                        List Messages
                                    </TestButton>
                                    <ResultDisplay name="listSms" />
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-lg">WhatsApp</CardTitle>
                                    <CardDescription>Send WhatsApp message</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <TestButton name="whatsapp" onClick={() => runTest('whatsapp', 'twilioWhatsapp', {
                                        action: 'list_messages'
                                    })}>
                                        List WhatsApp Messages
                                    </TestButton>
                                    <ResultDisplay name="whatsapp" />
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    {/* Files Tab */}
                    <TabsContent value="files" className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-lg">Generate PDF Report</CardTitle>
                                    <CardDescription>Create a sample report PDF</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <TestButton name="pdfReport" onClick={() => downloadFile('pdfReport', 'generatePdf', {
                                        type: 'report',
                                        title: 'Test Report',
                                        columns: [{ key: 'name', label: 'Name' }, { key: 'value', label: 'Value' }],
                                        data: [
                                            { name: 'Item 1', value: '100' },
                                            { name: 'Item 2', value: '200' },
                                            { name: 'Item 3', value: '300' }
                                        ]
                                    }, 'report.pdf')}>
                                        <Download className="w-4 h-4 mr-2" /> Download Report
                                    </TestButton>
                                    <ResultDisplay name="pdfReport" />
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-lg">Generate Invoice PDF</CardTitle>
                                    <CardDescription>Create a sample invoice</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <TestButton name="pdfInvoice" onClick={() => downloadFile('pdfInvoice', 'generatePdf', {
                                        type: 'invoice',
                                        company_name: 'Test Company',
                                        company_address: '123 Test St',
                                        invoice_number: 'INV-001',
                                        items: [
                                            { description: 'Service A', quantity: 2, price: 50, total: 100 },
                                            { description: 'Service B', quantity: 1, price: 75, total: 75 }
                                        ],
                                        subtotal: 175,
                                        tax: 17.50,
                                        total: 192.50
                                    }, 'invoice.pdf')}>
                                        <Download className="w-4 h-4 mr-2" /> Download Invoice
                                    </TestButton>
                                    <ResultDisplay name="pdfInvoice" />
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-lg">Export CSV</CardTitle>
                                    <CardDescription>Export data to CSV</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <TestButton name="exportCsv" onClick={() => downloadFile('exportCsv', 'exportData', {
                                        format: 'csv',
                                        filename: 'test-export',
                                        columns: [{ key: 'id', label: 'ID' }, { key: 'name', label: 'Name' }, { key: 'email', label: 'Email' }],
                                        data: [
                                            { id: 1, name: 'John Doe', email: 'john@example.com' },
                                            { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
                                        ]
                                    }, 'test-export.csv')}>
                                        <Download className="w-4 h-4 mr-2" /> Download CSV
                                    </TestButton>
                                    <ResultDisplay name="exportCsv" />
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-lg">Export Excel</CardTitle>
                                    <CardDescription>Export data to Excel</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <TestButton name="exportExcel" onClick={() => downloadFile('exportExcel', 'exportData', {
                                        format: 'excel',
                                        filename: 'test-export',
                                        sheet_name: 'Data',
                                        columns: [{ key: 'id', label: 'ID' }, { key: 'name', label: 'Name' }, { key: 'status', label: 'Status' }],
                                        data: [
                                            { id: 1, name: 'Project A', status: 'Active' },
                                            { id: 2, name: 'Project B', status: 'Pending' }
                                        ]
                                    }, 'test-export.xlsx')}>
                                        <Download className="w-4 h-4 mr-2" /> Download Excel
                                    </TestButton>
                                    <ResultDisplay name="exportExcel" />
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    {/* Webhooks Tab */}
                    <TabsContent value="webhooks" className="space-y-4">
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg">Generic Webhook Handler</CardTitle>
                                <CardDescription>Test the webhook endpoint</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <TestButton name="webhook" onClick={() => runTest('webhook', 'webhookHandler', {
                                    test: true,
                                    data: { sample: 'payload' }
                                })}>
                                    Test Webhook
                                </TestButton>
                                <ResultDisplay name="webhook" />
                                <p className="text-xs text-gray-500">
                                    To use webhooks externally, go to Dashboard → Code → Functions → webhookHandler to get the URL.
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg">Stripe Webhook</CardTitle>
                                <CardDescription>Stripe webhook endpoint info</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-gray-600">
                                    The Stripe webhook is configured to handle events like payment_intent.succeeded, 
                                    customer.subscription.created, etc. Configure the webhook URL in your Stripe dashboard.
                                </p>
                                <p className="text-xs text-gray-500 mt-2">
                                    Go to Dashboard → Code → Functions → stripeWebhook to get the URL.
                                </p>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}