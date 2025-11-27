import React, { useEffect } from 'react';

const BASE_URL = 'https://1cpublishing.base44.app';

const pages = [
    { name: 'Qwirey', description: 'AI-powered chat interface for interacting with various language models including GPT-4, Claude, and Gemini.' },
    { name: 'MindMap', description: 'AI neural networks create interactive knowledge trees to explore knowledge.' },
    { name: 'SearchPods', description: 'Search for and generate AI-powered audio podcasts on any topic.' },
    { name: 'Markets', description: 'Stock market data with filtering, search capabilities, and detailed financial metrics.' },
    { name: 'News', description: 'Latest news aggregation and AI-powered news summaries.' },
    { name: 'Learning', description: 'Dynamic learning hub with AI-generated personalized learning islands and gamification.' },
    { name: 'Geospatial', description: 'Dashboard for visualizing and analyzing geospatial intelligence data across regions.' },
    { name: 'Intelligence', description: 'AI-powered analytics and decision-making tools for forecasting and scenario building.' },
    { name: 'ResumeBuilder', description: 'Create, analyze, and export professional resumes with AI assistance and ATS compatibility.' },
    { name: 'Tasks', description: 'Task management with drag-and-drop organization and visual data representation.' },
    { name: 'Notes', description: 'AI-powered note-taking with rich text editing and AI assistance for text and image generation.' },
    { name: 'Games', description: 'Educational arcade games including Space Battle and Word Shooter for gamified learning.' },
    { name: 'Settings', description: 'Personalized control for usability, simplify customization, and empower every user experience.' },
    { name: 'TermsOfUse', description: 'Terms of use, licensing, data usage policies, and legal information for 1cPublishing.' },
    { name: 'ContactUs', description: 'Contact form for sales inquiries, feedback, and support requests.' },
    { name: 'SiteMap', description: 'Complete listing of all pages and their descriptions for easy navigation.' },
];

export default function SiteMap() {
    useEffect(() => {
        document.title = 'Site Map - 1cPublishing';
        
        // Hide header, sidebar, footer
        const header = document.querySelector('header');
        const sidebar = document.querySelector('aside');
        const footer = document.querySelector('footer');
        const nav = document.querySelector('nav');
        
        if (header) header.style.display = 'none';
        if (sidebar) sidebar.style.display = 'none';
        if (footer) footer.style.display = 'none';
        if (nav) nav.style.display = 'none';
        
        return () => {
            if (header) header.style.display = '';
            if (sidebar) sidebar.style.display = '';
            if (footer) footer.style.display = '';
            if (nav) nav.style.display = '';
        };
    }, []);

    const today = new Date().toISOString().split('T')[0];

    return (
        <div className="min-h-screen bg-white p-4 font-mono text-sm">
            <pre className="whitespace-pre-wrap text-gray-800">
{`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(page => `  <url>
    <loc>${BASE_URL}/${page.name}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${page.name === 'Qwirey' ? '1.0' : '0.8'}</priority>
    <!-- ${page.description} -->
  </url>`).join('\n')}
</urlset>`}
            </pre>
        </div>
    );
}