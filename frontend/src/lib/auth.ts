// Client-side mock auth for the MHOS demo.
// Employees are created by the Director; only active employees may log in.

export type UserRole = "director" | "tpa" | "receptionist" | "sister" | "rmo";

export interface Employee {
  employeeId: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  role: UserRole;
  status: "Active" | "Inactive";
  joinedAt: string;
  password: string; // mock only
}

export interface SessionUser {
  role: UserRole;
  employeeId: string;
  name: string;
  department: string;
  loggedInAt: number;
}

const KEY = "mhos_session";

export const ROLE_META: Record<UserRole, { title: string; short: string; blurb: string }> = {
  director: {
    title: "Director",
    short: "Executive Office",
    blurb: "Unrestricted oversight of operations, staff, and audit trail.",
  },
  tpa: {
    title: "TPA — Insurance",
    short: "Insurance Desk",
    blurb: "Claims, queries, approvals, and patient policy records.",
  },
  receptionist: {
    title: "Receptionist",
    short: "Front Desk",
    blurb: "Admissions, rooms, billing tracker, rosters, and handovers.",
  },
  sister: {
    title: "Sister",
    short: "Nursing Station",
    blurb: "Assigned patients, vitals, indents, and shift handovers.",
  },
  rmo: {
    title: "Resident Medical Officer",
    short: "Clinical Floor",
    blurb: "Clinical notes, treatment progress, and patient timelines.",
  },
};

// Demo employees. In real product this comes from Director's employee module.
export const employees: Employee[] = [
  {
    employeeId: "MS-D-001",
    name: "Dr. Arvind Rao",
    email: "arvind.rao@medstar.in",
    phone: "+91 98800 11001",
    department: "Executive Office",
    role: "director",
    status: "Active",
    joinedAt: "2019-04-01",
    password: "medstar",
  },
  {
    employeeId: "MS-R-014",
    name: "Priya Suresh",
    email: "priya.s@medstar.in",
    phone: "+91 98800 22014",
    department: "Reception — Ground",
    role: "receptionist",
    status: "Active",
    joinedAt: "2022-08-12",
    password: "medstar",
  },
  {
    employeeId: "MS-R-021",
    name: "Karthik Menon",
    email: "karthik.m@medstar.in",
    phone: "+91 98800 22021",
    department: "Reception — Ground",
    role: "receptionist",
    status: "Active",
    joinedAt: "2023-01-20",
    password: "medstar",
  },
  {
    employeeId: "MS-N-034",
    name: "Sister Anita",
    email: "anita@medstar.in",
    phone: "+91 98800 33034",
    department: "ICU Nursing",
    role: "sister",
    status: "Active",
    joinedAt: "2020-06-01",
    password: "medstar",
  },
  {
    employeeId: "MS-N-047",
    name: "Sister Meena",
    email: "meena@medstar.in",
    phone: "+91 98800 33047",
    department: "General Ward",
    role: "sister",
    status: "Active",
    joinedAt: "2021-11-15",
    password: "medstar",
  },
  {
    employeeId: "MS-M-009",
    name: "Dr. Vinay Bhat",
    email: "vinay.bhat@medstar.in",
    phone: "+91 98800 44009",
    department: "RMO — Medicine",
    role: "rmo",
    status: "Active",
    joinedAt: "2022-03-05",
    password: "medstar",
  },
  {
    employeeId: "MS-M-012",
    name: "Dr. Kapoor",
    email: "kapoor@medstar.in",
    phone: "+91 98800 44012",
    department: "RMO — Cardiology",
    role: "rmo",
    status: "Active",
    joinedAt: "2021-07-19",
    password: "medstar",
  },
  {
    employeeId: "MS-T-005",
    name: "Neha Iyer",
    email: "neha.i@medstar.in",
    phone: "+91 98800 55005",
    department: "Insurance Desk",
    role: "tpa",
    status: "Active",
    joinedAt: "2020-10-10",
    password: "medstar",
  },
  {
    employeeId: "MS-N-052",
    name: "Sister Lakshmi",
    email: "lakshmi@medstar.in",
    phone: "+91 98800 33052",
    department: "General Ward",
    role: "sister",
    status: "Inactive",
    joinedAt: "2019-02-11",
    password: "medstar",
  },
];

export function findEmployee(name: string, role: UserRole): Employee | undefined {
  return employees.find(
    (e) => e.name.toLowerCase().trim() === name.trim().toLowerCase() && e.role === role,
  );
}

// Mock login: any active employee of the matching role, any non-empty password.
export function attemptLogin(
  name: string,
  password: string,
  role: UserRole,
): { ok: true; user: SessionUser } | { ok: false; reason: string } {
  const emp = findEmployee(name, role);
  if (!emp) return { ok: false, reason: "No employee found with that Name for this role." };
  if (emp.status !== "Active")
    return { ok: false, reason: "This employee account is inactive. Contact the Director." };
  if (!password.trim()) return { ok: false, reason: "Please enter your password." };
  const user: SessionUser = {
    role: emp.role,
    employeeId: emp.employeeId,
    name: emp.name,
    department: emp.department,
    loggedInAt: Date.now(),
  };
  return { ok: true, user };
}

export function getSession(): SessionUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as SessionUser) : null;
  } catch {
    return null;
  }
}

export function setSession(user: SessionUser) {
  window.localStorage.setItem(KEY, JSON.stringify(user));
}

export function clearSession() {
  window.localStorage.removeItem(KEY);
}
