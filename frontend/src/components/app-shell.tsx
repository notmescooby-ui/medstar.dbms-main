import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { LogOut, Menu, X, Search, Bell } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { BrandLogo } from "@/components/brand-logo";
import { ROLE_META, clearSession, type SessionUser, type UserRole } from "@/lib/auth";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

export interface NavItem {
  label: string;
  slug: string;   // "" for dashboard index
  icon: LucideIcon;
  group?: string;
}

interface AppShellProps {
  user: SessionUser;
  role: UserRole;
  nav: NavItem[];
  children: ReactNode;
}

export function AppShell({ user, role, nav, children }: AppShellProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const meta = ROLE_META[role];

  useEffect(() => setMobileOpen(false), [location.pathname]);

  function signOut() {
    clearSession();
    navigate({ to: "/" });
  }

  // Group items
  const groups = nav.reduce<Record<string, NavItem[]>>((acc, item) => {
    const g = item.group ?? "";
    (acc[g] ||= []).push(item);
    return acc;
  }, {});

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-[264px] flex-col bg-sidebar text-sidebar-foreground transition-transform duration-300 lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between px-6 pt-7 pb-6">
          <BrandLogo size="md" tone="light" as="link" />
          <button
            onClick={() => setMobileOpen(false)}
            className="grid h-8 w-8 place-items-center rounded-md text-sidebar-muted lg:hidden"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mx-6 border-t border-sidebar-border" />

        <nav className="flex-1 overflow-y-auto px-3 pt-5 pb-6">
          {Object.entries(groups).map(([group, items]) => (
            <div key={group} className="mb-6 last:mb-0">
              {group && (
                <div className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-sidebar-muted">
                  {group}
                </div>
              )}
              <div className="space-y-0.5">
                {items.map((item) => {
                  const href = `/app/${role}${item.slug ? `/${item.slug}` : ""}`;
                  const active = location.pathname === href
                    || (item.slug === "" && location.pathname === `/app/${role}`);
                  return (
                    <Link
                      key={item.label}
                      to={href}
                      className={cn(
                        "group flex items-center gap-3 rounded-md px-3 py-2 text-[13.5px] font-medium transition-colors",
                        active
                          ? "bg-sidebar-accent text-white"
                          : "text-sidebar-foreground/85 hover:bg-sidebar-accent/60 hover:text-white",
                      )}
                    >
                      <item.icon className={cn("h-[15px] w-[15px] shrink-0", active ? "text-[color:var(--gold)]" : "text-sidebar-muted group-hover:text-sidebar-foreground")} />
                      <span className="truncate">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="mx-6 border-t border-sidebar-border" />
        <div className="px-6 py-5">
          <div className="text-[10px] uppercase tracking-[0.18em] text-sidebar-muted">Signed in</div>
          <div className="mt-1.5 text-[13.5px] font-medium text-white">{user.name}</div>
          <div className="text-xs text-sidebar-muted">{meta.title} · {user.department}</div>
          <button
            onClick={signOut}
            className="mt-4 inline-flex items-center gap-2 text-xs text-sidebar-muted hover:text-white"
          >
            <LogOut className="h-3.5 w-3.5" /> Sign out
          </button>
        </div>
      </aside>

      {/* Content */}
      <div className="flex min-w-0 flex-1 flex-col lg:pl-[264px]">
        <header className="sticky top-0 z-30 border-b border-hairline bg-background/85 backdrop-blur-md">
          <div className="flex items-center gap-3 px-6 py-4 md:px-10">
            <button
              onClick={() => setMobileOpen(true)}
              className="grid h-9 w-9 place-items-center rounded-md hairline lg:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-4 w-4" />
            </button>
            <div className="flex flex-1 items-center gap-3 rounded-md hairline bg-white px-3.5 py-2 text-sm text-muted-foreground md:max-w-md">
              <Search className="h-4 w-4" />
              <input
                placeholder="Search patients, rooms, claims…"
                className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground/70"
              />
              <kbd className="hidden rounded border border-hairline bg-secondary px-1.5 py-0.5 text-[10px] text-muted-foreground md:inline">
                ⌘K
              </kbd>
            </div>
            <div className="ml-auto flex items-center gap-3">
              <button className="relative grid h-9 w-9 place-items-center rounded-md hairline bg-white text-muted-foreground">
                <Bell className="h-4 w-4" />
                <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[color:var(--gold)]" />
              </button>
              <div className="hidden text-right md:block">
                <div className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                  {new Date().toLocaleDateString(undefined, { weekday: "long" })}
                </div>
                <div className="text-sm text-foreground">
                  {new Date().toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" })}
                </div>
              </div>
              <div className="grid h-9 w-9 place-items-center rounded-full bg-[color:var(--sidebar)] text-xs font-semibold text-white">
                {user.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
              </div>
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1200px] flex-1 px-6 pb-24 pt-10 md:px-10 animate-fade-up">
          {children}
        </main>
      </div>
    </div>
  );
}
