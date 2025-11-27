import React, { useState, useEffect } from 'react';
import Header from './layout/Header';
import Footer from './layout/Footer';
import Sidebar from './layout/Sidebar';
import { Toaster } from 'sonner';

export default function PageLayout({ children, activePage }) {
    const [sidebarOpen, setSidebarOpen] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('sidebarOpen');
            return saved !== null ? JSON.parse(saved) : true;
        }
        return true;
    });
    const [theme, setTheme] = useState('light');

    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('sidebarOpen', JSON.stringify(sidebarOpen));
        }
    }, [sidebarOpen]);

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') || 'light';
        setTheme(savedTheme);
        
        // Listen for theme changes
        const handleStorage = () => {
            setTheme(localStorage.getItem('theme') || 'light');
        };
        window.addEventListener('storage', handleStorage);
        
        // Poll for changes (for same-tab updates)
        const interval = setInterval(() => {
            const current = localStorage.getItem('theme') || 'light';
            if (current !== theme) setTheme(current);
        }, 100);
        
        return () => {
            window.removeEventListener('storage', handleStorage);
            clearInterval(interval);
        };
    }, [theme]);

    return (
        <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'inherit' }}>
            <Toaster position="bottom-right" />
            <Header 
                title={activePage} 
                sidebarOpen={sidebarOpen} 
                setSidebarOpen={setSidebarOpen}
                currentPage={activePage}
            />
            
            <div className="flex flex-1 overflow-hidden">
                <Sidebar 
                    isOpen={sidebarOpen} 
                    activePage={activePage} 
                    onClose={() => setSidebarOpen(false)} 
                />
                
                <main className="flex-1 overflow-auto">
                    {children}
                </main>
            </div>
            
            <Footer />
        </div>
    );
}