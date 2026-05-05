/* eslint-disable @next/next/no-img-element */
"use client";

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Svg,
  Polygon,
  Line,
  Circle,
  G,
} from "@react-pdf/renderer";

// ---------------------------------------------------------------------------
// Brand palette (kept in-sync with tailwind.config hive-* tokens)
// ---------------------------------------------------------------------------
const C = {
  orange: "#F5A623",
  amber: "#E89611",
  amberDeep: "#B45309",
  cream: "#FFE9C9",
  creamSoft: "#FFF6E5",
  dark: "#2A2A2A",
  ink: "#3D3D3D",
  grey: "#6B6B6B",
  greyLight: "#9CA3AF",
  greenBg: "#DCFCE7",
  green: "#15803D",
  greenLine: "#22C55E",
  amberBg: "#FEF3C7",
  redBg: "#FEE2E2",
  red: "#B91C1C",
  white: "#FFFFFF",
  border: "#F1E2C2",
};

// ---------------------------------------------------------------------------
// Public types
// ---------------------------------------------------------------------------
export interface ReportSection {
  index: number;
  longLabel: string;
  shortLabel: string;
  score: number | null;
}

export interface ReportData {
  founderName: string;
  startupName: string;
  email: string;
  date: string;
  composite: number | null;
  threshold: number;
  assessedCount: number;
  totalSections: number;
  sections: ReportSection[];
  // Localized strings (so PDF respects EN/IT)
  i18n: {
    eyebrow: string;
    title: string;
    subtitle: string;
    issuedTo: string;
    startup: string;
    date: string;
    composite: string;
    compositeOf: string;
    tier: string;
    profile: string;
    profileSub: string;
    marks: string;
    marksSub: string;
    colDimension: string;
    colScore: string;
    colStatus: string;
    colSignal: string;
    statusPassed: string;
    statusGap: string;
    statusPending: string;
    notAssessed: string;
    signature: string;
    signatureRole: string;
    seal: string;
    footnote: string;
    assessed: string;
    page: string;
    of: string;
  };
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------
const styles = StyleSheet.create({
  page: {
    paddingTop: 36,
    paddingBottom: 56,
    paddingHorizontal: 40,
    fontFamily: "Helvetica",
    fontSize: 10,
    color: C.ink,
    backgroundColor: C.white,
  },

  // --- decorative top ribbon ---
  ribbon: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 6,
    backgroundColor: C.orange,
  },

  // --- header ---
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 18,
  },
  headerLeft: { flexDirection: "row", alignItems: "center" },
  logoMark: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: C.orange,
    color: C.white,
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
    paddingTop: 9,
    marginRight: 12,
  },
  eyebrow: {
    fontSize: 7.5,
    color: C.amber,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  title: {
    fontSize: 22,
    color: C.dark,
    fontFamily: "Helvetica-Bold",
    marginTop: 2,
  },
  seal: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: C.orange,
    borderWidth: 2,
    borderColor: C.white,
    color: C.white,
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
    paddingTop: 26,
    letterSpacing: 1.4,
  },
  subtitle: {
    fontSize: 10.5,
    color: C.grey,
    lineHeight: 1.5,
    marginBottom: 14,
    maxWidth: "85%",
  },

  // --- meta strip ---
  metaRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 18,
  },
  metaCell: {
    flex: 1,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 6,
    padding: 8,
    backgroundColor: C.white,
  },
  metaCellAccent: {
    backgroundColor: C.creamSoft,
    borderColor: C.orange,
  },
  metaLabel: {
    fontSize: 7,
    color: C.amber,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    marginBottom: 3,
  },
  metaValue: {
    fontSize: 11,
    color: C.dark,
    fontFamily: "Helvetica-Bold",
  },

  // --- composite + radar section ---
  scoreRow: {
    flexDirection: "row",
    gap: 18,
    alignItems: "center",
    marginBottom: 18,
    paddingTop: 16,
    paddingBottom: 18,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: C.border,
  },
  compositeBlock: { flex: 1.1 },
  compositeEyebrow: {
    fontSize: 8,
    color: C.amber,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  compositeNumberRow: { flexDirection: "row", alignItems: "flex-end" },
  compositeNumber: {
    fontSize: 64,
    fontFamily: "Helvetica-Bold",
    color: C.dark,
    lineHeight: 1,
  },
  compositeOver: {
    fontSize: 14,
    color: C.grey,
    fontFamily: "Helvetica-Bold",
    marginLeft: 6,
    paddingBottom: 6,
  },
  tierPill: {
    marginTop: 8,
    alignSelf: "flex-start",
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 99,
    fontSize: 8.5,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 1,
    textTransform: "uppercase",
    borderWidth: 1,
  },
  compositeNote: {
    fontSize: 9,
    color: C.grey,
    marginTop: 8,
    lineHeight: 1.4,
    maxWidth: 200,
  },

  radarBlock: { flex: 1, alignItems: "center" },

  sectionEyebrow: {
    fontSize: 8,
    color: C.orange,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    color: C.dark,
    marginTop: 2,
    marginBottom: 8,
  },

  // --- table ---
  table: {
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 6,
    overflow: "hidden",
  },
  tableHead: {
    flexDirection: "row",
    backgroundColor: C.creamSoft,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  tableHeadCell: {
    fontSize: 7.5,
    color: C.dark,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 1.1,
    textTransform: "uppercase",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderTopWidth: 0.5,
    borderColor: C.border,
    alignItems: "center",
  },
  tableRowAlt: { backgroundColor: "#FFFBF1" },

  // column widths
  cDim: { width: "44%" },
  cScore: { width: "12%" },
  cStatus: { width: "16%" },
  cSignal: { width: "28%" },

  // dimension cell
  dimRow: { flexDirection: "row", alignItems: "center" },
  dimBadge: {
    width: 22,
    height: 22,
    borderRadius: 5,
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
    paddingTop: 6,
    marginRight: 8,
  },
  dimLabel: {
    fontSize: 9.5,
    color: C.dark,
    fontFamily: "Helvetica-Bold",
  },
  dimSub: {
    fontSize: 7.5,
    color: C.grey,
    marginTop: 1,
  },

  // score cell
  scoreText: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
  },
  scoreOver: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    color: C.grey,
    marginLeft: 2,
  },

  // status pill
  statusPill: {
    alignSelf: "flex-start",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 99,
    borderWidth: 0.5,
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },

  // signal bar
  barTrack: {
    height: 6,
    backgroundColor: C.cream,
    borderRadius: 3,
    overflow: "hidden",
    width: "100%",
  },
  barFill: { height: 6, borderRadius: 3 },

  // --- footer ---
  footer: {
    position: "absolute",
    bottom: 22,
    left: 40,
    right: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 10,
    borderTopWidth: 1,
    borderColor: C.border,
  },
  sigRow: { flexDirection: "row", alignItems: "center" },
  sigDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: C.orange,
    color: C.white,
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
    paddingTop: 5,
    marginRight: 8,
  },
  sigName: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: C.dark,
  },
  sigRole: { fontSize: 7.5, color: C.grey, marginTop: 1 },
  pageNumber: {
    fontSize: 7,
    color: C.grey,
    letterSpacing: 1.4,
    textTransform: "uppercase",
    fontFamily: "Helvetica-Bold",
  },

  footnote: {
    fontSize: 7.5,
    color: C.grey,
    marginTop: 10,
    lineHeight: 1.4,
    maxWidth: "85%",
  },
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function tierStyle(score: number | null) {
  if (score === null) {
    return { backgroundColor: "#F3F4F6", color: "#4B5563", borderColor: "#E5E7EB" };
  }
  if (score >= 70) {
    return { backgroundColor: C.greenBg, color: C.green, borderColor: "#86EFAC" };
  }
  if (score >= 55) {
    return { backgroundColor: C.amberBg, color: C.amberDeep, borderColor: C.orange };
  }
  return { backgroundColor: C.redBg, color: C.red, borderColor: "#FCA5A5" };
}

