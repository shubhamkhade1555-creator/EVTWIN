import React from 'react';
import { Radio, Server, Database, Cpu, Shield, Smartphone } from 'lucide-react';

const PIPELINE_NODES = [
  {
    icon: Radio,
    step: '01',
    name: 'Hardware OBD-II & CAN Bus',
    tech: '100 Hz Ingestion',
    status: '[IMPLEMENTED]',
    statusVariant: 'success',
    detail: 'Physical ESP32 / CAN transceiver reads voltage, current, and thermal sensors from vehicle ECU.'
  },
  {
    icon: Server,
    step: '02',
    name: 'MQTT QoS 1 Telemetry Broker',
    tech: 'Async IoTPayloads',
    status: '[IMPLEMENTED]',
    statusVariant: 'success',
    detail: 'Non-blocking Python MQTT listener parses incoming JSON packets with 100ms max latency.'
  },
  {
    icon: Database,
    step: '03',
    name: 'FastAPI Backend & Multi-Tenant DB',
    tech: 'Python 3.14 + SQLite/Postgres',
    status: '[IMPLEMENTED]',
    statusVariant: 'success',
    detail: 'RBAC user authentication, company organization scoping, and immutable audit event logging.'
  },
  {
    icon: Cpu,
    step: '04',
    name: '2-RC Battery Physics Digital Twin',
    tech: 'Electrochemical Model',
    status: '[PROTOTYPE]',
    statusVariant: 'warning',
    detail: 'Solves polarization resistance (R1, C1, R2, C2) to predict state of charge and battery state of health.'
  },
  {
    icon: Shield,
    step: '05',
    name: 'AI Predictive Diagnostics',
    tech: 'Thermal Anomaly Engine',
    status: '[PROTOTYPE]',
    statusVariant: 'warning',
    detail: 'Early warning thermal runaway detection triggers automated mechanic service work tickets.'
  },
  {
    icon: Smartphone,
    step: '06',
    name: 'Role-Based Operator Workstations',
    tech: 'React 19 + Space Grotesk',
    status: '[IMPLEMENTED]',
    statusVariant: 'success',
    detail: 'Tailored command centers for Super Admin, Company Owner, Admin, Driver, and Mechanic personas.'
  }
];

export default function TechnologyArchitecture() {
  return (
    <section className="tech-architecture" style={{ padding: 'var(--sp-16) 0', background: 'var(--bg-void)', position: 'relative' }}>
      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: 840, margin: '0 auto var(--sp-12)' }}>
          <div className="technical-label" style={{ color: 'var(--accent-cyan)', marginBottom: 8 }}>
            END-TO-END SYSTEM ARCHITECTURE
          </div>
          <h2 className="text-h2" style={{ color: 'var(--text-primary)', marginBottom: 16 }}>
            Proven Technical Telemetry Pipeline
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.125rem' }}>
            From high-frequency vehicle CAN bus signals to cloud physics models and role-tailored fleet workstations.
          </p>
        </div>

        {/* 6-Step Pipeline Grid */}
        <div className="grid-3" style={{ gap: 24 }}>
          {PIPELINE_NODES.map((node) => {
            const Icon = node.icon;
            return (
              <div key={node.step} className="diamond-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <div style={{ width: 42, height: 42, borderRadius: 10, background: 'var(--cyan-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-cyan)' }}>
                      <Icon size={22} />
                    </div>
                    <span className="mono" style={{ fontSize: '0.875rem', fontWeight: 800, color: 'var(--text-muted)' }}>
                      STEP {node.step}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>
                    {node.name}
                  </h3>

                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: 'var(--accent-cyan)', marginBottom: 12 }}>
                    {node.tech}
                  </div>

                  <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: 20 }}>
                    {node.detail}
                  </p>
                </div>

                <div style={{ borderTop: '1px solid var(--border-1)', paddingTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="technical-label" style={{ fontSize: '0.6875rem' }}>STATUS</span>
                  <span 
                    className="badge-mono" 
                    style={{ 
                      fontSize: '0.75rem', 
                      fontWeight: 700,
                      padding: '2px 8px', 
                      borderRadius: 4,
                      background: node.statusVariant === 'success' ? 'rgba(116, 224, 178, 0.12)' : 'rgba(255, 210, 122, 0.12)',
                      color: node.statusVariant === 'success' ? 'var(--status-success)' : 'var(--status-warning)',
                      border: `1px solid ${node.statusVariant === 'success' ? 'var(--status-success)' : 'var(--status-warning)'}44`
                    }}
                  >
                    {node.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
