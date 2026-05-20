import Link from "next/link";
import { prisma } from "@/lib/db";
import { Card, PageHeader, Pill, Stat, Table, Th, Td, EmptyState } from "../_components/AdminUI";
import { FlagButton } from "./_FlagButton";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 30;

function fmtRelative(d: Date) {
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

export default async function AdminChatLogsPage({
  searchParams,
}: {
  searchParams: { page?: string; flagged?: string; q?: string };
}) {
  const page = Math.max(1, parseInt(searchParams.page || "1", 10));
  const flagged = searchParams.flagged === "1";
  const q = (searchParams.q || "").trim();

  const where: any = {};
  if (flagged) where.flagged = true;
  if (q) {
    where.OR = [
      { userMessage: { contains: q, mode: "insensitive" } },
      { assistantMessage: { contains: q, mode: "insensitive" } },
    ];
  }

  const [total, logs, totalAll, totalFlagged, totalNoSources] = await Promise.all([
    prisma.chatLog.count({ where }),
    prisma.chatLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: { user: { select: { id: true, email: true, fullName: true } } },
    }),
    prisma.chatLog.count(),
    prisma.chatLog.count({ where: { flagged: true } }),
    prisma.chatLog.count({ where: { ragSources: null } }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const ragMissPct = totalAll === 0 ? 0 : Math.round((totalNoSources / totalAll) * 100);

  return (
    <>
      <PageHeader
        title="AskMe logs"
        subtitle="Every founder question + AskMe's reply, with the knowledge sources used."
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <Stat label="Total turns" value={totalAll} />
        <Stat label="Flagged" value={totalFlagged} hint="Marked by admin for review" />
        <Stat label="No-RAG turns" value={totalNoSources} hint={`${ragMissPct}% had no doc match`} />
        <Stat label="Showing" value={total} hint="Current filters" />
      </div>

      <Card className="mb-4">
        <form className="flex items-center gap-2">
          <input
            name="q"
            defaultValue={q}
            placeholder="Search question or reply…"
            className="flex-1 px-3 py-2 text-sm rounded-md border border-[#EFE6D2] focus:outline-none focus:border-hive-orange"
          />
          <label className="flex items-center gap-1.5 text-sm text-hive-dark">
            <input type="checkbox" name="flagged" value="1" defaultChecked={flagged} />
            Flagged only
          </label>
          <button className="px-3 py-2 text-sm rounded-md bg-hive-orange text-white font-medium hover:bg-hive-amber">
            Filter
          </button>
        </form>
      </Card>

      {logs.length === 0 ? (
        <Card>
          <EmptyState title="No chat logs yet" hint="AskMe turns will appear here as founders use the assistant." />
        </Card>
      ) : (
        <div className="space-y-3">
          {logs.map(l => {
            const sources = tryJson<string[]>(l.ragSources) || [];
            return (
              <div
                key={l.id}
                className={`bg-white border rounded-xl p-4 ${l.flagged ? "border-rose-300" : "border-[#EFE6D2]"}`}
              >
                <div className="flex items-center justify-between mb-2 gap-2">
                  <div className="flex items-center gap-2 text-xs text-hive-grey">
                    {l.user ? (
                      <Link href={`/admin/users/${l.user.id}`} className="text-hive-amber hover:underline font-medium">
                        {l.user.fullName || l.user.email}
                      </Link>
                    ) : (
                      <span>Anonymous</span>
                    )}
                    <span>·</span>
                    <span>{fmtRelative(l.createdAt)}</span>
                    {l.locale && (
                      <>
                        <span>·</span>
                        <Pill tone="neutral">{l.locale}</Pill>
                      </>
                    )}
                    {sources.length > 0 ? (
                      <Pill tone="brand">{sources.length} source{sources.length === 1 ? "" : "s"}</Pill>
                    ) : (
                      <Pill tone="warn">no docs matched</Pill>
                    )}
                  </div>
                  <FlagButton id={l.id} flagged={l.flagged} />
                </div>
                <div className="text-sm text-hive-dark whitespace-pre-wrap mb-2">
                  <span className="text-xs uppercase tracking-wider text-hive-grey block mb-0.5">Founder</span>
                  {l.userMessage}
                </div>
                <div className="text-sm text-hive-dark whitespace-pre-wrap bg-[#FFFBEE] rounded-md p-3 border border-[#F4ECD9]">
                  <span className="text-xs uppercase tracking-wider text-hive-orange block mb-0.5">AskMe</span>
                  {l.assistantMessage}
                </div>
                {l.flagged && l.flagReason && (
                  <div className="mt-2 text-xs text-rose-700 italic">Flag note: {l.flagReason}</div>
                )}
              </div>
            );
          })}

          <Pagination total={total} page={page} totalPages={totalPages} q={q} flagged={flagged} />
        </div>
      )}
    </>
  );
}

function tryJson<T>(s: string | null): T | null {
  if (!s) return null;
  try { return JSON.parse(s) as T; } catch { return null; }
}

function Pagination({
  total, page, totalPages, q, flagged,
}: { total: number; page: number; totalPages: number; q: string; flagged: boolean }) {
  const qs = (p: number) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (flagged) params.set("flagged", "1");
    if (p > 1) params.set("page", String(p));
    const s = params.toString();
    return s ? `?${s}` : "";
  };
  return (
    <div className="flex items-center justify-between text-sm pt-2">
      <div className="text-hive-grey">Page {page} of {totalPages} · {total.toLocaleString()} total</div>
      <div className="flex gap-2">
        {page > 1 && <Link href={`/admin/chat-logs${qs(page - 1)}`} className="px-3 py-1.5 rounded-md border border-[#EFE6D2] hover:bg-[#FAF3E2]">← Prev</Link>}
        {page < totalPages && <Link href={`/admin/chat-logs${qs(page + 1)}`} className="px-3 py-1.5 rounded-md border border-[#EFE6D2] hover:bg-[#FAF3E2]">Next →</Link>}
      </div>
    </div>
  );
}
