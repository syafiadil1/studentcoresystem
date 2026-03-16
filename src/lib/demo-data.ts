import { DayOfWeek } from "@prisma/client";

const semesterId = "semester-2026-2";

const courses = [
  {
    id: "course-csc204",
    code: "CSC204",
    name: "Data Structures",
    lecturerName: "Dr. Aina Rahman",
    color: "#E16A54",
    semesterId,
    createdAt: new Date("2026-02-23T00:00:00.000Z"),
    updatedAt: new Date("2026-02-23T00:00:00.000Z"),
  },
  {
    id: "course-mat220",
    code: "MAT220",
    name: "Discrete Mathematics",
    lecturerName: "Prof. Lim Jia Wen",
    color: "#237A57",
    semesterId,
    createdAt: new Date("2026-02-23T00:00:00.000Z"),
    updatedAt: new Date("2026-02-23T00:00:00.000Z"),
  },
  {
    id: "course-eng301",
    code: "ENG301",
    name: "Professional Presentation",
    lecturerName: "Ms. Sofia Nordin",
    color: "#2C4D8F",
    semesterId,
    createdAt: new Date("2026-02-23T00:00:00.000Z"),
    updatedAt: new Date("2026-02-23T00:00:00.000Z"),
  },
];

const sessions = [
  {
    id: "session-1",
    courseId: "course-csc204",
    dayOfWeek: DayOfWeek.MONDAY,
    startTime: "09:00",
    endTime: "11:00",
    location: "Block B / Lab 2",
    sessionType: "LECTURE",
    createdAt: new Date("2026-02-23T00:00:00.000Z"),
    updatedAt: new Date("2026-02-23T00:00:00.000Z"),
  },
  {
    id: "session-2",
    courseId: "course-csc204",
    dayOfWeek: DayOfWeek.WEDNESDAY,
    startTime: "14:00",
    endTime: "16:00",
    location: "Block B / Lab 4",
    sessionType: "LAB",
    createdAt: new Date("2026-02-23T00:00:00.000Z"),
    updatedAt: new Date("2026-02-23T00:00:00.000Z"),
  },
  {
    id: "session-3",
    courseId: "course-mat220",
    dayOfWeek: DayOfWeek.TUESDAY,
    startTime: "10:00",
    endTime: "12:00",
    location: "Hall C3",
    sessionType: "LECTURE",
    createdAt: new Date("2026-02-23T00:00:00.000Z"),
    updatedAt: new Date("2026-02-23T00:00:00.000Z"),
  },
  {
    id: "session-4",
    courseId: "course-eng301",
    dayOfWeek: DayOfWeek.THURSDAY,
    startTime: "15:00",
    endTime: "17:00",
    location: "Seminar Room 1",
    sessionType: "WORKSHOP",
    createdAt: new Date("2026-02-23T00:00:00.000Z"),
    updatedAt: new Date("2026-02-23T00:00:00.000Z"),
  },
];

const tasks = [
  {
    id: "task-1",
    title: "Revise tree traversal notes",
    description: "Focus on preorder and postorder examples.",
    category: "REVISION",
    status: "TODO",
    priority: "HIGH",
    dueAt: new Date("2026-03-18T13:00:00.000Z"),
    courseId: "course-csc204",
    createdAt: new Date("2026-03-14T00:00:00.000Z"),
    updatedAt: new Date("2026-03-14T00:00:00.000Z"),
  },
  {
    id: "task-2",
    title: "Update study planner",
    description: "Block revision slots before midterm week.",
    category: "GENERAL",
    status: "IN_PROGRESS",
    priority: "MEDIUM",
    dueAt: new Date("2026-03-20T10:00:00.000Z"),
    courseId: null,
    createdAt: new Date("2026-03-14T00:00:00.000Z"),
    updatedAt: new Date("2026-03-14T00:00:00.000Z"),
  },
  {
    id: "task-3",
    title: "Submit attendance form",
    description: "Weekly admin form for student affairs.",
    category: "ADMIN",
    status: "DONE",
    priority: "LOW",
    dueAt: new Date("2026-03-14T09:00:00.000Z"),
    courseId: null,
    createdAt: new Date("2026-03-14T00:00:00.000Z"),
    updatedAt: new Date("2026-03-14T00:00:00.000Z"),
  },
];

