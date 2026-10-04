import React from 'react';

export default function RadarChart({ data, size = 260, title }) {
  // data: { oxygen: 90, moisture: 80, light: 100, cost: 70, sustainability: 85 }
  const axes = [
    { key: 'oxygen', label: 'Oxygen Barrier', value: data?.oxygen ?? data?.oxygenBarrier ?? 50 },
    { key: 'moisture', label: 'Moisture Barrier', value: data?.moisture ?? data?.moistureBarrier ?? 50 },
    { key: 'light', label: 'Light Block', value: data?.light ?? data?.lightBarrier ?? 50 },
    { key: 'cost', label: 'Cost Efficiency', value: data?.cost ?? data?.costEfficiency ?? 50 },
    { key: 'sustainability', label: 'Sustainability', value: data?.sustainability ?? 50 },
  ];

  const totalAxes = axes.length;
  const radius = size * 0.38;
  const center = size / 2;
  const angleStep = (Math.PI * 2) / totalAxes;

  // Generate polygon points for value
  const points = axes.map((axis, i) => {
    const angle = i * angleStep - Math.PI / 2;
    const r = (Math.max(10, Math.min(100, axis.value)) / 100) * radius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return `${x},${y}`;
  }).join(' ');

  // Grid levels (25%, 50%, 75%, 100%)
  const gridLevels = [0.25, 0.5, 0.75, 1.0];

  return (
    <div className="flex flex-col items-center justify-center p-2">
      {title && <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider">{title}</p>}
      <svg width={size} height={size} className="overflow-visible">
        {/* Background Grid Rings */}
        {gridLevels.map((lvl) => {
          const gridPoints = axes.map((_, i) => {
            const angle = i * angleStep - Math.PI / 2;
            const r = lvl * radius;
            return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`;
          }).join(' ');

          return (
            <polygon
              key={lvl}
              points={gridPoints}
              fill="none"
              stroke="currentColor"
              className="text-slate-200 dark:text-slate-800"
              strokeWidth="1"
            />
          );
        })}

        {/* Axis Spokes */}
        {axes.map((axis, i) => {
          const angle = i * angleStep - Math.PI / 2;
          const x2 = center + radius * Math.cos(angle);
          const y2 = center + radius * Math.sin(angle);

          // Label positions (slightly outside radius)
          const labelR = radius + 22;
          const labelX = center + labelR * Math.cos(angle);
          const labelY = center + labelR * Math.sin(angle);

          return (
            <g key={axis.key}>
              <line
                x1={center}
                y1={center}
                x2={x2}
                y2={y2}
                stroke="currentColor"
                className="text-slate-300 dark:text-slate-700/60"
                strokeDasharray="2 2"
              />
              <text
                x={labelX}
                y={labelY}
                textAnchor="middle"
                dominantBaseline="central"
                className="text-[10px] fill-slate-600 dark:fill-slate-400 font-medium"
              >
                {axis.label} ({axis.value}%)
              </text>
            </g>
          );
        })}

        {/* Filled Data Polygon */}
        <polygon
          points={points}
          fill="rgba(16, 185, 129, 0.25)"
          stroke="#10b981"
          strokeWidth="2"
          className="transition-all duration-300"
        />

        {/* Vertex Points */}
        {axes.map((axis, i) => {
          const angle = i * angleStep - Math.PI / 2;
          const r = (Math.max(10, Math.min(100, axis.value)) / 100) * radius;
          const cx = center + r * Math.cos(angle);
          const cy = center + r * Math.sin(angle);

          return (
            <circle
              key={axis.key}
              cx={cx}
              cy={cy}
              r="4"
              className="fill-emerald-500 dark:fill-emerald-400 stroke-white dark:stroke-slate-900 stroke-2 shadow-lg"
            />
          );
        })}
      </svg>
    </div>
  );
}

