// All subjects organized by category
export const SUBJECTS = [
    // Natural Sciences
    { id: 'astronomy', name: 'Astronomy', category: 'Natural Sciences', color: '#1E3A8A', icon: 'Telescope' },
    { id: 'geology', name: 'Geology', category: 'Natural Sciences', color: '#92400E', icon: 'Mountain' },
    { id: 'oceanography', name: 'Oceanography', category: 'Natural Sciences', color: '#0891B2', icon: 'Waves' },
    { id: 'meteorology', name: 'Meteorology', category: 'Natural Sciences', color: '#7C3AED', icon: 'Cloud' },
    { id: 'ecology', name: 'Ecology', category: 'Natural Sciences', color: '#059669', icon: 'TreePine' },
    
    // Life Sciences
    { id: 'zoology', name: 'Zoology', category: 'Life Sciences', color: '#B45309', icon: 'Bug' },
    { id: 'botany', name: 'Botany', category: 'Life Sciences', color: '#16A34A', icon: 'Flower2' },
    { id: 'microbiology', name: 'Microbiology', category: 'Life Sciences', color: '#DC2626', icon: 'Microscope' },
    { id: 'genetics', name: 'Genetics', category: 'Life Sciences', color: '#9333EA', icon: 'Dna' },
    { id: 'neuroscience', name: 'Neuroscience', category: 'Life Sciences', color: '#EC4899', icon: 'Brain' },
    
    // Health Sciences
    { id: 'pharmacology', name: 'Pharmacology', category: 'Health Sciences', color: '#0D9488', icon: 'Pill' },
    { id: 'dentistry', name: 'Dentistry', category: 'Health Sciences', color: '#64748B', icon: 'Smile' },
    { id: 'veterinary', name: 'Veterinary Medicine', category: 'Health Sciences', color: '#EA580C', icon: 'Heart' },
    { id: 'publichealth', name: 'Public Health', category: 'Health Sciences', color: '#2563EB', icon: 'Activity' },
    { id: 'epidemiology', name: 'Epidemiology', category: 'Health Sciences', color: '#7C2D12', icon: 'LineChart' },
    { id: 'nursing', name: 'Nursing', category: 'Health Sciences', color: '#DB2777', icon: 'Stethoscope' },
    { id: 'kinesiology', name: 'Kinesiology', category: 'Health Sciences', color: '#4F46E5', icon: 'Footprints' },
    { id: 'sportsscience', name: 'Sports Science', category: 'Health Sciences', color: '#F97316', icon: 'Dumbbell' },
    
    // Engineering
    { id: 'architecture', name: 'Architecture', category: 'Engineering', color: '#78716C', icon: 'Building' },
    { id: 'civileng', name: 'Civil Engineering', category: 'Engineering', color: '#57534E', icon: 'HardHat' },
    { id: 'mecheng', name: 'Mechanical Engineering', category: 'Engineering', color: '#3B82F6', icon: 'Cog' },
    { id: 'eleceng', name: 'Electrical Engineering', category: 'Engineering', color: '#FBBF24', icon: 'Zap' },
    { id: 'chemeng', name: 'Chemical Engineering', category: 'Engineering', color: '#A855F7', icon: 'FlaskConical' },
    { id: 'aeroeng', name: 'Aerospace Engineering', category: 'Engineering', color: '#0EA5E9', icon: 'Rocket' },
    { id: 'indeng', name: 'Industrial Engineering', category: 'Engineering', color: '#6366F1', icon: 'Factory' },
    { id: 'enveng', name: 'Environmental Engineering', category: 'Engineering', color: '#22C55E', icon: 'Leaf' },
    
    // Computer & Data Sciences
    { id: 'cs', name: 'Computer Science', category: 'Computer & Data', color: '#3B82F6', icon: 'Monitor' },
    { id: 'softeng', name: 'Software Engineering', category: 'Computer & Data', color: '#8B5CF6', icon: 'Code' },
    { id: 'infosys', name: 'Information Systems', category: 'Computer & Data', color: '#14B8A6', icon: 'Database' },
    { id: 'ai', name: 'Artificial Intelligence', category: 'Computer & Data', color: '#6366F1', icon: 'Bot' },
    { id: 'ml', name: 'Machine Learning', category: 'Computer & Data', color: '#EC4899', icon: 'BrainCircuit' },
    { id: 'dataeng', name: 'Data Engineering', category: 'Computer & Data', color: '#F59E0B', icon: 'HardDrive' },
    { id: 'statistics', name: 'Statistics', category: 'Computer & Data', color: '#10B981', icon: 'BarChart3' },
    { id: 'opsresearch', name: 'Operations Research', category: 'Computer & Data', color: '#EF4444', icon: 'Network' },
    
    // Social Sciences
    { id: 'economics', name: 'Economics', category: 'Social Sciences', color: '#059669', icon: 'TrendingUp' },
    { id: 'polisci', name: 'Political Science', category: 'Social Sciences', color: '#DC2626', icon: 'Landmark' },
    { id: 'sociology', name: 'Sociology', category: 'Social Sciences', color: '#7C3AED', icon: 'Users' },
    { id: 'psychology', name: 'Psychology', category: 'Social Sciences', color: '#2563EB', icon: 'Brain' },
    { id: 'anthropology', name: 'Anthropology', category: 'Social Sciences', color: '#B45309', icon: 'Skull' },
    { id: 'archaeology', name: 'Archaeology', category: 'Social Sciences', color: '#78716C', icon: 'Shovel' },
    
    // Humanities
    { id: 'history', name: 'History', category: 'Humanities', color: '#92400E', icon: 'BookOpen' },
    { id: 'philosophy', name: 'Philosophy', category: 'Humanities', color: '#6B7280', icon: 'Lightbulb' },
    { id: 'ethics', name: 'Ethics', category: 'Humanities', color: '#4F46E5', icon: 'Scale' },
    { id: 'theology', name: 'Theology', category: 'Humanities', color: '#7C2D12', icon: 'Church' },
    { id: 'linguistics', name: 'Linguistics', category: 'Humanities', color: '#0891B2', icon: 'Languages' },
    { id: 'literature', name: 'Literature', category: 'Humanities', color: '#9333EA', icon: 'BookText' },
    
    // Arts
    { id: 'creativewriting', name: 'Creative Writing', category: 'Arts', color: '#EC4899', icon: 'PenTool' },
    { id: 'performingarts', name: 'Performing Arts', category: 'Arts', color: '#F43F5E', icon: 'Drama' },
    { id: 'visualarts', name: 'Visual Arts', category: 'Arts', color: '#8B5CF6', icon: 'Palette' },
    { id: 'music', name: 'Music', category: 'Arts', color: '#06B6D4', icon: 'Music' },
    { id: 'filmstudies', name: 'Film Studies', category: 'Arts', color: '#1E293B', icon: 'Film' },
    
    // Business & Management
    { id: 'marketing', name: 'Marketing', category: 'Business', color: '#E11D48', icon: 'TrendingUp' },
    { id: 'finance', name: 'Finance', category: 'Business', color: '#059669', icon: 'BarChart3' },
    { id: 'accounting', name: 'Accounting', category: 'Business', color: '#0891B2', icon: 'Scale' },
    { id: 'management', name: 'Management', category: 'Business', color: '#7C3AED', icon: 'Users' },
    { id: 'entrepreneurship', name: 'Entrepreneurship', category: 'Business', color: '#F59E0B', icon: 'Rocket' },
    
    // Mathematics
    { id: 'calculus', name: 'Calculus', category: 'Mathematics', color: '#3B82F6', icon: 'TrendingUp' },
    { id: 'algebra', name: 'Algebra', category: 'Mathematics', color: '#8B5CF6', icon: 'Code' },
    { id: 'geometry', name: 'Geometry', category: 'Mathematics', color: '#10B981', icon: 'Network' },
    { id: 'probability', name: 'Probability', category: 'Mathematics', color: '#EC4899', icon: 'BarChart3' },
    
    // Languages
    { id: 'spanish', name: 'Spanish', category: 'Languages', color: '#DC2626', icon: 'Languages' },
    { id: 'french', name: 'French', category: 'Languages', color: '#2563EB', icon: 'Languages' },
    { id: 'german', name: 'German', category: 'Languages', color: '#F59E0B', icon: 'Languages' },
    { id: 'mandarin', name: 'Mandarin', category: 'Languages', color: '#EF4444', icon: 'Languages' },
    { id: 'japanese', name: 'Japanese', category: 'Languages', color: '#EC4899', icon: 'Languages' },
    
    // Law & Politics
    { id: 'law', name: 'Law', category: 'Law & Politics', color: '#1E293B', icon: 'Scale' },
    { id: 'intrelations', name: 'International Relations', category: 'Law & Politics', color: '#0D9488', icon: 'Landmark' },
    { id: 'publicpolicy', name: 'Public Policy', category: 'Law & Politics', color: '#6366F1', icon: 'Landmark' },
    
    // Communication
    { id: 'journalism', name: 'Journalism', category: 'Communication', color: '#64748B', icon: 'BookText' },
    { id: 'publicrelations', name: 'Public Relations', category: 'Communication', color: '#A855F7', icon: 'Users' },
    { id: 'mediaproduction', name: 'Media Production', category: 'Communication', color: '#F43F5E', icon: 'Film' },
];

export const CATEGORIES = [...new Set(SUBJECTS.map(s => s.category))];

export const getSubjectsByCategory = (category) => SUBJECTS.filter(s => s.category === category);