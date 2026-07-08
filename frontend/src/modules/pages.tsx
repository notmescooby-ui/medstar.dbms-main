import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import {
  PageHeader, Section, SummaryTile, Chip, DataTable,
} from "@/components/ui-primitives";
import {
  patients, claims, notices, auditTrail, calendarEvents, handoverNotes,
  indents, dutyRoster, rooms, queries, documents, sampleVitals,
  updateRosterEntry, addHandoverNote,
} from "@/lib/mock-data";
import { employees, ROLE_META } from "@/lib/auth";
import type { SessionUser, UserRole } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { claimTone, kindDot } from "./dashboards";
import { ChevronLeft, ChevronRight, Plus, Search } from "lucide-react";

/* ============ PATIENTS (list + optional profile drawer) ============ */
export function PatientsPage() {
  const [selected, setSelected] = useState(patients[0]);
  const [q, setQ] = useState("");
  const filtered = patients.filter((p) =>
    (p.name + p.uhid + p.phone + p.room).toLowerCase().includes(q.toLowerCase()),
  );
  return (
    <>
      <PageHeader
        eyebrow="Patient Records"
        title="Patients"
        description="Every admitted patient at MEDSTAR. Search by UHID, name, phone or room."
        actions={
          <div className="flex items-center gap-2 rounded-md border border-hairline bg-white px-3 py-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search…" className="w-56 bg-transparent text-sm outline-none" />
          </div>
        }
      />
      <div className="mt-10 grid gap-8 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <div className="overflow-hidden rounded-lg border border-hairline bg-card">
            {filtered.map((p, i) => (
              <button
                key={p.id}
                onClick={() => setSelected(p)}
                className={cn(
                  "flex w-full items-center gap-4 border-b border-hairline/70 px-5 py-4 text-left transition last:border-b-0",
                  selected?.id === p.id ? "bg-secondary" : "hover:bg-secondary/60",
                )}
              >
                <div className="grid h-10 w-10 place-items-center rounded-full bg-secondary text-xs font-semibold text-foreground/70">
                  {p.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                </div>
                <div className="flex-1">
                  <div className="text-[14px] font-medium">{p.name}</div>
                  <div className="text-xs text-muted-foreground">{p.uhid} · {p.age}{p.gender} · Room {p.room}</div>
                </div>
                {p.critical ? <Chip label="Critical" tone="danger" /> : <Chip label={p.ward} tone="neutral" />}
              </button>
            ))}
          </div>
        </div>
        {selected && <PatientProfile patient={selected} />}
      </div>
    </>
  );
}

function PatientProfile({ patient }: { patient: typeof patients[number] }) {
  const p = patient;
  const tabs = ["Basic", "Admission", "Room", "Insurance", "Billing", "Documents", "Timeline", "Treatment", "Notes"] as const;
  const [tab, setTab] = useState<typeof tabs[number]>("Basic");
  return (
    <div className="sticky top-24 self-start rounded-lg border border-hairline bg-card">
      <div className="border-b border-hairline px-6 py-5">
        <div className="eyebrow mb-1">Patient Folder</div>
        <div className="serif-display text-2xl">{p.name}</div>
        <div className="mt-1 text-sm text-muted-foreground">{p.uhid} · {p.age}{p.gender} · {p.phone}</div>
      </div>
      <div className="flex flex-wrap gap-1 border-b border-hairline px-4 py-3">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "rounded-md px-3 py-1.5 text-xs font-medium",
              tab === t ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground",
            )}
          >{t}</button>
        ))}
      </div>
      <div className="px-6 py-5 text-sm leading-relaxed text-foreground/90">
        {tab === "Basic" && (
          <dl className="grid grid-cols-2 gap-y-3 text-sm">
            <Field k="Age / Gender" v={`${p.age} · ${p.gender === "F" ? "Female" : "Male"}`} />
            <Field k="Phone" v={p.phone} />
            <Field k="Ward" v={p.ward} />
            <Field k="Consultant" v={p.doctor} />
            <Field k="Diagnosis" v={p.diagnosis} />
            <Field k="Admitted" v={p.admittedAt} />
          </dl>
        )}
        {tab === "Admission" && <p>Admitted on <b>{p.admittedAt}</b> under <b>{p.doctor}</b>. Assigned to <b>{p.ward}</b> ward, Room <b>{p.room}</b>.</p>}
        {tab === "Room" && <p>Room <b>{p.room}</b> · {p.ward}. Housekeeping last visited this morning.</p>}
        {tab === "Insurance" && <p>{p.insurance ? <>Policy under <b>{p.insurance}</b>. Pre-authorisation on file with the TPA desk.</> : "Self-paying. No insurance on record."}</p>}
        {tab === "Billing" && (
          <div className="space-y-3">
            <Field k="Total bill" v={"₹" + p.totalBill.toLocaleString("en-IN")} />
            <Field k="Paid" v={"₹" + p.paid.toLocaleString("en-IN")} />
            <Field k="Pending" v={"₹" + (p.totalBill - p.paid).toLocaleString("en-IN")} />
            <div className="pt-2"><Chip label={p.billing} tone={billingTone(p.billing)} /></div>
          </div>
        )}
        {tab === "Documents" && <ul className="list-disc pl-5 text-sm text-foreground/80"><li>ID proof</li><li>Consent forms</li><li>Pre-auth (TPA)</li><li>Investigation reports</li></ul>}
        {tab === "Timeline" && (
          <ol className="relative border-l border-hairline pl-5 text-sm">
            <TimelineItem when={p.admittedAt} what="Admitted at reception" />
            <TimelineItem when="+02h" what="Room assigned" />
            <TimelineItem when="+04h" what="Initial consultation" />
            <TimelineItem when="Today" what="Vitals updated by nursing" />
          </ol>
        )}
        {tab === "Treatment" && <p>Ongoing treatment plan per consultant. RMO reviews twice daily.</p>}
        {tab === "Notes" && <p className="text-muted-foreground">No open nursing notes.</p>}
      </div>
    </div>
  );
}
function Field({ k, v }: { k: string; v: ReactNode }) {
  return (<><dt className="text-xs uppercase tracking-[0.12em] text-muted-foreground">{k}</dt><dd className="text-foreground">{v}</dd></>);
}
function TimelineItem({ when, what }: { when: string; what: string }) {
  return (
    <li className="mb-4 last:mb-0">
      <div className="absolute -left-[5px] mt-1.5 h-2 w-2 rounded-full bg-[color:var(--primary)]" />
      <div className="text-xs text-muted-foreground">{when}</div>
      <div className="text-sm text-foreground">{what}</div>
    </li>
  );
}
function billingTone(s: string) {
  return ({ Paid: "success", Pending: "warning", Installments: "gold", Outstanding: "danger", "Discharged — Cleared": "sage", "Discharged — Pending": "warning" } as const)[s as "Paid"] ?? "neutral";
}

