import type { Assessment, ClassSession, Course, CourseResult, Semester, TaskItem } from "@/lib/types";

const now = "2026-07-30T23:00:00.000Z";

/* ── COLOR PALETTE (distinguishable, muted) ──────────────────────────────── */
const COURSE_COLORS = [
  "#E16A54", "#5DADE2", "#58D68D", "#F4D03F", "#AF7AC5",
  "#F0B27A", "#48C9B0", "#EC7063", "#85C1E9", "#D7BDE2",
];

const COLOR = (i: number) => COURSE_COLORS[i % COURSE_COLORS.length];

const A = (i: number) => {
  const d = new Date(now);
  d.setDate(d.getDate() + i);
  return d.toISOString().slice(0, 16);
};
const DAY = (day: number, hour: number, min = 0) => {
  return `${String(hour).padStart(2, "0")}:${String(min).padStart(2, "0")}`;
};
const D = DAY;

export const seedSemesters: Omit<Semester, "id" | "createdAt" | "updatedAt">[] = [
  { name: "Semester 1 (2024/2025)", startDate: "2024-10-14", endDate: "2025-02-16", isActive: false },
  { name: "Semester 2 (2024/2025)", startDate: "2025-03-17", endDate: "2025-07-20", isActive: false },
  { name: "Semester 3 (2025/2026)", startDate: "2025-10-13", endDate: "2026-02-15", isActive: false },
  { name: "Semester 4 (2025/2026)", startDate: "2026-03-16", endDate: "2026-07-19", isActive: true },
];

export const seedCourses: Omit<Course, "id" | "createdAt" | "updatedAt">[] = [
  // ── SEMESTER 1 ────────────────────────────────────────────────────────────
  { code: "CSC402", name: "Programming I", lecturerName: "Dr. Noraini Ibrahim", color: COLOR(0), semesterId: "__S1__" },
  { code: "CSC413", name: "Interactive Multimedia", lecturerName: "Pn. Siti Fatimah Mohd", color: COLOR(1), semesterId: "__S1__" },
  { code: "CSC429", name: "Computer Organization and Architecture", lecturerName: "En. Ahmad Fauzi Hamzah", color: COLOR(2), semesterId: "__S1__" },
  { code: "ICT450", name: "Database Design and Development", lecturerName: "Dr. Zuraidah Sulaiman", color: COLOR(3), semesterId: "__S1__" },
  { code: "MAT406", name: "Foundation Mathematics", lecturerName: "Pn. Rosmawati Ali", color: COLOR(4), semesterId: "__S1__" },

  // ── SEMESTER 2 ────────────────────────────────────────────────────────────
  { code: "CSC404", name: "Programming II", lecturerName: "Dr. Noraini Ibrahim", color: COLOR(0), semesterId: "__S2__" },
  { code: "ICT502", name: "Database Engineering", lecturerName: "Dr. Zuraidah Sulaiman", color: COLOR(3), semesterId: "__S2__" },
  { code: "ITT400", name: "Data Communication and Networking", lecturerName: "En. Mohd Ridzuan Azmi", color: COLOR(6), semesterId: "__S2__" },
  { code: "MAT421", name: "Calculus I", lecturerName: "Dr. Khairul Anwar Mat", color: COLOR(5), semesterId: "__S2__" },
  { code: "STA416", name: "Applied Probability and Statistics", lecturerName: "Pn. Haslinda Hassan", color: COLOR(7), semesterId: "__S2__" },

  // ── SEMESTER 3 ────────────────────────────────────────────────────────────
  { code: "CSC435", name: "Object-Oriented Programming", lecturerName: "En. Rizal Mohd Noor", color: COLOR(8), semesterId: "__S3__" },
  { code: "CSC510", name: "Discrete Structures", lecturerName: "Dr. Nurulhuda Ahmad", color: COLOR(9), semesterId: "__S3__" },
  { code: "CSC520", name: "Principles of Operating Systems", lecturerName: "En. Faizal Rahman", color: COLOR(2), semesterId: "__S3__" },
  { code: "CSC583", name: "AI Algorithms", lecturerName: "Dr. Azura Che Hassan", color: COLOR(4), semesterId: "__S3__" },
  { code: "MAT423", name: "Linear Algebra I", lecturerName: "Dr. Khairul Anwar Mat", color: COLOR(5), semesterId: "__S3__" },

  // ── SEMESTER 4 (ACTIVE, March–July 2026) ─────────────────────────────────
  { code: "CSC508", name: "Data Structures", lecturerName: "Dr. Ruzanna Ismail", color: COLOR(0), semesterId: "__S4__" },
  { code: "CSC569", name: "Principles of Compilers", lecturerName: "En. Hafizuddin Kamal", color: COLOR(1), semesterId: "__S4__" },
  { code: "CSC577", name: "Software Engineering — Theories and Principles", lecturerName: "Pn. Azlina Harun", color: COLOR(2), semesterId: "__S4__" },
  { code: "CSC584", name: "Enterprise Programming", lecturerName: "Dr. Mohd Firdaus Azizan", color: COLOR(3), semesterId: "__S4__" },
  { code: "CSC574", name: "Dynamic Web Application Development", lecturerName: "En. Amirul Syafiq Rosli", color: COLOR(6), semesterId: "__S4__" },
  { code: "LCC500", name: "English for Workplace Communication", lecturerName: "Pn. Mary Anne George", color: COLOR(7), semesterId: "__S4__" },
];