const assessments = [
  {
    id: "assessment-1",
    title: "Linked List Assignment",
    type: "ASSIGNMENT",
    dueAt: new Date("2026-03-22T15:00:00.000Z"),
    weight: 15,
    status: "PENDING",
    courseId: "course-csc204",
    createdAt: new Date("2026-03-14T00:00:00.000Z"),
    updatedAt: new Date("2026-03-14T00:00:00.000Z"),
  },
  {
    id: "assessment-2",
    title: "Quiz 1",
    type: "QUIZ",
    dueAt: new Date("2026-03-19T02:00:00.000Z"),
    weight: 5,
    status: "PENDING",
    courseId: "course-mat220",
    createdAt: new Date("2026-03-14T00:00:00.000Z"),
    updatedAt: new Date("2026-03-14T00:00:00.000Z"),
  },
  {
    id: "assessment-3",
    title: "Pitch Presentation",
    type: "PRESENTATION",
    dueAt: new Date("2026-03-26T06:00:00.000Z"),
    weight: 20,
    status: "SUBMITTED",
    courseId: "course-eng301",
    createdAt: new Date("2026-03-14T00:00:00.000Z"),
    updatedAt: new Date("2026-03-14T00:00:00.000Z"),
  },
];

const files = [
  {
    id: "file-1",
    title: "Week 3 Lecture Notes",
    fileName: "week-3-lecture-notes.pdf",
    filePath: "uploads/demo-week-3-lecture-notes.pdf",
    mimeType: "application/pdf",
    sizeBytes: 234000,
    fileCategory: "LECTURE_NOTE",
    courseId: "course-csc204",
    createdAt: new Date("2026-03-14T00:00:00.000Z"),
    updatedAt: new Date("2026-03-14T00:00:00.000Z"),
  },
];

export const demoSemester = {
  id: semesterId,
  name: "Semester 2 2026",
  startDate: new Date("2026-02-23T00:00:00.000Z"),
  endDate: new Date("2026-06-28T00:00:00.000Z"),
  isActive: true,
  createdAt: new Date("2026-02-23T00:00:00.000Z"),
  updatedAt: new Date("2026-02-23T00:00:00.000Z"),
};

export function getDemoCoursesPageData() {
  return [
    {
      ...demoSemester,
      courses: courses.map((course) => ({
        ...course,
        assessments: assessments.filter((assessment) => assessment.courseId === course.id),
        files: files.filter((file) => file.courseId === course.id),
        sessions: sessions.filter((session) => session.courseId === course.id),
        tasks: tasks.filter((task) => task.courseId === course.id),
      })),
    },
  ];
}

export function getDemoCourseDetail(courseId: string) {
  const course = courses.find((entry) => entry.id === courseId);

  if (!course) {
    return null;
  }

  return {
    ...course,
    semester: demoSemester,
    assessments: assessments.filter((assessment) => assessment.courseId === course.id),
    tasks: tasks.filter((task) => task.courseId === course.id),
    files: files.filter((file) => file.courseId === course.id),
    sessions: sessions.filter((session) => session.courseId === course.id),
  };
}

export function getDemoTimetableData() {
  return sessions
    .map((session) => ({
      ...session,
      course: courses.find((course) => course.id === session.courseId)!,
    }))
    .sort((a, b) => a.startTime.localeCompare(b.startTime));
}

export function getDemoTaskPageData(filters: { courseId?: string; status?: string }) {
  return {
    courses,
    tasks: tasks
      .filter((task) => !filters.courseId || task.courseId === filters.courseId)
      .filter((task) => !filters.status || task.status === filters.status)
      .map((task) => ({
        ...task,
        course: task.courseId ? courses.find((course) => course.id === task.courseId) ?? null : null,
      })),
  };
}

export function getDemoAssessmentPageData(filters: {
  courseId?: string;
  status?: string;
  type?: string;
}) {
  return {
    courses,
    assessments: assessments
      .filter((assessment) => !filters.courseId || assessment.courseId === filters.courseId)
      .filter((assessment) => !filters.status || assessment.status === filters.status)
      .filter((assessment) => !filters.type || assessment.type === filters.type)
      .map((assessment) => ({
        ...assessment,
        course: courses.find((course) => course.id === assessment.courseId)!,
      })),
  };
}

export function getDemoDashboardSource() {
  return {
    sessions: getDemoTimetableData(),
    tasks: getDemoTaskPageData({}).tasks,
    assessments: getDemoAssessmentPageData({}).assessments,
  };
}
