"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { studentCoreStorageKey } from "@/lib/constants";
import type {
  Assessment,
  ClassSession,
  Course,
  CourseFile,
  CourseResult,
  Semester,
  StudentCoreState,
  TaskItem,
} from "@/lib/types";
import {
  seedAssessments,
  seedCourses,
  seedResults,
  seedSemesters,
  seedSessions,
  seedTasks,
} from "@/lib/seed-data";

const emptyState: StudentCoreState = {
  semesters: [],
  courses: [],
  sessions: [],
  tasks: [],
  assessments: [],
  files: [],
  results: [],
};

type CreateSemesterInput = Omit<Semester, "id" | "createdAt" | "updatedAt">;
type CreateCourseInput = Omit<Course, "id" | "createdAt" | "updatedAt">;
type CreateSessionInput = Omit<ClassSession, "id" | "createdAt" | "updatedAt">;
type CreateTaskInput = Omit<TaskItem, "id" | "createdAt" | "updatedAt">;
type CreateAssessmentInput = Omit<Assessment, "id" | "createdAt" | "updatedAt">;
type CreateResultInput = Omit<CourseResult, "id" | "createdAt" | "updatedAt" | "gradePoint">;

type UploadFileInput = {
  title: string;
  fileCategory: CourseFile["fileCategory"];
  courseId: string;
  file: File;
};

type StudentCoreContextValue = {
  hydrated: boolean;
  state: StudentCoreState;
  createSemester: (input: CreateSemesterInput) => void;
  updateSemester: (semesterId: string, input: CreateSemesterInput) => void;
  deleteSemester: (semesterId: string) => void;
  createCourse: (input: CreateCourseInput) => void;
  updateCourse: (courseId: string, input: CreateCourseInput) => void;
  deleteCourse: (courseId: string) => void;
  createSession: (input: CreateSessionInput) => void;
  updateSession: (sessionId: string, input: CreateSessionInput) => void;
  deleteSession: (sessionId: string) => void;
  createTask: (input: CreateTaskInput) => void;
  updateTask: (taskId: string, input: CreateTaskInput) => void;
  deleteTask: (taskId: string) => void;
  createAssessment: (input: CreateAssessmentInput) => void;
  updateAssessment: (assessmentId: string, input: CreateAssessmentInput) => void;
  deleteAssessment: (assessmentId: string) => void;
  createResult: (input: CreateResultInput) => void;
  updateResult: (resultId: string, input: CreateResultInput) => void;
  deleteResult: (resultId: string) => void;
  uploadFile: (input: UploadFileInput) => Promise<void>;
  deleteFile: (fileId: string) => void;
  exportWorkspace: () => void;
  importWorkspace: (file: File) => Promise<void>;
  resetWorkspace: () => void;
};

const StudentCoreContext = createContext<StudentCoreContextValue | null>(null);

const gradePointMap: Record<CourseResult["grade"], number> = {
  "A+": 4,
  A: 4,
  "A-": 3.67,
  "B+": 3.33,
  B: 3,
  "B-": 2.67,
  "C+": 2.33,
  C: 2,
  "C-": 1.67,
  "D+": 1.33,
  D: 1,
  F: 0,
};

function stamp<T extends object>(payload: T) {
  const now = new Date().toISOString();
  return {
    ...payload,
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
  };
}

function touch<T extends { createdAt: string; updatedAt: string; id: string }>(existing: T, payload: Omit<T, "id" | "createdAt" | "updatedAt">) {
  return {
    ...existing,
    ...payload,
    updatedAt: new Date().toISOString(),
  };
}

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function readFileAsText(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}

function withGradePoint<T extends { grade: CourseResult["grade"] }>(payload: T) {
  return {
    ...payload,
    gradePoint: gradePointMap[payload.grade],
  };
}

