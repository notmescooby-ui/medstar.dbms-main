import { createFileRoute } from "@tanstack/react-router";
import { getSession, type UserRole } from "@/lib/auth";
import { DirectorDashboard, ReceptionistDashboard, SisterDashboard, RmoDashboard, TpaDashboard } from "@/modules/dashboards";

export const Route = createFileRoute("/app/$role/")({
  component: DashboardIndex,
});

function DashboardIndex() {
  const { role } = Route.useParams();
  const roleKey = role as UserRole;
  const user = getSession();
  if (!user) return null;
  switch (roleKey) {
    case "director": return <DirectorDashboard user={user} />;
    case "receptionist": return <ReceptionistDashboard user={user} />;
    case "sister": return <SisterDashboard user={user} />;
    case "rmo": return <RmoDashboard user={user} />;
    case "tpa": return <TpaDashboard user={user} />;
  }
  return null;
}
