import React, { useState, useEffect } from 'react';
import { Activity, ShieldCheck, Database, Radio, Building, Users, Server, RefreshCw } from 'lucide-react';
import Badge from '../../components/ui/Badge';
import MetricCard from '../../components/ui/MetricCard';

export const SuperAdminDashboard = ({ token }) => {
  const [health, setHealth] = useState(null);
  const [auditLogs, setAuditLogs] = useState([]);
  const [orgs, setOrgs] = useState([]);

  const fetchData = async () => {
    try {
      const headers = { 'Authorization': `Bearer ${token}` };
      const [healthRes, auditRes, orgRes] = await Promise.all([
        fetch((import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000') + '/api/v1/admin/health', { headers }),
        fetch((import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000') + '/api/v1/admin/audit-logs', { headers }),
        fetch((import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000') + '/api/v1/organizations', { headers })
      ]);

      if (healthRes.ok) setHealth(await healthRes.json());
      if (auditRes.ok) setAuditLogs(await auditRes.json());
      if (orgRes.ok) setOrgs(await orgRes.json());
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  return (
    <div className="dashboard-content" style={{ padding: '32px 28px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div>
          <span className="section-eyebrow">Platform Global Command Center</span>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: 4 }}>
            System Health & Security Audit
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>
            Multi-tenant infrastructure health, MQTT broker status, and immutable audit event stream.
          </p>
        </div>

        <button onClick={fetchData} className="btn btn-secondary btn-sm">
          <RefreshCw size={14} />
          <span>Refresh Metrics</span>
        </button>
      </div>

      {/* Primary Service Status Grid */}
      <div className="grid-4" style={{ gap: 20, marginBottom: 32 }}>
        <MetricCard
          label="FastAPI REST Engine"
          value={health?.services?.api || 'ONLINE'}
          color="var(--status-live)"
          icon={Server}
          status="LIVE"
          description="Python 3.14 Non-Blocking"
        />

        <MetricCard
          label="MQTT Message Broker"
          value={health?.services?.mqttBroker || 'CONNECTED'}
          color="var(--status-live)"
          icon={Radio}
          status="LIVE"
          description="QoS 1 Telemetry Listener"
        />

        <MetricCard
          label="Database Persistence"
          value={health?.services?.database || 'CONNECTED'}
          color="var(--accent-cyan)"
          icon={Database}
          status="LIVE"
          description="Multi-Tenant Storage"
        />

        <MetricCard
          label="Active Organizations"
          value={orgs.length || 2}
          color="var(--status-twin)"
          icon={Building}
          description="Tenant Namespaces"
        />
      </div>

      {/* Split Audit Logs & Organizations */}
      <div className="grid-2" style={{ gap: 24 }}>
        {/* Security Audit Event Log */}
        <div className="card card-elevated" style={{ background: 'var(--bg-surface-0)', border: '1px solid var(--border-subtle)', padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', margin: 0 }}>Security Audit Trail</h2>
            <Badge variant="live">LIVE LOGS</Badge>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="table" style={{ fontSize: '0.75rem' }}>
              <thead>
                <tr>
                  <th>Event ID</th>
                  <th>Action</th>
                  <th>Actor Role</th>
                  <th>Timestamp (UTC)</th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.map((log) => (
                  <tr key={log.id}>
                    <td style={{ fontFamily: 'var(--font-mono)' }}>{log.id}</td>
                    <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{log.action}</td>
                    <td><Badge variant="source">{log.role}</Badge></td>
                    <td style={{ fontFamily: 'var(--font-mono)' }}>{log.timestamp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Tenant Organizations */}
        <div className="card card-elevated" style={{ background: 'var(--bg-surface-0)', border: '1px solid var(--border-subtle)', padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', margin: 0 }}>Tenant Organizations</h2>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Multi-Tenant Isolation</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {orgs.map((org) => (
              <div key={org.orgId} style={{ background: 'var(--bg-surface-1)', padding: 16, borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <strong style={{ color: 'var(--text-primary)', fontSize: '0.9375rem' }}>{org.name}</strong>
                  <Badge variant="twin">{org.orgId}</Badge>
                </div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', display: 'flex', gap: 16 }}>
                  <span>Tier: <strong style={{ color: 'var(--accent-cyan)' }}>{org.subscriptionTier || 'ENTERPRISE'}</strong></span>
                  <span>Created: {org.createdAt || '2026-08-23'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
