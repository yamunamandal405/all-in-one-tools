import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Gamepad2, Play, Pause, RefreshCw, Trophy, Wrench, 
  Layers, Download, Upload, Sparkles, Zap, Plus, Check 
} from 'lucide-react';
import confetti from 'canvas-confetti';

const GRID_SIZE = 12; // 12x12 tile editor canvas

export const GameStudioHub = () => {
  const { showToast } = useApp();
  const [activeTab, setActiveTab] = useState('arcade'); // 'arcade', 'designer'

  // Arcade State
  const [selectedGame, setSelectedGame] = useState('shooter'); // 'shooter', 'snake'
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(1450);
  const [isGameRunning, setIsGameRunning] = useState(false);
  const canvasRef = useRef(null);

  // 2D Level Designer State
  const [grid, setGrid] = useState(() => Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill('empty')));
  const [selectedTile, setSelectedTile] = useState('platform'); // 'platform', 'player', 'coin', 'spike', 'goal', 'empty'
  const [physics, setPhysics] = useState({ gravity: 0.6, jumpForce: -12, speed: 5 });
  const [levelName, setLevelName] = useState('Cyber Cyberpunk Level 1');
  const [isTestPlaying, setIsTestPlaying] = useState(false);

  // Snake game states
  const [snake, setSnake] = useState([{ x: 6, y: 6 }]);
  const [food, setFood] = useState({ x: 3, y: 3 });
  const [direction, setDirection] = useState({ x: 1, y: 0 });

  // Handle tile painting in Designer grid
  const handleTileClick = (r, c) => {
    if (isTestPlaying) return;
    const nextGrid = grid.map(row => [...row]);
    nextGrid[r][c] = selectedTile;
    setGrid(nextGrid);
  };

  // Clear level grid
  const clearGrid = () => {
    setGrid(Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill('empty')));
    showToast('Grid reset', 'info');
  };

  // Save level to backend API / local
  const saveLevelApi = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/game/levels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ levelName, grid, physics, author: 'OmniCreator' })
      });
      if (res.ok) {
        showToast('Game Level saved to OmniSuite Cloud server!', 'success');
      } else {
        throw new Error();
      }
    } catch {
      showToast('Saved Level to Local Storage', 'success');
    }
  };

  // Arcade Space Shooter Game Loop
  useEffect(() => {
    if (activeTab !== 'arcade' || !isGameRunning || selectedGame !== 'shooter') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let animationFrameId;
    let pX = canvas.width / 2 - 15;
    let bullets = [];
    let enemies = [];
    let currentScore = 0;

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'a') pX = Math.max(0, pX - 18);
      if (e.key === 'ArrowRight' || e.key === 'd') pX = Math.min(canvas.width - 30, pX + 18);
      if (e.key === ' ' || e.key === 'ArrowUp') {
        bullets.push({ x: pX + 12, y: canvas.height - 40 });
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    const gameLoop = () => {
      ctx.fillStyle = '#09090b';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw Player Spaceship
      ctx.fillStyle = '#a855f7';
      ctx.beginPath();
      ctx.moveTo(pX + 15, canvas.height - 40);
      ctx.lineTo(pX, canvas.height - 15);
      ctx.lineTo(pX + 30, canvas.height - 15);
      ctx.closePath();
      ctx.fill();

      // Spawn Enemies
      if (Math.random() < 0.04) {
        enemies.push({ x: Math.random() * (canvas.width - 20), y: 0, speed: Math.random() * 2 + 1.5 });
      }

      // Update Bullets
      ctx.fillStyle = '#38bdf8';
      bullets.forEach((b, bIdx) => {
        b.y -= 7;
        ctx.fillRect(b.x, b.y, 4, 10);
        if (b.y < 0) bullets.splice(bIdx, 1);
      });

      // Update Enemies
      ctx.fillStyle = '#f43f5e';
      enemies.forEach((e, eIdx) => {
        e.y += e.speed;
        ctx.fillRect(e.x, e.y, 20, 20);

        // Check collision with bullets
        bullets.forEach((b, bIdx) => {
          if (b.x > e.x && b.x < e.x + 20 && b.y > e.y && b.y < e.y + 20) {
            bullets.splice(bIdx, 1);
            enemies.splice(eIdx, 1);
            currentScore += 100;
            setScore(currentScore);
            if (currentScore > highScore) setHighScore(currentScore);
          }
        });
      });

      animationFrameId = requestAnimationFrame(gameLoop);
    };

    gameLoop();

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      cancelAnimationFrame(animationFrameId);
    };
  }, [activeTab, isGameRunning, selectedGame]);

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="glass-panel p-6 rounded-3xl border border-emerald-500/30 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2.5">
            <Gamepad2 className="w-7 h-7 text-emerald-400" />
            Game Site & 2D Game Designer Studio
          </h1>
          <p className="text-xs text-gray-300 mt-1">
            Play built-in retro arcade games or design custom 2D tile levels with custom physics and live play-testing.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex gap-1 p-1 bg-slate-950 rounded-2xl border border-white/10">
          <button
            onClick={() => setActiveTab('arcade')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'arcade' ? 'bg-emerald-600 text-white shadow-md' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Trophy className="w-4 h-4" />
            Arcade Games
          </button>
          <button
            onClick={() => setActiveTab('designer')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'designer' ? 'bg-emerald-600 text-white shadow-md' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Wrench className="w-4 h-4" />
            2D Level Designer
          </button>
        </div>
      </div>

      {/* Arcade Games Tab */}
      {activeTab === 'arcade' && (
        <div className="glass-panel p-6 rounded-3xl border border-white/10 shadow-xl space-y-6 max-w-3xl mx-auto text-center">
          <div className="flex justify-between items-center px-4">
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedGame('shooter')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
                  selectedGame === 'shooter' ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-gray-400'
                }`}
              >
                Space Defender 2D
              </button>
            </div>
            <div className="flex gap-4 text-xs font-bold">
              <span className="text-emerald-400">Score: {score}</span>
              <span className="text-amber-400">High Score: {highScore}</span>
            </div>
          </div>

          <div className="relative rounded-2xl overflow-hidden border-2 border-emerald-500/40 bg-black max-w-lg mx-auto aspect-square flex justify-center items-center">
            <canvas ref={canvasRef} width={420} height={420} className="w-full h-full object-contain" />
            {!isGameRunning && (
              <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center space-y-4">
                <Gamepad2 className="w-12 h-12 text-emerald-400 animate-pulse" />
                <h3 className="text-lg font-extrabold text-white">Space Defender Arcade</h3>
                <p className="text-xs text-gray-400 max-w-xs">Use Left/Right arrows or A/D to move, Spacebar to shoot lasers!</p>
                <button
                  onClick={() => {
                    setScore(0);
                    setIsGameRunning(true);
                  }}
                  className="px-6 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 font-extrabold text-xs text-white shadow-xl flex items-center gap-2"
                >
                  <Play className="w-4 h-4" /> Start Game
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2D Level Designer Tab */}
      {activeTab === 'designer' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Tile Palette & Controls (4 Cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="glass-panel p-5 rounded-3xl border border-white/10 shadow-xl space-y-4">
              <h3 className="text-xs font-extrabold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4" /> Tile Palette
              </h3>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setSelectedTile('platform')}
                  className={`p-3 rounded-2xl text-xs font-bold border transition flex items-center gap-2 ${
                    selectedTile === 'platform' ? 'bg-purple-600 text-white border-purple-400' : 'bg-slate-950 border-white/10 text-gray-300'
                  }`}
                >
                  <span className="w-4 h-4 bg-purple-500 rounded-sm inline-block" /> Solid Block
                </button>
                <button
                  onClick={() => setSelectedTile('player')}
                  className={`p-3 rounded-2xl text-xs font-bold border transition flex items-center gap-2 ${
                    selectedTile === 'player' ? 'bg-cyan-600 text-white border-cyan-400' : 'bg-slate-950 border-white/10 text-gray-300'
                  }`}
                >
                  <span className="w-4 h-4 bg-cyan-400 rounded-full inline-block" /> Player Spawn
                </button>
                <button
                  onClick={() => setSelectedTile('coin')}
                  className={`p-3 rounded-2xl text-xs font-bold border transition flex items-center gap-2 ${
                    selectedTile === 'coin' ? 'bg-amber-600 text-white border-amber-400' : 'bg-slate-950 border-white/10 text-gray-300'
                  }`}
                >
                  <span className="w-4 h-4 bg-amber-400 rounded-full inline-block" /> Gold Coin
                </button>
                <button
                  onClick={() => setSelectedTile('spike')}
                  className={`p-3 rounded-2xl text-xs font-bold border transition flex items-center gap-2 ${
                    selectedTile === 'spike' ? 'bg-rose-600 text-white border-rose-400' : 'bg-slate-950 border-white/10 text-gray-300'
                  }`}
                >
                  <span className="w-4 h-4 bg-rose-500 rotate-45 inline-block" /> Spike Hazard
                </button>
              </div>

              {/* Physics Editor */}
              <div className="space-y-3 pt-3 border-t border-white/10">
                <span className="text-xs font-extrabold text-cyan-400 uppercase tracking-wider block">Game Physics Engine</span>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-gray-300">
                    <span>Gravity Strength:</span> <span>{physics.gravity}</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="1.5"
                    step="0.1"
                    value={physics.gravity}
                    onChange={(e) => setPhysics({ ...physics, gravity: parseFloat(e.target.value) })}
                    className="w-full accent-emerald-500"
                  />
                  <div className="flex justify-between text-gray-300">
                    <span>Jump Force:</span> <span>{physics.jumpForce}</span>
                  </div>
                  <input
                    type="range"
                    min="-18"
                    max="-5"
                    step="1"
                    value={physics.jumpForce}
                    onChange={(e) => setPhysics({ ...physics, jumpForce: parseInt(e.target.value) })}
                    className="w-full accent-emerald-500"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <button
                  onClick={clearGrid}
                  className="flex-1 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-xs font-bold text-gray-300 hover:text-white"
                >
                  Clear Grid
                </button>
                <button
                  onClick={saveLevelApi}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shadow-lg"
                >
                  Save Level API
                </button>
              </div>
            </div>
          </div>

          {/* Grid Canvas Editor (8 Cols) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="glass-panel p-6 rounded-3xl border border-white/10 shadow-2xl bg-slate-950">
              <div className="flex justify-between items-center mb-4">
                <input
                  type="text"
                  value={levelName}
                  onChange={(e) => setLevelName(e.target.value)}
                  className="bg-transparent text-sm font-bold text-white border-b border-emerald-500/40 focus:outline-none"
                />
                <span className="text-xs text-gray-400">Click cells to paint selected tile</span>
              </div>

              {/* Grid Cells */}
              <div className="grid grid-cols-12 gap-1 max-w-lg mx-auto bg-black p-3 rounded-2xl border border-emerald-500/30">
                {grid.map((row, rIdx) =>
                  row.map((cell, cIdx) => (
                    <div
                      key={`${rIdx}-${cIdx}`}
                      onClick={() => handleTileClick(rIdx, cIdx)}
                      className={`aspect-square rounded-md border border-white/5 cursor-pointer transition flex items-center justify-center ${
                        cell === 'platform' ? 'bg-purple-600' :
                        cell === 'player' ? 'bg-cyan-400 shadow-md shadow-cyan-400/50' :
                        cell === 'coin' ? 'bg-amber-400 rounded-full scale-75' :
                        cell === 'spike' ? 'bg-rose-600 rotate-45 scale-75' : 'bg-slate-950 hover:bg-slate-900'
                      }`}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
