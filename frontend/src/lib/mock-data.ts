import type { UserRole } from "./auth";

export const hospital = {
  name: "MEDSTAR Multispeciality Hospital",
  short: "MEDSTAR",
  address: "12 Cathedral Road, Chennai 600086",
};

// -------- Summary numbers (no charts anywhere) --------
export const summary = {
  admissionsToday: 24,
  dischargesToday: 17,
  occupiedBeds: 118,
  vacantBeds: 26,
  pendingClaims: 14,
  outstandingBills: "₹3,28,400",
  employeesOnDuty: 74,
  medicalCampsToday: 1,
  upcomingSurgeries: 6,
  recentHandovers: 12,
  pendingBilling: 9,
  todayEvents: 4,
};

// -------- Patients --------
export type PatientStatus =
  | "Paid"
  | "Pending"
  | "Installments"
  | "Outstanding"
  | "Discharged — Cleared"
  | "Discharged — Pending";

export interface Patient {
  id: string;
  uhid: string;
  name: string;
  age: number;
  gender: "M" | "F";
  phone: string;
  room: string;
  ward: string;
  diagnosis: string;
  admittedAt: string;
  doctor: string;
  billing: PatientStatus;
  totalBill: number;
  paid: number;
  critical?: boolean;
  insurance?: string;
}

export const patients: Patient[] = [
  { id: "p1", uhid: "MSH-24019", name: "Ananya Sharma", age: 34, gender: "F", phone: "+91 98220 11223", room: "204", ward: "Private", diagnosis: "Post-op observation", admittedAt: "03 Jul · 09:12", doctor: "Dr. Rao", billing: "Paid", totalBill: 52000, paid: 52000, insurance: "Star Health" },
  { id: "p2", uhid: "MSH-24020", name: "Rahul Menon", age: 58, gender: "M", phone: "+91 90210 33445", room: "ICU-3", ward: "ICU", diagnosis: "Acute MI — stable", admittedAt: "02 Jul · 22:40", doctor: "Dr. Iyer", billing: "Pending", totalBill: 385000, paid: 150000, critical: true, insurance: "HDFC Ergo" },
  { id: "p3", uhid: "MSH-24021", name: "Meera Nair", age: 41, gender: "F", phone: "+91 99887 66554", room: "112", ward: "Twin Sharing", diagnosis: "Pneumonia", admittedAt: "03 Jul · 06:30", doctor: "Dr. Kapoor", billing: "Installments", totalBill: 62000, paid: 30000, insurance: "ICICI Lombard" },
  { id: "p4", uhid: "MSH-24022", name: "Aarav Gupta", age: 7, gender: "M", phone: "+91 98110 22334", room: "301", ward: "Private", diagnosis: "Dengue — recovering", admittedAt: "01 Jul · 14:00", doctor: "Dr. Rao", billing: "Outstanding", totalBill: 88000, paid: 20000 },
  { id: "p5", uhid: "MSH-24023", name: "Fatima Sheikh", age: 63, gender: "F", phone: "+91 90003 22110", room: "ICU-1", ward: "ICU", diagnosis: "Sepsis", admittedAt: "30 Jun · 03:15", doctor: "Dr. Iyer", billing: "Pending", totalBill: 219000, paid: 90000, critical: true, insurance: "New India" },
  { id: "p6", uhid: "MSH-24024", name: "Vikram Desai", age: 45, gender: "M", phone: "+91 98301 44556", room: "108", ward: "General", diagnosis: "Fracture — tibia", admittedAt: "03 Jul · 11:45", doctor: "Dr. Bhat", billing: "Paid", totalBill: 132000, paid: 132000, insurance: "Bajaj Allianz" },
  { id: "p7", uhid: "MSH-24018", name: "Kiran Rao", age: 71, gender: "M", phone: "+91 98444 90210", room: "—", ward: "Discharged", diagnosis: "Cataract", admittedAt: "01 Jul · 08:00", doctor: "Dr. Rao", billing: "Discharged — Pending", totalBill: 48000, paid: 20000, insurance: "Star Health" },
];

// -------- Claims --------
export interface Claim {
  id: string;
  patient: string;
  uhid: string;
  insurer: string;
  policy: string;
  procedure: string;
  amount: number;
  status: "Pending" | "Approved" | "Rejected" | "Documents Required" | "Query Raised";
  updatedAt: string;
}

