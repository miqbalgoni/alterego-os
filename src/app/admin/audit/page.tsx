import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getCurrentAdmin, isSuperAdminRole } from "@/lib/admin";
import { Card, PageHeader, Pill, Table, Th, Td, EmptyState } from "../_components/AdminUI";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 50;

function fmt(d: Date) {
  return new Date(d).toLocaleString();
}

const ACTION_TONE: Record<string, "ok" | "warn" | "danger" | "brand" | "neutral"> = {
  "user.impersonate": "danger",
  "doc.delete": "danger",
  "rubric.update": "warn",
  "rubric.revert": "warn",
  "doc.upload": "ok",
  "doc.paste": "ok",
  "admin.promote": "brand",
  "admin.demote": "warn",
  "export.csv": "neutral",
};

export default async function AdminAuditPage({
  searchParams,
}: {
  searchParams: { page?: string; action?: string };
}) {
  const me = await getCurrentAdmin();
  if (!me || !isSuperAdminRole(me.role)) redirect("/admin");

  const page = Math.max(1, parseInt(searchParams.page || "1", 10));
  const action = searchParams.action || "";

  const where: any = {};
  if (action) where.action = action;

  const [total, logs, distinctActions] = await Promise.all([
    prisma.adminLog.count({ where }),
    prisma.adminLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: { admin: { select: { email: true, fullName: true } } },
    }),
    prisma.adminLog.findMany({
      distinct: ["action"],
      select: { action: true },
      orderBy: { action: "asc" },
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <>
      <PageHeader
        title="Audit log"
        subtitle="Every action taken in the admin UI. Read-only. Super-admin only."
      />

      <Card className="mb-4">
        <form className="flex items-center gap-2">
          <select
            name="action"
            defaultValue={action}
            className="px-3 py-2 text-sm rounded-md border border-[#EFE6D2] bg-white"
          >
            <option value="">All actions</option>
            {distinctActions.map(a => (
              <option key={a.action} value={a.action}>{a.action}</option>
            ))}
          </select>
          <button className="px-3 py-2 text-sm rounded-md bg-hive-orange text-white font-medium hover:bg-hive-amber">
            Filter
          </button>
        </form>
      </Card>

      <Card>
        {logs.length === 0 ? (
          <EmptyState title="No audit entries yet" hint="Admin actions will be logged here." />
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>When</Th>
                <Th>Admin</Th>
                <Th>Action</Th>
                <Th>Resource</Th>
                <Th>Details</Th>
              </tr>
            </thead>
            <tbody>
              {logs.map(l => (
                <tr key={l.id}>
                  <Td className="text-xs text-hive-grey whitespace-nowrap">{fmt(l.createdAt)}</Td>
                  <Td>{l.admin?.fullName || l.admin?.email || l.adminId}</Td>
                  <Td>
                    <Pill tone={ACTION_TONE[l.action] || "neutral"}>{l.action}</Pill>
                  </Td>
                  <Td className="text-xs">
                    {l.resourceType && (
                      <span className="text-hive-grey">{l.resourceType}</span>
                    )}
                    {l.resourceId && (
                      <>
                        {" · "}
                        {l.resourceType === "user" ? (
                          <Link href={`/admin/users/${l.resourceId}`} className="text-hive-amber hover:underline">{l.resourceId.slice(0, 10)}…</Link>
                        ) : (
                          <code className="text-[11px]">{l.resourceId.slice(0, 24)}</code>
                        )}
                      </>
                    )}
                  </Td>
                  <Td className="text-xs text-hive-grey max-w-[400px] truncate">
                    {l.metadata || ""}
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}

        <div className="flex items-center justify-between text-sm pt-3">
          <div className="text-hive-grey">Page {page} of {totalPages} · {total.toLocaleString()} total</div>
          <div className="flex gap-2">
            {page > 1 && (
              <Link
                href={`/admin/audit?${new URLSearchParams({ ...(action ? { action } : {}), page: String(page - 1) }).toString()}`}
                className="px-3 py-1.5 rounded-md border border-[#EFE6D2] hover:bg-[#FAF3E2]"
              >← Prev</Link>
            )}
            {page < totalPages && (
              <Link
                href={`/admin/audit?${new URLSearchParams({ ...(action ? { action } : {}), page: String(page + 1) }).toString()}`}
                className="px-3 py-1.5 rounded-md border border-[#EFE6D2] hover:bg-[#FAF3E2]"
              >Next →</Link>
            )}
          </div>
        </div>
      </Card>
    </>
  );
}
