import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Cpu, Radio, Server, Database, Shield, Smartphone, CheckCircle2 } from 'lucide-react';

const TECH_LAYERS = [
  {
    layer: '01',
    name: 'Vehicle Edge Ingestion & CAN Bus',
    color: 'var(--status-success)',
    description: 'Data originates directly at the vehicle CAN Bus or OBD-II port. High-frequency electrical measurements are sampled at 100 Hz, timestamped with hardware precision, and packaged into JSON telemetry frames.',
    components: [
      { name: 'CAN Bus Adapter', tech: 'ISO 15765-4 / CAN 2.0B', status: '[SIMULATED]' },
      { name: 'Edge Ingest Agent', tech: 'Python / asyncio streaming', status: '[PROTOTYPE]' },
      { name: 'MQTTS Publisher', tech: 'paho-mqtt v2 over TLS 1.3', status: '[PROTOTYPE]' },
      { name: 'Offline Buffer', tech: 'SQLite high-speed ring buffer', status: '[PLANNED]' },
    ],
    signals: ['Pack Voltage (V)', 'Current Draw (A)', 'Cell Temperatures (°C)', 'Motor Speed (RPM)', 'GPS Trajectory', 'BMS Status Flags'],
    tag: '[SIMULATED]',
  },
  {
    layer: '02',
    name: 'MQTTS Ingestion & Telemetry Broker',
    color: 'var(--accent-cyan)',
    description: 'Telemetry frames travel over MQTTS (TLS 1.3) to the cloud message broker with QoS 1 delivery guarantee, ensuring zero data loss and automated deduplication during cellular handoffs.',
    components: [
      { name: 'MQTT Message Broker', tech: 'Eclipse Mosquitto / HiveMQ', status: '[IMPLEMENTED]' },
      { name: 'TLS 1.3 Security', tech: 'x.509 client cert auth', status: '[IMPLEMENTED]' },
      { name: 'Dynamic Router', tech: 'evtwin/{orgId}/{vin}/telemetry', status: '[PROTOTYPE]' },
      { name: 'Stream Worker', tech: 'FastAPI async background worker', status: '[IMPLEMENTED]' },
    ],
    signals: ['Port 8883 Encrypted Stream', 'QoS 1 Ack Delivery', 'Multi-tenant Namespacing', 'Heartbeat Keep-Alives'],
    tag: '[IMPLEMENTED]',
  },
  {
    layer: '03',
    name: 'FastAPI Gateway & Auth Engine',
    color: 'var(--accent-secondary)',
    description: 'High-performance FastAPI REST engine processes telemetry packets, performs continuous threshold and slope anomaly detection, validates JWT authentication, and enforces 5-tier role-based access control.',
    components: [
      { name: 'FastAPI REST Gateway', tech: 'FastAPI 0.111 + Uvicorn ASGI', status: '[IMPLEMENTED]' },
      { name: 'JWT Auth Security', tech: 'PBKDF2 100k salted hashing', status: '[IMPLEMENTED]' },
      { name: 'RBAC Guard Injection', tech: 'FastAPI Depends() injection', status: '[IMPLEMENTED]' },
      { name: 'Predictive Alert Engine', tech: 'Real-time threshold + slope monitor', status: '[PROTOTYPE]' },
    ],
    signals: ['GET /api/v1/vehicles', 'POST /api/v1/telemetry', 'GET /api/v1/alerts', 'POST /api/v1/auth/login'],
    tag: '[IMPLEMENTED]',
  },
  {
    layer: '04',
    name: 'Multi-Tenant Database & Audit Store',
    color: 'var(--accent-twin)',
    description: 'Multi-tenant database schema stores historical telemetry in time-series collections with automatic index compression, powering millisecond queries for drive cycles, degradation trends, and forensic playback.',
    components: [
      { name: 'Multi-Tenant DB', tech: 'SQLite / PostgreSQL Time-Series', status: '[IMPLEMENTED]' },
      { name: 'Trip Aggregator', tech: 'SQL window function analytics', status: '[IMPLEMENTED]' },
      { name: 'Audit Event Store', tech: 'Append-only immutable audit log', status: '[IMPLEMENTED]' },
      { name: 'Tenant Isolation', tech: 'Logical org isolation by orgId', status: '[IMPLEMENTED]' },
    ],
    signals: ['telemetry_ts table', 'trips table', 'alerts table', 'audit_logs table'],
    tag: '[IMPLEMENTED]',
  },
  {
    layer: '05',
    name: '2-RC Thevenin Digital Twin Engine',
    color: 'var(--status-warning)',
    description: 'The electrochemical core model running in parallel with the real vehicle. Utilizes an Extended Kalman Filter (EKF) to continuously estimate internal state variables: true SoC, ohmic resistance (R₀), and polarization overpotentials (Vp1, Vp2).',
    components: [
      { name: '2-RC Thevenin Circuit', tech: 'Electrochemical equivalent simulation', status: '[SIMULATED]' },
      { name: 'EKF Filter', tech: 'Recursive Bayesian state estimator', status: '[SIMULATED]' },
      { name: 'OCV-SoC Curves', tech: 'LFP / NMC chemistry tables', status: '[SIMULATED]' },
      { name: 'Degradation Estimator', tech: 'Internal resistance growth tracker', status: '[PLANNED]' },
    ],
    signals: ['True State of Charge (±1.5%)', 'R₀ Ohmic Resistance', 'V_p1 / V_p2 Polarization', 'Terminal Voltage Predict'],
    tag: '[SIMULATED]',
  },
  {
    layer: '06',
    name: 'Presentation & 5-Role Cockpits',
    color: 'var(--accent-cyan)',
    description: 'High-precision React single-page application delivering role-tailored operational cockpits: Super Admin, Company Owner, Operations Admin, Service Center Mechanic, and Commercial Driver.',
    components: [
      { name: 'React Single Page App', tech: 'Vite + React Router 6', status: '[IMPLEMENTED]' },
      { name: '5-Role Workstation Suite', tech: 'Role-specific UI layouts', status: '[IMPLEMENTED]' },
      { name: 'Interactive Visualizers', tech: 'Space Grotesk typography', status: '[IMPLEMENTED]' },
      { name: 'Live Telemetry Stream', tech: 'Physics-correlated simulated stream', status: '[PROTOTYPE]' },
    ],
    signals: ['/dashboard', '/owner', '/admin/platform', '/driver', '/mechanic', '/vehicles'],
    tag: '[IMPLEMENTED]',
  },
];

