import React, { useState, useEffect } from 'react';
import { 
  Plus
} from 'lucide-react';
import Badge from '../../components/ui/Badge';

export const MaintenanceView = ({ token }) => {
  const [tickets, setTickets] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [createModal, setCreateModal] = useState(false);
  const [newVehId, setNewVehId] = useState('EV001');
  const [newTitle, setNewTitle] = useState('');
  const [newNotes, setNewNotes] = useState('');
  const [newPriority, setNewPriority] = useState('MEDIUM');

  const fetchData = async () => {
    try {
      const headers = { 'Authorization': `Bearer ${token}` };
      const [ticketsRes, vehRes] = await Promise.all([
        fetch((import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000') + '/api/v1/maintenance', { headers }),
        fetch((import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000') + '/api/v1/vehicles', { headers })
      ]);

      if (ticketsRes.ok) setTickets(await ticketsRes.json());
      if (vehRes.ok) setVehicles(await vehRes.json());
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    try {
      const headers = { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      };
      const res = await fetch((import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000') + '/api/v1/maintenance', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          vehicleId: newVehId,
          title: newTitle,
          notes: newNotes,
          priority: newPriority
        })
      });
      if (res.ok) {
        setCreateModal(false);
        setNewTitle('');
        setNewNotes('');
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="dashboard-content" style={{ padding: '32px 28px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div>
          <span className="section-eyebrow">Service & Repairs</span>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', marginTop: 4 }}>
            Maintenance & Service Work Orders
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>
            Coordinate vehicle servicing, mechanic assignments, and repair validations.
          </p>
        </div>

        <button onClick={() => setCreateModal(true)} className="btn btn-primary btn-sm">
          <Plus size={16} />
          <span>New Work Order</span>
        </button>
      </div>

      {/* Tickets List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {tickets.map((t) => (
          <div key={t.ticketId} className="card" style={{ background: 'var(--bg-surface-0)', border: '1px solid var(--border-medium)', padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <h3 style={{ fontSize: '1.2rem', color: '#fff', margin: 0 }}>{t.title}</h3>
                  <Badge variant={t.priority}>{t.priority}</Badge>
                  <Badge variant={t.status}>{t.status}</Badge>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: 4 }}>
                  Ticket ID: {t.ticketId} • Vehicle: <strong style={{ color: 'var(--accent-cyan)' }}>{t.vehicleId}</strong> • Assigned: <strong style={{ color: '#fff' }}>{t.assignedMechanicName || 'Unassigned'}</strong>
                </div>
              </div>
            </div>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: 12 }}>
              {t.notes}
            </p>

            {t.diagnosis && (
              <div style={{ background: 'var(--bg-surface-1)', borderRadius: 6, padding: 12, marginBottom: 8, fontSize: '0.8125rem' }}>
                <strong style={{ color: 'var(--accent-cyan)' }}>Diagnosis: </strong>
                <span style={{ color: '#fff' }}>{t.diagnosis}</span>
              </div>
            )}

            {t.repairAction && (
              <div style={{ background: 'var(--bg-surface-1)', borderRadius: 6, padding: 12, fontSize: '0.8125rem' }}>
                <strong style={{ color: 'var(--status-live)' }}>Repair Action: </strong>
                <span style={{ color: '#fff' }}>{t.repairAction}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Create Ticket Modal */}
      {createModal && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.8)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000
        }}>
          <div className="card" style={{ maxWidth: 480, width: '100%', background: 'var(--bg-surface-0)', border: '1px solid var(--border-medium)' }}>
            <h3 style={{ color: '#fff', marginBottom: 16 }}>Create Maintenance Work Order</h3>
            <form onSubmit={handleCreateTicket} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: 6 }}>
                  Target Vehicle
                </label>
                <select
                  value={newVehId}
                  onChange={(e) => setNewVehId(e.target.value)}
                  style={{ width: '100%', padding: 10, background: 'var(--bg-surface-2)', border: '1px solid var(--border-subtle)', borderRadius: 6, color: '#fff' }}
                >
                  {vehicles.map(v => (
                    <option key={v.vehicleId} value={v.vehicleId}>{v.vehicleId} - {v.make} {v.model}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: 6 }}>
                  Priority Level
                </label>
                <select
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value)}
                  style={{ width: '100%', padding: 10, background: 'var(--bg-surface-2)', border: '1px solid var(--border-subtle)', borderRadius: 6, color: '#fff' }}
                >
                  <option value="LOW">LOW</option>
                  <option value="MEDIUM">MEDIUM</option>
                  <option value="HIGH">HIGH</option>
                  <option value="EMERGENCY">EMERGENCY</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: 6 }}>
                  Issue Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Inverter Phase Connector Inspection"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  style={{ width: '100%', padding: 10, background: 'var(--bg-surface-2)', border: '1px solid var(--border-subtle)', borderRadius: 6, color: '#fff' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: 6 }}>
                  Notes & Symptoms
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe reported symptoms..."
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  style={{ width: '100%', padding: 10, background: 'var(--bg-surface-2)', border: '1px solid var(--border-subtle)', borderRadius: 6, color: '#fff' }}
                />
              </div>

              <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                <button type="button" onClick={() => setCreateModal(false)} className="btn btn-secondary" style={{ flex: 1 }}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  Create Work Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MaintenanceView;
