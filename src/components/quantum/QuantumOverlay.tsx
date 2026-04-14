import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Zap, Activity, Atom, Globe, Sparkles, Flame, Cpu, Layers, MousePointer2, Move, RotateCw, Radio } from 'lucide-react';
import { EnergyLayer, EnergyInfo, ParticleBehavior } from '../../types';

const BEHAVIORS: { id: ParticleBehavior; label: string; icon: React.ReactNode }[] = [
  { id: 'static', label: 'คงที่', icon: <MousePointer2 size={12} /> },
  { id: 'pulsate', label: 'สั่นสะเทือน', icon: <Radio size={12} /> },
  { id: 'wander', label: 'ล่องลอย', icon: <Move size={12} /> },
  { id: 'orbit', label: 'โคจร', icon: <RotateCw size={12} /> },
];

interface QuantumOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  energyLayers: EnergyLayer[];
  onRemoveLayer: (id: string) => void;
  onToggleVisibility: (id: string) => void;
  onToggleLock: (id: string) => void;
  onUpdateLayer: (id: string, updates: Partial<EnergyLayer>) => void;
  onOpenLibrary: () => void;
  onOpenAllViewer: () => void;
  onOpenCollisionLab: () => void;
  viewMode: string;
  onViewModeChange: (mode: any) => void;
}

const VIEW_MODES = [
  { id: 'particle', label: 'อนุภาค', icon: <Atom size={14} /> },
  { id: 'wave', label: 'คลื่น', icon: <Activity size={14} /> },
  { id: 'cloud', label: 'เมฆพลังงาน', icon: <Sparkles size={14} /> },
  { id: 'field', label: 'สนามพลัง', icon: <Layers size={14} /> },
  { id: 'atomic-orbit', label: 'วงโคจร', icon: <Zap size={14} /> },
  { id: 'cosmic-map', label: 'แผนที่คอสมิก', icon: <Globe size={14} /> },
  { id: 'heat', label: 'ความร้อน', icon: <Flame size={14} /> },
  { id: 'charge', label: 'ประจุ', icon: <Cpu size={14} /> },
];