/* ============ EMPLOYEES ============ */
export function EmployeesPage() {
  return (
    <>
      <PageHeader
        eyebrow="People"
        title="Employees"
        description="Directory of hospital staff. Only the Director may create, edit, or deactivate."
        actions={
          <button className="inline-flex items-center gap-2 rounded-md bg-[color:var(--sidebar)] px-3.5 py-2 text-sm font-medium text-white">
            <Plus className="h-3.5 w-3.5" /> Create employee
          </button>
        }
      />
      <div className="mt-10">
        <DataTable
          columns={[
            { key: "employeeId", header: "ID", className: "w-28 text-muted-foreground" },
            { key: "name", header: "Name" },
            { key: "role", header: "Role", render: (e) => <Chip label={ROLE_META[e.role].title} tone="sage" /> },
            { key: "department", header: "Department" },
            { key: "phone", header: "Phone", className: "text-muted-foreground" },
            { key: "joinedAt", header: "Joined", className: "text-muted-foreground" },
            { key: "status", header: "Status", render: (e) => <Chip label={e.status} tone={e.status === "Active" ? "success" : "neutral"} /> },
          ]}
          rows={employees}
        />
      </div>
    </>
  );
}

/* ============ ROOMS ============ */
export function RoomsPage() {
  const floors: Array<{ name: "Ground" | "First" | "Second"; sub: string }> = [
    { name: "Ground", sub: "Reception · Emergency · ICU" },
    { name: "First", sub: "General Ward · Twin Sharing" },
    { name: "Second", sub: "Private · Special Twin" },
  ];
  return (
    <>
      <PageHeader eyebrow="Space" title="Rooms" description="Live floor-wise occupancy. Colour-coded by status." />
      <div className="mt-6 flex flex-wrap gap-3">
        <LegendDot color="bg-[color:var(--success)]" label="Vacant" />
        <LegendDot color="bg-[color:var(--warning)]" label="Cleaning" />
        <LegendDot color="bg-[color:var(--destructive)]" label="Occupied" />
      </div>
      {floors.map((f) => (
        <Section key={f.name} title={f.name + " Floor"} description={f.sub}>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {rooms.filter((r) => r.floor === f.name).map((r) => (
              <div key={r.id} className="rounded-lg border border-hairline bg-card p-4">
                <div className="flex items-center justify-between">
                  <div className="serif-display text-2xl">{r.number}</div>
                  <span className={cn("h-2.5 w-2.5 rounded-full",
                    r.status === "Vacant" && "bg-[color:var(--success)]",
                    r.status === "Cleaning" && "bg-[color:var(--warning)]",
                    r.status === "Occupied" && "bg-[color:var(--destructive)]",
                  )} />
                </div>
                <div className="mt-1 text-xs text-muted-foreground">{r.category}</div>
                <div className="mt-3 text-xs text-foreground/80">{r.patient ?? r.status}</div>
              </div>
            ))}
          </div>
        </Section>
      ))}
    </>
  );
}
function LegendDot({ color, label }: { color: string; label: string }) {
  return <div className="inline-flex items-center gap-2 text-xs text-muted-foreground"><span className={cn("h-2 w-2 rounded-full", color)} />{label}</div>;
}