export const seedSessions: Omit<ClassSession, "id" | "createdAt" | "updatedAt">[] = [
  /* MONDAY */
  { courseId: "__CSC508__", dayOfWeek: "MONDAY", startTime: D(1, 10), endTime: D(1, 12), location: "Dewan Kuliah 5", sessionType: "LECTURE" },
  { courseId: "__CSC569__", dayOfWeek: "MONDAY", startTime: D(1, 14), endTime: D(1, 16), location: "Bilik Seminar A", sessionType: "LECTURE" },

  /* TUESDAY */
  { courseId: "__CSC577__", dayOfWeek: "TUESDAY", startTime: D(2, 8), endTime: D(2, 10), location: "Dewan Kuliah 3", sessionType: "LECTURE" },
  { courseId: "__CSC577__", dayOfWeek: "TUESDAY", startTime: D(2, 10), endTime: D(2, 12), location: "Makmal Komputer 2", sessionType: "TUTORIAL" },
  { courseId: "__CSC584__", dayOfWeek: "TUESDAY", startTime: D(2, 14), endTime: D(2, 17), location: "Makmal Komputer 4", sessionType: "LAB" },

  /* WEDNESDAY */
  { courseId: "__LCC500__", dayOfWeek: "WEDNESDAY", startTime: D(3, 10), endTime: D(3, 12), location: "Bilik Tutorial 7", sessionType: "TUTORIAL" },
  { courseId: "__CSC574__", dayOfWeek: "WEDNESDAY", startTime: D(3, 14), endTime: D(3, 17), location: "Makmal Komputer 5", sessionType: "LAB" },

  /* THURSDAY (today — July 30, 2026 is Thursday) */
  { courseId: "__CSC508__", dayOfWeek: "THURSDAY", startTime: D(4, 8), endTime: D(4, 10), location: "Makmal Komputer 1", sessionType: "TUTORIAL" },
  { courseId: "__CSC508__", dayOfWeek: "THURSDAY", startTime: D(4, 10, 30), endTime: D(4, 12, 30), location: "Makmal Komputer 1", sessionType: "LAB" },
  { courseId: "__CSC584__", dayOfWeek: "THURSDAY", startTime: D(4, 14), endTime: D(4, 16), location: "Dewan Kuliah 8", sessionType: "LECTURE" },

  /* FRIDAY */
  { courseId: "__CSC569__", dayOfWeek: "FRIDAY", startTime: D(5, 8), endTime: D(5, 10), location: "Makmal Komputer 3", sessionType: "TUTORIAL" },
  { courseId: "__CSC574__", dayOfWeek: "FRIDAY", startTime: D(5, 10), endTime: D(5, 12), location: "Dewan Kuliah 2", sessionType: "LECTURE" },
];

