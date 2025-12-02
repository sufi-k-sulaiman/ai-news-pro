import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw, Heart, Target, Trophy } from 'lucide-react';

// Tank images
const PLAYER_TANK = 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/692729a5f5180fbd43f297e9/dca90a2df_tank1.png';
const ENEMY_TANK_1 = 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/692729a5f5180fbd43f297e9/abb6f137a_tank2.png';
const ENEMY_TANK_2 = 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/692729a5f5180fbd43f297e9/7a4edc67f_tank3.png';

const TILE = 32;
const MAP_W = 13;
const MAP_H = 13;
const CANVAS_W = MAP_W * TILE;
const CANVAS_H = MAP_H * TILE;

// Tile types
const TILE_EMPTY = 0;
const TILE_BRICK = 1;
const TILE_STEEL = 2;
const TILE_FOREST = 3;
const TILE_BASE = 5;
const TILE_BASE_D = 6;

// Stage 1 map
const INITIAL_MAP = [
    0,0,0,0,0,0,0,0,0,0,0,0,0,
    0,1,1,0,1,1,0,1,1,0,1,1,0,
    0,1,1,0,1,1,0,1,1,0,1,1,0,
    0,0,0,0,0,0,0,0,0,0,0,0,0,
    0,0,0,1,1,0,2,0,1,1,0,0,0,
    0,3,0,1,1,0,2,0,1,1,0,3,0,
    0,3,0,0,0,0,0,0,0,0,0,3,0,
    0,0,0,0,0,0,0,0,0,0,0,0,0,
    1,1,0,0,0,0,0,0,0,0,0,1,1,
    1,1,0,0,0,0,0,0,0,0,0,1,1,
    0,0,0,0,1,1,0,1,1,0,0,0,0,
    0,0,0,0,1,0,5,0,1,0,0,0,0,
    0,0,0,0,1,0,5,0,1,0,0,0,0,
];

