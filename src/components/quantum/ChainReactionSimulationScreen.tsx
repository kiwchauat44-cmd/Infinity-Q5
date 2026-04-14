import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Zap, Activity, Database, Settings, 
  Eye, Sliders, Play, Pause, RotateCcw, Info,
  Radio, Shield, Target, Flame, RefreshCcw,
  ChevronLeft, ChevronRight, BarChart3, Clock,
  Maximize2, Minimize2, FastForward, SkipForward,
  Layers, Share2, Download, Trash2, Plus, Atom
} from 'lucide-react';
import { ForceType, ParticleType } from '../../types';

interface ReactionEvent {
  id: string;
  time: number;
  type: 'collision' | 'excitation' | 'emission' | 'decay' | 'split';
  description: string;
  energy: number;
}

interface SimObject {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  type: ForceType;
  mass: number;
  stability: number;
  energy: number;
  radius: number;
  color: string;
  isExcited: boolean;
  excitationLevel: number;
}

interface ChainReactionSimulationScreenProps {
  onBack: () => void;
}

export default function ChainReactionSimulationScreen({ onBack }: ChainReactionSimulationScreenProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isPlaying, setIsPlaying] = useState(true);
  const [timeScale, setTimeScale] = useState(1);
  const [objects, setObjects] = useState<SimObject[]>([]);
  const [events, setEvents] = useState<ReactionEvent[]>([]);
  const [viewMode, setViewMode] = useState<'particle' | 'path' | 'heat' | 'stability'>('particle');
  const [selectedObjectId, setSelectedObjectId] = useState<string | null>(null);
  const [showTimeline, setShowTimeline] = useState(true);
  const [showPaths, setShowPaths] = useState(true);
  const [showAffected, setShowAffected] = useState(true);
  const [simulationTime, setSimulationTime] = useState(0);
  const [showAftermath, setShowAftermath] = useState(false);
  const [aftermathData, setAftermathData] = useState<{totalEnergy: number, particlesCreated: number, maxChain: number} | null>(null);

  const objectsRef = useRef<SimObject[]>([]);
  const pathsRef = useRef<{x: number, y: number, color: string, life: number}[]>([]);
  const requestRef = useRef<number>();

  const stepSimulation = () => {
    if (isPlaying) setIsPlaying(false);
    update(0); // Force one update
  };

  const initScene = useCallback(() => {
    const newObjects: SimObject[] = [];
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    // Add a central heavy core
    newObjects.push({
      id: 'core-0',
      x: centerX,
      y: centerY,
      vx: 0,
      vy: 0,
      type: 'atomic-core',
      mass: 100,
      stability: 0.8,
      energy: 0,
      radius: 40,
      color: '#ff6347',
      isExcited: false,
      excitationLevel: 0
    });

    // Add surrounding fuel atoms
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const dist = 150 + Math.random() * 50;
      newObjects.push({
        id: `fuel-${i}`,
        x: centerX + Math.cos(angle) * dist,
        y: centerY + Math.sin(angle) * dist,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        type: 'atom',
        mass: 20,
        stability: 0.95,
        energy: 0,
        radius: 15,
        color: '#00ffff',
        isExcited: false,
        excitationLevel: 0
      });
    }

    objectsRef.current = newObjects;
    setObjects(newObjects);
    setEvents([]);
    pathsRef.current = [];
    setSimulationTime(0);
  }, []);

  const randomScene = () => {
    const newObjects: SimObject[] = [];
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    for (let i = 0; i < 20; i++) {
      const x = Math.random() * window.innerWidth;
      const y = Math.random() * window.innerHeight;
      const isCore = Math.random() < 0.2;
      
      newObjects.push({
        id: `obj-${Date.now()}-${i}`,
        x,
        y,
        vx: (Math.random() - 0.5) * 1,
        vy: (Math.random() - 0.5) * 1,
        type: isCore ? 'atomic-core' : 'atom',
        mass: isCore ? 80 : 20,
        stability: isCore ? 0.5 : 0.9,
        energy: 0,
        radius: isCore ? 30 : 15,
        color: isCore ? '#ff6347' : '#00ffff',
        isExcited: false,
        excitationLevel: 0
      });
    }

    objectsRef.current = newObjects;
    setObjects(newObjects);
    setEvents([]);
    pathsRef.current = [];
    setSimulationTime(0);
  };

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    initScene();
  }, [initScene]);

  const spawnTrigger = () => {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const angle = Math.random() * Math.PI * 2;
    const dist = 400;
    
    const trigger: SimObject = {
      id: `trigger-${Date.now()}`,
      x: centerX + Math.cos(angle) * dist,
      y: centerY + Math.sin(angle) * dist,
      vx: -Math.cos(angle) * 5,
      vy: -Math.sin(angle) * 5,
      type: 'neutron',
      mass: 5,
      stability: 1.0,
      energy: 10,
      radius: 5,
      color: '#ffffff',
      isExcited: false,
      excitationLevel: 0
    };

    objectsRef.current.push(trigger);
    setEvents(prev => [{
      id: Math.random().toString(),
      time: simulationTime,
      type: 'emission',
      description: 'Trigger Neutron Injected',
      energy: 10
    }, ...prev].slice(0, 20));
  };

  const update = useCallback((time: number) => {
    if (!isPlaying) {
      requestRef.current = requestAnimationFrame(update);
      return;
    }

    const dt = (1 / 60) * timeScale;
    setSimulationTime(prev => prev + dt);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update and Draw Objects
    const currentObjects = objectsRef.current;
    const nextObjects: SimObject[] = [];

    // Draw Paths
    if (showPaths) {
      pathsRef.current = pathsRef.current.filter(p => p.life > 0);
      pathsRef.current.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.life * 0.3;
        ctx.fill();
        p.life -= 0.01;
      });
      ctx.globalAlpha = 1;
    }

    for (let i = 0; i < currentObjects.length; i++) {
      const obj = currentObjects[i];
      
      // Physics
      obj.x += obj.vx * timeScale;
      obj.y += obj.vy * timeScale;

      // Bounds
      if (obj.x < 0 || obj.x > canvas.width) obj.vx *= -1;
      if (obj.y < 0 || obj.y > canvas.height) obj.vy *= -1;

      // Excitation decay
      if (obj.isExcited) {
        obj.excitationLevel -= 0.01 * timeScale;
        if (obj.excitationLevel <= 0) {
          obj.isExcited = false;
          obj.excitationLevel = 0;
        }
      }

      // Collision Detection
      for (let j = i + 1; j < currentObjects.length; j++) {
        const other = currentObjects[j];
        const dx = other.x - obj.x;
        const dy = other.y - obj.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const minPulse = obj.radius + other.radius;

        if (dist < minPulse) {
          // Collision Event
          handleCollision(obj, other);
        }
      }

      // Add to path
      if (showPaths && Math.random() < 0.2) {
        pathsRef.current.push({ x: obj.x, y: obj.y, color: obj.color, life: 1.0 });
      }

      // Draw
      drawObject(ctx, obj);
      nextObjects.push(obj);
    }

    objectsRef.current = nextObjects;
    setObjects([...nextObjects]);

    requestRef.current = requestAnimationFrame(update);
  }, [isPlaying, timeScale, showPaths, simulationTime]);

  const handleCollision = (a: SimObject, b: SimObject) => {
    // Simple elastic collision response
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const angle = Math.atan2(dy, dx);
    const sin = Math.sin(angle);
    const cos = Math.cos(angle);

    // Rotate velocities
    const vx1 = a.vx * cos + a.vy * sin;
    const vy1 = a.vy * cos - a.vx * sin;
    const vx2 = b.vx * cos + b.vy * sin;
    const vy2 = b.vy * cos - b.vx * sin;

    // Resolve collision
    const v1 = ((a.mass - b.mass) * vx1 + 2 * b.mass * vx2) / (a.mass + b.mass);
    const v2 = (2 * a.mass * vx1 + (b.mass - a.mass) * vx2) / (a.mass + b.mass);

    a.vx = v1 * cos - vy1 * sin;
    a.vy = vy1 * cos + v1 * sin;
    b.vx = v2 * cos - vy2 * sin;
    b.vy = vy2 * cos + v2 * sin;

    // Excitation
    a.isExcited = true;
    a.excitationLevel = 1.0;
    b.isExcited = true;
    b.excitationLevel = 1.0;

    // Log Event
    if (Math.random() < 0.3) {
      setEvents(prev => [{
        id: Math.random().toString(),
        time: simulationTime,
        type: 'collision',
        description: `${a.type} collided with ${b.type}`,
        energy: (a.mass + b.mass) * 0.1
      }, ...prev].slice(0, 20));
    }

    // Split Logic (Nuclear Style)
    if (a.type === 'atomic-core' && a.excitationLevel > 0.8 && Math.random() < 0.2) {
      splitObject(a);
    }
  };

  const splitObject = (obj: SimObject) => {
    const index = objectsRef.current.indexOf(obj);
    if (index > -1) {
      objectsRef.current.splice(index, 1);
      
      // Create fragments
      for (let i = 0; i < 3; i++) {
        const angle = (i / 3) * Math.PI * 2 + Math.random();
        objectsRef.current.push({
          id: `frag-${Date.now()}-${i}`,
          x: obj.x,
          y: obj.y,
          vx: Math.cos(angle) * 3,
          vy: Math.sin(angle) * 3,
          type: 'neutron',
          mass: 5,
          stability: 1.0,
          energy: 5,
          radius: 6,
          color: '#ffffff',
          isExcited: false,
          excitationLevel: 0
        });
      }

      setEvents(prev => [{
        id: Math.random().toString(),
        time: simulationTime,
        type: 'split',
        description: `Atomic Core Fission Event`,
        energy: 50
      }, ...prev].slice(0, 20));

      if (objectsRef.current.length > 50) {
        setShowAftermath(true);
        setAftermathData({
          totalEnergy: objectsRef.current.reduce((acc, o) => acc + o.energy, 0),
          particlesCreated: objectsRef.current.length,
          maxChain: Math.floor(objectsRef.current.length / 10)
        });
      }
    }
  };

  const drawObject = (ctx: CanvasRenderingContext2D, obj: SimObject) => {
    ctx.save();
    ctx.translate(obj.x, obj.y);

    // Glow
    ctx.shadowBlur = obj.isExcited ? 20 * obj.excitationLevel : 10;
    ctx.shadowColor = obj.color;

    // Body
    ctx.beginPath();
    ctx.arc(0, 0, obj.radius, 0, Math.PI * 2);
    ctx.fillStyle = obj.color;
    ctx.fill();

    // Excitation Ring
    if (obj.isExcited) {
      ctx.beginPath();
      ctx.arc(0, 0, obj.radius + 5 * obj.excitationLevel, 0, Math.PI * 2);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.globalAlpha = obj.excitationLevel;
      ctx.stroke();
    }

    // Label
    if (viewMode === 'stability') {
      ctx.fillStyle = '#ffffff';
      ctx.font = '8px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`${Math.round(obj.stability * 100)}%`, 0, obj.radius + 12);
    }

    ctx.restore();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    requestRef.current = requestAnimationFrame(update);
    return () => cancelAnimationFrame(requestRef.current!);
  }, [update]);

  return (
    <div className="fixed inset-0 z-[200] bg-[#05050a] flex flex-col overflow-hidden font-sans text-white">
      {/* Simulation Canvas */}
      <canvas 
        ref={canvasRef}
        className="absolute inset-0 z-0"
        onClick={(e) => {
          const canvas = canvasRef.current;
          if (!canvas) return;
          const rect = canvas.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          
          const clicked = objects.find(o => {
            const dx = o.x - x;
            const dy = o.y - y;
            return Math.sqrt(dx * dx + dy * dy) < o.radius + 10;
          });
          
          setSelectedObjectId(clicked ? clicked.id : null);
        }}
      />

      {/* Top Header */}
      <div className={`relative z-10 ${isMobile ? 'p-4' : 'p-6'} flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent`}>
        <div className="flex items-center gap-3 md:gap-4">
          <button 
            onClick={onBack}
            className={`${isMobile ? 'p-2' : 'p-3'} bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl md:rounded-2xl transition-all group`}
          >
            <ChevronLeft className="text-cyan-400 group-hover:-translate-x-1 transition-transform" size={isMobile ? 20 : 24} />
          </button>
          <div>
            <h1 className={`${isMobile ? 'text-lg' : 'text-2xl'} font-black italic tracking-tighter text-cyan-400 glow-text`}>NUCLEAR LAB</h1>
            {!isMobile && <p className="text-[10px] uppercase tracking-widest text-cyan-500/60 font-bold">Educational Reaction Simulation</p>}
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <div className={`${isMobile ? 'px-2 py-1' : 'px-4 py-2'} bg-black/40 backdrop-blur-md border border-white/10 rounded-lg md:rounded-xl flex items-center gap-2 md:gap-3`}>
            <Clock size={isMobile ? 12 : 16} className="text-cyan-400" />
            <span className={`${isMobile ? 'text-xs' : 'text-sm'} font-mono text-cyan-100`}>{simulationTime.toFixed(1)}s</span>
          </div>
          <button 
            onClick={spawnTrigger}
            className={`${isMobile ? 'px-3 py-2' : 'px-6 py-2.5'} bg-cyan-500 hover:bg-cyan-400 text-black font-black italic rounded-lg md:rounded-xl transition-all active:scale-95 shadow-[0_0_20px_rgba(0,255,255,0.3)] flex items-center gap-2`}
          >
            <Zap size={isMobile ? 14 : 18} />
            <span className={isMobile ? 'text-[10px]' : 'text-sm'}>INJECT</span>
          </button>
        </div>
      </div>

      {/* Main UI Layout */}
      <div className={`relative z-10 flex-1 flex ${isMobile ? 'flex-col-reverse justify-start' : 'justify-between'} p-4 md:p-6 pointer-events-none overflow-hidden`}>
        {/* Left Panel: Timeline */}
        <AnimatePresence>
          {showTimeline && (
            <motion.div 
              initial={isMobile ? { y: 300, opacity: 0 } : { x: -300, opacity: 0 }}
              animate={{ x: 0, y: 0, opacity: 1 }}
              exit={isMobile ? { y: 300, opacity: 0 } : { x: -300, opacity: 0 }}
              className={`${isMobile ? 'w-full h-48 mt-4' : 'w-72'} bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-4 md:p-5 flex flex-col pointer-events-auto shadow-2xl`}
            >
              <div className="flex items-center justify-between mb-3 md:mb-4">
                <div className="flex items-center gap-2 text-[10px] md:text-xs font-black text-cyan-400 uppercase tracking-widest">
                  <BarChart3 size={isMobile ? 12 : 14} />
                  <span>Timeline</span>
                </div>
                <button onClick={() => setShowTimeline(false)} className="text-white/20 hover:text-white/60">
                  <X size={14} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-2 md:space-y-3 pr-2 no-scrollbar">
                {events.map(event => (
                  <div key={event.id} className="p-2 md:p-3 bg-white/5 rounded-xl border border-white/5 hover:border-cyan-500/30 transition-colors group">
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-[7px] md:text-[8px] font-black uppercase px-1.5 py-0.5 rounded ${
                        event.type === 'split' ? 'bg-red-500/20 text-red-400' : 
                        event.type === 'collision' ? 'bg-orange-500/20 text-orange-400' : 
                        'bg-cyan-500/20 text-cyan-400'
                      }`}>
                        {event.type}
                      </span>
                      <span className="text-[7px] md:text-[8px] font-mono text-white/40">{event.time.toFixed(1)}s</span>
                    </div>
                    <p className="text-[9px] md:text-[10px] text-white/80 leading-tight">{event.description}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Right Panel: Controls & Info */}
        <div className={`${isMobile ? 'w-full' : 'w-80'} flex flex-col gap-3 md:gap-4 pointer-events-auto`}>
          {/* Simulation Controls */}
          <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-4 md:p-5 shadow-2xl">
            <div className="flex items-center justify-between mb-3 md:mb-4">
              <div className="flex items-center gap-2 text-[10px] md:text-xs font-black text-cyan-400 uppercase tracking-widest">
                <Settings size={isMobile ? 12 : 14} />
                <span>Controls</span>
              </div>
              {isMobile && (
                <div className="flex gap-2">
                   <button onClick={() => setShowTimeline(!showTimeline)} className={`p-1.5 rounded-lg border ${showTimeline ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400' : 'bg-white/5 border-white/10 text-white/20'}`}>
                    <BarChart3 size={14} />
                  </button>
                </div>
              )}
            </div>

            <div className={`grid ${isMobile ? 'grid-cols-5' : 'grid-cols-3'} gap-2 mb-4 md:mb-6`}>
              <ControlBtn 
                onClick={() => setIsPlaying(!isPlaying)}
                active={isPlaying}
                icon={isPlaying ? <Pause size={isMobile ? 16 : 18} /> : <Play size={isMobile ? 16 : 18} />}
                label={isPlaying ? 'Pause' : 'Play'}
                isMobile={isMobile}
              />
              <ControlBtn 
                onClick={stepSimulation}
                icon={<SkipForward size={isMobile ? 16 : 18} />}
                label="Step"
                isMobile={isMobile}
              />
              <ControlBtn 
                onClick={initScene}
                icon={<RotateCcw size={isMobile ? 16 : 18} />}
                label="Reset"
                isMobile={isMobile}
              />
              <ControlBtn 
                onClick={randomScene}
                icon={<RefreshCcw size={isMobile ? 16 : 18} />}
                label="Rand"
                isMobile={isMobile}
              />
              <ControlBtn 
                onClick={() => setTimeScale(timeScale === 1 ? 0.2 : 1)}
                active={timeScale < 1}
                icon={<Clock size={isMobile ? 16 : 18} />}
                label="Slow"
                isMobile={isMobile}
                activeColor="border-orange-500 text-orange-400 bg-orange-500/20"
              />
            </div>

            {!isMobile && (
              <>
                <div className="space-y-4">
                  <div className="text-[10px] text-white/40 font-black uppercase tracking-widest">Visualization</div>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'particle', label: 'Particles', icon: <Atom size={12} /> },
                      { id: 'path', label: 'Paths', icon: <Activity size={12} /> },
                      { id: 'heat', label: 'Thermal', icon: <Flame size={12} /> },
                      { id: 'stability', label: 'Stability', icon: <Shield size={12} /> }
                    ].map(mode => (
                      <button
                        key={mode.id}
                        onClick={() => setViewMode(mode.id as any)}
                        className={`flex items-center gap-2 p-2.5 rounded-xl border text-[10px] font-bold transition-all ${
                          viewMode === mode.id 
                            ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400' 
                            : 'bg-white/5 border-white/10 text-white/40'
                        }`}
                      >
                        {mode.icon}
                        {mode.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-6 space-y-2">
                  <Toggle label="Show Paths" active={showPaths} onToggle={() => setShowPaths(!showPaths)} />
                  <Toggle label="Show Affected" active={showAffected} onToggle={() => setShowAffected(!showAffected)} />
                  <Toggle label="Show Timeline" active={showTimeline} onToggle={() => setShowTimeline(!showTimeline)} />
                </div>
              </>
            )}
          </div>

          {/* Object Info */}
          {!isMobile && (
            <div className="flex-1 bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-5 overflow-hidden flex flex-col shadow-2xl">
              <div className="flex items-center gap-2 text-xs font-black text-cyan-400 uppercase tracking-widest mb-4">
                <Info size={14} />
                <span>Object Inspector</span>
              </div>
              
              {selectedObjectId ? (
                <div className="space-y-4">
                  {objects.filter(o => o.id === selectedObjectId).map(obj => (
                    <div key={obj.id} className="space-y-3">
                      <div className="flex items-center gap-3 p-3 bg-white/5 rounded-2xl border border-white/10">
                        <div className="w-10 h-10 rounded-full" style={{ backgroundColor: obj.color, boxShadow: `0 0 20px ${obj.color}` }} />
                        <div>
                          <div className="text-xs font-black text-white uppercase">{obj.type}</div>
                          <div className="text-[8px] text-white/40 font-mono">{obj.id}</div>
                        </div>
                      </div>
                      <InfoRow label="Mass" value={`${obj.mass} amu`} />
                      <InfoRow label="Stability" value={`${Math.round(obj.stability * 100)}%`} />
                      <InfoRow label="Energy" value={`${obj.energy.toFixed(1)} MeV`} />
                      <InfoRow label="Excitation" value={`${Math.round(obj.excitationLevel * 100)}%`} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center text-white/20 border-2 border-dashed border-white/5 rounded-2xl p-4">
                  <Target size={32} className="mb-2 opacity-10" />
                  <p className="text-[10px] font-bold">Select an object on the canvas to view detailed reaction data</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Status Bar */}
      <div className={`relative z-10 ${isMobile ? 'p-3' : 'p-4'} bg-black/60 backdrop-blur-md border-t border-white/10 flex items-center justify-between`}>
        <div className={`flex ${isMobile ? 'gap-3' : 'gap-6'}`}>
          <StatusItem label="Particles" value={objects.length.toString()} color="text-cyan-400" isMobile={isMobile} />
          <StatusItem label="Energy" value={`${Math.round(objects.reduce((acc, o) => acc + o.energy, 0))} MeV`} color="text-orange-400" isMobile={isMobile} />
          {!isMobile && <StatusItem label="Reaction State" value={objects.some(o => o.isExcited) ? 'ACTIVE' : 'STABLE'} color={objects.some(o => o.isExcited) ? 'text-red-400' : 'text-green-400'} isMobile={isMobile} />}
        </div>
        <div className="text-[8px] md:text-[10px] font-mono text-white/20">
          {isMobile ? 'LAB_OS v2.4' : 'QUANTUM_LAB_OS v2.4.0 // SIM_ENGINE_ACTIVE'}
        </div>
      </div>
    </div>
  );
}

function Toggle({ label, active, onToggle }: { label: string, active: boolean, onToggle: () => void }) {
  return (
    <div className="flex items-center justify-between p-2 bg-white/5 rounded-xl border border-white/5">
      <span className="text-[10px] font-bold text-white/60">{label}</span>
      <button 
        onClick={onToggle}
        className={`w-8 h-4 rounded-full transition-colors relative ${active ? 'bg-cyan-500' : 'bg-white/10'}`}
      >
        <motion.div 
          animate={{ x: active ? 18 : 2 }}
          className="absolute top-1 left-0 w-2 h-2 bg-white rounded-full"
        />
      </button>
    </div>
  );
}

function StatusItem({ label, value, color, isMobile }: { label: string, value: string, color: string, isMobile?: boolean }) {
  return (
    <div className="flex flex-col">
      <span className={`${isMobile ? 'text-[7px]' : 'text-[8px]'} font-black text-white/40 uppercase tracking-widest`}>{label}</span>
      <span className={`${isMobile ? 'text-xs' : 'text-sm'} font-black ${color} drop-shadow-[0_0_8px_rgba(0,0,0,0.5)]`}>{value}</span>
    </div>
  );
}

function ControlBtn({ onClick, active, icon, label, isMobile, activeColor = 'border-cyan-400 text-cyan-400 bg-cyan-400/10 shadow-[0_0_15px_rgba(34,211,238,0.2)]' }: any) {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-1.5 ${isMobile ? 'p-2' : 'p-3'} rounded-xl md:rounded-2xl border transition-all active:scale-95 ${
        active ? activeColor : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10 hover:border-white/20'
      }`}
    >
      <div className={`${active ? 'animate-pulse' : ''}`}>
        {icon}
      </div>
      <span className={`${isMobile ? 'text-[7px]' : 'text-[9px]'} font-black uppercase tracking-tighter`}>{label}</span>
    </button>
  );
}

function InfoRow({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-white/5">
      <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{label}</span>
      <span className="text-xs font-mono text-white/80">{value}</span>
    </div>
  );
}
