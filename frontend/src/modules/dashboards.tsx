import { Section, SummaryTile, PageHeader, Chip, DataTable } from "@/components/ui-primitives";
import {
  summary,
  notices,
  auditTrail,
  calendarEvents,
  handoverNotes,
  patients,
  indents,
  dutyRoster,
  claims,
  queries,
  rooms,
} from "@/lib/mock-data";
import type { SessionUser, UserRole } from "@/lib/auth";
import { ROLE_META } from "@/lib/auth";

/* Shared little pieces */
function DashboardHeader({ user, role }: { user: SessionUser; role: UserRole }) {
  const hour = new Date().getHours();
  const salutation = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const meta = ROLE_META[role];
  const first = user.name.replace(/^Dr\.?\s+/i, "").split(" ")[0];
  return (
    <PageHeader
      eyebrow={meta.title + " · Dashboard"}
      title={`${salutation}, ${first}.`}
      description={`Today at MEDSTAR — ${new Date().toLocaleDateString(undefined, {
        weekday: "long",
        month: "long",
        day: "numeric",
      })}. A quiet summary of what needs your attention.`}
    />
  );
}

function tileGrid<T>(items: T[], render: (t: T) => React.ReactNode) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">{items.map(render)}</div>
  );
}

/* --------- DIRECTOR --------- */
export function DirectorDashboard({ user }: { user: SessionUser }) {
  const tiles = [
    { label: "Admissions today", value: summary.admissionsToday, hint: "6 in the last hour" },
    { label: "Discharges today", value: summary.dischargesToday, hint: "3 pending paperwork" },
    {
      label: "Occupied beds",
      value: summary.occupiedBeds,
      hint: `${summary.vacantBeds} vacant across floors`,
    },
    {
      label: "Vacant beds",
      value: summary.vacantBeds,
      accent: "sage" as const,
      hint: "Ground · First · Second",
    },
    {
      label: "Pending insurance claims",
      value: summary.pendingClaims,
      accent: "gold" as const,
      hint: "4 documents requested",
    },
    {
      label: "Outstanding bills",
      value: summary.outstandingBills,
      hint: "Across 9 patient accounts",
    },
    {
      label: "Employees on duty",
      value: summary.employeesOnDuty,
      hint: "Morning shift · all departments",
    },
    {
      label: "Medical camps today",
      value: summary.medicalCampsToday,
      hint: "Community atrium — 9 AM to 2 PM",
    },
    { label: "Upcoming surgeries", value: summary.upcomingSurgeries, hint: "Next 48 hours" },
    { label: "Recent handovers", value: summary.recentHandovers, hint: "Last 24 hours" },
  ];
  return (
    <>
      <DashboardHeader user={user} role="director" />
      <Section title="At a glance" description="Numbers only — dedicated pages for detail.">
        {tileGrid(tiles, (t) => (
          <SummaryTile key={t.label} {...t} />
        ))}
      </Section>

      <Section
        title="Recent audit trail"
        description="Every consequential action across the hospital."
      >
        <DataTable
          columns={[
            { key: "at", header: "When", className: "w-40 text-muted-foreground" },
            { key: "user", header: "Who" },
            {
              key: "role",
              header: "Role",
              render: (r) => <Chip label={ROLE_META[r.role].title} tone="sage" />,
            },
            { key: "action", header: "Action" },
          ]}
          rows={auditTrail.slice(0, 6)}
        />
      </Section>

      <Section title="Recent handovers" description="Shift-to-shift context from wards.">
        <div className="grid gap-4 md:grid-cols-2">
          {handoverNotes.slice(0, 2).map((h) => (
            <div key={h.id} className="rounded-lg border border-hairline bg-card p-6">
              <div className="flex items-center justify-between">
                <div className="eyebrow">
                  {h.department} · {h.shift}
                </div>
                <span className="text-xs text-muted-foreground">{h.date}</span>
              </div>
              <p className="mt-3 whitespace-pre-line text-[14px] leading-relaxed text-foreground/90">
                {h.note}
              </p>
              <div className="mt-4 text-xs text-muted-foreground">— {h.author}</div>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}

/* --------- RECEPTIONIST --------- */
export function ReceptionistDashboard({ user }: { user: SessionUser }) {
  const tiles = [
    { label: "Today's admissions", value: summary.admissionsToday },
    { label: "Today's discharges", value: summary.dischargesToday },
    { label: "Pending billing", value: summary.pendingBilling, accent: "gold" as const },
    { label: "Vacant rooms", value: rooms.filter((r) => r.status === "Vacant").length },
    { label: "Occupied rooms", value: rooms.filter((r) => r.status === "Occupied").length },
    { label: "Rooms in cleaning", value: rooms.filter((r) => r.status === "Cleaning").length },
    { label: "Upcoming events", value: summary.todayEvents },
    { label: "Recent handovers", value: summary.recentHandovers },
  ];
  return (
    <>
      <DashboardHeader user={user} role="receptionist" />
      <Section title="Front desk">
        {tileGrid(tiles, (t) => (
          <SummaryTile key={t.label} {...t} />
        ))}
      </Section>

      <Section title="Quick actions" description="Common receptionist workflows.">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {["New admission", "Assign room", "Log payment", "Add handover"].map((a) => (
            <button
              key={a}
              className="rounded-lg border border-hairline bg-card p-5 text-left transition hover:shadow-[var(--shadow-quiet)]"
            >
              <div className="eyebrow mb-2">Action</div>
              <div className="text-[15px] font-medium">{a}</div>
            </button>
          ))}
        </div>
      </Section>

      <Section title="Upcoming events" description="From the hospital calendar.">
        <div className="rounded-lg border border-hairline bg-card">
          {calendarEvents.slice(0, 5).map((e, i) => (
            <div
              key={e.id}
              className={
                "flex items-center gap-4 px-6 py-4 " + (i > 0 ? "border-t border-hairline" : "")
              }
            >
              <span className={"h-2.5 w-2.5 rounded-full " + kindDot(e.kind)} />
              <div className="flex-1">
                <div className="text-[14px] font-medium">{e.title}</div>
                <div className="text-xs text-muted-foreground">
                  {e.location} · {e.time}
                </div>
              </div>
              <div className="text-xs text-muted-foreground">Day {e.day}</div>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}

function kindDot(k: string) {
  return (
    (
      {
        OT: "bg-[color:var(--destructive)]",
        Camp: "bg-[oklch(0.55_0.14_240)]",
        OPD: "bg-[color:var(--primary)]",
        Maintenance: "bg-[color:var(--warning)]",
        Leave: "bg-[oklch(0.55_0.14_300)]",
      } as Record<string, string>
    )[k] ?? "bg-muted-foreground"
  );
}
export { kindDot };

/* --------- SISTER --------- */
export function SisterDashboard({ user }: { user: SessionUser }) {
  const assigned = patients.filter((p) => p.ward !== "Discharged").slice(0, 4);
  const tiles = [
    { label: "Patients assigned", value: assigned.length },
    { label: "Pending tasks", value: 7, accent: "gold" as const },
    { label: "Pending indents", value: indents.filter((i) => i.status === "Pending").length },
    { label: "Upcoming shift", value: "Evening", hint: "14:00 – 22:00" },
    { label: "Today's events", value: summary.todayEvents },
    { label: "Recent handovers", value: summary.recentHandovers },
  ];
  return (
    <>
      <DashboardHeader user={user} role="sister" />
      <Section title="Your shift">
        {tileGrid(tiles, (t) => (
          <SummaryTile key={t.label} {...t} />
        ))}
      </Section>

      <Section title="Assigned patients">
        <DataTable
          columns={[
            { key: "uhid", header: "UHID", className: "w-32 text-muted-foreground" },
            { key: "name", header: "Name" },
            { key: "room", header: "Room" },
            { key: "diagnosis", header: "Diagnosis" },
            { key: "doctor", header: "Consultant" },
          ]}
          rows={assigned}
        />
      </Section>
    </>
  );
}

/* --------- RMO --------- */
export function RmoDashboard({ user }: { user: SessionUser }) {
  const tiles = [
    { label: "Assigned patients", value: 12 },
    { label: "Pending diagnoses", value: 3, accent: "gold" as const },
    { label: "Clinical notes today", value: 8 },
    { label: "Discharges pending review", value: 2 },
    { label: "Upcoming shift", value: "Night", hint: "22:00 – 06:00" },
    { label: "Recent handovers", value: summary.recentHandovers },
  ];
  return (
    <>
      <DashboardHeader user={user} role="rmo" />
      <Section title="Clinical floor">
        {tileGrid(tiles, (t) => (
          <SummaryTile key={t.label} {...t} />
        ))}
      </Section>

      <Section title="Active patients">
        <DataTable
          columns={[
            { key: "uhid", header: "UHID", className: "w-32 text-muted-foreground" },
            { key: "name", header: "Name" },
            { key: "room", header: "Room" },
            { key: "diagnosis", header: "Diagnosis" },
            {
              key: "critical",
              header: "Acuity",
              render: (p) =>
                p.critical ? (
                  <Chip label="Critical" tone="danger" />
                ) : (
                  <Chip label="Stable" tone="sage" />
                ),
            },
          ]}
          rows={patients.filter((p) => p.ward !== "Discharged").slice(0, 6)}
        />
      </Section>
    </>
  );
}

/* --------- TPA --------- */
export function TpaDashboard({ user }: { user: SessionUser }) {
  const tiles = [
    {
      label: "Pending claims",
      value: claims.filter((c) => c.status === "Pending").length,
      accent: "gold" as const,
    },
    { label: "Approved", value: claims.filter((c) => c.status === "Approved").length },
    { label: "Rejected", value: claims.filter((c) => c.status === "Rejected").length },
    { label: "Open queries", value: queries.filter((q) => q.status === "Open").length },
    { label: "Recent admissions", value: summary.admissionsToday },
    { label: "Recent discharges", value: summary.dischargesToday },
  ];
  return (
    <>
      <DashboardHeader user={user} role="tpa" />
      <Section title="Insurance desk">
        {tileGrid(tiles, (t) => (
          <SummaryTile key={t.label} {...t} />
        ))}
      </Section>

      <Section title="Active claims">
        <DataTable
          columns={[
            { key: "id", header: "Claim", className: "w-28" },
            { key: "patient", header: "Patient" },
            { key: "insurer", header: "Insurer" },
            {
              key: "amount",
              header: "Amount",
              render: (c) => "₹" + c.amount.toLocaleString("en-IN"),
            },
            {
              key: "status",
              header: "Status",
              render: (c) => <Chip label={c.status} tone={claimTone(c.status)} />,
            },
            { key: "updatedAt", header: "Updated", className: "text-muted-foreground" },
          ]}
          rows={claims}
        />
      </Section>
    </>
  );
}

export function claimTone(s: string) {
  return (
    (
      {
        Approved: "success",
        Pending: "warning",
        Rejected: "danger",
        "Documents Required": "gold",
        "Query Raised": "info",
      } as const
    )[s as "Approved"] ?? "neutral"
  );
}

/* --------- notice preview inside dashboards not required (routes exist) --------- */
export { notices, auditTrail, dutyRoster };