/* ============ INSURANCE / CLAIMS ============ */
export function InsurancePage() {
  return (
    <>
      <PageHeader eyebrow="Insurance" title="Claims" description="Third-party administrator claims and their status." />
      <div className="mt-10">
        <DataTable
          columns={[
            { key: "id", header: "Claim", className: "w-28" },
            { key: "patient", header: "Patient" },
            { key: "insurer", header: "Insurer" },
            { key: "procedure", header: "Procedure" },
            { key: "amount", header: "Amount", render: (c) => "₹" + c.amount.toLocaleString("en-IN") },
            { key: "status", header: "Status", render: (c) => <Chip label={c.status} tone={claimTone(c.status)} /> },
            { key: "updatedAt", header: "Updated", className: "text-muted-foreground" },
          ]}
          rows={claims}
        />
      </div>
    </>
  );
}

export function TpaQueriesPage() {
  return (
    <>
      <PageHeader eyebrow="Insurance" title="Queries" description="Insurer questions awaiting response." />
      <div className="mt-10 space-y-3">
        {queries.map((q) => (
          <div key={q.id} className="rounded-lg border border-hairline bg-card p-6">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium">{q.id} · {q.claim} · {q.patient}</div>
              <Chip label={q.status} tone={q.status === "Open" ? "warning" : q.status === "Responded" ? "info" : "sage"} />
            </div>
            <div className="mt-1 text-xs text-muted-foreground">{q.insurer} · raised {q.raisedOn}</div>
            <p className="mt-3 text-[14px] leading-relaxed text-foreground/90">{q.question}</p>
          </div>
        ))}
      </div>
    </>
  );
}

export function DocumentsPage() {
  return (
    <>
      <PageHeader eyebrow="Insurance" title="Documents" description="Paperwork uploaded per claim." />
      <div className="mt-10">
        <DataTable
          columns={[
            { key: "id", header: "Doc ID", className: "w-24 text-muted-foreground" },
            { key: "patient", header: "Patient" },
            { key: "claim", header: "Claim" },
            { key: "document", header: "Documents" },
            { key: "uploadedAt", header: "Uploaded", className: "text-muted-foreground" },
            { key: "by", header: "By" },
          ]}
          rows={documents}
        />
      </div>
    </>
  );
}

export function PatientInsurancePage() {
  return (
    <>
      <PageHeader eyebrow="Insurance" title="Patient Insurance" description="Policies on file for each admitted patient." />
      <div className="mt-10">
        <DataTable
          columns={[
            { key: "uhid", header: "UHID", className: "w-32 text-muted-foreground" },
            { key: "name", header: "Patient" },
            { key: "insurance", header: "Insurer", render: (p) => p.insurance ?? <span className="text-muted-foreground">Self-pay</span> },
            { key: "doctor", header: "Consultant" },
            { key: "ward", header: "Ward" },
          ]}
          rows={patients}
        />
      </div>
    </>
  );
}

export function InsuranceHistoryPage() {
  return (
    <>
      <PageHeader eyebrow="Insurance" title="History" description="Historical activity across the insurance desk." />
      <div className="mt-10">
        <DataTable
          columns={[
            { key: "at", header: "When", className: "w-40 text-muted-foreground" },
            { key: "user", header: "By" },
            { key: "action", header: "Action" },
          ]}
          rows={auditTrail.filter((a) => a.role === "tpa")}
        />
      </div>
    </>
  );
}

/* ============ BILLING TRACKER ============ */
export function BillingPage() {
  return (
    <>
      <PageHeader eyebrow="Finance" title="Billing Tracker" description="Reception does not raise bills — this page tracks payments only." />
      <Section title="Snapshot">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <SummaryTile label="Total outstanding" value="₹3,28,400" />
          <SummaryTile label="Installment accounts" value={patients.filter(p => p.billing === "Installments").length} accent="gold" />
          <SummaryTile label="Discharged — pending" value={patients.filter(p => p.billing === "Discharged — Pending").length} />
          <SummaryTile label="Paid today" value={patients.filter(p => p.billing === "Paid").length} accent="sage" />
        </div>
      </Section>
      <Section title="Patient accounts">
        <DataTable
          columns={[
            { key: "uhid", header: "UHID", className: "w-32 text-muted-foreground" },
            { key: "name", header: "Patient" },
            { key: "totalBill", header: "Total", render: (p) => "₹" + p.totalBill.toLocaleString("en-IN") },
            { key: "paid", header: "Paid", render: (p) => "₹" + p.paid.toLocaleString("en-IN") },
            { key: "pending", header: "Pending", render: (p) => "₹" + (p.totalBill - p.paid).toLocaleString("en-IN") },
            { key: "billing", header: "Status", render: (p) => <Chip label={p.billing} tone={billingTone(p.billing)} /> },
          ]}
          rows={patients}
        />
      </Section>
    </>
  );
}

