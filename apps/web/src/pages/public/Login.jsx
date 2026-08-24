import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import BrandLogo from '../../components/ui/BrandLogo';

const DEMO_CREDENTIALS = [
  { 
    role: 'Super Admin', 
    email: 'superadmin@evtwin.io', 
    password: 'SuperAdmin123!', 
    badge: 'badge-violet', 
    desc: 'Platform-wide health & tenant management' 
  },
  { 
    role: 'Company Owner', 
    email: 'owner@acmefleet.com', 
    password: 'Owner123!', 
    badge: 'badge-cyan', 
    desc: 'Executive fleet KPIs & battery degradation' 
  },
  { 
    role: 'Company Admin', 
    email: 'admin@acmefleet.com', 
    password: 'Admin123!', 
    badge: 'badge-blue', 
    desc: 'Vehicle operations & alert triage' 
  },
  { 
    role: 'Driver', 
    email: 'driver@acmefleet.com', 
    password: 'Driver123!', 
    badge: 'badge-green', 
    desc: 'Assigned EV001 telemetry & trip score' 
  },
  { 
    role: 'Mechanic', 
    email: 'mech@acmefleet.com', 
    password: 'Mechanic123!', 
    badge: 'badge-amber', 
    desc: 'Diagnostic station & maintenance tickets' 
  },
];

