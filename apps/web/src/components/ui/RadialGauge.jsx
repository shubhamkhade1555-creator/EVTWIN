import React from 'react';

export const RadialGauge = ({
  value = 0,
  min = 0,
  max = 100,
  unit = '%',
  label = 'State of Charge',
  size = 200,
  strokeWidth = 14,
  warningThreshold = 30,
  criticalThreshold = 15,
  colorScheme = 'soc', // 'soc', 'temp', 'speed'
  subLabel = null
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  // Use a 270 degree arc (3/4 circle)
  const arcLength = circumference * 0.75;
  
  const clampedValue = Math.min(max, Math.max(min, value));
  const percentage = (clampedValue - min) / (max - min);
  const strokeDashoffset = arcLength - percentage * arcLength;

  // Determine stroke color
  let strokeColor = 'var(--accent-cyan)';
  if (colorScheme === 'soc') {
    if (clampedValue <= criticalThreshold) {
      strokeColor = 'var(--status-offline)';
    } else if (clampedValue <= warningThreshold) {
      strokeColor = 'var(--status-stale)';
    } else {
      strokeColor = 'var(--status-live)';
    }
  } else if (colorScheme === 'temp') {
    if (clampedValue >= 50) {
      strokeColor = 'var(--status-offline)';
    } else if (clampedValue >= 45) {
      strokeColor = 'var(--status-stale)';
    } else {
      strokeColor = 'var(--status-live)';
    }
  }

  const rotation = 135; // Start arc at bottom-left

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <defs>
          <linearGradient id={`gauge-grad-${colorScheme}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--accent-cyan)" />
            <stop offset="100%" stopColor={strokeColor} />
          </linearGradient>
        </defs>

        {/* Background Track Arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--bg-surface-3)"
          strokeWidth={strokeWidth}
          strokeDasharray={`${arcLength} ${circumference}`}
          strokeLinecap="round"
          transform={`rotate(${rotation} ${size / 2} ${size / 2})`}
        />

        {/* Active Progress Arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#gauge-grad-${colorScheme})`}
          strokeWidth={strokeWidth}
          strokeDasharray={`${arcLength} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(${rotation} ${size / 2} ${size / 2})`}
          style={{ transition: 'stroke-dashoffset 0.6s var(--ease-out-expo), stroke 0.4s ease' }}
        />
      </svg>

      {/* Center Readout */}
      <div style={{
        position: 'absolute',
        top: '42%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center',
        pointerEvents: 'none'
      }}>
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: size > 160 ? '2.5rem' : '1.75rem',
          fontWeight: 800,
          color: strokeColor,
          lineHeight: 1
        }}>
          {typeof value === 'number' ? value.toFixed(1) : value}
          <span style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginLeft: 2 }}>{unit}</span>
        </div>
        <div style={{
          fontSize: '0.6875rem',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          color: 'var(--text-muted)',
          marginTop: 4
        }}>
          {label}
        </div>
      </div>

      {subLabel && (
        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: -10 }}>
          {subLabel}
        </div>
      )}
    </div>
  );
};

export default RadialGauge;
