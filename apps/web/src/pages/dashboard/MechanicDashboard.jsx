import React, { useState, useEffect } from 'react';
import { Wrench, AlertTriangle, CheckCircle2, ShieldCheck, Activity, FileText } from 'lucide-react';
import Badge from '../../components/ui/Badge';

export const MechanicDashboard = ({ token, user }) => {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [diagnosis, setDiagnosis] = useState('');
  const [repairAction, setRepairAction] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchTickets = async () => {
    try {
      const headers = { 'Authorization': `Bearer ${token}` };
      const res = await fetch('http://127.0.0.1:8000/api/v1/maintenance', { headers });
      if (res.ok) {
        const data = await res.json();
        setTickets(data);
        if (data.length > 0 && !selectedTicket) {
          setSelectedTicket(data[0]);
          setDiagnosis(data[0].diagnosis || '');
          setRepairAction(data[0].repairAction || '');
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [token]);

  const selectTicket = (t) => {
    setSelectedTicket(t);
    setDiagnosis(t.diagnosis || '');
    setRepairAction(t.repairAction || '');
  };

  const handleUpdate = async (newStatus) => {
    if (!selectedTicket) return;
    setSaving(true);
    try {
      const headers = { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      };
      const res = await fetch(`http://127.0.0.1:8000/api/v1/maintenance/${selectedTicket.ticketId}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({
          diagnosis,
          repairAction,
          status: newStatus,
          assignedMechanicId: user?.userId || 'USR005',
          assignedMechanicName: user?.name || 'Devon Vance'
        })
      });
      if (res.ok) {
        fetchTickets();
        const updated = await res.json();
        setSelectedTicket(updated);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="dashboard-content" style={{ padding: '32px 28px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div>
          <span className="section-eyebrow">Service & Repair Operations</span>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: 4 }}>
            Mechanic Diagnostic Workstation
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>
            Inspect black-box telemetry evidence snapshots, log root-cause diagnosis, and verify repair protocols.
          </p>
        </div>
      </div>

      {/* Split Workstation Layout */}
      <div className="grid-2" style={{ gap: 24, alignItems: 'flex-start' }}>
        {/* Left: Work Order Queue */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
            <strong style={{ color: 'var(--text-primary)', fontSize: '1rem' }}>Active Work Orders ({tickets.length})</strong>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Assigned to Service Center</span>
          </div>

          {tickets.map((t) => {
            const isSelected = selectedTicket?.ticketId === t.ticketId;
            return (
              <div
                key={t.ticketId}
                onClick={() => selectTicket(t)}
                className="card"
                style={{
                  background: isSelected ? 'var(--bg-surface-2)' : 'var(--bg-surface-0)',
                  border: isSelected ? '1px solid var(--accent-cyan)' : '1px solid var(--border-subtle)',
                  padding: 16,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <strong style={{ color: 'var(--text-primary)', fontSize: '0.9375rem' }}>{t.vehicleId}</strong>
                    <Badge variant={t.priority}>{t.priority}</Badge>
                  </div>
                  <Badge variant={t.status}>{t.status}</Badge>
                </div>

                <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: 6 }}>
                  {t.title}
                </div>

                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  Ticket ID: {t.ticketId} • Assigned: {t.assignedMechanicName || 'Unassigned'}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Diagnostic Inspector & Form */}
        {selectedTicket ? (
          <div className="card card-elevated" style={{ background: 'var(--bg-surface-0)', border: '1px solid var(--border-medium)', padding: 28 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <div>
                <span className="section-eyebrow" style={{ fontSize: '0.6875rem', marginBottom: 4 }}>
                  WORK ORDER: {selectedTicket.ticketId}
                </span>
                <h3 style={{ fontSize: '1.35rem', color: 'var(--text-primary)', margin: 0 }}>
                  {selectedTicket.title}
                </h3>
                <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: 4 }}>
                  Vehicle: <strong style={{ color: 'var(--accent-cyan)' }}>{selectedTicket.vehicleId}</strong> • Priority: <strong style={{ color: 'var(--text-primary)' }}>{selectedTicket.priority}</strong>
                </div>
              </div>
              <Badge variant={selectedTicket.status}>{selectedTicket.status}</Badge>
            </div>

            {/* Black-Box Telemetry Evidence Box */}
            <div style={{ background: 'var(--bg-surface-1)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: 16, marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <Activity size={16} color="var(--accent-cyan)" />
                <strong style={{ color: 'var(--text-primary)', fontSize: '0.8125rem' }}>Black-Box Telemetry Evidence Snapshot:</strong>
              </div>
              <div className="grid-3" style={{ gap: 10 }}>
                <div className="metric-box" style={{ padding: '8px 10px' }}>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>FAULT VOLTAGE</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    41.8 V
                  </div>
                </div>
                <div className="metric-box" style={{ padding: '8px 10px' }}>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>CURRENT SPIKE</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.05rem', fontWeight: 700, color: 'var(--status-offline)' }}>
                    38.5 A
                  </div>
                </div>
                <div className="metric-box" style={{ padding: '8px 10px' }}>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>PACK TEMP</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.05rem', fontWeight: 700, color: 'var(--status-offline)' }}>
                    51.4 °C
                  </div>
                </div>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 8 }}>
                Reported Notes: {selectedTicket.notes}
              </div>
            </div>

            {/* Diagnostic Logging Form */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Root Cause Diagnostic Assessment</label>
                <textarea
                  rows={3}
                  placeholder="Document electrical/thermal findings, measured resistance, or component wear..."
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  className="form-textarea"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Repair Action Executed</label>
                <textarea
                  rows={2}
                  placeholder="Detail parts replaced, connector torqued, or firmware recalibration..."
                  value={repairAction}
                  onChange={(e) => setRepairAction(e.target.value)}
                  className="form-textarea"
                />
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => handleUpdate('IN_PROGRESS')}
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                >
                  <Wrench size={16} />
                  <span>Mark In Repair</span>
                </button>
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => handleUpdate('COMPLETED')}
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                >
                  <CheckCircle2 size={16} />
                  <span>Complete & Resolve</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="card" style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
            Select a maintenance ticket from the left queue to begin diagnostic inspection.
          </div>
        )}
      </div>
    </div>
  );
};

export default MechanicDashboard;
