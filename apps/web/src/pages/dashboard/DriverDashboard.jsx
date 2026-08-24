import React, { useState, useEffect } from 'react';
import { Play, Square, MapPin, AlertTriangle, BatteryCharging, Gauge, ArrowRight, ShieldCheck } from 'lucide-react';
import Badge from '../../components/ui/Badge';
import RadialGauge from '../../components/ui/RadialGauge';

export const DriverDashboard = ({ token, user }) => {
  const [vehicle, setVehicle] = useState(null);
  const [telemetry, setTelemetry] = useState(null);
  const [activeTrip, setActiveTrip] = useState(null);
  const [startModal, setStartModal] = useState(false);
  const [destination, setDestination] = useState('Central City Logistics Hub');
  const vehicleId = 'EV001';

  const fetchData = async () => {
    try {
      const headers = { 'Authorization': `Bearer ${token}` };
      const [vehRes, telRes, tripRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'}/api/v1/vehicles/${vehicleId}`, { headers }),
        fetch(`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'}/api/v1/vehicles/${vehicleId}/telemetry/latest`, { headers }),
        fetch((import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000') + '/api/v1/trips', { headers })
      ]);

      if (vehRes.ok) setVehicle(await vehRes.json());
      if (telRes.ok) setTelemetry(await telRes.json());
      if (tripRes.ok) {
        const trips = await tripRes.json();
        const cur = trips.find(t => t.vehicleId === vehicleId && t.status === 'ACTIVE');
        setActiveTrip(cur || null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, [token]);

  const handleStartTrip = async (e) => {
    e.preventDefault();
    try {
      const headers = { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      };
      const res = await fetch((import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000') + '/api/v1/trips/start', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          vehicleId,
          driverId: user?.userId || 'USR004',
          driverName: user?.name || 'Marcus Vance',
          startLocation: 'Main Depot Berth 3',
          destination
        })
      });
      if (res.ok) {
        setStartModal(false);
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEndTrip = async () => {
    if (!activeTrip) return;
    try {
      const headers = { 'Authorization': `Bearer ${token}` };
      await fetch(`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'}/api/v1/trips/${activeTrip.tripId}/end`, {
        method: 'POST',
        headers
      });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const soc = telemetry?.battery?.soc ?? 0;
  const usableRangeKm = Math.round((soc / 100) * 110);

  return (
    <div className="dashboard-content" style={{ padding: '32px 28px' }}>
      {/* Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div>
          <span className="section-eyebrow">Distraction-Free Driver Terminal</span>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: 4 }}>
            Vehicle Instrument Cluster
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>
            Assigned: <strong style={{ color: 'var(--accent-cyan)' }}>{vehicleId}</strong> • {vehicle?.make || 'Alpha'} {vehicle?.model || 'Commercial 48V'}
          </p>
        </div>

        <div>
          {activeTrip ? (
            <button onClick={handleEndTrip} className="btn btn-danger btn-lg">
              <Square size={18} />
              <span>Complete & End Trip</span>
            </button>
          ) : (
            <button onClick={() => setStartModal(true)} className="btn btn-primary btn-lg">
              <Play size={18} />
              <span>Start New Trip</span>
            </button>
          )}
        </div>
      </div>

      {/* Main HUD Cluster */}
      <div className="grid-2" style={{ gap: 24, marginBottom: 28 }}>
        {/* Left: Battery & Range Instrument Gauge */}
        <div className="card card-elevated" style={{ background: 'var(--bg-surface-0)', border: '1px solid var(--border-medium)', textAlign: 'center', padding: '36px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)' }}>
              PRIMARY BATTERY STATE
            </span>
            <Badge variant="live">MQTTS 1.0 HZ</Badge>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
            <RadialGauge 
              value={soc}
              unit="%"
              label="Remaining Pack Charge"
              size={220}
              warningThreshold={30}
              criticalThreshold={15}
              colorScheme="soc"
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 32, marginTop: 12 }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ESTIMATED USABLE RANGE</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
                {usableRangeKm} <span style={{ fontSize: '0.875rem' }}>km</span>
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>PACK VOLTAGE</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {telemetry?.battery?.voltage?.toFixed(1) ?? '0.0'} <span style={{ fontSize: '0.875rem' }}>V</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Powertrain & Active Drive Status */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Active Trip Box */}
          <div className="card" style={{ background: activeTrip ? 'rgba(16, 185, 129, 0.08)' : 'var(--bg-surface-0)', border: activeTrip ? '1px solid var(--status-live)' : '1px solid var(--border-subtle)', padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <MapPin size={18} color={activeTrip ? 'var(--status-live)' : 'var(--text-muted)'} />
                <strong style={{ color: 'var(--text-primary)', fontSize: '1rem' }}>
                  {activeTrip ? 'Active Drive Cycle In Progress' : 'Vehicle Idle / Parked'}
                </strong>
              </div>
              <Badge variant={activeTrip ? 'live' : 'source'}>
                {activeTrip ? 'RECORDING' : 'READY'}
              </Badge>
            </div>

            {activeTrip ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                <div>Trip ID: <strong style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>{activeTrip.tripId}</strong></div>
                <div>Route: <strong style={{ color: 'var(--text-primary)' }}>{activeTrip.startLocation} → {activeTrip.destination}</strong></div>
                <div>Departure SOC: <strong style={{ color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>{activeTrip.startSOC}%</strong></div>
              </div>
            ) : (
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', margin: 0 }}>
                Click "Start New Trip" above to begin drive logging and route telemetry recording.
              </p>
            )}
          </div>

          {/* Real-Time Motor & Thermal Status */}
          <div className="grid-2" style={{ gap: 16, flex: 1 }}>
            <div className="metric-box">
              <div className="metric-label">Vehicle Speed</div>
              <div className="metric-value" style={{ color: 'var(--accent-cyan)' }}>
                {telemetry?.vehicle?.speed?.toFixed(1) ?? '0.0'} <span className="metric-unit">km/h</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: 4 }}>
                Motor RPM: {telemetry?.motor?.rpm ?? 0}
              </div>
            </div>

            <div className="metric-box">
              <div className="metric-label">Battery Temperature</div>
              <div className="metric-value" style={{ color: (telemetry?.battery?.temperature ?? 0) > 48 ? 'var(--status-offline)' : 'var(--status-live)' }}>
                {telemetry?.battery?.temperature?.toFixed(1) ?? '0.0'} <span className="metric-unit">°C</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: 4 }}>
                Nominal Thermal Range
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Start Trip Modal */}
      {startModal && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.8)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000,
          padding: 20
        }}>
          <div className="card card-elevated" style={{ maxWidth: 460, width: '100%', background: 'var(--bg-surface-0)', border: '1px solid var(--border-medium)' }}>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', marginBottom: 16 }}>Start New Drive Cycle</h3>
            <form onSubmit={handleStartTrip} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div className="form-group">
                <label className="form-label">Vehicle & Driver</label>
                <input
                  type="text"
                  disabled
                  value={`${vehicleId} • ${user?.name || 'Driver'}`}
                  className="form-input"
                  style={{ opacity: 0.7 }}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Destination Location *</label>
                <input
                  type="text"
                  required
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="form-input"
                />
              </div>

              <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                <button type="button" onClick={() => setStartModal(false)} className="btn btn-secondary" style={{ flex: 1 }}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  Confirm & Start
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DriverDashboard;
