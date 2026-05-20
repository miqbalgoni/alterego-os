import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getCurrentAdmin, isSuperAdminRole } from "@/lib/admin";
import { Card, PageHeader, Pill, Table, Th, Td, EmptyState } from "../_components/AdminUI";
import { AdminsManager } from "./_AdminsManager";
import { RoleActionsClient } from "./_RoleActionsClient";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const me = await getCurrentAdmin();
  if (!me || !isSuperAdminRole(me.role)) redirect("/admin");

  const admins = await prisma.user.findMany({
    where: { role: { in: ["ADMIN", "SUPERADMIN"] } },
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      email: true,
      fullName: true,
      role: true,
      createdAt: true,
      lastSeenAt: true,
    },
  });

  const envEmails = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map(s => s.trim().toLowerCase())
    .filter(Boolean);

  return (
    <>
      <PageHeader
        title="Admins"
        subtitle="Manage who has admin or super-admin access. Super-admin only."
      />

      <Card title="Bootstrap (env)" subtitle="ADMIN_EMAILS env var — these emails are auto-promoted to SUPERADMIN on every sign-in." className="mb-4">
        {envEmails.length === 0 ? (
          <div className="text-sm text-hive-grey">
            No emails in <code>ADMIN_EMAILS</code>. Set it in your .env.local (comma-separated) so the first admin can sign in.
          </div>
        ) : (
          <div className="flex flex-wrap gap-1">
            {envEmails.map(e => (
              <code key={e} className="text-xs bg-[#FAF3E2] px-2 py-1 rounded text-hive-dark">{e}</code>
            ))}
          </div>
        )}
      </Card>

      <Card title="Current admins" subtitle={`${admins.length} total`} className="mb-4">
        {admins.length === 0 ? (
          <EmptyState title="No admins yet" />
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>Email</Th>
                <Th>Name</Th>
                <Th>Role</Th>
                <Th>Joined</Th>
                <Th>Last seen</Th>
                <Th></Th>
              </tr>
            </thead>
            <tbody>
              {admins.map(a => (
                <tr key={a.id}>
                  <Td className="font-medium">{a.email}</Td>
                  <Td>{a.fullName || "—"}</Td>
                  <Td>
                    <Pill tone={a.role === "SUPERADMIN" ? "brand" : "ok"}>{a.role}</Pill>
                  </Td>
                  <Td className="text-hive-grey text-xs">{new Date(a.createdAt).toLocaleDateString()}</Td>
                  <Td className="text-hive-grey text-xs">
                    {a.lastSeenAt ? new Date(a.lastSeenAt).toLocaleString() : "—"}
                  </Td>
                  <Td>
                    {a.id !== me.id && (
                      <RoleActions userId={a.id} role={a.role} />
                    )}
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>

      <Card title="Promote a founder" subtitle="The user must already have an account.">
        <AdminsManager />
      </Card>
    </>
  );
}

function RoleActions({ userId, role }: { userId: string; role: string }) {
  return <RoleActionsClient userId={userId} role={role} />;
}
