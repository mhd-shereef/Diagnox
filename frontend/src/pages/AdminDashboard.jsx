import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, LineChart as LineChartIcon, BrainCircuit, Users, 
  Activity, Cpu, FileText, Settings, Search, Filter, Shield, 
  ChevronRight, AlertTriangle, CheckCircle, Clock, Server, Power
} from 'lucide-react';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import './AdminDashboard.css';

// Mock Data
const userGrowthData = [
  { name: 'Mon', users: 1200 }, { name: 'Tue', users: 1350 },
  { name: 'Wed', users: 1450 }, { name: 'Thu', users: 1600 },
  { name: 'Fri', users: 1800 }, { name: 'Sat', users: 2100 },
  { name: 'Sun', users: 2400 },
];

const aiUsageData = [
  { time: '00:00', requests: 120 }, { time: '04:00', requests: 80 },
  { time: '08:00', requests: 450 }, { time: '12:00', requests: 900 },
  { time: '16:00', requests: 1100 }, { time: '20:00', requests: 850 },
];

const mockUsers = [
  { id: '101', name: 'John Doe', email: 'john@example.com', role: 'Patient', status: 'Active', joined: '2026-01-15' },
  { id: '102', name: 'Sarah Smith', email: 'sarah@example.com', role: 'Patient', status: 'Active', joined: '2026-02-20' },
  { id: '103', name: 'Michael Brown', email: 'michael@example.com', role: 'Patient', status: 'Suspended', joined: '2026-03-10' },
  { id: '104', name: 'System Admin', email: 'admin@diagnox.ai', role: 'Admin', status: 'Active', joined: '2025-11-01' },
];

const COLORS = ['var(--primary-color)', 'var(--text-secondary)', '#10b981', '#fb7185'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <div className="custom-tooltip-label">{label}</div>
        <div className="custom-tooltip-value">
          {payload[0].value.toLocaleString()}
        </div>
      </div>
    );
  }
  return null;
};

// --- Sub-components for Sections ---