export const claims: Claim[] = [
  { id: "CL-9821", patient: "Ananya Sharma", uhid: "MSH-24019", insurer: "Star Health", policy: "SH-98211", procedure: "Laparoscopy", amount: 148000, status: "Approved", updatedAt: "2 h ago" },
  { id: "CL-9822", patient: "Rahul Menon", uhid: "MSH-24020", insurer: "HDFC Ergo", policy: "HE-77123", procedure: "Angioplasty", amount: 385000, status: "Pending", updatedAt: "just now" },
  { id: "CL-9823", patient: "Meera Nair", uhid: "MSH-24021", insurer: "ICICI Lombard", policy: "IL-44521", procedure: "IV Antibiotics", amount: 62000, status: "Query Raised", updatedAt: "1 h ago" },
  { id: "CL-9824", patient: "Fatima Sheikh", uhid: "MSH-24023", insurer: "New India", policy: "NI-11228", procedure: "ICU Care", amount: 219000, status: "Documents Required", updatedAt: "4 h ago" },
  { id: "CL-9825", patient: "Vikram Desai", uhid: "MSH-24024", insurer: "Bajaj Allianz", policy: "BA-00981", procedure: "Ortho — Fixation", amount: 132000, status: "Approved", updatedAt: "yesterday" },
  { id: "CL-9826", patient: "Kiran Rao", uhid: "MSH-24018", insurer: "Star Health", policy: "SH-11902", procedure: "Cataract", amount: 48000, status: "Rejected", updatedAt: "2 d ago" },
];

// -------- Notices --------
export interface Notice {
  id: string;
  title: string;
  body: string;
  tag: "OT" | "Camp" | "Drill" | "Inspection" | "General";
  postedBy: string;
  postedAt: string;
}

export const notices: Notice[] = [
  { id: "n1", title: "OT-2 closed tomorrow", body: "Operation Theatre 2 will remain closed all day for anaesthesia system maintenance. Please reschedule non-urgent cases.", tag: "OT", postedBy: "Director", postedAt: "Today · 08:12" },
  { id: "n2", title: "Free diabetes camp — Sunday", body: "Community medical camp in the atrium, 9 AM to 2 PM. Volunteers may sign up at Reception.", tag: "Camp", postedBy: "Reception", postedAt: "Yesterday" },
  { id: "n3", title: "Fire safety drill — Friday 11 AM", body: "Full evacuation drill. Ward-in-charge to coordinate patient movement. Please brief night shift.", tag: "Drill", postedBy: "Director", postedAt: "Yesterday" },
  { id: "n4", title: "NABH inspection — Monday", body: "Inspectors expected on-site by 10 AM. Please ensure department documentation is up to date.", tag: "Inspection", postedBy: "Director", postedAt: "2 days ago" },
];

// -------- Calendar events (with concrete dates for the current month) --------
// Kind → colour dot
export type EventKind = "OT" | "Camp" | "OPD" | "Maintenance" | "Leave";
export interface CalendarEvent {
  id: string;
  day: number; // day of current visible month
  title: string;
  time: string;
  location: string;
  description: string;
  kind: EventKind;
  createdBy: string;
}