function tierLabelKey(
  score: number | null,
  i18n: ReportData["i18n"]
): string {
  // Composite tier label is passed already via `tier` in i18n.
  return i18n.tier;
}

function statusOf(score: number | null, threshold: number) {
  if (score === null) return "pending" as const;
  return score >= threshold ? "passed" : "gap";
}

function statusStyle(kind: "passed" | "gap" | "pending") {
  switch (kind) {
    case "passed":
      return { backgroundColor: C.greenBg, color: C.green, borderColor: "#86EFAC" };
    case "gap":
      return { backgroundColor: C.amberBg, color: C.amberDeep, borderColor: C.orange };
    case "pending":
      return { backgroundColor: "#F3F4F6", color: "#4B5563", borderColor: "#E5E7EB" };
  }
}

// ---------------------------------------------------------------------------
// Radar (SVG inside the PDF)
// ---------------------------------------------------------------------------
function Radar({
  sections,
  threshold,
}: {
  sections: ReportSection[];
  threshold: number;
}) {
  const SIZE = 200;
  const cx = SIZE / 2;
  const cy = SIZE / 2;
  const radius = 76;
  const N = sections.length || 9;

  const angleFor = (i: number) => -Math.PI / 2 + (i * 2 * Math.PI) / N;

  const polyPoints = sections
    .map((s, i) => {
      const a = angleFor(i);
      const r = ((s.score ?? 0) / 100) * radius;
      return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`;
    })
    .join(" ");

  const thresholdPoints = sections
    .map((_, i) => {
      const a = angleFor(i);
      const r = (threshold / 100) * radius;
      return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`;
    })
    .join(" ");

  return (
    <Svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
      {/* Concentric grid circles */}
      {[0.25, 0.5, 0.75, 1].map((f, idx) => (
        <Circle
          key={idx}
          cx={cx}
          cy={cy}
          r={radius * f}
          stroke={C.border}
          strokeWidth={0.6}
          fill="none"
        />
      ))}
      {/* Spokes */}
      {sections.map((_, i) => {
        const a = angleFor(i);
        return (
          <Line
            key={i}
            x1={cx}
            y1={cy}
            x2={cx + radius * Math.cos(a)}
            y2={cy + radius * Math.sin(a)}
            stroke={C.border}
            strokeWidth={0.5}
          />
        );
      })}
      {/* Threshold polygon */}
      <Polygon
        points={thresholdPoints}
        fill="none"
        stroke={C.greenLine}
        strokeWidth={0.7}
        strokeDasharray="2,2"
      />
      {/* Score polygon */}
      <Polygon
        points={polyPoints}
        fill={C.orange}
        fillOpacity={0.25}
        stroke={C.orange}
        strokeWidth={1.2}
      />
      {/* Score dots */}
      {sections.map((s, i) => {
        const a = angleFor(i);
        const r = ((s.score ?? 0) / 100) * radius;
        return (
          <Circle
            key={`d-${i}`}
            cx={cx + r * Math.cos(a)}
            cy={cy + r * Math.sin(a)}
            r={2}
            fill={(s.score ?? 0) >= threshold ? C.green : C.amberDeep}
          />
        );
      })}
      {/* Axis labels — small numbered chips at each axis tip */}
      {sections.map((s, i) => {
        const a = angleFor(i);
        const lx = cx + (radius + 12) * Math.cos(a);
        const ly = cy + (radius + 12) * Math.sin(a);
        return (
          <G key={`l-${i}`}>
            <Circle
              cx={lx}
              cy={ly}
              r={7}
              fill={C.creamSoft}
              stroke={C.orange}
              strokeWidth={0.6}
            />
            <Text
              x={lx - 1.9}
              y={ly + 2.5}
              style={{
                fontSize: 7,
                fontFamily: "Helvetica-Bold",
                color: C.amberDeep,
              }}
            >
              {s.index}
            </Text>
          </G>
        );
      })}
    </Svg>
  );
}

