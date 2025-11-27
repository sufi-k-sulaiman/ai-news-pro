import React, { useEffect } from 'react';

const BASE_URL = 'https://1cpublishing.base44.app';

const pages = [
    { name: 'Qwirey', priority: '1.0' },
    { name: 'MindMap', priority: '0.9' },
    { name: 'SearchPods', priority: '0.8' },
    { name: 'Markets', priority: '0.8' },
    { name: 'News', priority: '0.8' },
    { name: 'Learning', priority: '0.8' },
    { name: 'Geospatial', priority: '0.8' },
    { name: 'Intelligence', priority: '0.8' },
    { name: 'ResumeBuilder', priority: '0.7' },
    { name: 'Tasks', priority: '0.7' },
    { name: 'Notes', priority: '0.7' },
    { name: 'Games', priority: '0.6' },
    { name: 'Settings', priority: '0.5' },
    { name: 'TermsOfUse', priority: '0.4' },
    { name: 'ContactUs', priority: '0.5' },
];

export default function SiteMapXml() {
    useEffect(() => {
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

    const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(page => `  <url>
    <loc>${BASE_URL}/${page.name}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

    return <pre style={{ margin: 0, padding: 0, fontFamily: 'monospace', fontSize: '12px' }}>{xmlContent}</pre>;
}