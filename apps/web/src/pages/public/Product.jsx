import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Layers, Database, Activity, ShieldAlert, Cpu, BarChart3, Lock, CheckCircle2 } from 'lucide-react';

const PRODUCT_MODULES = [
  {
    id: '01',
    name: 'Real-Time Telemetry Ingestion Stream',
    category: 'Ingestion & Monitoring',
    icon: Activity,
    color: 'var(--accent-cyan)',
    desc: 'High-frequency continuous streaming of high-voltage pack voltage, phase currents, and drivetrain thermal telemetry via MQTTS QoS 1.',
    details: [
      'Pack voltage (V), current (A), instantaneous power (kW)',
      'Multi-point NTC battery module temperatures (°C)',
      'Motor resolver RPM and calculated torque (Nm)',
      'Vehicle GPS trajectory and wheel speeds (km/h)',
      'State of Charge (SoC) — 2-RC physics correlated',
      'Continuous 1.0 Hz MQTTS JSON telemetry payloads',
    ],
    tag: '[IMPLEMENTED]',
    badgeStyle: { background: 'rgba(116, 224, 178, 0.12)', color: 'var(--status-success)', border: '1px solid var(--status-success)' }
  },
  {
    id: '02',
    name: '2-RC Digital Twin Physics Model',
    category: 'Electrochemical Science',
    icon: Cpu,
    color: 'var(--accent-twin)',
    desc: 'The electrochemical software replica running parallel with physical vehicle hardware to calculate unmeasurable polarization and internal resistance.',
    details: [
      '2-RC Thevenin equivalent circuit state equations',
      'Extended Kalman Filter (EKF) noise suppression',
      'Chemistry-specific OCV-SoC calibration curves',
      'Bulk electrolyte resistance (R₀) tracking',
      'Transient double-layer polarization (R₁/C₁, R₂/C₂)',
      'Real-time terminal voltage prediction & delta checks',
    ],
    tag: '[PROTOTYPE]',
    badgeStyle: { background: 'rgba(255, 210, 122, 0.12)', color: 'var(--status-warning)', border: '1px solid var(--status-warning)' }
  },
  {
    id: '03',
    name: 'Forensic Telemetry Black Box',
    category: 'Safety & Warranty',
    icon: ShieldAlert,
    color: 'var(--status-critical)',
    desc: 'Tamper-evident ring-buffer recording every state transition, emergency threshold violation, and thermal excursion with microsecond precision.',
    details: [
      'High-resolution multi-channel event logging',
      'Pre/Post fault waveform capture windows',
      'Severity classification (INFO / WARN / ERROR / CRITICAL)',
      'Subsystem tagging (BATTERY / MOTOR / BMS / INVERTER)',
      'Tamper-evident SHA-256 event checksums',
      'Exportable audit records for OEM warranty validation',
    ],
    tag: '[PROTOTYPE]',
    badgeStyle: { background: 'rgba(255, 210, 122, 0.12)', color: 'var(--status-warning)', border: '1px solid var(--status-warning)' }
  },
  {
    id: '04',
    name: 'Predictive Alert & Dispatch Engine',
    category: 'Intelligence & Triage',
    icon: Layers,
    color: 'var(--accent-intel)',
    desc: 'Real-time thermal slope rate-of-change detection that categorizes anomalies and routes urgent interventions directly to mechanics.',
    details: [
      'Configurable per-vehicle and per-fleet safety limits',
      'Temperature slope rate-of-change detection',
      'Role-targeted notifications and triage queues',
      'Service ticket creation and resolution tracking',
      'Historical fault frequency & root-cause correlation',
      'Automated priority escalation logic',
    ],
    tag: '[PROTOTYPE]',
    badgeStyle: { background: 'rgba(255, 210, 122, 0.12)', color: 'var(--status-warning)', border: '1px solid var(--status-warning)' }
  },
  {
    id: '05',
    name: 'Fleet Analytics & SOH Forecasting',
    category: 'Executive Insights',
    icon: BarChart3,
    color: 'var(--accent-secondary)',
    desc: 'Macro portfolio intelligence across all registered vehicle assets. Evaluates battery capacity fade, driver efficiency, and maintenance compliance.',
    details: [
      'Fleet Health Index (0-100 composite asset score)',
      'Vehicle-to-vehicle efficiency comparison',
      'Longitudinal battery capacity fade tracking',
      'Maintenance compliance & inspection logs',
      'Driver regenerative braking scoring',
      'Energy consumption trends and cost analysis',
    ],
    tag: '[PROTOTYPE]',
    badgeStyle: { background: 'rgba(255, 210, 122, 0.12)', color: 'var(--status-warning)', border: '1px solid var(--status-warning)' }
  },
  {
    id: '06',
    name: 'Multi-Tenant REST API & RBAC',
    category: 'Integration & Security',
    icon: Lock,
    color: 'var(--accent-cyan)',
    desc: 'FastAPI REST backend with OpenAPI 3.0 specs, JWT token authorization, and 5-tier role-based access control protecting all tenant resources.',
    details: [
      'FastAPI non-blocking asynchronous Python engine',
      'JWT token authentication with refresh lifecycle',
      '5-tier RBAC (Owner, Admin, Driver, Mechanic, SuperAdmin)',
      'Auto-generated interactive Swagger OpenAPI docs',
      'Comprehensive CRUD for vehicles, trips, alerts, users',
      'Multi-tenant database schema isolation',
    ],
    tag: '[IMPLEMENTED]',
    badgeStyle: { background: 'rgba(116, 224, 178, 0.12)', color: 'var(--status-success)', border: '1px solid var(--status-success)' }
  },
];

