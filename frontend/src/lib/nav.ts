import type { NavItem } from "@/components/app-shell";
import {
  LayoutGrid, Users, Briefcase, Building2, ShieldCheck, CalendarClock,
  Calendar, Wallet, Megaphone, ScrollText, FileBarChart2, Settings,
  BedDouble, Boxes, ClipboardList, Activity, Stethoscope, HeartPulse,
  FileText, ArrowLeftRight, ListChecks, History,
} from "lucide-react";
import type { UserRole } from "@/lib/auth";

export const directorNav: NavItem[] = [
  { label: "Dashboard", slug: "", icon: LayoutGrid, group: "Oversight" },
  { label: "Patients", slug: "patients", icon: Users, group: "Oversight" },
  { label: "Employees", slug: "employees", icon: Briefcase, group: "Oversight" },
  { label: "Reception", slug: "reception", icon: Building2, group: "Operations" },
  { label: "Insurance", slug: "insurance", icon: ShieldCheck, group: "Operations" },
  { label: "Duty Roster", slug: "roster", icon: CalendarClock, group: "Operations" },
  { label: "Hospital Calendar", slug: "calendar", icon: Calendar, group: "Operations" },
  { label: "Billing", slug: "billing", icon: Wallet, group: "Records" },
  { label: "Notice Board", slug: "notices", icon: Megaphone, group: "Records" },
  { label: "Audit Logs", slug: "audit", icon: ScrollText, group: "Records" },
  { label: "Reports", slug: "reports", icon: FileBarChart2, group: "Records" },
  { label: "Settings", slug: "settings", icon: Settings, group: "Records" },
];

export const receptionistNav: NavItem[] = [
  { label: "Dashboard", slug: "", icon: LayoutGrid, group: "Front Desk" },
  { label: "Admissions", slug: "admissions", icon: ClipboardList, group: "Front Desk" },
  { label: "Patients", slug: "patients", icon: Users, group: "Front Desk" },
  { label: "Rooms", slug: "rooms", icon: BedDouble, group: "Front Desk" },
  { label: "Billing Tracker", slug: "billing", icon: Wallet, group: "Records" },
  { label: "Duty Roster", slug: "roster", icon: CalendarClock, group: "Records" },
  { label: "Hospital Calendar", slug: "calendar", icon: Calendar, group: "Records" },
  { label: "Shift Handovers", slug: "handovers", icon: ArrowLeftRight, group: "Records" },
  { label: "Notice Board", slug: "notices", icon: Megaphone, group: "Records" },
];

export const sisterNav: NavItem[] = [
  { label: "Dashboard", slug: "", icon: LayoutGrid, group: "Nursing" },
  { label: "Assigned Patients", slug: "patients", icon: Users, group: "Nursing" },
  { label: "Patient Records", slug: "records", icon: FileText, group: "Nursing" },
  { label: "Vitals", slug: "vitals", icon: HeartPulse, group: "Nursing" },
  { label: "Treatment Notes", slug: "treatment", icon: Activity, group: "Nursing" },
  { label: "Indents", slug: "indents", icon: Boxes, group: "Records" },
  { label: "Shift Handovers", slug: "handovers", icon: ArrowLeftRight, group: "Records" },
  { label: "Hospital Calendar", slug: "calendar", icon: Calendar, group: "Records" },
  { label: "Notice Board", slug: "notices", icon: Megaphone, group: "Records" },
];

export const rmoNav: NavItem[] = [
  { label: "Dashboard", slug: "", icon: LayoutGrid, group: "Clinical" },
  { label: "Assigned Patients", slug: "patients", icon: Users, group: "Clinical" },
  { label: "Patient Records", slug: "records", icon: FileText, group: "Clinical" },
  { label: "Vitals", slug: "vitals", icon: HeartPulse, group: "Clinical" },
  { label: "Diagnosis", slug: "diagnosis", icon: Stethoscope, group: "Clinical" },
  { label: "Clinical Notes", slug: "clinical-notes", icon: ListChecks, group: "Clinical" },
  { label: "Treatment Progress", slug: "treatment", icon: Activity, group: "Clinical" },
  { label: "Discharge Notes", slug: "discharge", icon: FileText, group: "Clinical" },
  { label: "Patient Timeline", slug: "timeline", icon: History, group: "Clinical" },
  { label: "Indents", slug: "indents", icon: Boxes, group: "Records" },
  { label: "Shift Handovers", slug: "handovers", icon: ArrowLeftRight, group: "Records" },
  { label: "Hospital Calendar", slug: "calendar", icon: Calendar, group: "Records" },
  { label: "Notice Board", slug: "notices", icon: Megaphone, group: "Records" },
];

export const tpaNav: NavItem[] = [
  { label: "Dashboard", slug: "", icon: LayoutGrid, group: "Insurance" },
  { label: "Claims", slug: "claims", icon: ShieldCheck, group: "Insurance" },
  { label: "Queries", slug: "queries", icon: ListChecks, group: "Insurance" },
  { label: "Documents", slug: "documents", icon: FileText, group: "Insurance" },
  { label: "Patient Insurance", slug: "patient-insurance", icon: Users, group: "Records" },
  { label: "Hospital Calendar", slug: "calendar", icon: Calendar, group: "Records" },
  { label: "History", slug: "history", icon: History, group: "Records" },
];

export const NAV_BY_ROLE: Record<UserRole, NavItem[]> = {
  director: directorNav,
  receptionist: receptionistNav,
  sister: sisterNav,
  rmo: rmoNav,
  tpa: tpaNav,
};
