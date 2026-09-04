"use client";

import * as React from "react";

import { motion } from "framer-motion";

interface TrendData {
  label: string;
  value: number;
}

interface TrendChartProps {
  data: TrendData[];
}

export const TrendChart = ({ data }: TrendChartProps) => {
  const width = 600;
  const height = 300;
  const padding = 40;

  const maxValue = Math.max(1, ...data.map((d) => Number.isFinite(d.value) ? d.value : 0));
  
  // Calculate points
  const points = data.map((d, i) => {
    const x = padding + (i * (width - 2 * padding) / Math.max(1, data.length - 1));
    const value = Number.isFinite(d.value) ? Math.max(0, d.value) : 0;
    const y = height - padding - (value / maxValue) * (height - 2 * padding);
    return { x, y, ...d };
  });

  // Create smooth path using bezier curves
  const createSmoothPath = (pts: typeof points) => {
    if (pts.length === 0) return "";
    let d = `M ${pts[0].x},${pts[0].y}`;
    for (let i = 1; i < pts.length; i++) {
      const p0 = pts[i - 1];
      const p1 = pts[i];
      const cx1 = p0.x + (p1.x - p0.x) / 2;
      const cy1 = p0.y;
      const cx2 = p0.x + (p1.x - p0.x) / 2;
      const cy2 = p1.y;
      d += ` C ${cx1},${cy1} ${cx2},${cy2} ${p1.x},${p1.y}`;
    }
    return d;
  };

  const pathD = createSmoothPath(points);
  
  // Create area path
  const areaD = `${pathD} L ${points[points.length - 1].x},${height - padding} L ${points[0].x},${height - padding} Z`;

  return (
    <section className="premium-shell flex h-full flex-col rounded-[1.5rem] bg-white/70 p-8 backdrop-blur-2xl">
      <h3 className="text-lg font-semibold text-[var(--fg)] mb-6">Learning Velocity</h3>
      
      <div className="relative w-full flex-1 min-h-[300px]">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
          {/* Grid lines */}
          {[0, 1, 2, 3, 4].map((line) => {
            const y = height - padding - (line / 4) * (height - 2 * padding);
            return (
              <line
                key={`grid-${line}`}
                x1={padding}
                y1={y}
                x2={width - padding}
                y2={y}
                stroke="var(--line)"
                strokeDasharray="4 4"
              />
            );
          })}

          {/* Defs for gradients */}
          <defs>
            <linearGradient id="area-gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--violet)" stopOpacity="0.6" />
              <stop offset="100%" stopColor="var(--violet)" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Area */}
          <motion.path
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            d={areaD}
            fill="url(#area-gradient)"
          />

          {/* Line */}
          <motion.path
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            d={pathD}
            fill="none"
            stroke="var(--violet)"
            strokeWidth="3"
            className="drop-shadow-[0_0_12px_rgba(111,69,255,0.8)]"
          />

          {/* Data Points */}
          {points.map((p, i) => (
            <motion.g
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1 + (i * 0.1) }}
            >
              <circle
                cx={p.x}
                cy={p.y}
                r="4"
                fill="var(--panel)"
                stroke="var(--violet)"
                strokeWidth="2"
              />
            </motion.g>
          ))}

          {/* X Axis Labels */}
          {points.map((p, i) => (
            <text
              key={`label-${i}`}
              x={p.x}
              y={height - padding + 20}
              textAnchor="middle"
              className="text-[10px] fill-[var(--muted-2)] font-mono"
            >
              {p.label}
            </text>
          ))}
        </svg>
      </div>
    </section>
  );
};
