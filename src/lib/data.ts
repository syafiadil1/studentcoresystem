import { DayOfWeek, Prisma } from "@prisma/client";
import { isAfter, isBefore, startOfToday } from "date-fns";
import { prisma } from "@/lib/prisma";
import type { TodayClassCard, UpcomingDeadlineItem } from "@/lib/types";

const dashboardCourseInclude = {
  include: {
    course: true,
  },
} satisfies Prisma.ClassSessionDefaultArgs;

export async function getDashboardData() {
  const today = startOfToday();
  const dayIndex = (today.getDay() + 6) % 7;
  const todayName = [
    DayOfWeek.MONDAY,
    DayOfWeek.TUESDAY,
    DayOfWeek.WEDNESDAY,
    DayOfWeek.THURSDAY,
    DayOfWeek.FRIDAY,
    DayOfWeek.SATURDAY,
    DayOfWeek.SUNDAY,
  ][dayIndex];

  const [todaySessions, tasks, assessments] = await Promise.all([
    prisma.classSession.findMany({
      ...dashboardCourseInclude,
      where: {
        dayOfWeek: todayName,
      },
      orderBy: {
        startTime: "asc",
      },
    }),
    prisma.taskItem.findMany({
      include: { course: true },
      orderBy: [{ dueAt: "asc" }, { createdAt: "desc" }],
    }),
    prisma.assessment.findMany({
      include: { course: true },
      orderBy: { dueAt: "asc" },
    }),
  ]);

  const todayClasses: TodayClassCard[] = todaySessions.map((session) => ({
    id: session.id,
    courseCode: session.course.code,
    courseName: session.course.name,
    startTime: session.startTime,
    endTime: session.endTime,
    location: session.location,
    sessionType: session.sessionType,
    color: session.course.color,
  }));

  const taskSummary = {
    todo: tasks.filter((task) => task.status === "TODO").length,
    inProgress: tasks.filter((task) => task.status === "IN_PROGRESS").length,
    done: tasks.filter((task) => task.status === "DONE").length,
  };

  const now = new Date();

  const overdueTasks = tasks
    .filter((task) => task.dueAt && isBefore(task.dueAt, now) && task.status !== "DONE")
    .slice(0, 5);

  const dueSoonTasks = tasks
    .filter((task) => task.dueAt && isAfter(task.dueAt, now) && task.status !== "DONE")
    .slice(0, 5);

  const upcomingAssessments: UpcomingDeadlineItem[] = assessments.slice(0, 6).map((assessment) => ({
    id: assessment.id,
    kind: "assessment",
    title: assessment.title,
    courseName: assessment.course.name,
    dueAt: assessment.dueAt.toISOString(),
    status: assessment.status,
  }));

  return {
    todayClasses,
    overdueTasks,
    dueSoonTasks,
    upcomingAssessments,
    taskSummary,
  };
}

export async function getCoursesPageData() {
  return prisma.semester.findMany({
    include: {
      courses: {
        include: {
          assessments: true,
          files: true,
          sessions: true,
          tasks: true,
        },
        orderBy: {
          code: "asc",
        },
      },
    },
    orderBy: [{ isActive: "desc" }, { startDate: "desc" }],
  });
}

export async function getCourseDetail(courseId: string) {
  return prisma.course.findUnique({
    where: { id: courseId },
    include: {
      semester: true,
      assessments: {
        orderBy: { dueAt: "asc" },
      },
      tasks: {
        orderBy: [{ status: "asc" }, { dueAt: "asc" }],
      },
      files: {
        orderBy: { createdAt: "desc" },
      },
      sessions: {
        orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
      },
    },
  });
}

export async function getTimetableData() {
  return prisma.classSession.findMany({
    include: { course: true },
    orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
  });
}

export async function getTaskPageData(filters: {
  courseId?: string;
  status?: string;
}) {
  const [courses, tasks] = await Promise.all([
    prisma.course.findMany({
      orderBy: { code: "asc" },
    }),
    prisma.taskItem.findMany({
      where: {
        courseId: filters.courseId || undefined,
        status: filters.status ? (filters.status as never) : undefined,
      },
      include: {
        course: true,
      },
      orderBy: [{ dueAt: "asc" }, { createdAt: "desc" }],
    }),
  ]);

  return { courses, tasks };
}

export async function getAssessmentPageData(filters: {
  courseId?: string;
  status?: string;
  type?: string;
}) {
  const [courses, assessments] = await Promise.all([
    prisma.course.findMany({
      orderBy: { code: "asc" },
    }),
    prisma.assessment.findMany({
      where: {
        courseId: filters.courseId || undefined,
        status: filters.status ? (filters.status as never) : undefined,
        type: filters.type ? (filters.type as never) : undefined,
      },
      include: {
        course: true,
      },
      orderBy: { dueAt: "asc" },
    }),
  ]);

  return { courses, assessments };
}
