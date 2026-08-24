import React, { useState } from 'react';

export const TimeSeriesChart = ({
  data = [],
  dataKey = 'value',
  timeKey = 'timestamp',
  title = 'Telemetry Waveform',
  color = 'var(--accent-cyan)',
  unit = 'V',
  height = 200,
  showGuides = true
}) => {
  const [hoveredPoint, setHoveredPoint] = useState(null);

  if (!data || data.length < 2) {
    return (
      <div style={{
        height,
        background: 'var(--bg-surface-0)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--text-muted)',
        fontSize: '0.8125rem'
      }}>
        Awaiting telemetry samples for waveform rendering...
      </div>
    );
  }

  const values = data.map(d => {
    if (typeof d[dataKey] === 'number') return d[dataKey];
    if (d.battery && typeof d.battery[dataKey] === 'number') return d.battery[dataKey];
    if (d.motor && typeof d.motor[dataKey] === 'number') return d.motor[dataKey];
    if (d.vehicle && typeof d.vehicle[dataKey] === 'number') return d.vehicle[dataKey];
    return 0;
  });

  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);
  const padding = (maxVal - minVal) * 0.15 || 1.0;
  const yMin = Math.floor((minVal - padding) * 10) / 10;
  const yMax = Math.ceil((maxVal + padding) * 10) / 10;

  const width = 600;
  const svgHeight = height;
  const graphPadding = { top: 20, right: 30, bottom: 25, left: 45 };
  const graphWidth = width - graphPadding.left - graphPadding.right;
  const graphActualHeight = svgHeight - graphPadding.top - graphPadding.bottom;

  // Generate coordinate points
  const points = data.map((d, idx) => {
    const val = values[idx];
    const x = graphPadding.left + (idx / (data.length - 1)) * graphWidth;
    const y = graphPadding.top + graphActualHeight - ((val - yMin) / (yMax - yMin)) * graphActualHeight;
    return { x, y, val, time: d[timeKey] || `${idx}s`, raw: d };
  });

  // Construct smooth SVG path using cubic Beziers
  const pathD = points.reduce((acc, pt, i, arr) => {
    if (i === 0) return `M ${pt.x},${pt.y}`;
    const prev = arr[i - 1];
    const cpX1 = prev.x + (pt.x - prev.x) / 2;
    const cpY1 = prev.y;
    const cpX2 = prev.x + (pt.x - prev.x) / 2;
    const cpY2 = pt.y;
    return `${acc} C ${cpX1},${cpY1} ${cpX2},${cpY2} ${pt.x},${pt.y}`;
  }, '');

  // Fill path closing to the bottom
  const fillD = `${pathD} L ${points[points.length - 1].x},${graphPadding.top + graphActualHeight} L ${points[0].x},${graphPadding.top + graphActualHeight} Z`;

  const gradientId = `chart-grad-${title.replace(/\s+/g, '-').toLowerCase()}`;

  return (
    <div style={{
      background: 'var(--bg-surface-0)',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--border-subtle)',
      padding: '16px',
      position: 'relative'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)' }}>{title}</div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875rem', fontWeight: 700, color }}>
          Latest: {values[values.length - 1]} {unit}
        </div>
      </div>

      <div style={{ position: 'relative', width: '100%' }}>
        <svg
          viewBox={`0 0 ${width} ${svgHeight}`}
          style={{ width: '100%', height: 'auto', display: 'block', overflow: 'visible' }}
        >
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={color} stopOpacity="0.25" />
              <stop offset="100%" stopColor={color} stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines & Y-axis labels */}
          {showGuides && [0, 0.5, 1].map((ratio) => {
            const y = graphPadding.top + graphActualHeight * (1 - ratio);
            const val = (yMin + (yMax - yMin) * ratio).toFixed(1);
            return (
              <g key={ratio}>
                <line
                  x1={graphPadding.left}
                  y1={y}
                  x2={width - graphPadding.right}
                  y2={y}
                  stroke="var(--border-subtle)"
                  strokeDasharray="3 3"
                />
                <text
                  x={graphPadding.left - 8}
                  y={y + 4}
                  fill="var(--text-muted)"
                  fontSize="9"
                  fontFamily="var(--font-mono)"
                  textAnchor="end"
                >
                  {val}
                </text>
              </g>
            );
          })}

          {/* Fill under curve */}
          <path d={fillD} fill={`url(#${gradientId})`} />

          {/* Stroke line */}
          <path
            d={pathD}
            fill="none"
            stroke={color}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data Points */}
          {points.map((pt, i) => (
            <circle
              key={i}
              cx={pt.x}
              cy={pt.y}
              r={hoveredPoint?.idx === i ? 5 : 3}
              fill={hoveredPoint?.idx === i ? '#fff' : color}
              stroke="var(--bg-surface-0)"
              strokeWidth="1.5"
              style={{ cursor: 'pointer', transition: 'r 0.2s ease' }}
              onMouseEnter={() => setHoveredPoint({ ...pt, idx: i })}
              onMouseLeave={() => setHoveredPoint(null)}
            />
          ))}

          {/* Hover Crosshair */}
          {hoveredPoint && (
            <line
              x1={hoveredPoint.x}
              y1={graphPadding.top}
              x2={hoveredPoint.x}
              y2={graphPadding.top + graphActualHeight}
              stroke="var(--text-muted)"
              strokeWidth="1"
              strokeDasharray="2 2"
            />
          )}
        </svg>

        {/* Floating Tooltip */}
        {hoveredPoint && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: `${(hoveredPoint.x / width) * 100}%`,
            transform: 'translate(-50%, -100%)',
            background: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-medium)',
            borderRadius: 'var(--radius-xs)',
            padding: '4px 8px',
            fontSize: '0.75rem',
            fontFamily: 'var(--font-mono)',
            color: '#fff',
            boxShadow: 'var(--shadow-elevated)',
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
            zIndex: 10
          }}>
            <strong style={{ color }}>{hoveredPoint.val} {unit}</strong>
            <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
              {typeof hoveredPoint.time === 'string' && hoveredPoint.time.includes('T')
                ? hoveredPoint.time.substring(11, 19) + ' UTC'
                : hoveredPoint.time}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TimeSeriesChart;
