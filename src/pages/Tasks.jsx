import React, { useState, useMemo } from 'react';
import { ListTodo, Plus, Filter, CheckCircle2, Circle, Clock, AlertTriangle, X, ChevronDown } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const CATEGORIES = [
    { id: 'aihub', name: 'AI Hub', color: '#8B5CF6' },
    { id: 'searchpods', name: 'SearchPods', color: '#3B82F6' },
    { id: 'mindmap', name: 'MindMap', color: '#EC4899' },
    { id: 'intelligence', name: 'Intelligence', color: '#6366F1' },
    { id: 'geospatial', name: 'Geospatial', color: '#0EA5E9' },
    { id: 'markets', name: 'Markets', color: '#F59E0B' },
    { id: 'learning', name: 'Learning', color: '#10B981' },
    { id: 'notes', name: 'Notes', color: '#F97316' },
    { id: 'comms', name: 'Comms', color: '#06B6D4' },
    { id: 'games', name: 'Games', color: '#A855F7' },
    { id: 'feedback', name: 'Feedback/Bugs', color: '#EF4444' },
];

const PRIORITIES = [
    { id: 'high', name: 'High', color: '#EF4444' },
    { id: 'medium', name: 'Medium', color: '#F59E0B' },
    { id: 'low', name: 'Low', color: '#10B981' },
];

const STATUSES = [
    { id: 'todo', name: 'To Do', icon: Circle },
    { id: 'in-progress', name: 'In Progress', icon: Clock },
    { id: 'done', name: 'Done', icon: CheckCircle2 },
];

const SAMPLE_TASKS = [
    { id: 1, title: 'Implement voice commands', description: 'Add voice input for AI Hub', category: 'aihub', priority: 'high', status: 'in-progress' },
    { id: 2, title: 'Fix podcast playback', description: 'Resolve audio sync issues', category: 'searchpods', priority: 'high', status: 'todo' },
    { id: 3, title: 'Add export feature', description: 'Export mind maps to PDF', category: 'mindmap', priority: 'medium', status: 'todo' },
    { id: 4, title: 'Optimize data loading', description: 'Improve chart performance', category: 'intelligence', priority: 'medium', status: 'done' },
    { id: 5, title: 'Mobile responsive', description: 'Fix map display on mobile', category: 'geospatial', priority: 'low', status: 'in-progress' },
];

