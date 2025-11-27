import { 
    Home, Search, BookOpen, Settings, BarChart3, FileText, MessageSquare,
    Brain, TrendingUp, Globe, Gamepad2, Users, Mail, Phone, Scale, Cookie, FileCheck
} from 'lucide-react';

export const LOGO_URL = 'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=100&h=100&fit=crop';

export const menuItems = [
    { label: 'Home', page: 'Home', icon: Home },
    { label: 'AI Hub', page: 'AIHub', icon: Brain },
    { label: 'SearchPods', page: 'SearchPods', icon: Search },
    { label: 'MindMap', page: 'MindMap', icon: BookOpen },
    { label: 'Intelligence', page: 'Intelligence', icon: TrendingUp },
    { label: 'Geospatial', page: 'Geospatial', icon: Globe },
    { label: 'Markets', page: 'Markets', icon: BarChart3 },
    { label: 'Learning', page: 'Learning', icon: BookOpen },
    { label: 'Resume Builder', page: 'ResumeBuilder', icon: FileText },
    { label: 'Tasks', page: 'Tasks', icon: FileText },
    { label: 'Notes', page: 'Notes', icon: FileText },
    { label: 'Comms', page: 'Comms', icon: MessageSquare },
    { label: 'Games', page: 'Games', icon: Gamepad2 },
    { label: 'Settings', page: 'Settings', icon: Settings },
];

export const footerLinks = [
    { label: 'Contact Us', page: 'ContactUs' },
    { label: 'Teams', page: 'Teams' },
    { label: 'Governance', page: 'Governance' },
    { label: 'Terms of Use', page: 'TermsOfUse' },
    { label: 'Cookie Policy', page: 'CookiePolicy' },
];