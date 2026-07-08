import { createFileRoute, Link } from "@tanstack/react-router";
import { BrandLogo } from "@/components/brand-logo";

export const Route = createFileRoute("/login/reception")({
  component: LoginReception,
});

const OPTIONS = [
  { key: "receptionist", title: "Receptionist", note: "Admissions, rooms, billing tracker and rosters." },
  { key: "sister", title: "Sister", note: "Nursing station — vitals, indents, handovers." },
  { key: "rmo", title: "RMO", note: "Resident Medical Officer — clinical notes and rounds." },
] as const;

function LoginReception() {
  return (
    <main className="flex min-h-screen flex-col bg-background">
      <header className="border-b border-hairline">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between px-6 py-6 md:px-10">
          <BrandLogo size="md" />
          <Link to="/login" className="text-xs text-muted-foreground hover:text-foreground">← Departments</Link>
        </div>
      </header>
      <section className="mx-auto flex w-full max-w-[1100px] flex-1 flex-col justify-center px-6 py-16 md:px-10">
        <div className="max-w-2xl">
          <div className="eyebrow">Reception · Sign in</div>
          <h1 className="serif-display mt-3 text-[44px] leading-tight">Which team are you on?</h1>
          <p className="mt-3 text-[15px] text-muted-foreground">Reception, nursing and clinical staff share the same building but live in different workspaces.</p>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {OPTIONS.map((o) => (
            <Link
              key={o.key}
              to="/login/$role"
              params={{ role: o.key }}
              className="group flex flex-col justify-between rounded-lg border border-hairline bg-card p-8 transition hover:border-[color:var(--primary)]/40 hover:shadow-[var(--shadow-quiet)]"
            >
              <div>
                <div className="eyebrow">Role</div>
                <div className="serif-display mt-2 text-3xl">{o.title}</div>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{o.note}</p>
              </div>
              <div className="mt-16 flex items-center text-xs font-medium text-[color:var(--primary)]">
                Continue <span className="ml-2 transition-transform group-hover:translate-x-0.5">→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