export default function Technology() {
  const [selectedLayer, setSelectedLayer] = useState(0);
  const active = TECH_LAYERS[selectedLayer];

  return (
    <div style={{ background: 'var(--bg-space)', color: 'var(--text-soft)', paddingBottom: 'var(--sp-16)' }}>
      {/* Hero */}
      <section className="bg-hero-glow bg-circuit" style={{ padding: 'clamp(var(--sp-12), 6vw, var(--sp-16)) 0' }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: 840 }}>
          <div className="technical-label" style={{ color: 'var(--accent-cyan)', marginBottom: 8 }}>
            END-TO-END SYSTEM ARCHITECTURE
          </div>
          <h1 className="text-h1" style={{ color: 'var(--text-primary)', marginBottom: 16 }}>
            6-Layer Connected EV <br />
            <span className="text-gradient-electric">Digital Twin Infrastructure</span>
          </h1>
          <p style={{ fontSize: '1.125rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
            From high-voltage CAN bus sampling to electrochemical state-space estimation and multi-role cloud cockpits. Built for high-frequency telemetry, rigorous data provenance, and enterprise scalability.
          </p>
        </div>
      </section>

      {/* Physics Spotlight */}
      <section style={{ padding: 'var(--sp-12) 0', background: 'var(--bg-void)' }}>
        <div className="container">
          <div className="diamond-card" style={{ padding: 40, background: 'var(--bg-surface-0)' }}>
            <div className="grid-2" style={{ alignItems: 'center', gap: 40 }}>
              <div style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border-cyan)' }}>
                <img 
                  src="/assets/iot_digital_twin_cloud.jpg" 
                  alt="EVTWIN Cloud Connected Digital Twin Network" 
                  style={{ width: '100%', height: 'auto', display: 'block' }}
                />
              </div>

              <div>
                <div className="technical-label" style={{ color: 'var(--accent-twin)', marginBottom: 8 }}>
                  ELECTROCHEMICAL SCIENCE
                </div>
                <h2 className="text-h2" style={{ color: 'var(--text-primary)', marginBottom: 16 }}>
                  The Physics Behind the Twin
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.6, marginBottom: 20 }}>
                  A digital twin is only as credible as the differential equations that govern it. EVTWIN implements a 2-RC Thevenin equivalent circuit model parameterized with open-circuit voltage (OCV) lookup tables and dynamic polarization pairs.
                </p>

                {/* Formula Box */}
                <div style={{ background: 'var(--bg-surface-1)', border: '1px solid var(--border-cyan)', padding: 16, borderRadius: 10, marginBottom: 20, fontFamily: 'var(--font-mono)' }}>
                  <div className="technical-label" style={{ color: 'var(--accent-cyan)', fontSize: '0.6875rem', marginBottom: 4 }}>
                    TERMINAL VOLTAGE PREDICTION FORMULA
                  </div>
                  <div style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    V_t(t) = OCV(SoC) - I(t)·R_0 - V_p1(t) - V_p2(t)
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive 6-Layer Architecture Explorer */}
      <section style={{ padding: 'var(--sp-16) 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: 800, margin: '0 auto var(--sp-12)' }}>
            <div className="technical-label" style={{ color: 'var(--accent-cyan)', marginBottom: 8 }}>
              INTERACTIVE STACK EXPLORER
            </div>
            <h2 className="text-h2" style={{ color: 'var(--text-primary)' }}>
              Click Any Layer to Inspect Technical Specifications
            </h2>
          </div>

          <div className="grid-2" style={{ gap: 32, alignItems: 'flex-start' }}>
            {/* Left Buttons Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {TECH_LAYERS.map((tl, i) => {
                const isSel = selectedLayer === i;
                return (
                  <button
                    key={tl.layer}
                    onClick={() => setSelectedLayer(i)}
                    className="diamond-card"
                    style={{
                      padding: '16px 20px',
                      textAlign: 'left',
                      cursor: 'pointer',
                      borderColor: isSel ? tl.color : 'var(--border-glass)',
                      background: isSel ? 'var(--bg-surface-1)' : 'var(--bg-glass)',
                      boxShadow: isSel ? `0 0 24px ${tl.color}33` : 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                      <span className="mono" style={{ fontSize: '1rem', fontWeight: 800, color: tl.color }}>{tl.layer}</span>
                      <span style={{ fontSize: '1rem', fontWeight: 700, color: isSel ? 'var(--text-primary)' : 'var(--text-secondary)' }}>{tl.name}</span>
                    </div>
                    <span className="badge-mono" style={{ fontSize: '0.6875rem', padding: '2px 8px', borderRadius: 4, background: 'var(--bg-surface-2)', color: tl.color, border: `1px solid ${tl.color}44` }}>
                      {tl.tag}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Right Active Detail Panel */}
            <div className="diamond-card" style={{ padding: 32, background: 'var(--bg-surface-0)', border: `1px solid ${active.color}44` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <span className="technical-label" style={{ color: active.color }}>LAYER {active.layer} SPECIFICATION</span>
                <span className="badge-mono" style={{ fontSize: '0.75rem', padding: '3px 10px', borderRadius: 4, background: `${active.color}15`, color: active.color, border: `1px solid ${active.color}44` }}>
                  {active.tag}
                </span>
              </div>

              <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16 }}>{active.name}</h3>
              <p style={{ fontSize: '1rem', color: 'var(--text-soft)', lineHeight: 1.6, marginBottom: 24 }}>{active.description}</p>

              <div style={{ marginBottom: 24 }}>
                <div className="technical-label" style={{ marginBottom: 12 }}>CORE COMPONENTS & DEPENDENCIES</div>
                <div className="grid-2" style={{ gap: 12 }}>
                  {active.components.map(c => (
                    <div key={c.name} style={{ background: 'var(--bg-surface-1)', padding: 12, borderRadius: 8, border: '1px solid var(--border-1)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
                        <span>{c.name}</span>
                        <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>{c.status}</span>
                      </div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: active.color }}>{c.tech}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="technical-label" style={{ marginBottom: 12 }}>SIGNALS & INTERFACE CONTRACTS</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {active.signals.map(s => (
                    <span key={s} className="mono" style={{ fontSize: '0.75rem', background: 'var(--bg-surface-1)', color: 'var(--text-secondary)', padding: '4px 10px', borderRadius: 4, border: '1px solid var(--border-1)' }}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

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
