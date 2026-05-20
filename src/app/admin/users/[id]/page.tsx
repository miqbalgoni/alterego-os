import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { Card, PageHeader, Pill, Stat, Table, Th, Td, EmptyState } from "../../_components/AdminUI";
import { QUESTION_BY_ID, SECTIONS } from "@/lib/questions";
import { UserActions } from "./_UserActions";

export const dynamic = "force-dynamic";

function fmtDate(d: Date | null | undefined) {
  if (!d) return "—";
  return new Date(d).toLocaleString();
}

function tryParse<T = any>(s: string | null | undefined): T | null {
  if (!s) return null;
  try { return JSON.parse(s) as T; } catch { return null; }
}

function renderAnswerValue(value: string): React.ReactNode {
  const parsed = tryParse(value);
  if (parsed === null) return <span className="text-hive-dark">{value}</span>;
  if (Array.isArray(parsed)) {
    if (parsed.length === 0) return <span className="text-hive-grey">—</span>;
    return (
      <div className="flex flex-wrap gap-1">
        {parsed.map((v, i) => (
          <span key={i} className="px-2 py-0.5 bg-[#FAF3E2] rounded text-xs">{String(v)}</span>
        ))}
      </div>
    );
  }
  if (typeof parsed === "object") {
    return <code className="text-xs">{JSON.stringify(parsed)}</code>;
  }
  return <span>{String(parsed)}</span>;
}

