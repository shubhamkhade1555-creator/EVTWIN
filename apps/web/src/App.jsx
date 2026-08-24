import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Link, Outlet, Navigate } from 'react-router-dom';

// Public Components
import Navbar from './components/public/Navbar';
import Footer from './components/public/Footer';

// Public Pages
import Home from './pages/public/Home';
import About from './pages/public/About';
import Product from './pages/public/Product';
import Features from './pages/public/Features';
import Solutions from './pages/public/Solutions';
import Technology from './pages/public/Technology';
import Roadmap from './pages/public/Roadmap';
import Contact from './pages/public/Contact';
import Login from './pages/public/Login';

// Dashboard Shell & Role Views
import Sidebar from './components/dashboard/Sidebar';
import Header from './components/dashboard/Header';
import SuperAdminDashboard from './pages/dashboard/SuperAdminDashboard';
import OwnerDashboard from './pages/dashboard/OwnerDashboard';
import AdminDashboard from './pages/dashboard/AdminDashboard';
import DriverDashboard from './pages/dashboard/DriverDashboard';
import MechanicDashboard from './pages/dashboard/MechanicDashboard';

// Dashboard Entity Views
import VehicleList from './pages/dashboard/VehicleList';
import VehicleDetail from './pages/dashboard/VehicleDetail';
import TripsView from './pages/dashboard/TripsView';
import AlertsView from './pages/dashboard/AlertsView';
import MaintenanceView from './pages/dashboard/MaintenanceView';
import AnalyticsView from './pages/dashboard/AnalyticsView';

import './App.css';

// Public Layout Wrapper
const PublicLayout = () => (
  <div className="public-shell">
    <Navbar />
    <main className="public-main">
      <Outlet />
    </main>
    <Footer />
  </div>
);