export default function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showCreds, setShowCreds] = useState(false);
  const [forgotMsg, setForgotMsg] = useState(false);

  useEffect(() => {
    const savedEmail = localStorage.getItem('evtwin_remembered_email');
    if (savedEmail) {
      setEmail(savedEmail);
    }
  }, []);

  const fillCredentials = (cred) => {
    setEmail(cred.email);
    setPassword(cred.password);
    setError('');
    setShowCreds(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleanEmail = email.trim();
    
    if (!cleanEmail || !password) {
      setError('Please enter both your email address and password.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('http://127.0.0.1:8000/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password }),
      });

      if (!res.ok) {
        if (res.status === 401) {
          setError('Invalid email or password. Please verify your credentials or select a demo account.');
        } else {
          const data = await res.json().catch(() => ({}));
          setError(data.detail || 'Authentication failed. Please check server logs.');
        }
        setLoading(false);
        return;
      }

      const data = await res.json();
      const token = data.access_token;

      // Handle Remember Me preference
      if (rememberMe) {
        localStorage.setItem('evtwin_remembered_email', cleanEmail);
      } else {
        localStorage.removeItem('evtwin_remembered_email');
      }

      // Fetch verified authenticated profile
      const meRes = await fetch('http://127.0.0.1:8000/api/v1/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const user = meRes.ok ? await meRes.json() : {
        email: cleanEmail,
        role: data.role,
        orgId: data.organization_id,
        userId: data.user_id,
        name: data.name
      };

      localStorage.setItem('evtwin_token', token);
      localStorage.setItem('evtwin_user', JSON.stringify(user));

      if (onLoginSuccess) {
        onLoginSuccess(token, user);
      }
    } catch (err) {
      setError('Unable to reach the platform server at http://127.0.0.1:8000. Ensure the backend API is active.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <title>Login — EVTWIN Enterprise Platform</title>
      <meta name="description" content="Sign in to EVTWIN Connected EV Digital Twin Platform Console." />

      <div className="login-split-container">
        <div className="login-split-grid">
          
          {/* ──────────────────────────────────────────────────────────
              LEFT: CINEMATIC AUTOMOTIVE & DIGITAL TWIN VISUAL PANE
              ────────────────────────────────────────────────────────── */}
          <div className="login-visual-pane">
            
            {/* Top Bar inside Left Pane */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Link to="/" aria-label="EVTWIN Home">
                <BrandLogo size="md" />
              </Link>
              <Link 
                to="/" 
                className="btn btn-ghost btn-sm" 
                style={{ color: 'var(--text-secondary)', display: 'inline-flex', alignItems: 'center', gap: 6 }}
              >
                ← Back to Overview
              </Link>
            </div>

            {/* Middle: 3D Vehicle Showcase with Live HUD Pins */}
            <div style={{ margin: 'var(--sp-6) 0' }}>
              <div className="eyebrow" style={{ marginBottom: 'var(--sp-3)' }}>
                <span className="beacon" />
                CONNECTED EV INTELLIGENCE
              </div>
              <h2 className="heading-lg" style={{ marginBottom: 'var(--sp-4)', maxWidth: 460 }}>
                High-Fidelity Telemetry & Physics-Grounded Digital Twin
              </h2>
              <p className="body-md" style={{ marginBottom: 'var(--sp-6)', maxWidth: 480, color: 'var(--text-secondary)' }}>
                Correlating real-time CAN bus telemetry with 2-RC electrochemical physics to predict battery degradation, detect anomalies, and maximize fleet uptime.
              </p>

              {/* 3D EV Media Frame */}
              <div className="vehicle-hero-media-wrap hud-tech-corners" style={{ maxWidth: 540 }}>
                <img 
                  src="/assets/hero_ev_cinematic.jpg" 
                  alt="Cinematic Electric Vehicle Digital Twin Showcase"
                  width={1280}
                  height={720}
                  style={{ width: '100%', height: 'auto', display: 'block' }}
                />
                <div className="hud-scanline" />
                
                {/* Visual HUD Pins */}
                <div 
                  className="hud-telemetry-pin"
                  style={{ top: '24%', left: '16%' }}
                >
                  <span className="hud-pulse-radar" />
                  <span className="mono font-semibold text-cyan">HV BATTERY: 779.2 V</span>
                </div>

                <div 
                  className="hud-telemetry-pin"
                  style={{ bottom: '26%', right: '14%' }}
                >
                  <span className="hud-pulse-radar" />
                  <span className="mono font-semibold text-ice">2-RC FILTER: CONVERGED</span>
                </div>
              </div>
            </div>

            {/* Bottom: Technical Capability Badges */}
            <div style={{ display: 'flex', gap: 'var(--sp-3)', flexWrap: 'wrap' }}>
              <div className="badge badge-cyan">1.0 HZ STREAMING</div>
              <div className="badge badge-blue">PBKDF2 HASHED AUTH</div>
              <div className="badge badge-green">TENANT ISOLATED RBAC</div>
              <div className="badge badge-violet">RULE 15 PROVENANCE</div>
            </div>

          </div>

          {/* ──────────────────────────────────────────────────────────
              RIGHT: AUTHENTICATION COCKPIT & ROLE ACCESS FORM
              ────────────────────────────────────────────────────────── */}
          <div className="login-form-pane">
            <div className="login-card-shell">
              
              {/* Header */}
              <div>
                <div className="eyebrow" style={{ marginBottom: 'var(--sp-2)' }}>
                  PLATFORM SECURITY GATEWAY
                </div>
                <h1 className="heading-lg" style={{ marginBottom: 'var(--sp-2)' }}>
                  Sign In to EVTWIN
                </h1>
                <p className="body-sm" style={{ color: 'var(--text-secondary)' }}>
                  Enter your organization credentials to launch your role-specific dashboard.
                </p>
              </div>

              {/* Prototype Demo Credentials Accordion */}
              <div 
                className="card" 
                style={{ 
                  padding: 'var(--sp-4)', 
                  borderColor: showCreds ? 'var(--cyan)' : 'var(--cyan-200)',
                  boxShadow: showCreds ? 'var(--shadow-glow-cyan)' : 'none',
                  transition: 'all var(--t-fast) var(--ease-out)'
                }}
              >
                <button
                  type="button"
                  onClick={() => setShowCreds(s => !s)}
                  className="flex-between"
                  style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                  aria-expanded={showCreds}
                  aria-controls="demo-accounts-drawer"
                  id="demo-credentials-toggle"
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span className="badge badge-cyan">PROTOTYPE</span>
                    <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                      Select Demo Account
                    </span>
                  </div>
                  <svg 
                    width="16" 
                    height="16" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="var(--cyan)" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    style={{ transform: showCreds ? 'rotate(180deg)' : 'none', transition: 'transform 200ms' }}
                    aria-hidden="true"
                  >
                    <path d="m6 9 6 6 6-6"/>
                  </svg>
                </button>

                {showCreds && (
                  <div 
                    id="demo-accounts-drawer"
                    style={{ marginTop: 'var(--sp-4)', display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)' }}
                  >
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 2 }}>
                      Click any role below to prefill the login form:
                    </p>
                    {DEMO_CREDENTIALS.map(cred => (
                      <button
                        key={cred.role}
                        type="button"
                        onClick={() => fillCredentials(cred)}
                        className="demo-account-chip"
                        id={`demo-btn-${cred.role.toLowerCase().replace(/\s+/g, '-')}`}
                      >
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span className={`badge ${cred.badge}`}>{cred.role}</span>
                            <span style={{ fontSize: '0.8125rem', color: 'var(--text-primary)', fontWeight: 500 }}>
                              {cred.email}
                            </span>
                          </div>
                          <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginTop: 2 }}>
                            {cred.desc}
                          </div>
                        </div>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--cyan)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M5 12h14M12 5l7 7-7 7"/>
                        </svg>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Login Form Card */}
              <form onSubmit={handleSubmit} noValidate>
                <div className="card" style={{ padding: 'var(--sp-6)', display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
                  
                  {/* Email Field */}
                  <div className="form-field">
                    <label className="form-label" htmlFor="login-email">
                      Email Address
                    </label>
                    <div className="form-input-icon">
                      <svg className="icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                        <polyline points="22,6 12,13 2,6"/>
                      </svg>
                      <input
                        id="login-email"
                        className="form-input"
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="e.g. owner@acmefleet.com"
                        autoComplete="email"
                        required
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div className="form-field">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <label className="form-label" htmlFor="login-password">
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowPassword(s => !s)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--text-muted)',
                          fontSize: '0.75rem',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4,
                          padding: 0
                        }}
                        id="toggle-password-visibility"
                      >
                        {showPassword ? 'Hide' : 'Show'}
                      </button>
                    </div>
                    <div className="form-input-icon">
                      <svg className="icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                      </svg>
                      <input
                        id="login-password"
                        className="form-input"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="Enter account password"
                        autoComplete="current-password"
                        required
                      />
                    </div>
                  </div>

                  {/* Remember Me & Forgot Password */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8125rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', color: 'var(--text-secondary)' }}>
                      <input 
                        type="checkbox"
                        checked={rememberMe}
                        onChange={e => setRememberMe(e.target.checked)}
                        style={{ accentColor: 'var(--cyan)' }}
                        id="remember-me-checkbox"
                      />
                      Remember email
                    </label>

                    <button
                      type="button"
                      onClick={() => setForgotMsg(s => !s)}
                      style={{ background: 'none', border: 'none', color: 'var(--cyan)', cursor: 'pointer', padding: 0, fontSize: '0.8125rem' }}
                      id="forgot-password-link"
                    >
                      Forgot password?
                    </button>
                  </div>

                  {/* Forgot Password Notice */}
                  {forgotMsg && (
                    <div style={{
                      padding: 'var(--sp-3)',
                      background: 'var(--bg-surface-2)',
                      border: '1px solid var(--border-cyan)',
                      borderRadius: 'var(--r-sm)',
                      fontSize: '0.75rem',
                      color: 'var(--text-secondary)',
                      lineHeight: 1.5
                    }}>
                      🔒 <strong>Enterprise Security Policy:</strong> In this prototype deployment, password recovery is managed via the Super Admin console or pre-seeded demo accounts.
                    </div>
                  )}

                  {/* Error Notification */}
                  {error && (
                    <div 
                      id="login-error-alert"
                      style={{
                        padding: 'var(--sp-3) var(--sp-4)',
                        background: 'rgba(239, 68, 68, 0.12)',
                        border: '1px solid rgba(239, 68, 68, 0.4)',
                        borderRadius: 'var(--r-sm)',
                        color: '#f87171',
                        fontSize: '0.8125rem',
                        lineHeight: 1.55,
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 8
                      }}
                    >
                      <span style={{ fontSize: '1rem', lineHeight: 1 }}>⚠️</span>
                      <div>{error}</div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg"
                    style={{ justifyContent: 'center', width: '100%', marginTop: 'var(--sp-2)' }}
                    disabled={loading}
                    id="login-submit-btn"
                  >
                    {loading ? (
                      <>
                        <span 
                          className="spin-icon" 
                          style={{ 
                            width: 18, 
                            height: 18, 
                            border: '2px solid rgba(255,255,255,0.3)', 
                            borderTopColor: '#fff', 
                            borderRadius: '50%', 
                            display: 'inline-block' 
                          }} 
                        />
                        Authenticating…
                      </>
                    ) : 'Launch Platform Console →'}
                  </button>

                  <div style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>
                    By signing in, you accept the EVTWIN platform terms of service.
                  </div>

                </div>
              </form>

              {/* Bottom Security Info Footer */}
              <div style={{ textAlign: 'center', marginTop: 'var(--sp-2)' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                  🔒 256-bit TLS · HS256 JWT Signed · Multi-Tenant Isolation
                </span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </>
  );
}
