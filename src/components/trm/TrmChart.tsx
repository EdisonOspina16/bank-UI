'use client';

import type { TrmHistoryPoint } from '../../hooks/useTrmHistory';

const copFmtFull = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  minimumFractionDigits: 2,
});

interface TrmChartProps {
  data: TrmHistoryPoint[];
}

export default function TrmChart({ data }: TrmChartProps) {
  if (data.length === 0) {
    return (
      <div className="h-44 flex items-center justify-center text-xs text-zinc-400 font-medium">
        Sin datos históricos disponibles
      </div>
    );
  }

  const width = 320;
  const height = 160;
  const padding = { top: 16, right: 12, bottom: 28, left: 12 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const rates = data.map((d) => d.rate);
  const minRate = Math.min(...rates);
  const maxRate = Math.max(...rates);
  const range = maxRate - minRate || 1;

  const points = data.map((point, index) => {
    const x = padding.left + (index / Math.max(data.length - 1, 1)) * chartW;
    const y = padding.top + chartH - ((point.rate - minRate) / range) * chartH;
    return { x, y, ...point };
  });

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
  const areaPath = `${linePath} L ${points[points.length - 1].x.toFixed(1)} ${(padding.top + chartH).toFixed(1)} L ${points[0].x.toFixed(1)} ${(padding.top + chartH).toFixed(1)} Z`;

  const firstDate = new Date(data[0].date).toLocaleDateString('es-CO', { day: '2-digit', month: 'short' });
  const lastDate = new Date(data[data.length - 1].date).toLocaleDateString('es-CO', { day: '2-digit', month: 'short' });

  return (
    <div className="space-y-3">
      <div className="flex justify-between text-[10px] text-zinc-400 font-semibold uppercase tracking-wide">
        <span>Últimos {data.length} días</span>
        <span>
          {copFmtFull.format(minRate)} – {copFmtFull.format(maxRate)}
        </span>
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto" role="img" aria-label="Gráfica histórica de la TRM">
        <defs>
          <linearGradient id="trmArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#000" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#000" stopOpacity="0.01" />
          </linearGradient>
        </defs>
        {[0, 0.5, 1].map((ratio) => {
          const y = padding.top + chartH * ratio;
          return (
            <line
              key={ratio}
              x1={padding.left}
              y1={y}
              x2={width - padding.right}
              y2={y}
              stroke="#e4e4e7"
              strokeWidth="1"
            />
          );
        })}
        <path d={areaPath} fill="url(#trmArea)" />
        <path d={linePath} fill="none" stroke="#000" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        {points.map((point, index) => (
          <circle
            key={`${point.date}-${index}`}
            cx={point.x}
            cy={point.y}
            r={index === points.length - 1 ? 4 : 2.5}
            fill={index === points.length - 1 ? '#000' : '#fff'}
            stroke="#000"
            strokeWidth="1.5"
          />
        ))}
        <text x={padding.left} y={height - 6} className="fill-zinc-400" fontSize="9" fontWeight="600">
          {firstDate}
        </text>
        <text x={width - padding.right} y={height - 6} textAnchor="end" className="fill-zinc-400" fontSize="9" fontWeight="600">
          {lastDate}
        </text>
      </svg>
    </div>
  );
}
