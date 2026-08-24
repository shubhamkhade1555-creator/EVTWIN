import React, { useState, useEffect } from 'react';
import { Activity, Database, Cpu, Layers, Zap } from 'lucide-react';

const STAGES = [
  {
    id: 'signal',
    title: '1. RAW SIGNAL',
    icon: Activity,
    badge: '100 HZ CAN BUS',
    description: 'Analog ECU voltage, shunt current, and thermal sensors output raw high-frequency CAN frames.',
    value: '48.24 V / 8.41 A',
    status: 'INGESTING',
    color: 'var(--accent-cyan)'
  },
  {
    id: 'data',
    title: '2. TELEMETRY DATA',
    icon: Database,
    badge: 'MQTT QOS 1',
    description: 'MQTT broker parses JSON packets containing timestamped SOC, SOH, temperature, and RPM payloads.',
    value: '1.0 Hz STREAM',
    status: 'PARSED',
    color: 'var(--accent-secondary)'
  },
  {
    id: 'facets',
    title: '3. DIGITAL FACETS',
    icon: Cpu,
    badge: 'DIAMOND FACETS',
    description: 'Signals pass into multi-dimensional matrix facets to decouple noise from physical battery dynamics.',
    value: '2-RC FILTERED',
    status: 'CONVERGED',
    color: 'var(--accent-twin)'
  },
  {
    id: 'twin',
    title: '4. DIGITAL TWIN',
    icon: Layers,
    badge: 'PHYSICS GROUNDED',
    description: 'Electrochemical differential equations model real-time cell degradation, internal resistance, and thermal rise.',
    value: '92.5% SOH EST',
    status: 'ACTIVE',
    color: 'var(--accent-twin)'
  },
  {
    id: 'intel',
    title: '5. VEHICLE INTELLIGENCE',
    icon: Zap,
    badge: 'PREDICTIVE AI',
    description: 'Machine learning algorithms detect early thermal runaway, predict remaining range, and trigger automated work orders.',
    value: 'OPTIMAL HEALTH',
    status: 'MONITORED',
    color: 'var(--accent-intel)'
  }
];

export default function DiamondFacetFlow() {
  const [activeStageIndex, setActiveStageIndex] = useState(2);
  const [autoRotate, setAutoRotate] = useState(true);

  useEffect(() => {
    if (!autoRotate) return;
    const interval = setInterval(() => {
      setActiveStageIndex(prev => (prev + 1) % STAGES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [autoRotate]);

  return (
    <section className="diamond-facet-flow" style={{ padding: 'var(--sp-12) 0', background: 'var(--bg-void)', position: 'relative' }}>
      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: 800, margin: '0 auto var(--sp-10)' }}>
          <div className="technical-label" style={{ color: 'var(--accent-cyan)', marginBottom: 8 }}>
            SIGNATURE DIAMOND EFFECT · PIPELINE
          </div>
          <h2 className="text-h2" style={{ color: 'var(--text-primary)', marginBottom: 16 }}>
            Diamond-Cut Telemetry Processing
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.0625rem' }}>
            Transforming raw 100 Hz CAN bus hardware signals into actionable physics-grounded vehicle intelligence through structured digital facets.
          </p>
        </div>

        {/* Pipeline Stage Buttons */}
        <div 
          className="grid-5" 
          style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
            gap: 16, 
            marginBottom: 32 
          }}
        >
          {STAGES.map((stage, idx) => {
            const Icon = stage.icon;
            const isActive = idx === activeStageIndex;
            return (
              <div
                key={stage.id}
                onClick={() => {
                  setActiveStageIndex(idx);
                  setAutoRotate(false);
                }}
                className={`diamond-card ${isActive ? 'active' : ''}`}
                style={{
                  cursor: 'pointer',
                  borderColor: isActive ? stage.color : 'var(--border-glass)',
                  boxShadow: isActive ? `0 0 24px ${stage.color}33` : 'none',
                  background: isActive ? 'var(--bg-surface-1)' : 'var(--bg-glass)',
                  padding: 20
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <Icon size={20} style={{ color: isActive ? stage.color : 'var(--text-muted)' }} />
                  <span 
                    className="facet-node" 
                    style={{ 
                      fontSize: '0.6875rem', 
                      padding: '2px 8px', 
                      borderColor: isActive ? stage.color : 'var(--border-glass)',
                      color: isActive ? stage.color : 'var(--text-muted)'
                    }}
                  >
                    {stage.badge}
                  </span>
                </div>

                <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)', marginBottom: 6 }}>
                  {stage.title}
                </h3>

                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', fontWeight: 700, color: stage.color, marginBottom: 8 }}>
                  {stage.value}
                </div>

                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: isActive ? stage.color : 'var(--text-muted)' }} />
                  <span>{stage.status}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Stage Deep-Dive Panel */}
        <div 
          className="diamond-facet-card"
          style={{
            background: 'var(--bg-surface-0)',
            border: `1px solid ${STAGES[activeStageIndex].color}44`,
            padding: 32,
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 32,
            alignItems: 'center'
          }}
        >
          <div>
            <div className="technical-label" style={{ color: STAGES[activeStageIndex].color, marginBottom: 8 }}>
              ACTIVE PIPELINE STAGE {activeStageIndex + 1} OF 5
            </div>
            <h3 className="text-h3" style={{ color: 'var(--text-primary)', marginBottom: 12 }}>
              {STAGES[activeStageIndex].title}
            </h3>
            <p style={{ color: 'var(--text-soft)', fontSize: '1rem', lineHeight: 1.6, marginBottom: 20 }}>
              {STAGES[activeStageIndex].description}
            </p>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <span className="badge-mono" style={{ background: `${STAGES[activeStageIndex].color}22`, color: STAGES[activeStageIndex].color, padding: '4px 12px', borderRadius: 4, fontSize: '0.8125rem' }}>
                LIVE DATA TRANSMISSION STREAMING
              </span>
              <span className="technical-label" style={{ fontSize: '0.6875rem' }}>
                SOURCE · SIMULATION
              </span>
            </div>
          </div>

          <div style={{ background: 'var(--bg-surface-1)', padding: 24, borderRadius: 12, border: '1px solid var(--border-glass)', fontFamily: 'var(--font-mono)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 12 }}>
              <span>SIGNAL FACET DECODER</span>
              <span>QoS 1 TELEMETRY</span>
            </div>
            <div style={{ fontSize: '0.875rem', color: 'var(--accent-cyan)', marginBottom: 8 }}>
              {`> ingest_frame --stage=${STAGES[activeStageIndex].id}`}
            </div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              {`{ "stage_id": "${STAGES[activeStageIndex].id}", "metric_value": "${STAGES[activeStageIndex].value}", "status": "${STAGES[activeStageIndex].status}", "provenance": "SIMULATION" }`}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
