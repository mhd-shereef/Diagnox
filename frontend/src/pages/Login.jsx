import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Mail, Lock, ArrowRight, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import PageBackground from '../components/PageBackground.jsx';
import './Login.css';

export default function Login() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd]   = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [shake, setShake]       = useState(false);

  const { login } = useAuth();
  const navigate  = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login(email, password);
      navigate(user.role === 'admin' ? '/admin' : '/overview', { replace: true });
    } catch (err) {
      const msg = err.response?.data?.detail || err.message || 'Invalid credentials. Please try again.';
      setError(msg);
      setShake(true);
      setTimeout(() => setShake(false), 600);
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (role) => {
    if (role === 'admin') {
      setEmail('admin@diagnox.ai');
      setPassword('admin123');
    } else {
      setEmail('test@diagnox.ai');
      setPassword('Test123!');
    }
  };

  return (
    <div className="login-root" style={{ position: 'relative', overflow: 'hidden' }}>
      <PageBackground variant="warm" />
      <motion.div
        className={`login-card ${shake ? 'shake' : ''}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        {/* Header */}
        <div className="login-header">
          <h1 className="login-title">Welcome back</h1>
          <p className="login-subtitle">Sign in to your Diagnox account</p>
        </div>

        {/* Demo hint */}
        <div className="demo-row">
          <span className="demo-label">Quick demo:</span>
          <button className="demo-btn" type="button" onClick={() => fillDemo('admin')}>
            Admin
          </button>
          <button className="demo-btn" type="button" onClick={() => fillDemo('patient')}>
            Patient
          </button>
        </div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              className="login-error"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <AlertCircle size={16} />
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form */}
        <form onSubmit={handleSubmit} className="login-form">
          {/* Email */}
          <div className="login-field">
            <label className="form-label">Email address</label>
            <div className="input-wrap">
              <Mail size={16} className="input-icon" />
              <input
                type="email"
                className="form-input login-input"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
          </div>

          {/* Password */}
          <div className="login-field">
            <label className="form-label">Password</label>
            <div className="input-wrap">
              <Lock size={16} className="input-icon" />
              <input
                type={showPwd ? 'text' : 'password'}
                className="form-input login-input"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className="pwd-toggle"
                onClick={() => setShowPwd(v => !v)}
                tabIndex={-1}
              >
                {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <motion.button
            type="submit"
            className="btn-primary login-btn"
            disabled={loading}
            whileTap={{ scale: 0.97 }}
          >
            {loading ? (
              <span className="login-spinner" />
            ) : (
              <>
                Sign In <ArrowRight size={16} />
              </>
            )}
          </motion.button>
        </form>

        {/* Footer note */}
        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <p className="login-footer-note" style={{ marginBottom: '0.75rem' }}>
            Don't have an account? <Link to="/register" style={{ color: 'var(--accent-cyan)', textDecoration: 'none', fontWeight: '600' }}>Create Account</Link>
          </p>
          <p className="login-footer-note" style={{ opacity: 0.7 }}>
            By signing in you agree to our{' '}
            <span style={{ color: 'var(--accent-cyan)' }}>Terms</span> and{' '}
            <span style={{ color: 'var(--accent-cyan)' }}>Privacy Policy</span>.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