export default async function AdminUserDetail({ params }: { params: { id: string } }) {
  const user = await prisma.user.findUnique({
    where: { id: params.id },
    include: {
      sessions: { orderBy: { updatedAt: "desc" } },
      answers: { orderBy: { updatedAt: "asc" } },
      assessments: { orderBy: { createdAt: "desc" } },
      modules: { orderBy: { updatedAt: "desc" } },
    },
  });

  if (!user) notFound();

  // Latest assessment per section
  const latestAssessmentBySection = new Map<string, typeof user.assessments[number]>();
  for (const a of user.assessments) {
    if (!latestAssessmentBySection.has(a.section)) latestAssessmentBySection.set(a.section, a);
  }

  const avgScore = latestAssessmentBySection.size === 0
    ? null
    : Math.round(
        [...latestAssessmentBySection.values()].reduce((s, a) => s + a.score, 0) /
        latestAssessmentBySection.size
      );

  const completedModules = user.modules.filter(m => m.status === "completed").length;
  const startedModules = user.modules.filter(m => m.status === "started").length;

  const lastSession = user.sessions[0];
  const answersByQuestion = new Map(user.answers.map(a => [a.questionId, a]));

  // Group answers by section
  const sections = SECTIONS.map(s => ({
    section: s,
    rows: s.questionIds
      .map(qid => ({ q: QUESTION_BY_ID[qid], a: answersByQuestion.get(qid) }))
      .filter(r => r.q),
  }));

  return (
    <>
      <PageHeader
        title={user.fullName || user.email}
        subtitle={user.email}
        actions={
          <>
            <Link
              href="/admin/users"
              className="px-3 py-2 text-sm rounded-md border border-[#EFE6D2] text-hive-grey hover:bg-[#FAF3E2]"
            >
              ← All founders
            </Link>
            <UserActions userId={user.id} email={user.email} />
          </>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <Stat
          label="Avg score"
          value={avgScore ?? "—"}
          hint={`${latestAssessmentBySection.size} sections scored`}
        />
        <Stat
          label="Progress"
          value={lastSession?.submitted ? "Submitted" : lastSession?.currentStep ?? "—"}
          hint={lastSession?.submittedAt ? fmtDate(lastSession.submittedAt) : ""}
        />
        <Stat label="Modules done" value={completedModules} hint={`${startedModules} in progress`} />
        <Stat label="Stage" value={user.stage || "—"} hint={user.startupName || ""} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <Card title="Profile">
          <dl className="text-sm space-y-2">
            <Row label="Email" value={user.email} />
            <Row label="Full name" value={user.fullName || "—"} />
            <Row label="Phone" value={user.phone || "—"} />
            <Row label="Address" value={user.address || "—"} />
            <Row label="Startup" value={user.startupName || "—"} />
            <Row label="Stage" value={user.stage || "—"} />
            <Row label="Industries" value={
              (() => {
                const inds = tryParse<string[]>(user.industries);
                if (!inds || !Array.isArray(inds) || inds.length === 0) return "—";
                return inds.join(", ");
              })()
            } />
            <Row label="Joined" value={fmtDate(user.createdAt)} />
            <Row label="Last seen" value={fmtDate(user.lastSeenAt)} />
          </dl>
        </Card>

        <Card title="IRL scores" subtitle="Latest assessment per section" className="lg:col-span-2">
          {latestAssessmentBySection.size === 0 ? (
            <EmptyState title="No assessments yet" />
          ) : (
            <Table>
              <thead>
                <tr>
                  <Th>Section</Th>
                  <Th>Score</Th>
                  <Th>Diagnosis</Th>
                  <Th>Gap tags</Th>
                  <Th>Scored</Th>
                </tr>
              </thead>
              <tbody>
                {[...latestAssessmentBySection.values()]
                  .sort((a, b) => a.section.localeCompare(b.section))
                  .map(a => {
                    const tags = tryParse<string[]>(a.gapTags) || [];
                    return (
                      <tr key={a.id}>
                        <Td className="font-medium">{a.section.toUpperCase()}</Td>
                        <Td>
                          <Pill tone={a.score >= 65 ? "ok" : a.score >= 40 ? "warn" : "danger"}>
                            {a.score}
                          </Pill>
                        </Td>
                        <Td className="text-hive-grey max-w-[360px]">{a.diagnosis}</Td>
                        <Td>
                          <div className="flex flex-wrap gap-1">
                            {tags.slice(0, 4).map(t => (
                              <code key={t} className="text-[10px] bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded">
                                {t}
                              </code>
                            ))}
                            {tags.length > 4 && (
                              <span className="text-[10px] text-hive-grey">+{tags.length - 4}</span>
                            )}
                          </div>
                        </Td>
                        <Td className="text-hive-grey text-xs">{fmtDate(a.createdAt)}</Td>
                      </tr>
                    );
                  })}
              </tbody>
            </Table>
          )}
        </Card>
      </div>

      <Card title="Module progress" className="mb-4">
        {user.modules.length === 0 ? (
          <EmptyState title="No modules suggested or started yet" />
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>Module</Th>
                <Th>Status</Th>
                <Th>Beat</Th>
                <Th>Started</Th>
                <Th>Completed</Th>
              </tr>
            </thead>
            <tbody>
              {user.modules.map(m => (
                <tr key={m.id}>
                  <Td className="font-mono text-xs">{m.moduleId}</Td>
                  <Td>
                    <Pill tone={
                      m.status === "completed" ? "ok"
                      : m.status === "started" ? "warn"
                      : m.status === "skipped" ? "danger"
                      : "neutral"
                    }>{m.status}</Pill>
                  </Td>
                  <Td>{m.beatIndex}</Td>
                  <Td className="text-hive-grey">{fmtDate(m.startedAt)}</Td>
                  <Td className="text-hive-grey">{fmtDate(m.completedAt)}</Td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>

      <Card title="All answers" subtitle="Questionnaire responses, grouped by section">
        {sections.map(({ section, rows }) => {
          const answered = rows.filter(r => r.a).length;
          if (answered === 0) return null;
          return (
            <details key={section.id} className="mb-3 border border-[#F4ECD9] rounded-lg">
              <summary className="px-4 py-2.5 cursor-pointer text-sm font-medium hover:bg-[#FAF3E2]">
                {section.title}
                <span className="ml-2 text-xs text-hive-grey">
                  {answered}/{rows.length} answered
                </span>
              </summary>
              <div className="px-4 py-3 border-t border-[#F4ECD9] space-y-3">
                {rows.map(({ q, a }) => (
                  <div key={q.id} className="text-sm">
                    <div className="text-xs text-hive-grey mb-1">
                      {q.number ? `Q${q.number} · ` : ""}{q.label}
                    </div>
                    <div>
                      {a ? renderAnswerValue(a.value) : <span className="text-hive-grey italic">Not answered</span>}
                    </div>
                  </div>
                ))}
              </div>
            </details>
          );
        })}
      </Card>
    </>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-[#F8F1E0] pb-1.5 last:border-0">
      <dt className="text-xs uppercase tracking-wider text-hive-grey">{label}</dt>
      <dd className="text-right text-hive-dark max-w-[60%] truncate">{value}</dd>
    </div>
  );
}
