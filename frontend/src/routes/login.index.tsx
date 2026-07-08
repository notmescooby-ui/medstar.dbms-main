import { createFileRoute, Link } from "@tanstack/react-router";
import { BrandLogo } from "@/components/brand-logo";
import { Building2, ShieldCheck, Briefcase } from "lucide-react";

export const Route = createFileRoute("/login/")({
  component: LoginIndex,
});

const CARDS = [
  { key: "director", to: "/login/director", title: "Director", note: "Executive oversight of the hospital.", icon: Briefcase },
  { key: "reception", to: "/login/reception", title: "Reception", note: "Front desk, nursing and clinical floor.", icon: Building2 },
  { key: "tpa", to: "/login/tpa", title: "TPA", note: "Insurance desk — claims and approvals.", icon: ShieldCheck },
] as const;

function LoginIndex() {
  return (
    <main className="flex min-h-screen flex-col bg-background">
      <header className="border-b border-hairline">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between px-6 py-6 md:px-10">
          <BrandLogo size="md" />
          <Link to="/" className="text-xs text-muted-foreground hover:text-foreground">← Back</Link>
        </div>
      </header>
      <section className="mx-auto flex w-full max-w-[1100px] flex-1 flex-col justify-center px-6 py-16 md:px-10">
        <div className="max-w-2xl">
          <div className="eyebrow">Sign in</div>
          <h1 className="serif-display mt-3 text-[44px] leading-tight">Choose your department.</h1>
          <p className="mt-3 text-[15px] text-muted-foreground">Every department has its own workspace, roster and audit trail.</p>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {CARDS.map((c) => (
            <Link
              key={c.key}
              to={c.to}
              className="group flex flex-col justify-between rounded-lg border border-hairline bg-card p-8 transition hover:border-[color:var(--primary)]/40 hover:shadow-[var(--shadow-quiet)]"
            >
              <div className="grid h-12 w-12 place-items-center rounded-md border border-hairline text-[color:var(--primary)]">
                <c.icon className="h-5 w-5" />
              </div>
              <div className="mt-24">
                <div className="eyebrow">Department</div>
                <div className="serif-display mt-2 text-3xl">{c.title}</div>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{c.note}</p>
              </div>
              <div className="mt-8 flex items-center text-xs font-medium text-[color:var(--primary)]">
                Continue <span className="ml-2 transition-transform group-hover:translate-x-0.5">→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
