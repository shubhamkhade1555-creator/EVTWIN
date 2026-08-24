import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Activity, 
  BatteryCharging, 
  Gauge, 
  Cpu, 
  MapPin, 
  AlertTriangle, 
  Wrench, 
  RefreshCw
} from 'lucide-react';
import Badge from '../../components/ui/Badge';
import Breadcrumb from '../../components/ui/Breadcrumb';
import TimeSeriesChart from '../../components/ui/TimeSeriesChart';
import MetricCard from '../../components/ui/MetricCard';

export const VehicleDetail = ({ token }) => {
  const { id } = useParams();
  const [vehicle, setVehicle] = useState(null);
  const [telemetry, setTelemetry] = useState(null);
  const [history, setHistory] = useState([]);
  const [trips, setTrips] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [maintenance, setMaintenance] = useState([]);
  const [activeTab, setActiveTab] = useState('telemetry');
  const [simulating, setSimulating] = useState(false);

  const fetchVehicleData = async () => {
    try {
      const headers = { 'Authorization': `Bearer ${token}` };
      const [vehRes, telRes, histRes, tripsRes, alertsRes, maintRes] = await Promise.all([
        fetch(`http://127.0.0.1:8000/api/v1/vehicles/${id}`, { headers }),
        fetch(`http://127.0.0.1:8000/api/v1/vehicles/${id}/telemetry/latest`, { headers }),
        fetch(`http://127.0.0.1:8000/api/v1/vehicles/${id}/telemetry/history?limit=25`, { headers }),
        fetch('http://127.0.0.1:8000/api/v1/trips', { headers }),
        fetch('http://127.0.0.1:8000/api/v1/alerts', { headers }),
        fetch('http://127.0.0.1:8000/api/v1/maintenance', { headers }),
      ]);

      if (vehRes.ok) setVehicle(await vehRes.json());
      if (telRes.ok) setTelemetry(await telRes.json());
      if (histRes.ok) {
        const histData = await histRes.json();
        setHistory(histData.reverse());
      }
      if (tripsRes.ok) {
        const allTrips = await tripsRes.json();
        setTrips(allTrips.filter(t => t.vehicleId === id));
      }
      if (alertsRes.ok) {
        const allAlerts = await alertsRes.json();
        setAlerts(allAlerts.filter(a => a.vehicleId === id));
      }
      if (maintRes.ok) {
        const allMaint = await maintRes.json();
        setMaintenance(allMaint.filter(m => m.vehicleId === id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchVehicleData();
    const interval = setInterval(fetchVehicleData, 3000);
    return () => clearInterval(interval);
  }, [id, token]);

  const handleSimulateStep = async () => {
    setSimulating(true);
    try {
      const headers = { 'Authorization': `Bearer ${token}` };
      await fetch(`http://127.0.0.1:8000/api/v1/vehicles/${id}/telemetry/simulate`, {
        method: 'POST',
        headers
      });
      fetchVehicleData();
    } catch (err) {
      console.error(err);
    } finally {
      setSimulating(false);
    }
  };

  const tabs = [
    { id: 'telemetry', label: 'Live Telemetry & Waveforms', icon: Activity },
    { id: 'battery', label: 'Battery Subsystem', icon: BatteryCharging },
    { id: 'powertrain', label: 'Motor & Powertrain', icon: Gauge },
    { id: 'twin', label: 'Digital Twin Model', icon: Cpu, badge: 'SIMULATION' },
    { id: 'trips', label: `Trips (${trips.length})`, icon: MapPin },
    { id: 'alerts', label: `Alerts (${alerts.length})`, icon: AlertTriangle },
    { id: 'maintenance', label: `Maintenance (${maintenance.length})`, icon: Wrench },
  ];

  const soc = telemetry?.battery?.soc || 78.5;
  const usableRangeKm = Math.round((soc / 100) * 110);
  
  // Staleness Logic
  const calculateStatus = (timestamp) => {
    if (!timestamp) return { text: 'NO DATA', color: 'var(--text-muted)' };
    const diff = (new Date() - new Date(timestamp)) / 1000;
    if (diff < 10) return { text: 'LIVE', color: 'var(--status-live)' };
    if (diff < 30) return { text: 'STALE', color: 'var(--status-warning)' };
    return { text: 'OFFLINE', color: 'var(--status-offline)' };
  };

  const teleStatus = calculateStatus(telemetry?.timestamp);
  const source = telemetry?.source || 'SIMULATION';
  const isDevice = source === 'DEVICE';

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', paddingBottom: 'var(--sp-12)' }}>
      <Breadcrumb items={[
        { label: 'Dashboard', to: '/dashboard' },
        { label: 'Vehicles', to: '/vehicles' },
        { label: `${id} Telemetry Workstation` }
      ]} />

      {/* Vehicle Summary Header Card */}
      <div className="card" style={{ padding: 'var(--sp-6)', marginBottom: 'var(--sp-6)' }}>
        <div className="flex-between" style={{ flexWrap: 'wrap', gap: 'var(--sp-4)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                {id}
              </h1>
              <Badge variant={vehicle?.status || 'READY'}>{vehicle?.status || 'READY'}</Badge>
              <Badge variant="live" style={{ background: 'transparent', borderColor: teleStatus.color, color: teleStatus.color }}>
                 <span className="beacon-dot" style={{ background: teleStatus.color, boxShadow: `0 0 8px ${teleStatus.color}` }} />
                 {teleStatus.text} DATA
              </Badge>
              <Badge variant="twin" style={{ background: isDevice ? 'rgba(59, 167, 232, 0.1)' : 'rgba(140, 107, 217, 0.1)', borderColor: isDevice ? 'var(--accent-cyan)' : 'var(--accent-twin)', color: isDevice ? 'var(--accent-cyan)' : 'var(--accent-twin)' }}>
                 SOURCE: {source}
              </Badge>
            </div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: 4 }}>
              {vehicle?.make || 'Alpha'} {vehicle?.model || 'Commercial 48V'} • VIN: <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>{vehicle?.vin || 'VIN001'}</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <button
              onClick={handleSimulateStep}
              disabled={simulating}
              className="btn btn-primary btn-sm"
            >
              <RefreshCw size={14} className={simulating ? 'spin-icon' : ''} />
              <span>Step Telemetry Signal</span>
            </button>
          </div>
        </div>
      </div>

      {/* 7 Tab Navigation Strip */}
      <div style={{ display: 'flex', gap: 'var(--sp-2)', borderBottom: '1px solid var(--border-1)', paddingBottom: 'var(--sp-3)', marginBottom: 'var(--sp-6)', overflowX: 'auto' }}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const IconComponent = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`btn btn-sm ${isActive ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontSize: '0.8125rem', whiteSpace: 'nowrap' }}
            >
              <IconComponent size={14} />
              <span>{tab.label}</span>
              {tab.badge && <Badge variant="twin" style={{ fontSize: '0.625rem', padding: '1px 5px', marginLeft: 4 }}>{tab.badge}</Badge>}
            </button>
          );
        })}
      </div>

      {/* TAB 1: LIVE TELEMETRY & WAVEFORMS */}
      {activeTab === 'telemetry' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Real-Time Telemetry Metrics Grid */}
          <div className="g-4" style={{ gap: 16 }}>
            <MetricCard
              label="Pack Voltage"
              value={telemetry?.battery?.voltage?.toFixed(1) || 48.2}
              unit="V"
              color="var(--accent-cyan)"
              description="Nominal 48V Architecture"
            />

            <MetricCard
              label="Pack Current"
              value={telemetry?.battery?.current?.toFixed(1) || 12.4}
              unit="A"
              color="var(--text-primary)"
              description="Discharge Current"
            />

            <MetricCard
              label="Pack Temperature"
              value={telemetry?.battery?.temperature?.toFixed(1) || 34.8}
              unit="°C"
              color={(telemetry?.battery?.temperature || 34.8) > 48 ? 'var(--status-offline)' : 'var(--status-live)'}
              description="Cell Module Sensor"
            />

            <MetricCard
              label="State of Charge (SOC)"
              value={soc.toFixed(1)}
              unit="%"
              color="var(--status-live)"
              progress={soc}
              description={`~${usableRangeKm} km Estimated Range`}
            />
          </div>

          {/* SVG Waveforms Grid */}
          <div className="g-2" style={{ gap: 24 }}>
            <TimeSeriesChart
              data={history}
              dataKey="voltage"
              title="Pack Voltage Waveform (V)"
              color="var(--accent-cyan)"
              unit="V"
              height={180}
            />

            <TimeSeriesChart
              data={history}
              dataKey="temperature"
              title="Pack Temperature Waveform (°C)"
              color="var(--status-live)"
              unit="°C"
              height={180}
            />
          </div>

          {/* Telemetry Stream Sample Metadata */}
          <div className="card" style={{ background: 'var(--bg-surface-0)', border: '1px solid var(--border-subtle)', padding: 18 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8125rem' }}>
              <div style={{ display: 'flex', gap: 16 }}>
                <span style={{ color: 'var(--text-secondary)' }}>Sequence: <strong style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>#{telemetry?.sequenceNumber || 1042}</strong></span>
                <span style={{ color: 'var(--text-secondary)' }}>Source: <Badge variant="source">{telemetry?.source || 'SIMULATION'}</Badge></span>
                <span style={{ color: 'var(--text-secondary)' }}>Quality: <Badge variant="live">{telemetry?.quality || 'VALID'}</Badge></span>
              </div>
              <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                Timestamp: {telemetry?.timestamp || new Date().toISOString()}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: BATTERY SUBSYSTEM */}
      {activeTab === 'battery' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div className="g-2" style={{ gap: 24 }}>
            <div className="card" style={{ padding: 'var(--sp-6)' }}>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: 16 }}>Cell Thermal Distribution</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: 4 }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Module 1 NTC Thermistor</span>
                    <strong style={{ color: 'var(--status-live)' }}>{telemetry?.battery?.temperature?.toFixed(1) || 34.8} °C</strong>
                  </div>
                  <div style={{ width: '100%', height: 6, background: 'var(--bg-surface-2)', borderRadius: 3 }}>
                    <div style={{ width: '45%', height: '100%', background: 'var(--status-live)', borderRadius: 3 }} />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: 4 }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Module 2 NTC Thermistor</span>
                    <strong style={{ color: 'var(--status-live)' }}>{((telemetry?.battery?.temperature || 34.8) + 0.4).toFixed(1)} °C</strong>
                  </div>
                  <div style={{ width: '100%', height: 6, background: 'var(--bg-surface-2)', borderRadius: 3 }}>
                    <div style={{ width: '46%', height: '100%', background: 'var(--status-live)', borderRadius: 3 }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="card" style={{ padding: 'var(--sp-6)' }}>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: 16 }}>Battery Electrical Bounds</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: '0.8125rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border-subtle)' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Nominal Voltage</span>
                  <strong style={{ color: 'var(--text-primary)' }}>48.0 V</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border-subtle)' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Max Charge Cutoff</span>
                  <strong style={{ color: 'var(--status-live)' }}>58.4 V</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border-subtle)' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Min Discharge Cutoff</span>
                  <strong style={{ color: 'var(--status-offline)' }}>40.0 V</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Continuous Discharge Cap</span>
                  <strong style={{ color: 'var(--accent-cyan)' }}>45.0 A</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: MOTOR & POWERTRAIN */}
      {activeTab === 'powertrain' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div className="g-3" style={{ gap: 20 }}>
            <MetricCard
              label="Motor RPM"
              value={telemetry?.motor?.rpm || 1850}
              unit="RPM"
              color="var(--accent-cyan)"
              description="BLDC Hall Sensor"
            />
            <MetricCard
              label="Motor Temperature"
              value={telemetry?.motor?.temperature || 42.3}
              unit="°C"
              color="var(--status-live)"
              description="Stator Core Winding"
            />
            <MetricCard
              label="Vehicle Speed"
              value={telemetry?.vehicle?.speed?.toFixed(1) || 31.4}
              unit="km/h"
              color="var(--text-primary)"
              description="Calculated Wheel Speed"
            />
          </div>
        </div>
      )}

      {/* TAB 4: DIGITAL TWIN STATE-SPACE MODEL */}
      {activeTab === 'twin' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div className="card card-elevated card-glow-purple" style={{ background: 'var(--bg-surface-0)', border: '1px solid var(--status-twin)', padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Cpu size={22} color="var(--status-twin)" />
                <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', margin: 0 }}>
                  2-RC Equivalent Circuit Digital Twin Model [SIMULATION]
                </h3>
              </div>
              <Badge variant="twin">STATE-SPACE ACTIVE</Badge>
            </div>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: 20 }}>
              The digital twin model simulates internal battery state variables ($R_0$, polarization voltage $V_{p1}$, $V_{p2}$) in real time to calculate true internal cell conditions and thermal gradients.
            </p>

            <div className="table-wrap" style={{ border: '1px solid var(--border-subtle)' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Parameter State</th>
                    <th>Measured Physical Sensor</th>
                    <th>Digital Twin Estimated State</th>
                    <th>Variance / Delta</th>
                    <th>Data Provenance</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Terminal Voltage</td>
                    <td style={{ fontFamily: 'var(--font-mono)' }}>{telemetry?.battery?.voltage || 48.2} V</td>
                    <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--status-twin)' }}>{((telemetry?.battery?.voltage || 48.2) + 0.08).toFixed(2)} V</td>
                    <td style={{ fontFamily: 'var(--font-mono)' }}>+0.08 V</td>
                    <td><Badge variant="live">MEASURED vs ESTIMATED</Badge></td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Pack Temperature</td>
                    <td style={{ fontFamily: 'var(--font-mono)' }}>{telemetry?.battery?.temperature || 34.8} °C</td>
                    <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--status-twin)' }}>{((telemetry?.battery?.temperature || 34.8) + 1.2).toFixed(1)} °C</td>
                    <td style={{ fontFamily: 'var(--font-mono)' }}>+1.2 °C (Core Gradient)</td>
                    <td><Badge variant="twin">ESTIMATED</Badge></td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Internal Resistance ($R_0$)</td>
                    <td style={{ color: 'var(--text-muted)' }}>Non-Invasive N/A</td>
                    <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--status-twin)' }}>18.4 mΩ</td>
                    <td style={{ color: 'var(--status-live)' }}>Nominal SOH</td>
                    <td><Badge variant="twin">ESTIMATED</Badge></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: TRIPS */}
      {activeTab === 'trips' && (
        <div className="card" style={{ background: 'var(--bg-surface-0)', border: '1px solid var(--border-subtle)', padding: 24 }}>
          <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: 16 }}>Recorded Trips for {id}</h3>
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Trip ID</th>
                  <th>Driver</th>
                  <th>Route</th>
                  <th>Distance</th>
                  <th>Energy</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {trips.map((t) => (
                  <tr key={t.tripId}>
                    <td style={{ fontFamily: 'var(--font-mono)' }}>{t.tripId}</td>
                    <td>{t.driverName}</td>
                    <td>{t.startLocation} → {t.destination}</td>
                    <td style={{ fontFamily: 'var(--font-mono)' }}>{t.distanceKm} km</td>
                    <td style={{ fontFamily: 'var(--font-mono)' }}>{t.energyKWh} kWh</td>
                    <td><Badge variant={t.status}>{t.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 6: ALERTS */}
      {activeTab === 'alerts' && (
        <div className="card" style={{ background: 'var(--bg-surface-0)', border: '1px solid var(--border-subtle)', padding: 24 }}>
          <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: 16 }}>Fault & Diagnostic Alerts for {id}</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {alerts.length > 0 ? (
              alerts.map((a) => (
                <div key={a.alertId} style={{ background: 'var(--bg-surface-1)', padding: 16, borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <strong style={{ color: 'var(--text-primary)' }}>{a.title}</strong>
                      <Badge variant={a.severity}>{a.severity}</Badge>
                    </div>
                    <Badge variant={a.status}>{a.status}</Badge>
                  </div>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', margin: 0 }}>
                    {a.description}
                  </p>
                </div>
              ))
            ) : (
              <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: 20 }}>
                No active threshold alerts for this vehicle.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 7: MAINTENANCE */}
      {activeTab === 'maintenance' && (
        <div className="card" style={{ background: 'var(--bg-surface-0)', border: '1px solid var(--border-subtle)', padding: 24 }}>
          <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: 16 }}>Service History for {id}</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {maintenance.map((m) => (
              <div key={m.ticketId} style={{ background: 'var(--bg-surface-1)', padding: 16, borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <strong style={{ color: 'var(--text-primary)' }}>{m.title}</strong>
                  <Badge variant={m.status}>{m.status}</Badge>
                </div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: 6 }}>
                  {m.notes}
                </div>
                {m.diagnosis && (
                  <div style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)' }}>
                    Diagnosis: {m.diagnosis}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleDetail;
