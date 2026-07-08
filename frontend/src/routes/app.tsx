import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getSession, type SessionUser } from "@/lib/auth";

export const Route = createFileRoute("/app")({
  component: AppLayout,
});

function AppLayout() {
  const [ready, setReady] = useState(false);
  const [, setLocalSession] = useState<SessionUser | null>(null);

  useEffect(() => {
    const s = getSession();
    if (!s) {
      window.location.replace("/login");
      return;
    }
    setLocalSession(s);
    setReady(true);
  }, []);

  if (!ready) {
    return (
      <div className="grid min-h-screen place-items-center bg-background">
        <div className="text-sm text-muted-foreground">Preparing your workspace…</div>
      </div>
    );
  }
  return <Outlet />;
}
