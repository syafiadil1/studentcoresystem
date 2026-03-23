import { isAfter, isBefore, startOfToday } from "date-fns";
import { differenceInCalendarDays } from "date-fns";
import { dayOrder } from "@/lib/constants";
import type {
  Course,
  SemesterResultSummary,
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

export function getResultsPageData(state: StudentCoreState) {
  const resultsSource = state.results ?? [];
  const semesterMap = getSemesterMap(state.semesters);
  const courseMap = getCourseMap(state.courses);

  const results = resultsSource
    .slice()
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .map((result) => ({
      ...result,
      course: courseMap.get(result.courseId) || null,
      semester: semesterMap.get(result.semesterId) || null,
    }));

  const summaries = state.semesters
    .map<SemesterResultSummary>((semester) => {
      const semesterResults = resultsSource.filter((result) => result.semesterId === semester.id);
      const totalCredits = semesterResults.reduce((sum, result) => sum + result.creditHours, 0);
      const weightedGradePoints = semesterResults.reduce(
        (sum, result) => sum + result.gradePoint * result.creditHours,
        0,
      );
      const gpa = totalCredits ? Number((weightedGradePoints / totalCredits).toFixed(2)) : 0;

      return {
        semesterId: semester.id,
        semesterName: semester.name,
        totalCredits,
        weightedGradePoints,
        gpa,
        resultsCount: semesterResults.length,
      };
    })
    .filter((summary) => summary.resultsCount > 0)
    .sort((a, b) => b.semesterName.localeCompare(a.semesterName));

  const totalCredits = summaries.reduce((sum, summary) => sum + summary.totalCredits, 0);
  const totalWeighted = summaries.reduce((sum, summary) => sum + summary.weightedGradePoints, 0);
  const cgpa = totalCredits ? Number((totalWeighted / totalCredits).toFixed(2)) : 0;

  return {
    courses: state.courses.slice().sort((a, b) => a.code.localeCompare(b.code)),
    semesters: state.semesters.slice().sort((a, b) => Number(b.isActive) - Number(a.isActive)),
    results,
    summaries,
    resultsBySemester: state.semesters.reduce<Record<string, typeof results>>((acc, semester) => {
      acc[semester.id] = results.filter((result) => result.semester?.id === semester.id);
      return acc;
    }, {}),
    cgpa,
    totalCredits,
  };
}

export function getCoursesPageData(state: StudentCoreState) {
  const results = state.results ?? [];
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
          results: results.filter((result) => result.courseId === course.id),
        })),
    }));
}

export function getCourseDetail(state: StudentCoreState, courseId: string) {
  const results = state.results ?? [];
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
    results: results
      .filter((result) => result.courseId === course.id)
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

export function getGlobalSearchData(state: StudentCoreState) {
  const courseMap = getCourseMap(state.courses);
  const semesterMap = getSemesterMap(state.semesters);

  return {
    courses: state.courses
      .slice()
      .sort((a, b) => a.code.localeCompare(b.code))
      .map((course) => ({
        ...course,
        semester: semesterMap.get(course.semesterId) || null,
      })),
    sessions: state.sessions
      .slice()
      .sort((a, b) => dayOrder.indexOf(a.dayOfWeek) - dayOrder.indexOf(b.dayOfWeek) || a.startTime.localeCompare(b.startTime))
      .map((session) => ({
        ...session,
        course: courseMap.get(session.courseId) || null,
      }))
      .filter((session) => Boolean(session.course)),
    tasks: state.tasks
      .slice()
      .sort(sortTasks)
      .map((task) => ({
        ...task,
        course: task.courseId ? courseMap.get(task.courseId) || null : null,
      })),
    assessments: state.assessments
      .slice()
      .sort((a, b) => a.dueAt.localeCompare(b.dueAt))
      .map((assessment) => ({
        ...assessment,
        course: courseMap.get(assessment.courseId) || null,
      }))
      .filter((assessment) => Boolean(assessment.course)),
    files: state.files
      .slice()
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .map((file) => ({
        ...file,
        course: courseMap.get(file.courseId) || null,
      }))
      .filter((file) => Boolean(file.course)),
    results: (state.results ?? [])
      .slice()
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .map((result) => ({
        ...result,
        course: courseMap.get(result.courseId) || null,
        semester: semesterMap.get(result.semesterId) || null,
      })),
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
