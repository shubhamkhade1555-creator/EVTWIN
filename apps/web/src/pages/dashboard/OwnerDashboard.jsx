import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function MetricTile({ label, value, unit, colorVar, barPct }) {
  return (
    <div className="card card-interactive" style={{ padding: 'var(--sp-5)' }}>
      <div style={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 'var(--sp-2)' }}>
        {label}
      </div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '2rem', fontWeight: 800, color: colorVar || 'var(--text-primary)', lineHeight: 1 }}>
        {value}
        <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginLeft: 4 }}>{unit}</span>
      </div>
      {barPct !== undefined && (
        <div className="prog-bar" style={{ marginTop: 'var(--sp-4)' }}>
          <div className="prog-fill" style={{ width: `${Math.min(100, Math.max(0, barPct))}%`, background: colorVar || 'var(--cyan)' }} />
        </div>
      )}
    </div>
  );
}

export const OwnerDashboard = ({ token }) => {
  const [vehicles, setVehicles] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = { 'Authorization': `Bearer ${token}` };
        const [vehRes, alertRes, anaRes] = await Promise.all([
          fetch((import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000') + '/api/v1/vehicles', { headers }),
          fetch((import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000') + '/api/v1/alerts', { headers }),
          fetch((import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000') + '/api/v1/analytics/fleet', { headers })
        ]);

        if (vehRes.ok) setVehicles(await vehRes.json());
        if (alertRes.ok) setAlerts(await alertRes.json());
        if (anaRes.ok) setAnalytics(await anaRes.json());
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [token]);

  const criticalAlerts = alerts.filter(a => a.severity === 'CRITICAL' && a.status !== 'RESOLVED');

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', paddingBottom: 'var(--sp-12)' }}>
      {/* Header */}
      <div className="flex-between" style={{ marginBottom: 'var(--sp-8)', flexWrap: 'wrap', gap: 'var(--sp-4)' }}>
        <div>
          <span className="eyebrow" style={{ marginBottom: 'var(--sp-3)' }}>Executive Fleet Operations</span>
          <h1 className="heading-lg" style={{ marginBottom: 'var(--sp-2)' }}>Fleet Overview</h1>
          <p className="body-md">High-level health indices, degradation trends, and active asset status.</p>
        </div>
        <Link to="/vehicles" className="btn btn-primary">
          View All Vehicles ({vehicles.length})
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </Link>
      </div>

      {/* Critical Alert Banner */}
      {criticalAlerts.length > 0 && (
        <div style={{ background: 'var(--red-bg)', border: '1px solid var(--red-border)', borderRadius: 'var(--r-md)', padding: 'var(--sp-5)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--sp-8)', flexWrap: 'wrap', gap: 'var(--sp-4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-4)' }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--red)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            </div>
            <div>
              <strong style={{ color: 'var(--red)', fontSize: '0.9375rem', display: 'block', marginBottom: 2 }}>{criticalAlerts.length} Critical Battery Anomaly Detected</strong>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-primary)' }}>
                {criticalAlerts[0].title} on vehicle <strong style={{ color: 'var(--cyan)' }}>{criticalAlerts[0].vehicleId}</strong>
              </div>
            </div>
          </div>
          <Link to="/alerts" className="btn btn-danger btn-sm">Triage Alerts</Link>
        </div>
      )}

      {/* Primary KPI Grid */}
      <div className="g-4" style={{ marginBottom: 'var(--sp-10)' }}>
        <MetricTile label="Total Fleet Distance" value={analytics?.totalDistanceKm || 18271.5} unit="km" colorVar="var(--cyan)" />
        <MetricTile label="Average Battery SOC" value={analytics?.averageSOC || 78.4} unit="%" colorVar="var(--green)" barPct={analytics?.averageSOC || 78.4} />
        <MetricTile label="Average Battery SOH" value={analytics?.averageSOH || 94.2} unit="%" colorVar="var(--violet)" barPct={analytics?.averageSOH || 94.2} />
        <MetricTile label="Active Utilization" value={vehicles.length ? Math.round((vehicles.filter(v => v.status === 'RUNNING' || v.status === 'READY').length / vehicles.length) * 100) : 75} unit="%" colorVar="var(--blue)" barPct={75} />
      </div>

      {/* Fleet Vehicles Grid */}
      <div>
        <div className="flex-between" style={{ marginBottom: 'var(--sp-5)' }}>
          <h2 className="heading-md">Active Fleet Vehicles</h2>
          <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{vehicles.length} Total Registered Assets</span>
        </div>

        <div className="g-2">
          {vehicles.map((v) => (
            <div key={v.vehicleId} className="card card-interactive" style={{ padding: 'var(--sp-6)' }}>
              <div className="flex-between" style={{ marginBottom: 'var(--sp-5)', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)', marginBottom: 'var(--sp-1)' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>{v.vehicleId}</h3>
                    <span className={`badge ${v.status === 'RUNNING' ? 'badge-green' : v.status === 'OFFLINE' ? 'badge-red' : 'badge-amber'}`}>{v.status}</span>
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                    {v.make} {v.model} • {v.vin}
                  </div>
                </div>
                <Link to={`/vehicles/${v.vehicleId}`} className="btn btn-secondary btn-sm">
                  Telemetry
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </Link>
              </div>

              <div className="g-3" style={{ background: 'var(--bg-surface-2)', padding: 'var(--sp-4)', borderRadius: 'var(--r-sm)', border: '1px solid var(--border-1)' }}>
                <div>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginBottom: 2 }}>BATTERY PACK</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {v.batteryPack?.nominalVoltage || 48}V ({v.batteryPack?.capacityKWh || 12.8} kWh)
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginBottom: 2 }}>CHEMISTRY</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9375rem', fontWeight: 700, color: 'var(--cyan)' }}>
                    {v.batteryPack?.chemistry || 'LFP'}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginBottom: 2 }}>HEALTH (SOH)</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9375rem', fontWeight: 700, color: 'var(--violet)' }}>
                    {v.batteryPack?.soh || 95}%
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;
