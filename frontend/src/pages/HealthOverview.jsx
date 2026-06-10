import React from 'react';
import { motion } from 'framer-motion';
import {
  Activity, Heart, Droplet, Thermometer,
  TrendingUp, TrendingDown, Brain, ShieldCheck,
  Minus, LayoutDashboard
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import InteractiveCard from '../components/InteractiveCard';
import './HealthOverview.css';

const metrics = [
  {
    id: 'heart', title: 'Heart Rate', value: '72', unit: 'bpm',
    icon: Heart, color: '#f43f5e', bg: 'rgba(244,63,94,0.1)',
    trend: 'down', trendVal: '-2 bpm', status: 'good',
  },
  {
    id: 'bp', title: 'Blood Pressure', value: '118/75', unit: 'mmHg',
    icon: Activity, color: '#2563eb', bg: 'rgba(37,99,235,0.1)',
    trend: 'stable', trendVal: 'Normal', status: 'good',
  },
  {
    id: 'glucose', title: 'Glucose', value: '95', unit: 'mg/dL',
    icon: Droplet, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)',
    trend: 'up', trendVal: '+5% week', status: 'warn',
  },
  {
    id: 'temp', title: 'Body Temp', value: '98.6', unit: '°F',
    icon: Thermometer, color: '#10b981', bg: 'rgba(16,185,129,0.1)',
    trend: 'stable', trendVal: 'Stable', status: 'good',
  },
];

const insights = [
  { icon: ShieldCheck, color: '#10b981', title: 'Cardiovascular Health', desc: 'Your heart rate and BP metrics are within optimal ranges. Keep up regular exercise.' },
  { icon: Brain,       color: '#2563eb', title: 'Glucose Monitoring',    desc: 'Slight glucose elevation detected. Consider reducing refined carbohydrate intake.' },
  { icon: Activity,    color: '#f59e0b', title: 'Activity Suggestion',   desc: '30 minutes of moderate aerobic activity daily will further improve your metrics.' },
];

const containerVar = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };
const cardVar = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};

function TrendIcon({ trend }) {
  if (trend === 'up')     return <TrendingUp  size={14} />;
  if (trend === 'down')   return <TrendingDown size={14} />;
  return <Minus size={14} />;
}

// Simple health-score ring
function HealthScore({ score = 82 }) {
  const r = 54;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  return (
    <div className="health-score-ring">
      <svg width="140" height="140" viewBox="0 0 130 130">
        <circle cx="65" cy="65" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
        <circle
          cx="65" cy="65" r={r} fill="none"
          stroke="url(#scoreGrad)" strokeWidth="10"
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round" transform="rotate(-90 65 65)"
          style={{ transition: 'stroke-dashoffset 1.2s ease' }}
        />
        <defs>
          <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#2563eb" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
        </defs>
        <text x="65" y="60" textAnchor="middle" fill="#f1f5f9" fontSize="26" fontWeight="900" fontFamily="Inter">{score}</text>
        <text x="65" y="78" textAnchor="middle" fill="#64748b" fontSize="11" fontFamily="Inter">Health Score</text>
      </svg>
    </div>
  );
}

export default function HealthOverview() {
  const { user } = useAuth();

  return (
    <div className="overview-root">
      <div className="page-container">
        {/* Header */}
        <div className="overview-header">
          <div className="section-label">
            <LayoutDashboard size={13} /> Health Dashboard
          </div>
          <h1 className="overview-title">
            Good evening{user?.name ? `, ${user.name.split(' ')[0]}` : ''} 👋
          </h1>
          <p className="overview-subtitle">Here's your health snapshot for today.</p>
        </div>

        {/* Top row: metrics + score */}
        <div className="overview-top">
          {/* Metric cards */}
          <motion.div
            className="metrics-grid"
            variants={containerVar}
            initial="hidden"
            animate="visible"
          >
            {metrics.map(m => (
              <motion.div key={m.id} variants={cardVar}>
                <InteractiveCard className="metric-card card card-glow">
                  <div className="metric-top">
                    <span className="metric-title">{m.title}</span>
                    <div className="metric-icon-wrap" style={{ background: m.bg, color: m.color }}>
                      <m.icon size={18} />
                    </div>
                  </div>
                  <div className="metric-value">
                    {m.value}
                    <span className="metric-unit">{m.unit}</span>
                  </div>
                  <div className={`metric-trend ${m.status === 'warn' ? 'trend-warn' : 'trend-good'}`}>
                    <TrendIcon trend={m.trend} />
                    {m.trendVal}
                  </div>
                </InteractiveCard>
              </motion.div>
            ))}
          </motion.div>

          {/* Health score */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <InteractiveCard className="score-card card">
              <div className="score-card-label">Overall Wellness</div>
              <HealthScore score={82} />
              <div className="score-status badge badge-green" style={{ margin: '0 auto' }}>
                Above Average
              </div>
              <p className="score-hint">Based on your vitals and recent activity.</p>
            </InteractiveCard>
          </motion.div>
        </div>

        {/* AI Insights */}
        <motion.div
          className="insights-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <div className="insights-header">
            <Brain size={16} color="#60a5fa" />
            <h2 className="insights-title">AI Health Insights</h2>
          </div>
          <div className="insights-grid">
            {insights.map((ins, i) => (
              <motion.div
                key={ins.title}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
              >
                <InteractiveCard className="insight-card card">
                  <div className="insight-icon" style={{ background: `${ins.color}15`, color: ins.color }}>
                    <ins.icon size={18} />
                  </div>
                  <div>
                    <div className="insight-title">{ins.title}</div>
                    <div className="insight-desc">{ins.desc}</div>
                  </div>
                </InteractiveCard>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Weekly chart placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <InteractiveCard className="chart-section card">
            <div className="chart-header">
              <h3 className="chart-title">Weekly Activity Trends</h3>
              <div className="badge badge-blue">Beta</div>
            </div>
            <div className="chart-bars">
              {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((d, i) => {
                const h = [55, 72, 48, 80, 63, 90, 68][i];
                return (
                  <div key={d} className="chart-bar-col">
                    <motion.div
                      className="chart-bar"
                      style={{ height: `${h}%` }}
                      initial={{ height: '0%' }}
                      animate={{ height: `${h}%` }}
                      transition={{ delay: 0.7 + i * 0.05, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    />
                    <span className="chart-day">{d}</span>
                  </div>
                );
              })}
            </div>
          </InteractiveCard>
        </motion.div>
      </div>
    </div>
  );
}
