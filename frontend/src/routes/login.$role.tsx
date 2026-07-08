import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { BrandLogo } from "@/components/brand-logo";
import { ROLE_META, attemptLogin, setSession, type UserRole } from "@/lib/auth";

const VALID: UserRole[] = ["director", "tpa", "receptionist", "sister", "rmo"];

export const Route = createFileRoute("/login/$role")({
  beforeLoad: ({ params }) => {
    if (!VALID.includes(params.role as UserRole)) throw notFound();
  },
  component: LoginRole,
});

function LoginRole() {
  const { role } = Route.useParams();
  const roleKey = role as UserRole;
  const meta = ROLE_META[roleKey];
  const nav = useNavigate();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const backTo = ["receptionist", "sister", "rmo"].includes(roleKey) ? "/login/reception" : "/login";

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = attemptLogin(name, password, roleKey);
    if (!res.ok) { setError(res.reason); return; }
    setSession(res.user);
    nav({ to: "/app/$role", params: { role: roleKey } });
  }

  return (
    <main className="grid min-h-screen grid-cols-1 md:grid-cols-[1.05fr_1fr]">
      {/* Left — quiet panel */}
      <section className="hidden bg-[color:var(--sidebar)] p-14 text-white md:flex md:flex-col md:justify-between">
        <BrandLogo size="lg" tone="light" />
        <div>
          <div className="text-[10px] uppercase tracking-[0.22em] text-white/50">
            {meta.title}
          </div>
          <h1 className="serif-display mt-3 text-[46px] leading-tight text-white">
            {meta.short}
          </h1>
          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-white/70">
            {meta.blurb}
          </p>
        </div>
        <div className="text-xs text-white/40">MEDSTAR Multispeciality Hospital · Internal Portal</div>
      </section>

      {/* Right — form */}
      <section className="flex flex-col bg-background px-6 py-10 md:px-14 md:py-16">
        <div className="mb-8 flex items-center justify-between md:hidden">
          <BrandLogo size="sm" />
          <Link to={backTo} className="text-xs text-muted-foreground">← Back</Link>
        </div>
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center">
          <div className="hidden md:block">
            <Link to={backTo} className="text-xs text-muted-foreground hover:text-foreground">← Back</Link>
          </div>
          <div className="mt-8">
            <div className="eyebrow">Sign in</div>
            <h2 className="serif-display mt-3 text-3xl">Welcome back.</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Only active employees created by the Director may log in.
            </p>
          </div>

          <form onSubmit={onSubmit} className="mt-10 space-y-5">
            <FormField label="Full Name">
              <input
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={roleKey === "director" ? "Dr. Arvind Rao" : roleKey === "tpa" ? "Neha Iyer" : roleKey === "receptionist" ? "Priya Suresh" : roleKey === "sister" ? "Sister Anita" : "Dr. Vinay Bhat"}
                className="input"
              />
            </FormField>
            <FormField label="Password">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input"
              />
            </FormField>

            <div className="flex items-center justify-between text-xs">
              <label className="inline-flex items-center gap-2 text-muted-foreground">
                <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="h-3.5 w-3.5 accent-[color:var(--primary)]" />
                Remember me
              </label>
              <a className="text-muted-foreground hover:text-foreground" href="#">Forgot password?</a>
            </div>

            {error && <div className="rounded-md border border-[color:var(--destructive)]/30 bg-[color:var(--destructive)]/5 px-3 py-2 text-xs text-[color:var(--destructive)]">{error}</div>}

            <button type="submit" className="w-full rounded-md bg-[color:var(--sidebar)] py-3 text-sm font-medium text-white transition hover:bg-[oklch(0.22_0.012_45)]">
              Log in
            </button>

            <div className="pt-2 text-[11px] text-muted-foreground">
              Demo: any active employee name for this role (e.g. <code>{roleKey === "director" ? "Dr. Arvind Rao" : roleKey === "tpa" ? "Neha Iyer" : roleKey === "receptionist" ? "Priya Suresh" : roleKey === "sister" ? "Sister Anita" : "Dr. Vinay Bhat"}</code>) with password <code>medstar</code>.
            </div>
          </form>
        </div>
      </section>

      <style>{`
        .input { width: 100%; border: 1px solid var(--color-hairline); background: var(--color-card); border-radius: 8px; padding: 12px 14px; font-size: 14px; outline: none; color: var(--color-foreground); }
        .input::placeholder { color: var(--color-muted-foreground); }
        .input:focus { border-color: var(--color-primary); box-shadow: 0 0 0 4px oklch(0.52 0.024 145 / 0.08); }
      `}</style>
    </main>
  );
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">{label}</div>
      {children}
    </div>
  );
}