function seedState(): StudentCoreState {
  const semesterIds: string[] = [];
  const semesters: Semester[] = seedSemesters.map((s) => {
    const id = crypto.randomUUID();
    semesterIds.push(id);
    return { ...s, id, createdAt: "2026-07-30T00:00:00.000Z", updatedAt: "2026-07-30T00:00:00.000Z" };
  });

  const placeholders = ["__S1__", "__S2__", "__S3__", "__S4__"] as const;

  const courseIdMap = new Map<string, string>();
  const courses: Course[] = seedCourses.map((c) => {
    const id = crypto.randomUUID();
    const placeholderIndex = placeholders.indexOf(c.semesterId as typeof placeholders[number]);
    const semesterId = placeholderIndex >= 0 ? semesterIds[placeholderIndex] : c.semesterId;

    courseIdMap.set(c.code, id);
    return { ...c, id, semesterId, createdAt: "2026-07-30T00:00:00.000Z", updatedAt: "2026-07-30T00:00:00.000Z" };
  });

  const getCourseId = (key: string) => {
    const code = key.startsWith("__") ? key.replace(/^__|__$/g, "") : key;
    return courseIdMap.get(code) ?? "";
  };

  const sessions: ClassSession[] = seedSessions.map((s) => ({
    ...s,
    id: crypto.randomUUID(),
    courseId: getCourseId(s.courseId),
    createdAt: "2026-07-30T00:00:00.000Z",
    updatedAt: "2026-07-30T00:00:00.000Z",
  }));

  const tasks: TaskItem[] = seedTasks.map((t) => ({
    ...t,
    id: crypto.randomUUID(),
    courseId: t.courseId ? getCourseId(t.courseId) : null,
    createdAt: "2026-07-30T00:00:00.000Z",
    updatedAt: "2026-07-30T00:00:00.000Z",
  }));

  const assessments: Assessment[] = seedAssessments.map((a) => ({
    ...a,
    id: crypto.randomUUID(),
    courseId: getCourseId(a.courseId),
    createdAt: "2026-07-30T00:00:00.000Z",
    updatedAt: "2026-07-30T00:00:00.000Z",
  }));

  const gradePointMap: Record<CourseResult["grade"], number> = {
    "A+": 4, A: 4, "A-": 3.67, "B+": 3.33, B: 3, "B-": 2.67,
    "C+": 2.33, C: 2, "C-": 1.67, "D+": 1.33, D: 1, F: 0,
  };

  const getSemesterId = (key: string) => {
    const idx = placeholders.indexOf(key as typeof placeholders[number]);
    return idx >= 0 ? semesterIds[idx] : key;
  };
  const getResultCourseId = (key: string) => {
    const cleaned = key.startsWith("__") ? key.replace(/^__|__$/g, "") : key;
    const code = cleaned.replace(/_S[1-4]$/, "");
    return courseIdMap.get(code) ?? "";
  };

  const results: CourseResult[] = seedResults.map((r) => ({
    ...r,
    id: crypto.randomUUID(),
    courseId: getResultCourseId(r.courseId),
    semesterId: getSemesterId(r.semesterId),
    gradePoint: gradePointMap[r.grade],
    createdAt: "2026-07-30T00:00:00.000Z",
    updatedAt: "2026-07-30T00:00:00.000Z",
  }));

  return { semesters, courses, sessions, tasks, assessments, files: [], results };
}