export const calendarEvents: CalendarEvent[] = [
  { id: "e1", day: 4, title: "Angioplasty — Dr. Iyer", time: "10:00", location: "OT-1", description: "Elective. Patient: Rahul Menon (MSH-24020).", kind: "OT", createdBy: "Reception" },
  { id: "e2", day: 4, title: "OPD — Dr. Rao (Paediatrics)", time: "16:00 – 19:00", location: "OPD Block A", description: "Regular Wednesday clinic.", kind: "OPD", createdBy: "Director" },
  { id: "e3", day: 6, title: "Free diabetes camp", time: "09:00 – 14:00", location: "Atrium", description: "Community outreach. Volunteers welcome.", kind: "Camp", createdBy: "Director" },
  { id: "e4", day: 8, title: "MRI machine — annual service", time: "08:00", location: "Radiology", description: "Downtime expected until noon.", kind: "Maintenance", createdBy: "Director" },
  { id: "e5", day: 10, title: "Sister Anita — leave", time: "All day", location: "—", description: "Approved leave through Friday.", kind: "Leave", createdBy: "Reception" },
  { id: "e6", day: 10, title: "Laparoscopy — Dr. Rao", time: "11:30", location: "OT-3", description: "Case: Ananya Sharma follow-up.", kind: "OT", createdBy: "Reception" },
  { id: "e7", day: 15, title: "OPD — Dr. Kapoor", time: "10:00 – 13:00", location: "OPD Block B", description: "Cardiology consultations.", kind: "OPD", createdBy: "Director" },
  { id: "e8", day: 18, title: "Ventilator PM", time: "09:00", location: "ICU", description: "Biomed preventive maintenance.", kind: "Maintenance", createdBy: "Director" },
  { id: "e9", day: 20, title: "Cardiac screening camp", time: "09:00 – 13:00", location: "Community Hall, T. Nagar", description: "Off-site screening.", kind: "Camp", createdBy: "Reception" },
  { id: "e10", day: 22, title: "Dr. Bhat — leave", time: "All day", location: "—", description: "Personal leave.", kind: "Leave", createdBy: "Reception" },
  { id: "e11", day: 25, title: "Hip replacement — Dr. Bhat", time: "09:00", location: "OT-2", description: "Elective orthopaedic case.", kind: "OT", createdBy: "Reception" },
];

// -------- Audit trail --------
export interface AuditEntry {
  id: string;
  user: string;
  role: UserRole;
  action: string;
  at: string;
}
export const auditTrail: AuditEntry[] = [
  { id: "a1", user: "Priya Suresh", role: "receptionist", action: "Admitted patient Ananya Sharma to Room 204", at: "Today · 09:14" },
  { id: "a2", user: "Dr. Vinay Bhat", role: "rmo", action: "Updated vitals for MSH-24020", at: "Today · 09:02" },
  { id: "a3", user: "Neha Iyer", role: "tpa", action: "Uploaded pre-authorisation for claim CL-9822", at: "Today · 08:47" },
  { id: "a4", user: "Karthik Menon", role: "receptionist", action: "Discharged patient MSH-24011", at: "Today · 08:30" },
  { id: "a5", user: "Dr. Arvind Rao", role: "director", action: "Modified duty roster — Night shift", at: "Yesterday · 21:12" },
  { id: "a6", user: "Sister Anita", role: "sister", action: "Filed indent IND-441 (OT consumables)", at: "Yesterday · 18:20" },
  { id: "a7", user: "Dr. Arvind Rao", role: "director", action: "Created new employee record MS-N-052", at: "2 days ago" },
  { id: "a8", user: "Neha Iyer", role: "tpa", action: "Marked claim CL-9825 as Approved", at: "2 days ago" },
];

// -------- Vitals --------
export interface Vital { time: string; bp: string; hr: number; spo2: number; temp: number; note?: string }
export const sampleVitals: Vital[] = [
  { time: "06:00", bp: "128/82", hr: 78, spo2: 98, temp: 98.6, note: "Slept well" },
  { time: "10:00", bp: "132/84", hr: 82, spo2: 97, temp: 99.1, note: "Post breakfast" },
  { time: "14:00", bp: "126/80", hr: 76, spo2: 98, temp: 98.4 },
  { time: "18:00", bp: "130/86", hr: 80, spo2: 98, temp: 98.8, note: "Evening rounds" },
];

// -------- Indents --------
export interface Indent {
  id: string;
  department: string;
  priority: "Low" | "Normal" | "High" | "Urgent";
  items: string;
  quantity: string;
  status: "Pending" | "Approved" | "Ordered" | "Received" | "Closed";
  remarks?: string;
  raisedBy: string;
  raisedAt: string;
}
export const indents: Indent[] = [
  { id: "IND-441", department: "Operation Theatre", priority: "Urgent", items: "Sterile gloves, IV sets, gauze packs", quantity: "20 · 10 · 15", status: "Approved", remarks: "For today's scheduled procedures", raisedBy: "Sister Anita", raisedAt: "Yesterday" },
  { id: "IND-442", department: "ICU", priority: "High", items: "Endotracheal tubes", quantity: "6", status: "Ordered", raisedBy: "Sister Meena", raisedAt: "Yesterday" },
  { id: "IND-443", department: "General Ward", priority: "Normal", items: "Bed linen", quantity: "40", status: "Pending", raisedBy: "Sister Lakshmi", raisedAt: "Today · 08:10" },
  { id: "IND-444", department: "Pharmacy", priority: "Normal", items: "Insulin vials (Rapid)", quantity: "24", status: "Received", raisedBy: "Sister Anita", raisedAt: "2 days ago" },
];

