import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import { Activity } from 'lucide-react';
import './App.css';

const Home = lazy(() => import('./pages/Home'));
const Diagnostics = lazy(() => import('./pages/Diagnostics'));
const BMITracker = lazy(() => import('./pages/BMITracker'));
const HealthOverview = lazy(() => import('./pages/HealthOverview'));
const AIAssistant = lazy(() => import('./pages/AIAssistant'));
const Profile = lazy(() => import('./pages/Profile'));
const Login = lazy(() => import('./pages/Login'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const Register = lazy(() => import('./pages/Register'));
const HealthInfo = lazy(() => import('./pages/HealthInfo'));
const DiabetesInfo = lazy(() => import('./pages/DiabetesInfo'));
const CancerInfo = lazy(() => import('./pages/CancerInfo'));

const PageLoader = () => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '1rem' }}>
    <Activity size={28} color="var(--text-muted)" style={{ animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }} />
    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', letterSpacing: '0.05em', textTransform: 'uppercase', fontWeight: 600 }}>Loading</span>
  </div>
);

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useAuth();
  
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/overview'} replace />;
  }
  
  return children;
};

function App() {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className={`app-wrapper ${isAdminRoute ? 'app-wrapper--admin' : ''}`}>
      <Navbar />

      <main className="app-main">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={!isAuthenticated ? <Home /> : <Navigate to={user?.role === 'admin' ? '/admin' : '/overview'} replace />} />
            <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to={user?.role === 'admin' ? '/admin' : '/overview'} replace />} />
            <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to={user?.role === 'admin' ? '/admin' : '/overview'} replace />} />
            <Route path="/health" element={<HealthInfo />} />
            <Route path="/diabetes" element={<DiabetesInfo />} />
            <Route path="/cancer" element={<CancerInfo />} />
            
            {/* Patient Routes */}
            <Route path="/diagnostics" element={<ProtectedRoute allowedRoles={['patient']}><Diagnostics /></ProtectedRoute>} />
            <Route path="/overview" element={<ProtectedRoute allowedRoles={['patient']}><HealthOverview /></ProtectedRoute>} />
            <Route path="/bmi" element={<ProtectedRoute allowedRoles={['patient']}><BMITracker /></ProtectedRoute>} />
            <Route path="/ai" element={<ProtectedRoute allowedRoles={['patient']}><AIAssistant /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute allowedRoles={['patient']}><Profile /></ProtectedRoute>} />
            
            {/* Admin Route */}
            <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
            
            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>

      <footer className="app-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <Activity size={18} color="#10b981" />
            Diagnox
          </div>
          <span className="footer-copy">
            © {new Date().getFullYear()} Diagnox Healthcare AI. All rights reserved.
          </span>
          <div className="footer-links">
            <span className="footer-link">Privacy</span>
            <span className="footer-link">Terms</span>
            <span className="footer-link">Contact</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
