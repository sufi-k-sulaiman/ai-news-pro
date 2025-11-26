import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { base44 } from '@/api/base44Client';
import { 
    X, Play, CheckCircle, Lock, Star, Trophy, Zap, Clock, 
    BookOpen, Video, FileText, HelpCircle, Award, Target,
    ChevronRight, Flame, Medal, Gift, Sparkles, Loader2,
    ArrowRight, RotateCcw, Check
} from 'lucide-react';

// Theme colors
const THEME = {
    primary: '#6B4EE6',
    secondary: '#8B5CF6',
    accent: '#F59E0B',
    success: '#10B981',
    gradient: 'from-purple-600 via-indigo-600 to-blue-600'
};

// Unit card with generated image
const CourseUnit = ({ unit, index, isUnlocked, isCurrent, onStartLesson, completedLessons, topicColor }) => {
    const [expanded, setExpanded] = useState(isCurrent);
    const completedCount = unit.lessons?.filter(l => completedLessons.includes(l.id))?.length || 0;
    const totalLessons = unit.lessons?.length || 0;
    const progress = totalLessons > 0 ? (completedCount / totalLessons) * 100 : 0;
    const isComplete = progress === 100;
    
    useEffect(() => {
        if (isCurrent) setExpanded(true);
    }, [isCurrent]);
    
    return (
        <div className={`rounded-2xl overflow-hidden transition-all ${
            isCurrent ? 'ring-2 ring-offset-2' : ''
        } ${isUnlocked ? 'bg-white shadow-md' : 'bg-gray-50 opacity-60'}`}
        style={{ ringColor: topicColor }}>
            {/* Unit header with image */}
            <div className="relative">
                {/* Generated image placeholder with gradient */}
                <div 
                    className="h-32 bg-gradient-to-br relative overflow-hidden"
                    style={{ 
                        background: `linear-gradient(135deg, ${topicColor}dd 0%, ${topicColor}88 50%, ${THEME.secondary}66 100%)`
                    }}
                >
                    {unit.imageUrl ? (
                        <img src={unit.imageUrl} alt={unit.title} className="w-full h-full object-cover opacity-80" />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-white/30 text-6xl font-bold">{index + 1}</div>
                        </div>
                    )}
                    
                    {/* Unit number badge */}
                    <div 
                        className="absolute top-3 left-3 w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-lg"
                        style={{ backgroundColor: isComplete ? THEME.success : topicColor }}
                    >
                        {isComplete ? <CheckCircle className="w-5 h-5" /> : index + 1}
                    </div>
                    
                    {/* Lock overlay */}
                    {!isUnlocked && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <Lock className="w-8 h-8 text-white/70" />
                        </div>
                    )}
                    
                    {/* XP reward */}
                    <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-amber-400 rounded-full text-xs font-bold text-amber-900">
                        <Zap className="w-3 h-3" />
                        {unit.xp || 200} XP
                    </div>
                </div>
                
                {/* Progress bar */}
                <div className="h-1 bg-gray-200">
                    <div 
                        className="h-full transition-all duration-500"
                        style={{ width: `${progress}%`, backgroundColor: topicColor }}
                    />
                </div>
            </div>
            
            {/* Unit info */}
            <button
                onClick={() => isUnlocked && setExpanded(!expanded)}
                className={`w-full p-4 text-left ${isUnlocked ? 'hover:bg-gray-50' : ''}`}
                disabled={!isUnlocked}
            >
                <h4 className="font-bold text-gray-800 text-lg">{unit.title}</h4>
                <p className="text-sm text-gray-500 mt-1">{unit.description}</p>
                <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                        <BookOpen className="w-3 h-3" /> {totalLessons} lessons
                    </span>
                    <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {unit.duration || '45 min'}
                    </span>
                    <span className="flex items-center gap-1" style={{ color: topicColor }}>
                        <Target className="w-3 h-3" /> {completedCount}/{totalLessons} done
                    </span>
                </div>
            </button>
            
            {/* Lessons list */}
            {expanded && isUnlocked && (
                <div className="border-t border-gray-100 bg-gray-50/50 px-4 pb-4">
                    {unit.lessons?.map((lesson, i) => {
                        const isCompleted = completedLessons.includes(lesson.id);
                        const prevCompleted = i === 0 || completedLessons.includes(unit.lessons[i-1]?.id);
                        const lessonUnlocked = prevCompleted;
                        
                        return (
                            <div 
                                key={lesson.id}
                                className={`flex items-center gap-3 py-3 border-b border-gray-100 last:border-0 ${
                                    lessonUnlocked && !isCompleted ? 'cursor-pointer hover:bg-white rounded-lg px-2 -mx-2' : ''
                                } ${!lessonUnlocked ? 'opacity-40' : ''}`}
                                onClick={() => lessonUnlocked && !isCompleted && onStartLesson(lesson, unit)}
                            >
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                    isCompleted ? 'bg-emerald-100 text-emerald-600' : 
                                    lessonUnlocked ? '' : 'bg-gray-100 text-gray-400'
                                }`} style={{ backgroundColor: lessonUnlocked && !isCompleted ? `${topicColor}20` : undefined, color: lessonUnlocked && !isCompleted ? topicColor : undefined }}>
                                    {isCompleted ? <CheckCircle className="w-4 h-4" /> : 
                                     !lessonUnlocked ? <Lock className="w-3 h-3" /> :
                                     lesson.type === 'video' ? <Video className="w-4 h-4" /> :
                                     lesson.type === 'quiz' ? <HelpCircle className="w-4 h-4" /> :
                                     <FileText className="w-4 h-4" />}
                                </div>
                                <div className="flex-1">
                                    <p className={`text-sm font-medium ${isCompleted ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                                        {lesson.title}
                                    </p>
                                    <p className="text-xs text-gray-400">{lesson.duration || '5 min'}</p>
                                </div>
                                {lessonUnlocked && !isCompleted && (
                                    <div className="flex items-center gap-1 text-xs font-medium" style={{ color: THEME.accent }}>
                                        <Zap className="w-3 h-3" />
                                        +{lesson.xp || 25}
                                    </div>
                                )}
                                {isCompleted && (
                                    <Check className="w-4 h-4 text-emerald-500" />
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

// Achievement badge
const AchievementBadge = ({ achievement, earned, color }) => (
    <div className={`flex flex-col items-center gap-1 p-3 rounded-xl ${earned ? 'bg-amber-50' : 'bg-gray-50 opacity-50'}`}>
        <div className={`w-14 h-14 rounded-full flex items-center justify-center ${
            earned ? 'bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg' : 'bg-gray-200'
        }`}>
            {achievement.icon === 'star' && <Star className="w-7 h-7 text-white" />}
            {achievement.icon === 'trophy' && <Trophy className="w-7 h-7 text-white" />}
            {achievement.icon === 'flame' && <Flame className="w-7 h-7 text-white" />}
            {achievement.icon === 'medal' && <Medal className="w-7 h-7 text-white" />}
            {achievement.icon === 'gift' && <Gift className="w-7 h-7 text-white" />}
        </div>
        <span className="text-xs font-medium text-gray-700 text-center">{achievement.name}</span>
        {earned && <span className="text-[10px] text-amber-600">Earned!</span>}
    </div>
);

// Lesson content modal
const LessonModal = ({ lesson, unit, topic, onComplete, onClose }) => {
    const [content, setContent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quizAnswers, setQuizAnswers] = useState({});
    const [showResults, setShowResults] = useState(false);

    useEffect(() => {
        generateLessonContent();
    }, [lesson]);

    const generateLessonContent = async () => {
        setLoading(true);
        try {
            const response = await base44.integrations.Core.InvokeLLM({
                prompt: `Create detailed lesson content for "${lesson.title}" which is part of the unit "${unit.title}" in the subject "${topic.name}".
                
                ${lesson.type === 'quiz' ? 
                    'Generate 5 multiple choice questions with 4 options each. Include the correct answer index (0-3).' :
                    'Generate comprehensive educational content with key concepts, examples, and summary points.'
                }`,
                add_context_from_internet: true,
                response_json_schema: {
                    type: "object",
                    properties: {
                        title: { type: "string" },
                        introduction: { type: "string" },
                        content: { type: "string" },
                        keyPoints: { type: "array", items: { type: "string" } },
                        examples: { type: "array", items: { type: "string" } },
                        quiz: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    question: { type: "string" },
                                    options: { type: "array", items: { type: "string" } },
                                    correctIndex: { type: "number" }
                                }
                            }
                        },
                        summary: { type: "string" }
                    }
                }
            });
            setContent(response);
        } catch (error) {
            console.error('Error generating lesson:', error);
            setContent({
                title: lesson.title,
                introduction: 'Welcome to this lesson.',
                content: 'Lesson content is being prepared...',
                keyPoints: ['Key concept 1', 'Key concept 2', 'Key concept 3'],
                summary: 'Great job completing this lesson!'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleQuizSubmit = () => {
        setShowResults(true);
    };

    const getQuizScore = () => {
        if (!content?.quiz) return 0;
        let correct = 0;
        content.quiz.forEach((q, i) => {
            if (quizAnswers[i] === q.correctIndex) correct++;
        });
        return Math.round((correct / content.quiz.length) * 100);
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="p-4 border-b flex items-center justify-between" style={{ backgroundColor: `${topic.color}10` }}>
                    <div>
                        <p className="text-xs font-medium" style={{ color: topic.color }}>{unit.title}</p>
                        <h3 className="font-bold text-gray-800">{lesson.title}</h3>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 px-3 py-1 bg-amber-100 rounded-full text-sm font-bold text-amber-700">
                            <Zap className="w-4 h-4" />
                            +{lesson.xp || 25} XP
                        </div>
                        <Button variant="ghost" size="icon" onClick={onClose}>
                            <X className="w-5 h-5" />
                        </Button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <Loader2 className="w-10 h-10 animate-spin mb-3" style={{ color: topic.color }} />
                            <p className="text-gray-500">Preparing your lesson...</p>
                        </div>
                    ) : lesson.type === 'quiz' && content?.quiz ? (
                        <div className="space-y-6">
                            {content.quiz.map((q, qIndex) => (
                                <div key={qIndex} className="p-4 bg-gray-50 rounded-xl">
                                    <p className="font-medium text-gray-800 mb-3">{qIndex + 1}. {q.question}</p>
                                    <div className="space-y-2">
                                        {q.options.map((opt, oIndex) => {
                                            const isSelected = quizAnswers[qIndex] === oIndex;
                                            const isCorrect = showResults && q.correctIndex === oIndex;
                                            const isWrong = showResults && isSelected && q.correctIndex !== oIndex;
                                            
                                            return (
                                                <button
                                                    key={oIndex}
                                                    onClick={() => !showResults && setQuizAnswers({ ...quizAnswers, [qIndex]: oIndex })}
                                                    disabled={showResults}
                                                    className={`w-full p-3 rounded-lg text-left text-sm transition-all ${
                                                        isCorrect ? 'bg-emerald-100 border-2 border-emerald-500 text-emerald-700' :
                                                        isWrong ? 'bg-red-100 border-2 border-red-500 text-red-700' :
                                                        isSelected ? 'border-2 text-white' : 'bg-white border border-gray-200 hover:border-gray-300'
                                                    }`}
                                                    style={isSelected && !showResults ? { backgroundColor: topic.color, borderColor: topic.color } : undefined}
                                                >
                                                    {opt}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                            
                            {showResults && (
                                <div className="p-6 rounded-xl text-center" style={{ backgroundColor: `${topic.color}10` }}>
                                    <div className="text-4xl font-bold mb-2" style={{ color: topic.color }}>{getQuizScore()}%</div>
                                    <p className="text-gray-600">
                                        {getQuizScore() >= 70 ? "Great job! You've mastered this material!" : "Keep practicing to improve your score!"}
                                    </p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="prose prose-sm max-w-none">
                            <p className="text-lg text-gray-600 mb-6">{content?.introduction}</p>
                            
                            <div className="whitespace-pre-wrap text-gray-700 mb-6">{content?.content}</div>
                            
                            {content?.keyPoints?.length > 0 && (
                                <div className="p-4 rounded-xl mb-6" style={{ backgroundColor: `${topic.color}10` }}>
                                    <h4 className="font-bold mb-3" style={{ color: topic.color }}>Key Points</h4>
                                    <ul className="space-y-2">
                                        {content.keyPoints.map((point, i) => (
                                            <li key={i} className="flex items-start gap-2">
                                                <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: topic.color }} />
                                                <span className="text-gray-700">{point}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            
                            {content?.summary && (
                                <div className="p-4 bg-gray-50 rounded-xl">
                                    <h4 className="font-bold text-gray-700 mb-2">Summary</h4>
                                    <p className="text-gray-600">{content.summary}</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t bg-gray-50 flex items-center justify-between">
                    <Button variant="outline" onClick={onClose}>
                        <X className="w-4 h-4 mr-2" /> Close
                    </Button>
                    
                    {lesson.type === 'quiz' && !showResults ? (
                        <Button 
                            onClick={handleQuizSubmit}
                            disabled={Object.keys(quizAnswers).length < (content?.quiz?.length || 0)}
                            style={{ backgroundColor: topic.color }}
                            className="text-white"
                        >
                            Submit Quiz <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    ) : (
                        <Button 
                            onClick={onComplete}
                            style={{ backgroundColor: topic.color }}
                            className="text-white"
                        >
                            <CheckCircle className="w-4 h-4 mr-2" /> Complete & Continue
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default function CourseModal({ isOpen, onClose, topic, onComplete }) {
    const [activeTab, setActiveTab] = useState('curriculum');
    const [courseData, setCourseData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [completedLessons, setCompletedLessons] = useState([]);
    const [userXP, setUserXP] = useState(0);
    const [currentLesson, setCurrentLesson] = useState(null);
    const [currentUnit, setCurrentUnit] = useState(null);
    const [showLessonModal, setShowLessonModal] = useState(false);
    const [earnedAchievements, setEarnedAchievements] = useState([]);

    useEffect(() => {
        if (isOpen && topic) {
            setCompletedLessons([]);
            setUserXP(0);
            setEarnedAchievements([]);
            setCourseData(null);
            generateCourseContent();
        }
    }, [isOpen, topic]);

    const generateCourseContent = async () => {
        if (!topic) return;
        setLoading(true);
        try {
            // Generate curriculum
            const response = await base44.integrations.Core.InvokeLLM({
                prompt: `Create a comprehensive, professional course curriculum for "${topic.name}".
                
                Structure it like courses on Coursera, Udemy, or Khan Academy:
                - 5 progressive units/modules
                - Each unit has 4-6 lessons (mix of video lectures, readings, and quizzes)
                - Include estimated duration for each
                - Make it engaging and practical
                - Progress from beginner to advanced concepts`,
                add_context_from_internet: true,
                response_json_schema: {
                    type: "object",
                    properties: {
                        title: { type: "string" },
                        description: { type: "string" },
                        totalDuration: { type: "string" },
                        difficulty: { type: "string" },
                        instructor: { type: "string" },
                        learningOutcomes: { type: "array", items: { type: "string" } },
                        units: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    title: { type: "string" },
                                    description: { type: "string" },
                                    duration: { type: "string" },
                                    xp: { type: "number" },
                                    lessons: {
                                        type: "array",
                                        items: {
                                            type: "object",
                                            properties: {
                                                id: { type: "string" },
                                                title: { type: "string" },
                                                type: { type: "string" },
                                                duration: { type: "string" },
                                                xp: { type: "number" }
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        achievements: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    id: { type: "string" },
                                    name: { type: "string" },
                                    description: { type: "string" },
                                    icon: { type: "string" },
                                    requirement: { type: "number" }
                                }
                            }
                        }
                    }
                }
            });

            // Prepare units with unique IDs for lessons
            const unitsWithIds = (response?.units || []).map((unit, uIndex) => ({
                ...unit,
                lessons: (unit.lessons || []).map((lesson, lIndex) => ({
                    ...lesson,
                    id: lesson.id || `unit${uIndex}-lesson${lIndex}`,
                    xp: lesson.xp || 25 + (lIndex * 5)
                }))
            }));

            // Generate images for each unit (in parallel, but don't block if fails)
            const unitsWithImages = await Promise.all(
                unitsWithIds.map(async (unit, i) => {
                    try {
                        const imgResponse = await base44.integrations.Core.GenerateImage({
                            prompt: `Educational illustration for ${topic.name} course, unit: ${unit.title}. Modern, clean, professional educational style. Abstract learning concept visualization.`
                        });
                        return { ...unit, imageUrl: imgResponse?.url };
                    } catch (e) {
                        console.log('Image generation skipped for unit:', unit.title);
                        return unit;
                    }
                })
            );

            setCourseData({
                ...response,
                units: unitsWithImages,
                achievements: response?.achievements || [
                    { id: 'first', name: 'First Steps', description: 'Complete your first lesson', icon: 'star', requirement: 1 },
                    { id: 'unit', name: 'Unit Master', description: 'Complete a full unit', icon: 'trophy', requirement: 5 },
                    { id: 'halfway', name: 'Halfway There', description: 'Complete 50% of the course', icon: 'flame', requirement: 10 },
                    { id: 'scholar', name: 'Scholar', description: 'Complete the entire course', icon: 'medal', requirement: 20 },
                ]
            });
        } catch (error) {
            console.error('Error generating course:', error);
            // Fallback course data
            setCourseData({
                title: `${topic.name} Fundamentals`,
                description: `Master the core concepts of ${topic.name} through interactive lessons and hands-on projects.`,
                totalDuration: '12 hours',
                difficulty: 'Beginner to Intermediate',
                learningOutcomes: [
                    `Understand fundamental concepts of ${topic.name}`,
                    'Apply knowledge to real-world scenarios',
                    'Complete hands-on projects and assessments',
                    'Earn a certificate of completion'
                ],
                units: [
                    {
                        title: 'Introduction & Foundations',
                        description: 'Get started with the basics',
                        duration: '2 hours',
                        xp: 150,
                        lessons: [
                            { id: 'u0-l0', title: 'Welcome & Course Overview', type: 'video', duration: '10 min', xp: 25 },
                            { id: 'u0-l1', title: 'Core Concepts Explained', type: 'reading', duration: '15 min', xp: 30 },
                            { id: 'u0-l2', title: 'Key Terminology', type: 'reading', duration: '10 min', xp: 25 },
                            { id: 'u0-l3', title: 'Knowledge Check', type: 'quiz', duration: '5 min', xp: 50 },
                        ]
                    },
                    {
                        title: 'Core Principles',
                        description: 'Deep dive into essential principles',
                        duration: '3 hours',
                        xp: 200,
                        lessons: [
                            { id: 'u1-l0', title: 'Fundamental Principles', type: 'video', duration: '20 min', xp: 40 },
                            { id: 'u1-l1', title: 'Case Studies', type: 'reading', duration: '15 min', xp: 35 },
                            { id: 'u1-l2', title: 'Practical Applications', type: 'video', duration: '25 min', xp: 45 },
                            { id: 'u1-l3', title: 'Practice Exercise', type: 'exercise', duration: '20 min', xp: 50 },
                            { id: 'u1-l4', title: 'Module Quiz', type: 'quiz', duration: '10 min', xp: 60 },
                        ]
                    },
                    {
                        title: 'Advanced Topics',
                        description: 'Explore advanced concepts and techniques',
                        duration: '4 hours',
                        xp: 250,
                        lessons: [
                            { id: 'u2-l0', title: 'Advanced Theory', type: 'video', duration: '30 min', xp: 50 },
                            { id: 'u2-l1', title: 'Expert Insights', type: 'reading', duration: '20 min', xp: 40 },
                            { id: 'u2-l2', title: 'Complex Scenarios', type: 'video', duration: '25 min', xp: 45 },
                            { id: 'u2-l3', title: 'Hands-on Project', type: 'exercise', duration: '45 min', xp: 75 },
                            { id: 'u2-l4', title: 'Advanced Quiz', type: 'quiz', duration: '15 min', xp: 70 },
                        ]
                    },
                    {
                        title: 'Real-World Applications',
                        description: 'Apply your knowledge to practical scenarios',
                        duration: '3 hours',
                        xp: 300,
                        lessons: [
                            { id: 'u3-l0', title: 'Industry Applications', type: 'video', duration: '25 min', xp: 45 },
                            { id: 'u3-l1', title: 'Best Practices', type: 'reading', duration: '15 min', xp: 35 },
                            { id: 'u3-l2', title: 'Capstone Project', type: 'exercise', duration: '60 min', xp: 100 },
                            { id: 'u3-l3', title: 'Final Assessment', type: 'quiz', duration: '20 min', xp: 100 },
                        ]
                    }
                ],
                achievements: [
                    { id: 'first', name: 'First Steps', description: 'Complete your first lesson', icon: 'star', requirement: 1 },
                    { id: 'five', name: 'Getting Started', description: 'Complete 5 lessons', icon: 'flame', requirement: 5 },
                    { id: 'unit', name: 'Unit Master', description: 'Complete a full unit', icon: 'trophy', requirement: 4 },
                    { id: 'scholar', name: 'Scholar', description: 'Complete the entire course', icon: 'medal', requirement: 18 },
                ]
            });
        } finally {
            setLoading(false);
        }
    };

    const getCurrentUnit = () => {
        if (!courseData?.units) return 0;
        for (let i = 0; i < courseData.units.length; i++) {
            const unit = courseData.units[i];
            const allCompleted = unit.lessons?.every(l => completedLessons.includes(l.id));
            if (!allCompleted) return i;
        }
        return courseData.units.length - 1;
    };

    const isUnitUnlocked = (unitIndex) => {
        if (unitIndex === 0) return true;
        const prevUnit = courseData?.units[unitIndex - 1];
        return prevUnit?.lessons?.every(l => completedLessons.includes(l.id));
    };

    const startLesson = (lesson, unit) => {
        setCurrentLesson(lesson);
        setCurrentUnit(unit);
        setShowLessonModal(true);
    };

    const completeLesson = () => {
        if (currentLesson && !completedLessons.includes(currentLesson.id)) {
            const newCompleted = [...completedLessons, currentLesson.id];
            setCompletedLessons(newCompleted);
            setUserXP(prev => prev + (currentLesson.xp || 25));
            
            // Check achievements
            const newAchievements = [];
            courseData?.achievements?.forEach(a => {
                if (!earnedAchievements.includes(a.id) && newCompleted.length >= a.requirement) {
                    newAchievements.push(a.id);
                }
            });
            if (newAchievements.length > 0) {
                setEarnedAchievements([...earnedAchievements, ...newAchievements]);
            }
        }
        setShowLessonModal(false);
    };

    const totalLessons = courseData?.units?.reduce((acc, u) => acc + (u.lessons?.length || 0), 0) || 0;
    const progress = totalLessons > 0 ? (completedLessons.length / totalLessons) * 100 : 0;
    const currentUnitIndex = getCurrentUnit();

    if (!topic) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden p-0">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="relative">
                            <div className="w-16 h-16 rounded-full border-4 border-gray-200 border-t-purple-600 animate-spin" />
                            <Sparkles className="w-6 h-6 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" style={{ color: topic.color }} />
                        </div>
                        <p className="text-gray-600 mt-4">Generating your personalized curriculum...</p>
                    </div>
                ) : (
                    <div className="flex flex-col h-[85vh]">
                        {/* Header */}
                        <div className="relative p-6 text-white" style={{ background: `linear-gradient(135deg, ${topic.color} 0%, ${THEME.secondary} 100%)` }}>
                            <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-lg transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                            
                            <div className="flex items-start gap-4">
                                <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
                                    <BookOpen className="w-8 h-8" />
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-2xl font-bold mb-1">{courseData?.title || topic.name}</h2>
                                    <p className="text-white/80 text-sm mb-3 line-clamp-2">{courseData?.description}</p>
                                    <div className="flex items-center gap-4 text-sm text-white/70">
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-4 h-4" /> {courseData?.totalDuration || '8 hours'}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Target className="w-4 h-4" /> {courseData?.difficulty || 'All Levels'}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <BookOpen className="w-4 h-4" /> {totalLessons} lessons
                                        </span>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Progress */}
                            <div className="mt-4">
                                <div className="flex justify-between text-sm mb-1">
                                    <span>{Math.round(progress)}% Complete</span>
                                    <span>{completedLessons.length}/{totalLessons} lessons</span>
                                </div>
                                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                                    <div className="h-full bg-white rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
                                </div>
                            </div>
                        </div>

                        {/* XP Bar */}
                        <div className="flex items-center justify-between px-6 py-3 border-b" style={{ backgroundColor: `${THEME.accent}10` }}>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-100 rounded-lg">
                                    <Zap className="w-5 h-5 text-amber-600" />
                                    <div>
                                        <p className="text-xs text-amber-600">XP Earned</p>
                                        <p className="font-bold text-amber-700">{userXP}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-100 rounded-lg">
                                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                                    <div>
                                        <p className="text-xs text-emerald-600">Completed</p>
                                        <p className="font-bold text-emerald-700">{completedLessons.length}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                {courseData?.achievements?.slice(0, 4).map((a, i) => (
                                    <AchievementBadge key={a.id} achievement={a} earned={earnedAchievements.includes(a.id)} color={topic.color} />
                                ))}
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="flex border-b">
                            {['curriculum', 'overview', 'achievements'].map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`flex-1 px-4 py-3 text-sm font-medium capitalize transition-colors ${
                                        activeTab === tab ? 'border-b-2' : 'text-gray-500 hover:text-gray-700'
                                    }`}
                                    style={activeTab === tab ? { color: topic.color, borderColor: topic.color } : undefined}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6">
                            {activeTab === 'curriculum' && (
                                <div className="space-y-6">
                                    {courseData?.units?.map((unit, i) => (
                                        <CourseUnit
                                            key={i}
                                            unit={unit}
                                            index={i}
                                            isUnlocked={isUnitUnlocked(i)}
                                            isCurrent={i === currentUnitIndex}
                                            onStartLesson={startLesson}
                                            completedLessons={completedLessons}
                                            topicColor={topic.color}
                                        />
                                    ))}
                                </div>
                            )}

                            {activeTab === 'overview' && (
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="font-bold text-gray-800 mb-3">What you'll learn</h3>
                                        <div className="grid grid-cols-2 gap-3">
                                            {courseData?.learningOutcomes?.map((outcome, i) => (
                                                <div key={i} className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg">
                                                    <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: topic.color }} />
                                                    <span className="text-sm text-gray-600">{outcome}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'achievements' && (
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                    {courseData?.achievements?.map((achievement, i) => (
                                        <div key={achievement.id} className={`p-4 rounded-xl border-2 ${
                                            earnedAchievements.includes(achievement.id) ? 'border-amber-400 bg-amber-50' : 'border-gray-200 bg-gray-50'
                                        }`}>
                                            <AchievementBadge achievement={achievement} earned={earnedAchievements.includes(achievement.id)} color={topic.color} />
                                            <p className="text-xs text-gray-500 mt-2 text-center">{achievement.description}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Lesson Modal */}
                {showLessonModal && currentLesson && currentUnit && (
                    <LessonModal
                        lesson={currentLesson}
                        unit={currentUnit}
                        topic={topic}
                        onComplete={completeLesson}
                        onClose={() => setShowLessonModal(false)}
                    />
                )}
            </DialogContent>
        </Dialog>
    );
}