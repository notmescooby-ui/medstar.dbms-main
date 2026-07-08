import { createFileRoute, Link } from "@tanstack/react-router";
import starLogo from "@/assets/medstar-star.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MEDSTAR — Hospital Operations System" },
      { name: "description", content: "Internal staff portal for MEDSTAR Multispeciality Hospital." },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <main className="relative flex min-h-screen items-center justify-center bg-background px-6">
      <div className="flex flex-col items-center text-center">
        <MedstarMark className="h-64 w-64" />
        <div className="mt-10 eyebrow">MEDSTAR Multispeciality Hospital</div>
        <h1 className="serif-display mt-4 text-[54px] leading-[1.05] md:text-[68px]">
          Hospital Operations System
        </h1>
        <p className="mt-5 max-w-md text-[15px] leading-relaxed text-muted-foreground">
          Internal staff portal.
        </p>
        <Link
          to="/login"
          className="mt-14 inline-flex items-center justify-center rounded-md bg-[color:var(--sidebar)] px-10 py-3.5 text-[14px] font-medium tracking-wide text-white transition hover:bg-[oklch(0.22_0.012_45)]"
        >
          Log in to continue
        </Link>
        <div className="mt-24 text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
          Authorised personnel only
        </div>
      </div>
    </main>
  );
}

function MedstarMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden>
      <image href={starLogo} x="0" y="0" width="32" height="32" />
    </svg>
  );
}
