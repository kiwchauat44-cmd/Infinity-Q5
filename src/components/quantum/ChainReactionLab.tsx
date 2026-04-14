import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Zap, Activity, Database, Settings, 
  Eye, Sliders, Play, RotateCcw, Info,
  Radio, Shield, Target, Flame, RefreshCcw
} from 'lucide-react';
import { ChainReactionConfig } from '../../types';

interface ChainReactionLabProps {
  isOpen: boolean;
  onClose: () => void;
  config: ChainReactionConfig;
  onChange: (config: ChainReactionConfig) => void;
  onReset: () => void;
}

const ChainReactionLab: React.FC<ChainReactionLabProps> = ({
  isOpen,
  onClose,
  config,
  onChange,
  onReset
}) => {
  const updateConfig = (key: keyof ChainReactionConfig, value: any) => {
    onChange({ ...config, [key]: value });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, x: 300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 300 }}
          className="fixed right-4 top-24 bottom-24 w-80 bg-black/80 backdrop-blur-xl border border-cyan-500/30 rounded-2xl z-[100] flex flex-col overflow-hidden shadow-[0_0_50px_rgba(6,182,212,0.2)]"
        >
          {/* Header */}
          <div className="p-4 border-b border-cyan-500/20 flex items-center justify-between bg-cyan-500/10">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-cyan-500/20 rounded-lg">
                <Activity className="text-cyan-400" size={18} />
              </div>
              <h2 className="text-cyan-100 font-bold tracking-wider uppercase text-sm">Chain Reaction Lab</h2>
            </div>
            <button 
              onClick={onClose}
              className="p-1 hover:bg-white/10 rounded-full transition-colors text-cyan-400"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
            {/* Simulation Controls */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-cyan-300 text-xs font-bold uppercase tracking-widest">
                <Sliders size={14} />
                <span>Reaction Parameters</span>
              </div>
              
              <div className="space-y-3">
                <ControlSlider 
                  label="Chain Sensitivity" 
                  value={config.sensitivity} 
                  onChange={(v) => updateConfig('sensitivity', v)}
                  icon={<Zap size={12} />}
                />
                <ControlSlider 
                  label="Instability Threshold" 
                  value={config.instabilityThreshold} 
                  onChange={(v) => updateConfig('instabilityThreshold', v)}
                  icon={<Activity size={12} />}
                />
                <ControlSlider 
                  label="Emission Count" 
                  value={config.emissionCount} 
                  min={1} max={10} step={1}
                  onChange={(v) => updateConfig('emissionCount', v)}
                  icon={<Radio size={12} />}
                />
                <ControlSlider 
                  label="Propagation Radius" 
                  value={config.propagationRadius} 
                  min={50} max={500} step={10}
                  onChange={(v) => updateConfig('propagationRadius', v)}
                  icon={<Target size={12} />}
                />
                <ControlSlider 
                  label="Decay Rate" 
                  value={config.decayRate} 
                  onChange={(v) => updateConfig('decayRate', v)}
                  icon={<Flame size={12} />}
                />
              </div>
            </div>

            {/* Matter Properties */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-cyan-300 text-xs font-bold uppercase tracking-widest">
                <Shield size={14} />
                <span>Matter Interaction</span>
              </div>
              
              <div className="space-y-3">
                <ControlSlider 
                  label="Absorber Strength" 
                  value={config.absorberStrength} 
                  onChange={(v) => updateConfig('absorberStrength', v)}
                  icon={<Shield size={12} />}
                />
                <ControlSlider 
                  label="Reflector Strength" 
                  value={config.reflectorStrength} 
                  onChange={(v) => updateConfig('reflectorStrength', v)}
                  icon={<RefreshCcw size={12} />}
                />
              </div>
            </div>

            {/* View Modes */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-cyan-300 text-xs font-bold uppercase tracking-widest">
                <Eye size={14} />
                <span>Visualization Mode</span>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <ViewModeButton 
                  active={config.viewMode === 'core'} 
                  onClick={() => updateConfig('viewMode', 'core')}
                  label="Core View"
                />
                <ViewModeButton 
                  active={config.viewMode === 'particle'} 
                  onClick={() => updateConfig('viewMode', 'particle')}
                  label="Particle View"
                />
                <ViewModeButton 
                  active={config.viewMode === 'path'} 
                  onClick={() => updateConfig('viewMode', 'path')}
                  label="Chain Path"
                />
                <ViewModeButton 
                  active={config.viewMode === 'heat'} 
                  onClick={() => updateConfig('viewMode', 'heat')}
                  label="Heat View"
                />
                <ViewModeButton 
                  active={config.viewMode === 'stability'} 
                  onClick={() => updateConfig('viewMode', 'stability')}
                  label="Stability"
                />
                <ViewModeButton 
                  active={config.viewMode === 'radiation'} 
                  onClick={() => updateConfig('viewMode', 'radiation')}
                  label="Radiation"
                />
              </div>
            </div>

            {/* Toggles */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
                <div className="flex items-center gap-2">
                  <Play size={14} className="text-cyan-400" />
                  <span className="text-xs text-cyan-100">Auto Chain Reaction</span>
                </div>
                <button 
                  onClick={() => updateConfig('autoChain', !config.autoChain)}
                  className={`w-10 h-5 rounded-full transition-colors relative ${config.autoChain ? 'bg-cyan-500' : 'bg-white/20'}`}
                >
                  <motion.div 
                    animate={{ x: config.autoChain ? 22 : 2 }}
                    className="absolute top-1 left-0 w-3 h-3 bg-white rounded-full shadow-lg"
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 bg-cyan-500/5 border-t border-cyan-500/20 flex gap-2">
            <button 
              onClick={onReset}
              className="flex-1 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold text-cyan-100 flex items-center justify-center gap-2 transition-all"
            >
              <RotateCcw size={14} />
              Reset Lab
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const ControlSlider: React.FC<{ 
  label: string; 
  value: number; 
  min?: number; 
  max?: number; 
  step?: number;
  onChange: (v: number) => void;
  icon: React.ReactNode;
}> = ({ label, value, min = 0, max = 1, step = 0.01, onChange, icon }) => (
  <div className="space-y-2">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 text-[10px] text-cyan-400/80 font-bold uppercase tracking-wider">
        {icon}
        <span>{label}</span>
      </div>
      <span className="text-[10px] font-mono text-cyan-300 bg-cyan-500/20 px-1.5 py-0.5 rounded">
        {value.toFixed(2)}
      </span>
    </div>
    <input 
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value))}
      className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-500"
    />
  </div>
);

const ViewModeButton: React.FC<{ active: boolean; onClick: () => void; label: string }> = ({ active, onClick, label }) => (
  <button 
    onClick={onClick}
    className={`py-2 px-3 rounded-xl text-[10px] font-bold transition-all border ${
      active 
        ? 'bg-cyan-500/20 border-cyan-500 text-cyan-100 shadow-[0_0_15px_rgba(6,182,212,0.3)]' 
        : 'bg-white/5 border-white/10 text-cyan-400/60 hover:bg-white/10'
    }`}
  >
    {label}
  </button>
);

export default ChainReactionLab;
