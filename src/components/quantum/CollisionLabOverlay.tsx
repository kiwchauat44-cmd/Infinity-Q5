import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Zap, Play, RefreshCcw, Plus, Trash2, Activity, Shield, Thermometer, Target } from 'lucide-react';
import { EnergyInfo, CollisionResult } from '../../types';

interface CollisionLabOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  energyTypes: EnergyInfo[];
  onStartCollision: (selected: EnergyInfo[]) => void;
  collisionResult: CollisionResult | null;
}

export default function CollisionLabOverlay({
  isOpen,
  onClose,
  energyTypes,
  onStartCollision,
  collisionResult
}: CollisionLabOverlayProps) {
  const [selectedEnergies, setSelectedEnergies] = useState<EnergyInfo[]>([]);
  const [isSelecting, setIsSelecting] = useState(false);

  const addEnergy = (energy: EnergyInfo) => {
    if (selectedEnergies.length < 5) {
      setSelectedEnergies([...selectedEnergies, energy]);
      setIsSelecting(false);
    }
  };

  const removeEnergy = (index: number) => {
    setSelectedEnergies(selectedEnergies.filter((_, i) => i !== index));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[110] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 md:p-8"
        >
          <div className="w-full max-w-6xl h-full flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-orange-500/20 rounded-2xl border border-orange-500/40">
                  <Zap className="text-orange-400 animate-pulse" size={32} />
                </div>
                <div>
                  <h2 className="text-4xl font-black italic tracking-tighter text-orange-400 glow-text">COLLISION LAB</h2>
                  <p className="text-xs uppercase tracking-widest text-orange-500/60 font-bold">High-Energy Particle Accelerator</p>
                </div>
              </div>
              <button onClick={onClose} className="p-3 hover:bg-white/5 rounded-full transition-colors">
                <X size={32} />
              </button>
            </div>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-8 overflow-hidden">
              {/* Selection Area */}
              <div className="lg:col-span-2 flex flex-col gap-6 overflow-hidden">
                <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 flex-1 flex flex-col items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,165,0,0.05),transparent_70%)]" />
                  
                  <div className="flex flex-wrap justify-center gap-6 relative z-10">
                    {selectedEnergies.map((energy, i) => (
                      <motion.div
                        key={i}
                        initial={{ scale: 0, rotate: -20 }}
                        animate={{ scale: 1, rotate: 0 }}
                        className="relative group"
                      >
                        <div 
                          className="w-24 h-24 rounded-3xl bg-black/60 border-2 border-white/10 flex items-center justify-center shadow-2xl transition-all group-hover:border-orange-500/50"
                          style={{ color: energy.color }}
                        >
                          {energy.icon}
                        </div>
                        <button 
                          onClick={() => removeEnergy(i)}
                          className="absolute -top-2 -right-2 p-1.5 bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 size={12} />
                        </button>
                        <p className="text-center text-[10px] font-bold mt-2 text-white/60">{energy.label}</p>
                      </motion.div>
                    ))}

                    {selectedEnergies.length < 5 && (
                      <button 
                        onClick={() => setIsSelecting(true)}
                        className="w-24 h-24 rounded-3xl border-2 border-dashed border-white/10 hover:border-orange-500/50 flex flex-col items-center justify-center gap-2 text-white/20 hover:text-orange-400 transition-all group"
                      >
                        <Plus size={24} className="group-hover:scale-110 transition-transform" />
                        <span className="text-[10px] font-bold">เพิ่มพลังงาน</span>
                      </button>
                    )}
                  </div>

                  <div className="mt-12 flex gap-4 relative z-10">
                    <button 
                      disabled={selectedEnergies.length < 2}
                      onClick={() => onStartCollision(selectedEnergies)}
                      className="flex items-center gap-3 px-12 py-4 bg-orange-500 hover:bg-orange-400 disabled:opacity-30 disabled:hover:bg-orange-500 text-black font-black italic rounded-2xl transition-all shadow-[0_0_30px_rgba(255,165,0,0.3)] hover:shadow-[0_0_50px_rgba(255,165,0,0.5)]"
                    >
                      <Play size={20} fill="currentColor" />
                      เริ่มการชน
                    </button>
                    <button 
                      onClick={() => setSelectedEnergies([])}
                      className="p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-colors"
                    >
                      <RefreshCcw size={20} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Results Area */}
              <div className="bg-black/40 border border-white/10 rounded-[2.5rem] p-8 flex flex-col gap-6 overflow-y-auto no-scrollbar">
                <h3 className="text-xl font-black italic tracking-tighter text-white flex items-center gap-2">
                  <Activity size={20} className="text-orange-400" />
                  ผลลัพธ์การทดลอง
                </h3>

                {collisionResult ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    <div className="p-6 bg-orange-500/10 border border-orange-500/30 rounded-3xl">
                      <div className="text-[10px] font-black uppercase tracking-widest text-orange-400 mb-1">พลังงานที่เกิดใหม่</div>
                      <div className="text-2xl font-black italic text-white">{collisionResult.outcome}</div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white/5 rounded-2xl p-4">
                        <div className="flex items-center gap-2 text-white/40 text-[10px] font-bold uppercase mb-1">
                          <Zap size={12} /> พลังงานที่เปลี่ยน
                        </div>
                        <div className={`text-lg font-bold ${collisionResult.energyChange > 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {collisionResult.energyChange > 0 ? '+' : ''}{collisionResult.energyChange.toFixed(1)} GeV
                        </div>
                      </div>
                      <div className="bg-white/5 rounded-2xl p-4">
                        <div className="flex items-center gap-2 text-white/40 text-[10px] font-bold uppercase mb-1">
                          <Shield size={12} /> ความเสถียร
                        </div>
                        <div className="text-lg font-bold text-cyan-400">
                          {Math.round(collisionResult.stability * 100)}%
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="text-[10px] font-black uppercase tracking-widest text-white/40">รายละเอียดการปะทะ</div>
                      <p className="text-xs text-white/60 leading-relaxed italic">
                        "{collisionResult.description}"
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div className="text-[10px] font-black uppercase tracking-widest text-white/40">ปฏิกิริยาย่อย</div>
                      <div className="flex flex-wrap gap-2">
                        {collisionResult.events.map((event, i) => (
                          <span key={i} className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[10px] font-bold text-white/60">
                            {event}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-white/20 text-center">
                    <Activity size={64} className="mb-4 opacity-10" />
                    <p className="font-bold">รอการเริ่มทดลอง...</p>
                    <p className="text-[10px]">เลือกพลังงานอย่างน้อย 2 ชนิดเพื่อเริ่มการชน</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Energy Selection Modal */}
          <AnimatePresence>
            {isSelecting && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="absolute inset-0 z-[120] bg-black/80 backdrop-blur-md flex items-center justify-center p-8"
              >
                <div className="w-full max-w-4xl bg-[#050505] border border-white/10 rounded-[3rem] p-8 flex flex-col max-h-full">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-2xl font-black italic tracking-tighter text-white">เลือกพลังงาน</h3>
                    <button onClick={() => setIsSelecting(false)} className="p-2 hover:bg-white/5 rounded-full">
                      <X size={24} />
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 no-scrollbar">
                    {energyTypes.map(energy => (
                      <button
                        key={energy.id}
                        onClick={() => addEnergy(energy)}
                        className="bg-white/5 hover:bg-orange-500/10 border border-white/5 hover:border-orange-500/30 rounded-2xl p-4 flex flex-col items-center gap-2 transition-all group"
                      >
                        <div className="text-white/60 group-hover:text-orange-400 transition-colors" style={{ color: energy.color }}>
                          {energy.icon}
                        </div>
                        <span className="text-xs font-bold">{energy.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
