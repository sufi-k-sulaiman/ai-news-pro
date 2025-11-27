import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { base44 } from "@/api/base44Client";
import { X, Loader2, Award, Trophy, Target } from 'lucide-react';

const TOPICS = {
    programming: [
        { id: 'algorithms', label: 'Algorithms', topic: 'Algorithm concepts and data structures' },
        { id: 'webdev', label: 'Web Development', topic: 'HTML, CSS, JavaScript and frameworks' },
        { id: 'databases', label: 'Databases', topic: 'SQL, NoSQL, and database design' },
        { id: 'security', label: 'Cybersecurity', topic: 'Security concepts and best practices' },
        { id: 'cloud', label: 'Cloud Computing', topic: 'AWS, Azure, and cloud architecture' },
    ],
    science: [
        { id: 'physics', label: 'Physics', topic: 'Physics laws and quantum mechanics' },
        { id: 'chemistry', label: 'Chemistry', topic: 'Chemical reactions and elements' },
        { id: 'biology', label: 'Biology', topic: 'Life sciences and genetics' },
        { id: 'astronomy', label: 'Astronomy', topic: 'Space, planets, and the universe' },
        { id: 'earth', label: 'Earth Science', topic: 'Geology, weather, and climate' },
    ],
    history: [
        { id: 'ancient', label: 'Ancient History', topic: 'Ancient civilizations and empires' },
        { id: 'medieval', label: 'Medieval Era', topic: 'Middle ages and feudalism' },
        { id: 'modern', label: 'Modern History', topic: '19th and 20th century events' },
        { id: 'wars', label: 'World Wars', topic: 'WWI, WWII, and major conflicts' },
        { id: 'art', label: 'Art History', topic: 'Art movements and famous artists' },
    ],
    business: [
        { id: 'marketing', label: 'Marketing', topic: 'Marketing strategies and branding' },
        { id: 'finance', label: 'Finance', topic: 'Financial concepts and investing' },
        { id: 'economics', label: 'Economics', topic: 'Economic principles and theories' },
        { id: 'management', label: 'Management', topic: 'Leadership and organizational behavior' },
        { id: 'startups', label: 'Startups', topic: 'Entrepreneurship and venture capital' },
    ],
};

