"use client";

// Hand-crafted SVG radar chart for the founder's IRL 1–9 readiness profile.
// 9 axes evenly spaced, animated polygon bloom on mount, click any axis to
// jump into that section's result page. Hive palette throughout.
//
// Designed responsive: pass `size` for the canonical px size; the SVG uses
// viewBox scaling so it adapts to any container width.

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";

export interface RadarPoint {
  axis: string;          // "irl-1" .. "irl-9"
  index: number;         // 1..9
  label: string;         // "IRL 1"
  shortLabel: string;    // "Idea & BMC"
  score: number | null;  // 0..100, null if not yet assessed
  diagnosis?: string | null;
  hasAnswers?: boolean;
  hasRubric?: boolean;
}

interface Props {
  points: RadarPoint[];
  size?: number;       // canonical px size; SVG scales via viewBox
  threshold?: number;  // 0..100, drawn as a dashed inner band
  onAxisClick?: (axisId: string) => void;
}

const HIVE_ORANGE = "#F5A623";
const HIVE_AMBER = "#E89611";
const HIVE_DARK = "#3D3D3D";
const HIVE_GREY = "#6B6B6B";
const HIVE_CREAM = "#FFE9C9";

export function ReadinessRadar({
  points,
  size = 520,
  threshold = 65,
  onAxisClick,
}: Props) {
  const router = useRouter();
  const { t } = useI18n();
  const cx = size / 2;
  const cy = size / 2;
  // Reserve ~70px around the perimeter for axis labels.
  const maxRadius = size / 2 - 78;
  const total = points.length;

  // ---------- Animated reveal --------------------------------------------------
  const [progress, setProgress] = useState(0); // 0..1, drives polygon bloom
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Fresh animation each effect run. We don't gate with a ref, because in
    // React 18 StrictMode the first effect's cleanup would cancel the RAF and
    // the gated second effect would never restart it — leaving progress stuck
    // near zero and the composite score stuck at 0.
    let raf = 0;
    let cancelled = false;
    const start = performance.now();
    const duration = 1400;
    const tick = (t: number) => {
      if (cancelled) return;
      const k = Math.min(1, (t - start) / duration);
      // smooth ease-out cubic
      const eased = 1 - Math.pow(1 - k, 3);
      setProgress(eased);
      if (k < 1) raf = requestAnimationFrame(tick);
      else setMounted(true);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
    };
  }, []);

  // ---------- Geometry --------------------------------------------------------
  // Start at -90° (12 o'clock), go clockwise.
  const angleFor = (i: number) =>
    ((-90 + (360 / total) * i) * Math.PI) / 180;
  const pointAt = (i: number, r: number): [number, number] => {
    const a = angleFor(i);
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  };

  const rings = useMemo(() => [0.2, 0.4, 0.6, 0.8, 1.0], []);

  // Polygon connects ONLY assessed points (in axis order)
  const assessedIndices = useMemo(
    () => points.map((p, i) => (p.score !== null ? i : -1)).filter(i => i >= 0),
    [points]
  );

  const polyPoints = useMemo(() => {
    return assessedIndices
      .map(i => {
        const score = points[i].score ?? 0;
        const r = (score / 100) * maxRadius * progress;
        return pointAt(i, r).join(",");
      })
      .join(" ");
  }, [assessedIndices, points, maxRadius, progress, cx, cy]);

  const thresholdR = (threshold / 100) * maxRadius;

  // Composite score (animated count-up)
  const compositeTarget = useMemo(() => {
    const assessed = points.filter(p => p.score !== null);
    if (assessed.length === 0) return 0;
    return Math.round(
      assessed.reduce((sum, p) => sum + (p.score ?? 0), 0) / assessed.length
    );
  }, [points]);
  const animatedComposite = Math.round(compositeTarget * progress);

  function handleClick(p: RadarPoint) {
    if (onAxisClick) {
      onAxisClick(p.axis);
      return;
    }
    const num = p.axis.replace("irl-", "");
    if (p.score !== null) {
      router.push(`/onboarding/irl/${num}/result`);
    } else {
      router.push(`/onboarding/irl/${num}`);
    }
  }

  // Where does each label sit relative to the canvas? We push it slightly
  // outward and align text horizontally based on which side of the chart.
  // Left-side labels (anchor="end") get a small inward push so long words
  // like "Operations" don't clip past the SVG's left edge.
  function labelPos(i: number) {
    const [bx, by] = pointAt(i, maxRadius + 28);
    const angle = ((-90 + (360 / total) * i) % 360 + 360) % 360;
    let anchor: "start" | "middle" | "end" = "middle";
    let dx = 0;
    if (angle > 5 && angle < 175) {
      anchor = "start";
    } else if (angle > 185 && angle < 355) {
      anchor = "end";
      dx = 16; // shift inward so the leftmost letter doesn't get clipped
    }
    return { x: bx + dx, y: by, anchor };
  }

  return (
    <div
      className="relative inline-block w-full max-w-[560px]"
      style={{ aspectRatio: "1 / 1" }}
    >
      {/* Atmospheric shimmer behind the chart — slow rotating gradient */}
      <div
        aria-hidden
        className="absolute inset-6 rounded-full opacity-60 pointer-events-none"
        style={{
          background:
            "conic-gradient(from 0deg, rgba(245,166,35,0.10), rgba(245,166,35,0.0) 25%, rgba(245,166,35,0.08) 50%, rgba(245,166,35,0.0) 75%, rgba(245,166,35,0.10) 100%)",
          animation: "radarShimmer 22s linear infinite",
          filter: "blur(20px)",
        }}
      />

      {/* Center pulsing ripple (one-shot once mounted) */}
      {mounted && (
        <div
          aria-hidden
          className="absolute pointer-events-none"
          style={{
            left: "50%",
            top: "50%",
            width: maxRadius * 2,
            height: maxRadius * 2,
            transform: "translate(-50%, -50%)",
          }}
        >
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(245,166,35,0.18) 0%, transparent 60%)",
              animation: "radarRipple 2s ease-out",
            }}
          />
        </div>
      )}

      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${size} ${size}`}
        className="relative z-10 select-none"
      >
        <defs>
          <radialGradient id="radarFill" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={HIVE_ORANGE} stopOpacity="0.55" />
            <stop offset="70%" stopColor={HIVE_AMBER} stopOpacity="0.35" />
            <stop offset="100%" stopColor={HIVE_AMBER} stopOpacity="0.18" />
          </radialGradient>
          <linearGradient id="radarStroke" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={HIVE_ORANGE} />
            <stop offset="100%" stopColor={HIVE_AMBER} />
          </linearGradient>
          <filter id="radarGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* ---------- Concentric rings ---------- */}
        {rings.map((r, idx) => {
          const ringPoints = points
            .map((_, i) => pointAt(i, r * maxRadius).join(","))
            .join(" ");
          return (
            <polygon
              key={idx}
              points={ringPoints}
              fill="none"
              stroke={HIVE_CREAM}
              strokeWidth={r === 1 ? 1.5 : 1}
              strokeOpacity={0.7}
            />
          );
        })}

        {/* ---------- Threshold band (subtle dashed ring at e.g. 65) ---------- */}
        <polygon
          points={points.map((_, i) => pointAt(i, thresholdR).join(",")).join(" ")}
          fill="none"
          stroke="#22c55e"
          strokeWidth={1.5}
          strokeDasharray="3 5"
          strokeOpacity={0.55}
        />
        <text
          x={cx + thresholdR + 6}
          y={cy + 4}
          fontSize={10}
          fill="#16a34a"
          fontFamily="Inter, system-ui"
          fontWeight={700}
          opacity={0.75}
        >
          {threshold}
        </text>

        {/* ---------- Axis lines ---------- */}
        {points.map((p, i) => {
          const [x, y] = pointAt(i, maxRadius);
          const dashed = p.score === null;
          return (
            <line
              key={`axis-${p.axis}`}
              x1={cx}
              y1={cy}
              x2={x}
              y2={y}
              stroke={dashed ? "#D9D9D9" : HIVE_CREAM}
              strokeWidth={1}
              strokeDasharray={dashed ? "4 4" : undefined}
              opacity={0.7}
            />
          );
        })}

        {/* ---------- The polygon (only assessed) ---------- */}
        {assessedIndices.length >= 3 && (
          <polygon
            points={polyPoints}
            fill="url(#radarFill)"
            stroke="url(#radarStroke)"
            strokeWidth={2.5}
            strokeLinejoin="round"
            filter="url(#radarGlow)"
          />
        )}
        {/* Polygon for 1–2 assessed sections becomes a line/point — handled by vertices */}

        {/* ---------- Vertices (interactive) ---------- */}
        {points.map((p, i) => {
          if (p.score === null) {
            // Ghost vertex at the perimeter — not yet assessed
            const [x, y] = pointAt(i, maxRadius * 0.96);
            return (
              <g
                key={`v-${p.axis}`}
                onClick={() => handleClick(p)}
                style={{ cursor: "pointer" }}
              >
                <circle
                  cx={x}
                  cy={y}
                  r={6}
                  fill="#FFFFFF"
                  stroke="#D9D9D9"
                  strokeWidth={1.5}
                  strokeDasharray="2 2"
                />
              </g>
            );
          }
          const r = (p.score / 100) * maxRadius * progress;
          const [x, y] = pointAt(i, r);
          const passed = p.score >= threshold;
          const ringColor = passed ? "#16a34a" : HIVE_ORANGE;
          const haloColor = passed ? "#22c55e" : HIVE_ORANGE;
          return (
            <g
              key={`v-${p.axis}`}
              onClick={() => handleClick(p)}
              style={{
                cursor: "pointer",
                transformOrigin: `${x}px ${y}px`,
                animation: `radarPop 600ms ease-out ${300 + i * 70}ms both`,
              }}
              className="hover:[&_circle:nth-child(2)]:stroke-[3.5]"
            >
              {/* halo */}
              <circle cx={x} cy={y} r={11} fill={haloColor} fillOpacity={0.15} />
              {/* dot */}
              <circle
                cx={x}
                cy={y}
                r={6}
                fill="#FFFFFF"
                stroke={ringColor}
                strokeWidth={2.5}
                style={{ transition: "stroke-width 200ms ease" }}
              />
            </g>
          );
        })}

        {/* ---------- Center composite score ---------- */}
        <g style={{ animation: "fadeUp 600ms ease-out 200ms both" }}>
          <circle
            cx={cx}
            cy={cy}
            r={42}
            fill="#FFFFFF"
            opacity={0.9}
          />
          <text
            x={cx}
            y={cy + 6}
            textAnchor="middle"
            fontSize={42}
            fontWeight={800}
            fill={HIVE_DARK}
            fontFamily="Inter, system-ui"
            letterSpacing={-1}
          >
            {animatedComposite}
          </text>
          <text
            x={cx}
            y={cy + 28}
            textAnchor="middle"
            fontSize={9}
            fontWeight={700}
            fill={HIVE_GREY}
            fontFamily="Inter, system-ui"
            letterSpacing={2}
          >
            {t("review.radar.overall")}
          </text>
        </g>

        {/* ---------- Axis labels ---------- */}
        {points.map((p, i) => {
          const { x, y, anchor } = labelPos(i);
          const dim = p.score === null ? 0.55 : 1;
          const passed = p.score !== null && p.score >= threshold;
          return (
            <g
              key={`lbl-${p.axis}`}
              onClick={() => handleClick(p)}
              style={{
                cursor: "pointer",
                opacity: dim,
                animation: `fadeUp 500ms ease-out ${500 + i * 60}ms both`,
              }}
              className="hover:opacity-100"
            >
              {/* Section number — smaller, hive-orange */}
              <text
                x={x}
                y={y - 6}
                textAnchor={anchor}
                fontSize={10}
                fontWeight={800}
                fill={HIVE_ORANGE}
                fontFamily="Inter, system-ui"
                letterSpacing={1.2}
              >
                {p.label.toUpperCase()}
              </text>
              {/* Short topic — small, charcoal */}
              <text
                x={x}
                y={y + 6}
                textAnchor={anchor}
                fontSize={11}
                fontWeight={700}
                fill={HIVE_DARK}
                fontFamily="Inter, system-ui"
              >
                {p.shortLabel}
              </text>
              {/* Score badge — only when assessed. Rendered as a pill so it
                  reads as "score chip" rather than a bare number floating
                  next to the label. */}
              {p.score !== null && (() => {
                const valueText = `${p.score} / 100`;
                // Approximate width based on text length (works fine for 1-3 digit scores)
                const pillW =
                  valueText.length * 5.4 + 14;
                const pillH = 16;
                const pillX =
                  anchor === "start"
                    ? x - 2
                    : anchor === "end"
                    ? x - pillW + 2
                    : x - pillW / 2;
                const pillY = y + 12;
                const fillColor = passed ? "#DCFCE7" : "#FFF1D6";
                const strokeColor = passed ? "#86EFAC" : "#F5A623";
                const textColor = passed ? "#15803D" : "#B45309";
                return (
                  <g>
                    <rect
                      x={pillX}
                      y={pillY}
                      width={pillW}
                      height={pillH}
                      rx={pillH / 2}
                      ry={pillH / 2}
                      fill={fillColor}
                      stroke={strokeColor}
                      strokeWidth={1}
                    />
                    <text
                      x={pillX + pillW / 2}
                      y={pillY + 11}
                      textAnchor="middle"
                      fontSize={10}
                      fontWeight={800}
                      fill={textColor}
                      fontFamily="Inter, system-ui"
                    >
                      {valueText}
                    </text>
                  </g>
                );
              })()}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ----------------------------------------------------------------------------
// Companion legend block — tiny, sits next to the radar
// ----------------------------------------------------------------------------

interface LegendProps {
  threshold: number;
  assessedCount: number;
  totalCount: number;
}

export function ReadinessLegend({ threshold, assessedCount, totalCount }: LegendProps) {
  const { t } = useI18n();
  return (
    <div className="text-[11px] text-hive-grey space-y-2">
      <div className="flex items-center gap-2">
        <Sparkles className="w-3 h-3 text-hive-orange" />
        <span className="font-bold uppercase tracking-wider text-hive-dark">
          {t("review.legend.heading")}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="inline-block px-1.5 py-0.5 rounded-full bg-amber-100 border border-hive-orange text-[9px] font-extrabold text-amber-800 leading-none">
          n /100
        </span>
        <span>{t("review.legend.score")}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-white border border-hive-cream text-[9px] font-extrabold text-hive-dark">
          ⌀
        </span>
        <span>{t("review.legend.overall")}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="inline-block w-3 h-0.5 bg-green-500" style={{ borderTop: "1.5px dashed #22c55e", background: "transparent" }} />
        <span>{t("review.legend.threshold")} ({threshold})</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="inline-block w-3 h-3 rounded-full bg-white border border-dashed border-gray-400" />
        <span>{t("review.legend.notAssessed")}</span>
      </div>
      <p className="pt-2 text-hive-grey/80 leading-relaxed">
        {t("review.legend.tally")
          .replace("{{a}}", String(assessedCount))
          .replace("{{b}}", String(totalCount))}
      </p>
    </div>
  );
}
