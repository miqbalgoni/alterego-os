"use client";

// A curated library of hand-crafted SVG diagrams used by IllustratedDiagram.
// Each diagram is a closed, trusted React component — no arbitrary SVG from
// the model. Style: monoline + soft fills, hive-orange accents, gentle
// animation on mount.

import type { DiagramName } from "@/lib/a2ui/types";

const HIVE_ORANGE = "#F5A623";
const HIVE_AMBER = "#E89611";
const HIVE_DARK = "#3D3D3D";
const HIVE_GREY = "#6B6B6B";
const HIVE_CREAM = "#FFF8EC";

// ----------------------------------------------------------------------------
// Iceberg — what's visible vs hidden (for empathy / interview content)
// ----------------------------------------------------------------------------
function Iceberg() {
  return (
    <svg viewBox="0 0 320 220" className="w-full h-auto" aria-hidden>
      {/* water line */}
      <line x1="0" y1="100" x2="320" y2="100" stroke={HIVE_ORANGE} strokeOpacity="0.4" strokeDasharray="4 4" />
      {/* tip */}
      <polygon points="140,50 180,50 200,100 120,100" fill={HIVE_ORANGE} fillOpacity="0.85" />
      <polygon points="140,50 180,50 160,30" fill={HIVE_AMBER} />
      {/* underwater body */}
      <polygon points="120,100 200,100 230,200 90,200" fill={HIVE_ORANGE} fillOpacity="0.25" />
      <polygon points="120,100 200,100 215,160 105,160" fill={HIVE_ORANGE} fillOpacity="0.15" />
      {/* labels */}
      <text x="220" y="70" fill={HIVE_DARK} fontSize="11" fontWeight="700" fontFamily="Inter, system-ui">
        What they say
      </text>
      <text x="220" y="84" fill={HIVE_GREY} fontSize="10" fontFamily="Inter, system-ui">
        opinions, surveys
      </text>
      <text x="240" y="150" fill={HIVE_DARK} fontSize="11" fontWeight="700" fontFamily="Inter, system-ui">
        What they
      </text>
      <text x="240" y="166" fill={HIVE_DARK} fontSize="11" fontWeight="700" fontFamily="Inter, system-ui">
        actually do
      </text>
      <text x="240" y="180" fill={HIVE_GREY} fontSize="10" fontFamily="Inter, system-ui">
        habits, choices
      </text>
    </svg>
  );
}

