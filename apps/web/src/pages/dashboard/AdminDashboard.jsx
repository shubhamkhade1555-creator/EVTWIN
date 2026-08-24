import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Badge from '../../components/ui/Badge';
import MetricCard from '../../components/ui/MetricCard';

export const AdminDashboard = ({ token }) => {
  const [trips, setTrips] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [vehicles, setVehicles] = useState([]);

  const fetchData = async () => {
    try {
      const headers = { 'Authorization': `Bearer ${token}` };
      const [tripRes, alertRes, vehRes] = await Promise.all([
        fetch((import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000') + '/api/v1/trips', { headers }),
        fetch((import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000') + '/api/v1/alerts', { headers }),
        fetch((import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000') + '/api/v1/vehicles', { headers })
      ]);

      if (tripRes.ok) setTrips(await tripRes.json());
      if (alertRes.ok) setAlerts(await alertRes.json());
      if (vehRes.ok) setVehicles(await vehRes.json());
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  const handleAcknowledge = async (alertId) => {
    try {
      const headers = { 'Authorization': `Bearer ${token}` };
      await fetch(`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'}/api/v1/alerts/${alertId}/acknowledge`, {
        method: 'POST',
        headers
      });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const activeTrips = trips.filter(t => t.status === 'ACTIVE');
  const pendingAlerts = alerts.filter(a => a.status !== 'RESOLVED');

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', paddingBottom: 'var(--sp-12)' }}>
      {/* Header */}
      <div className="flex-between" style={{ flexWrap: 'wrap', gap: 'var(--sp-4)', marginBottom: 'var(--sp-8)' }}>
        <div>
          <span className="eyebrow" style={{ marginBottom: 'var(--sp-3)' }}>Operations & Dispatch Command</span>
          <h1 className="heading-lg" style={{ marginBottom: 'var(--sp-2)' }}>Daily Fleet Dispatch & Alert Triage</h1>
          <p className="body-md">Monitor active vehicle routes, triage real-time thermal alerts, and assign maintenance tickets.</p>
        </div>
      </div>

      {/* KPI Metrics */}
      <div className="g-3" style={{ marginBottom: 'var(--sp-8)' }}>
        <MetricCard
          label="Active Dispatches"
          value={activeTrips.length}
          color="var(--green)"
          description="Vehicles Currently on Route"
        />

        <MetricCard
          label="Pending Triage Alerts"
          value={pendingAlerts.length}
          color={pendingAlerts.length > 0 ? 'var(--red)' : 'var(--green)'}
          description="Faults Requiring Acknowledgment"
        />

        <MetricCard
          label="Total Fleet Assets"
          value={vehicles.length}
          color="var(--cyan)"
          description="Commercial Connected Vehicles"
        />
      </div>

      <div className="g-2" style={{ gap: 'var(--sp-6)' }}>
        {/* Active Trips Table */}
        <div className="card card-interactive" style={{ padding: 'var(--sp-6)' }}>
          <div className="flex-between" style={{ marginBottom: 'var(--sp-5)', alignItems: 'center' }}>
            <h2 className="heading-md" style={{ margin: 0 }}>Active Vehicle Routes</h2>
            <Link to="/trips" className="btn btn-secondary btn-sm">
              All Trips ({trips.length})
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
            {activeTrips.length > 0 ? (
              activeTrips.map((t) => (
                <div key={t.tripId} style={{ background: 'var(--bg-surface-2)', padding: 'var(--sp-4)', borderRadius: 'var(--r-sm)', border: '1px solid var(--border-1)' }}>
                  <div className="flex-between" style={{ marginBottom: 4, alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <strong style={{ color: 'var(--cyan)' }}>{t.vehicleId}</strong>
                      <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>• {t.driverName}</span>
                    </div>
                    <Badge variant="live" pulse>ACTIVE</Badge>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Route: {t.startLocation} → {t.destination}
                  </div>
                </div>
              ))
            ) : (
              <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', textAlign: 'center', padding: 'var(--sp-6)' }}>
                No vehicles currently dispatched on active routes.
              </div>
            )}
          </div>
        </div>

        {/* Real-time Alert Triage Queue */}
        <div className="card card-interactive" style={{ padding: 'var(--sp-6)' }}>
          <div className="flex-between" style={{ marginBottom: 'var(--sp-5)', alignItems: 'center' }}>
            <h2 className="heading-md" style={{ margin: 0 }}>Alert Triage Queue</h2>
            <Link to="/alerts" className="btn btn-secondary btn-sm">
              All Alerts
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
            {pendingAlerts.length > 0 ? (
              pendingAlerts.map((a) => (
                <div key={a.alertId} style={{ background: 'var(--bg-surface-2)', padding: 'var(--sp-4)', borderRadius: 'var(--r-sm)', border: '1px solid var(--border-1)' }}>
                  <div className="flex-between" style={{ alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4 }}>
                        <strong style={{ color: 'var(--text-primary)', fontSize: '0.875rem' }}>{a.title}</strong>
                        <Badge variant={a.severity}>{a.severity}</Badge>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Vehicle: <strong style={{ color: 'var(--cyan)' }}>{a.vehicleId}</strong>
                      </div>
                    </div>

                    {a.status === 'NEW' && (
                      <button
                        onClick={() => handleAcknowledge(a.alertId)}
                        className="btn btn-primary btn-sm"
                        style={{ padding: '4px 8px' }}
                      >
                        Acknowledge
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', textAlign: 'center', padding: 'var(--sp-6)' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto 8px', display: 'block' }}>
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
                <div>All telemetry threshold safety rules nominal.</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
