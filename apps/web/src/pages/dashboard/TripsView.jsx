import React, { useState, useEffect } from 'react';
import Badge from '../../components/ui/Badge';

export const TripsView = ({ token }) => {
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const headers = { 'Authorization': `Bearer ${token}` };
        const res = await fetch((import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000') + '/api/v1/trips', { headers });
        if (res.ok) {
          setTrips(await res.json());
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchTrips();
  }, [token]);

  return (
    <div className="dashboard-content" style={{ padding: '32px 28px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div>
          <span className="section-eyebrow">Operations & Telematics</span>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', marginTop: 4 }}>
            Fleet Trips & Drive Cycles
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>
            Trace active vehicle dispatches, historical energy consumption, and route metrics.
          </p>
        </div>
      </div>

      {/* Trips Table */}
      <div className="card">
        <h2 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: 16 }}>All Recorded Trips</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8125rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-medium)', background: 'var(--bg-surface-2)', color: '#fff' }}>
                <th style={{ padding: '10px 14px' }}>Trip ID</th>
                <th style={{ padding: '10px 14px' }}>Vehicle</th>
                <th style={{ padding: '10px 14px' }}>Driver</th>
                <th style={{ padding: '10px 14px' }}>Departure → Destination</th>
                <th style={{ padding: '10px 14px' }}>Distance (km)</th>
                <th style={{ padding: '10px 14px' }}>Energy (kWh)</th>
                <th style={{ padding: '10px 14px' }}>Start SOC</th>
                <th style={{ padding: '10px 14px' }}>End SOC</th>
                <th style={{ padding: '10px 14px' }}>Status</th>
              </tr>
            </thead>
            <tbody style={{ color: 'var(--text-secondary)' }}>
              {trips.map((t) => (
                <tr key={t.tripId} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '10px 14px', fontFamily: 'var(--font-mono)', color: '#fff' }}>{t.tripId}</td>
                  <td style={{ padding: '10px 14px', fontWeight: 600, color: 'var(--accent-cyan)' }}>{t.vehicleId}</td>
                  <td style={{ padding: '10px 14px' }}>{t.driverName}</td>
                  <td style={{ padding: '10px 14px' }}>{t.startLocation} → {t.destination}</td>
                  <td style={{ padding: '10px 14px', fontFamily: 'var(--font-mono)' }}>{t.distanceKm} km</td>
                  <td style={{ padding: '10px 14px', fontFamily: 'var(--font-mono)' }}>{t.energyKWh} kWh</td>
                  <td style={{ padding: '10px 14px', fontFamily: 'var(--font-mono)' }}>{t.startSOC}%</td>
                  <td style={{ padding: '10px 14px', fontFamily: 'var(--font-mono)' }}>{t.endSOC ? `${t.endSOC}%` : '—'}</td>
                  <td style={{ padding: '10px 14px' }}>
                    <Badge variant={t.status} pulse={t.status === 'ACTIVE'}>{t.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TripsView;
