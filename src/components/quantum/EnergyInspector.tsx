import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Activity, Zap, Thermometer, Shield, Target, RefreshCcw, Bomb, Link, History, Sparkles } from 'lucide-react';
import { EnergyLayer, EnergyInfo } from '../../types';

interface EnergyInspectorProps {
  energy: EnergyLayer | null;
  onClose: () => void;
  energyInfo: EnergyInfo | undefined;
}

export default function EnergyInspector({ energy, onClose, energyInfo }: EnergyInspectorProps) {
  if (!energy || !energyInfo) return null;

  const stats = [
    { label: 'มวล', value: energyInfo.mass, unit: 'u', icon: <Target size={14} /> },
    { label: 'ประจุ', value: energy.charge, unit: 'e', icon: <Zap size={14} /> },
    { label: 'อุณหภูมิ', value: energy.heat, unit: '°C', icon: <Thermometer size={14} /> },
    { label: 'เสถียรภาพ', value: `${Math.round(energy.stability * 100)}%`, unit: '', icon: <Shield size={14} /> },
    { label: 'ความเร็ว', value: energyInfo.speed, unit: 'c', icon: <Activity size={14} /> },
  ];

  return (
    <AnimatePresence>
      {energy && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="fixed bottom-24 left-4 right-4 md:left-auto md:right-8 md:w-96 z-[80] bg-black/80 backdrop-blur-2xl border border-cyan-500/40 rounded-3xl p-6 shadow-[0_0_50px_rgba(0,255,255,0.2)]"
        >
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div 
                className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/30"
                style={{ color: energy.color }}
              >
                {energyInfo.icon}
              </div>
              <div>
                <h2 className="text-xl font-black italic tracking-tighter text-white">{energy.name}</h2>
                <p className="text-[10px] uppercase tracking-widest text-cyan-400 font-bold">{energyInfo.category}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
              <X size={20} />
            </button>
          </div>

          <p className="text-xs text-white/60 mb-6 leading-relaxed">{energyInfo.desc}</p>

          <div className="grid grid-cols-2 gap-3 mb-6">
            {stats.map((stat, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-3">
                <div className="flex items-center gap-2 text-white/40 mb-1">
                  {stat.icon}
                  <span className="text-[10px] font-bold uppercase">{stat.label}</span>
                </div>
                <div className="text-sm font-bold text-cyan-400">
                  {stat.value} <span className="text-[10px] text-white/40">{stat.unit}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-white/40 flex items-center gap-2">
              <Sparkles size={12} />
              ความสามารถพิเศษ
            </h4>
            <div className="flex flex-wrap gap-2">
              <div className="px-3 py-1.5 bg-green-500/10 border border-green-500/30 rounded-lg text-[10px] font-bold text-green-400 flex items-center gap-1">
                <RefreshCcw size={12} /> หลอมรวมได้
              </div>
              <div className="px-3 py-1.5 bg-red-500/10 border border-red-500/30 rounded-lg text-[10px] font-bold text-red-400 flex items-center gap-1">
                <Bomb size={12} /> ระเบิดได้
              </div>
              <div className="px-3 py-1.5 bg-blue-500/10 border border-blue-500/30 rounded-lg text-[10px] font-bold text-blue-400 flex items-center gap-1">
                <Link size={12} /> เชื่อมโยงได้
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-white/10">
            <div className="flex items-center justify-between text-[10px] font-bold text-white/40 uppercase mb-2">
              <span className="flex items-center gap-1"><History size={12} /> ประวัติการชนล่าสุด</span>
              <span className="text-cyan-400">เสถียร</span>
            </div>
            <div className="text-[10px] text-white/60 italic">
              ไม่มีการปะทะรุนแรงในช่วง 10 วินาทีที่ผ่านมา
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
