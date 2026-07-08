import { createFileRoute, notFound } from "@tanstack/react-router";
import { getSession, type UserRole } from "@/lib/auth";
import { renderRolePage } from "@/modules/pages";

export const Route = createFileRoute("/app/$role/$page")({
  component: PageView,
});

function PageView() {
  const { role, page } = Route.useParams();
  const user = getSession();
  if (!user) return null;
  const node = renderRolePage(role as UserRole, page, user);
  if (!node) throw notFound();
  return <>{node}</>;
}
