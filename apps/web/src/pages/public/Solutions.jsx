import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, AlertTriangle, ShieldCheck, Bus, Battery, Wrench, Building } from 'lucide-react';

const SOLUTIONS = [
  {
    segment: 'Commercial Fleet Operators',
    icon: Bus,
    headline: 'Full Fleet Telemetry & Downtime Prevention',
    problem: 'Fleet operators lose revenue in unexpected vehicle downtime due to zero early warnings on cell battery or inverter degradation.',
    solution: 'EVTWIN continuously monitors every vehicle, generates early thermal warnings, and calculates fleet-wide health scores.',
    metrics: [
      { label: 'Workstation Roles', val: '5 Roles', status: '[IMPLEMENTED]' },
      { label: 'Ingestion Stream', val: '1.0 Hz', status: '[IMPLEMENTED]' },
      { label: 'Alert Classification', val: '6 Types', status: '[PROTOTYPE]' },
      { label: 'Maintenance Log', val: 'Full CRUD', status: '[IMPLEMENTED]' },
    ],
    capabilities: [
      'Real-time vehicle health status dashboard',
      'Trip-by-trip energy and drive cycle analysis',
      'Automated maintenance interval triggers',
      'Driver behavior and regenerative score tracking',
      'State of Charge across entire multi-tenant fleet',
    ],
    color: 'var(--accent-cyan)',
    tag: '[IMPLEMENTED]',
  },
  {
    segment: 'EV Owners & Drivers',
    icon: Battery,
    headline: 'Physics-Grounded Battery Health Transparency',
    problem: 'Individual EV drivers have zero visibility into real battery degradation, SoC calibration errors, or sudden range loss.',
    solution: 'EVTWIN\'s digital twin model gives drivers a second opinion on battery health — accounting for cell temp, aging, and load.',
    metrics: [
      { label: 'SoC Accuracy', val: '±2%', status: '[SIMULATED]' },
      { label: 'Twin Model', val: '2-RC EKF', status: '[PROTOTYPE]' },
      { label: 'Trip History', val: 'Full Log', status: '[IMPLEMENTED]' },
      { label: 'Event Recorder', val: 'Black Box', status: '[PROTOTYPE]' },
    ],
    capabilities: [
      'Digital twin SoC vs factory BMS comparison',
      'Range prediction based on ambient thermal conditions',
      'Charging session analysis and optimization',
      'Black box event recorder with fault history',
      'Cell temperature and degradation indicators',
    ],
    color: 'var(--accent-twin)',
    tag: '[PROTOTYPE]',
  },
  {
    segment: 'Service Centers & Mechanics',
    icon: Wrench,
    headline: 'Remote Diagnostics Before Vehicle Arrival',
    problem: 'EV service centers waste labor hours on manual diagnostic triage because they lack pre-visit telemetry history.',
    solution: 'EVTWIN provides mechanics with full telemetry logs, fault codes, event timelines, and diagnostic snapshots before entry.',
    metrics: [
      { label: 'Mechanic Station', val: 'Active', status: '[IMPLEMENTED]' },
      { label: 'Diagnostic Codes', val: 'Multi-type', status: '[PROTOTYPE]' },
      { label: 'Event Waveform', val: 'Black Box', status: '[PROTOTYPE]' },
      { label: 'Work Orders', val: 'Live Queue', status: '[IMPLEMENTED]' },
    ],
    capabilities: [
      'Remote access to full vehicle telemetry history',
      'Black box replay for fault reconstruction',
      'Maintenance task management and status tracking',
      'Pre-visit diagnostic report generation',
      'Service interval calculation from usage data',
    ],
    color: 'var(--status-warning)',
    tag: '[IMPLEMENTED]',
  },
  {
    segment: 'OEM & Insurance Partners',
    icon: Building,
    headline: 'Data Intelligence for Automotive Partners',
    problem: 'OEMs and insurers lack real-world usage patterns, failure mode frequencies, or warranty validation evidence.',
    solution: 'EVTWIN\'s aggregated fleet intelligence layer provides anonymized, consent-gated performance data for risk modeling.',
    metrics: [
      { label: 'OEM Ingestion API', val: 'PLANNED', status: '[PLANNED]' },
      { label: 'Insurance Risk Engine', val: 'PLANNED', status: '[PLANNED]' },
      { label: 'Fleet Analytics', val: 'PLANNED', status: '[PLANNED]' },
    ],
    capabilities: [
      'Anonymized usage pattern aggregation [PLANNED]',
      'Real-world vs rated range analysis [PLANNED]',
      'Failure mode frequency analysis [PLANNED]',
      'Insurance risk scoring based on usage [PLANNED]',
    ],
    color: 'var(--accent-intel)',
    tag: '[PLANNED]',
  },
];

