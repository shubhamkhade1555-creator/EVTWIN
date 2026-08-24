import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Zap, Cpu, Activity, Layers, Database, ChevronRight, Calculator, CheckCircle2 } from 'lucide-react';
import DiamondFacetFlow from '../../components/public/DiamondFacetFlow';
import DigitalTwinVisualizer from '../../components/public/DigitalTwinVisualizer';
import TechnologyArchitecture from '../../components/public/TechnologyArchitecture';

/* Real-time physics telemetry simulation hook */
function usePhysicsTelemetry() {
  const [data, setData] = useState({
    soc: 78.0,
    voltage: 48.2,
    current: 8.4,
    power: 0.40,
    temp: 34.7,
    speed: 42.0,
    rpm: 2840,
    soh: 92.5,
    internalR: 0.012,
    seq: 14820,
    time: '00:00:00',
  });

  useEffect(() => {
    let t = 0;
    const interval = setInterval(() => {
      t += 0.8;
      setData(prev => {
        const speed = Math.max(0, 42 + 12 * Math.sin(t * 0.15) + 4 * Math.cos(t * 0.4));
        const rpm = Math.round(speed * 67.5);
        const current = Math.max(2, (speed * 0.20) + (Math.sin(t * 0.3) * 3));
        const voltage = +(48.8 - (100 - prev.soc) * 0.05 - (current * 0.02)).toFixed(1);
        const power = +((voltage * current) / 1000).toFixed(2);
        const temp = +(34 + (power * 0.8) + (Math.sin(t * 0.1) * 0.5)).toFixed(1);
        const soc = +(prev.soc - 0.005).toFixed(2);
        const now = new Date().toUTCString().slice(17, 25);

        return {
          soc: soc < 10 ? 92.0 : soc,
          voltage,
          current: +current.toFixed(1),
          power,
          temp,
          speed: +speed.toFixed(1),
          rpm,
          soh: 92.5,
          internalR: 0.012,
          seq: prev.seq + 1,
          time: now,
        };
      });
    }, 850);
    return () => clearInterval(interval);
  }, []);

  return data;
}