// ----------------------------------------------------------------------------
// Loop — Build / Measure / Learn (lean cycle)
// ----------------------------------------------------------------------------
function Loop() {
  const cx = 160, cy = 110, r = 70;
  return (
    <svg viewBox="0 0 320 220" className="w-full h-auto" aria-hidden>
      <defs>
        <marker id="loop-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill={HIVE_ORANGE} />
        </marker>
      </defs>
      {/* circle path with arrow */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={HIVE_ORANGE} strokeWidth="2" strokeDasharray="3 3" opacity="0.55" />
      <path
        d={`M ${cx + r - 4},${cy} A ${r},${r} 0 1 1 ${cx + r - 4 - 0.1},${cy - 0.1}`}
        fill="none"
        stroke={HIVE_ORANGE}
        strokeWidth="2.5"
        markerEnd="url(#loop-arrow)"
      />
      {/* nodes */}
      {[
        { x: cx, y: cy - r, label: "Build", sub: "smallest test" },
        { x: cx + r, y: cy, label: "Measure", sub: "real signal" },
        { x: cx, y: cy + r, label: "Learn", sub: "decide next" },
      ].map((n, i) => (
        <g key={i}>
          <circle cx={n.x} cy={n.y} r="22" fill="#fff" stroke={HIVE_ORANGE} strokeWidth="2" />
          <text x={n.x} y={n.y + 3} textAnchor="middle" fontSize="11" fontWeight="700" fill={HIVE_DARK} fontFamily="Inter, system-ui">
            {n.label}
          </text>
          <text x={n.x} y={n.y + 38} textAnchor="middle" fontSize="9" fill={HIVE_GREY} fontFamily="Inter, system-ui">
            {n.sub}
          </text>
        </g>
      ))}
    </svg>
  );
}

// ----------------------------------------------------------------------------
// Funnel — TAM / SAM / SOM
// ----------------------------------------------------------------------------
function Funnel() {
  return (
    <svg viewBox="0 0 320 220" className="w-full h-auto" aria-hidden>
      <polygon points="40,30 280,30 240,90 80,90" fill={HIVE_ORANGE} fillOpacity="0.18" stroke={HIVE_ORANGE} strokeWidth="1.5" />
      <polygon points="80,100 240,100 210,150 110,150" fill={HIVE_ORANGE} fillOpacity="0.45" stroke={HIVE_ORANGE} strokeWidth="1.5" />
      <polygon points="110,160 210,160 188,200 132,200" fill={HIVE_ORANGE} fillOpacity="0.85" stroke={HIVE_AMBER} strokeWidth="1.5" />
      <text x="160" y="65" textAnchor="middle" fontSize="13" fontWeight="800" fill={HIVE_DARK} fontFamily="Inter, system-ui">TAM</text>
      <text x="160" y="80" textAnchor="middle" fontSize="9" fill={HIVE_GREY} fontFamily="Inter, system-ui">total market</text>
      <text x="160" y="129" textAnchor="middle" fontSize="13" fontWeight="800" fill={HIVE_DARK} fontFamily="Inter, system-ui">SAM</text>
      <text x="160" y="143" textAnchor="middle" fontSize="9" fill={HIVE_GREY} fontFamily="Inter, system-ui">reachable</text>
      <text x="160" y="186" textAnchor="middle" fontSize="13" fontWeight="800" fill="#fff" fontFamily="Inter, system-ui">SOM</text>
    </svg>
  );
}

// ----------------------------------------------------------------------------
// Scales — hypothesis vs evidence
// ----------------------------------------------------------------------------
function Scales() {
  return (
    <svg viewBox="0 0 320 220" className="w-full h-auto" aria-hidden>
      {/* base */}
      <rect x="150" y="180" width="20" height="20" fill={HIVE_DARK} rx="3" />
      <rect x="120" y="200" width="80" height="6" fill={HIVE_DARK} rx="2" />
      {/* central column */}
      <line x1="160" y1="60" x2="160" y2="180" stroke={HIVE_DARK} strokeWidth="3" />
      {/* beam — slightly tilted toward right (evidence wins) */}
      <line x1="60" y1="80" x2="260" y2="60" stroke={HIVE_DARK} strokeWidth="3" />
      {/* left pan (hypothesis) */}
      <line x1="60" y1="80" x2="60" y2="105" stroke={HIVE_GREY} strokeWidth="1" />
      <ellipse cx="60" cy="115" rx="40" ry="10" fill={HIVE_ORANGE} fillOpacity="0.3" stroke={HIVE_ORANGE} strokeWidth="1.5" />
      <text x="60" y="118" textAnchor="middle" fontSize="11" fontWeight="700" fill={HIVE_DARK} fontFamily="Inter, system-ui">hypothesis</text>
      {/* right pan (evidence) */}
      <line x1="260" y1="60" x2="260" y2="85" stroke={HIVE_GREY} strokeWidth="1" />
      <ellipse cx="260" cy="95" rx="40" ry="10" fill={HIVE_ORANGE} fillOpacity="0.85" stroke={HIVE_AMBER} strokeWidth="1.5" />
      <text x="260" y="98" textAnchor="middle" fontSize="11" fontWeight="700" fill="#fff" fontFamily="Inter, system-ui">evidence</text>
    </svg>
  );
}

// ----------------------------------------------------------------------------
// Target — concentric rings with arrow at center (positioning)
// ----------------------------------------------------------------------------
function Target() {
  return (
    <svg viewBox="0 0 320 220" className="w-full h-auto" aria-hidden>
      <circle cx="160" cy="110" r="80" fill={HIVE_ORANGE} fillOpacity="0.1" stroke={HIVE_ORANGE} strokeWidth="1.5" />
      <circle cx="160" cy="110" r="55" fill={HIVE_ORANGE} fillOpacity="0.18" stroke={HIVE_ORANGE} strokeWidth="1.5" />
      <circle cx="160" cy="110" r="30" fill={HIVE_ORANGE} fillOpacity="0.4" stroke={HIVE_AMBER} strokeWidth="1.5" />
      <circle cx="160" cy="110" r="9" fill={HIVE_AMBER} />
      {/* arrow */}
      <line x1="40" y1="40" x2="155" y2="107" stroke={HIVE_DARK} strokeWidth="2.5" strokeLinecap="round" />
      <polygon points="155,107 145,98 152,113" fill={HIVE_DARK} />
      <text x="40" y="32" fontSize="10" fontWeight="700" fill={HIVE_DARK} fontFamily="Inter, system-ui">your wedge</text>
      <text x="240" y="195" fontSize="10" fill={HIVE_GREY} fontFamily="Inter, system-ui">everyone else</text>
    </svg>
  );
}

// ----------------------------------------------------------------------------
// Growth — hockey-stick chart
// ----------------------------------------------------------------------------
function Growth() {
  return (
    <svg viewBox="0 0 320 220" className="w-full h-auto" aria-hidden>
      {/* grid */}
      <line x1="40" y1="190" x2="290" y2="190" stroke={HIVE_GREY} strokeOpacity="0.3" strokeWidth="1" />
      <line x1="40" y1="40" x2="40" y2="190" stroke={HIVE_GREY} strokeOpacity="0.3" strokeWidth="1" />
      {/* curve — accelerating */}
      <path
        d="M 40,180 Q 120,178 170,160 T 290,40"
        fill="none"
        stroke={HIVE_ORANGE}
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* fill under curve */}
      <path
        d="M 40,180 Q 120,178 170,160 T 290,40 L 290,190 L 40,190 Z"
        fill={HIVE_ORANGE}
        fillOpacity="0.12"
      />
      {/* dot at end */}
      <circle cx="290" cy="40" r="6" fill={HIVE_AMBER} />
      <circle cx="290" cy="40" r="11" fill={HIVE_AMBER} fillOpacity="0.25" />
      <text x="50" y="200" fontSize="9" fill={HIVE_GREY} fontFamily="Inter, system-ui">time →</text>
      <text x="20" y="50" fontSize="9" fill={HIVE_GREY} fontFamily="Inter, system-ui" transform="rotate(-90 20 50)">value</text>
    </svg>
  );
}

