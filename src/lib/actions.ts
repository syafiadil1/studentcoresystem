"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { removeStoredFile, saveCourseFile } from "@/lib/storage";

function requiredString(formData: FormData, key: string) {
  return String(formData.get(key) || "").trim();
}

function optionalString(formData: FormData, key: string) {
  const value = String(formData.get(key) || "").trim();
  return value || null;
}

function optionalDate(formData: FormData, key: string) {
  const value = String(formData.get(key) || "").trim();
  return value ? new Date(value) : null;
}

function revalidateApp(paths: string[]) {
  for (const path of paths) {
    revalidatePath(path);
  }
}

export async function createSemester(formData: FormData) {
  const isActive = formData.get("isActive") === "on";

  if (isActive) {
    await prisma.semester.updateMany({ data: { isActive: false } });
  }

  await prisma.semester.create({
    data: {
      name: requiredString(formData, "name"),
      startDate: new Date(requiredString(formData, "startDate")),
      endDate: new Date(requiredString(formData, "endDate")),
      isActive,
    },
  });

  revalidateApp(["/", "/courses"]);
}

export async function deleteSemester(formData: FormData) {
  await prisma.semester.delete({
    where: { id: requiredString(formData, "semesterId") },
  });

  revalidateApp(["/", "/courses"]);
}

export async function createCourse(formData: FormData) {
  await prisma.course.create({
    data: {
      code: requiredString(formData, "code"),
      name: requiredString(formData, "name"),
      lecturerName: requiredString(formData, "lecturerName"),
      color: requiredString(formData, "color"),
      semesterId: requiredString(formData, "semesterId"),
    },
  });

  revalidateApp(["/", "/courses", "/tasks", "/assessments", "/timetable"]);
}

export async function updateCourse(formData: FormData) {
  const courseId = requiredString(formData, "courseId");

  await prisma.course.update({
    where: { id: courseId },
    data: {
      code: requiredString(formData, "code"),
      name: requiredString(formData, "name"),
      lecturerName: requiredString(formData, "lecturerName"),
      color: requiredString(formData, "color"),
      semesterId: requiredString(formData, "semesterId"),
    },
  });

  revalidateApp(["/", "/courses", `/courses/${courseId}`, "/tasks", "/assessments", "/timetable"]);
}

export async function deleteCourse(formData: FormData) {
  const courseId = requiredString(formData, "courseId");
  const files = await prisma.courseFile.findMany({
    where: { courseId },
  });

  await Promise.all(files.map((file) => removeStoredFile(file.filePath)));
  await prisma.course.delete({
    where: { id: courseId },
  });

  revalidateApp(["/", "/courses", "/tasks", "/assessments", "/timetable"]);
  redirect("/courses");
}

export async function createClassSession(formData: FormData) {
  await prisma.classSession.create({
    data: {
      courseId: requiredString(formData, "courseId"),
      dayOfWeek: requiredString(formData, "dayOfWeek") as never,
      startTime: requiredString(formData, "startTime"),
      endTime: requiredString(formData, "endTime"),
      location: requiredString(formData, "location"),
      sessionType: requiredString(formData, "sessionType") as never,
    },
  });

  const source = requiredString(formData, "sourcePath") || "/timetable";
  revalidateApp(["/", "/timetable", "/courses", source]);
}

export async function updateClassSession(formData: FormData) {
  const sessionId = requiredString(formData, "sessionId");
  await prisma.classSession.update({
    where: { id: sessionId },
    data: {
      dayOfWeek: requiredString(formData, "dayOfWeek") as never,
      startTime: requiredString(formData, "startTime"),
      endTime: requiredString(formData, "endTime"),
      location: requiredString(formData, "location"),
      sessionType: requiredString(formData, "sessionType") as never,
    },
  });

  const source = requiredString(formData, "sourcePath") || "/timetable";
  revalidateApp(["/", "/timetable", "/courses", source]);
}

export async function deleteClassSession(formData: FormData) {
  await prisma.classSession.delete({
    where: { id: requiredString(formData, "sessionId") },
  });

  const source = requiredString(formData, "sourcePath") || "/timetable";
  revalidateApp(["/", "/timetable", "/courses", source]);
}

