export type DayOfWeek =
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY"
  | "SUNDAY";

export type SessionType = "LECTURE" | "TUTORIAL" | "LAB" | "WORKSHOP" | "OTHER";
export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";
export type TaskPriority = "LOW" | "MEDIUM" | "HIGH";
export type TaskCategory = "GENERAL" | "HOMEWORK" | "REVISION" | "ADMIN" | "PROJECT";
export type AssessmentType =
  | "HOMEWORK"
  | "ASSIGNMENT"
  | "QUIZ"
  | "TEST"
  | "EXAM"
  | "PRESENTATION";
export type AssessmentStatus = "PENDING" | "SUBMITTED" | "COMPLETED";
export type FileCategory = "LECTURE_NOTE" | "TUTORIAL" | "ASSIGNMENT" | "PAST_YEAR" | "OTHER";
export type ResultStatus = "EXPECTED" | "RELEASED";
export type LetterGrade =
  | "A+"
  | "A"
  | "A-"
  | "B+"
  | "B"
  | "B-"
  | "C+"
  | "C"
  | "C-"
  | "D+"
  | "D"
  | "F";

export type Semester = {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Course = {
  id: string;
  code: string;
  name: string;
  lecturerName: string;
  color: string;
  semesterId: string;
  createdAt: string;
  updatedAt: string;
};

export type ClassSession = {
  id: string;
  courseId: string;
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
  location: string;
  sessionType: SessionType;
  createdAt: string;
  updatedAt: string;
};

export type TaskItem = {
  id: string;
  title: string;
  description: string;
  category: TaskCategory;
  status: TaskStatus;
  priority: TaskPriority;
  dueAt: string | null;
  courseId: string | null;
  createdAt: string;
  updatedAt: string;
};

export type Assessment = {
  id: string;
  title: string;
  type: AssessmentType;
  dueAt: string;
  weight: number | null;
  status: AssessmentStatus;
  courseId: string;
  createdAt: string;
  updatedAt: string;
};

export type CourseFile = {
  id: string;
  title: string;
  fileName: string;
  fileDataUrl: string;
  mimeType: string;
  sizeBytes: number;
  fileCategory: FileCategory;
  courseId: string;
  createdAt: string;
  updatedAt: string;
};

export type CourseResult = {
  id: string;
  courseId: string;
  semesterId: string;
  title: string;
  creditHours: number;
  score: number | null;
  grade: LetterGrade;
  gradePoint: number;
  status: ResultStatus;
  notes: string;
  createdAt: string;
  updatedAt: string;
};

export type StudentCoreState = {
  semesters: Semester[];
  courses: Course[];
  sessions: ClassSession[];
  tasks: TaskItem[];
  assessments: Assessment[];
  files: CourseFile[];
  results: CourseResult[];
};

export type TodayClassCard = {
  id: string;
  courseCode: string;
  courseName: string;
  startTime: string;
  endTime: string;
  location: string;
  sessionType: string;
  color: string;
};

export type UpcomingDeadlineItem = {
  id: string;
  kind: "task" | "assessment";
  title: string;
  courseName: string;
  dueAt: string;
  status: string;
};

export type SemesterResultSummary = {
  semesterId: string;
  semesterName: string;
  totalCredits: number;
  weightedGradePoints: number;
  gpa: number;
  resultsCount: number;
};