export default function QuantumOverlay({
  isOpen,
  onClose,
  energyLayers,
  onRemoveLayer,
  onToggleVisibility,
  onToggleLock,
  onUpdateLayer,
  onOpenLibrary,
  onOpenAllViewer,
  onOpenCollisionLab,
  viewMode,
  onViewModeChange
}: QuantumOverlayProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 pointer-events-none flex flex-col items-center justify-start p-4 md:p-8"
        >
          {/* Background Blur Overlay */}
          <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px] pointer-events-none" />

          {/* Top Control Panel */}
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="relative z-10 w-full max-w-4xl bg-black/40 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-4 pointer-events-auto shadow-[0_0_30px_rgba(0,255,255,0.1)]"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-cyan-500/20 rounded-lg">
                  <Cpu className="text-cyan-400 animate-pulse" size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-black italic tracking-tighter text-cyan-400 glow-text">QUANTUM INTERFACE</h2>
                  <p className="text-[10px] uppercase tracking-widest text-cyan-500/60 font-bold">Advanced Energy Simulation System</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-red-500/20 rounded-full transition-colors text-cyan-400 hover:text-red-400"
              >
                <X size={24} />
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <button 
                onClick={onOpenLibrary}
                className="flex items-center justify-center gap-2 p-3 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 rounded-xl transition-all group"
              >
                <Layers size={18} className="text-cyan-400 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-cyan-100">คลังพลังงาน</span>
              </button>
              <button 
                onClick={onOpenAllViewer}
                className="flex items-center justify-center gap-2 p-3 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 rounded-xl transition-all group"
              >
                <Globe size={18} className="text-purple-400 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-purple-100">ดูทั้งหมด</span>
              </button>
              <button 
                onClick={onOpenCollisionLab}
                className="flex items-center justify-center gap-2 p-3 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 rounded-xl transition-all group"
              >
                <Zap size={18} className="text-orange-400 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-orange-100">ห้องทดลองการชน</span>
              </button>
              <button className="flex items-center justify-center gap-2 p-3 bg-white/5 border border-white/10 rounded-xl opacity-50 cursor-not-allowed">
                <Sparkles size={18} className="text-white/40" />
                <span className="text-xs font-bold text-white/40">บันทึกพรีเซ็ต</span>
              </button>
            </div>
          </motion.div>

          {/* View Mode Selector */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="relative z-10 mt-4 flex gap-2 overflow-x-auto pb-2 no-scrollbar max-w-full pointer-events-auto"
          >
            {VIEW_MODES.map((mode) => (
              <button
                key={mode.id}
                onClick={() => onViewModeChange(mode.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all whitespace-nowrap ${
                  viewMode === mode.id 
                    ? 'bg-cyan-500 border-cyan-400 text-black font-bold shadow-[0_0_15px_rgba(0,255,255,0.5)]' 
                    : 'bg-black/40 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10'
                }`}
              >
                {mode.icon}
                <span className="text-xs">{mode.label}</span>
              </button>
            ))}
          </motion.div>

          {/* Active Layers Panel */}
          <div className="relative z-10 mt-8 w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pointer-events-auto overflow-y-auto max-h-[50vh] p-2 no-scrollbar">
            <AnimatePresence>
              {energyLayers.map((layer) => (
                <motion.div
                  key={layer.id}
                  layout
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="bg-black/60 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex flex-col gap-3 group hover:border-cyan-500/50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full shadow-[0_0_10px_currentColor]" 
                        style={{ backgroundColor: layer.color, color: layer.color }} 
                      />
                      <span className="font-bold text-sm tracking-tight">{layer.name}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button 
                        onClick={() => onToggleVisibility(layer.id)}
                        className={`p-1.5 rounded-lg transition-colors ${layer.isVisible ? 'text-cyan-400 bg-cyan-500/10' : 'text-white/20 bg-white/5'}`}
                      >
                        <Globe size={14} />
                      </button>
                      <button 
                        onClick={() => onToggleLock(layer.id)}
                        className={`p-1.5 rounded-lg transition-colors ${layer.isLocked ? 'text-orange-400 bg-orange-500/10' : 'text-white/20 bg-white/5'}`}
                      >
                        <Zap size={14} />
                      </button>
                      <button 
                        onClick={() => onRemoveLayer(layer.id)}
                        className="p-1.5 rounded-lg text-red-400 bg-red-500/10 hover:bg-red-500/20 transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                    <div className="col-span-2 mb-2">
                      <div className="text-[10px] text-white/40 font-bold uppercase mb-2">พฤติกรรม (BEHAVIOR)</div>
                      <div className="flex gap-1">
                        {BEHAVIORS.map((b) => (
                          <button
                            key={b.id}
                            onClick={() => onUpdateLayer(layer.id, { behavior: b.id })}
                            className={`flex-1 flex flex-col items-center gap-1 p-2 rounded-xl border transition-all ${
                              layer.behavior === b.id
                                ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400'
                                : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10'
                            }`}
                          >
                            {b.icon}
                            <span className="text-[8px] font-bold uppercase">{b.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] text-white/40 font-bold uppercase">
                        <span>ความสว่าง</span>
                        <span>{Math.round(layer.brightness * 100)}%</span>
                      </div>
                      <input 
                        type="range" 
                        min="0" max="2" step="0.1" 
                        value={layer.brightness}
                        onChange={(e) => onUpdateLayer(layer.id, { brightness: parseFloat(e.target.value) })}
                        className="w-full h-1 bg-white/10 rounded-full appearance-none accent-cyan-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] text-white/40 font-bold uppercase">
                        <span>ความหนาแน่น</span>
                        <span>{Math.round(layer.density * 100)}%</span>
                      </div>
                      <input 
                        type="range" 
                        min="0.1" max="5" step="0.1" 
                        value={layer.density}
                        onChange={(e) => onUpdateLayer(layer.id, { density: parseFloat(e.target.value) })}
                        className="w-full h-1 bg-white/10 rounded-full appearance-none accent-cyan-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] text-white/40 font-bold uppercase">
                        <span>ความร้อน</span>
                        <span>{layer.heat}°C</span>
                      </div>
                      <input 
                        type="range" 
                        min="-273" max="10000" step="100" 
                        value={layer.heat}
                        onChange={(e) => onUpdateLayer(layer.id, { heat: parseFloat(e.target.value) })}
                        className="w-full h-1 bg-white/10 rounded-full appearance-none accent-orange-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] text-white/40 font-bold uppercase">
                        <span>ความเสถียร</span>
                        <span>{Math.round(layer.stability * 100)}%</span>
                      </div>
                      <input 
                        type="range" 
                        min="0" max="1" step="0.05" 
                        value={layer.stability}
                        onChange={(e) => onUpdateLayer(layer.id, { stability: parseFloat(e.target.value) })}
                        className="w-full h-1 bg-white/10 rounded-full appearance-none accent-green-500"
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {energyLayers.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center py-12 text-white/20 border-2 border-dashed border-white/5 rounded-3xl">
                <Layers size={48} className="mb-4 opacity-20" />
                <p className="font-bold tracking-tight">ยังไม่มีชั้นพลังงานที่ใช้งาน</p>
                <p className="text-xs">เปิดคลังพลังงานเพื่อเพิ่มสสารหรือพลังงานใหม่</p>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
