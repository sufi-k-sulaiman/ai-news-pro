import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { Button } from "@/components/ui/button";
import PageMeta from '@/components/PageMeta';

export default function ArticleView() {
    const navigate = useNavigate();
    const params = new URLSearchParams(window.location.search);
    const articleUrl = params.get('url');
    const articleTitle = params.get('title');

    if (!articleUrl) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">No Article Selected</h2>
                    <Button onClick={() => navigate(-1)}>Go Back</Button>
                </div>
            </div>
        );
    }

    return (
        <>
            <PageMeta 
                title={articleTitle || 'Article'} 
                description="Read the full article"
            />
            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes" />
            <style>{`
                iframe {
                    width: 1px;
                    min-width: 100%;
                }
                @media (max-width: 768px) {
                    iframe {
                        overflow-x: hidden;
                    }
                }
            `}</style>
            <div className="min-h-screen bg-white flex flex-col">
                <div className="sticky top-0 z-50 bg-white border-b shadow-sm">
                    <div className="max-w-[82rem] mx-auto px-4 py-3 flex items-center justify-between gap-4">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(-1)}
                            className="gap-2"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back
                        </Button>
                        <h1 className="text-sm font-medium text-gray-900 line-clamp-1 flex-1 text-center">
                            {articleTitle}
                        </h1>
                        <a
                            href={articleUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm font-medium hover:opacity-80"
                            style={{ color: '#6209e6' }}
                        >
                            <ExternalLink className="w-4 h-4" />
                            Open
                        </a>
                    </div>
                </div>
                <iframe 
                    src={articleUrl}
                    className="flex-1 w-full border-0"
                    title={articleTitle || 'Article'}
                    style={{ height: 'calc(100vh - 57px)' }}
                />
            </div>
        </>
    );
}