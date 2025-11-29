import React from 'react';
import { Link } from 'react-router-dom';
import { menuItems } from '../NavigationConfig';

export default function Sidebar({ isOpen, activePage, onClose }) {
    // Only close on mobile when clicking overlay or a menu item
    const handleMobileClose = () => {
        if (window.innerWidth < 768) {
            onClose();
        }
    };

    return (
        <>
            {isOpen && <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={onClose} />}
            <aside className={`${isOpen ? 'w-56 translate-x-0' : 'w-0 -translate-x-full md:translate-x-0'} transition-all duration-300 overflow-y-auto overflow-x-hidden bg-white border-r border-gray-200 flex-shrink-0 fixed md:relative z-50 md:z-auto h-[calc(100vh-72px)] md:h-auto`}>
                <nav className="p-2 space-y-0.5">
                    {menuItems.map((item, index) => (
                        <Link
                            key={index}
                            to={item.href}
                            onClick={handleMobileClose}
                            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors text-sm ${
                                item.label === activePage
                                    ? 'bg-purple-100 text-purple-700'
                                    : 'text-gray-700 hover:bg-purple-50 hover:text-purple-600'
                            }`}
                        >
                            <item.icon className="w-4 h-4 text-purple-600" />
                            <span className="font-medium">{item.label}</span>
                        </Link>
                    ))}
                </nav>
            </aside>
        </>
    );
}