export default function TankCity() {
    const canvasRef = useRef(null);
    const gameRef = useRef(null);
    const keysRef = useRef({});
    const imagesRef = useRef({});
    
    const [gameState, setGameState] = useState('menu'); // menu, playing, paused, gameover, victory
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(3);
    const [stage, setStage] = useState(1);
    const [enemiesLeft, setEnemiesLeft] = useState(10);
    const [highScore, setHighScore] = useState(() => {
        const saved = localStorage.getItem('tankCityHighScore');
        return saved ? parseInt(saved) : 0;
    });

    // Load images
    useEffect(() => {
        const loadImage = (src) => {
            return new Promise((resolve) => {
                const img = new Image();
                img.onload = () => resolve(img);
                img.onerror = () => resolve(null);
                img.src = src;
            });
        };

        Promise.all([
            loadImage(PLAYER_TANK),
            loadImage(ENEMY_TANK_1),
            loadImage(ENEMY_TANK_2),
        ]).then(([player, enemy1, enemy2]) => {
            imagesRef.current = { player, enemy1, enemy2 };
        });
    }, []);

    // Game class
    class Game {
        constructor(canvas, images) {
            this.canvas = canvas;
            this.ctx = canvas.getContext('2d');
            this.images = images;
            this.running = false;
            this.map = [...INITIAL_MAP];
            this.player = null;
            this.enemies = [];
            this.bullets = [];
            this.particles = [];
            this.powerUps = [];
            this.score = 0;
            this.lives = 3;
            this.stage = 1;
            this.enemiesLeft = 10;
            this.enemiesTotal = 10;
            this.spawnTimer = 0;
            this.lastTime = 0;
            this.init();
        }

        init() {
            this.map = [...INITIAL_MAP];
            this.player = {
                x: 6 * TILE,
                y: 10 * TILE,
                dir: 0, // 0=up, 1=right, 2=down, 3=left
                speed: 3,
                shootTimer: 0,
                power: 1,
            };
            this.enemies = [];
            this.bullets = [];
            this.particles = [];
            this.powerUps = [];
            this.spawnEnemy();
            this.spawnEnemy();
        }

        spawnEnemy() {
            if (this.enemiesTotal <= 0) return;
            const spawnPoints = [[0, 0], [6 * TILE, 0], [12 * TILE, 0]];
            const [x, y] = spawnPoints[Math.floor(Math.random() * 3)];
            
            // Check if spawn point is clear
            const blocked = this.enemies.some(e => 
                Math.abs(e.x - x) < TILE && Math.abs(e.y - y) < TILE
            );
            if (blocked) return;

            this.enemies.push({
                x, y,
                dir: 2,
                speed: 1 + Math.random() * 0.5,
                shootTimer: 60 + Math.random() * 60,
                type: Math.random() > 0.5 ? 1 : 2,
                health: 1,
            });
            this.enemiesTotal--;
        }

        spawnParticles(x, y, color = '#ff6600') {
            for (let i = 0; i < 10; i++) {
                this.particles.push({
                    x, y,
                    vx: (Math.random() - 0.5) * 8,
                    vy: (Math.random() - 0.5) * 8,
                    life: 20,
                    color,
                });
            }
        }

        canMove(x, y, entity) {
            const left = Math.floor(x / TILE);
            const top = Math.floor(y / TILE);
            const right = Math.floor((x + TILE - 1) / TILE);
            const bottom = Math.floor((y + TILE - 1) / TILE);

            for (let ty = top; ty <= bottom; ty++) {
                for (let tx = left; tx <= right; tx++) {
                    if (tx < 0 || ty < 0 || tx >= MAP_W || ty >= MAP_H) return false;
                    const tile = this.map[ty * MAP_W + tx];
                    if (tile === TILE_BRICK || tile === TILE_STEEL || tile === TILE_BASE || tile === TILE_BASE_D) {
                        return false;
                    }
                }
            }

            // Check collision with other tanks
            const others = entity === this.player ? this.enemies : [this.player, ...this.enemies.filter(e => e !== entity)];
            for (const o of others) {
                if (!o) continue;
                if (Math.abs(o.x - x) < TILE - 4 && Math.abs(o.y - y) < TILE - 4) {
                    return false;
                }
            }
            return true;
        }

        updatePlayer(keys) {
            if (!this.player) return;
            
            if (this.player.shootTimer > 0) this.player.shootTimer--;

            let newX = this.player.x;
            let newY = this.player.y;
            let moved = false;

            if (keys.ArrowUp || keys.w || keys.W) {
                this.player.dir = 0;
                newY -= this.player.speed;
                moved = true;
            } else if (keys.ArrowRight || keys.d || keys.D) {
                this.player.dir = 1;
                newX += this.player.speed;
                moved = true;
            } else if (keys.ArrowDown || keys.s || keys.S) {
                this.player.dir = 2;
                newY += this.player.speed;
                moved = true;
            } else if (keys.ArrowLeft || keys.a || keys.A) {
                this.player.dir = 3;
                newX -= this.player.speed;
                moved = true;
            }

            if (moved && this.canMove(newX, newY, this.player)) {
                this.player.x = Math.max(0, Math.min(CANVAS_W - TILE, newX));
                this.player.y = Math.max(0, Math.min(CANVAS_H - TILE, newY));
            }

            if ((keys[' '] || keys.Space) && this.player.shootTimer === 0) {
                this.shoot(this.player, true);
                this.player.shootTimer = this.player.power === 2 ? 10 : 20;
            }
        }

        updateEnemies() {
            this.spawnTimer++;
            if (this.spawnTimer > 180 && this.enemies.length < 4 && this.enemiesTotal > 0) {
                this.spawnEnemy();
                this.spawnTimer = 0;
            }

            for (const enemy of this.enemies) {
                enemy.shootTimer--;

                // Random direction change or shoot
                if (Math.random() < 0.02 || enemy.shootTimer <= 0) {
                    enemy.dir = Math.floor(Math.random() * 4);
                    if (Math.random() < 0.3) {
                        this.shoot(enemy, false);
                    }
                    enemy.shootTimer = 60 + Math.random() * 60;
                }

                // Move
                let dx = 0, dy = 0;
                if (enemy.dir === 0) dy = -enemy.speed;
                if (enemy.dir === 1) dx = enemy.speed;
                if (enemy.dir === 2) dy = enemy.speed;
                if (enemy.dir === 3) dx = -enemy.speed;

                const newX = enemy.x + dx;
                const newY = enemy.y + dy;

                if (this.canMove(newX, newY, enemy)) {
                    enemy.x = Math.max(0, Math.min(CANVAS_W - TILE, newX));
                    enemy.y = Math.max(0, Math.min(CANVAS_H - TILE, newY));
                } else {
                    enemy.dir = Math.floor(Math.random() * 4);
                }
            }
        }

        shoot(tank, friendly) {
            let bx = tank.x + TILE / 2 - 3;
            let by = tank.y + TILE / 2 - 3;

            if (tank.dir === 0) by = tank.y - 6;
            if (tank.dir === 1) bx = tank.x + TILE;
            if (tank.dir === 2) by = tank.y + TILE;
            if (tank.dir === 3) bx = tank.x - 6;

            this.bullets.push({
                x: bx,
                y: by,
                dir: tank.dir,
                speed: 8,
                friendly,
            });
        }

        updateBullets() {
            this.bullets = this.bullets.filter(bullet => {
                // Move
                if (bullet.dir === 0) bullet.y -= bullet.speed;
                if (bullet.dir === 1) bullet.x += bullet.speed;
                if (bullet.dir === 2) bullet.y += bullet.speed;
                if (bullet.dir === 3) bullet.x -= bullet.speed;

                // Out of bounds
                if (bullet.x < 0 || bullet.x > CANVAS_W || bullet.y < 0 || bullet.y > CANVAS_H) {
                    return false;
                }

                // Tile collision
                const tx = Math.floor(bullet.x / TILE);
                const ty = Math.floor(bullet.y / TILE);
                if (tx >= 0 && ty >= 0 && tx < MAP_W && ty < MAP_H) {
                    const tile = this.map[ty * MAP_W + tx];
                    if (tile === TILE_BRICK) {
                        this.map[ty * MAP_W + tx] = TILE_EMPTY;
                        this.spawnParticles(bullet.x, bullet.y, '#aa6633');
                        return false;
                    }
                    if (tile === TILE_STEEL) {
                        this.spawnParticles(bullet.x, bullet.y, '#888888');
                        return false;
                    }
                    if (tile === TILE_BASE) {
                        this.map[ty * MAP_W + tx] = TILE_BASE_D;
                        this.spawnParticles(bullet.x, bullet.y, '#ffff00');
                        this.gameOver();
                        return false;
                    }
                }

                // Tank collision
                if (bullet.friendly) {
                    for (let i = this.enemies.length - 1; i >= 0; i--) {
                        const enemy = this.enemies[i];
                        if (Math.abs(enemy.x + TILE/2 - bullet.x) < TILE/2 + 4 && 
                            Math.abs(enemy.y + TILE/2 - bullet.y) < TILE/2 + 4) {
                            this.spawnParticles(enemy.x + TILE/2, enemy.y + TILE/2);
                            this.enemies.splice(i, 1);
                            this.score += 100;
                            this.enemiesLeft--;
                            setScore(this.score);
                            setEnemiesLeft(this.enemiesLeft);

                            if (Math.random() < 0.15) {
                                this.powerUps.push({
                                    x: enemy.x,
                                    y: enemy.y,
                                    type: Math.random() > 0.5 ? 'star' : 'life',
                                });
                            }

                            if (this.enemiesLeft <= 0 && this.enemies.length === 0) {
                                this.victory();
                            }
                            return false;
                        }
                    }
                } else {
                    if (this.player && 
                        Math.abs(this.player.x + TILE/2 - bullet.x) < TILE/2 + 4 && 
                        Math.abs(this.player.y + TILE/2 - bullet.y) < TILE/2 + 4) {
                        this.spawnParticles(this.player.x + TILE/2, this.player.y + TILE/2, '#00ff00');
                        this.lives--;
                        setLives(this.lives);
                        if (this.lives <= 0) {
                            this.gameOver();
                        } else {
                            this.player.x = 6 * TILE;
                            this.player.y = 10 * TILE;
                            this.player.dir = 0;
                        }
                        return false;
                    }
                }

                return true;
            });
        }

        updateParticles() {
            this.particles = this.particles.filter(p => {
                p.x += p.vx;
                p.y += p.vy;
                p.vx *= 0.95;
                p.vy *= 0.95;
                p.life--;
                return p.life > 0;
            });
        }

        updatePowerUps() {
            this.powerUps = this.powerUps.filter(p => {
                if (!this.player) return true;
                if (Math.abs(p.x + TILE/2 - (this.player.x + TILE/2)) < TILE && 
                    Math.abs(p.y + TILE/2 - (this.player.y + TILE/2)) < TILE) {
                    if (p.type === 'star') {
                        this.player.power = 2;
                        this.score += 50;
                    } else if (p.type === 'life') {
                        this.lives++;
                        setLives(this.lives);
                    }
                    setScore(this.score);
                    return false;
                }
                return true;
            });
        }

        gameOver() {
            this.running = false;
            if (this.score > highScore) {
                localStorage.setItem('tankCityHighScore', this.score.toString());
                setHighScore(this.score);
            }
            setGameState('gameover');
        }

        victory() {
            this.running = false;
            this.score += 500;
            setScore(this.score);
            if (this.score > highScore) {
                localStorage.setItem('tankCityHighScore', this.score.toString());
                setHighScore(this.score);
            }
            setGameState('victory');
        }

        draw() {
            const ctx = this.ctx;
            ctx.fillStyle = '#1a1a2e';
            ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

            // Draw tiles
            for (let y = 0; y < MAP_H; y++) {
                for (let x = 0; x < MAP_W; x++) {
                    const tile = this.map[y * MAP_W + x];
                    const px = x * TILE;
                    const py = y * TILE;

                    if (tile === TILE_BRICK) {
                        ctx.fillStyle = '#b85c38';
                        ctx.fillRect(px, py, TILE, TILE);
                        ctx.fillStyle = '#8b4513';
                        ctx.fillRect(px, py, TILE/2, TILE/2);
                        ctx.fillRect(px + TILE/2, py + TILE/2, TILE/2, TILE/2);
                    } else if (tile === TILE_STEEL) {
                        ctx.fillStyle = '#708090';
                        ctx.fillRect(px, py, TILE, TILE);
                        ctx.fillStyle = '#a0a0a0';
                        ctx.fillRect(px + 4, py + 4, TILE - 8, TILE - 8);
                    } else if (tile === TILE_FOREST) {
                        ctx.fillStyle = '#228b22';
                        ctx.fillRect(px, py, TILE, TILE);
                        ctx.fillStyle = '#32cd32';
                        for (let i = 0; i < 4; i++) {
                            ctx.fillRect(px + Math.random() * 20, py + Math.random() * 20, 8, 8);
                        }
                    } else if (tile === TILE_BASE) {
                        ctx.fillStyle = '#ffd700';
                        ctx.fillRect(px + 4, py + 4, TILE - 8, TILE - 8);
                        ctx.fillStyle = '#ff4500';
                        ctx.beginPath();
                        ctx.arc(px + TILE/2, py + TILE/2, 8, 0, Math.PI * 2);
                        ctx.fill();
                    } else if (tile === TILE_BASE_D) {
                        ctx.fillStyle = '#444';
                        ctx.fillRect(px, py, TILE, TILE);
                    }
                }
            }

            // Draw power-ups
            for (const p of this.powerUps) {
                ctx.fillStyle = p.type === 'star' ? '#ffff00' : '#ff69b4';
                ctx.beginPath();
                ctx.arc(p.x + TILE/2, p.y + TILE/2, 12, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = '#fff';
                ctx.font = 'bold 14px Arial';
                ctx.textAlign = 'center';
                ctx.fillText(p.type === 'star' ? '★' : '♥', p.x + TILE/2, p.y + TILE/2 + 5);
            }

            // Draw tanks
            const drawTank = (tank, image, rotation) => {
                ctx.save();
                ctx.translate(tank.x + TILE/2, tank.y + TILE/2);
                ctx.rotate(rotation);
                if (image) {
                    ctx.drawImage(image, -TILE/2, -TILE/2, TILE, TILE);
                } else {
                    ctx.fillStyle = '#00ff00';
                    ctx.fillRect(-TILE/2, -TILE/2, TILE, TILE);
                }
                ctx.restore();
            };

            // Player
            if (this.player) {
                const rotations = [0, Math.PI/2, Math.PI, -Math.PI/2];
                drawTank(this.player, this.images.player, rotations[this.player.dir]);
            }

            // Enemies
            for (const enemy of this.enemies) {
                const rotations = [0, Math.PI/2, Math.PI, -Math.PI/2];
                const img = enemy.type === 1 ? this.images.enemy1 : this.images.enemy2;
                drawTank(enemy, img, rotations[enemy.dir]);
            }

            // Draw bullets
            for (const bullet of this.bullets) {
                ctx.fillStyle = bullet.friendly ? '#00ff00' : '#ff0000';
                ctx.beginPath();
                ctx.arc(bullet.x, bullet.y, 4, 0, Math.PI * 2);
                ctx.fill();
            }

            // Draw particles
            for (const p of this.particles) {
                ctx.globalAlpha = p.life / 20;
                ctx.fillStyle = p.color;
                ctx.fillRect(p.x - 3, p.y - 3, 6, 6);
            }
            ctx.globalAlpha = 1;

            // Draw forest on top (tanks hide under)
            for (let y = 0; y < MAP_H; y++) {
                for (let x = 0; x < MAP_W; x++) {
                    if (this.map[y * MAP_W + x] === TILE_FOREST) {
                        ctx.fillStyle = 'rgba(34, 139, 34, 0.7)';
                        ctx.fillRect(x * TILE, y * TILE, TILE, TILE);
                    }
                }
            }
        }

        update(keys) {
            if (!this.running) return;
            this.updatePlayer(keys);
            this.updateEnemies();
            this.updateBullets();
            this.updateParticles();
            this.updatePowerUps();
            this.draw();
        }
    }

    const startGame = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const game = new Game(canvas, imagesRef.current);
        game.running = true;
        gameRef.current = game;
        
        setScore(0);
        setLives(3);
        setStage(1);
        setEnemiesLeft(10);
        setGameState('playing');

        const loop = () => {
            if (game.running) {
                game.update(keysRef.current);
                requestAnimationFrame(loop);
            }
        };
        requestAnimationFrame(loop);
    }, []);

    const togglePause = useCallback(() => {
        if (!gameRef.current) return;
        if (gameState === 'playing') {
            gameRef.current.running = false;
            setGameState('paused');
        } else if (gameState === 'paused') {
            gameRef.current.running = true;
            setGameState('playing');
            const loop = () => {
                if (gameRef.current?.running) {
                    gameRef.current.update(keysRef.current);
                    requestAnimationFrame(loop);
                }
            };
            requestAnimationFrame(loop);
        }
    }, [gameState]);

    // Keyboard handlers
    useEffect(() => {
        const handleKeyDown = (e) => {
            keysRef.current[e.key] = true;
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
                e.preventDefault();
            }
            if (e.key === 'Escape') {
                togglePause();
            }
        };
        const handleKeyUp = (e) => {
            keysRef.current[e.key] = false;
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [togglePause]);

    // Draw initial screen
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#1a1a2e';
        ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
        ctx.fillStyle = '#ffd700';
        ctx.font = 'bold 32px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('TANK CITY', CANVAS_W/2, CANVAS_H/2 - 40);
        ctx.fillStyle = '#fff';
        ctx.font = '16px Arial';
        ctx.fillText('Press START to play', CANVAS_W/2, CANVAS_H/2 + 20);
    }, []);

    return (
        <div className="flex flex-col items-center gap-4 p-4 bg-gray-900 rounded-xl">
            {/* Stats bar */}
            <div className="flex items-center justify-between w-full max-w-md bg-gray-800 rounded-lg p-3">
                <div className="flex items-center gap-2 text-red-400">
                    <Heart className="w-5 h-5" fill="currentColor" />
                    <span className="font-bold">{lives}</span>
                </div>
                <div className="flex items-center gap-2 text-yellow-400">
                    <Trophy className="w-5 h-5" />
                    <span className="font-bold">{score}</span>
                </div>
                <div className="flex items-center gap-2 text-blue-400">
                    <Target className="w-5 h-5" />
                    <span className="font-bold">{enemiesLeft}</span>
                </div>
            </div>

            {/* Game canvas */}
            <div className="relative">
                <canvas
                    ref={canvasRef}
                    width={CANVAS_W}
                    height={CANVAS_H}
                    className="border-4 border-gray-700 rounded-lg"
                    style={{ imageRendering: 'pixelated' }}
                />

                {/* Overlays */}
                {gameState === 'menu' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/70 rounded-lg">
                        <Button onClick={startGame} size="lg" className="gap-2 bg-green-600 hover:bg-green-700">
                            <Play className="w-5 h-5" /> START GAME
                        </Button>
                    </div>
                )}

                {gameState === 'paused' && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 rounded-lg gap-4">
                        <h2 className="text-3xl font-bold text-yellow-400">PAUSED</h2>
                        <Button onClick={togglePause} size="lg" className="gap-2">
                            <Play className="w-5 h-5" /> RESUME
                        </Button>
                    </div>
                )}

                {gameState === 'gameover' && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 rounded-lg gap-4">
                        <h2 className="text-3xl font-bold text-red-500">GAME OVER</h2>
                        <p className="text-xl text-white">Score: {score}</p>
                        <p className="text-sm text-gray-400">High Score: {highScore}</p>
                        <Button onClick={startGame} size="lg" className="gap-2">
                            <RotateCcw className="w-5 h-5" /> PLAY AGAIN
                        </Button>
                    </div>
                )}

                {gameState === 'victory' && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 rounded-lg gap-4">
                        <h2 className="text-3xl font-bold text-green-400">VICTORY!</h2>
                        <p className="text-xl text-white">Score: {score}</p>
                        <p className="text-sm text-gray-400">High Score: {highScore}</p>
                        <Button onClick={startGame} size="lg" className="gap-2 bg-green-600 hover:bg-green-700">
                            <Play className="w-5 h-5" /> NEXT STAGE
                        </Button>
                    </div>
                )}
            </div>

            {/* Controls */}
            <div className="flex gap-2">
                {gameState === 'playing' && (
                    <Button onClick={togglePause} variant="outline" size="sm" className="gap-1">
                        <Pause className="w-4 h-4" /> Pause
                    </Button>
                )}
                <Button onClick={startGame} variant="outline" size="sm" className="gap-1">
                    <RotateCcw className="w-4 h-4" /> Restart
                </Button>
            </div>

            {/* Instructions */}
            <div className="text-center text-gray-400 text-sm">
                <p>Arrow Keys or WASD to move • Space to shoot • ESC to pause</p>
            </div>
        </div>
    );
}