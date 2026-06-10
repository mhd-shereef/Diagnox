import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wind, Play, Square, Info } from 'lucide-react';
import './BreathingExercise.css';

export default function BreathingExercise() {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState('idle');
  const [cycleCount, setCycleCount] = useState(0);

  useEffect(() => {
    let timer;
    if (isActive) {
      if (phase === 'idle') {
        setPhase('inhale');
      } else if (phase === 'inhale') {
        timer = setTimeout(() => setPhase('hold1'), 4000);
      } else if (phase === 'hold1') {
        timer = setTimeout(() => setPhase('exhale'), 4000);
      } else if (phase === 'exhale') {
        timer = setTimeout(() => setPhase('hold2'), 4000);
      } else if (phase === 'hold2') {
        timer = setTimeout(() => {
          setCycleCount(c => c + 1);
          setPhase('inhale');
        }, 4000);
      }
    } else {
      setPhase('idle');
      setCycleCount(0);
    }
    return () => clearTimeout(timer);
  }, [isActive, phase]);

  const getInstructions = () => {
    switch (phase) {
      case 'inhale': return 'Breathe In...';
      case 'hold1': return 'Hold...';
      case 'exhale': return 'Breathe Out...';
      case 'hold2': return 'Hold...';
      default: return 'Ready to relax?';
    }
  };

  const getScale = () => {
    switch (phase) {
      case 'inhale': return 1.6;
      case 'hold1': return 1.6;
      case 'exhale': return 1;
      case 'hold2': return 1;
      default: return 1;
    }
  };

  return (
    <div className="breathing-card">
      <div className="breathing-header">
        <Wind size={24} color="var(--primary-color)" />
        <h2>Box Breathing Exercise</h2>
      </div>
      <p className="breathing-desc">
        A wellness tool to help lower stress and improve concentration. 
        Follow the visual cue to inhale, hold, and exhale in equal 4-second intervals.
      </p>

      <div className="breathing-visual-container">
        <motion.div 
          className="breathing-circle"
          animate={{ scale: getScale() }}
          transition={{ duration: 4, ease: "linear" }}
        />
        <div className="breathing-text">{getInstructions()}</div>
      </div>

      <div className="breathing-controls">
        <button className="btn-primary" onClick={() => setIsActive(!isActive)}>
          {isActive ? <><Square size={16}/> Stop</> : <><Play size={16}/> Start</>}
        </button>
        <span className="cycle-count">Cycles: {cycleCount}</span>
      </div>

      <div className="breathing-disclaimer">
        <Info size={16} />
        <span>This is a wellness tool to help manage stress. It is not a medical diagnosis or treatment.</span>
      </div>
    </div>
  );
}
