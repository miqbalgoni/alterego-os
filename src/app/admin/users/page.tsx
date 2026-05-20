import Link from "next/link";
import { prisma } from "@/lib/db";
import { Card, PageHeader, Pill, Table, Th, Td, EmptyState } from "../_components/AdminUI";
import { UsersSearchBar } from "./_UsersSearchBar";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 25;

function fmtDate(d: Date | null | undefined) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString(undefined, {
    year: "numeric", month: "short", day: "numeric",
  });
}

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: { q?: string; page?: string; stage?: string; status?: string };
}) {
  const q = (searchParams.q || "").trim();
  const page = Math.max(1, parseInt(searchParams.page || "1", 10));
  const stage = searchParams.stage || "";
  const status = searchParams.status || ""; // "submitted" | "in-progress" | ""

  const where: any = {
    role: "FOUNDER",
  };
  if (q) {
    where.OR = [
      { email: { contains: q, mode: "insensitive" } },
      { fullName: { contains: q, mode: "insensitive" } },
      { startupName: { contains: q, mode: "insensitive" } },
    ];
  }
  if (stage) where.stage = stage;

  if (status === "submitted") {
    where.sessions = { some: { submitted: true } };
  } else if (status === "in-progress") {
    where.sessions = { some: { submitted: false } };
  }

  const [total, users] = await Promise.all([
    prisma.user.count({ where }),
    prisma.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      select: {
        id: true,
        email: true,
        fullName: true,
        startupName: true,
        stage: true,
        createdAt: true,
        lastSeenAt: true,
        sessions: {
          orderBy: { updatedAt: "desc" },
          take: 1,
          select: { currentStep: true, submitted: true, submittedAt: true, updatedAt: true },
        },
        _count: {
          select: { answers: true, assessments: true, modules: true },
        },
      },
    }),
  ]);

  // Latest score per user (avg of latest per section) — fetched once
  const userIds = users.map(u => u.id);
  const allAssessments = userIds.length === 0 ? [] : await prisma.irlAssessment.findMany({
    where: { userId: { in: userIds } },
    select: { userId: true, section: true, score: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });
  const latestByUserSection = new Map<string, number>();
  for (const a of allAssessments) {
    const k = `${a.userId}|${a.section}`;
    if (!latestByUserSection.has(k)) latestByUserSection.set(k, a.score);
  }
  const avgByUser = new Map<string, { avg: number; count: number }>();
  for (const [k, score] of latestByUserSection) {
    const userId = k.split("|")[0];
    const prev = avgByUser.get(userId) || { avg: 0, count: 0 };
    const newCount = prev.count + 1;
    avgByUser.set(userId, {
      avg: Math.round((prev.avg * prev.count + score) / newCount),
      count: newCount,
    });
  }

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <>
      <PageHeader
        title="Founders"
        subtitle={`${total.toLocaleString()} founder${total === 1 ? "" : "s"} in cohort`}
      />

      <Card className="mb-4">
        <UsersSearchBar initialQ={q} initialStage={stage} initialStatus={status} />
      </Card>

      <Card>
        {users.length === 0 ? (
          <EmptyState title="No founders found" hint="Try adjusting your filters." />
        ) : (
          <>
            <Table>
              <thead>
                <tr>
                  <Th>Founder</Th>
                  <Th>Startup</Th>
                  <Th>Stage</Th>
                  <Th>Progress</Th>
                  <Th>Avg score</Th>
                  <Th>Modules</Th>
                  <Th>Joined</Th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => {
                  const s = u.sessions[0];
                  const avg = avgByUser.get(u.id);
                  return (
                    <tr key={u.id} className="hover:bg-[#FFFBEE]">
                      <Td>
                        <Link href={`/admin/users/${u.id}`} className="block">
                          <div className="font-medium text-hive-amber hover:underline">
                            {u.fullName || u.email}
                          </div>
                          <div className="text-xs text-hive-grey">{u.email}</div>
                        </Link>
                      </Td>
                      <Td>{u.startupName || <span className="text-hive-grey">—</span>}</Td>
                      <Td>
                        {u.stage ? <Pill tone="neutral">{u.stage}</Pill> : <span className="text-hive-grey">—</span>}
                      </Td>
                      <Td>
                        {s ? (
                          s.submitted ? (
                            <Pill tone="ok">Submitted</Pill>
                          ) : (
                            <Pill tone="warn">{s.currentStep}</Pill>
                          )
                        ) : (
                          <Pill tone="neutral">—</Pill>
                        )}
                      </Td>
                      <Td>
                        {avg ? (
                          <span className="font-semibold tabular-nums">
                            {avg.avg}
                            <span className="text-xs text-hive-grey ml-1">/{avg.count}</span>
                          </span>
                        ) : (
                          <span className="text-hive-grey">—</span>
                        )}
                      </Td>
                      <Td className="tabular-nums">{u._count.modules}</Td>
                      <Td className="text-hive-grey">{fmtDate(u.createdAt)}</Td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
            <Pagination total={total} page={page} totalPages={totalPages} q={q} stage={stage} status={status} />
          </>
        )}
      </Card>
    </>
  );
}

function Pagination({
  total,
  page,
  totalPages,
  q,
  stage,
  status,
}: {
  total: number;
  page: number;
  totalPages: number;
  q: string;
  stage: string;
  status: string;
}) {
  const qs = (p: number) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (stage) params.set("stage", stage);
    if (status) params.set("status", status);
    if (p > 1) params.set("page", String(p));
    const s = params.toString();
    return s ? `?${s}` : "";
  };
  return (
    <div className="flex items-center justify-between mt-3 text-sm">
      <div className="text-hive-grey">
        Page {page} of {totalPages} · {total.toLocaleString()} total
      </div>
      <div className="flex gap-2">
        {page > 1 && (
          <Link
            href={`/admin/users${qs(page - 1)}`}
            className="px-3 py-1.5 rounded-md border border-[#EFE6D2] hover:bg-[#FAF3E2]"
          >
            ← Prev
          </Link>
        )}
        {page < totalPages && (
          <Link
            href={`/admin/users${qs(page + 1)}`}
            className="px-3 py-1.5 rounded-md border border-[#EFE6D2] hover:bg-[#FAF3E2]"
          >
            Next →
          </Link>
        )}
      </div>
    </div>
  );
}