export default function SpaceBattleGame({ onExit }) {
    const [screen, setScreen] = useState('menu');
    const [activeCategory, setActiveCategory] = useState('programming');
    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [loading, setLoading] = useState(false);
    const [selectedTopic, setSelectedTopic] = useState(null);
    const [awards, setAwards] = useState([]);
    const [showQuestion, setShowQuestion] = useState(false);
    const canvasRef = useRef(null);
    const gameStateRef = useRef(null);

    const generateQuestions = async (topic) => {
        setLoading(true);
        setScreen('loading');
        setSelectedTopic(topic);
        try {
            const result = await base44.integrations.Core.InvokeLLM({
                prompt: `Generate 15 educational Yes/No questions for: "${topic}". Each question should test knowledge. Return as JSON: { "questions": [{ "question": "Is Python a programming language?", "answer": true, "explanation": "Python is indeed a high-level programming language" }] }`,
                response_json_schema: {
                    type: "object",
                    properties: {
                        questions: { type: "array", items: { type: "object", properties: { question: { type: "string" }, answer: { type: "boolean" }, explanation: { type: "string" } } } }
                    }
                }
            });
            setQuestions(result.questions || []);
            setCurrentQuestion(0);
            setScore(0);
            setScreen('game');
        } catch (error) {
            console.error('Failed to generate:', error);
            setScreen('menu');
        } finally {
            setLoading(false);
        }
    };

    // FPS Canvas rendering with parallax
    useEffect(() => {
        if (screen !== 'game' || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationId;
        let time = 0;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        // Game state for FPS world
        const state = {
            playerX: 0,
            playerY: 0,
            lookAngle: 0,
            targetX: 0,
            targetY: 0,
            enemies: [],
            particles: [],
            radarBlips: [],
        };
        gameStateRef.current = state;

        // Spawn enemies at different depths
        const spawnEnemies = () => {
            state.enemies = [];
            for (let i = 0; i < 5; i++) {
                state.enemies.push({
                    x: (Math.random() - 0.5) * 800,
                    y: 100 + Math.random() * 300,
                    z: 200 + i * 150,
                    type: ['tank', 'helicopter', 'drone'][Math.floor(Math.random() * 3)],
                    vx: (Math.random() - 0.5) * 2,
                });
            }
            // Radar blips
            state.radarBlips = state.enemies.map(e => ({
                angle: Math.atan2(e.x, e.z),
                dist: Math.sqrt(e.x * e.x + e.z * e.z) / 1000,
            }));
        };
        spawnEnemies();

        const handleMouseMove = (e) => {
            state.targetX = e.clientX;
            state.targetY = e.clientY;
            state.lookAngle = (e.clientX - canvas.width / 2) / canvas.width * 0.5;
        };

        window.addEventListener('mousemove', handleMouseMove);

        const gameLoop = () => {
            time += 0.016;
            const w = canvas.width;
            const h = canvas.height;

            // Dark blue gradient sky
            const skyGrad = ctx.createLinearGradient(0, 0, 0, h * 0.6);
            skyGrad.addColorStop(0, '#0a1628');
            skyGrad.addColorStop(1, '#1a2d4a');
            ctx.fillStyle = skyGrad;
            ctx.fillRect(0, 0, w, h);

            // Stars (far background - slow parallax)
            ctx.fillStyle = '#ffffff';
            for (let i = 0; i < 50; i++) {
                const sx = ((i * 137 + state.lookAngle * 20) % w + w) % w;
                const sy = (i * 73) % (h * 0.4);
                ctx.globalAlpha = 0.3 + Math.sin(time + i) * 0.2;
                ctx.beginPath();
                ctx.arc(sx, sy, 1, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.globalAlpha = 1;

            // Mountains (mid background - medium parallax)
            const mountainParallax = state.lookAngle * 100;
            ctx.fillStyle = '#1a2d4a';
            ctx.beginPath();
            ctx.moveTo(-100 + mountainParallax, h * 0.55);
            for (let x = -100; x <= w + 100; x += 80) {
                const peakH = 50 + Math.sin(x * 0.01) * 30 + Math.cos(x * 0.02) * 20;
                ctx.lineTo(x + mountainParallax, h * 0.55 - peakH);
            }
            ctx.lineTo(w + 100 + mountainParallax, h * 0.55);
            ctx.closePath();
            ctx.fill();

            // Closer mountains (faster parallax)
            const mountain2Parallax = state.lookAngle * 200;
            ctx.fillStyle = '#243b55';
            ctx.beginPath();
            ctx.moveTo(-100 + mountain2Parallax, h * 0.6);
            for (let x = -100; x <= w + 100; x += 60) {
                const peakH = 30 + Math.sin(x * 0.015 + 1) * 25;
                ctx.lineTo(x + mountain2Parallax, h * 0.6 - peakH);
            }
            ctx.lineTo(w + 100 + mountain2Parallax, h * 0.6);
            ctx.closePath();
            ctx.fill();

            // Ground plane with perspective grid
            const groundY = h * 0.6;
            const groundGrad = ctx.createLinearGradient(0, groundY, 0, h);
            groundGrad.addColorStop(0, '#1a2d4a');
            groundGrad.addColorStop(1, '#0d1a2d');
            ctx.fillStyle = groundGrad;
            ctx.fillRect(0, groundY, w, h - groundY);

            // Perspective grid lines
            ctx.strokeStyle = 'rgba(50, 100, 150, 0.3)';
            ctx.lineWidth = 1;
            const vanishY = groundY;
            const vanishX = w / 2 - state.lookAngle * 500;

            // Horizontal lines with perspective
            for (let i = 1; i <= 15; i++) {
                const y = groundY + (i / 15) * (h - groundY) * 0.9;
                const perspective = (y - groundY) / (h - groundY);
                const leftX = vanishX - (vanishX + 200) * perspective;
                const rightX = vanishX + (w - vanishX + 200) * perspective;
                ctx.globalAlpha = 0.1 + perspective * 0.3;
                ctx.beginPath();
                ctx.moveTo(leftX, y);
                ctx.lineTo(rightX, y);
                ctx.stroke();
            }

            // Vertical lines converging to vanishing point
            for (let i = -10; i <= 10; i++) {
                const baseX = vanishX + i * 150;
                ctx.beginPath();
                ctx.moveTo(vanishX, vanishY);
                ctx.lineTo(baseX, h);
                ctx.stroke();
            }
            ctx.globalAlpha = 1;

            // Draw enemies with 3D perspective
            state.enemies.forEach((enemy, idx) => {
                enemy.x += enemy.vx;
                if (Math.abs(enemy.x) > 500) enemy.vx *= -1;

                // Project 3D to 2D with perspective
                const fov = 500;
                const scale = fov / (enemy.z + fov);
                const screenX = w / 2 + (enemy.x - state.lookAngle * enemy.z) * scale;
                const screenY = groundY - enemy.y * scale;
                const size = 60 * scale;

                if (scale > 0.1 && screenX > -100 && screenX < w + 100) {
                    // Shadow on ground
                    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
                    ctx.beginPath();
                    ctx.ellipse(screenX, groundY + 10 * scale, size * 0.5, size * 0.15, 0, 0, Math.PI * 2);
                    ctx.fill();

                    // Draw enemy based on type
                    if (enemy.type === 'tank') {
                        drawTank(ctx, screenX, screenY, size);
                    } else if (enemy.type === 'helicopter') {
                        drawHelicopter(ctx, screenX, screenY - size * 0.5, size, time);
                    } else {
                        drawDrone(ctx, screenX, screenY - size * 0.3, size * 0.6, time);
                    }
                }
            });

            // Draw crosshair/targeting reticle
            const cx = w / 2;
            const cy = h / 2 - 50;
            ctx.strokeStyle = '#00ffff';
            ctx.lineWidth = 2;
            
            // Outer brackets
            ctx.beginPath();
            ctx.moveTo(cx - 40, cy - 30); ctx.lineTo(cx - 40, cy - 40); ctx.lineTo(cx - 30, cy - 40);
            ctx.moveTo(cx + 30, cy - 40); ctx.lineTo(cx + 40, cy - 40); ctx.lineTo(cx + 40, cy - 30);
            ctx.moveTo(cx + 40, cy + 30); ctx.lineTo(cx + 40, cy + 40); ctx.lineTo(cx + 30, cy + 40);
            ctx.moveTo(cx - 30, cy + 40); ctx.lineTo(cx - 40, cy + 40); ctx.lineTo(cx - 40, cy + 30);
            ctx.stroke();

            // Center dot
            ctx.fillStyle = '#ff3333';
            ctx.beginPath();
            ctx.arc(cx, cy, 4, 0, Math.PI * 2);
            ctx.fill();

            // Crosshair lines
            ctx.strokeStyle = '#00ffff';
            ctx.globalAlpha = 0.5;
            ctx.beginPath();
            ctx.moveTo(cx - 20, cy); ctx.lineTo(cx - 8, cy);
            ctx.moveTo(cx + 8, cy); ctx.lineTo(cx + 20, cy);
            ctx.moveTo(cx, cy - 20); ctx.lineTo(cx, cy - 8);
            ctx.moveTo(cx, cy + 8); ctx.lineTo(cx, cy + 20);
            ctx.stroke();
            ctx.globalAlpha = 1;

            // Draw scale/distance markers
            ctx.fillStyle = '#00ffff';
            ctx.font = '12px monospace';
            ctx.textAlign = 'center';
            ctx.fillText('10', cx - 60, cy + 70);
            ctx.fillText('10', cx + 60, cy + 70);
            
            // Vertical scale line
            ctx.strokeStyle = '#00ffff';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(cx, cy + 50);
            ctx.lineTo(cx, cy + 80);
            ctx.stroke();

            // Draw radar (bottom left)
            drawRadar(ctx, 120, h - 150, 100, state.radarBlips, time);

            // Draw compass (top right)
            drawCompass(ctx, w - 100, 100, 60, state.lookAngle);

            // Draw score gauge (top right)
            drawScoreGauge(ctx, w - 200, 100, 50, score, questions.length);

            // Draw awards section
            drawAwards(ctx, 250, 80);

            // Draw topic buttons (left side)
            drawTopicButtons(ctx, 30, 80, selectedTopic);

            animationId = requestAnimationFrame(gameLoop);
        };

        gameLoop();

        return () => {
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationId);
        };
    }, [screen, score, questions.length, selectedTopic]);

    const handleAnswer = (answer) => {
        const correct = questions[currentQuestion]?.answer === answer;
        if (correct) {
            setScore(s => s + 1);
            if (score + 1 === 5) setAwards(a => [...a, 'bronze']);
            if (score + 1 === 10) setAwards(a => [...a, 'silver']);
            if (score + 1 === 15) setAwards(a => [...a, 'gold']);
        }
        
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(c => c + 1);
        } else {
            setScreen('results');
        }
    };

    if (screen === 'loading') {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-[#0a1628] z-[9999]">
                <div className="text-center">
                    <Loader2 className="w-20 h-20 animate-spin mx-auto mb-6 text-cyan-400" />
                    <h2 className="text-3xl font-bold mb-2 text-white">Initializing Battle Zone...</h2>
                    <p className="text-lg text-gray-400">AI is generating your mission</p>
                </div>
            </div>
        );
    }

    if (screen === 'results') {
        return (
            <div className="fixed inset-0 bg-[#0a1628] z-[9999] flex items-center justify-center">
                <Card className="p-10 bg-[#1a2d4a] border-cyan-500/50 text-center max-w-lg">
                    <Trophy className="w-24 h-24 mx-auto mb-6 text-yellow-400" />
                    <h2 className="text-4xl font-bold text-white mb-4">Mission Complete!</h2>
                    <p className="text-2xl text-cyan-400 mb-6">Score: {score}/{questions.length}</p>
                    <div className="flex justify-center gap-4 mb-8">
                        {awards.includes('gold') && <Award className="w-12 h-12 text-yellow-400" />}
                        {awards.includes('silver') && <Award className="w-12 h-12 text-gray-300" />}
                        {awards.includes('bronze') && <Award className="w-12 h-12 text-amber-600" />}
                    </div>
                    <div className="flex gap-4">
                        <Button onClick={() => setScreen('menu')} className="flex-1 bg-gray-700">
                            New Mission
                        </Button>
                        <Button onClick={onExit} className="flex-1 bg-cyan-600">
                            Exit
                        </Button>
                    </div>
                </Card>
            </div>
        );
    }

    if (screen === 'game') {
        const q = questions[currentQuestion];
        return (
            <div className="fixed inset-0 bg-[#0a1628] z-[9999]">
                <canvas ref={canvasRef} className="absolute inset-0" />
                
                {/* Question panel */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-full max-w-2xl px-4">
                    <Card className="p-6 bg-[#0d1a2d]/95 border border-cyan-500/30 backdrop-blur">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-cyan-400 font-bold">Technical Track</span>
                            <span className="text-gray-400">Question {currentQuestion + 1}</span>
                        </div>
                        <h3 className="text-xl text-white mb-6">{q?.question}</h3>
                        <div className="flex gap-4">
                            <Button 
                                onClick={() => handleAnswer(false)}
                                className="flex-1 h-14 text-lg border-2 border-red-500/50 bg-transparent hover:bg-red-500/20 text-red-400"
                            >
                                No
                            </Button>
                            <Button 
                                onClick={() => handleAnswer(true)}
                                className="flex-1 h-14 text-lg border-2 border-green-500/50 bg-transparent hover:bg-green-500/20 text-green-400"
                            >
                                Yes
                            </Button>
                        </div>
                    </Card>
                </div>

                <Button onClick={onExit} className="absolute top-4 right-4 bg-red-600/80 hover:bg-red-700">
                    <X className="w-4 h-4 mr-1" /> Exit
                </Button>
            </div>
        );
    }

    // Menu screen
    return (
        <div className="fixed inset-0 bg-gradient-to-b from-[#0a1628] to-[#1a2d4a] z-[9999] overflow-auto p-8">
            <Button onClick={onExit} className="absolute top-4 right-4 bg-red-600 hover:bg-red-700">
                <X className="w-4 h-4 mr-2" /> Close
            </Button>

            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-10">
                    <div className="text-6xl mb-6">🎯</div>
                    <h1 className="text-5xl font-black text-white mb-4" style={{ textShadow: '0 0 40px rgba(0, 255, 255, 0.5)' }}>
                        TACTICAL KNOWLEDGE
                    </h1>
                    <p className="text-xl text-cyan-400">First-Person Educational Combat</p>
                </div>

                <Card className="p-6 mb-8 bg-[#1a2d4a]/80 border-cyan-500/30">
                    <div className="flex gap-2 mb-6 flex-wrap justify-center">
                        {Object.keys(TOPICS).map(cat => (
                            <Button key={cat} onClick={() => setActiveCategory(cat)}
                                className={`px-5 py-2 ${activeCategory === cat ? 'bg-gradient-to-r from-cyan-600 to-blue-600' : 'bg-gray-700'} text-white`}>
                                {cat.charAt(0).toUpperCase() + cat.slice(1)}
                            </Button>
                        ))}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {TOPICS[activeCategory].map((topic) => (
                            <Button key={topic.id} onClick={() => generateQuestions(topic.topic)} 
                                className="h-24 text-left justify-start p-6 bg-gradient-to-r from-cyan-700/50 to-blue-700/50 hover:from-cyan-600 hover:to-blue-600 text-white border border-cyan-500/30">
                                <div>
                                    <div className="text-lg font-bold mb-1">{topic.label}</div>
                                    <div className="text-xs opacity-80">{topic.topic}</div>
                                </div>
                            </Button>
                        ))}
                    </div>
                </Card>

                <div className="grid grid-cols-3 gap-6">
                    <Card className="p-6 text-center bg-[#1a2d4a]/80 border-cyan-500/30">
                        <Target className="w-12 h-12 mx-auto mb-4 text-cyan-400" />
                        <h3 className="text-lg font-bold mb-2 text-white">Track Targets</h3>
                        <p className="text-sm text-gray-400">Answer questions to score</p>
                    </Card>
                    <Card className="p-6 text-center bg-[#1a2d4a]/80 border-cyan-500/30">
                        <Award className="w-12 h-12 mx-auto mb-4 text-yellow-400" />
                        <h3 className="text-lg font-bold mb-2 text-white">Earn Medals</h3>
                        <p className="text-sm text-gray-400">Bronze, Silver, Gold awards</p>
                    </Card>
                    <Card className="p-6 text-center bg-[#1a2d4a]/80 border-cyan-500/30">
                        <Trophy className="w-12 h-12 mx-auto mb-4 text-amber-500" />
                        <h3 className="text-lg font-bold mb-2 text-white">Complete Mission</h3>
                        <p className="text-sm text-gray-400">Master each knowledge area</p>
                    </Card>
                </div>
            </div>
        </div>
    );
}

// Draw helper functions
function drawTank(ctx, x, y, size) {
    ctx.fillStyle = '#2d4a3a';
    // Body
    ctx.fillRect(x - size * 0.5, y - size * 0.2, size, size * 0.4);
    // Turret
    ctx.fillRect(x - size * 0.2, y - size * 0.4, size * 0.4, size * 0.25);
    // Barrel
    ctx.fillRect(x + size * 0.1, y - size * 0.35, size * 0.5, size * 0.1);
    // Tracks
    ctx.fillStyle = '#1a2d2a';
    ctx.fillRect(x - size * 0.55, y + size * 0.1, size * 0.2, size * 0.15);
    ctx.fillRect(x + size * 0.35, y + size * 0.1, size * 0.2, size * 0.15);
    // Flag
    ctx.fillStyle = '#00ff00';
    ctx.fillRect(x + size * 0.3, y - size * 0.6, size * 0.05, size * 0.3);
    ctx.fillRect(x + size * 0.35, y - size * 0.6, size * 0.15, size * 0.1);
}

function drawHelicopter(ctx, x, y, size, time) {
    ctx.fillStyle = '#3a4a5a';
    // Body
    ctx.beginPath();
    ctx.ellipse(x, y, size * 0.4, size * 0.2, 0, 0, Math.PI * 2);
    ctx.fill();
    // Tail
    ctx.fillRect(x + size * 0.3, y - size * 0.05, size * 0.4, size * 0.1);
    // Tail rotor
    ctx.fillRect(x + size * 0.65, y - size * 0.15, size * 0.05, size * 0.3);
    // Main rotor (animated)
    ctx.strokeStyle = '#5a6a7a';
    ctx.lineWidth = 3;
    ctx.beginPath();
    const rotorAngle = time * 20;
    ctx.moveTo(x - size * 0.5 * Math.cos(rotorAngle), y - size * 0.3);
    ctx.lineTo(x + size * 0.5 * Math.cos(rotorAngle), y - size * 0.3);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x - size * 0.5 * Math.sin(rotorAngle), y - size * 0.3);
    ctx.lineTo(x + size * 0.5 * Math.sin(rotorAngle), y - size * 0.3);
    ctx.stroke();
}

function drawDrone(ctx, x, y, size, time) {
    ctx.fillStyle = '#4a5a6a';
    // Body
    ctx.beginPath();
    ctx.moveTo(x, y - size * 0.3);
    ctx.lineTo(x + size * 0.3, y + size * 0.2);
    ctx.lineTo(x - size * 0.3, y + size * 0.2);
    ctx.closePath();
    ctx.fill();
    // Wings
    ctx.fillRect(x - size * 0.5, y, size, size * 0.08);
    // Light
    ctx.fillStyle = time % 1 > 0.5 ? '#00ffff' : '#004444';
    ctx.beginPath();
    ctx.arc(x, y + size * 0.1, size * 0.08, 0, Math.PI * 2);
    ctx.fill();
}

function drawRadar(ctx, x, y, radius, blips, time) {
    // Outer ring
    ctx.strokeStyle = '#00ffff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.stroke();

    // Inner rings
    ctx.globalAlpha = 0.3;
    ctx.beginPath();
    ctx.arc(x, y, radius * 0.66, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x, y, radius * 0.33, 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = 1;

    // Sweep line
    const sweepAngle = time * 2;
    ctx.strokeStyle = '#00ffff';
    ctx.globalAlpha = 0.5;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + Math.cos(sweepAngle) * radius, y + Math.sin(sweepAngle) * radius);
    ctx.stroke();
    ctx.globalAlpha = 1;

    // Blips
    ctx.fillStyle = '#00ffff';
    blips.forEach(blip => {
        const bx = x + Math.sin(blip.angle) * radius * blip.dist;
        const by = y - Math.cos(blip.angle) * radius * blip.dist;
        ctx.beginPath();
        ctx.arc(bx, by, 4, 0, Math.PI * 2);
        ctx.fill();
    });

    // Center icon (player)
    ctx.fillStyle = '#00ff00';
    ctx.beginPath();
    ctx.moveTo(x, y - 8);
    ctx.lineTo(x + 5, y + 5);
    ctx.lineTo(x - 5, y + 5);
    ctx.closePath();
    ctx.fill();
}

function drawCompass(ctx, x, y, radius, angle) {
    // Outer ring
    ctx.strokeStyle = '#00ffff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.stroke();

    // Direction labels
    ctx.fillStyle = '#00ffff';
    ctx.font = 'bold 12px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    const dirs = ['N', 'E', 'S', 'W'];
    dirs.forEach((dir, i) => {
        const a = (i * Math.PI / 2) - angle;
        const dx = x + Math.sin(a) * (radius - 15);
        const dy = y - Math.cos(a) * (radius - 15);
        ctx.fillStyle = dir === 'N' ? '#ff3333' : '#00ffff';
        ctx.fillText(dir, dx, dy);
    });

    // Center arrow (always points up)
    ctx.fillStyle = '#00ffff';
    ctx.beginPath();
    ctx.moveTo(x, y - 20);
    ctx.lineTo(x + 8, y + 10);
    ctx.lineTo(x, y + 5);
    ctx.lineTo(x - 8, y + 10);
    ctx.closePath();
    ctx.fill();

    // Triangle marker at top
    ctx.fillStyle = '#00ffff';
    ctx.beginPath();
    ctx.moveTo(x, y - radius - 10);
    ctx.lineTo(x - 6, y - radius);
    ctx.lineTo(x + 6, y - radius);
    ctx.closePath();
    ctx.fill();
}

function drawScoreGauge(ctx, x, y, radius, score, total) {
    const percent = total > 0 ? score / total : 0;
    
    // Background arc
    ctx.strokeStyle = '#1a2d4a';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.arc(x, y, radius, Math.PI * 0.75, Math.PI * 2.25);
    ctx.stroke();

    // Progress arc
    const endAngle = Math.PI * 0.75 + (Math.PI * 1.5 * percent);
    ctx.strokeStyle = percent > 0.7 ? '#00ff00' : percent > 0.4 ? '#ffff00' : '#ff3333';
    ctx.beginPath();
    ctx.arc(x, y, radius, Math.PI * 0.75, endAngle);
    ctx.stroke();

    // Score text
    ctx.fillStyle = '#00ff00';
    ctx.font = 'bold 16px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(score, x, y + 5);
    
    ctx.fillStyle = '#888';
    ctx.font = '10px monospace';
    ctx.fillText('/' + total, x, y + 18);

    // Label
    ctx.fillStyle = '#888';
    ctx.font = '10px monospace';
    ctx.fillText('Exam Score', x, y + radius + 15);
}

function drawAwards(ctx, x, y) {
    ctx.fillStyle = '#00ffff';
    ctx.font = 'bold 14px monospace';
    ctx.textAlign = 'left';
    ctx.fillText('Awards', x, y - 30);
    
    ctx.fillStyle = '#888';
    ctx.font = '12px monospace';
    ctx.fillText('Medals to be won', x, y - 12);

    // Medal placeholders
    const medals = [
        { x: x, color: '#00ffff', shape: 'ribbon' },
        { x: x + 50, color: '#ffd700', shape: 'star' },
        { x: x + 100, color: '#c0c0c0', shape: 'medal' },
    ];

    medals.forEach(medal => {
        ctx.strokeStyle = medal.color;
        ctx.fillStyle = medal.color;
        ctx.lineWidth = 2;
        
        if (medal.shape === 'ribbon') {
            // Ribbon medal
            ctx.beginPath();
            ctx.moveTo(medal.x + 15, y);
            ctx.lineTo(medal.x + 5, y + 30);
            ctx.lineTo(medal.x + 15, y + 25);
            ctx.lineTo(medal.x + 25, y + 30);
            ctx.closePath();
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(medal.x + 15, y + 40, 8, 0, Math.PI * 2);
            ctx.stroke();
        } else if (medal.shape === 'star') {
            // Star medal
            ctx.beginPath();
            for (let i = 0; i < 5; i++) {
                const angle = (i * 4 * Math.PI / 5) - Math.PI / 2;
                const px = medal.x + 15 + Math.cos(angle) * 12;
                const py = y + 25 + Math.sin(angle) * 12;
                if (i === 0) ctx.moveTo(px, py);
                else ctx.lineTo(px, py);
            }
            ctx.closePath();
            ctx.stroke();
        } else {
            // Circle medal
            ctx.beginPath();
            ctx.arc(medal.x + 15, y + 25, 12, 0, Math.PI * 2);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(medal.x + 15, y + 25, 6, 0, Math.PI * 2);
            ctx.fill();
        }
    });
}

function drawTopicButtons(ctx, x, y, selectedTopic) {
    const topics = ['User Management', 'Adding Direct to Cloud devices', 'Adding Direct to Cloud devices', 'Adding appliances'];
    
    topics.forEach((topic, i) => {
        const btnY = y + i * 45;
        const isSelected = i === 0;
        
        // Button background
        ctx.fillStyle = isSelected ? '#00bcd4' : 'rgba(50, 70, 90, 0.8)';
        ctx.beginPath();
        ctx.roundRect(x, btnY, 180, 35, 5);
        ctx.fill();
        
        // Button text
        ctx.fillStyle = isSelected ? '#000' : '#aaa';
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(topic.slice(0, 25), x + 10, btnY + 17);
    });
}