// ----------------------------------------------------------------------------
// Compass — direction (mission / vision)
// ----------------------------------------------------------------------------
function Compass() {
  return (
    <svg viewBox="0 0 320 220" className="w-full h-auto" aria-hidden>
      <circle cx="160" cy="110" r="70" fill="#fff" stroke={HIVE_DARK} strokeWidth="2" />
      <circle cx="160" cy="110" r="60" fill="none" stroke={HIVE_GREY} strokeOpacity="0.3" strokeWidth="1" />
      {/* needle */}
      <polygon points="160,55 170,110 160,165 150,110" fill={HIVE_ORANGE} />
      <polygon points="160,55 170,110 150,110" fill={HIVE_AMBER} />
      <circle cx="160" cy="110" r="6" fill={HIVE_DARK} />
      {/* cardinal letters */}
      <text x="160" y="48" textAnchor="middle" fontSize="11" fontWeight="800" fill={HIVE_DARK} fontFamily="Inter, system-ui">N</text>
      <text x="160" y="180" textAnchor="middle" fontSize="11" fontWeight="700" fill={HIVE_GREY} fontFamily="Inter, system-ui">S</text>
      <text x="100" y="115" textAnchor="middle" fontSize="11" fontWeight="700" fill={HIVE_GREY} fontFamily="Inter, system-ui">W</text>
      <text x="220" y="115" textAnchor="middle" fontSize="11" fontWeight="700" fill={HIVE_GREY} fontFamily="Inter, system-ui">E</text>
    </svg>
  );
}

// ----------------------------------------------------------------------------
// Key — unlocking (first customer)
// ----------------------------------------------------------------------------
function Key() {
  return (
    <svg viewBox="0 0 320 220" className="w-full h-auto" aria-hidden>
      {/* shaft */}
      <rect x="80" y="100" width="140" height="14" rx="3" fill={HIVE_ORANGE} />
      {/* head (circle) */}
      <circle cx="78" cy="107" r="34" fill="none" stroke={HIVE_ORANGE} strokeWidth="10" />
      <circle cx="78" cy="107" r="12" fill={HIVE_AMBER} />
      {/* teeth */}
      <rect x="200" y="114" width="6" height="14" fill={HIVE_ORANGE} />
      <rect x="190" y="114" width="6" height="20" fill={HIVE_ORANGE} />
      <rect x="180" y="114" width="6" height="14" fill={HIVE_ORANGE} />
      {/* sparkles */}
      <circle cx="240" cy="80" r="3" fill={HIVE_AMBER} />
      <circle cx="260" cy="100" r="2" fill={HIVE_ORANGE} />
      <circle cx="245" cy="140" r="2" fill={HIVE_AMBER} />
    </svg>
  );
}

