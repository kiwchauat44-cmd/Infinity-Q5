import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Search, Filter, Atom, Cpu, Globe, Flame, Zap, Sparkles, ChevronRight } from 'lucide-react';
import { EnergyInfo } from '../../types';

interface EnergyLibrarySidebarProps {
  isOpen: boolean;
  onClose: () => void;
  categories: { id: string; label: string; icon: any }[];
  energyTypes: EnergyInfo[];
  onSelectEnergy: (energy: EnergyInfo) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filterCategory: string | null;
  onFilterChange: (category: string | null) => void;
  onUpdateColor: (type: string, color: string) => void;
  customColors: Record<string, string>;
}

export default function EnergyLibrarySidebar({
  isOpen,
  onClose,
  categories,
  energyTypes,
  onSelectEnergy,
  searchQuery,
  onSearchChange,
  filterCategory,
  onFilterChange,
  onUpdateColor,
  customColors
}: EnergyLibrarySidebarProps) {
  const filteredEnergies = energyTypes.filter(energy => {
    const matchesSearch = energy.label.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         energy.desc.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !filterCategory || energy.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 z-[70] h-full w-full max-w-md bg-[#050505] border-l border-cyan-500/30 shadow-[-10px_0_30px_rgba(0,0,0,0.5)] flex flex-col"
          >
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black italic tracking-tighter text-cyan-400 glow-text">ENERGY LIBRARY</h2>
                <p className="text-[10px] uppercase tracking-widest text-cyan-500/60 font-bold">Universal Matter Catalog</p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="p-4 space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                <input
                  type="text"
                  placeholder="ค้นหาพลังงานหรือสสาร..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-cyan-500/50 transition-colors"
                />
              </div>

              <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                <button
                  onClick={() => onFilterChange(null)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                    !filterCategory ? 'bg-cyan-500 text-black' : 'bg-white/5 text-white/40 hover:bg-white/10'
                  }`}
                >
                  ทั้งหมด
                </button>
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => onFilterChange(cat.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                      filterCategory === cat.id ? 'bg-cyan-500 text-black' : 'bg-white/5 text-white/40 hover:bg-white/10'
                    }`}
                  >
                    {cat.icon}
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2 no-scrollbar">
              {filteredEnergies.map(energy => (
                <motion.button
                  key={energy.id}
                  whileHover={{ x: 5 }}
                  onClick={() => onSelectEnergy(energy)}
                  className="w-full flex items-center gap-4 p-4 bg-white/5 hover:bg-cyan-500/10 border border-white/5 hover:border-cyan-500/30 rounded-2xl transition-all group text-left"
                >
                  <div 
                    className="p-3 rounded-xl bg-black/40 border border-white/10 group-hover:border-cyan-500/50 transition-colors relative"
                    style={{ color: customColors[energy.id] || energy.color }}
                  >
                    {energy.icon}
                    <input 
                      type="color"
                      value={customColors[energy.id] || energy.color}
                      onChange={(e) => {
                        e.stopPropagation();
                        onUpdateColor(energy.id, e.target.value);
                      }}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-sm group-hover:text-cyan-400 transition-colors">{energy.label}</h3>
                    <p className="text-[10px] text-white/40 line-clamp-1">{energy.desc}</p>
                  </div>
                  <ChevronRight size={16} className="text-white/20 group-hover:text-cyan-400 transition-colors" />
                </motion.button>
              ))}
              
              {filteredEnergies.length === 0 && (
                <div className="py-20 text-center text-white/20">
                  <Search size={48} className="mx-auto mb-4 opacity-10" />
                  <p className="font-bold">ไม่พบข้อมูลที่ค้นหา</p>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
