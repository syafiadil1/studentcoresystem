import { isAfter, isBefore, startOfToday } from "date-fns";
import { differenceInCalendarDays } from "date-fns";
import { dayOrder } from "@/lib/constants";
import type {
  Course,
  Semester,
  StudentCoreState,
  TaskItem,
  TodayClassCard,
  UpcomingDeadlineItem,
} from "@/lib/types";

export function getCourseMap(courses: Course[]) {
  return new Map(courses.map((course) => [course.id, course]));
}

export function getSemesterMap(semesters: Semester[]) {
  return new Map(semesters.map((semester) => [semester.id, semester]));
}

export function getDashboardData(state: StudentCoreState) {
  const today = startOfToday();
  const dayIndex = (today.getDay() + 6) % 7;
  const todayName = dayOrder[dayIndex];
  const courseMap = getCourseMap(state.courses);

  const todayClasses: TodayClassCard[] = state.sessions
    .filter((session) => session.dayOfWeek === todayName)
    .sort((a, b) => a.startTime.localeCompare(b.startTime))
    .map((session) => {
      const course = courseMap.get(session.courseId);

      return {
        id: session.id,
        courseCode: course?.code || "Unknown",
        courseName: course?.name || "Removed course",
        startTime: session.startTime,
        endTime: session.endTime,
        location: session.location,
        sessionType: session.sessionType,
        color: course?.color || "#6b7280",
      };
    });

  const taskSummary = {
    todo: state.tasks.filter((task) => task.status === "TODO").length,
    inProgress: state.tasks.filter((task) => task.status === "IN_PROGRESS").length,
    done: state.tasks.filter((task) => task.status === "DONE").length,
  };

  const now = new Date();
  const overdueTasks = state.tasks
    .filter((task) => task.dueAt && isBefore(new Date(task.dueAt), now) && task.status !== "DONE")
    .sort(sortByDueAt)
    .slice(0, 5);

  const dueSoonTasks = state.tasks
    .filter((task) => task.dueAt && isAfter(new Date(task.dueAt), now) && task.status !== "DONE")
    .sort(sortByDueAt)
    .slice(0, 5);

  const upcomingAssessments: UpcomingDeadlineItem[] = state.assessments
    .slice()
    .sort((a, b) => new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime())
    .slice(0, 6)
    .map((assessment) => ({
      id: assessment.id,
      kind: "assessment",
      title: assessment.title,
      courseName: courseMap.get(assessment.courseId)?.name || "Removed course",
      dueAt: assessment.dueAt,
      status: assessment.status,
    }));

  const activeSemester = state.semesters.find((semester) => semester.isActive) || null;
  const activeSemesterSummary = activeSemester
    ? (() => {
        const totalDays = Math.max(
          differenceInCalendarDays(new Date(activeSemester.endDate), new Date(activeSemester.startDate)),
          1,
        );
        const elapsedDays = Math.min(
          Math.max(differenceInCalendarDays(new Date(), new Date(activeSemester.startDate)), 0),
          totalDays,
        );
        return {
          ...activeSemester,
          totalDays,
          elapsedDays,
          remainingDays: Math.max(totalDays - elapsedDays, 0),
          progressPercent: Math.round((elapsedDays / totalDays) * 100),
        };
      })()
    : null;

  return { todayClasses, taskSummary, overdueTasks, dueSoonTasks, upcomingAssessments, activeSemesterSummary };
}

export function getCoursesPageData(state: StudentCoreState) {
  return state.semesters
    .slice()
    .sort((a, b) => Number(b.isActive) - Number(a.isActive) || b.startDate.localeCompare(a.startDate))
    .map((semester) => ({
      ...semester,
      courses: state.courses
        .filter((course) => course.semesterId === semester.id)
        .sort((a, b) => a.code.localeCompare(b.code))
        .map((course) => ({
          ...course,
          sessions: state.sessions.filter((session) => session.courseId === course.id),
          tasks: state.tasks.filter((task) => task.courseId === course.id),
          assessments: state.assessments.filter((assessment) => assessment.courseId === course.id),
          files: state.files.filter((file) => file.courseId === course.id),
        })),
    }));
}

export function getCourseDetail(state: StudentCoreState, courseId: string) {
  const course = state.courses.find((entry) => entry.id === courseId);

  if (!course) {
    return null;
  }

  const semester = state.semesters.find((entry) => entry.id === course.semesterId) || null;

  return {
    ...course,
    semester,
    sessions: state.sessions
      .filter((session) => session.courseId === course.id)
      .sort((a, b) => dayOrder.indexOf(a.dayOfWeek) - dayOrder.indexOf(b.dayOfWeek) || a.startTime.localeCompare(b.startTime)),
    tasks: state.tasks
      .filter((task) => task.courseId === course.id)
      .sort(sortTasks),
    assessments: state.assessments
      .filter((assessment) => assessment.courseId === course.id)
      .sort((a, b) => a.dueAt.localeCompare(b.dueAt)),
    files: state.files
      .filter((file) => file.courseId === course.id)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
  };
}

export function getTimetableData(state: StudentCoreState) {
  const courseMap = getCourseMap(state.courses);

  return state.sessions
    .slice()
    .sort((a, b) => dayOrder.indexOf(a.dayOfWeek) - dayOrder.indexOf(b.dayOfWeek) || a.startTime.localeCompare(b.startTime))
    .map((session) => ({
      ...session,
      course: courseMap.get(session.courseId)!,
    }))
    .filter((session) => Boolean(session.course));
}

export function getTaskPageData(state: StudentCoreState, filters: { courseId?: string; status?: string }) {
  const courseMap = getCourseMap(state.courses);

  return {
    courses: state.courses.slice().sort((a, b) => a.code.localeCompare(b.code)),
    tasks: state.tasks
      .filter((task) => !filters.courseId || task.courseId === filters.courseId)
      .filter((task) => !filters.status || task.status === filters.status)
      .sort(sortTasks)
      .map((task) => ({
        ...task,
        course: task.courseId ? courseMap.get(task.courseId) || null : null,
      })),
  };
}

export function getAssessmentPageData(
  state: StudentCoreState,
  filters: { courseId?: string; status?: string; type?: string },
) {
  const courseMap = getCourseMap(state.courses);

  return {
    courses: state.courses.slice().sort((a, b) => a.code.localeCompare(b.code)),
    assessments: state.assessments
      .filter((assessment) => !filters.courseId || assessment.courseId === filters.courseId)
      .filter((assessment) => !filters.status || assessment.status === filters.status)
      .filter((assessment) => !filters.type || assessment.type === filters.type)
      .sort((a, b) => a.dueAt.localeCompare(b.dueAt))
      .map((assessment) => ({
        ...assessment,
        course: courseMap.get(assessment.courseId)!,
      }))
      .filter((assessment) => Boolean(assessment.course)),
  };
}

function sortByDueAt(a: TaskItem, b: TaskItem) {
  if (!a.dueAt && !b.dueAt) return 0;
  if (!a.dueAt) return 1;
  if (!b.dueAt) return -1;
  return a.dueAt.localeCompare(b.dueAt);
}

function sortTasks(a: TaskItem, b: TaskItem) {
  return sortByDueAt(a, b) || b.createdAt.localeCompare(a.createdAt);
}