export const seedTasks: Omit<TaskItem, "id" | "createdAt" | "updatedAt">[] = [
  // Overdue (before today)
  { title: "Implement BST insertion and deletion", description: "Code a binary search tree with insert, search, and delete operations in Java.", category: "HOMEWORK", status: "TODO", priority: "HIGH", dueAt: A(-2), courseId: "__CSC508__" },
  { title: "Write lexical analyser spec", description: "Define the token specification and write a lex specification for a mini-language.", category: "HOMEWORK", status: "IN_PROGRESS", priority: "HIGH", dueAt: A(-1), courseId: "__CSC569__" },
  { title: "Complete Chapter 4 SOGA exercises", description: "Finish exercises 4.1 through 4.8 from the prescribed textbook.", category: "REVISION", status: "TODO", priority: "MEDIUM", dueAt: A(-3), courseId: "__CSC577__" },
  { title: "Submit lab report Week 13", description: "Lab report covering Servlet filters and session management.", category: "HOMEWORK", status: "TODO", priority: "MEDIUM", dueAt: A(-1), courseId: "__CSC584__" },

  // Due soon (today / next few days)
  { title: "Prepare sprint retrospective", description: "Document what went well, what didn't, and action items from Sprint 3.", category: "PROJECT", status: "IN_PROGRESS", priority: "MEDIUM", dueAt: A(0), courseId: "__CSC577__" },
  { title: "Fix CORS issue in React frontend", description: "The SPA can't reach the Spring Boot API. Add a proxy or configure CORS.", category: "PROJECT", status: "TODO", priority: "HIGH", dueAt: A(1), courseId: "__CSC574__" },
  { title: "Revise context-free grammars for test", description: "Go through parsing techniques, LL(1), LR(0), and ambiguity.", category: "REVISION", status: "TODO", priority: "HIGH", dueAt: A(3), courseId: "__CSC569__" },
  { title: "Register for next semester courses", description: "Check ICEPS for course availability and register before the deadline.", category: "ADMIN", status: "TODO", priority: "MEDIUM", dueAt: A(5), courseId: null },

  // Upcoming / future
  { title: "Implement heap sort and benchmark", description: "Implement min-heap, heap sort, and compare performance against quick sort.", category: "HOMEWORK", status: "TODO", priority: "LOW", dueAt: A(7), courseId: "__CSC508__" },
  { title: "Draft presentation slides for mini-project", description: "Prepare 10-minute deck: problem, approach, demo, results.", category: "PROJECT", status: "TODO", priority: "MEDIUM", dueAt: A(10), courseId: "__CSC584__" },
  { title: "Submit group assignment wireframes", description: "Low-fidelity mockups for the bookstore web app group project.", category: "PROJECT", status: "TODO", priority: "LOW", dueAt: A(12), courseId: "__CSC574__" },

  // DONE tasks for stats
  { title: "Complete SRS document section 3", description: "Functional requirements for the student management module.", category: "PROJECT", status: "DONE", priority: "HIGH", dueAt: A(-5), courseId: "__CSC577__" },
  { title: "Write unit tests for hash table", description: "JUnit tests covering all collision strategies.", category: "HOMEWORK", status: "DONE", priority: "MEDIUM", dueAt: A(-7), courseId: "__CSC508__" },
  { title: "Submit annotated bibliography", description: "Five sources for workplace communication research paper.", category: "HOMEWORK", status: "DONE", priority: "LOW", dueAt: A(-10), courseId: "__LCC500__" },
];

export const seedAssessments: Omit<Assessment, "id" | "createdAt" | "updatedAt">[] = [
  { title: "Data Structures Test 2", type: "TEST", dueAt: A(4), weight: 15, status: "PENDING", courseId: "__CSC508__" },
  { title: "Lab Assignment 3 — AVL Trees", type: "ASSIGNMENT", dueAt: A(6), weight: 10, status: "PENDING", courseId: "__CSC508__" },
  { title: "Compilers Mid-Semester Test", type: "TEST", dueAt: A(2), weight: 15, status: "PENDING", courseId: "__CSC569__" },
  { title: "Parser Implementation", type: "ASSIGNMENT", dueAt: A(9), weight: 15, status: "PENDING", courseId: "__CSC569__" },
  { title: "SE Sprint 3 — Delivery & Demo", type: "PRESENTATION", dueAt: A(3), weight: 10, status: "PENDING", courseId: "__CSC577__" },
  { title: "Software Design Document", type: "ASSIGNMENT", dueAt: A(14), weight: 20, status: "PENDING", courseId: "__CSC577__" },
  { title: "Enterprise Programming Lab Test", type: "TEST", dueAt: A(7), weight: 15, status: "PENDING", courseId: "__CSC584__" },
  { title: "REST API Microservice Assignment", type: "ASSIGNMENT", dueAt: A(11), weight: 20, status: "PENDING", courseId: "__CSC584__" },
  { title: "Web App — Frontend Prototype", type: "ASSIGNMENT", dueAt: A(8), weight: 15, status: "PENDING", courseId: "__CSC574__" },
  { title: "Dynamic Web — Quiz 3", type: "QUIZ", dueAt: A(1), weight: 5, status: "PENDING", courseId: "__CSC574__" },
  { title: "Workplace Communication — Report Draft", type: "ASSIGNMENT", dueAt: A(13), weight: 30, status: "PENDING", courseId: "__LCC500__" },
  { title: "Mock Interview", type: "PRESENTATION", dueAt: A(18), weight: 20, status: "PENDING", courseId: "__LCC500__" },

  // Completed assessments (for stats)
  { title: "Data Structures Test 1", type: "TEST", dueAt: A(-15), weight: 15, status: "COMPLETED", courseId: "__CSC508__" },
  { title: "Lab Assignment 1 — Linked Lists", type: "ASSIGNMENT", dueAt: A(-20), weight: 10, status: "COMPLETED", courseId: "__CSC508__" },
  { title: "SE Sprint 1 — Delivery", type: "PRESENTATION", dueAt: A(-25), weight: 10, status: "COMPLETED", courseId: "__CSC577__" },
  { title: "Enterprise Programming Assignment 1", type: "ASSIGNMENT", dueAt: A(-18), weight: 15, status: "COMPLETED", courseId: "__CSC584__" },
];

