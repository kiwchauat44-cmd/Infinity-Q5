import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Search, Filter, Layers, Plus } from 'lucide-react';
import { EnergyInfo } from '../../types';

interface AllEnergyViewerProps {
  isOpen: boolean;
  onClose: () => void;
  energyTypes: EnergyInfo[];
  onSelectEnergy: (energy: EnergyInfo) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function AllEnergyViewer({
  isOpen,
  onClose,
  energyTypes,
  onSelectEnergy,
  searchQuery,
  onSearchChange
}: AllEnergyViewerProps) {
  const filteredEnergies = energyTypes.filter(energy => 
    energy.label.toLowerCase().includes(searchQuery.toLowerCase()) || 
    energy.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 z-[100] h-[80vh] bg-[#050505] border-t border-cyan-500/30 rounded-t-[3rem] shadow-[0_-10px_30px_rgba(0,0,0,0.5)] flex flex-col"
          >
            <div className="w-12 h-1.5 bg-white/10 rounded-full mx-auto mt-4 mb-2" />
            
            <div className="px-8 py-6 flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-black italic tracking-tighter text-cyan-400 glow-text">UNIVERSAL CATALOG</h2>
                <p className="text-[10px] uppercase tracking-widest text-cyan-500/60 font-bold">Explore all known matter and energy</p>
              </div>
              <button onClick={onClose} className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="px-8 mb-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={20} />
                <input
                  type="text"
                  placeholder="ค้นหาพลังงานหรือสสาร..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-base focus:outline-none focus:border-cyan-500/50 transition-colors"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-8 pb-12 no-scrollbar">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {filteredEnergies.map(energy => (
                  <motion.button
                    key={energy.id}
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onSelectEnergy(energy)}
                    className="aspect-square bg-white/5 hover:bg-cyan-500/10 border border-white/5 hover:border-cyan-500/30 rounded-[2rem] p-6 flex flex-col items-center justify-center gap-3 transition-all group relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div 
                      className="p-4 rounded-2xl bg-black/40 border border-white/10 group-hover:border-cyan-500/50 transition-colors shadow-lg"
                      style={{ color: energy.color }}
                    >
                      {energy.icon}
                    </div>
                    <div className="text-center">
                      <h3 className="font-bold text-xs group-hover:text-cyan-400 transition-colors">{energy.label}</h3>
                      <p className="text-[8px] text-white/20 uppercase font-bold tracking-widest mt-1">{energy.category}</p>
                    </div>
                    <div className="absolute top-3 right-3 p-1 bg-cyan-500 rounded-full text-black opacity-0 group-hover:opacity-100 transition-opacity scale-0 group-hover:scale-100">
                      <Plus size={12} strokeWidth={4} />
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
