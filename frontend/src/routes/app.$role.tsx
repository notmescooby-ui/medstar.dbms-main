import { createFileRoute, notFound, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getSession, type SessionUser, type UserRole } from "@/lib/auth";
import { AppShell } from "@/components/app-shell";
import { NAV_BY_ROLE } from "@/lib/nav";

const VALID: UserRole[] = ["director", "tpa", "receptionist", "sister", "rmo"];

export const Route = createFileRoute("/app/$role")({
  beforeLoad: ({ params }) => {
    if (!VALID.includes(params.role as UserRole)) throw notFound();
  },
  component: RoleLayout,
});

function RoleLayout() {
  const { role } = Route.useParams();
  const roleKey = role as UserRole;
  const nav = useNavigate();
  const [session, setSession] = useState<SessionUser | null>(null);

  useEffect(() => {
    const s = getSession();
    if (!s) {
      nav({ to: "/login", replace: true });
      return;
    }
    if (s.role !== roleKey) {
      nav({ to: "/app/$role", params: { role: s.role }, replace: true });
      return;
    }
    setSession(s);
  }, [nav, roleKey]);

  if (!session) return null;

  return (
    <AppShell user={session} role={roleKey} nav={NAV_BY_ROLE[roleKey]}>
      <Outlet />
    </AppShell>
  );
}
