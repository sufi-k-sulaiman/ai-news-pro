import React, { useState, useEffect } from 'react';
import { 
    Plus, Filter, BarChart3, PieChart, Clock, CheckCircle2, 
    AlertCircle, Loader2, X, MessageSquare, Calendar,
    ChevronDown, Trash2, Edit2, Search
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import PageLayout from '../components/PageLayout';
import { PieChart as RechartsPC, Pie, Cell, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

const THEME = {
    primary: '#6B4EE6',
    secondary: '#8B5CF6',
};

const DEPARTMENTS = ['Governance', 'Health', 'Education', 'Infrastructure', 'Economy', 'Environment', 'Security', 'Technology'];
const STATUSES = ['Planning', 'In Progress', 'Completed', 'On Hold'];
const PRIORITIES = ['Low', 'Medium', 'High', 'Critical'];

const PRIORITY_COLORS = {
    Low: '#22C55E',
    Medium: '#F59E0B', 
    High: '#EF4444',
    Critical: '#DC2626'
};

const STATUS_COLORS = {
    Planning: '#9CA3AF',
    'In Progress': '#3B82F6',
    Completed: '#10B981',
    'On Hold': '#F59E0B'
};

// Sample task data
const SAMPLE_TASKS = [
    { id: 1, title: 'Digital Education Platform', description: 'Deploy nationwide e-learning system', department: 'Education', status: 'In Progress', priority: 'High', progress: 58, comments: 12, dueDate: '2025-03-15' },
    { id: 2, title: 'Healthcare IT Modernization', description: 'Upgrade electronic health records across hospitals', department: 'Health', status: 'In Progress', priority: 'Critical', progress: 65, comments: 8, dueDate: '2025-02-28' },
    { id: 3, title: 'Skills Training Initiative', description: 'Provide vocational training to 100K workers', department: 'Education', status: 'In Progress', priority: 'High', progress: 62, comments: 15, dueDate: '2025-04-01' },
    { id: 4, title: 'Mental Health Services Expansion', description: 'Open 20 new mental health clinics nationwide', department: 'Health', status: 'In Progress', priority: 'Critical', progress: 55, comments: 6, dueDate: '2025-05-01' },
    { id: 5, title: 'Government Portal Redesign', description: 'Modernize citizen services portal', department: 'Governance', status: 'Planning', priority: 'Medium', progress: 15, comments: 4, dueDate: '2025-06-15' },
    { id: 6, title: 'Green Energy Transition', description: 'Implement renewable energy in public buildings', department: 'Environment', status: 'In Progress', priority: 'High', progress: 42, comments: 9, dueDate: '2025-07-01' },
    { id: 7, title: 'Cybersecurity Enhancement', description: 'Strengthen national cybersecurity infrastructure', department: 'Security', status: 'In Progress', priority: 'Critical', progress: 38, comments: 7, dueDate: '2025-03-30' },
    { id: 8, title: 'Public Transit Upgrade', description: 'Modernize bus and rail systems', department: 'Infrastructure', status: 'Planning', priority: 'Medium', progress: 8, comments: 3, dueDate: '2025-08-01' },
    { id: 9, title: 'Economic Recovery Program', description: 'Support small businesses post-pandemic', department: 'Economy', status: 'Completed', priority: 'High', progress: 100, comments: 22, dueDate: '2025-01-15' },
    { id: 10, title: 'AI Integration Strategy', description: 'Develop AI adoption framework for government', department: 'Technology', status: 'In Progress', priority: 'High', progress: 28, comments: 11, dueDate: '2025-09-01' },
];

export default function Tasks() {
    const [tasks, setTasks] = useState(SAMPLE_TASKS);
    const [filteredTasks, setFilteredTasks] = useState(SAMPLE_TASKS);
    const [filterDepartment, setFilterDepartment] = useState('All');
    const [filterStatus, setFilterStatus] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [showNewTaskModal, setShowNewTaskModal] = useState(false);
    const [newTask, setNewTask] = useState({
        title: '', description: '', department: 'Governance', status: 'Planning', priority: 'Medium', progress: 0
    });

    // Filter tasks
    useEffect(() => {
        let result = [...tasks];
        if (filterDepartment !== 'All') {
            result = result.filter(t => t.department === filterDepartment);
        }
        if (filterStatus !== 'All') {
            result = result.filter(t => t.status === filterStatus);
        }
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            result = result.filter(t => 
                t.title.toLowerCase().includes(q) || 
                t.description.toLowerCase().includes(q)
            );
        }
        setFilteredTasks(result);
    }, [tasks, filterDepartment, filterStatus, searchQuery]);

    // Group tasks by department
    const tasksByDepartment = DEPARTMENTS.reduce((acc, dept) => {
        acc[dept] = filteredTasks.filter(t => t.department === dept);
        return acc;
    }, {});

    // Calculate stats
    const stats = {
        total: tasks.length,
        completed: tasks.filter(t => t.status === 'Completed').length,
        inProgress: tasks.filter(t => t.status === 'In Progress').length,
        avgProgress: Math.round(tasks.reduce((a, t) => a + t.progress, 0) / tasks.length)
    };

    // Chart data
    const statusData = STATUSES.map(status => ({
        name: status,
        value: tasks.filter(t => t.status === status).length,
        color: STATUS_COLORS[status]
    })).filter(d => d.value > 0);

    const deptProgressData = DEPARTMENTS.map(dept => {
        const deptTasks = tasks.filter(t => t.department === dept);
        return {
            name: dept.slice(0, 4),
            progress: deptTasks.length ? Math.round(deptTasks.reduce((a, t) => a + t.progress, 0) / deptTasks.length) : 0
        };
    });

    const handleCreateTask = () => {
        const task = {
            ...newTask,
            id: Date.now(),
            comments: 0,
            dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        };
        setTasks([...tasks, task]);
        setShowNewTaskModal(false);
        setNewTask({ title: '', description: '', department: 'Governance', status: 'Planning', priority: 'Medium', progress: 0 });
    };

    const handleDeleteTask = (id) => {
        setTasks(tasks.filter(t => t.id !== id));
    };

    return (
        <PageLayout activePage="Tasks" showSearch={false}>
            <div className="min-h-screen bg-gray-50 p-4 md:p-6">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Task Management</h1>
                            <p className="text-gray-500">Track {stats.total} initiatives across all departments</p>
                        </div>
                        <Button onClick={() => setShowNewTaskModal(true)} className="bg-purple-600 hover:bg-purple-700 gap-2">
                            <Plus className="w-4 h-4" /> New Task
                        </Button>
                    </div>

                    {/* Stats & Charts Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
                        {/* Department Progress Chart */}
                        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                            <div className="flex items-center gap-2 mb-4">
                                <BarChart3 className="w-5 h-5 text-purple-600" />
                                <h3 className="font-semibold text-gray-900">Department Progress</h3>
                            </div>
                            <ResponsiveContainer width="100%" height={180}>
                                <AreaChart data={deptProgressData}>
                                    <defs>
                                        <linearGradient id="progressGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11 }} domain={[0, 100]} />
                                    <Tooltip />
                                    <Area type="monotone" dataKey="progress" stroke="#8B5CF6" strokeWidth={2} fill="url(#progressGradient)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Status Distribution */}
                        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                            <div className="flex items-center gap-2 mb-4">
                                <PieChart className="w-5 h-5 text-purple-600" />
                                <h3 className="font-semibold text-gray-900">Status Distribution</h3>
                            </div>
                            <ResponsiveContainer width="100%" height={150}>
                                <RechartsPC>
                                    <Pie data={statusData} cx="50%" cy="50%" innerRadius={35} outerRadius={55} dataKey="value">
                                        {statusData.map((entry, i) => (
                                            <Cell key={i} fill={entry.color} />
                                        ))}
                                    </Pie>
                                </RechartsPC>
                            </ResponsiveContainer>
                            <div className="flex flex-wrap justify-center gap-3 mt-2">
                                {statusData.map((s, i) => (
                                    <div key={i} className="flex items-center gap-1 text-xs">
                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
                                        <span className="text-gray-600">{s.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="flex flex-wrap gap-3 mb-6">
                        <div className="relative flex-1 min-w-[200px] max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input 
                                placeholder="Search tasks..." 
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                        <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                            <SelectTrigger className="w-[160px]">
                                <SelectValue placeholder="Department" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="All">All Departments</SelectItem>
                                {DEPARTMENTS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        <Select value={filterStatus} onValueChange={setFilterStatus}>
                            <SelectTrigger className="w-[140px]">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="All">All Statuses</SelectItem>
                                {STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Task Columns by Department */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {DEPARTMENTS.filter(dept => tasksByDepartment[dept]?.length > 0).map(dept => (
                            <div key={dept} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                                <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                                    <h3 className="font-semibold text-gray-900">{dept}</h3>
                                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-medium">
                                        {tasksByDepartment[dept].length}
                                    </span>
                                </div>
                                <div className="p-3 space-y-3 max-h-[500px] overflow-y-auto">
                                    {tasksByDepartment[dept].map(task => (
                                        <div key={task.id} className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors">
                                            <div className="flex items-start justify-between gap-2">
                                                <h4 className="font-medium text-gray-900 text-sm leading-tight">{task.title}</h4>
                                                <button onClick={() => handleDeleteTask(task.id)} className="text-gray-400 hover:text-red-500">
                                                    <X className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">{task.description}</p>
                                            
                                            {/* Progress */}
                                            <div className="mt-2">
                                                <div className="flex justify-between text-xs text-gray-500 mb-1">
                                                    <span>Progress</span>
                                                    <span>{task.progress}%</span>
                                                </div>
                                                <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                                    <div 
                                                        className="h-full rounded-full bg-purple-500 transition-all"
                                                        style={{ width: `${task.progress}%` }}
                                                    />
                                                </div>
                                            </div>
                                            
                                            {/* Tags */}
                                            <div className="flex flex-wrap gap-1.5 mt-2">
                                                <span 
                                                    className="text-[10px] px-1.5 py-0.5 rounded font-medium text-white"
                                                    style={{ backgroundColor: PRIORITY_COLORS[task.priority] }}
                                                >
                                                    {task.priority}
                                                </span>
                                                <span 
                                                    className="text-[10px] px-1.5 py-0.5 rounded font-medium"
                                                    style={{ backgroundColor: `${STATUS_COLORS[task.status]}20`, color: STATUS_COLORS[task.status] }}
                                                >
                                                    {task.status}
                                                </span>
                                            </div>
                                            
                                            {/* Meta */}
                                            <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                                                <span className="flex items-center gap-1">
                                                    <MessageSquare className="w-3 h-3" /> {task.comments}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" /> {task.dueDate}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {filteredTasks.length === 0 && (
                        <div className="text-center py-20">
                            <CheckCircle2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500">No tasks found matching your filters</p>
                        </div>
                    )}
                </div>
            </div>

            {/* New Task Modal */}
            <Dialog open={showNewTaskModal} onOpenChange={setShowNewTaskModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create New Task</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 mt-4">
                        <Input 
                            placeholder="Task title"
                            value={newTask.title}
                            onChange={e => setNewTask({...newTask, title: e.target.value})}
                        />
                        <Textarea 
                            placeholder="Description"
                            value={newTask.description}
                            onChange={e => setNewTask({...newTask, description: e.target.value})}
                        />
                        <div className="grid grid-cols-2 gap-3">
                            <Select value={newTask.department} onValueChange={v => setNewTask({...newTask, department: v})}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {DEPARTMENTS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            <Select value={newTask.priority} onValueChange={v => setNewTask({...newTask, priority: v})}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {PRIORITIES.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <Button onClick={handleCreateTask} disabled={!newTask.title} className="w-full bg-purple-600 hover:bg-purple-700">
                            Create Task
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </PageLayout>
    );
}