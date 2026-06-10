import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ActivitySquare, Bot, User,
  LayoutDashboard, Menu, X, LogOut, Shield, Weight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [toast, setToast] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    window.location.replace('/');
  };

  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  const authLinks = [
    { name: 'Overview',    path: '/overview',    icon: LayoutDashboard },
    { name: 'Diagnostics', path: '/diagnostics', icon: ActivitySquare },
    { name: 'BMI',         path: '/bmi',         icon: Weight },
    { name: 'AI Assistant',path: '/ai',          icon: Bot },
    { name: 'Profile',     path: '/profile',     icon: User },
  ];

  const adminLink = { name: 'Admin', path: '/admin', icon: Shield };
  const links = isAuthenticated
    ? [...authLinks, ...(user?.role === 'admin' ? [adminLink] : [])]
    : [];

  return (
    <div className="navbar-wrapper">
      <nav className={`navbar${scrolled ? ' navbar-scrolled' : ''}`}>

        {/* ── Brand wordmark ── */}
        <NavLink to="/" className="nav-brand" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <img src="/logo.png" alt="Diagnox Logo" style={{ width: '32px', height: '32px', objectFit: 'contain' }} />
          Diagnox
        </NavLink>

        {/* ── Desktop links ── */}
        <div className="nav-links">
          {links.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              end={link.path === '/'}
              className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
            >
              {link.name}
            </NavLink>
          ))}

          {isAuthenticated ? (
            <button onClick={handleLogout} className="nav-link" style={{ marginLeft: '0.5rem' }}>
              Logout
            </button>
          ) : (
            <NavLink
              to="/login"
              className="btn-primary"
              style={{ marginLeft: '1rem', padding: '0.45rem 1.1rem', fontSize: '0.875rem' }}
            >
              Sign In
            </NavLink>
          )}
        </div>

        {/* ── Mobile toggle ── */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="nav-mobile-toggle"
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* ── Mobile drawer ── */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className="nav-mobile-menu"
            >
              {links.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  end={link.path === '/'}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) => `nav-mobile-link${isActive ? ' active' : ''}`}
                >
                  {link.name}
                </NavLink>
              ))}

              {isAuthenticated ? (
                <button
                  onClick={handleLogout}
                  className="nav-mobile-link"
                  style={{ color: '#fb7185' }}
                >
                  Sign Out
                </button>
              ) : (
                <NavLink
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="btn-primary"
                  style={{ marginTop: '0.5rem' }}
                >
                  Sign In
                </NavLink>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ── Toast Notification ── */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: '-50%' }}
            animate={{ opacity: 1, y: 20, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            style={{
              position: 'fixed',
              top: '0',
              left: '50%',
              background: 'rgba(15, 23, 42, 0.9)',
              color: '#fff',
              padding: '12px 24px',
              borderRadius: '99px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.1)',
              fontWeight: 500,
              fontSize: '0.9rem'
            }}
          >
            <Shield size={16} color="#34d399" />
            Securely logged out
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Navbar;
