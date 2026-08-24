import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Radio, Cpu, Layers, Lock, CheckCircle2 } from 'lucide-react';

const FEATURES = [
  {
    section: 'Telemetry Engine',
    icon: Radio,
    color: 'var(--accent-cyan)',
    items: [
      { name: 'Live Telemetry Stream', desc: 'Voltage, current, temperature, speed, motor RPM — streamed at 1.0 Hz.', tag: '[IMPLEMENTED]' },
      { name: 'Physics-Correlated Model', desc: 'P = V × I, RPM ∝ speed, Temp ∝ I² — mathematically linked.', tag: '[SIMULATED]' },
      { name: 'Time-Series Data Storage', desc: 'Time-series collections with automatic index compression.', tag: '[IMPLEMENTED]' },
      { name: 'MQTTS QoS 1 Delivery', desc: 'Guaranteed delivery over TLS 1.3 encrypted MQTT channel.', tag: '[IMPLEMENTED]' },
    ],
  },
  {
    section: 'Digital Twin Science',
    icon: Cpu,
    color: 'var(--accent-twin)',
    items: [
      { name: '2-RC Equivalent Circuit', desc: 'Physics-accurate battery model with dynamic polarization pairs.', tag: '[SIMULATED]' },
      { name: 'Extended Kalman Filter', desc: 'Real-time SoC estimation with convergence from unknown initial states.', tag: '[SIMULATED]' },
      { name: 'State Space Observation', desc: 'Full state-space representation with noise covariance tuning.', tag: '[PLANNED]' },
      { name: 'Aging Degradation Model', desc: 'Capacity fade estimation based on cycle count and thermal history.', tag: '[PLANNED]' },
    ],
  },
  {
    section: 'Fleet Intelligence & Triage',
    icon: Layers,
    color: 'var(--accent-intel)',
    items: [
      { name: 'Fleet Health Index', desc: 'Aggregate vehicle health index across entire multi-tenant fleet.', tag: '[PROTOTYPE]' },
      { name: 'Maintenance Dispatcher', desc: 'Condition-based service interval management and work tickets.', tag: '[IMPLEMENTED]' },
      { name: 'Trip Recording & Replay', desc: 'Full trip telemetry with route, energy, and efficiency metrics.', tag: '[IMPLEMENTED]' },
      { name: 'Efficiency Benchmarking', desc: 'Vehicle-to-vehicle efficiency comparison with statistical distribution.', tag: '[PLANNED]' },
    ],
  },
  {
    section: 'Security & Access Control',
    icon: Lock,
    color: 'var(--status-success)',
    items: [
      { name: 'PBKDF2 & JWT Auth', desc: 'Stateless token-based auth with salted password hashing.', tag: '[IMPLEMENTED]' },
      { name: '5-Role RBAC System', desc: 'Super Admin, Owner, Admin, Driver, Mechanic — distinct permission sets.', tag: '[IMPLEMENTED]' },
      { name: 'Multi-Tenant Isolation', desc: 'Isolated company namespaces with cross-tenant admin capability.', tag: '[IMPLEMENTED]' },
      { name: 'Audit Trail Logging', desc: 'Tamper-evident immutable audit log of all security and data events.', tag: '[IMPLEMENTED]' },
    ],
  },
];

export default function Features() {
  return (
    <div style={{ background: 'var(--bg-space)', color: 'var(--text-soft)', paddingBottom: 'var(--sp-16)' }}>
      {/* Hero */}
      <section className="bg-hero-glow bg-circuit" style={{ padding: 'clamp(var(--sp-12), 6vw, var(--sp-16)) 0' }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: 840 }}>
          <div className="technical-label" style={{ color: 'var(--accent-cyan)', marginBottom: 8 }}>
            SYSTEM CAPABILITIES MATRIX
          </div>
          <h1 className="text-h1" style={{ color: 'var(--text-primary)', marginBottom: 16 }}>
            Complete Platform Features
          </h1>
          <p style={{ fontSize: '1.125rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
            Every capability of the EVTWIN platform — organized by system layer and annotated with code provenance tags.
          </p>
        </div>
      </section>

      {/* Feature Sections */}
      <div className="container" style={{ marginTop: 'var(--sp-10)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>
          {FEATURES.map((section) => {
            const Icon = section.icon;
            return (
              <div key={section.section}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--bg-surface-1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: section.color }}>
                    <Icon size={20} />
                  </div>
                  <h2 className="text-h2" style={{ color: 'var(--text-primary)', fontSize: '1.75rem' }}>{section.section}</h2>
                </div>

                <div className="grid-2" style={{ gap: 20 }}>
                  {section.items.map((item) => (
                    <div key={item.name} className="diamond-card" style={{ background: 'var(--bg-surface-0)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                        <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)' }}>{item.name}</h3>
                        <span className="badge-mono" style={{ fontSize: '0.6875rem', padding: '2px 8px', borderRadius: 4, background: 'var(--bg-surface-2)', color: section.color, border: `1px solid ${section.color}44` }}>
                          {item.tag}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
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
