import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.courseFile.deleteMany();
  await prisma.assessment.deleteMany();
  await prisma.taskItem.deleteMany();
  await prisma.classSession.deleteMany();
  await prisma.course.deleteMany();
  await prisma.semester.deleteMany();

  const semester = await prisma.semester.create({
    data: {
      name: "Semester 2 2026",
      startDate: new Date("2026-02-23T00:00:00.000Z"),
      endDate: new Date("2026-06-28T00:00:00.000Z"),
      isActive: true,
    },
  });

  const courses = await Promise.all([
    prisma.course.create({
      data: {
        code: "CSC204",
        name: "Data Structures",
        lecturerName: "Dr. Aina Rahman",
        color: "#E16A54",
        semesterId: semester.id,
      },
    }),
    prisma.course.create({
      data: {
        code: "MAT220",
        name: "Discrete Mathematics",
        lecturerName: "Prof. Lim Jia Wen",
        color: "#237A57",
        semesterId: semester.id,
      },
    }),
    prisma.course.create({
      data: {
        code: "ENG301",
        name: "Professional Presentation",
        lecturerName: "Ms. Sofia Nordin",
        color: "#2C4D8F",
        semesterId: semester.id,
      },
    }),
  ]);

  await prisma.classSession.createMany({
    data: [
      {
        courseId: courses[0].id,
        dayOfWeek: "MONDAY",
        startTime: "09:00",
        endTime: "11:00",
        location: "Block B / Lab 2",
        sessionType: "LECTURE",
      },
      {
        courseId: courses[0].id,
        dayOfWeek: "WEDNESDAY",
        startTime: "14:00",
        endTime: "16:00",
        location: "Block B / Lab 4",
        sessionType: "LAB",
      },
      {
        courseId: courses[1].id,
        dayOfWeek: "TUESDAY",
        startTime: "10:00",
        endTime: "12:00",
        location: "Hall C3",
        sessionType: "LECTURE",
      },
      {
        courseId: courses[2].id,
        dayOfWeek: "THURSDAY",
        startTime: "15:00",
        endTime: "17:00",
        location: "Seminar Room 1",
        sessionType: "WORKSHOP",
      },
    ],
  });

  await prisma.taskItem.createMany({
    data: [
      {
        title: "Revise tree traversal notes",
        description: "Focus on preorder and postorder examples.",
        category: "REVISION",
        status: "TODO",
        priority: "HIGH",
        dueAt: new Date("2026-03-18T13:00:00.000Z"),
        courseId: courses[0].id,
      },
      {
        title: "Update study planner",
        description: "Block revision slots before midterm week.",
        category: "GENERAL",
        status: "IN_PROGRESS",
        priority: "MEDIUM",
        dueAt: new Date("2026-03-20T10:00:00.000Z"),
        courseId: null,
      },
      {
        title: "Submit attendance form",
        description: "Weekly admin form for student affairs.",
        category: "ADMIN",
        status: "DONE",
        priority: "LOW",
        dueAt: new Date("2026-03-14T09:00:00.000Z"),
        courseId: null,
      },
    ],
  });

  await prisma.assessment.createMany({
    data: [
      {
        title: "Linked List Assignment",
        type: "ASSIGNMENT",
        dueAt: new Date("2026-03-22T15:00:00.000Z"),
        weight: 15,
        status: "PENDING",
        courseId: courses[0].id,
      },
      {
        title: "Quiz 1",
        type: "QUIZ",
        dueAt: new Date("2026-03-19T02:00:00.000Z"),
        weight: 5,
        status: "PENDING",
        courseId: courses[1].id,
      },
      {
        title: "Pitch Presentation",
        type: "PRESENTATION",
        dueAt: new Date("2026-03-26T06:00:00.000Z"),
        weight: 20,
        status: "SUBMITTED",
        courseId: courses[2].id,
      },
    ],
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