// -------- Duty roster --------
export interface DutyEntry {
  role: string;
  morning: string;
  evening: string;
  night: string;
}
const initialRoster: DutyEntry[] = [
  { role: "Reception", morning: "Priya Suresh", evening: "Karthik Menon", night: "Naveen K." },
  { role: "RMO", morning: "Dr. Bhat", evening: "Dr. Kapoor", night: "Dr. Iyer" },
  { role: "Sister — ICU", morning: "Anita", evening: "Rekha", night: "Meena" },
  { role: "Sister — Ward", morning: "Susan", evening: "Fatima", night: "Lakshmi" },
  { role: "Ward Boys", morning: "Ramesh, Kiran", evening: "Vinod, Ajay", night: "Suresh, Manoj" },
  { role: "Housekeeping", morning: "Team A", evening: "Team B", night: "Team C" },
  { role: "OT Staff", morning: "Group 1", evening: "Group 2", night: "On-call" },
];

export let dutyRoster: DutyEntry[] = [...initialRoster];

if (typeof window !== "undefined") {
  const raw = window.localStorage.getItem("mhos_duty_roster");
  if (raw) {
    try {
      dutyRoster = JSON.parse(raw);
    } catch (_) {}
  }
}

export function updateRosterEntry(roleName: string, shift: "morning" | "evening" | "night", val: string) {
  const entry = dutyRoster.find(r => r.role === roleName);
  if (entry) {
    entry[shift] = val;
    if (typeof window !== "undefined") {
      window.localStorage.setItem("mhos_duty_roster", JSON.stringify(dutyRoster));
    }
  }
}

// -------- Rooms --------
export interface Room {
  id: string;
  number: string;
  floor: "Ground" | "First" | "Second";
  category: string;
  status: "Vacant" | "Occupied" | "Cleaning";
  patient?: string;
}
export const rooms: Room[] = [
  // Ground
  { id: "r1", number: "R-01", floor: "Ground", category: "Reception", status: "Occupied" },
  { id: "r2", number: "E-01", floor: "Ground", category: "Emergency", status: "Occupied", patient: "Rahul M." },
  { id: "r3", number: "E-02", floor: "Ground", category: "Emergency", status: "Vacant" },
  { id: "r4", number: "ICU-1", floor: "Ground", category: "ICU", status: "Occupied", patient: "Fatima S." },
  { id: "r5", number: "ICU-2", floor: "Ground", category: "ICU", status: "Cleaning" },
  { id: "r6", number: "ICU-3", floor: "Ground", category: "ICU", status: "Occupied", patient: "Rahul M." },
  { id: "r7", number: "ICU-4", floor: "Ground", category: "ICU", status: "Vacant" },
  // First
  { id: "r8", number: "108", floor: "First", category: "General Ward", status: "Occupied", patient: "Vikram D." },
  { id: "r9", number: "109", floor: "First", category: "General Ward", status: "Vacant" },
  { id: "r10", number: "110", floor: "First", category: "General Ward", status: "Vacant" },
  { id: "r11", number: "111", floor: "First", category: "General Ward", status: "Occupied", patient: "S. Rangan" },
  { id: "r12", number: "112", floor: "First", category: "Twin Sharing", status: "Occupied", patient: "Meera N." },
  { id: "r13", number: "114", floor: "First", category: "Twin Sharing", status: "Cleaning" },
  { id: "r14", number: "115", floor: "First", category: "Twin Sharing", status: "Vacant" },
  // Second
  { id: "r15", number: "204", floor: "Second", category: "Private", status: "Occupied", patient: "Ananya S." },
  { id: "r16", number: "205", floor: "Second", category: "Private", status: "Vacant" },
  { id: "r17", number: "206", floor: "Second", category: "Private", status: "Vacant" },
  { id: "r18", number: "210", floor: "Second", category: "Special Twin", status: "Vacant" },
  { id: "r19", number: "211", floor: "Second", category: "Special Twin", status: "Occupied", patient: "N. Rangarajan" },
  { id: "r20", number: "301", floor: "Second", category: "Private", status: "Occupied", patient: "Aarav G." },
];

