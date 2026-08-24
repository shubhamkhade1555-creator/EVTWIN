import React from 'react';
import Badge from './Badge';

export default function MetricCard({
  label,
  value,
  unit = '',
  status = null,
  trend = null,
  description = null,
  icon: Icon = null,
  color = 'var(--text-primary)',
  progress = null
}) {
  return (
    <div className="card card-interactive" style={{ padding: 'var(--sp-5)' }}>
      <div className="flex-between" style={{ marginBottom: 'var(--sp-2)' }}>
        <div style={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)' }}>
          {label}
        </div>
        {Icon && (
          <span style={{ color, display: 'flex' }}>
            {React.isValidElement(Icon) ? Icon : React.createElement(Icon, { size: 16 })}
          </span>
        )}
      </div>

      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '2rem', fontWeight: 800, color: color, lineHeight: 1, display: 'flex', alignItems: 'baseline' }}>
        {value}
        {unit && <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginLeft: 6 }}>{unit}</span>}
      </div>

      {progress !== null && (
        <div className="prog-bar" style={{ marginTop: 'var(--sp-4)', marginBottom: (description || status || trend) ? 'var(--sp-2)' : 0 }}>
          <div className="prog-fill" style={{ width: `${Math.min(100, Math.max(0, progress))}%`, background: color }} />
        </div>
      )}

      {(description || status || trend) && (
        <div className="flex-between" style={{ marginTop: progress === null ? 'var(--sp-4)' : 0, fontSize: '0.75rem', alignItems: 'center' }}>
          {description && <span style={{ color: 'var(--text-secondary)' }}>{description}</span>}
          {status && <Badge variant={status}>{status}</Badge>}
          {trend && <span style={{ color: trend.startsWith('+') ? 'var(--green)' : 'var(--text-muted)' }}>{trend}</span>}
        </div>
      )}
    </div>
  );
}