export const seedResults: Omit<CourseResult, "id" | "createdAt" | "updatedAt" | "gradePoint">[] = [
  /* Semester 1 */
  { courseId: "__CSC402_S1__", semesterId: "__S1__", title: "Final Result", creditHours: 3, grade: "A-", status: "RELEASED", notes: "" },
  { courseId: "__CSC413_S1__", semesterId: "__S1__", title: "Final Result", creditHours: 3, grade: "B+", status: "RELEASED", notes: "" },
  { courseId: "__CSC429_S1__", semesterId: "__S1__", title: "Final Result", creditHours: 3, grade: "A", status: "RELEASED", notes: "" },
  { courseId: "__ICT450_S1__", semesterId: "__S1__", title: "Final Result", creditHours: 3, grade: "A-", status: "RELEASED", notes: "" },
  { courseId: "__MAT406_S1__", semesterId: "__S1__", title: "Final Result", creditHours: 3, grade: "B", status: "RELEASED", notes: "" },

  /* Semester 2 */
  { courseId: "__CSC404_S2__", semesterId: "__S2__", title: "Final Result", creditHours: 3, grade: "A-", status: "RELEASED", notes: "" },
  { courseId: "__ICT502_S2__", semesterId: "__S2__", title: "Final Result", creditHours: 3, grade: "B+", status: "RELEASED", notes: "" },
  { courseId: "__ITT400_S2__", semesterId: "__S2__", title: "Final Result", creditHours: 3, grade: "B", status: "RELEASED", notes: "" },
  { courseId: "__MAT421_S2__", semesterId: "__S2__", title: "Final Result", creditHours: 3, grade: "B-", status: "RELEASED", notes: "" },
  { courseId: "__STA416_S2__", semesterId: "__S2__", title: "Final Result", creditHours: 3, grade: "A", status: "RELEASED", notes: "" },

  /* Semester 3 */
  { courseId: "__CSC435_S3__", semesterId: "__S3__", title: "Final Result", creditHours: 3, grade: "A-", status: "RELEASED", notes: "" },
  { courseId: "__CSC510_S3__", semesterId: "__S3__", title: "Final Result", creditHours: 3, grade: "B+", status: "RELEASED", notes: "" },
  { courseId: "__CSC520_S3__", semesterId: "__S3__", title: "Final Result", creditHours: 3, grade: "A", status: "RELEASED", notes: "" },
  { courseId: "__CSC583_S3__", semesterId: "__S3__", title: "Final Result", creditHours: 3, grade: "B", status: "RELEASED", notes: "" },
  { courseId: "__MAT423_S3__", semesterId: "__S3__", title: "Final Result", creditHours: 3, grade: "B+", status: "RELEASED", notes: "" },

  /* Semester 4 — EXPECTED (not yet released) */
  { courseId: "__CSC508_S4__", semesterId: "__S4__", title: "Expected Result", creditHours: 3, grade: "A-", status: "EXPECTED", notes: "Estimated based on 45/50 coursework" },
  { courseId: "__CSC569_S4__", semesterId: "__S4__", title: "Expected Result", creditHours: 3, grade: "B+", status: "EXPECTED", notes: "Estimated based on 42/50 coursework" },
  { courseId: "__CSC577_S4__", semesterId: "__S4__", title: "Expected Result", creditHours: 3, grade: "A", status: "EXPECTED", notes: "Estimated based on 47/50 coursework" },
  { courseId: "__CSC584_S4__", semesterId: "__S4__", title: "Expected Result", creditHours: 3, grade: "A-", status: "EXPECTED", notes: "Estimated based on 44/50 coursework" },
  { courseId: "__CSC574_S4__", semesterId: "__S4__", title: "Expected Result", creditHours: 3, grade: "B", status: "EXPECTED", notes: "Estimated based on 38/50 coursework" },
  { courseId: "__LCC500_S4__", semesterId: "__S4__", title: "Expected Result", creditHours: 2, grade: "A", status: "EXPECTED", notes: "Estimated based on 38/40 coursework" },
];