// ---------------------------------------------------------------------------
// Main document
// ---------------------------------------------------------------------------
export function ReportPDF({ data }: { data: ReportData }) {
  const compositeTier = tierStyle(data.composite);

  return (
    <Document
      title="ALTEREGO OS – Founder Report Card"
      author="ALTEREGO OS"
      subject="Investment Readiness Report"
    >
      <Page size="A4" style={styles.page}>
        {/* top ribbon */}
        <View style={styles.ribbon} fixed />

        {/* header */}
        <View style={styles.headerRow}>
          <View style={styles.headerLeft}>
            <Text style={styles.logoMark}>A</Text>
            <View>
              <Text style={styles.eyebrow}>{data.i18n.eyebrow}</Text>
              <Text style={styles.title}>{data.i18n.title}</Text>
            </View>
          </View>
          <Text style={styles.seal}>{data.i18n.seal}</Text>
        </View>

        <Text style={styles.subtitle}>{data.i18n.subtitle}</Text>

        {/* meta */}
        <View style={styles.metaRow}>
          <View style={[styles.metaCell, styles.metaCellAccent]}>
            <Text style={styles.metaLabel}>{data.i18n.issuedTo}</Text>
            <Text style={styles.metaValue}>{data.founderName}</Text>
          </View>
          <View style={styles.metaCell}>
            <Text style={styles.metaLabel}>{data.i18n.startup}</Text>
            <Text style={styles.metaValue}>{data.startupName}</Text>
          </View>
          <View style={styles.metaCell}>
            <Text style={styles.metaLabel}>{data.i18n.date}</Text>
            <Text style={styles.metaValue}>{data.date}</Text>
          </View>
        </View>

        {/* composite + radar */}
        <View style={styles.scoreRow}>
          <View style={styles.compositeBlock}>
            <Text style={styles.compositeEyebrow}>{data.i18n.composite}</Text>
            <View style={styles.compositeNumberRow}>
              <Text style={styles.compositeNumber}>
                {data.composite ?? "—"}
              </Text>
              <Text style={styles.compositeOver}>/100</Text>
            </View>
            <Text
              style={[
                styles.tierPill,
                {
                  backgroundColor: compositeTier.backgroundColor,
                  color: compositeTier.color,
                  borderColor: compositeTier.borderColor,
                },
              ]}
            >
              {tierLabelKey(data.composite, data.i18n)}
            </Text>
            <Text style={styles.compositeNote}>
              {data.i18n.compositeOf} · {data.assessedCount}/
              {data.totalSections} {data.i18n.assessed}
            </Text>
          </View>
          <View style={styles.radarBlock}>
            <Text
              style={[
                styles.compositeEyebrow,
                { color: C.orange, marginBottom: 4 },
              ]}
            >
              {data.i18n.profile}
            </Text>
            <Radar sections={data.sections} threshold={data.threshold} />
          </View>
        </View>

        {/* marks table */}
        <View>
          <Text style={styles.sectionEyebrow}>{data.i18n.marks}</Text>
          <Text style={styles.sectionTitle}>{data.i18n.marksSub}</Text>

          <View style={styles.table}>
            <View style={styles.tableHead}>
              <Text style={[styles.tableHeadCell, styles.cDim]}>
                {data.i18n.colDimension}
              </Text>
              <Text style={[styles.tableHeadCell, styles.cScore]}>
                {data.i18n.colScore}
              </Text>
              <Text style={[styles.tableHeadCell, styles.cStatus]}>
                {data.i18n.colStatus}
              </Text>
              <Text style={[styles.tableHeadCell, styles.cSignal]}>
                {data.i18n.colSignal}
              </Text>
            </View>

            {data.sections.map((s, i) => {
              const kind = statusOf(s.score, data.threshold);
              const kindStyle = statusStyle(kind);
              const passed = kind === "passed";
              const pending = kind === "pending";
              const badgeBg = pending
                ? "#F3F4F6"
                : passed
                ? C.greenBg
                : C.cream;
              const badgeColor = pending
                ? "#6B7280"
                : passed
                ? C.green
                : C.amberDeep;
              const fillFrom = passed ? "#16a34a" : C.orange;
              const fillTo = passed ? "#22c55e" : C.amber;
              const pct = Math.max(0, Math.min(100, s.score ?? 0));
              const statusLabel =
                kind === "passed"
                  ? data.i18n.statusPassed
                  : kind === "gap"
                  ? data.i18n.statusGap
                  : data.i18n.statusPending;

              return (
                <View
                  key={s.index}
                  style={[
                    styles.tableRow,
                    i % 2 === 1 ? styles.tableRowAlt : {},
                  ]}
                >
                  <View style={[styles.cDim, styles.dimRow]}>
                    <Text
                      style={[
                        styles.dimBadge,
                        { backgroundColor: badgeBg, color: badgeColor },
                      ]}
                    >
                      {s.index}
                    </Text>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.dimLabel}>{s.longLabel}</Text>
                      <Text style={styles.dimSub}>{s.shortLabel}</Text>
                    </View>
                  </View>

                  <View style={styles.cScore}>
                    {pending ? (
                      <Text style={[styles.scoreText, { color: C.greyLight }]}>
                        —
                      </Text>
                    ) : (
                      <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
                        <Text
                          style={[
                            styles.scoreText,
                            { color: passed ? C.green : C.amberDeep },
                          ]}
                        >
                          {s.score}
                        </Text>
                        <Text style={styles.scoreOver}>/100</Text>
                      </View>
                    )}
                  </View>

                  <View style={styles.cStatus}>
                    <Text
                      style={[
                        styles.statusPill,
                        {
                          backgroundColor: kindStyle.backgroundColor,
                          color: kindStyle.color,
                          borderColor: kindStyle.borderColor,
                        },
                      ]}
                    >
                      {statusLabel}
                    </Text>
                  </View>

                  <View style={styles.cSignal}>
                    {pending ? (
                      <Text style={{ fontSize: 8, color: C.greyLight }}>
                        {data.i18n.notAssessed}
                      </Text>
                    ) : (
                      <View style={styles.barTrack}>
                        <View
                          style={[
                            styles.barFill,
                            {
                              width: `${pct}%`,
                              backgroundColor: fillFrom,
                            },
                          ]}
                        />
                      </View>
                    )}
                  </View>
                </View>
              );
            })}
          </View>

          <Text style={styles.footnote}>{data.i18n.footnote}</Text>
        </View>

        {/* footer */}
        <View style={styles.footer} fixed>
          <View style={styles.sigRow}>
            <Text style={styles.sigDot}>✓</Text>
            <View>
              <Text style={styles.sigName}>{data.i18n.signature}</Text>
              <Text style={styles.sigRole}>{data.i18n.signatureRole}</Text>
            </View>
          </View>
          <Text
            style={styles.pageNumber}
            render={({ pageNumber, totalPages }) =>
              `ALTEREGO · OS  —  ${data.i18n.page} ${pageNumber} ${data.i18n.of} ${totalPages}`
            }
          />
        </View>
      </Page>
    </Document>
  );
}
