import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2
} from 'lucide-react';
import Badge from '../../components/ui/Badge';

export const AlertsView = ({ token }) => {
  const [alerts, setAlerts] = useState([]);
  const [severityFilter, setSeverityFilter] = useState('ALL');

  const fetchAlerts = async () => {
    try {
      const headers = { 'Authorization': `Bearer ${token}` };
      const res = await fetch('http://127.0.0.1:8000/api/v1/alerts', { headers });
      if (res.ok) {
        setAlerts(await res.json());
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, [token]);

  const handleAcknowledge = async (id) => {
    try {
      const headers = { 'Authorization': `Bearer ${token}` };
      await fetch(`http://127.0.0.1:8000/api/v1/alerts/${id}/acknowledge`, {
        method: 'POST',
        headers
      });
      fetchAlerts();
    } catch (err) {
      console.error(err);
    }
  };

  const handleResolve = async (id) => {
    try {
      const headers = { 'Authorization': `Bearer ${token}` };
      await fetch(`http://127.0.0.1:8000/api/v1/alerts/${id}/resolve`, {
        method: 'POST',
        headers
      });
      fetchAlerts();
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = alerts.filter(a => severityFilter === 'ALL' || a.severity === severityFilter);

  return (
    <div className="dashboard-content" style={{ padding: '32px 28px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div>
          <span className="section-eyebrow">Diagnostics & Safety</span>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', marginTop: 4 }}>
            System Fault & Alert Management
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>
            Evaluate real-time sensor threshold breaches, thermal excursions, and voltage anomalies.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          {['ALL', 'CRITICAL', 'WARNING', 'INFO'].map((sev) => (
            <button
              key={sev}
              onClick={() => setSeverityFilter(sev)}
              className={`btn btn-sm ${severityFilter === sev ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontSize: '0.75rem' }}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* Alerts Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {filtered.map((a) => (
          <div key={a.alertId} className="card" style={{ background: 'var(--bg-surface-0)', border: '1px solid var(--border-medium)', padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 10 }}>
              <div>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <h3 style={{ fontSize: '1.15rem', color: '#fff', margin: 0 }}>{a.title}</h3>
                  <Badge variant={a.severity}>{a.severity}</Badge>
                  <Badge variant={a.status}>{a.status}</Badge>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: 4 }}>
                  Alert ID: {a.alertId} • Vehicle: <strong style={{ color: 'var(--accent-cyan)' }}>{a.vehicleId}</strong> • Logged: {a.timestamp}
                </div>
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                {a.status === 'NEW' && (
                  <button 
                    onClick={() => handleAcknowledge(a.alertId)} 
                    className="btn btn-secondary btn-sm"
                  >
                    Acknowledge
                  </button>
                )}
                {a.status !== 'RESOLVED' && (
                  <button 
                    onClick={() => handleResolve(a.alertId)} 
                    className="btn btn-primary btn-sm"
                  >
                    <CheckCircle2 size={14} />
                    <span>Resolve Alert</span>
                  </button>
                )}
              </div>
            </div>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: 14, lineHeight: 1.5 }}>
              {a.description}
            </p>

            {a.evidence && Object.keys(a.evidence).length > 0 && (
              <div style={{ background: 'var(--bg-surface-1)', borderRadius: 6, padding: '8px 12px', display: 'inline-flex', gap: 16, fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                <span>Evidence Snapshot:</span>
                {Object.entries(a.evidence).map(([k, v]) => (
                  <span key={k}><strong style={{ color: '#fff' }}>{k}:</strong> {String(v)}</span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlertsView;
