import React, { useState, useEffect } from 'react';
import ThemeToggle from '../ui/ThemeToggle';

export default function Header({ onSimulateTelemetry }) {
  const [time, setTime] = useState('');
  const [autoSim, setAutoSim] = useState(false);

  useEffect(() => {
    const tick = () => setTime(new Date().toUTCString().slice(17, 25));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!autoSim || !onSimulateTelemetry) return;
    const id = setInterval(onSimulateTelemetry, 2000);
    return () => clearInterval(id);
  }, [autoSim, onSimulateTelemetry]);

  return (
    <header className="dash-header" role="banner">
      {/* Left: Status indicators */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-5)' }}>
        <span className="status-pill status-live">
          <span className="beacon" />
          Platform Live
        </span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
          {time} UTC
        </span>
        <span className="badge badge-amber">PROTOTYPE</span>
      </div>

      {/* Right: Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)' }}>
        {onSimulateTelemetry && (
          <>
            <button
              onClick={() => setAutoSim(a => !a)}
              className={`btn btn-sm ${autoSim ? 'btn-primary' : 'btn-secondary'}`}
              title="Toggle continuous telemetry simulation"
              id="header-auto-sim-btn"
            >
              {autoSim ? (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
              ) : (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              )}
              {autoSim ? 'Auto Sim' : 'Simulate'}
            </button>

            <button
              onClick={onSimulateTelemetry}
              className="btn btn-secondary btn-sm"
              title="Generate a single telemetry packet"
              id="header-step-sim-btn"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M23 4v6h-6"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
              </svg>
              Step
            </button>
          </>
        )}
        <ThemeToggle />
      </div>
    </header>
  );
}