export default function Tasks() {
    const [tasks, setTasks] = useState(SAMPLE_TASKS);
    const [showAddModal, setShowAddModal] = useState(false);
    const [filterCategory, setFilterCategory] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');
    const [newTask, setNewTask] = useState({ title: '', description: '', category: 'aihub', priority: 'medium', status: 'todo' });

    const filteredTasks = useMemo(() => {
        return tasks.filter(task => {
            if (filterCategory !== 'all' && task.category !== filterCategory) return false;
            if (filterStatus !== 'all' && task.status !== filterStatus) return false;
            return true;
        });
    }, [tasks, filterCategory, filterStatus]);

    const addTask = () => {
        if (!newTask.title.trim()) return;
        setTasks(prev => [...prev, { ...newTask, id: Date.now() }]);
        setNewTask({ title: '', description: '', category: 'aihub', priority: 'medium', status: 'todo' });
        setShowAddModal(false);
    };

    const updateTaskStatus = (taskId, status) => {
        setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status } : t));
    };

    const deleteTask = (taskId) => {
        setTasks(prev => prev.filter(t => t.id !== taskId));
    };

    const getCategoryInfo = (id) => CATEGORIES.find(c => c.id === id) || { name: id, color: '#666' };
    const getPriorityInfo = (id) => PRIORITIES.find(p => p.id === id) || { name: id, color: '#666' };

    const tasksByStatus = useMemo(() => ({
        'todo': filteredTasks.filter(t => t.status === 'todo'),
        'in-progress': filteredTasks.filter(t => t.status === 'in-progress'),
        'done': filteredTasks.filter(t => t.status === 'done'),
    }), [filteredTasks]);

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-gradient-to-r from-violet-600 to-purple-600 rounded-2xl p-6 mb-6 text-white">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center">
                                <ListTodo className="w-7 h-7" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold">Tasks</h1>
                                <p className="text-white/80 text-sm">Track initiatives across all departments</p>
                            </div>
                        </div>
                        <Button onClick={() => setShowAddModal(true)} className="bg-white text-purple-600 hover:bg-white/90">
                            <Plus className="w-5 h-5 mr-2" /> Add Task
                        </Button>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-3 mb-6">
                    <Select value={filterCategory} onValueChange={setFilterCategory}>
                        <SelectTrigger className="w-40 bg-white">
                            <Filter className="w-4 h-4 mr-2 text-gray-500" />
                            <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            {CATEGORIES.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                        <SelectTrigger className="w-40 bg-white">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Statuses</SelectItem>
                            {STATUSES.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>

                {/* Kanban Board */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {STATUSES.map(status => {
                        const StatusIcon = status.icon;
                        return (
                            <div key={status.id} className="bg-white rounded-xl border border-gray-200 p-4">
                                <div className="flex items-center gap-2 mb-4">
                                    <StatusIcon className={`w-5 h-5 ${status.id === 'done' ? 'text-green-600' : status.id === 'in-progress' ? 'text-blue-600' : 'text-gray-400'}`} />
                                    <h3 className="font-semibold text-gray-900">{status.name}</h3>
                                    <span className="ml-auto text-sm text-gray-500">{tasksByStatus[status.id].length}</span>
                                </div>
                                <div className="space-y-3">
                                    {tasksByStatus[status.id].map(task => {
                                        const category = getCategoryInfo(task.category);
                                        const priority = getPriorityInfo(task.priority);
                                        return (
                                            <div key={task.id} className="bg-gray-50 rounded-lg p-3 border border-gray-100 hover:border-purple-200 transition-all">
                                                <div className="flex items-start justify-between mb-2">
                                                    <h4 className="font-medium text-gray-900 text-sm">{task.title}</h4>
                                                    <button onClick={() => deleteTask(task.id)} className="text-gray-400 hover:text-red-500">
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                                {task.description && <p className="text-xs text-gray-500 mb-2">{task.description}</p>}
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: `${category.color}20`, color: category.color }}>
                                                        {category.name}
                                                    </span>
                                                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: `${priority.color}20`, color: priority.color }}>
                                                        {priority.name}
                                                    </span>
                                                </div>
                                                <div className="mt-2 pt-2 border-t border-gray-200">
                                                    <Select value={task.status} onValueChange={(val) => updateTaskStatus(task.id, val)}>
                                                        <SelectTrigger className="h-7 text-xs">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {STATUSES.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    {tasksByStatus[status.id].length === 0 && (
                                        <div className="text-center py-8 text-gray-400 text-sm">No tasks</div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Add Task Modal */}
            <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add New Task</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 mt-4">
                        <Input placeholder="Task title" value={newTask.title} onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} />
                        <Textarea placeholder="Description (optional)" value={newTask.description} onChange={(e) => setNewTask({ ...newTask, description: e.target.value })} />
                        <div className="grid grid-cols-2 gap-4">
                            <Select value={newTask.category} onValueChange={(val) => setNewTask({ ...newTask, category: val })}>
                                <SelectTrigger><SelectValue placeholder="Category" /></SelectTrigger>
                                <SelectContent>
                                    {CATEGORIES.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            <Select value={newTask.priority} onValueChange={(val) => setNewTask({ ...newTask, priority: val })}>
                                <SelectTrigger><SelectValue placeholder="Priority" /></SelectTrigger>
                                <SelectContent>
                                    {PRIORITIES.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <Button onClick={addTask} className="w-full bg-purple-600 hover:bg-purple-700">Add Task</Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}