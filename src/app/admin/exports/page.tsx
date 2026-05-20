import { PageHeader, Card } from "../_components/AdminUI";
import { Download } from "lucide-react";

export const dynamic = "force-dynamic";

const EXPORTS = [
  {
    href: "/api/admin/exports/users.csv",
    title: "Founders",
    desc: "Email, name, startup, stage, role, sign-up date, submission state.",
  },
  {
    href: "/api/admin/exports/assessments.csv",
    title: "Assessments",
    desc: "Every IRL assessment row — section, score, diagnosis, gap tags, rubric version.",
  },
  {
    href: "/api/admin/exports/answers.csv",
    title: "Answers",
    desc: "All questionnaire answers across all founders. Large file.",
  },
  {
    href: "/api/admin/exports/modules.csv",
    title: "Module progress",
    desc: "Per-founder module status and beat index.",
  },
  {
    href: "/api/admin/exports/chat-logs.csv",
    title: "AskMe logs",
    desc: "Every founder Q + AskMe reply with sources used and flag status.",
  },
];

export default function AdminExportsPage() {
  return (
    <>
      <PageHeader
        title="Exports"
        subtitle="Download CSV snapshots for offline analysis or sharing with HIVE staff. Every export is logged in the audit log."
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {EXPORTS.map(e => (
          <Card key={e.href} title={e.title} subtitle={e.desc}>
            <a
              href={e.href}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-sm rounded-md bg-hive-orange text-white font-medium hover:bg-hive-amber"
            >
              <Download size={14} /> Download CSV
            </a>
          </Card>
        ))}
      </div>
    </>
  );
}
