// HiveLogo — pure SVG so it renders without any asset file.
// You can drop an official logo at /public/hive-logo.png and swap to <img/> if preferred.

export function HiveLogo({ size = 72 }: { size?: number }) {
  return (
    <div className="flex items-center gap-4">
      <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden>
        <defs>
          <linearGradient id="hg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#F5A623" />
            <stop offset="100%" stopColor="#E89611" />
          </linearGradient>
        </defs>
        {/* Three stacked hexagons */}
        {[
          { cx: 28, cy: 40, r: 14 },
          { cx: 55, cy: 25, r: 14 },
          { cx: 55, cy: 55, r: 14 },
          { cx: 28, cy: 70, r: 14 },
        ].map((h, i) => (
          <polygon
            key={i}
            points={hexPoints(h.cx, h.cy, h.r)}
            fill="url(#hg)"
            opacity={i === 1 ? 0.85 : 1}
          />
        ))}
      </svg>
      <div className="flex flex-col leading-none">
        <span className="text-sm font-medium text-hive-grey tracking-widest uppercase">the</span>
        <span className="text-4xl font-extrabold text-hive-dark tracking-tight">HIVE</span>
        <span className="text-[10px] font-semibold text-hive-grey tracking-[0.25em] uppercase mt-1">
          Business Accelerator
        </span>
      </div>
    </div>
  );
}

function hexPoints(cx: number, cy: number, r: number): string {
  const pts: string[] = [];
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI / 3) * i - Math.PI / 6;
    pts.push(`${(cx + r * Math.cos(a)).toFixed(2)},${(cy + r * Math.sin(a)).toFixed(2)}`);
  }
  return pts.join(" ");
}
