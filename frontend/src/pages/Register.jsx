import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Lock, Calendar, Users, ArrowRight, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import PageBackground from '../components/PageBackground.jsx';
import './Login.css'; // Reusing Login styles

export default function Register() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    dob: '',
    gender: ''
  });
  const [showPwd, setShowPwd]   = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [shake, setShake]       = useState(false);

  const { register } = useAuth();
  const navigate  = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setShake(true);
      setTimeout(() => setShake(false), 600);
      return;
    }

    setLoading(true);
    try {
      const user = await register(formData);
      navigate('/overview', { replace: true });
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Registration failed. Please try again.');
      setShake(true);
      setTimeout(() => setShake(false), 600);
    } finally {
      setLoading(false);
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
        style={{ maxWidth: '450px' }} // Slightly wider for more fields
      >
        <div className="login-header">
          <h1 className="login-title">Create Account</h1>
          <p className="login-subtitle">Join Diagnox to manage your health</p>
        </div>

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

        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-field">
            <label className="form-label">Full Name</label>
            <div className="input-wrap">
              <User size={16} className="input-icon" />
              <input
                type="text"
                name="fullName"
                className="form-input login-input"
                placeholder="John Doe"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="login-field">
            <label className="form-label">Email address</label>
            <div className="input-wrap">
              <Mail size={16} className="input-icon" />
              <input
                type="email"
                name="email"
                className="form-input login-input"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="login-field">
              <label className="form-label">Date of Birth</label>
              <div className="input-wrap">
                <Calendar size={16} className="input-icon" />
                <input
                  type="date"
                  name="dob"
                  className="form-input login-input"
                  value={formData.dob}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="login-field">
              <label className="form-label">Gender</label>
              <div className="register-radio-group">
                {['Male', 'Female', 'Other'].map(g => (
                  <button
                    key={g}
                    type="button"
                    className={`register-radio-option ${formData.gender === g ? 'register-radio-option--selected' : ''}`}
                    onClick={() => setFormData(prev => ({ ...prev, gender: g }))}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="login-field">
            <label className="form-label">Password</label>
            <div className="input-wrap">
              <Lock size={16} className="input-icon" />
              <input
                type={showPwd ? 'text' : 'password'}
                name="password"
                className="form-input login-input"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
              />
              <button type="button" className="pwd-toggle" onClick={() => setShowPwd(v => !v)} tabIndex={-1}>
                {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="login-field">
            <label className="form-label">Confirm Password</label>
            <div className="input-wrap">
              <Lock size={16} className="input-icon" />
              <input
                type={showConfirmPwd ? 'text' : 'password'}
                name="confirmPassword"
                className="form-input login-input"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                minLength={6}
              />
              <button type="button" className="pwd-toggle" onClick={() => setShowConfirmPwd(v => !v)} tabIndex={-1}>
                {showConfirmPwd ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <motion.button
            type="submit"
            className="btn-primary login-btn"
            disabled={loading}
            whileTap={{ scale: 0.97 }}
            style={{ marginTop: '0.5rem' }}
          >
            {loading ? <span className="login-spinner" /> : <>Sign Up <ArrowRight size={16} /></>}
          </motion.button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <p className="login-footer-note" style={{ marginBottom: '0.75rem' }}>
            Already have an account? <Link to="/login" style={{ color: 'var(--accent-cyan)', textDecoration: 'none', fontWeight: '600' }}>Sign In</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