export default function Product() {
  return (
    <div style={{ background: 'var(--bg-space)', color: 'var(--text-soft)', paddingBottom: 'var(--sp-16)' }}>
      {/* Hero */}
      <section className="bg-hero-glow bg-circuit" style={{ padding: 'clamp(var(--sp-12), 6vw, var(--sp-16)) 0' }}>
        <div className="container">
          <div style={{ maxWidth: 840, margin: '0 auto', textAlign: 'center' }}>
            <div className="technical-label" style={{ color: 'var(--accent-cyan)', marginBottom: 8 }}>
              ENTERPRISE PLATFORM SPECIFICATION
            </div>
            <h1 className="text-h1" style={{ color: 'var(--text-primary)', marginBottom: 16 }}>
              Six Core Modules. <br />
              <span className="text-gradient-electric">One Connected EV Platform.</span>
            </h1>
            <p style={{ fontSize: '1.125rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              EVTWIN integrates high-frequency IoT ingestion, electrochemical battery science, forensic black box recording, and role-based operational workstations into a unified platform.
            </p>
          </div>
        </div>
      </section>

      {/* Visual Spotlight */}
      <section style={{ padding: 'var(--sp-12) 0', background: 'var(--bg-void)' }}>
        <div className="container">
          <div className="diamond-card" style={{ padding: 40, background: 'var(--bg-surface-0)' }}>
            <div className="grid-2" style={{ alignItems: 'center', gap: 40 }}>
              <div style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border-cyan)' }}>
                <img 
                  src="/assets/battery_twin_schematic.jpg" 
                  alt="EVTWIN Battery Pack Schematic" 
                  style={{ width: '100%', height: 'auto', display: 'block' }}
                />
              </div>

              <div>
                <div className="technical-label" style={{ color: 'var(--accent-twin)', marginBottom: 8 }}>
                  ELECTROCHEMICAL ARCHITECTURE
                </div>
                <h2 className="text-h2" style={{ color: 'var(--text-primary)', marginBottom: 16 }}>
                  Precision-Engineered for Connected Fleets
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.6, marginBottom: 24 }}>
                  Every module in the EVTWIN platform operates on standardized data contracts and strict provenance rules, guaranteeing that measured CAN signals are never conflated with simulated predictions.
                </p>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  <Link to="/login" className="btn btn-primary">Launch Console</Link>
                  <Link to="/technology" className="btn btn-secondary">View Specs</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modules Grid */}
      <section style={{ padding: 'var(--sp-16) 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: 800, margin: '0 auto var(--sp-12)' }}>
            <div className="technical-label" style={{ color: 'var(--accent-cyan)', marginBottom: 8 }}>
              PLATFORM SPECIFICATIONS
            </div>
            <h2 className="text-h2" style={{ color: 'var(--text-primary)' }}>
              Comprehensive System Modules
            </h2>
          </div>

          <div className="grid-3" style={{ gap: 24 }}>
            {PRODUCT_MODULES.map((mod) => {
              const Icon = mod.icon;
              return (
                <div key={mod.id} className="diamond-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                      <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--bg-surface-1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: mod.color }}>
                        <Icon size={20} />
                      </div>
                      <span className="badge-mono" style={{ fontSize: '0.6875rem', padding: '3px 8px', borderRadius: 4, ...mod.badgeStyle }}>
                        {mod.tag}
                      </span>
                    </div>

                    <div className="technical-label" style={{ fontSize: '0.6875rem', marginBottom: 4 }}>{mod.category}</div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 10 }}>{mod.name}</h3>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 20 }}>{mod.desc}</p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
                      {mod.details.map((d) => (
                        <div key={d} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: '0.8125rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
                          <CheckCircle2 size={14} style={{ color: mod.color, flexShrink: 0, marginTop: 3 }} />
                          <span>{d}</span>
                        </div>
                      ))}
                    </div>
                  </div>
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
            Explore Platform Console <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}
