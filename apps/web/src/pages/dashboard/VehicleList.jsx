import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Breadcrumb from '../../components/ui/Breadcrumb';

export const VehicleList = ({ token }) => {
  const [vehicles, setVehicles] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const headers = { 'Authorization': `Bearer ${token}` };
        const res = await fetch('http://127.0.0.1:8000/api/v1/vehicles', { headers });
        if (res.ok) {
          setVehicles(await res.json());
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchVehicles();
  }, [token]);

  const filtered = vehicles.filter(v => {
    const matchesFilter = filter === 'ALL' || v.status === filter;
    const matchesSearch = v.vehicleId.toLowerCase().includes(search.toLowerCase()) ||
                          v.make.toLowerCase().includes(search.toLowerCase()) ||
                          v.model.toLowerCase().includes(search.toLowerCase()) ||
                          v.vin.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', paddingBottom: 'var(--sp-12)' }}>
      <Breadcrumb items={[
        { label: 'Dashboard', to: '/dashboard' },
        { label: 'Vehicles' }
      ]} />

      {/* Header */}
      <div className="flex-between" style={{ flexWrap: 'wrap', gap: 'var(--sp-4)', marginBottom: 'var(--sp-8)' }}>
        <div>
          <span className="eyebrow" style={{ marginBottom: 'var(--sp-3)' }}>Connected Asset Registry</span>
          <h1 className="heading-lg" style={{ marginBottom: 'var(--sp-2)' }}>Vehicle Fleet</h1>
          <p className="body-md">Inspect commercial vehicle assets, high-voltage battery specifications, and live states.</p>
        </div>

        {/* Search */}
        <div style={{ position: 'relative', width: '100%', maxWidth: 320 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text"
            placeholder="Search by ID, Make, Model, VIN..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-input"
            style={{ paddingLeft: 42, background: 'var(--bg-surface-0)' }}
          />
        </div>
      </div>

      {/* Status Filter Pills */}
      <div style={{ display: 'flex', gap: 'var(--sp-2)', marginBottom: 'var(--sp-8)', flexWrap: 'wrap' }}>
        {['ALL', 'READY', 'RUNNING', 'IDLE', 'SERVICE', 'FAULT'].map((st) => (
          <button
            key={st}
            onClick={() => setFilter(st)}
            className={`btn btn-sm ${filter === st ? 'btn-primary' : 'btn-secondary'}`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Vehicle Grid */}
      <div className="g-3" style={{ gap: 'var(--sp-6)' }}>
        {filtered.map((v) => (
          <div key={v.vehicleId} className="card card-interactive" style={{ padding: 'var(--sp-6)' }}>
            <div className="flex-between" style={{ marginBottom: 'var(--sp-4)', alignItems: 'flex-start' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)', marginBottom: 'var(--sp-1)' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>{v.vehicleId}</h3>
                  <span className={`badge ${v.status === 'RUNNING' ? 'badge-green' : v.status === 'FAULT' ? 'badge-red' : 'badge-amber'}`}>{v.status}</span>
                </div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                  {v.make} {v.model}
                </div>
              </div>
            </div>

            <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: 'var(--sp-4)' }}>
              VIN: {v.vin}
            </div>

            <div style={{ background: 'var(--bg-surface-2)', padding: 'var(--sp-4)', borderRadius: 'var(--r-sm)', marginBottom: 'var(--sp-5)', display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div className="flex-between" style={{ fontSize: '0.8125rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Pack Nominal:</span>
                <strong style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                  {v.batteryPack?.nominalVoltage || 48} V
                </strong>
              </div>
              <div className="flex-between" style={{ fontSize: '0.8125rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Chem / Cap:</span>
                <strong style={{ color: 'var(--cyan)' }}>
                  {v.batteryPack?.chemistry || 'LFP'} ({v.batteryPack?.capacityKWh || 12.8} kWh)
                </strong>
              </div>
              <div className="flex-between" style={{ fontSize: '0.8125rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>State of Health:</span>
                <strong style={{ color: 'var(--violet)', fontFamily: 'var(--font-mono)' }}>
                  {v.batteryPack?.soh || 95}%
                </strong>
              </div>
            </div>

            <Link to={`/vehicles/${v.vehicleId}`} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              <span>Open Telemetry Workstation</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 6 }}><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VehicleList;
