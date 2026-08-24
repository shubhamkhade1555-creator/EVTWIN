import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import BrandLogo from '../ui/BrandLogo';

const NAV_MAP = {
  SUPER_ADMIN: [
    { label: 'Platform Health',    path: '/dashboard',      icon: '🖥️' },
    { label: 'All Organizations',  path: '/organizations',  icon: '🏢' },
    { label: 'All Users',          path: '/users',          icon: '👥' },
    { label: 'Vehicle Fleet',      path: '/vehicles',       icon: '🚗' },
    { label: 'Security Audit Logs',path: '/audit',          icon: '🔐' },
  ],
  COMPANY_OWNER: [
    { label: 'Fleet Overview',      path: '/dashboard',    icon: '📊' },
    { label: 'Vehicles & Battery',  path: '/vehicles',     icon: '🚗' },
    { label: 'Trips & Drive Cycles',path: '/trips',        icon: '🗺️' },
    { label: 'Faults & Alerts',     path: '/alerts',       icon: '⚠️' },
    { label: 'Maintenance Queue',   path: '/maintenance',  icon: '🔧' },
    { label: 'Fleet Analytics',     path: '/analytics',    icon: '📈' },
  ],
  COMPANY_ADMIN: [
    { label: 'Operations Command',  path: '/dashboard',    icon: '📊' },
    { label: 'Vehicle Fleet',       path: '/vehicles',     icon: '🚗' },
    { label: 'Active Trips',        path: '/trips',        icon: '🗺️' },
    { label: 'Alert Triage',        path: '/alerts',       icon: '⚠️' },
    { label: 'Maintenance Work',    path: '/maintenance',  icon: '🔧' },
    { label: 'Fleet Analytics',     path: '/analytics',    icon: '📈' },
  ],
  DRIVER: [
    { label: 'Driver Terminal',     path: '/dashboard',        icon: '📊' },
    { label: 'My Assigned EV',      path: '/vehicles/EV001',   icon: '🚗' },
    { label: 'Trip History',        path: '/trips',            icon: '🗺️' },
  ],
  MECHANIC: [
    { label: 'Diagnostics Station', path: '/dashboard',    icon: '📊' },
    { label: 'Vehicle Telemetry',   path: '/vehicles',     icon: '🚗' },
    { label: 'Service Work Orders', path: '/maintenance',  icon: '🔧' },
    { label: 'Diagnostic Faults',   path: '/alerts',       icon: '⚠️' },
  ],
};

const ROLE_COLORS = {
  SUPER_ADMIN:    'badge-violet',
  COMPANY_OWNER:  'badge-cyan',
  COMPANY_ADMIN:  'badge-blue',
  DRIVER:         'badge-green',
  MECHANIC:       'badge-amber',
};

export default function Sidebar({ user, onLogout }) {
  const location = useLocation();
  const role     = user?.role || 'COMPANY_OWNER';
  const navItems = NAV_MAP[role] || NAV_MAP.COMPANY_OWNER;

  return (
    <aside className="dash-sidebar">
      {/* Brand Header */}
      <div style={{ padding: '18px 16px', borderBottom: '1px solid var(--border-1)' }}>
        <Link to="/dashboard" aria-label="EVTWIN Dashboard">
          <BrandLogo size="sm" />
        </Link>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--text-muted)', marginTop: 6, paddingLeft: 4 }}>
          {user?.orgId || 'ORG-001'} · ENTERPRISE
        </div>
      </div>

      {/* User Context */}
      <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border-1)', background: 'var(--bg-surface-1)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {user?.name || user?.email?.split('@')[0] || 'Operator'}
          </span>
          <span className={`badge ${ROLE_COLORS[role] || 'badge-neutral'}`} style={{ flexShrink: 0, fontSize: '0.6rem' }}>
            {role.replace('_', ' ')}
          </span>
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {user?.email || 'user@evtwin.io'}
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '12px 10px', overflowY: 'auto' }} role="navigation" aria-label="Platform navigation">
        <div style={{ fontSize: '0.625rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--text-muted)', padding: '4px 6px 8px', marginBottom: 2 }}>
          Navigation
        </div>
        {navItems.map(item => {
          const isActive = location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`sidebar-link ${isActive ? 'active' : ''}`}
            >
              <span style={{ fontSize: '1rem', lineHeight: 1 }}>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Sign Out */}
      <div style={{ padding: '12px 10px', borderTop: '1px solid var(--border-1)' }}>
        <Link
          to="/"
          className="sidebar-link"
          style={{ marginBottom: 6, fontSize: '0.8125rem' }}
        >
          <span style={{ fontSize: '0.875rem' }}>🌐</span>
          <span>Back to Site</span>
        </Link>
        <button
          onClick={onLogout}
          className="sidebar-link btn"
          style={{ width: '100%', border: 'none', cursor: 'pointer', color: 'var(--red)', justifyContent: 'flex-start' }}
          id="sidebar-signout-btn"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>
          </svg>
          Sign Out
        </button>
      </div>
    </aside>
  );
}