export default function Solutions() {
  return (
    <div style={{ background: 'var(--bg-space)', color: 'var(--text-soft)', paddingBottom: 'var(--sp-16)' }}>
      {/* Hero */}
      <section className="bg-hero-glow bg-circuit" style={{ padding: 'clamp(var(--sp-12), 6vw, var(--sp-16)) 0' }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: 840 }}>
          <div className="technical-label" style={{ color: 'var(--accent-cyan)', marginBottom: 8 }}>
            TARGETED STAKEHOLDER SOLUTIONS
          </div>
          <h1 className="text-h1" style={{ color: 'var(--text-primary)', marginBottom: 16 }}>
            Built for Every EV Stakeholder
          </h1>
          <p style={{ fontSize: '1.125rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
            One unified connected vehicle platform. Four distinct solutions tailored for fleet owners, drivers, service mechanics, and automotive partners.
          </p>
        </div>
      </section>

      {/* Solutions Stack */}
      <div className="container" style={{ marginTop: 'var(--sp-10)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
          {SOLUTIONS.map((sol) => {
            const Icon = sol.icon;
            return (
              <div key={sol.segment} className="diamond-card" style={{ padding: 40, background: 'var(--bg-surface-0)' }}>
                <div className="grid-2" style={{ alignItems: 'flex-start', gap: 40 }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                      <div style={{ width: 44, height: 44, borderRadius: 10, background: 'var(--bg-surface-1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: sol.color }}>
                        <Icon size={22} />
                      </div>
                      <div>
                        <div className="technical-label" style={{ color: sol.color, fontSize: '0.6875rem' }}>{sol.segment}</div>
                        <span className="badge-mono" style={{ fontSize: '0.6875rem', padding: '2px 8px', borderRadius: 4, background: 'var(--bg-surface-2)', color: sol.color, border: `1px solid ${sol.color}44` }}>
                          {sol.tag}
                        </span>
                      </div>
                    </div>

                    <h2 className="text-h2" style={{ color: 'var(--text-primary)', marginBottom: 16, fontSize: '1.75rem' }}>
                      {sol.headline}
                    </h2>

                    <div style={{ padding: 16, background: 'rgba(255, 127, 138, 0.08)', borderRadius: 10, borderLeft: '3px solid var(--status-critical)', marginBottom: 16 }}>
                      <div className="technical-label" style={{ color: 'var(--status-critical)', fontSize: '0.6875rem', marginBottom: 4 }}>THE CHALLENGE</div>
                      <p style={{ fontSize: '0.875rem', color: 'var(--text-soft)', margin: 0 }}>{sol.problem}</p>
                    </div>

                    <div style={{ padding: 16, background: 'rgba(138, 215, 255, 0.08)', borderRadius: 10, borderLeft: `3px solid ${sol.color}`, marginBottom: 24 }}>
                      <div className="technical-label" style={{ color: sol.color, fontSize: '0.6875rem', marginBottom: 4 }}>EVTWIN SOLUTION</div>
                      <p style={{ fontSize: '0.875rem', color: 'var(--text-soft)', margin: 0 }}>{sol.solution}</p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {sol.capabilities.map((cap) => (
                        <div key={cap} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                          <CheckCircle2 size={16} style={{ color: sol.color }} />
                          <span>{cap}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ background: 'var(--bg-surface-1)', padding: 28, borderRadius: 16, border: '1px solid var(--border-glass)' }}>
                    <div className="technical-label" style={{ marginBottom: 16 }}>PLATFORM CAPABILITY METRICS</div>
                    <div className="grid-2" style={{ gap: 12, marginBottom: 24 }}>
                      {sol.metrics.map((m) => (
                        <div key={m.label} style={{ background: 'var(--bg-surface-0)', padding: 16, borderRadius: 10, border: '1px solid var(--border-1)', textAlign: 'center' }}>
                          <div className="mono" style={{ fontSize: '1.25rem', fontWeight: 800, color: sol.color, marginBottom: 4 }}>{m.val}</div>
                          <div className="technical-label" style={{ fontSize: '0.625rem', marginBottom: 6 }}>{m.label}</div>
                          <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--text-muted)' }}>{m.status}</span>
                        </div>
                      ))}
                    </div>

                    <Link to="/login" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                      Access Solution Workstation <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