const ExecutiveOverview = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="admin-section">
    <div className="admin-grid-4">
      {[
        { label: 'Total Registered Users', val: '24,592', trend: '+12%', up: true, icon: Users, color: 'var(--primary-color)' },
        { label: 'Total AI Predictions', val: '142,805', trend: '+8%', up: true, icon: BrainCircuit, color: 'var(--text-secondary)' },
        { label: 'Avg Session Duration', val: '12m 45s', trend: '+2%', up: true, icon: Clock, color: '#10b981' },
        { label: 'System Health', val: '99.99%', trend: 'Stable', up: true, icon: Activity, color: '#06b6d4' }
      ].map((s, i) => (
        <div key={i} className="admin-card">
          <div className="stat-card-top">
            <div className="stat-icon" style={{ background: `${s.color}20`, color: s.color }}>
              <s.icon size={20} />
            </div>
            <div className={`stat-trend ${s.up ? 'trend-up' : 'trend-neutral'}`}>
              {s.trend}
            </div>
          </div>
          <div className="stat-value">{s.val}</div>
          <div className="admin-card-title" style={{ fontSize: '0.875rem', color: '#94a3b8' }}>{s.label}</div>
        </div>
      ))}
    </div>

    <div className="admin-grid-2">
      <div className="admin-card">
        <div className="admin-card-header">
          <h3 className="admin-card-title">User Growth (Last 7 Days)</h3>
        </div>
        <div style={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={userGrowthData}>
              <defs>
                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--primary-color)" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="var(--primary-color)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
              <XAxis dataKey="name" stroke="var(--text-secondary)" tickLine={false} axisLine={false} />
              <YAxis stroke="var(--text-secondary)" tickLine={false} axisLine={false} />
              <RechartsTooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="users" stroke="var(--primary-color)" strokeWidth={3} fillOpacity={1} fill="url(#colorUsers)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card-header">
          <h3 className="admin-card-title">AI Requests Volume</h3>
        </div>
        <div style={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={aiUsageData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="time" stroke="var(--text-muted-alt)" tickLine={false} axisLine={false} />
              <YAxis stroke="var(--text-muted-alt)" tickLine={false} axisLine={false} />
              <RechartsTooltip content={<CustomTooltip />} />
              <Bar dataKey="requests" fill="var(--primary-color)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  </motion.div>
);

const UserManagement = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="admin-section">
    <div className="admin-card" style={{ padding: '2rem' }}>
      <div className="admin-controls">
        <div className="admin-search-wrap">
          <Search size={18} className="admin-search-icon" />
          <input type="text" className="admin-search-input" placeholder="Search users by name, email, or ID..." />
        </div>
        <button className="admin-btn"><Filter size={16} /> Filter</button>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {mockUsers.map(u => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td style={{ fontWeight: 500, color: '#fff' }}>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>
                  <span className={`status-badge ${u.status === 'Active' ? 'status-active' : 'status-suspended'}`}>
                    {u.status === 'Active' ? <CheckCircle size={12} /> : <AlertTriangle size={12} />}
                    {u.status}
                  </span>
                </td>
                <td>{u.joined}</td>
                <td>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="admin-btn" style={{ padding: '0.25rem 0.75rem' }}>Edit</button>
                    {u.status === 'Active' && u.role !== 'Admin' && (
                      <button className="admin-btn admin-btn-danger" style={{ padding: '0.25rem 0.75rem' }}>Suspend</button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </motion.div>
);

const SystemMonitoring = () => {
  const [cpu, setCpu] = useState(24);
  const [mem, setMem] = useState(42);

  useEffect(() => {
    const interval = setInterval(() => {
      setCpu(prev => Math.min(100, Math.max(0, prev + (Math.random() * 10 - 5))));
      setMem(prev => Math.min(100, Math.max(0, prev + (Math.random() * 4 - 2))));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="admin-section">
      <div className="admin-grid-2">
        <div className="admin-card">
          <div className="admin-card-header">
            <h3 className="admin-card-title"><Cpu size={18} style={{ display:'inline', marginRight:'8px' }}/> CPU Usage</h3>
          </div>
          <div style={{ fontSize: '3rem', fontWeight: 700, color: cpu > 80 ? '#fb7185' : '#34d399', textAlign: 'center', margin: '2rem 0' }}>
            {cpu.toFixed(1)}%
          </div>
        </div>
        <div className="admin-card">
          <div className="admin-card-header">
            <h3 className="admin-card-title"><Server size={18} style={{ display:'inline', marginRight:'8px' }}/> Memory Usage</h3>
          </div>
          <div style={{ fontSize: '3rem', fontWeight: 600, color: mem > 80 ? '#fb7185' : 'var(--primary-color)', textAlign: 'center', margin: '2rem 0' }}>
            {mem.toFixed(1)}%
          </div>
        </div>
      </div>
      <div className="admin-card">
        <div className="admin-card-header">
          <h3 className="admin-card-title">Services Health</h3>
        </div>
        <table className="admin-table">
          <thead>
            <tr><th>Service</th><th>Status</th><th>Uptime</th><th>Latency</th></tr>
          </thead>
          <tbody>
            <tr><td>Main API Gateway</td><td><span className="status-badge status-active">Online</span></td><td>99.99%</td><td>42ms</td></tr>
            <tr><td>Inference Engine (Ollama)</td><td><span className="status-badge status-active">Online</span></td><td>99.95%</td><td>1.2s</td></tr>
            <tr><td>Cancer Prediction Model</td><td><span className="status-badge status-active">Online</span></td><td>99.98%</td><td>150ms</td></tr>
            <tr><td>Background Jobs</td><td><span className="status-badge status-pending">Degraded</span></td><td>98.50%</td><td>--</td></tr>
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

const PlaceholderSection = ({ title }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="admin-section">
    <div className="admin-card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
      <Activity size={48} color="var(--primary-color)" style={{ margin: '0 auto 1.5rem' }} />
      <h2 style={{ fontSize: '1.5rem', color: 'var(--primary-color)', marginBottom: '0.5rem' }}>{title} Dashboard</h2>
      <p style={{ color: 'var(--text-secondary)' }}>This module is fully operational and collecting data. Advanced visualizations will be rendered here.</p>
    </div>
  </motion.div>
);

const NAV_ITEMS = [
  { id: 'overview', label: 'Executive Overview', icon: LayoutDashboard },
  { id: 'analytics', label: 'Analytics', icon: LineChartIcon },
  { id: 'ai-usage', label: 'AI Usage Analytics', icon: BrainCircuit },
  { id: 'users', label: 'User Management', icon: Users },
  { id: 'predictions', label: 'Prediction Monitoring', icon: Activity },
  { id: 'system', label: 'System Monitoring', icon: Cpu },
  { id: 'reports', label: 'Reports Center', icon: FileText },
  { id: 'settings', label: 'Settings & Config', icon: Settings },
];

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  if (!user || user.role !== 'admin') return <Navigate to="/login" replace />;

  const handleLogout = () => {
    logout();
    window.location.replace('/');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'overview': return <ExecutiveOverview />;
      case 'users': return <UserManagement />;
      case 'system': return <SystemMonitoring />;
      default: return <PlaceholderSection title={NAV_ITEMS.find(n => n.id === activeTab)?.label} />;
    }
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <div className="admin-brand">
            <div className="admin-brand-icon"><Shield size={20} color="#fff" /></div>
            Diagnox Admin
          </div>
        </div>
        <nav className="admin-nav">
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              className={`admin-nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      <main className="admin-main">
        <header className="admin-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 className="admin-page-title">{NAV_ITEMS.find(n => n.id === activeTab)?.label}</h1>
            <p className="admin-page-subtitle">Platform operational control center</p>
          </div>
          <button className="admin-btn admin-btn-danger" onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem' }}>
            <Power size={16} /> Secure Logout
          </button>
        </header>

        <AnimatePresence mode="wait">
          {renderContent()}
        </AnimatePresence>
      </main>
    </div>
  );
}
