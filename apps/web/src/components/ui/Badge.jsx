import React from 'react';

export default function Badge({ children, variant = 'neutral', source, quality, pulse = false, className = '' }) {
  let badgeClass = 'badge-neutral';
  
  const v = variant?.toUpperCase() || '';

  if (['LIVE', 'ONLINE', 'READY', 'VALID', 'SUCCESS', 'RUNNING'].includes(v)) {
    badgeClass = 'badge-green';
  } else if (['STALE', 'IDLE', 'WARNING', 'AMBER', 'SIMULATED', 'SIMULATION'].includes(v)) {
    badgeClass = 'badge-amber';
  } else if (['OFFLINE', 'FAULT', 'INVALID', 'CRITICAL', 'ERROR', 'DANGER'].includes(v)) {
    badgeClass = 'badge-red';
  } else if (['TWIN', 'PREDICTED', 'ESTIMATED'].includes(v)) {
    badgeClass = 'badge-violet';
  } else if (['SOURCE', 'DEVICE', 'CYAN', 'PROTOTYPE'].includes(v)) {
    badgeClass = 'badge-cyan';
  } else if (['INFO', 'BLUE', 'IMPLEMENTED'].includes(v)) {
    badgeClass = 'badge-blue';
  }

  return (
    <span className={`badge ${badgeClass} ${className}`}>
      {pulse && <span className="beacon" />}
      {children}
      {source && <span style={{ opacity: 0.7, marginLeft: 4 }}>({source})</span>}
      {quality && <span style={{ opacity: 0.7, marginLeft: 4 }}>[{quality}]</span>}
    </span>
  );
}