export async function createTaskItem(formData: FormData) {
  await prisma.taskItem.create({
    data: {
      title: requiredString(formData, "title"),
      description: requiredString(formData, "description"),
      category: requiredString(formData, "category") as never,
      status: requiredString(formData, "status") as never,
      priority: requiredString(formData, "priority") as never,
      dueAt: optionalDate(formData, "dueAt"),
      courseId: optionalString(formData, "courseId"),
    },
  });

  const source = requiredString(formData, "sourcePath") || "/tasks";
  revalidateApp(["/", "/tasks", "/courses", source]);
}

export async function updateTaskItem(formData: FormData) {
  const taskId = requiredString(formData, "taskId");

  await prisma.taskItem.update({
    where: { id: taskId },
    data: {
      title: requiredString(formData, "title"),
      description: requiredString(formData, "description"),
      category: requiredString(formData, "category") as never,
      status: requiredString(formData, "status") as never,
      priority: requiredString(formData, "priority") as never,
      dueAt: optionalDate(formData, "dueAt"),
      courseId: optionalString(formData, "courseId"),
    },
  });

  const source = requiredString(formData, "sourcePath") || "/tasks";
  revalidateApp(["/", "/tasks", "/courses", source]);
}

export async function deleteTaskItem(formData: FormData) {
  await prisma.taskItem.delete({
    where: { id: requiredString(formData, "taskId") },
  });

  const source = requiredString(formData, "sourcePath") || "/tasks";
  revalidateApp(["/", "/tasks", "/courses", source]);
}

export async function createAssessment(formData: FormData) {
  await prisma.assessment.create({
    data: {
      title: requiredString(formData, "title"),
      type: requiredString(formData, "type") as never,
      dueAt: new Date(requiredString(formData, "dueAt")),
      weight: Number(formData.get("weight")) || null,
      status: requiredString(formData, "status") as never,
      courseId: requiredString(formData, "courseId"),
    },
  });

  const source = requiredString(formData, "sourcePath") || "/assessments";
  revalidateApp(["/", "/assessments", "/courses", source]);
}

export async function updateAssessment(formData: FormData) {
  const assessmentId = requiredString(formData, "assessmentId");

  await prisma.assessment.update({
    where: { id: assessmentId },
    data: {
      title: requiredString(formData, "title"),
      type: requiredString(formData, "type") as never,
      dueAt: new Date(requiredString(formData, "dueAt")),
      weight: Number(formData.get("weight")) || null,
      status: requiredString(formData, "status") as never,
      courseId: requiredString(formData, "courseId"),
    },
  });

  const source = requiredString(formData, "sourcePath") || "/assessments";
  revalidateApp(["/", "/assessments", "/courses", source]);
}

export async function deleteAssessment(formData: FormData) {
  await prisma.assessment.delete({
    where: { id: requiredString(formData, "assessmentId") },
  });

  const source = requiredString(formData, "sourcePath") || "/assessments";
  revalidateApp(["/", "/assessments", "/courses", source]);
}

export async function uploadCourseFile(formData: FormData) {
  const file = formData.get("file");

  if (!(file instanceof File) || file.size === 0) {
    return;
  }

  const saved = await saveCourseFile(file);
  const courseId = requiredString(formData, "courseId");

  await prisma.courseFile.create({
    data: {
      title: requiredString(formData, "title"),
      fileCategory: requiredString(formData, "fileCategory") as never,
      courseId,
      ...saved,
    },
  });

  const source = requiredString(formData, "sourcePath") || `/courses/${courseId}`;
  revalidateApp(["/", "/courses", source]);
}

export async function deleteCourseFile(formData: FormData) {
  const fileId = requiredString(formData, "fileId");
  const existing = await prisma.courseFile.findUnique({
    where: { id: fileId },
  });

  if (!existing) {
    return;
  }

  await removeStoredFile(existing.filePath);
  await prisma.courseFile.delete({
    where: { id: fileId },
  });

  const source = requiredString(formData, "sourcePath") || `/courses/${existing.courseId}`;
  revalidateApp(["/", "/courses", source]);
}
