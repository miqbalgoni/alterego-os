import Link from "next/link";
import { Card, PageHeader, Stat, Pill, Table, Th, Td } from "./_components/AdminUI";
import {
  getOverviewStats,
  getFunnel,
  getScoreDistribution,
  getTopGapTags,
  getRecentActivity,
} from "@/lib/adminQueries";

export const dynamic = "force-dynamic";

function fmtRelative(d: Date | null | undefined) {
  if (!d) return "—";
  const diff = Date.now() - new Date(d).getTime();
  const m = Math.floor(diff / 60_000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const days = Math.floor(h / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(d).toLocaleDateString();
}

const STEP_LABEL: Record<string, string> = {
  personal: "Personal",
  "irl-1": "IRL 1",
  "irl-2": "IRL 2",
  "irl-3": "IRL 3",
  "irl-4": "IRL 4",
  "irl-5": "IRL 5",
  "irl-6": "IRL 6",
  "irl-7": "IRL 7",
  "irl-8": "IRL 8",
  "irl-9": "IRL 9",
  review: "Review",
  submitted: "Submitted",
};

export default async function AdminOverviewPage() {
  const [stats, funnel, dist, gaps, activity] = await Promise.all([
    getOverviewStats(),
    getFunnel(),
    getScoreDistribution(),
    getTopGapTags(),
    getRecentActivity(8),
  ]);

  const maxFunnel = funnel[0]?.count || 1;

  return (
    <>
      <PageHeader
        title="Overview"
        subtitle="Snapshot of the HIVE cohort, content base, and AskMe activity."
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <Stat label="Founders" value={stats.totalUsers} hint={`${stats.last7d} new in last 7d`} />
        <Stat
          label="Submitted check-ins"
          value={stats.submittedSessions}
          hint={`${stats.submissionRate}% of started`}
        />
        <Stat
          label="Modules"
          value={stats.completedModules}
          hint={`${stats.startedModules} in progress`}
          delta="completed"
        />
        <Stat
          label="Knowledge base"
          value={stats.docCount}
          hint={`${stats.chunkCount} chunks indexed`}
          delta="docs"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-4">
        <Card title="Onboarding funnel" subtitle="Founders reaching each step" className="xl:col-span-2">
          <div className="space-y-2">
            {funnel.map(row => (
              <div key={row.step} className="flex items-center gap-3">
                <div className="w-20 text-xs text-hive-grey">{STEP_LABEL[row.step] ?? row.step}</div>
                <div className="flex-1 bg-[#FAF3E2] rounded-md h-6 relative overflow-hidden">
                  <div
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-hive-orange to-hive-amber rounded-md"
                    style={{ width: `${Math.max(2, (row.count / maxFunnel) * 100)}%` }}
                  />
                  <div className="relative px-2 h-full flex items-center text-[11px] font-medium text-hive-dark">
                    {row.count} <span className="text-hive-grey ml-2">({row.pct}%)</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Top gap tags" subtitle="Most common blockers across all founders">
          {gaps.length === 0 ? (
            <div className="text-sm text-hive-grey">No assessments yet.</div>
          ) : (
            <ul className="space-y-2">
              {gaps.map(g => (
                <li key={g.tag} className="flex items-center justify-between gap-2 text-sm">
                  <code className="text-[12px] text-hive-amber">{g.tag}</code>
                  <Pill tone="warn">{g.count}</Pill>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <Card title="IRL score distribution" subtitle="Latest assessment per founder, per section" className="mb-4">
        <Table>
          <thead>
            <tr>
              <Th>Section</Th>
              <Th>Founders scored</Th>
              <Th>Avg score</Th>
              <Th className="w-[55%]">Distribution (0–100)</Th>
            </tr>
          </thead>
          <tbody>
            {dist.map(d => {
              const total = d.buckets.reduce((a, b) => a + b, 0) || 1;
              return (
                <tr key={d.section}>
                  <Td className="font-medium">{d.section.toUpperCase()}</Td>
                  <Td>{d.count}</Td>
                  <Td>
                    <span className="font-semibold">{d.avg}</span>
                  </Td>
                  <Td>
                    {d.count === 0 ? (
                      <span className="text-xs text-hive-grey">—</span>
                    ) : (
                      <div className="flex h-3.5 rounded overflow-hidden border border-[#F4ECD9]">
                        {d.buckets.map((b, i) => {
                          const palette = ["#FCA5A5", "#FCD34D", "#FDE68A", "#A7F3D0", "#34D399"];
                          return (
                            <div
                              key={i}
                              style={{ width: `${(b / total) * 100}%`, background: palette[i] }}
                              title={`${i * 20}–${(i + 1) * 20 - 1}: ${b}`}
                            />
                          );
                        })}
                      </div>
                    )}
                  </Td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card title="Recent sign-ups">
          {activity.signups.length === 0 ? (
            <div className="text-sm text-hive-grey">No founders yet.</div>
          ) : (
            <Table>
              <thead>
                <tr>
                  <Th>Email</Th>
                  <Th>Joined</Th>
                </tr>
              </thead>
              <tbody>
                {activity.signups.map(u => (
                  <tr key={u.id}>
                    <Td>
                      <Link
                        href={`/admin/users/${u.id}`}
                        className="text-hive-amber hover:underline"
                      >
                        {u.fullName || u.email}
                      </Link>
                    </Td>
                    <Td className="text-hive-grey">{fmtRelative(u.createdAt)}</Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card>

        <Card title="Recent assessments">
          {activity.assessments.length === 0 ? (
            <div className="text-sm text-hive-grey">No assessments yet.</div>
          ) : (
            <Table>
              <thead>
                <tr>
                  <Th>Founder</Th>
                  <Th>Section</Th>
                  <Th>Score</Th>
                  <Th>When</Th>
                </tr>
              </thead>
              <tbody>
                {activity.assessments.map(a => (
                  <tr key={a.id}>
                    <Td>
                      <Link href={`/admin/users/${a.userId}`} className="text-hive-amber hover:underline">
                        {a.user?.fullName || a.user?.email || "—"}
                      </Link>
                    </Td>
                    <Td>{a.section.toUpperCase()}</Td>
                    <Td>
                      <Pill tone={a.score >= 65 ? "ok" : a.score >= 40 ? "warn" : "danger"}>
                        {a.score}
                      </Pill>
                    </Td>
                    <Td className="text-hive-grey">{fmtRelative(a.createdAt)}</Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card>
      </div>
    </>
  );
}