// Authenticated Dashboard Shell Layout
const DashboardLayout = ({ user, onLogout, onSimulateTelemetry }) => {
  return (
    <div className="dash-shell">
      <Sidebar user={user} onLogout={onLogout} />
      <div className="dash-main">
        <Header user={user} onSimulateTelemetry={onSimulateTelemetry} />
        <main className="dash-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

// Role-Aware Dashboard Router
const RoleDashboard = ({ user, token }) => {
  const role = user?.role || 'COMPANY_OWNER';

  if (role === 'SUPER_ADMIN') {
    return <SuperAdminDashboard token={token} user={user} />;
  } else if (role === 'COMPANY_OWNER') {
    return <OwnerDashboard token={token} user={user} />;
  } else if (role === 'COMPANY_ADMIN') {
    return <AdminDashboard token={token} user={user} />;
  } else if (role === 'DRIVER') {
    return <DriverDashboard token={token} user={user} />;
  } else if (role === 'MECHANIC') {
    return <MechanicDashboard token={token} user={user} />;
  }

  return <OwnerDashboard token={token} user={user} />;
};

// Fallback 403 Access Denied
const AccessDenied = ({ user, requiredRole }) => (
  <div style={{ padding: '80px 24px', textAlign: 'center', minHeight: '50vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
    <div className="eyebrow" style={{ color: 'var(--red)', marginBottom: 'var(--sp-3)' }}>403 FORBIDDEN · ACCESS DENIED</div>
    <h1 style={{ fontFamily: 'var(--font-mono)', fontSize: '4rem', fontWeight: '900', color: 'var(--red)', lineHeight: 1, marginBottom: '16px' }}>403</h1>
    <h2 className="heading-md" style={{ marginBottom: 16 }}>Unauthorized Role Workstation</h2>
    <p className="body-md" style={{ maxWidth: 520, margin: '0 auto 24px', color: 'var(--text-secondary)' }}>
      Your authenticated account (<code style={{ color: 'var(--cyan)' }}>{user?.email}</code>) holds role <strong style={{ color: 'var(--cyan)' }}>{user?.role}</strong>, which does not have permission to access the <strong>{requiredRole}</strong> workstation.
    </p>
    <Link to="/dashboard" className="btn btn-primary">
      Return to My Authorized Dashboard
    </Link>
  </div>
);

// Fallback 404
const NotFound = () => (
  <div style={{ padding: '120px 24px', textAlign: 'center', minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
    <span className="eyebrow" style={{ marginBottom: 'var(--sp-4)' }}>ROUTE NOT FOUND</span>
    <h1 style={{ fontFamily: 'var(--font-mono)', fontSize: '6rem', fontWeight: '900', color: 'var(--cyan)', lineHeight: 1, marginBottom: '16px' }}>404</h1>
    <h2 className="heading-md" style={{ marginBottom: 16 }}>Platform Route Not Found</h2>
    <p className="body-md" style={{ maxWidth: 440, margin: '0 auto 32px' }}>
      The requested vehicle telemetry or platform route does not exist.
    </p>
    <Link to="/" className="btn btn-primary btn-lg">
      Return to Home
    </Link>
  </div>
);

export default function App() {
  const [token, setToken] = useState(() => localStorage.getItem('evtwin_token'));
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('evtwin_user');
    return saved ? JSON.parse(saved) : null;
  });

  const handleLoginSuccess = (newToken, newUser) => {
    setToken(newToken);
    setUser(newUser);
  };

  const handleLogout = () => {
    localStorage.removeItem('evtwin_token');
    localStorage.removeItem('evtwin_user');
    setToken(null);
    setUser(null);
    window.location.href = '/login';
  };

  const handleSimulateTelemetry = async () => {
    if (!token) return;
    try {
      await fetch('http://127.0.0.1:8000/api/v1/vehicles/EV001/telemetry/simulate', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC MARKETING ROUTES */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/product" element={<Product />} />
          <Route path="/features" element={<Features />} />
          <Route path="/solutions" element={<Solutions />} />
          <Route path="/technology" element={<Technology />} />
          <Route path="/roadmap" element={<Roadmap />} />
          <Route path="/contact" element={<Contact />} />
        </Route>

        {/* STANDALONE AUTHENTICATION GATEWAY */}
        <Route 
          path="/login" 
          element={token ? <Navigate to="/dashboard" replace /> : <Login onLoginSuccess={handleLoginSuccess} />} 
        />

        {/* AUTHENTICATED PLATFORM ROUTES */}
        {token && (
          <Route element={<DashboardLayout user={user} onLogout={handleLogout} onSimulateTelemetry={handleSimulateTelemetry} />}>
            {/* Automatic Role Root */}
            <Route path="/dashboard" element={<RoleDashboard user={user} token={token} />} />
            
            {/* Explicit Role Routes with RBAC Guarding */}
            <Route 
              path="/admin/platform" 
              element={user?.role === 'SUPER_ADMIN' ? <SuperAdminDashboard token={token} user={user} /> : <AccessDenied user={user} requiredRole="SUPER_ADMIN" />} 
            />
            <Route 
              path="/owner" 
              element={user?.role === 'COMPANY_OWNER' || user?.role === 'SUPER_ADMIN' ? <OwnerDashboard token={token} user={user} /> : <AccessDenied user={user} requiredRole="COMPANY_OWNER" />} 
            />
            <Route 
              path="/admin/operations" 
              element={user?.role === 'COMPANY_ADMIN' || user?.role === 'SUPER_ADMIN' ? <AdminDashboard token={token} user={user} /> : <AccessDenied user={user} requiredRole="COMPANY_ADMIN" />} 
            />
            <Route 
              path="/driver" 
              element={user?.role === 'DRIVER' || user?.role === 'SUPER_ADMIN' ? <DriverDashboard token={token} user={user} /> : <AccessDenied user={user} requiredRole="DRIVER" />} 
            />
            <Route 
              path="/mechanic" 
              element={user?.role === 'MECHANIC' || user?.role === 'SUPER_ADMIN' ? <MechanicDashboard token={token} user={user} /> : <AccessDenied user={user} requiredRole="MECHANIC" />} 
            />

            {/* Entity Operations */}
            <Route path="/vehicles" element={<VehicleList token={token} user={user} />} />
            <Route path="/vehicles/:id" element={<VehicleDetail token={token} user={user} />} />
            <Route path="/trips" element={<TripsView token={token} user={user} />} />
            <Route path="/alerts" element={<AlertsView token={token} user={user} />} />
            <Route path="/maintenance" element={<MaintenanceView token={token} user={user} />} />
            <Route path="/analytics" element={<AnalyticsView token={token} user={user} />} />
            <Route path="/organizations" element={user?.role === 'SUPER_ADMIN' ? <SuperAdminDashboard token={token} user={user} /> : <AccessDenied user={user} requiredRole="SUPER_ADMIN" />} />
            <Route path="/users" element={['SUPER_ADMIN', 'COMPANY_OWNER', 'COMPANY_ADMIN'].includes(user?.role) ? <RoleDashboard user={user} token={token} /> : <AccessDenied user={user} requiredRole="ADMINISTRATOR" />} />
            <Route path="/audit" element={user?.role === 'SUPER_ADMIN' ? <SuperAdminDashboard token={token} user={user} /> : <AccessDenied user={user} requiredRole="SUPER_ADMIN" />} />
          </Route>
        )}
        {!token && (
          <>
            <Route path="/dashboard" element={<Navigate to="/login" replace />} />
            <Route path="/dashboard/*" element={<Navigate to="/login" replace />} />
            <Route path="/owner" element={<Navigate to="/login" replace />} />
            <Route path="/driver" element={<Navigate to="/login" replace />} />
            <Route path="/mechanic" element={<Navigate to="/login" replace />} />
            <Route path="/admin" element={<Navigate to="/login" replace />} />
            <Route path="/admin/*" element={<Navigate to="/login" replace />} />
            <Route path="/vehicles" element={<Navigate to="/login" replace />} />
            <Route path="/vehicles/*" element={<Navigate to="/login" replace />} />
            <Route path="/trips" element={<Navigate to="/login" replace />} />
            <Route path="/alerts" element={<Navigate to="/login" replace />} />
            <Route path="/maintenance" element={<Navigate to="/login" replace />} />
            <Route path="/analytics" element={<Navigate to="/login" replace />} />
            <Route path="/organizations" element={<Navigate to="/login" replace />} />
            <Route path="/users" element={<Navigate to="/login" replace />} />
            <Route path="/audit" element={<Navigate to="/login" replace />} />
          </>
        )}

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