export default function Home() {
  const telem = usePhysicsTelemetry();
  const [fleetSize, setFleetSize] = useState(50);
  const annualSavings = Math.round(fleetSize * 1420);
  const batteryExtYears = (fleetSize * 0.08).toFixed(1);

  return (
    <div className="home-page" style={{ background: 'var(--bg-space)', color: 'var(--text-soft)' }}>
      
      {/* ──────────────────────────────────────────────────────────
         1. CINEMATIC AUTOMOTIVE HERO
         ────────────────────────────────────────────────────────── */}
      <section className="bg-hero-glow bg-circuit" style={{ padding: 'clamp(var(--sp-12), 8vw, var(--sp-20)) 0', position: 'relative', overflow: 'hidden' }}>
        <div className="container">
          <div className="grid-2 hero-grid" style={{ alignItems: 'center', gap: 48 }}>
            
            {/* Left Narrative Column */}
            <div>
              <div className="facet-node active" style={{ marginBottom: 20 }}>
                <span className="beacon-dot" /> CONNECTED EV INTELLIGENCE
              </div>

              <h1 className="text-hero" style={{ color: 'var(--text-primary)', marginBottom: 20 }}>
                Connected intelligence <br />
                <span className="text-gradient-electric">for every EV.</span>
              </h1>

              <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 32, maxWidth: 580 }}>
                Understand your vehicle through real-time telemetry, digital-twin intelligence, and physics-grounded vehicle data.
              </p>

              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center', marginBottom: 40 }}>
                <Link to="/product" className="btn btn-primary" style={{ padding: '0.875rem 2rem' }}>
                  Explore EVTWIN <ArrowRight size={18} />
                </Link>
                <Link to="/login" className="btn btn-secondary" style={{ padding: '0.875rem 2rem' }}>
                  Launch Platform
                </Link>
              </div>

              {/* Provenance Tags */}
              <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', paddingTop: 20, borderTop: '1px solid var(--border-1)' }}>
                <div>
                  <div className="mono" style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>100 HZ</div>
                  <div className="technical-label" style={{ fontSize: '0.6875rem' }}>CAN Ingestion</div>
                </div>
                <div>
                  <div className="mono" style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-twin)' }}>2-RC THEVENIN</div>
                  <div className="technical-label" style={{ fontSize: '0.6875rem' }}>Physics Twin</div>
                </div>
                <div>
                  <div className="mono" style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--status-success)' }}>5 ROLES</div>
                  <div className="technical-label" style={{ fontSize: '0.6875rem' }}>RBAC Workstations</div>
                </div>
              </div>
            </div>

            {/* Right Automotive Hero Visual */}
            <div className="hero-visual-col" style={{ position: 'relative' }}>
              <div 
                className="diamond-card" 
                style={{ 
                  background: 'var(--bg-surface-0)', 
                  border: '1px solid var(--border-cyan)', 
                  padding: 24,
                  boxShadow: 'var(--shadow-xl)'
                }}
              >
                {/* Visual Image Container */}
                <div style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', minHeight: 320, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#050a12' }}>
                  <img 
                    src="/assets/hero_ev_cinematic.jpg" 
                    alt="EVTWIN Connected EV Concept" 
                    style={{ width: '100%', height: 'auto', maxHeight: 340, objectFit: 'cover' }}
                  />

                  {/* Real-time HUD Telemetry Callout Overlay */}
                  <div 
                    style={{ 
                      position: 'absolute', 
                      bottom: 16, 
                      left: 16, 
                      right: 16, 
                      background: 'rgba(7, 17, 28, 0.88)', 
                      backdropFilter: 'blur(12px)',
                      border: '1px solid var(--border-glass)',
                      borderRadius: 10,
                      padding: '12px 16px',
                      display: 'grid',
                      gridTemplateColumns: 'repeat(3, 1fr)',
                      gap: 12,
                      fontFamily: 'var(--font-mono)'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.625rem', color: 'var(--text-muted)' }}>SOC / SOH</div>
                      <div style={{ fontSize: '0.9375rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>{telem.soc}% / {telem.soh}%</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.625rem', color: 'var(--text-muted)' }}>PACK VOLTAGE</div>
                      <div style={{ fontSize: '0.9375rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>{telem.voltage} V</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.625rem', color: 'var(--text-muted)' }}>PACK TEMP</div>
                      <div style={{ fontSize: '0.9375rem', fontWeight: 800, color: 'var(--accent-twin)' }}>{telem.temp} °C</div>
                    </div>
                  </div>
                </div>

                {/* Footer Live Telemetry Tag */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>
                  <span style={{ color: 'var(--status-success)', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span className="beacon-dot" style={{ background: 'var(--status-success)' }} /> MQTT 1.0 HZ STREAMING
                  </span>
                  <span className="technical-label" style={{ fontSize: '0.6875rem' }}>SOURCE · SIMULATION</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
         2. DIAMOND FACET PIPELINE FLOW
         ────────────────────────────────────────────────────────── */}
      <DiamondFacetFlow />

      {/* ──────────────────────────────────────────────────────────
         3. INTERACTIVE DIGITAL TWIN VISUALIZER
         ────────────────────────────────────────────────────────── */}
      <DigitalTwinVisualizer />

      {/* ──────────────────────────────────────────────────────────
         4. END-TO-END TECHNOLOGY PIPELINE
         ────────────────────────────────────────────────────────── */}
      <TechnologyArchitecture />

      {/* ──────────────────────────────────────────────────────────
         5. VARIED FEATURE INTEL MODULES
         ────────────────────────────────────────────────────────── */}
      <section style={{ padding: 'var(--sp-16) 0', background: 'var(--bg-space)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: 800, margin: '0 auto var(--sp-12)' }}>
            <div className="technical-label" style={{ color: 'var(--accent-twin)', marginBottom: 8 }}>
              INTELLIGENCE MODULES
            </div>
            <h2 className="text-h2" style={{ color: 'var(--text-primary)', marginBottom: 16 }}>
              Comprehensive EV Intelligence
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.0625rem' }}>
              Deep domain intelligence spanning battery physics, motor drive cycles, thermal safety, and automated service maintenance.
            </p>
          </div>

          <div className="grid-3" style={{ gap: 24 }}>
            {/* Feature 1: Battery Intelligence */}
            <div className="diamond-card">
              <div style={{ width: 44, height: 44, borderRadius: 10, background: 'rgba(201, 168, 255, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-twin)', marginBottom: 20 }}>
                <Zap size={22} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 10 }}>
                Battery Electrochemical Intelligence
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9375rem', lineHeight: 1.6, marginBottom: 20 }}>
                2-RC Thevenin circuit physics models estimate polarization resistance and internal ohmic growth to accurately forecast state of health degradation.
              </p>
              <Link to="/features" style={{ color: 'var(--accent-twin)', fontWeight: 600, fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: 4 }}>
                Explore Battery Twin <ChevronRight size={16} />
              </Link>
            </div>

            {/* Feature 2: Thermal Safety & Fault Alerts */}
            <div className="diamond-card">
              <div style={{ width: 44, height: 44, borderRadius: 10, background: 'rgba(255, 127, 138, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--status-critical)', marginBottom: 20 }}>
                <Activity size={22} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 10 }}>
                Thermal Runaway Early Warning
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9375rem', lineHeight: 1.6, marginBottom: 20 }}>
                Microsecond temperature slope monitoring detects localized cell hot-spotting hours before catastrophic thermal propagation occurs.
              </p>
              <Link to="/features" style={{ color: 'var(--status-critical)', fontWeight: 600, fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: 4 }}>
                Explore Safety Intelligence <ChevronRight size={16} />
              </Link>
            </div>

            {/* Feature 3: Automated Maintenance */}
            <div className="diamond-card">
              <div style={{ width: 44, height: 44, borderRadius: 10, background: 'rgba(138, 215, 255, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-cyan)', marginBottom: 20 }}>
                <Cpu size={22} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 10 }}>
                Automated Workstation Triage
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9375rem', lineHeight: 1.6, marginBottom: 20 }}>
                Automated dispatch of diagnostic black-box evidence snapshots directly to field mechanics and fleet operations leads.
              </p>
              <Link to="/features" style={{ color: 'var(--accent-cyan)', fontWeight: 600, fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: 4 }}>
                Explore Operations Triage <ChevronRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
         6. INTERACTIVE FLEET ROI CALCULATOR
         ────────────────────────────────────────────────────────── */}
      <section style={{ padding: 'var(--sp-16) 0', background: 'var(--bg-void)', borderTop: '1px solid var(--border-1)' }}>
        <div className="container">
          <div className="diamond-card" style={{ padding: 48, background: 'var(--bg-surface-0)' }}>
            <div className="grid-2" style={{ alignItems: 'center', gap: 48 }}>
              <div>
                <div className="technical-label" style={{ color: 'var(--accent-cyan)', marginBottom: 8 }}>
                  COMMERCIAL FLEET ROI ESTIMATOR
                </div>
                <h2 className="text-h2" style={{ color: 'var(--text-primary)', marginBottom: 16 }}>
                  Maximize Fleet Battery Lifetime
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.6, marginBottom: 28 }}>
                  Prevent premature pack replacements and optimize charge cycles through continuous 2-RC physics monitoring.
                </p>

                <div style={{ marginBottom: 24 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontFamily: 'var(--font-mono)' }}>
                    <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>COMMERCIAL FLEET SIZE</span>
                    <span style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>{fleetSize} VEHICLES</span>
                  </div>
                  <input 
                    type="range" 
                    min="5" 
                    max="500" 
                    value={fleetSize} 
                    onChange={(e) => setFleetSize(Number(e.target.value))}
                    style={{ width: '100%', accentColor: 'var(--accent-cyan)', cursor: 'pointer' }}
                  />
                </div>
              </div>

              <div style={{ background: 'var(--bg-surface-1)', padding: 32, borderRadius: 16, border: '1px solid var(--border-cyan)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--status-success)', marginBottom: 16 }}>
                  <Calculator size={20} />
                  <span className="technical-label" style={{ color: 'var(--status-success)', fontSize: '0.75rem' }}>ESTIMATED ANNUAL SAVINGS</span>
                </div>

                <div className="mono" style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--accent-cyan)', lineHeight: 1, marginBottom: 12 }}>
                  ${annualSavings.toLocaleString()} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/ year</span>
                </div>

                <div style={{ fontSize: '0.875rem', color: 'var(--text-soft)', lineHeight: 1.6, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <CheckCircle2 size={16} style={{ color: 'var(--status-success)' }} />
                    <span>Adds ~{batteryExtYears} years of extended battery pack service life</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <CheckCircle2 size={16} style={{ color: 'var(--status-success)' }} />
                    <span>Eliminates unmonitored thermal runaway degradation risks</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
         7. FINAL CTA BANNER
         ────────────────────────────────────────────────────────── */}
      <section style={{ padding: 'var(--sp-20) 0', background: 'var(--bg-space)', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: 840 }}>
          <h2 className="text-h2" style={{ color: 'var(--text-primary)', marginBottom: 16 }}>
            Ready to experience Connected EV Intelligence?
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.125rem', marginBottom: 32 }}>
            Access the EVTWIN multi-role platform console immediately with demo credentials for Super Admin, Company Owner, Admin, Driver, and Mechanic workstations.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
            <Link to="/login" className="btn btn-primary" style={{ padding: '0.875rem 2.25rem' }}>
              Launch Platform Workstation <ArrowRight size={18} />
            </Link>
            <Link to="/contact" className="btn btn-secondary" style={{ padding: '0.875rem 2.25rem' }}>
              Request Hardware Demo
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
