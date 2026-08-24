import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Circle } from 'lucide-react';

const QUARTERS = [
  {
    period: 'Q3 2026',
    label: 'Foundation',
    status: 'ACTIVE',
    color: 'var(--status-success)',
    items: [
      { done: true, text: 'FastAPI REST API with JWT authentication & PBKDF2 hashing', tag: '[IMPLEMENTED]' },
      { done: true, text: '5-role RBAC system (SuperAdmin, Owner, Admin, Driver, Mechanic)', tag: '[IMPLEMENTED]' },
      { done: true, text: 'Multi-tenant database schema & storage', tag: '[IMPLEMENTED]' },
      { name: 'React SPA with role-aware workstation cockpits', done: true, text: 'React SPA with role-aware workstation cockpits', tag: '[IMPLEMENTED]' },
      { done: true, text: 'Physics-correlated 2-RC telemetry simulation engine', tag: '[PROTOTYPE]' },
      { done: true, text: 'MQTT QoS 1 ingestion architecture', tag: '[IMPLEMENTED]' },
      { done: false, text: 'Forensic black box event recorder v1.0', tag: '[PROTOTYPE]' },
      { done: false, text: 'Alert threshold engine with notification dispatcher', tag: '[PROTOTYPE]' },
    ],
  },
  {
    period: 'Q4 2026',
    label: 'Hardware & IoT Pilot',
    status: 'UPCOMING',
    color: 'var(--accent-cyan)',
    items: [
      { done: false, text: 'Physical Mosquitto MQTT broker deployment', tag: '[PLANNED]' },
      { done: false, text: 'ESP32 CAN bus hardware OBD-II dongle integration', tag: '[PLANNED]' },
      { done: false, text: 'Real vehicle pilot fleet telematics ingestion', tag: '[PLANNED]' },
      { done: false, text: '2-RC Thevenin battery twin parameter identification', tag: '[PLANNED]' },
      { done: false, text: 'Extended Kalman Filter (EKF) SoC estimator tuning', tag: '[PLANNED]' },
      { done: false, text: 'Multi-tenant organization management UI', tag: '[PLANNED]' },
    ],
  },
  {
    period: 'Q1 2027',
    label: 'Intelligence & Predictive Layer',
    status: 'FUTURE',
    color: 'var(--accent-twin)',
    items: [
      { done: false, text: 'ML anomaly detection for early cell degradation', tag: '[FUTURE]' },
      { done: false, text: 'Predictive maintenance interval & work order automation', tag: '[FUTURE]' },
      { done: false, text: 'Terrain + load + SOH adaptive range prediction model', tag: '[FUTURE]' },
      { done: false, text: 'Fleet efficiency optimization & driver scoring', tag: '[FUTURE]' },
      { done: false, text: 'OTA firmware update telemetry monitoring', tag: '[FUTURE]' },
    ],
  },
  {
    period: 'Q2 2027',
    label: 'Ecosystem & Partner Expansion',
    status: 'FUTURE',
    color: 'var(--accent-intel)',
    items: [
      { done: false, text: 'Automotive OEM integration API layer & webhooks', tag: '[FUTURE]' },
      { done: false, text: 'Insurance risk scoring & battery warranty validation', tag: '[FUTURE]' },
      { done: false, text: 'Driver mobile iOS / Android companion application', tag: '[FUTURE]' },
      { done: false, text: 'V2G (Vehicle-to-Grid) bi-directional power telematics', tag: '[FUTURE]' },
    ],
  },
];

export default function Roadmap() {
  return (
    <div style={{ background: 'var(--bg-space)', color: 'var(--text-soft)', paddingBottom: 'var(--sp-16)' }}>
      {/* Hero */}
      <section className="bg-hero-glow bg-circuit" style={{ padding: 'clamp(var(--sp-12), 6vw, var(--sp-16)) 0' }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: 840 }}>
          <div className="technical-label" style={{ color: 'var(--accent-cyan)', marginBottom: 8 }}>
            EVTWIN PRODUCT ROADMAP
          </div>
          <h1 className="text-h1" style={{ color: 'var(--text-primary)', marginBottom: 16 }}>
            Phased Engineering Timeline
          </h1>
          <p style={{ fontSize: '1.125rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
            EVTWIN is in active prototype development. This roadmap details our completed core milestones and the phased engineering plan to production deployment.
          </p>
        </div>
      </section>

      {/* Timeline Grid */}
      <div className="container" style={{ marginTop: 'var(--sp-10)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          {QUARTERS.map((q) => (
            <div key={q.period} className="diamond-card" style={{ padding: 32, background: 'var(--bg-surface-0)', borderLeft: `4px solid ${q.color}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
                <div>
                  <span className="mono" style={{ fontSize: '1.25rem', fontWeight: 800, color: q.color, marginRight: 12 }}>{q.period}</span>
                  <span style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)' }}>{q.label}</span>
                </div>
                <span className="badge-mono" style={{ fontSize: '0.75rem', padding: '3px 10px', borderRadius: 4, background: 'var(--bg-surface-1)', color: q.color, border: `1px solid ${q.color}44` }}>
                  {q.status}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {q.items.map((item) => (
                  <div key={item.text} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9375rem', gap: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: item.done ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                      {item.done ? (
                        <CheckCircle2 size={18} style={{ color: 'var(--status-success)', flexShrink: 0 }} />
                      ) : (
                        <Circle size={18} style={{ color: 'var(--border-3)', flexShrink: 0 }} />
                      )}
                      <span style={{ fontWeight: item.done ? 600 : 400 }}>{item.text}</span>
                    </div>
                    <span className="badge-mono" style={{ fontSize: '0.6875rem', padding: '2px 8px', borderRadius: 4, background: 'var(--bg-surface-1)', color: 'var(--text-secondary)' }}>
                      {item.tag}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <section style={{ textAlign: 'center', padding: 'var(--sp-12) 0', borderTop: '1px solid var(--border-1)', marginTop: 'var(--sp-12)' }}>
        <div className="container">
          <Link to="/login" className="btn btn-primary" style={{ padding: '0.875rem 2.25rem' }}>
            Launch Platform Console <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}