// -------- Handovers --------
export interface HandoverNote {
  id: string;
  date: string;
  shift: "Morning → Evening" | "Evening → Night" | "Night → Morning";
  department: string;
  outgoing: string;
  incoming: string;
  note: string;
  author: string;
  role: UserRole;
}
const initialHandovers: HandoverNote[] = [
  {
    id: "h1", date: "Today", shift: "Morning → Evening", department: "ICU",
    outgoing: "Sister Anita", incoming: "Sister Rekha", author: "Sister Anita", role: "sister",
    note: "ICU-3 (Rahul M.) — stable post-angio. Monitor BP q2h; continue nitroglycerin infusion. Family briefed.\n\nICU-1 (Fatima S.) — sepsis workup ongoing, awaiting blood culture. Started on empirical antibiotics 08:00.\n\nPending: transfer of ICU-2 patient to Room 205 once cleaning is complete.",
  },
  {
    id: "h2", date: "Today", shift: "Morning → Evening", department: "General Ward",
    outgoing: "Dr. Bhat", incoming: "Dr. Kapoor", author: "Dr. Bhat", role: "rmo",
    note: "Room 301 (Aarav G.) — platelet trend rising, continue orals. Discharge planning tomorrow if stable overnight.\n\nRoom 108 (Vikram D.) — post-op day 2, dressing changed. Ambulation started.",
  },
  {
    id: "h3", date: "Yesterday", shift: "Night → Morning", department: "Reception",
    outgoing: "Naveen K.", incoming: "Priya Suresh", author: "Naveen K.", role: "receptionist",
    note: "Uneventful night. New admission at 03:15 — Fatima S., ICU-1, sepsis. Insurance paperwork initiated with Neha for TPA follow-up.\n\nPending discharge paperwork for MSH-24018 (Kiran Rao) — installment pending.",
  },
];

export let handoverNotes: HandoverNote[] = [...initialHandovers];

if (typeof window !== "undefined") {
  const raw = window.localStorage.getItem("mhos_handover_notes");
  if (raw) {
    try {
      handoverNotes = JSON.parse(raw);
    } catch (_) {}
  }
}

export function addHandoverNote(newNote: Omit<HandoverNote, "id" | "date">) {
  const noteObj: HandoverNote = {
    id: "h" + (handoverNotes.length + 1),
    date: new Date().toLocaleDateString(undefined, { month: "short", day: "numeric" }),
    ...newNote
  };
  handoverNotes.unshift(noteObj);
  if (typeof window !== "undefined") {
    window.localStorage.setItem("mhos_handover_notes", JSON.stringify(handoverNotes));
  }
}

// -------- TPA queries --------
export interface Query {
  id: string;
  claim: string;
  patient: string;
  insurer: string;
  raisedOn: string;
  question: string;
  status: "Open" | "Responded" | "Closed";
}
export const queries: Query[] = [
  { id: "Q-2201", claim: "CL-9823", patient: "Meera Nair", insurer: "ICICI Lombard", raisedOn: "Today", status: "Open", question: "Clarify prior admission history for chronic condition." },
  { id: "Q-2202", claim: "CL-9824", patient: "Fatima Sheikh", insurer: "New India", raisedOn: "Yesterday", status: "Responded", question: "Request for consultant notes and blood culture reports." },
  { id: "Q-2203", claim: "CL-9822", patient: "Rahul Menon", insurer: "HDFC Ergo", raisedOn: "2 days ago", status: "Closed", question: "Confirm pre-authorisation coverage limits." },
];

// -------- Documents (TPA) --------
export interface DocRow {
  id: string;
  patient: string;
  claim: string;
  document: string;
  uploadedAt: string;
  by: string;
}
export const documents: DocRow[] = [
  { id: "D-501", patient: "Ananya Sharma", claim: "CL-9821", document: "Pre-auth form, Discharge summary", uploadedAt: "2 h ago", by: "Neha Iyer" },
  { id: "D-502", patient: "Rahul Menon", claim: "CL-9822", document: "Pre-auth, ECG, Angio report", uploadedAt: "just now", by: "Neha Iyer" },
  { id: "D-503", patient: "Fatima Sheikh", claim: "CL-9824", document: "Consultant notes, Blood culture", uploadedAt: "1 d ago", by: "Neha Iyer" },
];
