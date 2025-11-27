import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { base44 } from "@/api/base44Client";
import { X, Loader2, Award, Trophy, Target, Sparkles } from 'lucide-react';

export default function SpaceBattleGame({ onExit }) {
    const [screen, setScreen] = useState('menu');
    const [activeCategory, setActiveCategory] = useState(null);
    const [topics, setTopics] = useState({});
    const [loadingTopics, setLoadingTopics] = useState(false);
    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [gameScore, setGameScore] = useState(0);
    const [loading, setLoading] = useState(false);
    const [selectedTopic, setSelectedTopic] = useState(null);
    const [awards, setAwards] = useState([]);
    const canvasRef = useRef(null);
    const gameStateRef = useRef(null);

    const categories = ['Programming', 'Science', 'History', 'Business'];

    useEffect(() => {
        generateAllTopics();
    }, []);

    const generateAllTopics = async () => {
        setLoadingTopics(true);
        const allTopics = {};
        for (const cat of categories) {
            try {
                const result = await base44.integrations.Core.InvokeLLM({
                    prompt: `Generate 5 engaging, specific topics for a quiz game under the category: "${cat}".`,
                    response_json_schema: {
                        type: "object",
                        properties: {
                            topics: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        id: { type: "string" },
                                        label: { type: "string" },
                                        topic: { type: "string" }
                                    }
                                }
                            }
                        }
                    }
                });
                allTopics[cat.toLowerCase()] = result.topics || [];
            } catch (error) {
                console.error(`Failed to generate topics for ${cat}:`, error);
                allTopics[cat.toLowerCase()] = [];
            }
        }
        setTopics(allTopics);
        setActiveCategory(categories[0].toLowerCase());
        setLoadingTopics(false);
    };

    const startGame = async (topic) => {
        setLoading(true);
        setScreen('loading');
        setSelectedTopic(topic);
        try {
            const result = await base44.integrations.Core.InvokeLLM({
                prompt: `Generate 10 educational Yes/No questions for: "${topic.label}". Each question should test knowledge. Return as JSON: { "questions": [{ "question": "Is Python a programming language?", "answer": true, "explanation": "Python is a high-level programming language." }] }`,
                response_json_schema: {
                    type: "object",
                    properties: {
                        questions: { type: "array", items: { type: "object", properties: { question: { type: "string" }, answer: { type: "boolean" }, explanation: { type: "string" } } } }
                    }
                }
            });
            setQuestions(result.questions || []);
            setGameScore(0);
            setScore(0);
            setCurrentQuestion(0);
            setAwards([]);
            setScreen('game');
        } catch (error) {
            console.error('Failed to generate questions:', error);
            setScreen('menu');
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        if (screen !== 'game' || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationId;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        const state = {
            player: { x: canvas.width / 2, y: canvas.height - 60, width: 50, height: 50, health: 3 },
            bullets: [],
            enemies: [],
            particles: [],
            score: 0,
            gameOver: false,
            enemySpawnTimer: 100,
        };
        gameStateRef.current = state;

        const handleKeyDown = (e) => {
            if (e.code === 'Space') {
                state.bullets.push({ x: state.player.x, y: state.player.y, width: 5, height: 15, speed: 8 });
            }
        };
        window.addEventListener('keydown', handleKeyDown);

        const gameLoop = () => {
            if (state.gameOver) {
                setGameScore(state.score);
                setScreen('quiz');
                return;
            }
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#0a1628';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Player
            const targetX = state.player.x; // Let's simplify movement for now
            state.player.x += (targetX - state.player.x) * 0.1;
            drawPlayer(ctx, state.player);
            
            // Bullets
            state.bullets.forEach((bullet, bIndex) => {
                bullet.y -= bullet.speed;
                drawBullet(ctx, bullet);
                if (bullet.y < 0) state.bullets.splice(bIndex, 1);
            });

            // Enemies
            state.enemySpawnTimer--;
            if (state.enemySpawnTimer <= 0) {
                spawnEnemy(state, canvas.width);
                state.enemySpawnTimer = Math.max(20, 100 - state.score / 100);
            }
            state.enemies.forEach((enemy, eIndex) => {
                enemy.y += enemy.speed;
                drawEnemy(ctx, enemy);
                if (enemy.y > canvas.height) {
                    state.enemies.splice(eIndex, 1);
                    state.player.health--;
                    if (state.player.health <= 0) state.gameOver = true;
                }

                // Collision detection
                state.bullets.forEach((bullet, bIndex) => {
                    if (isColliding(bullet, enemy)) {
                        createExplosion(state.particles, enemy.x, enemy.y);
                        state.enemies.splice(eIndex, 1);
                        state.bullets.splice(bIndex, 1);
                        state.score += 100;
                    }
                });
            });

            // Particles
            state.particles.forEach((p, pIndex) => {
                p.x += p.vx;
                p.y += p.vy;
                p.life--;
                ctx.fillStyle = `rgba(255, 180, 80, ${p.life / p.maxLife})`;
                ctx.fillRect(p.x, p.y, 3, 3);
                if (p.life <= 0) state.particles.splice(pIndex, 1);
            });
            
            drawUI(ctx, state.player.health, state.score);

            animationId = requestAnimationFrame(gameLoop);
        };

        gameLoop();

        return () => {
            window.removeEventListener('resize', resize);
            window.removeEventListener('keydown', handleKeyDown);
            cancelAnimationFrame(animationId);
        };

    }, [screen]);

    const handleAnswer = (answer) => {
        const correct = questions[currentQuestion]?.answer === answer;
        if (correct) {
            setScore(s => s + 1);
            if (score + 1 === 3) setAwards(a => [...a, 'bronze']);
            if (score + 1 === 7) setAwards(a => [...a, 'silver']);
            if (score + 1 === 10) setAwards(a => [...a, 'gold']);
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
    
    if (screen === 'quiz') {
        const q = questions[currentQuestion];
        return (
             <div className="fixed inset-0 bg-[#0a1628] z-[9999] flex items-center justify-center p-4">
                <Card className="p-6 bg-[#0d1a2d]/95 border border-cyan-500/30 backdrop-blur w-full max-w-2xl">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-cyan-400 font-bold">Bonus Round</span>
                        <span className="text-gray-400">Question {currentQuestion + 1}/{questions.length}</span>
                    </div>
                    <h3 className="text-xl text-white mb-6 text-center">{q?.question}</h3>
                    <div className="flex gap-4">
                        <Button onClick={() => handleAnswer(false)} className="flex-1 h-14 text-lg border-2 border-red-500/50 bg-transparent hover:bg-red-500/20 text-red-400">No</Button>
                        <Button onClick={() => handleAnswer(true)} className="flex-1 h-14 text-lg border-2 border-green-500/50 bg-transparent hover:bg-green-500/20 text-green-400">Yes</Button>
                    </div>
                </Card>
            </div>
        )
    }

    if (screen === 'results') {
        const totalScore = gameScore + (score * 50);
        return (
            <div className="fixed inset-0 bg-[#0a1628] z-[9999] flex items-center justify-center">
                <Card className="p-10 bg-[#1a2d4a] border-cyan-500/50 text-center max-w-lg">
                    <Trophy className="w-24 h-24 mx-auto mb-6 text-yellow-400" />
                    <h2 className="text-4xl font-bold text-white mb-4">Mission Complete!</h2>
                    <p className="text-xl text-gray-400">Combat Score: {gameScore}</p>
                    <p className="text-xl text-gray-400">Knowledge Score: {score}/{questions.length}</p>
                    <p className="text-2xl text-cyan-400 mb-6">Total Score: {totalScore}</p>
                    <div className="flex justify-center gap-4 mb-8">
                        {awards.includes('gold') && <Award className="w-12 h-12 text-yellow-400" />}
                        {awards.includes('silver') && <Award className="w-12 h-12 text-gray-300" />}
                        {awards.includes('bronze') && <Award className="w-12 h-12 text-amber-600" />}
                    </div>
                    <div className="flex gap-4">
                        <Button onClick={() => setScreen('menu')} className="flex-1 bg-gray-700">New Mission</Button>
                        <Button onClick={onExit} className="flex-1 bg-cyan-600">Exit</Button>
                    </div>
                </Card>
            </div>
        );
    }

    if (screen === 'game') {
        return (
            <div className="fixed inset-0 bg-[#0a1628] z-[9999] cursor-none">
                <canvas ref={canvasRef} className="absolute inset-0" />
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
                        {loadingTopics ? <Loader2 className="w-8 h-8 animate-spin text-cyan-400" /> :
                         categories.map(cat => (
                            <Button key={cat} onClick={() => setActiveCategory(cat.toLowerCase())}
                                className={`px-5 py-2 ${activeCategory === cat.toLowerCase() ? 'bg-gradient-to-r from-cyan-600 to-blue-600' : 'bg-gray-700'} text-white`}>
                                {cat}
                            </Button>
                        ))}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {(topics[activeCategory] || []).map((topic) => (
                            <Button key={topic.id} onClick={() => startGame(topic)} 
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
                        <h3 className="text-lg font-bold mb-2 text-white">Destroy Targets</h3>
                        <p className="text-sm text-gray-400">Shoot down enemy ships to earn points.</p>
                    </Card>
                    <Card className="p-6 text-center bg-[#1a2d4a]/80 border-cyan-500/30">
                        <Sparkles className="w-12 h-12 mx-auto mb-4 text-yellow-400" />
                        <h3 className="text-lg font-bold mb-2 text-white">Knowledge Quiz</h3>
                        <p className="text-sm text-gray-400">Answer questions after the battle to boost your score.</p>
                    </Card>
                    <Card className="p-6 text-center bg-[#1a2d4a]/80 border-cyan-500/30">
                        <Trophy className="w-12 h-12 mx-auto mb-4 text-amber-500" />
                        <h3 className="text-lg font-bold mb-2 text-white">Achieve Highscore</h3>
                        <p className="text-sm text-gray-400">Combine combat and knowledge for the top rank.</p>
                    </Card>
                </div>
            </div>
        </div>
    );
}

// Drawing helpers
function drawPlayer(ctx, player) {
    ctx.fillStyle = '#00ffff';
    ctx.beginPath();
    ctx.moveTo(player.x, player.y - 20);
    ctx.lineTo(player.x - 20, player.y + 20);
    ctx.lineTo(player.x + 20, player.y + 20);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#ff3333';
    ctx.fillRect(player.x-2, player.y-25, 4, 10);
}

function drawBullet(ctx, bullet) {
    ctx.fillStyle = '#ffff00';
    ctx.fillRect(bullet.x - bullet.width/2, bullet.y, bullet.width, bullet.height);
}

function drawEnemy(ctx, enemy) {
    ctx.fillStyle = '#ff4444';
    ctx.beginPath();
    ctx.moveTo(enemy.x, enemy.y + 20);
    ctx.lineTo(enemy.x-20, enemy.y - 15);
    ctx.lineTo(enemy.x+20, enemy.y - 15);
    ctx.closePath();
    ctx.fill();
}

function spawnEnemy(state, canvasWidth) {
    state.enemies.push({
        x: Math.random() * canvasWidth,
        y: -30,
        width: 40,
        height: 40,
        speed: 1 + Math.random() * 2,
    });
}

function isColliding(obj1, obj2) {
    return obj1.x < obj2.x + obj2.width &&
           obj1.x + obj1.width > obj2.x &&
           obj1.y < obj2.y + obj2.height &&
           obj1.y + obj1.height > obj2.y;
}

function createExplosion(particles, x, y) {
    for (let i=0; i<30; i++) {
        particles.push({
            x, y,
            vx: (Math.random() - 0.5) * 5,
            vy: (Math.random() - 0.5) * 5,
            life: 30, maxLife: 30
        });
    }
}

function drawUI(ctx, health, score) {
    ctx.fillStyle = '#fff';
    ctx.font = '20px monospace';
    ctx.fillText(`Health: ${health}`, 20, 30);
    ctx.fillText(`Score: ${score}`, 20, 60);
}