/* ============ DUTY ROSTER ============ */
export function RosterPage({ role }: { role?: UserRole }) {
  const [roster, setRoster] = useState(() => [...dutyRoster]);
  const isEditable = role === "receptionist";

  const handleCellChange = (roleName: string, shift: "morning" | "evening" | "night", val: string) => {
    const next = roster.map((r) => {
      if (r.role === roleName) {
        return { ...r, [shift]: val };
      }
      return r;
    });
    setRoster(next);
    updateRosterEntry(roleName, shift, val);
  };

  return (
    <>
      <PageHeader eyebrow="Schedule" title="Duty Roster" description="Morning · Evening · Night. Replacements can be logged inline." />
      <div className="mt-10 overflow-hidden rounded-lg border border-hairline bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-hairline text-left text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              <th className="px-5 py-3.5">Role</th>
              <th className="px-5 py-3.5">Morning</th>
              <th className="px-5 py-3.5">Evening</th>
              <th className="px-5 py-3.5">Night</th>
            </tr>
          </thead>
          <tbody>
            {roster.map((r) => (
              <tr key={r.role} className="border-b border-hairline/70 last:border-b-0">
                <td className="px-5 py-4 font-medium">{r.role}</td>
                <td className="px-5 py-4 text-foreground/90">
                  {isEditable ? (
                    <input
                      type="text"
                      value={r.morning}
                      onChange={(e) => handleCellChange(r.role, "morning", e.target.value)}
                      className="w-full rounded border border-hairline bg-white px-2 py-1 text-sm outline-none focus:border-[color:var(--primary)]"
                    />
                  ) : (
                    r.morning
                  )}
                </td>
                <td className="px-5 py-4 text-foreground/90">
                  {isEditable ? (
                    <input
                      type="text"
                      value={r.evening}
                      onChange={(e) => handleCellChange(r.role, "evening", e.target.value)}
                      className="w-full rounded border border-hairline bg-white px-2 py-1 text-sm outline-none focus:border-[color:var(--primary)]"
                    />
                  ) : (
                    r.evening
                  )}
                </td>
                <td className="px-5 py-4 text-foreground/90">
                  {isEditable ? (
                    <input
                      type="text"
                      value={r.night}
                      onChange={(e) => handleCellChange(r.role, "night", e.target.value)}
                      className="w-full rounded border border-hairline bg-white px-2 py-1 text-sm outline-none focus:border-[color:var(--primary)]"
                    />
                  ) : (
                    r.night
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

/* ============ HOSPITAL CALENDAR ============ */
export function CalendarPage() {
  const today = new Date();
  const [cursor, setCursor] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDay, setSelectedDay] = useState<number | null>(today.getDate());

  const monthLabel = cursor.toLocaleDateString(undefined, { month: "long", year: "numeric" });
  const daysInMonth = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getDate();
  const firstDay = new Date(cursor.getFullYear(), cursor.getMonth(), 1).getDay();
  const cells = useMemo(() => {
    const out: Array<number | null> = [];
    for (let i = 0; i < firstDay; i++) out.push(null);
    for (let d = 1; d <= daysInMonth; d++) out.push(d);
    while (out.length % 7 !== 0) out.push(null);
    return out;
  }, [firstDay, daysInMonth]);

  const eventsForDay = (d: number) => calendarEvents.filter((e) => e.day === d);

  return (
    <>
      <PageHeader
        eyebrow="Schedule"
        title="Hospital Calendar"
        description="Every OT, OPD, camp, maintenance and leave — for the whole hospital."
      />
      <div className="mt-10 grid gap-8 lg:grid-cols-[1.6fr_1fr]">
        <div className="rounded-lg border border-hairline bg-card p-6">
          <div className="flex items-center justify-between pb-4">
            <div className="serif-display text-2xl">{monthLabel}</div>
            <div className="flex items-center gap-1">
              <button onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))} className="grid h-8 w-8 place-items-center rounded-md hairline"><ChevronLeft className="h-4 w-4" /></button>
              <button onClick={() => setCursor(new Date(today.getFullYear(), today.getMonth(), 1))} className="rounded-md hairline px-3 py-1 text-xs">Today</button>
              <button onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))} className="grid h-8 w-8 place-items-center rounded-md hairline"><ChevronRight className="h-4 w-4" /></button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-1 pb-2 text-center text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d) => <div key={d} className="py-2">{d}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {cells.map((d, i) => {
              const isToday = d === today.getDate() && cursor.getMonth() === today.getMonth() && cursor.getFullYear() === today.getFullYear();
              const isSelected = d !== null && d === selectedDay;
              const ev = d ? eventsForDay(d) : [];
              return (
                <button
                  key={i}
                  onClick={() => d && setSelectedDay(d)}
                  disabled={!d}
                  className={cn(
                    "aspect-square rounded-md p-2 text-left transition",
                    !d && "opacity-0 pointer-events-none",
                    isSelected ? "bg-[color:var(--sidebar)] text-white" :
                    isToday ? "bg-secondary" : "hover:bg-secondary/70",
                  )}
                >
                  <div className={cn("text-sm", isSelected ? "text-white" : "text-foreground")}>{d}</div>
                  {ev.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {ev.slice(0, 4).map((e) => <span key={e.id} className={cn("h-1.5 w-1.5 rounded-full", kindDot(e.kind))} />)}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="self-start rounded-lg border border-hairline bg-card p-6">
          <div className="eyebrow mb-2">Day view</div>
          <div className="serif-display text-2xl">
            {selectedDay ? `${monthLabel.split(" ")[0]} ${selectedDay}` : "Select a day"}
          </div>
          <div className="mt-6 space-y-3">
            {selectedDay && eventsForDay(selectedDay).length === 0 && (
              <div className="text-sm text-muted-foreground">No events scheduled.</div>
            )}
            {selectedDay && eventsForDay(selectedDay).map((e) => (
              <div key={e.id} className="rounded-md border border-hairline p-4">
                <div className="flex items-center gap-2">
                  <span className={cn("h-2 w-2 rounded-full", kindDot(e.kind))} />
                  <div className="text-[14px] font-medium">{e.title}</div>
                </div>
                <div className="mt-1 text-xs text-muted-foreground">{e.time} · {e.location}</div>
                <p className="mt-2 text-sm text-foreground/85">{e.description}</p>
                <div className="mt-3 text-xs text-muted-foreground">Created by {e.createdBy}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-6 flex flex-wrap gap-3">
        {[
          { k: "OT", label: "OT Surgery" },
          { k: "Camp", label: "Medical Camp" },
          { k: "OPD", label: "Doctor OPD" },
          { k: "Maintenance", label: "Equipment Maintenance" },
          { k: "Leave", label: "Staff Leave" },
        ].map((l) => (
          <div key={l.k} className="inline-flex items-center gap-2 text-xs text-muted-foreground">
            <span className={cn("h-2 w-2 rounded-full", kindDot(l.k))} /> {l.label}
          </div>
        ))}
      </div>
    </>
  );
}

/* ============ NOTICE BOARD ============ */
export function NoticesPage({ canEdit = false }: { canEdit?: boolean }) {
  return (
    <>
      <PageHeader
        eyebrow="Communications"
        title="Notice Board"
        description="Hospital-wide announcements. Visible to all roles."
        actions={canEdit ? (
          <button className="inline-flex items-center gap-2 rounded-md bg-[color:var(--sidebar)] px-3.5 py-2 text-sm font-medium text-white">
            <Plus className="h-3.5 w-3.5" /> New notice
          </button>
        ) : null}
      />
      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {notices.map((n) => (
          <article key={n.id} className="rounded-lg border border-hairline bg-card p-6">
            <div className="flex items-center justify-between">
              <Chip label={n.tag} tone="gold" />
              <span className="text-xs text-muted-foreground">{n.postedAt}</span>
            </div>
            <h3 className="mt-3 serif-display text-xl">{n.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-foreground/85">{n.body}</p>
            <div className="mt-4 text-xs text-muted-foreground">Posted by {n.postedBy}</div>
          </article>
        ))}
      </div>
    </>
  );
}

/* ============ AUDIT LOGS ============ */
export function AuditPage() {
  return (
    <>
      <PageHeader eyebrow="Records" title="Audit Logs" description="Every consequential action, retained permanently." />
      <div className="mt-10">
        <DataTable
          columns={[
            { key: "at", header: "When", className: "w-44 text-muted-foreground" },
            { key: "user", header: "User" },
            { key: "role", header: "Role", render: (a) => <Chip label={ROLE_META[a.role].title} tone="sage" /> },
            { key: "action", header: "Action" },
          ]}
          rows={auditTrail}
        />
      </div>
    </>
  );
}

/* ============ INDENTS ============ */
export function IndentsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Hospital Stock"
        title="Indents"
        description="Department stock requests. Not related to any single patient."
        actions={
          <button className="inline-flex items-center gap-2 rounded-md bg-[color:var(--sidebar)] px-3.5 py-2 text-sm font-medium text-white">
            <Plus className="h-3.5 w-3.5" /> Raise indent
          </button>
        }
      />
      <div className="mt-10">
        <DataTable
          columns={[
            { key: "id", header: "Ref", className: "w-24 text-muted-foreground" },
            { key: "department", header: "Department" },
            { key: "items", header: "Items" },
            { key: "quantity", header: "Qty", className: "w-24" },
            { key: "priority", header: "Priority", render: (i) => <Chip label={i.priority} tone={i.priority === "Urgent" ? "danger" : i.priority === "High" ? "warning" : "neutral"} /> },
            { key: "status", header: "Status", render: (i) => <Chip label={i.status} tone={i.status === "Received" ? "success" : i.status === "Pending" ? "warning" : "sage"} /> },
            { key: "raisedBy", header: "By", className: "text-muted-foreground" },
          ]}
          rows={indents}
        />
      </div>
    </>
  );
}

/* ============ SHIFT HANDOVERS ============ */
export function HandoversPage({ user, role }: { user: SessionUser; role: UserRole }) {
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState(() => [...handoverNotes]);
  const isReceptionist = role === "receptionist";

  const handleSave = () => {
    if (!note.trim()) return;
    addHandoverNote({
      shift: "Morning → Evening",
      department: user.department,
      outgoing: user.name,
      incoming: "—",
      note: note.trim(),
      author: user.name,
      role: role,
    });
    setNotes([...handoverNotes]);
    setNote("");
  };

  const displayedNotes = isReceptionist
    ? notes.filter((n) => n.role === "sister" || n.role === "rmo")
    : notes;

  return (
    <>
      <PageHeader eyebrow="Continuity of Care" title="Shift Handovers" description="No word limit. Write as much or as little as needed." />
      
      {!isReceptionist && (
        <Section title="New handover">
          <div className="rounded-lg border border-hairline bg-card p-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <LField label="Date" value={new Date().toLocaleDateString(undefined, { month: "short", day: "numeric" })} />
              <LField label="Shift" value="Morning → Evening" />
              <LField label="Department" value={user.department} />
              <LField label="Outgoing staff" value={user.name} />
              <LField label="Incoming staff" value="—" />
              <LField label="Role" value={ROLE_META[role].title} />
            </div>
            <textarea
              value={note}
              onChange={(e) => {
                setNote(e.target.value);
                e.target.style.height = "auto";
                e.target.style.height = e.target.scrollHeight + "px";
              }}
              placeholder="Write freely. Paragraphs, bullets, numbered lists — no character limit."
              className="mt-4 w-full resize-none rounded-md border border-hairline bg-white p-4 text-[14px] leading-relaxed text-foreground outline-none focus:border-[color:var(--primary)]"
              rows={6}
            />
            <div className="mt-4 flex justify-end">
              <button 
                onClick={handleSave}
                className="rounded-md bg-[color:var(--sidebar)] px-4 py-2 text-sm font-medium text-white transition hover:bg-[oklch(0.22_0.012_45)]"
              >
                Save handover
              </button>
            </div>
          </div>
        </Section>
      )}

      <Section title="Recent handovers">
        <div className="space-y-4">
          {displayedNotes.map((h) => (
            <article key={h.id} className="rounded-lg border border-hairline bg-card p-6">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="text-sm font-medium">{h.department} · {h.shift}</div>
                <div className="text-xs text-muted-foreground">{h.date}</div>
              </div>
              <div className="mt-1 text-xs text-muted-foreground">{h.outgoing} → {h.incoming}</div>
              <p className="mt-3 whitespace-pre-line text-[14px] leading-relaxed text-foreground/90">{h.note}</p>
              <div className="mt-4 text-xs text-muted-foreground">Author: {h.author} · {ROLE_META[h.role].title}</div>
            </article>
          ))}
          {displayedNotes.length === 0 && (
            <div className="rounded-lg border border-dashed border-hairline p-8 text-center text-sm text-muted-foreground">
              No recent handovers.
            </div>
          )}
        </div>
      </Section>
    </>
  );
}
function LField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">{label}</div>
      <div className="mt-1 text-sm font-medium text-foreground">{value}</div>
    </div>
  );
}

/* ============ VITALS ============ */
export function VitalsPage() {
  return (
    <>
      <PageHeader eyebrow="Nursing" title="Vitals" description="Latest observations, quietly logged." />
      <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_1.4fr]">
        <div className="rounded-lg border border-hairline bg-card p-6">
          <div className="eyebrow mb-3">Patient</div>
          <div className="serif-display text-2xl">Rahul Menon</div>
          <div className="text-sm text-muted-foreground">MSH-24020 · ICU-3 · Dr. Iyer</div>
          <div className="mt-6 grid grid-cols-2 gap-4">
            <SummaryTile label="Latest BP" value="130/86" />
            <SummaryTile label="Heart rate" value="80 bpm" accent="sage" />
            <SummaryTile label="SpO₂" value="98%" />
            <SummaryTile label="Temp" value="98.8 °F" />
          </div>
        </div>
        <div>
          <DataTable
            columns={[
              { key: "time", header: "Time", className: "w-24" },
              { key: "bp", header: "BP" },
              { key: "hr", header: "HR" },
              { key: "spo2", header: "SpO₂" },
              { key: "temp", header: "Temp" },
              { key: "note", header: "Note", className: "text-muted-foreground" },
            ]}
            rows={sampleVitals}
          />
        </div>
      </div>
    </>
  );
}

/* ============ Simple content-only pages ============ */
export function AdmissionsPage() {
  return (
    <>
      <PageHeader eyebrow="Front Desk" title="Admissions" description="Today's admissions and pending paperwork." />
      <div className="mt-10">
        <DataTable
          columns={[
            { key: "uhid", header: "UHID", className: "w-32 text-muted-foreground" },
            { key: "name", header: "Patient" },
            { key: "ward", header: "Ward" },
            { key: "room", header: "Room" },
            { key: "doctor", header: "Consultant" },
            { key: "admittedAt", header: "Admitted" },
          ]}
          rows={patients.filter((p) => p.ward !== "Discharged")}
        />
      </div>
    </>
  );
}

export function RecordsPage() {
  return (
    <>
      <PageHeader eyebrow="Nursing" title="Patient Records" description="Read-only access to admitted patient folders assigned to you." />
      <PatientsPage />
    </>
  );
}

export function TreatmentPage() {
  return (
    <>
      <PageHeader eyebrow="Nursing" title="Treatment Notes" description="Daily nursing entries." />
      <div className="mt-10 space-y-4">
        {patients.slice(0, 4).map((p) => (
          <div key={p.id} className="rounded-lg border border-hairline bg-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">{p.name}</div>
                <div className="text-xs text-muted-foreground">{p.uhid} · Room {p.room}</div>
              </div>
              <div className="text-xs text-muted-foreground">Today · 12:40</div>
            </div>
            <p className="mt-3 text-[14px] leading-relaxed text-foreground/90">
              Patient comfortable. Oral fluids tolerated well. Analgesia effective; next dose due 16:00. No fresh complaints.
            </p>
          </div>
        ))}
      </div>
    </>
  );
}

export function DiagnosisPage() {
  return (
    <>
      <PageHeader eyebrow="Clinical" title="Diagnosis" description="Working diagnoses recorded per patient." />
      <div className="mt-10">
        <DataTable
          columns={[
            { key: "uhid", header: "UHID", className: "w-32 text-muted-foreground" },
            { key: "name", header: "Patient" },
            { key: "diagnosis", header: "Working diagnosis" },
            { key: "doctor", header: "Consultant" },
            { key: "critical", header: "Acuity", render: (p) => p.critical ? <Chip label="Critical" tone="danger" /> : <Chip label="Stable" tone="sage" /> },
          ]}
          rows={patients.filter((p) => p.ward !== "Discharged")}
        />
      </div>
    </>
  );
}

export function ClinicalNotesPage() {
  return (
    <>
      <PageHeader eyebrow="Clinical" title="Clinical Notes" description="Physician entries against each patient." />
      <div className="mt-10 space-y-4">
        {patients.slice(0, 3).map((p) => (
          <div key={p.id} className="rounded-lg border border-hairline bg-card p-6">
            <div className="text-sm font-medium">{p.name} · {p.uhid}</div>
            <div className="mt-1 text-xs text-muted-foreground">Ward round · {p.doctor}</div>
            <p className="mt-3 text-[14px] leading-relaxed text-foreground/90">
              Reviewed patient; symptoms improving. Continue current regimen. Reassess in 12 hours. Nursing to record vitals q4h.
            </p>
          </div>
        ))}
      </div>
    </>
  );
}

export function DischargePage() {
  return (
    <>
      <PageHeader eyebrow="Clinical" title="Discharge Notes" description="Prepared discharge summaries awaiting release." />
      <div className="mt-10">
        <DataTable
          columns={[
            { key: "uhid", header: "UHID", className: "w-32 text-muted-foreground" },
            { key: "name", header: "Patient" },
            { key: "diagnosis", header: "Diagnosis" },
            { key: "doctor", header: "Consultant" },
            { key: "billing", header: "Billing", render: (p) => <Chip label={p.billing} tone={billingTone(p.billing)} /> },
          ]}
          rows={patients.slice(0, 3)}
        />
      </div>
    </>
  );
}

export function TimelinePage() {
  return (
    <>
      <PageHeader eyebrow="Clinical" title="Patient Timeline" description="Chronological view across a patient's stay." />
      <div className="mt-10 rounded-lg border border-hairline bg-card p-8">
        <div className="serif-display text-2xl">Ananya Sharma</div>
        <div className="text-sm text-muted-foreground">MSH-24019 · Room 204</div>
        <ol className="mt-6 relative border-l border-hairline pl-6">
          {[
            ["03 Jul · 09:12", "Admitted at Reception"],
            ["03 Jul · 09:35", "Room 204 assigned"],
            ["03 Jul · 10:20", "Initial consultation — Dr. Rao"],
            ["03 Jul · 14:00", "Laparoscopy — OT-3"],
            ["03 Jul · 17:40", "Post-op observation started"],
            ["Today · 09:00", "Vitals normal; discharge planning tomorrow"],
          ].map(([w, what], i) => (
            <li key={i} className="mb-5 last:mb-0">
              <div className="absolute -left-[5px] mt-1.5 h-2 w-2 rounded-full bg-[color:var(--primary)]" />
              <div className="text-xs text-muted-foreground">{w}</div>
              <div className="text-sm text-foreground">{what}</div>
            </li>
          ))}
        </ol>
      </div>
    </>
  );
}

export function ReportsPage() {
  return (
    <>
      <PageHeader eyebrow="Records" title="Reports" description="Generated reports ready to export." />
      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {["Monthly admissions summary","Bed occupancy report","Insurance claim performance","Employee attendance","Indent fulfilment","Audit trail — last 30 days"].map((r) => (
          <div key={r} className="flex items-center justify-between rounded-lg border border-hairline bg-card p-6">
            <div>
              <div className="text-[14px] font-medium">{r}</div>
              <div className="text-xs text-muted-foreground">Generated today</div>
            </div>
            <Link to="/" className="text-xs font-medium text-[color:var(--primary)] hover:underline">Download</Link>
          </div>
        ))}
      </div>
    </>
  );
}

export function SettingsPage() {
  return (
    <>
      <PageHeader eyebrow="Administration" title="Settings" description="Institution-wide preferences." />
      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {[
          ["Hospital profile", "Name, address, registration, logo"],
          ["Departments", "Manage clinical and operational departments"],
          ["Roles & permissions", "Fine-tune access per role"],
          ["Notice defaults", "Set default posting settings"],
          ["Audit retention", "Configure retention periods"],
          ["Backups", "Nightly backup schedule and recipients"],
        ].map(([t, d]) => (
          <div key={t} className="rounded-lg border border-hairline bg-card p-6">
            <div className="text-[14px] font-medium">{t}</div>
            <div className="mt-1 text-sm text-muted-foreground">{d}</div>
          </div>
        ))}
      </div>
    </>
  );
}

/* ============ Registry: role + slug → component ============ */
export function renderRolePage(role: UserRole, slug: string, user: SessionUser): ReactNode {
  const key = `${role}:${slug}`;
  switch (key) {
    // Director
    case "director:patients": return <PatientsPage />;
    case "director:employees": return <EmployeesPage />;
    case "director:reception": return <AdmissionsPage />;
    case "director:insurance": return <InsurancePage />;
    case "director:roster": return <RosterPage role={role} />;
    case "director:calendar": return <CalendarPage />;
    case "director:billing": return <BillingPage />;
    case "director:notices": return <NoticesPage canEdit />;
    case "director:audit": return <AuditPage />;
    case "director:reports": return <ReportsPage />;
    case "director:settings": return <SettingsPage />;
    // Receptionist
    case "receptionist:admissions": return <AdmissionsPage />;
    case "receptionist:patients": return <PatientsPage />;
    case "receptionist:rooms": return <RoomsPage />;
    case "receptionist:billing": return <BillingPage />;
    case "receptionist:roster": return <RosterPage role={role} />;
    case "receptionist:calendar": return <CalendarPage />;
    case "receptionist:handovers": return <HandoversPage user={user} role={role} />;
    case "receptionist:notices": return <NoticesPage canEdit />;
    // Sister
    case "sister:patients": return <PatientsPage />;
    case "sister:records": return <PatientsPage />;
    case "sister:vitals": return <VitalsPage />;
    case "sister:treatment": return <TreatmentPage />;
    case "sister:indents": return <IndentsPage />;
    case "sister:handovers": return <HandoversPage user={user} role={role} />;
    case "sister:calendar": return <CalendarPage />;
    case "sister:notices": return <NoticesPage />;
    // RMO
    case "rmo:patients": return <PatientsPage />;
    case "rmo:records": return <PatientsPage />;
    case "rmo:vitals": return <VitalsPage />;
    case "rmo:diagnosis": return <DiagnosisPage />;
    case "rmo:clinical-notes": return <ClinicalNotesPage />;
    case "rmo:treatment": return <TreatmentPage />;
    case "rmo:discharge": return <DischargePage />;
    case "rmo:timeline": return <TimelinePage />;
    case "rmo:indents": return <IndentsPage />;
    case "rmo:handovers": return <HandoversPage user={user} role={role} />;
    case "rmo:calendar": return <CalendarPage />;
    case "rmo:notices": return <NoticesPage />;
    // TPA
    case "tpa:claims": return <InsurancePage />;
    case "tpa:queries": return <TpaQueriesPage />;
    case "tpa:documents": return <DocumentsPage />;
    case "tpa:patient-insurance": return <PatientInsurancePage />;
    case "tpa:calendar": return <CalendarPage />;
    case "tpa:history": return <InsuranceHistoryPage />;
    default: return null;
  }
}
