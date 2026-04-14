import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Cpu } from 'lucide-react';

interface QuantumFloatingButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

export default function QuantumFloatingButton({ isOpen, onClick }: QuantumFloatingButtonProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isIdle, setIsIdle] = useState(false);
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);

  const resetIdleTimer = () => {
    setIsIdle(false);
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    idleTimerRef.current = setTimeout(() => {
      if (!isOpen) setIsIdle(true);
    }, 4000);
  };

  useEffect(() => {
    resetIdleTimer();
    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [isOpen]);

  return (
    <motion.div
      drag
      dragConstraints={{ left: 0, right: window.innerWidth - 60, top: 0, bottom: window.innerHeight - 60 }}
      initial={{ x: window.innerWidth - 80, y: 100 }}
      onDragStart={resetIdleTimer}
      className="fixed z-[100] touch-none"
    >
      <motion.button
        onClick={() => {
          onClick();
          resetIdleTimer();
        }}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
        onTouchStart={() => setIsExpanded(true)}
        onTouchEnd={() => setTimeout(() => setIsExpanded(false), 2000)}
        animate={{
          width: isExpanded ? 'auto' : (isIdle ? 40 : 56),
          height: isIdle ? 40 : 56,
          opacity: isIdle ? 0.6 : 1,
          scale: isIdle ? 0.8 : 1,
        }}
        className={`flex items-center justify-center gap-2 rounded-full border backdrop-blur-md transition-colors shadow-lg ${
          isOpen 
            ? 'bg-cyan-500 border-cyan-400 text-black shadow-[0_0_20px_rgba(0,255,255,0.4)]' 
            : 'bg-black/40 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 shadow-[0_0_15px_rgba(0,255,255,0.2)]'
        }`}
        style={{ padding: isExpanded ? '0 20px' : '0' }}
      >
        <Cpu 
          size={isIdle ? 20 : 24} 
          className={`${isOpen ? 'rotate-180' : ''} transition-transform duration-500`} 
        />
        <AnimatePresence>
          {isExpanded && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              className="text-sm font-black italic tracking-tighter whitespace-nowrap overflow-hidden"
            >
              {isOpen ? 'CLOSE QUANTUM' : 'OPEN QUANTUM'}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </motion.div>
  );
}
