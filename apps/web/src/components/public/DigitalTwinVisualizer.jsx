import React, { useState } from 'react';
import { Eye, ShieldAlert, Cpu, Zap, Activity } from 'lucide-react';

export default function DigitalTwinVisualizer() {
  const [viewMode, setViewMode] = useState('twin'); // 'physical', 'twin', 'diagnostic'

  return (
    <section className="digital-twin-visualizer" style={{ padding: 'var(--sp-16) 0', background: 'var(--bg-space)', position: 'relative' }}>
      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: 840, margin: '0 auto var(--sp-12)' }}>
          <div className="technical-label" style={{ color: 'var(--accent-twin)', marginBottom: 8 }}>
            ELECTROCHEMICAL & PHYSICAL MODELING
          </div>
          <h2 className="text-h2" style={{ color: 'var(--text-primary)', marginBottom: 16 }}>
            High-Fidelity EV Digital Twin
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.125rem' }}>
            Real-time correlation of high-voltage battery telemetry with 2-RC circuit physics to detect micro-anomalies before hardware failure.
          </p>
        </div>

        {/* View Switcher Controls */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginBottom: 32 }}>
          <button
            onClick={() => setViewMode('physical')}
            className={`btn ${viewMode === 'physical' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '0.875rem' }}
          >
            <Eye size={16} /> Physical Vehicle
          </button>
          <button
            onClick={() => setViewMode('twin')}
            className={`btn ${viewMode === 'twin' ? 'btn-twin' : 'btn-secondary'}`}
            style={{ fontSize: '0.875rem' }}
          >
            <Cpu size={16} /> Digital Twin Wireframe
          </button>
          <button
            onClick={() => setViewMode('diagnostic')}
            className={`btn ${viewMode === 'diagnostic' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '0.875rem', borderColor: viewMode === 'diagnostic' ? 'var(--status-critical)' : 'var(--border-glass)' }}
          >
            <ShieldAlert size={16} /> Diagnostic State
          </button>
        </div>

        {/* Viewport Canvas Container */}
        <div 
          className="diamond-card" 
          style={{ 
            minHeight: 520, 
            display: 'flex', 
            flexDirection: 'column', 
            justify: 'space-between',
            position: 'relative',
            background: 'var(--bg-surface-0)',
            border: '1px solid var(--border-cyan)',
            boxShadow: 'var(--shadow-xl)',
            padding: 32
          }}
        >
          {/* Top HUD Telemetry Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16, borderBottom: '1px solid var(--border-1)', paddingBottom: 20 }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>TARGET ASSET</div>
              <div style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)' }}>EV001 · Commercial Fleet Scooter 48V</div>
            </div>

            <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
              <div style={{ fontFamily: 'var(--font-mono)' }}>
                <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>SOC</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>78.0 %</div>
              </div>
              <div style={{ fontFamily: 'var(--font-mono)' }}>
                <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>PACK VOLTAGE</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>48.2 V</div>
              </div>
              <div style={{ fontFamily: 'var(--font-mono)' }}>
                <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>CURRENT</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>8.4 A</div>
              </div>
              <div style={{ fontFamily: 'var(--font-mono)' }}>
                <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>PACK TEMP</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-twin)' }}>34.7 °C</div>
              </div>
              <div style={{ fontFamily: 'var(--font-mono)' }}>
                <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>MOTOR RPM</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>2,840</div>
              </div>
              <div style={{ fontFamily: 'var(--font-mono)' }}>
                <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>SPEED</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>42 km/h</div>
              </div>
            </div>
          </div>

          {/* Central 3D Interactive Stage */}
          <div style={{ position: 'relative', margin: '40px 0', minHeight: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {/* Background Mesh Grid */}
            <div className="bg-circuit" style={{ position: 'absolute', inset: 0, opacity: 0.5, pointerEvents: 'none' }} />

            {/* Vehicle Rendering Asset */}
            <img 
              src="/assets/hero_ev_cinematic.jpg" 
              alt="EV Digital Twin Visualizer"
              style={{ 
                maxHeight: 280, 
                objectFit: 'contain', 
                borderRadius: 12,
                filter: viewMode === 'twin' ? 'brightness(1.1) hue-rotate(30deg) contrast(1.2)' : viewMode === 'diagnostic' ? 'sepia(0.5) hue-rotate(300deg)' : 'none',
                transition: 'all 0.4s ease'
              }} 
            />

            {/* Floating Telemetry Callout Pins */}
            <div className="facet-node active" style={{ position: 'absolute', top: '15%', left: '10%' }}>
              <span className="beacon-dot" /> HV BATTERY PACK: 48.2 V / 34.7 °C
            </div>

            <div className="facet-node active" style={{ position: 'absolute', bottom: '20%', right: '12%', borderColor: 'var(--accent-twin)' }}>
              <span className="beacon-dot" style={{ background: 'var(--accent-twin)' }} /> 2-RC FILTER: CONVERGED (0.012 Ω)
            </div>

            {viewMode === 'diagnostic' && (
              <div className="facet-node active" style={{ position: 'absolute', top: '40%', right: '25%', borderColor: 'var(--status-critical)', color: 'var(--status-critical)' }}>
                <span className="beacon-dot" style={{ background: 'var(--status-critical)' }} /> THERMAL ELEVATION +2.4°C
              </div>
            )}
          </div>

          {/* Bottom Footer Status Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, borderTop: '1px solid var(--border-1)', paddingTop: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Activity size={16} style={{ color: 'var(--status-success)' }} />
              <span style={{ fontSize: '0.8125rem', color: 'var(--text-soft)' }}>
                MODE: <strong style={{ color: 'var(--accent-cyan)' }}>{viewMode.toUpperCase()}</strong> · 2-RC POLARIZATION RESISTANCE ACTIVE
              </span>
            </div>
            <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
              <span className="technical-label" style={{ fontSize: '0.6875rem' }}>DATA PROVENANCE: SIMULATION</span>
              <span className="badge-mono" style={{ background: 'var(--bg-surface-2)', padding: '4px 10px', borderRadius: 4, fontSize: '0.75rem' }}>PROTOTYPE L5</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