export function StudentCoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<StudentCoreState>(emptyState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(studentCoreStorageKey);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<StudentCoreState>;
        setState({
          ...emptyState,
          ...parsed,
          semesters: Array.isArray(parsed.semesters) ? parsed.semesters : [],
          courses: Array.isArray(parsed.courses) ? parsed.courses : [],
          sessions: Array.isArray(parsed.sessions) ? parsed.sessions : [],
          tasks: Array.isArray(parsed.tasks) ? parsed.tasks : [],
          assessments: Array.isArray(parsed.assessments) ? parsed.assessments : [],
          files: Array.isArray(parsed.files) ? parsed.files : [],
          results: Array.isArray(parsed.results) ? parsed.results : [],
        });
      } else {
        setState(seedState());
      }
    } catch {
      window.localStorage.removeItem(studentCoreStorageKey);
      setState(seedState());
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    window.localStorage.setItem(studentCoreStorageKey, JSON.stringify(state));
  }, [hydrated, state]);

  const value = useMemo<StudentCoreContextValue>(
    () => ({
      hydrated,
      state,
      createSemester(input) {
        setState((current) => {
          const semesters = input.isActive
            ? current.semesters.map((semester) => ({ ...semester, isActive: false }))
            : current.semesters;

          return {
            ...current,
            semesters: [...semesters, stamp(input)],
          };
        });
      },
      updateSemester(semesterId, input) {
        setState((current) => {
          const semesters = input.isActive
            ? current.semesters.map((semester) => ({ ...semester, isActive: false }))
            : current.semesters;

          return {
            ...current,
            semesters: semesters.map((semester) =>
              semester.id === semesterId ? touch(semester, input) : semester,
            ),
          };
        });
      },
      deleteSemester(semesterId) {
        setState((current) => {
          const courseIds = current.courses
            .filter((course) => course.semesterId === semesterId)
            .map((course) => course.id);

          return {
            semesters: current.semesters.filter((semester) => semester.id !== semesterId),
            courses: current.courses.filter((course) => course.semesterId !== semesterId),
            sessions: current.sessions.filter((session) => !courseIds.includes(session.courseId)),
            tasks: current.tasks.filter((task) => !task.courseId || !courseIds.includes(task.courseId)),
            assessments: current.assessments.filter(
              (assessment) => !courseIds.includes(assessment.courseId),
            ),
            files: current.files.filter((file) => !courseIds.includes(file.courseId)),
            results: current.results.filter((result) => !courseIds.includes(result.courseId)),
          };
        });
      },
      createCourse(input) {
        setState((current) => ({
          ...current,
          courses: [...current.courses, stamp(input)],
        }));
      },
      updateCourse(courseId, input) {
        setState((current) => ({
          ...current,
          courses: current.courses.map((course) =>
            course.id === courseId ? touch(course, input) : course,
          ),
        }));
      },
      deleteCourse(courseId) {
        setState((current) => ({
          ...current,
          courses: current.courses.filter((course) => course.id !== courseId),
          sessions: current.sessions.filter((session) => session.courseId !== courseId),
          tasks: current.tasks.filter((task) => task.courseId !== courseId),
          assessments: current.assessments.filter((assessment) => assessment.courseId !== courseId),
          files: current.files.filter((file) => file.courseId !== courseId),
          results: current.results.filter((result) => result.courseId !== courseId),
        }));
      },
      createSession(input) {
        setState((current) => ({
          ...current,
          sessions: [...current.sessions, stamp(input)],
        }));
      },
      updateSession(sessionId, input) {
        setState((current) => ({
          ...current,
          sessions: current.sessions.map((session) =>
            session.id === sessionId ? touch(session, input) : session,
          ),
        }));
      },
      deleteSession(sessionId) {
        setState((current) => ({
          ...current,
          sessions: current.sessions.filter((session) => session.id !== sessionId),
        }));
      },
      createTask(input) {
        setState((current) => ({
          ...current,
          tasks: [...current.tasks, stamp(input)],
        }));
      },
      updateTask(taskId, input) {
        setState((current) => ({
          ...current,
          tasks: current.tasks.map((task) => (task.id === taskId ? touch(task, input) : task)),
        }));
      },
      deleteTask(taskId) {
        setState((current) => ({
          ...current,
          tasks: current.tasks.filter((task) => task.id !== taskId),
        }));
      },
      createAssessment(input) {
        setState((current) => ({
          ...current,
          assessments: [...current.assessments, stamp(input)],
        }));
      },
      updateAssessment(assessmentId, input) {
        setState((current) => ({
          ...current,
          assessments: current.assessments.map((assessment) =>
            assessment.id === assessmentId ? touch(assessment, input) : assessment,
          ),
        }));
      },
      deleteAssessment(assessmentId) {
        setState((current) => ({
          ...current,
          assessments: current.assessments.filter((assessment) => assessment.id !== assessmentId),
        }));
      },
      createResult(input) {
        setState((current) => ({
          ...current,
          results: [...current.results, stamp(withGradePoint(input))],
        }));
      },
      updateResult(resultId, input) {
        setState((current) => ({
          ...current,
          results: current.results.map((result) =>
            result.id === resultId ? touch(result, withGradePoint(input)) : result,
          ),
        }));
      },
      deleteResult(resultId) {
        setState((current) => ({
          ...current,
          results: current.results.filter((result) => result.id !== resultId),
        }));
      },
      async uploadFile(input) {
        const fileDataUrl = await readFileAsDataUrl(input.file);

        setState((current) => ({
          ...current,
          files: [
            ...current.files,
            stamp({
              title: input.title,
              fileCategory: input.fileCategory,
              courseId: input.courseId,
              fileName: input.file.name,
              fileDataUrl,
              mimeType: input.file.type || "application/octet-stream",
              sizeBytes: input.file.size,
            }),
          ],
        }));
      },
      deleteFile(fileId) {
        setState((current) => ({
          ...current,
          files: current.files.filter((file) => file.id !== fileId),
        }));
      },
      exportWorkspace() {
        const payload = {
          exportedAt: new Date().toISOString(),
          app: "StudentCore",
          version: 1,
          state,
        };
        const blob = new Blob([JSON.stringify(payload, null, 2)], {
          type: "application/json",
        });
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = `studentcore-backup-${new Date().toISOString().slice(0, 10)}.json`;
        anchor.click();
        URL.revokeObjectURL(url);
      },
      async importWorkspace(file) {
        const raw = await readFileAsText(file);
        const parsed = JSON.parse(raw) as { state?: StudentCoreState } | StudentCoreState;
        const nextState = "state" in parsed && parsed.state ? parsed.state : (parsed as StudentCoreState);

        if (
          !nextState ||
          !Array.isArray(nextState.semesters) ||
          !Array.isArray(nextState.courses) ||
          !Array.isArray(nextState.sessions) ||
          !Array.isArray(nextState.tasks) ||
          !Array.isArray(nextState.assessments) ||
          !Array.isArray(nextState.files)
        ) {
          throw new Error("Invalid StudentCore backup file.");
        }

        setState({
          ...nextState,
          semesters: Array.isArray(nextState.semesters) ? nextState.semesters : [],
          courses: Array.isArray(nextState.courses) ? nextState.courses : [],
          sessions: Array.isArray(nextState.sessions) ? nextState.sessions : [],
          tasks: Array.isArray(nextState.tasks) ? nextState.tasks : [],
          assessments: Array.isArray(nextState.assessments) ? nextState.assessments : [],
          files: Array.isArray(nextState.files) ? nextState.files : [],
          results: Array.isArray(nextState.results) ? nextState.results : [],
        });
      },
      resetWorkspace() {
        setState(emptyState);
      },
    }),
    [hydrated, state],
  );

  return <StudentCoreContext.Provider value={value}>{children}</StudentCoreContext.Provider>;
}

export function useStudentCore() {
  const context = useContext(StudentCoreContext);

  if (!context) {
    throw new Error("useStudentCore must be used within StudentCoreProvider");
  }

  return context;
}
