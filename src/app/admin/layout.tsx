import { redirect } from "next/navigation";
import { headers } from "next/headers";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { isAdminRole, isSuperAdminRole } from "@/lib/admin";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  MessagesSquare,
  Sliders,
  Download,
  ShieldCheck,
  LogOut,
  Cog,
} from "lucide-react";
import { AdminSignOutButton } from "./_components/AdminSignOutButton";

export const metadata = {
  title: "ALTEREGO OS — Admin",
};

const NAV = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/admin/users", label: "Founders", icon: Users },
  { href: "/admin/knowledge", label: "Knowledge base", icon: BookOpen },
  { href: "/admin/chat-logs", label: "AskMe logs", icon: MessagesSquare },
  { href: "/admin/rubric", label: "Rubric", icon: Sliders },
  { href: "/admin/exports", label: "Exports", icon: Download },
  { href: "/admin/audit", label: "Audit log", icon: ShieldCheck, superOnly: true },
  { href: "/admin/settings", label: "Admins", icon: Cog, superOnly: true },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // /admin/login renders standalone (no sidebar, no auth check) so non-admins
  // can reach the staff sign-in form. Middleware sets x-pathname for us.
  const pathname = headers().get("x-pathname") || "";
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const user = await getCurrentUser();
  if (!user) redirect("/admin/login?next=/admin");
  if (!isAdminRole(user.role)) {
    // Logged in but not an admin — bounce to onboarding rather than leak existence of /admin
    redirect("/onboarding");
  }
  const isSuper = isSuperAdminRole(user.role);

  return (
    <div className="min-h-dvh flex bg-[#FAF7F1] text-hive-dark">
      <aside className="w-60 shrink-0 bg-[#1F1A14] text-[#F5EEDD] flex flex-col">
        <div className="px-5 py-5 border-b border-white/10">
          <div className="text-xs uppercase tracking-[0.18em] text-hive-orange/80">ALTEREGO OS</div>
          <div className="text-lg font-semibold leading-tight">Admin</div>
        </div>
        <nav className="flex-1 px-2 py-3 space-y-0.5">
          {NAV.filter(n => !n.superOnly || isSuper).map(item => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-2.5 px-3 py-2 rounded-md text-sm text-[#E8DFCB] hover:bg-white/5 hover:text-white transition-colors"
              >
                <Icon size={16} className="text-hive-orange" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="px-3 py-3 border-t border-white/10 text-xs">
          <div className="px-2 pb-2 text-[#C9BFA8]">
            <div className="truncate font-medium text-white/90">{user.fullName || user.email}</div>
            <div className="truncate text-[10px] uppercase tracking-wider text-hive-orange/90">
              {user.role}
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Link
              href="/onboarding"
              className="flex-1 text-center px-2 py-1.5 rounded-md hover:bg-white/5 text-[#E8DFCB]"
            >
              Founder app
            </Link>
            <AdminSignOutButton />
          </div>
        </div>
      </aside>
      <main className="flex-1 min-w-0 overflow-x-hidden">
        <div className="px-8 py-7 max-w-[1400px]">{children}</div>
      </main>
    </div>
  );
}
