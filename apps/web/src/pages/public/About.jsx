
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Zap, Cpu, Activity, CheckCircle2 } from 'lucide-react';

const PRINCIPLES = [
  { icon: Activity, title: 'Physics First', desc: 'Every model is anchored in real electrochemical and mechanical physics. We do not fabricate signals.' },
  { icon: Zap, title: 'Strict Data Provenance', desc: 'Every data point carries a provenance label: MEASURED, ESTIMATED, SIMULATED, or PREDICTED.' },
  { icon: ShieldCheck, title: 'Honest Prototyping', desc: 'We label our implementation status clearly. PROTOTYPE means working code, not production hardened.' },
  { icon: Cpu, title: 'Engineering Depth', desc: 'We prefer mathematically sound models over marketing claims. The 2-RC EKF model exists because it is right.' },
];

const PLATFORM_FACTS = [
  { label: 'Codebase Engine', val: 'Python 3.14 + React' },
  { label: 'API Framework', val: 'FastAPI 0.111 ASGI' },
  { label: 'Database Architecture', val: 'Multi-Tenant Schema' },
  { label: 'Authentication', val: 'PBKDF2 100k + JWT' },
  { label: 'IoT Protocol', val: 'MQTTS (TLS 1.3)' },
  { label: 'Digital Twin Model', val: '2-RC Thevenin EKF' },
  { label: 'UI Architecture', val: 'Space Grotesk + Vite' },
  { label: 'API Specification', val: 'OpenAPI 3.0 Swagger' },
];

export default function About() {
  return (
    <div style={{ background: 'var(--bg-space)', color: 'var(--text-soft)', paddingBottom: 'var(--sp-16)' }}>
      {/* Hero */}
      <section className="bg-hero-glow bg-circuit" style={{ padding: 'clamp(var(--sp-12), 6vw, var(--sp-16)) 0' }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: 840 }}>
          <div className="technical-label" style={{ color: 'var(--accent-cyan)', marginBottom: 8 }}>
            COMPANY ETHOS & ENGINEERING
          </div>
          <h1 className="text-h1" style={{ color: 'var(--text-primary)', marginBottom: 16 }}>
            Engineering-First <br />
            <span className="text-gradient-electric">EV Intelligence Platform</span>
          </h1>
          <p style={{ fontSize: '1.125rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
            EVTWIN was created to answer a fundamental question: what if every EV had an independent, physics-grounded second brain watching over battery health and drivetrain thermal safety?
          </p>
        </div>
      </section>

      {/* Mission & Facts */}
      <section style={{ padding: 'var(--sp-12) 0', background: 'var(--bg-void)' }}>
        <div className="container">
          <div className="diamond-card" style={{ padding: 40, background: 'var(--bg-surface-0)' }}>
            <div className="grid-2" style={{ alignItems: 'center', gap: 40 }}>
              <div>
                <div className="technical-label" style={{ color: 'var(--accent-twin)', marginBottom: 8 }}>PLATFORM MISSION</div>
                <h2 className="text-h2" style={{ color: 'var(--text-primary)', marginBottom: 16 }}>
                  Making EV Health Visible and Understandable
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.6, marginBottom: 16 }}>
                  The connected vehicle industry suffers from data opacity. Factory BMS controllers conceal internal variables behind proprietary firmware and simplified dashboard bars.
                </p>
                <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.6 }}>
                  EVTWIN builds an independent software twin of the vehicle — computing real-time polarization overpotentials, tracking capacity fade, and surfacing actionable intelligence.
                </p>
              </div>

              <div style={{ background: 'var(--bg-surface-1)', padding: 28, borderRadius: 16, border: '1px solid var(--border-cyan)' }}>
                <div className="technical-label" style={{ marginBottom: 16 }}>PLATFORM ARCHITECTURE SPECIFICATIONS</div>
                <div className="grid-2" style={{ gap: 12 }}>
                  {PLATFORM_FACTS.map(({ label, val }) => (
                    <div key={label} style={{ background: 'var(--bg-surface-0)', padding: 12, borderRadius: 8, border: '1px solid var(--border-1)' }}>
                      <div className="technical-label" style={{ fontSize: '0.625rem', marginBottom: 4 }}>{label}</div>
                      <div className="mono" style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>{val}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Principles */}
      <section style={{ padding: 'var(--sp-16) 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: 800, margin: '0 auto var(--sp-12)' }}>
            <div className="technical-label" style={{ color: 'var(--accent-cyan)', marginBottom: 8 }}>ENGINEERING PRINCIPLES</div>
            <h2 className="text-h2" style={{ color: 'var(--text-primary)' }}>How We Build EVTWIN</h2>
          </div>

          <div className="grid-2" style={{ gap: 24 }}>
            {PRINCIPLES.map((p) => {
              const Icon = p.icon;
              return (
                <div key={p.title} className="diamond-card" style={{ background: 'var(--bg-surface-0)' }}>
                  <div style={{ width: 42, height: 42, borderRadius: 10, background: 'var(--bg-surface-1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-cyan)', marginBottom: 16 }}>
                    <Icon size={22} />
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>{p.title}</h3>
                  <p style={{ fontSize: '0.9375rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>{p.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ textAlign: 'center', padding: 'var(--sp-12) 0', borderTop: '1px solid var(--border-1)' }}>
        <div className="container">
          <Link to="/login" className="btn btn-primary" style={{ padding: '0.875rem 2.25rem' }}>
            Launch Platform Console <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}