// ----------------------------------------------------------------------------
// Bridge — connecting (partnerships, networking)
// ----------------------------------------------------------------------------
function Bridge() {
  return (
    <svg viewBox="0 0 320 220" className="w-full h-auto" aria-hidden>
      {/* two cliffs */}
      <path d="M 0,180 L 80,180 L 80,140 L 50,150 L 30,170 L 0,170 Z" fill={HIVE_CREAM} stroke={HIVE_GREY} strokeOpacity="0.5" />
      <path d="M 320,180 L 240,180 L 240,140 L 270,150 L 290,170 L 320,170 Z" fill={HIVE_CREAM} stroke={HIVE_GREY} strokeOpacity="0.5" />
      {/* bridge deck */}
      <rect x="80" y="135" width="160" height="6" fill={HIVE_DARK} />
      {/* cables */}
      <path d="M 80,135 Q 160,80 240,135" fill="none" stroke={HIVE_ORANGE} strokeWidth="2.5" />
      <line x1="100" y1="135" x2="105" y2="115" stroke={HIVE_ORANGE} strokeWidth="1.5" />
      <line x1="140" y1="135" x2="143" y2="100" stroke={HIVE_ORANGE} strokeWidth="1.5" />
      <line x1="180" y1="135" x2="183" y2="100" stroke={HIVE_ORANGE} strokeWidth="1.5" />
      <line x1="220" y1="135" x2="220" y2="115" stroke={HIVE_ORANGE} strokeWidth="1.5" />
      {/* towers */}
      <rect x="98" y="80" width="6" height="55" fill={HIVE_DARK} />
      <rect x="216" y="80" width="6" height="55" fill={HIVE_DARK} />
      {/* people dots */}
      <circle cx="40" cy="135" r="6" fill={HIVE_ORANGE} />
      <circle cx="280" cy="135" r="6" fill={HIVE_AMBER} />
    </svg>
  );
}

// ----------------------------------------------------------------------------
// Lighthouse — vision, guidance
// ----------------------------------------------------------------------------
function Lighthouse() {
  return (
    <svg viewBox="0 0 320 220" className="w-full h-auto" aria-hidden>
      {/* base/rocks */}
      <ellipse cx="160" cy="200" rx="80" ry="12" fill={HIVE_GREY} fillOpacity="0.3" />
      {/* tower */}
      <polygon points="140,200 180,200 175,80 145,80" fill="#fff" stroke={HIVE_DARK} strokeWidth="2" />
      {/* stripes */}
      <rect x="146" y="100" width="28" height="12" fill={HIVE_ORANGE} />
      <rect x="146" y="140" width="28" height="12" fill={HIVE_ORANGE} />
      <rect x="146" y="180" width="28" height="12" fill={HIVE_ORANGE} />
      {/* lamp */}
      <rect x="142" y="62" width="36" height="20" fill={HIVE_AMBER} stroke={HIVE_DARK} strokeWidth="1.5" rx="2" />
      <polygon points="140,62 180,62 174,52 146,52" fill={HIVE_DARK} />
      {/* light beam */}
      <polygon points="178,72 280,40 280,90" fill={HIVE_AMBER} fillOpacity="0.35" />
      <polygon points="142,72 40,40 40,90" fill={HIVE_AMBER} fillOpacity="0.2" />
    </svg>
  );
}

// ----------------------------------------------------------------------------
// Registry
// ----------------------------------------------------------------------------

export const DIAGRAMS: Record<DiagramName, () => JSX.Element> = {
  iceberg: Iceberg,
  loop: Loop,
  funnel: Funnel,
  scales: Scales,
  target: Target,
  growth: Growth,
  compass: Compass,
  key: Key,
  bridge: Bridge,
  lighthouse: Lighthouse,
};

// DIAGRAM_NAMES lives in @/lib/a2ui/types so it's safely importable from
// server code without dragging in React. Re-export here for convenience.
export { DIAGRAM_NAMES } from "@/lib/a2ui/types";
