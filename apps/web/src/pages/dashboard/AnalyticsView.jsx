import React, { useState, useEffect } from 'react';

export const AnalyticsView = ({ token }) => {
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const headers = { 'Authorization': `Bearer ${token}` };
        const res = await fetch((import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000') + '/api/v1/analytics/fleet', { headers });
        if (res.ok) {
          setAnalytics(await res.json());
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchAnalytics();
  }, [token]);

  return (
    <div className="dashboard-content" style={{ padding: '32px 28px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div>
          <span className="section-eyebrow">Fleet Intelligence</span>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', marginTop: 4 }}>
            Fleet Analytics & Degradation Trends
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>
            Aggregated operational metrics, state of health distributions, and fleet energy consumption.
          </p>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid-4" style={{ gap: 20, marginBottom: 32 }}>
        <div className="card">
          <div className="metric-label">Total Distance Traveled</div>
          <div className="metric-value" style={{ color: 'var(--accent-cyan)' }}>
            {analytics?.totalDistanceKm || 18271.5} <span className="metric-unit">km</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: 4 }}>Fleet-Wide Telemetry Sum</div>
        </div>

        <div className="card">
          <div className="metric-label">Fleet Average SOC</div>
          <div className="metric-value" style={{ color: 'var(--status-live)' }}>
            {analytics?.averageSOC || 78.4} <span className="metric-unit">%</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: 4 }}>Nominal Fleet Charge State</div>
        </div>

        <div className="card">
          <div className="metric-label">Fleet Average SOH</div>
          <div className="metric-value" style={{ color: 'var(--status-twin)' }}>
            {analytics?.averageSOH || 94.2} <span className="metric-unit">%</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: 4 }}>Low Pack Degradation</div>
        </div>

        <div className="card">
          <div className="metric-label">Fleet Active Utilization</div>
          <div className="metric-value">
            {analytics?.totalVehicles ? Math.round((analytics.activeVehicles / analytics.totalVehicles) * 100) : 50} <span className="metric-unit">%</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: 4 }}>Vehicles Active or Ready</div>
        </div>
      </div>

      {/* Analytics Breakdown Grid */}
      <div className="grid-2" style={{ gap: 24 }}>
        <div className="card">
          <h3 style={{ color: '#fff', marginBottom: 16 }}>Vehicle Status Distribution</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: 4 }}>
                <span style={{ color: 'var(--text-secondary)' }}>Active / Running</span>
                <strong style={{ color: 'var(--status-live)' }}>{analytics?.activeVehicles || 2}</strong>
              </div>
              <div style={{ width: '100%', height: 6, background: 'var(--bg-surface-2)', borderRadius: 3 }}>
                <div style={{ width: '50%', height: '100%', background: 'var(--status-live)', borderRadius: 3 }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: 4 }}>
                <span style={{ color: 'var(--text-secondary)' }}>Idle</span>
                <strong style={{ color: 'var(--status-stale)' }}>{analytics?.idleVehicles || 1}</strong>
              </div>
              <div style={{ width: '100%', height: 6, background: 'var(--bg-surface-2)', borderRadius: 3 }}>
                <div style={{ width: '25%', height: '100%', background: 'var(--status-stale)', borderRadius: 3 }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: 4 }}>
                <span style={{ color: 'var(--text-secondary)' }}>In Maintenance / Service</span>
                <strong style={{ color: 'var(--status-offline)' }}>{analytics?.serviceVehicles || 1}</strong>
              </div>
              <div style={{ width: '100%', height: 6, background: 'var(--bg-surface-2)', borderRadius: 3 }}>
                <div style={{ width: '25%', height: '100%', background: 'var(--status-offline)', borderRadius: 3 }} />
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 style={{ color: '#fff', marginBottom: 16 }}>Energy & Telemetry Summary</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border-subtle)' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Estimated Energy Consumed</span>
              <strong style={{ color: '#fff' }}>886.2 kWh</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border-subtle)' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Average Energy Intensity</span>
              <strong style={{ color: 'var(--status-live)' }}>48.5 Wh / km</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border-subtle)' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>CO2 Emissions Avoided</span>
              <strong style={{ color: 'var(--accent-cyan)' }}>2,480 kg CO2e</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Telemetry Ingestion Cadence</span>
              <span style={{ color: '#fff', fontFamily: 'var(--font-mono)', fontSize: '0.8125rem' }}>1.0 Hz (1 pkt/sec)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsView;
