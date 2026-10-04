import React, { useState } from 'react';

/**
 * Pure SVG Sparkline micro-chart with smooth gradient fill and interactive tooltip.
 * Zero external dependencies for maximum performance and SSR reliability.
 */
export default function Sparkline({
  data = [10, 15, 12, 18, 20, 24, 28],
  color = 'emerald',
  height = 36,
  strokeWidth = 2,
  showArea = true,
  className = '',
}) {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  if (!data || data.length < 2) {
    return null;
  }

  const width = 120;
  const paddingY = 4;
  const paddingX = 4;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  // Compute (x, y) coordinates for each point
  const points = data.map((val, index) => {
    const x = paddingX + (index / (data.length - 1)) * (width - paddingX * 2);
    const y = height - paddingY - ((val - min) / range) * (height - paddingY * 2);
    return { x, y, val };
  });

  // SVG path definitions
  const pathD = points.reduce((acc, pt, idx) => {
    return idx === 0 ? `M ${pt.x},${pt.y}` : `${acc} L ${pt.x},${pt.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x},${height} L ${points[0].x},${height} Z`;

  // Color schemes
  const colorMap = {
    emerald: {
      stroke: '#10b981',
      fillStart: 'rgba(16, 185, 129, 0.35)',
      fillEnd: 'rgba(16, 185, 129, 0.02)',
      dot: '#059669',
    },
    cyan: {
      stroke: '#06b6d4',
      fillStart: 'rgba(6, 182, 212, 0.35)',
      fillEnd: 'rgba(6, 182, 212, 0.02)',
      dot: '#0891b2',
    },
    amber: {
      stroke: '#f59e0b',
      fillStart: 'rgba(245, 158, 11, 0.35)',
      fillEnd: 'rgba(245, 158, 11, 0.02)',
      dot: '#d97706',
    },
    indigo: {
      stroke: '#6366f1',
      fillStart: 'rgba(99, 102, 241, 0.35)',
      fillEnd: 'rgba(99, 102, 241, 0.02)',
      dot: '#4f46e5',
    },
    rose: {
      stroke: '#f43f5e',
      fillStart: 'rgba(244, 63, 94, 0.35)',
      fillEnd: 'rgba(244, 63, 94, 0.02)',
      dot: '#e11d48',
    },
  };

  const scheme = colorMap[color] || colorMap.emerald;
  const gradientId = `sparkline-grad-${color}-${Math.random().toString(36).substring(2, 7)}`;
  const lastPoint = points[points.length - 1];

  return (
    <div className={`relative inline-block ${className}`}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full overflow-visible"
        style={{ height: `${height}px` }}
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={scheme.fillStart} />
            <stop offset="100%" stopColor={scheme.fillEnd} />
          </linearGradient>
        </defs>

        {/* Shaded Area */}
        {showArea && (
          <path
            d={areaD}
            fill={`url(#${gradientId})`}
            className="transition-opacity duration-300"
          />
        )}

        {/* Primary Trend Line */}
        <path
          d={pathD}
          fill="none"
          stroke={scheme.stroke}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Terminal latest indicator dot */}
        <circle
          cx={lastPoint.x}
          cy={lastPoint.y}
          r="2.5"
          fill={scheme.stroke}
          className="animate-pulse"
        />
        <circle
          cx={lastPoint.x}
          cy={lastPoint.y}
          r="4.5"
          fill="none"
          stroke={scheme.stroke}
          strokeWidth="1"
          opacity="0.5"
        />

        {/* Hover interaction points */}
        {points.map((pt, i) => (
          <circle
            key={i}
            cx={pt.x}
            cy={pt.y}
            r="8"
            fill="transparent"
            className="cursor-pointer"
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
          />
        ))}

        {/* Highlight hovered point */}
        {hoveredIndex !== null && points[hoveredIndex] && (
          <circle
            cx={points[hoveredIndex].x}
            cy={points[hoveredIndex].y}
            r="3.5"
            fill="#ffffff"
            stroke={scheme.stroke}
            strokeWidth="2"
          />
        )}
      </svg>

      {/* Floating Tooltip */}
      {hoveredIndex !== null && points[hoveredIndex] && (
        <div
          className="absolute -top-7 -translate-x-1/2 z-20 pointer-events-none px-1.5 py-0.5 rounded bg-slate-900 text-white font-mono text-[10px] font-bold shadow-md whitespace-nowrap"
          style={{
            left: `${(points[hoveredIndex].x / width) * 100}%`,
          }}
        >
          {points[hoveredIndex].val}
        </div>
      )}
    </div>
  );
}
