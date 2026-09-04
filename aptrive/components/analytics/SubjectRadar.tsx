"use client";

import * as React from "react";

import { motion } from "framer-motion";

interface SubjectData {
  subject: string;
  score: number;
}

interface SubjectRadarProps {
  data: SubjectData[];
}

export const SubjectRadar = ({ data }: SubjectRadarProps) => {
  const size = 300;
  const center = size / 2;
  const radius = (size / 2) - 40;
  
  const angleSlice = (Math.PI * 2) / data.length;

  const getPoints = (scale: number = 1) => {
    return data.map((d, i) => {
      const r = radius * (d.score / 100) * scale;
      const x = center + r * Math.cos(angleSlice * i - Math.PI / 2);
      const y = center + r * Math.sin(angleSlice * i - Math.PI / 2);
      return `${x},${y}`;
    }).join(" ");
  };

  const levels = [0.2, 0.4, 0.6, 0.8, 1];

  return (
    <section className="premium-shell flex h-full flex-col items-center justify-center rounded-[1.5rem] bg-white/70 p-8 backdrop-blur-2xl">
      <h3 className="text-lg font-semibold text-[var(--fg)] w-full text-left mb-8">Subject Mastery</h3>
      
      <div className="relative w-[300px] h-[300px]">
        <svg width={size} height={size} className="overflow-visible">
          {/* Background Web */}
          {levels.map((level, index) => {
            const points = data.map((_, i) => {
              const r = radius * level;
              const x = center + r * Math.cos(angleSlice * i - Math.PI / 2);
              const y = center + r * Math.sin(angleSlice * i - Math.PI / 2);
              return `${x},${y}`;
            }).join(" ");
            
            return (
              <polygon
                key={index}
                points={points}
                fill="none"
                stroke="var(--line-strong)"
                strokeWidth="1"
                className="opacity-50"
              />
            );
          })}

          {/* Axes */}
          {data.map((_, i) => {
            const x = center + radius * Math.cos(angleSlice * i - Math.PI / 2);
            const y = center + radius * Math.sin(angleSlice * i - Math.PI / 2);
            return (
              <line
                key={i}
                x1={center}
                y1={center}
                x2={x}
                y2={y}
                stroke="var(--line-strong)"
                strokeWidth="1"
                className="opacity-50"
              />
            );
          })}

          {/* Data Polygon */}
          <motion.polygon
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            points={getPoints()}
            fill="var(--teal)"
            fillOpacity="0.2"
            stroke="var(--teal)"
            strokeWidth="2"
            className="drop-shadow-[0_0_16px_rgba(35,213,196,0.6)]"
            style={{ transformOrigin: "center" }}
          />
          
          {/* Data Points */}
          {data.map((d, i) => {
            const r = radius * (d.score / 100);
            const x = center + r * Math.cos(angleSlice * i - Math.PI / 2);
            const y = center + r * Math.sin(angleSlice * i - Math.PI / 2);
            return (
              <circle
                key={`point-${i}`}
                cx={x}
                cy={y}
                r="4"
                fill="var(--teal)"
                className="drop-shadow-[0_0_8px_rgba(35,213,196,0.8)]"
              />
            );
          })}
        </svg>

        {/* Labels */}
        {data.map((d, i) => {
          const r = radius + 25;
          const x = center + r * Math.cos(angleSlice * i - Math.PI / 2);
          const y = center + r * Math.sin(angleSlice * i - Math.PI / 2);
          
          return (
            <div
              key={`label-${i}`}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 text-xs font-medium text-[var(--muted)]"
              style={{ left: x, top: y }}
            >
              {d.subject}
            </div>
          );
        })}
      </div>
    </section>
  );
};
