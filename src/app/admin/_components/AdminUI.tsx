import { ReactNode } from "react";

export function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-semibold text-hive-dark tracking-tight">{title}</h1>
        {subtitle && <p className="text-sm text-hive-grey mt-1">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

export function Card({
  title,
  subtitle,
  actions,
  children,
  className = "",
}: {
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`bg-white border border-[#EFE6D2] rounded-xl shadow-sm ${className}`}
    >
      {(title || actions) && (
        <header className="flex items-center justify-between gap-3 px-5 py-3.5 border-b border-[#F4ECD9]">
          <div>
            {title && <h2 className="text-sm font-semibold text-hive-dark">{title}</h2>}
            {subtitle && <p className="text-xs text-hive-grey mt-0.5">{subtitle}</p>}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </header>
      )}
      <div className="p-5">{children}</div>
    </section>
  );
}

export function Stat({
  label,
  value,
  delta,
  hint,
}: {
  label: string;
  value: ReactNode;
  delta?: ReactNode;
  hint?: string;
}) {
  return (
    <div className="bg-white border border-[#EFE6D2] rounded-xl px-5 py-4 shadow-sm">
      <div className="text-xs uppercase tracking-wider text-hive-grey">{label}</div>
      <div className="mt-1 flex items-baseline gap-2">
        <div className="text-2xl font-semibold text-hive-dark tabular-nums">{value}</div>
        {delta && <div className="text-xs text-hive-orange font-medium">{delta}</div>}
      </div>
      {hint && <div className="text-[11px] text-hive-grey mt-1">{hint}</div>}
    </div>
  );
}

export function Pill({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "warn" | "ok" | "danger" | "brand";
}) {
  const tones: Record<string, string> = {
    neutral: "bg-[#F4ECD9] text-hive-dark",
    warn: "bg-amber-50 text-amber-700 border border-amber-200",
    ok: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    danger: "bg-rose-50 text-rose-700 border border-rose-200",
    brand: "bg-hive-orange/15 text-hive-amber border border-hive-orange/30",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 text-[11px] font-medium rounded-full ${tones[tone]}`}>
      {children}
    </span>
  );
}

export function Table({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">{children}</table>
    </div>
  );
}

export function Th({ children, className = "" }: { children?: ReactNode; className?: string }) {
  return (
    <th className={`text-left text-xs font-semibold uppercase tracking-wider text-hive-grey px-3 py-2 border-b border-[#F4ECD9] ${className}`}>
      {children}
    </th>
  );
}

export function Td({ children, className = "" }: { children?: ReactNode; className?: string }) {
  return (
    <td className={`px-3 py-2.5 border-b border-[#F8F1E0] text-hive-dark align-middle ${className}`}>
      {children}
    </td>
  );
}

export function EmptyState({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="text-center py-12 text-hive-grey">
      <div className="font-medium text-hive-dark">{title}</div>
      {hint && <div className="text-sm mt-1">{hint}</div>}
    </div>
  );
}
