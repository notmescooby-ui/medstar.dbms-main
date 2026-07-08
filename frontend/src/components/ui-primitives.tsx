import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/* --------- Page header --------- */
export function PageHeader({
  eyebrow, title, description, actions,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <header className="flex flex-col gap-3 border-b border-hairline pb-8 md:flex-row md:items-end md:justify-between">
      <div>
        {eyebrow && <div className="eyebrow mb-3">{eyebrow}</div>}
        <h1 className="serif-display text-[38px] leading-tight md:text-[46px]">{title}</h1>
        {description && (
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </header>
  );
}

/* --------- Summary tile (no charts) --------- */
export function SummaryTile({
  label, value, hint, accent,
}: { label: string; value: string | number; hint?: string; accent?: "gold" | "sage" }) {
  return (
    <div className="group relative flex flex-col justify-between rounded-lg border border-hairline bg-card p-6 transition-shadow hover:shadow-[var(--shadow-quiet)]">
      <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </div>
      <div className="mt-8 flex items-baseline gap-2">
        <div className="serif-display text-[42px] leading-none text-foreground">{value}</div>
        {accent && (
          <span
            className={cn(
              "h-1.5 w-1.5 rounded-full",
              accent === "gold" ? "bg-[color:var(--gold)]" : "bg-[color:var(--primary)]",
            )}
          />
        )}
      </div>
      {hint && <div className="mt-4 text-xs text-muted-foreground">{hint}</div>}
    </div>
  );
}

/* --------- Section --------- */
export function Section({
  title, description, action, children,
}: { title: string; description?: string; action?: ReactNode; children: ReactNode }) {
  return (
    <section className="mt-14">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-[15px] font-semibold text-foreground">{title}</h2>
          {description && <p className="mt-1 text-xs text-muted-foreground">{description}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

/* --------- Status chip --------- */
type ChipTone = "neutral" | "success" | "warning" | "danger" | "gold" | "sage" | "info";
export function Chip({ label, tone = "neutral" }: { label: string; tone?: ChipTone }) {
  const styles: Record<ChipTone, string> = {
    neutral: "bg-secondary text-secondary-foreground",
    success: "bg-[color:var(--success)]/10 text-[color:var(--success)]",
    warning: "bg-[color:var(--warning)]/12 text-[color:oklch(0.42_0.08_70)]",
    danger:  "bg-[color:var(--destructive)]/10 text-[color:var(--destructive)]",
    gold:    "bg-[color:var(--gold)]/15 text-[color:oklch(0.35_0.05_75)]",
    sage:    "bg-[color:var(--primary)]/10 text-[color:var(--primary)]",
    info:    "bg-[oklch(0.9_0.02_240)] text-[oklch(0.35_0.08_240)]",
  };
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium tracking-tight", styles[tone])}>
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {label}
    </span>
  );
}

/* --------- Data table --------- */
export function DataTable<T>({
  columns, rows, empty,
}: {
  columns: { key: string; header: string; render?: (row: T) => ReactNode; className?: string }[];
  rows: T[];
  empty?: string;
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-hairline bg-card">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-hairline text-left text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              {columns.map((c) => (
                <th key={c.key} className={cn("px-5 py-3.5 font-semibold", c.className)}>{c.header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr><td colSpan={columns.length} className="px-5 py-10 text-center text-sm text-muted-foreground">{empty ?? "Nothing here yet."}</td></tr>
            )}
            {rows.map((row, i) => (
              <tr key={i} className="border-b border-hairline/70 last:border-b-0 transition-colors hover:bg-secondary/60">
                {columns.map((c) => (
                  <td key={c.key} className={cn("px-5 py-4 align-top text-foreground/90", c.className)}>
                    {c.render ? c.render(row) : String((row as Record<string, unknown>)[c.key] ?? "")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
