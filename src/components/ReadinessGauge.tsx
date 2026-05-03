"use client";

import { useEffect, useState } from "react";

interface Props {
  score: number;          // 0..100
  threshold?: number;     // pass mark; default 65
  size?: number;          // px diameter
  label?: string;         // e.g., "Readiness"
  animate?: boolean;
}

/**
 * Animated radial gauge. Pure SVG, no chart deps.
 * Color shifts orange (low) -> amber (mid) -> green (high).
 */
export function ReadinessGauge({
  score,
  threshold = 65,
  size = 220,
  label = "Readiness",
  animate = true,
}: Props) {
  const [shown, setShown] = useState(animate ? 0 : score);

  useEffect(() => {
    if (!animate) {
      setShown(score);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const duration = 1100;
    const tick = (t: number) => {
      const k = Math.min(1, (t - start) / duration);
      // ease-out-cubic
      const eased = 1 - Math.pow(1 - k, 3);
      setShown(Math.round(score * eased));
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [score, animate]);

  const r = (size - 20) / 2;
  const c = 2 * Math.PI * r;
  const cx = size / 2;
  const cy = size / 2;
  // 270deg arc (3/4 of circle)
  const arcFraction = 0.75;
  const dashTotal = c * arcFraction;
  const dashFilled = (shown / 100) * dashTotal;

  // Color band
  const color =
    shown >= 85
      ? "#16a34a" // green-600
      : shown >= threshold
      ? "#22c55e" // green-500
      : shown >= 35
      ? "#F5A623" // hive-orange
      : "#E89611"; // hive-amber (warmer red-ish at low)

  const passed = shown >= threshold;

  return (
    <div className="flex flex-col items-center" style={{ width: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <defs>
          <linearGradient id="rg-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.85" />
            <stop offset="100%" stopColor={color} stopOpacity="1" />
          </linearGradient>
        </defs>
        <g transform={`rotate(135 ${cx} ${cy})`}>
          {/* Track */}
          <circle
            cx={cx}
            cy={cy}
            r={r}
            stroke="#FFE9C9"
            strokeWidth={14}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={`${dashTotal} ${c}`}
          />
          {/* Filled */}
          <circle
            cx={cx}
            cy={cy}
            r={r}
            stroke="url(#rg-grad)"
            strokeWidth={14}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={`${dashFilled} ${c}`}
            style={{ transition: "stroke 300ms ease" }}
          />
        </g>
        {/* Center number */}
        <text
          x={cx}
          y={cy + 6}
          textAnchor="middle"
          fontSize={size * 0.28}
          fontWeight={800}
          fill="#3D3D3D"
          fontFamily="Inter, system-ui, sans-serif"
        >
          {shown}
        </text>
        <text
          x={cx}
          y={cy + size * 0.18}
          textAnchor="middle"
          fontSize={size * 0.07}
          fill="#6B6B6B"
          fontFamily="Inter, system-ui, sans-serif"
          letterSpacing="2"
        >
          / 100
        </text>
      </svg>

      <div className="mt-2 flex items-center gap-2 text-xs">
        <span className="text-hive-grey font-medium uppercase tracking-wide">{label}</span>
        <span
          className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
            passed
              ? "bg-green-100 text-green-700"
              : "bg-hive-cream text-hive-amber"
          }`}
        >
          {passed ? "Ready" : "Needs work"}
        </span>
      </div>
    </div>
  );
}
