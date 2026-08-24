import React, { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import BrandLogo from '../ui/BrandLogo';
import ThemeToggle from '../ui/ThemeToggle';

const NAV_LINKS = [
  { to: '/product',    label: 'Platform' },
  { to: '/solutions',  label: 'Solutions' },
  { to: '/technology', label: 'Technology' },
  { to: '/features',   label: 'Features' },
  { to: '/roadmap',    label: 'Roadmap' },
  { to: '/about',      label: 'Company' },
];

export default function Navbar() {
  const location = useLocation();
  const [elevated, setElevated]     = useState(false);
  const [compact,  setCompact]      = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleScroll = useCallback(() => {
    const y = window.scrollY;
    setElevated(y > 24);
    setCompact(y > 80);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  /* Close drawer on route change */
  useEffect(() => { setDrawerOpen(false); }, [location]);

  const isActive = (path) => location.pathname === path;
  const isOnHome = location.pathname === '/';

  return (
    <nav
      className={`nav-root ${elevated ? 'elevated' : isOnHome ? '' : 'elevated'}`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="container">
        <div className={`nav-inner ${compact ? 'compact' : ''}`}>
          {/* Brand Logo */}
          <Link to="/" aria-label="EVTWIN Home">
            <BrandLogo size={compact ? 'sm' : 'md'} />
          </Link>

          {/* Desktop Navigation */}
          <div className="nav-links desktop" role="menubar">
            {NAV_LINKS.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                role="menuitem"
                className={`nav-link ${isActive(to) ? 'active' : ''}`}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <ThemeToggle />
            <Link to="/contact" className="btn btn-secondary btn-sm" style={{ fontSize: '0.8125rem' }}>
              Contact
            </Link>
            <Link to="/login" className="btn btn-primary btn-sm" id="nav-launch-btn" style={{ fontSize: '0.8125rem' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
              Launch Platform
            </Link>

            {/* Mobile hamburger */}
            <button
              className="btn btn-icon btn-ghost mobile-btn"
              onClick={() => setDrawerOpen(d => !d)}
              aria-label={drawerOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={drawerOpen}
            >
              {drawerOpen ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6 6 18M6 6l12 12"/>
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/>
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {drawerOpen && (
        <div className="nav-drawer open" role="menu">
          {NAV_LINKS.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              role="menuitem"
              className={`nav-link ${isActive(to) ? 'active' : ''}`}
              style={{ width: '100%', justifyContent: 'flex-start' }}
            >
              {label}
            </Link>
          ))}
          <div style={{ height: 1, background: 'var(--border-1)', margin: '8px 0' }} />
          <Link to="/contact" className="nav-link" style={{ width: '100%' }}>Contact</Link>
          <Link to="/login" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 4 }}>
            Launch Platform Console
          </Link>
        </div>
      )}
    </nav>
  );
}
