"use client";

import { useState, type FormEvent } from "react";
import {
  assessmentStatusOptions,
  assessmentTypeOptions,
  dayOrder,
  fileCategoryOptions,
  sessionTypeOptions,
  taskCategoryOptions,
  taskPriorityOptions,
  taskStatusOptions,
} from "@/lib/constants";
import type {
  Assessment,
  AssessmentStatus,
  AssessmentType,
  ClassSession,
  Course,
  FileCategory,
  Semester,
  SessionType,
  TaskCategory,
  TaskItem,
  TaskPriority,
  TaskStatus,
} from "@/lib/types";
import { Button, Field, Input, Select, Textarea } from "@/components/ui";
import { titleCase, toDateTimeLocal } from "@/lib/utils";

type SemesterOption = Pick<Semester, "id" | "name" | "isActive">;
type CourseOption = Pick<Course, "id" | "code" | "name">;

function formData(event: FormEvent<HTMLFormElement>) {
  return new FormData(event.currentTarget);
}

function resetIfCreate(form: HTMLFormElement, reset: boolean) {
  if (reset) {
    form.reset();
  }
}

export function SemesterCreateForm({
  onCreate,
}: {
  onCreate: (payload: { name: string; startDate: string; endDate: string; isActive: boolean }) => void;
}) {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        const data = formData(event);
        onCreate({
          name: String(data.get("name") || "").trim(),
          startDate: String(data.get("startDate") || ""),
          endDate: String(data.get("endDate") || ""),
          isActive: data.get("isActive") === "on",
        });
        resetIfCreate(event.currentTarget, true);
      }}
      className="grid gap-4 rounded-3xl border border-stone-200 bg-white/70 p-4 md:grid-cols-2"
    >
      <Field label="Semester name">
        <Input name="name" placeholder="Semester 1 2026" required />
      </Field>
      <Field label="Start date">
        <Input name="startDate" type="date" required />
      </Field>
      <Field label="End date">
        <Input name="endDate" type="date" required />
      </Field>
      <label className="flex items-center gap-3 rounded-2xl border border-stone-300 px-4 py-3 text-sm text-stone-700">
        <input name="isActive" type="checkbox" className="h-4 w-4" />
        Set as active semester
      </label>
      <div className="md:col-span-2">
        <Button type="submit">Add semester</Button>
      </div>
    </form>
  );
}

export function SemesterDeleteForm({
  semesterId,
  onDelete,
}: {
  semesterId: string;
  onDelete: (semesterId: string) => void;
}) {
  return (
    <Button type="button" tone="danger" onClick={() => onDelete(semesterId)}>
      Delete
    </Button>
  );
}

export function SemesterUpdateForm({
  semester,
  onUpdate,
}: {
  semester: Pick<Semester, "id" | "name" | "startDate" | "endDate" | "isActive">;
  onUpdate: (
    semesterId: string,
    payload: { name: string; startDate: string; endDate: string; isActive: boolean },
  ) => void;
}) {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        const data = formData(event);
        onUpdate(semester.id, {
          name: String(data.get("name") || "").trim(),
          startDate: String(data.get("startDate") || ""),
          endDate: String(data.get("endDate") || ""),
          isActive: data.get("isActive") === "on",
        });
      }}
      className="grid gap-4 rounded-3xl border border-stone-200 bg-stone-50/80 p-4 md:grid-cols-2"
    >
      <Field label="Semester name">
        <Input name="name" defaultValue={semester.name} required />
      </Field>
      <Field label="Start date">
        <Input name="startDate" type="date" defaultValue={semester.startDate.slice(0, 10)} required />
      </Field>
      <Field label="End date">
        <Input name="endDate" type="date" defaultValue={semester.endDate.slice(0, 10)} required />
      </Field>
      <label className="flex items-center gap-3 rounded-2xl border border-stone-300 px-4 py-3 text-sm text-stone-700">
        <input name="isActive" type="checkbox" className="h-4 w-4" defaultChecked={semester.isActive} />
        Set as active semester
      </label>
      <div className="md:col-span-2">
        <Button type="submit">Save semester</Button>
      </div>
    </form>
  );
}

export function CourseCreateForm({
  semesters,
  onCreate,
}: {
  semesters: SemesterOption[];
  onCreate: (payload: {
    code: string;
    name: string;
    lecturerName: string;
    color: string;
    semesterId: string;
  }) => void;
}) {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        const data = formData(event);
        onCreate({
          code: String(data.get("code") || "").trim(),
          name: String(data.get("name") || "").trim(),
          lecturerName: String(data.get("lecturerName") || "").trim(),
          color: String(data.get("color") || "#E16A54"),
          semesterId: String(data.get("semesterId") || ""),
        });
        resetIfCreate(event.currentTarget, true);
      }}
      className="grid gap-4 md:grid-cols-2"
    >
      <Field label="Course code">
        <Input name="code" placeholder="CSC204" required />
      </Field>
      <Field label="Course name">
        <Input name="name" placeholder="Data Structures" required />
      </Field>
      <Field label="Lecturer">
        <Input name="lecturerName" placeholder="Dr. Aina Rahman" required />
      </Field>
      <Field label="Semester">
        <Select name="semesterId" defaultValue={semesters.find((semester) => semester.isActive)?.id} required>
          <option value="" disabled>
            Select semester
          </option>
          {semesters.map((semester) => (
            <option key={semester.id} value={semester.id}>
              {semester.name}
            </option>
          ))}
        </Select>
      </Field>
      <Field label="Course color">
        <Input name="color" type="color" defaultValue="#E16A54" required className="h-12 px-2" />
      </Field>
      <div className="md:col-span-2">
        <Button type="submit">Create course</Button>
      </div>
    </form>
  );
}

export function CourseUpdateForm({
  course,
  semesters,
  onUpdate,
  onDelete,
}: {
  course: Pick<Course, "id" | "code" | "name" | "lecturerName" | "color" | "semesterId">;
  semesters: SemesterOption[];
  onUpdate: (
    courseId: string,
    payload: {
      code: string;
      name: string;
      lecturerName: string;
      color: string;
      semesterId: string;
    },
  ) => void;
  onDelete: (courseId: string) => void;
}) {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        const data = formData(event);
        onUpdate(course.id, {
          code: String(data.get("code") || "").trim(),
          name: String(data.get("name") || "").trim(),
          lecturerName: String(data.get("lecturerName") || "").trim(),
          color: String(data.get("color") || "#E16A54"),
          semesterId: String(data.get("semesterId") || ""),
        });
      }}
      className="grid gap-4 md:grid-cols-2"
    >
      <Field label="Course code">
        <Input name="code" defaultValue={course.code} required />
      </Field>
      <Field label="Course name">
        <Input name="name" defaultValue={course.name} required />
      </Field>
      <Field label="Lecturer">
        <Input name="lecturerName" defaultValue={course.lecturerName} required />
      </Field>
      <Field label="Semester">
        <Select name="semesterId" defaultValue={course.semesterId} required>
          {semesters.map((semester) => (
            <option key={semester.id} value={semester.id}>
              {semester.name}
            </option>
          ))}
        </Select>
      </Field>
      <Field label="Course color">
        <Input name="color" type="color" defaultValue={course.color} required className="h-12 px-2" />
      </Field>
      <div className="md:col-span-2 flex gap-3">
        <Button type="submit">Save course</Button>
        <Button type="button" tone="danger" onClick={() => onDelete(course.id)}>
          Delete course
        </Button>
      </div>
    </form>
  );
}

export function SessionCreateForm({
  courses,
  onCreate,
  fixedCourseId,
}: {
  courses: CourseOption[];
  onCreate: (payload: {
    courseId: string;
    dayOfWeek: ClassSession["dayOfWeek"];
    startTime: string;
    endTime: string;
    location: string;
    sessionType: SessionType;
  }) => void;
  fixedCourseId?: string;
}) {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        const data = formData(event);
        onCreate({
          courseId: fixedCourseId || String(data.get("courseId") || ""),
          dayOfWeek: String(data.get("dayOfWeek") || "MONDAY") as ClassSession["dayOfWeek"],
          startTime: String(data.get("startTime") || ""),
          endTime: String(data.get("endTime") || ""),
          location: String(data.get("location") || "").trim(),
          sessionType: String(data.get("sessionType") || "LECTURE") as SessionType,
        });
        resetIfCreate(event.currentTarget, true);
      }}
      className="grid gap-4 md:grid-cols-3"
    >
      {!fixedCourseId ? (
        <Field label="Course">
          <Select name="courseId" required defaultValue={courses[0]?.id || ""}>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.code} · {course.name}
              </option>
            ))}
          </Select>
        </Field>
      ) : null}
      <Field label="Day">
        <Select name="dayOfWeek" defaultValue="MONDAY" required>
          {dayOrder.map((day) => (
            <option key={day} value={day}>
              {titleCase(day)}
            </option>
          ))}
        </Select>
      </Field>
      <Field label="Session type">
        <Select name="sessionType" defaultValue="LECTURE" required>
          {sessionTypeOptions.map((type) => (
            <option key={type} value={type}>
              {titleCase(type)}
            </option>
          ))}
        </Select>
      </Field>
      <Field label="Start time">
        <Input name="startTime" type="time" required />
      </Field>
      <Field label="End time">
        <Input name="endTime" type="time" required />
      </Field>
      <Field label="Location">
        <Input name="location" placeholder="Hall C3" required />
      </Field>
      <div className="md:col-span-3">
        <Button type="submit">Add session</Button>
      </div>
    </form>
  );
}

export function SessionUpdateForm({
  session,
  onUpdate,
  onDelete,
}: {
  session: Pick<ClassSession, "id" | "dayOfWeek" | "startTime" | "endTime" | "location" | "sessionType" | "courseId">;
  onUpdate: (
    sessionId: string,
    payload: {
      courseId: string;
      dayOfWeek: ClassSession["dayOfWeek"];
      startTime: string;
      endTime: string;
      location: string;
      sessionType: SessionType;
    },
  ) => void;
  onDelete: (sessionId: string) => void;
}) {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        const data = formData(event);
        onUpdate(session.id, {
          courseId: session.courseId,
          dayOfWeek: String(data.get("dayOfWeek") || "MONDAY") as ClassSession["dayOfWeek"],
          startTime: String(data.get("startTime") || ""),
          endTime: String(data.get("endTime") || ""),
          location: String(data.get("location") || "").trim(),
          sessionType: String(data.get("sessionType") || "LECTURE") as SessionType,
        });
      }}
      className="grid gap-3 md:grid-cols-5"
    >
      <Select name="dayOfWeek" defaultValue={session.dayOfWeek}>
        {dayOrder.map((day) => (
          <option key={day} value={day}>
            {titleCase(day)}
          </option>
        ))}
      </Select>
      <Input name="startTime" type="time" defaultValue={session.startTime} />
      <Input name="endTime" type="time" defaultValue={session.endTime} />
      <Input name="location" defaultValue={session.location} />
      <Select name="sessionType" defaultValue={session.sessionType}>
        {sessionTypeOptions.map((type) => (
          <option key={type} value={type}>
            {titleCase(type)}
          </option>
        ))}
      </Select>
      <div className="md:col-span-5 flex gap-3">
        <Button type="submit">Save</Button>
        <Button type="button" tone="danger" onClick={() => onDelete(session.id)}>
          Delete
        </Button>
      </div>
    </form>
  );
}

export function TaskCreateForm({
  courses,
  onCreate,
  fixedCourseId,
}: {
  courses: CourseOption[];
  onCreate: (payload: {
    title: string;
    description: string;
    category: TaskCategory;
    status: TaskStatus;
    priority: TaskPriority;
    dueAt: string | null;
    courseId: string | null;
  }) => void;
  fixedCourseId?: string;
}) {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        const data = formData(event);
        const courseId = fixedCourseId || String(data.get("courseId") || "");

        onCreate({
          title: String(data.get("title") || "").trim(),
          description: String(data.get("description") || "").trim(),
          category: String(data.get("category") || "GENERAL") as TaskCategory,
          status: String(data.get("status") || "TODO") as TaskStatus,
          priority: String(data.get("priority") || "MEDIUM") as TaskPriority,
          dueAt: String(data.get("dueAt") || "") || null,
          courseId: courseId || null,
        });
        resetIfCreate(event.currentTarget, true);
      }}
      className="grid gap-4 md:grid-cols-2"
    >
      <Field label="Task title">
        <Input name="title" placeholder="Submit lab reflection" required />
      </Field>
      {!fixedCourseId ? (
        <Field label="Linked course">
          <Select name="courseId" defaultValue="">
            <option value="">General task</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.code} · {course.name}
              </option>
            ))}
          </Select>
        </Field>
      ) : null}
      <Field label="Description">
        <Textarea name="description" placeholder="Short notes about the task" required />
      </Field>
      <div className="grid gap-4">
        <Field label="Category">
          <Select name="category" defaultValue="GENERAL">
            {taskCategoryOptions.map((option) => (
              <option key={option} value={option}>
                {titleCase(option)}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Status">
          <Select name="status" defaultValue="TODO">
            {taskStatusOptions.map((option) => (
              <option key={option} value={option}>
                {titleCase(option)}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Priority">
          <Select name="priority" defaultValue="MEDIUM">
            {taskPriorityOptions.map((option) => (
              <option key={option} value={option}>
                {titleCase(option)}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Due at">
          <Input name="dueAt" type="datetime-local" />
        </Field>
      </div>
      <div className="md:col-span-2">
        <Button type="submit">Add task</Button>
      </div>
    </form>
  );
}

export function TaskUpdateForm({
  task,
  courses,
  onUpdate,
  onDelete,
}: {
  task: Pick<TaskItem, "id" | "title" | "description" | "category" | "status" | "priority" | "dueAt" | "courseId">;
  courses: CourseOption[];
  onUpdate: (
    taskId: string,
    payload: {
      title: string;
      description: string;
      category: TaskCategory;
      status: TaskStatus;
      priority: TaskPriority;
      dueAt: string | null;
      courseId: string | null;
    },
  ) => void;
  onDelete: (taskId: string) => void;
}) {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        const data = formData(event);
        const courseId = String(data.get("courseId") || "");
        onUpdate(task.id, {
          title: String(data.get("title") || "").trim(),
          description: String(data.get("description") || "").trim(),
          category: String(data.get("category") || "GENERAL") as TaskCategory,
          status: String(data.get("status") || "TODO") as TaskStatus,
          priority: String(data.get("priority") || "MEDIUM") as TaskPriority,
          dueAt: String(data.get("dueAt") || "") || null,
          courseId: courseId || null,
        });
      }}
      className="grid gap-3 md:grid-cols-3"
    >
      <Input name="title" defaultValue={task.title} />
      <Select name="courseId" defaultValue={task.courseId || ""}>
        <option value="">General task</option>
        {courses.map((course) => (
          <option key={course.id} value={course.id}>
            {course.code} · {course.name}
          </option>
        ))}
      </Select>
      <Input name="dueAt" type="datetime-local" defaultValue={task.dueAt ? toDateTimeLocal(task.dueAt) : ""} />
      <Textarea name="description" defaultValue={task.description} className="md:col-span-3" />
      <Select name="category" defaultValue={task.category}>
        {taskCategoryOptions.map((option) => (
          <option key={option} value={option}>
            {titleCase(option)}
          </option>
        ))}
      </Select>
      <Select name="status" defaultValue={task.status}>
        {taskStatusOptions.map((option) => (
          <option key={option} value={option}>
            {titleCase(option)}
          </option>
        ))}
      </Select>
      <Select name="priority" defaultValue={task.priority}>
        {taskPriorityOptions.map((option) => (
          <option key={option} value={option}>
            {titleCase(option)}
          </option>
        ))}
      </Select>
      <div className="md:col-span-3 flex gap-3">
        <Button type="submit">Save</Button>
        <Button type="button" tone="danger" onClick={() => onDelete(task.id)}>
          Delete
        </Button>
      </div>
    </form>
  );
}

export function AssessmentCreateForm({
  courses,
  onCreate,
  fixedCourseId,
}: {
  courses: CourseOption[];
  onCreate: (payload: {
    title: string;
    type: AssessmentType;
    dueAt: string;
    weight: number | null;
    status: AssessmentStatus;
    courseId: string;
  }) => void;
  fixedCourseId?: string;
}) {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        const data = formData(event);
        onCreate({
          title: String(data.get("title") || "").trim(),
          type: String(data.get("type") || "ASSIGNMENT") as AssessmentType,
          dueAt: String(data.get("dueAt") || ""),
          weight: Number(data.get("weight")) || null,
          status: String(data.get("status") || "PENDING") as AssessmentStatus,
          courseId: fixedCourseId || String(data.get("courseId") || ""),
        });
        resetIfCreate(event.currentTarget, true);
      }}
      className="grid gap-4 md:grid-cols-2"
    >
      <Field label="Assessment title">
        <Input name="title" placeholder="Linked List Assignment" required />
      </Field>
      {!fixedCourseId ? (
        <Field label="Course">
          <Select name="courseId" required defaultValue={courses[0]?.id || ""}>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.code} · {course.name}
              </option>
            ))}
          </Select>
        </Field>
      ) : null}
      <Field label="Type">
        <Select name="type" defaultValue="ASSIGNMENT">
          {assessmentTypeOptions.map((option) => (
            <option key={option} value={option}>
              {titleCase(option)}
            </option>
          ))}
        </Select>
      </Field>
      <Field label="Status">
        <Select name="status" defaultValue="PENDING">
          {assessmentStatusOptions.map((option) => (
            <option key={option} value={option}>
              {titleCase(option)}
            </option>
          ))}
        </Select>
      </Field>
      <Field label="Due at">
        <Input name="dueAt" type="datetime-local" required />
      </Field>
      <Field label="Weight (%)">
        <Input name="weight" type="number" min="0" max="100" />
      </Field>
      <div className="md:col-span-2">
        <Button type="submit">Add assessment</Button>
      </div>
    </form>
  );
}

export function AssessmentUpdateForm({
  assessment,
  courses,
  onUpdate,
  onDelete,
}: {
  assessment: Pick<Assessment, "id" | "title" | "type" | "dueAt" | "weight" | "status" | "courseId">;
  courses: CourseOption[];
  onUpdate: (
    assessmentId: string,
    payload: {
      title: string;
      type: AssessmentType;
      dueAt: string;
      weight: number | null;
      status: AssessmentStatus;
      courseId: string;
    },
  ) => void;
  onDelete: (assessmentId: string) => void;
}) {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        const data = formData(event);
        onUpdate(assessment.id, {
          title: String(data.get("title") || "").trim(),
          type: String(data.get("type") || "ASSIGNMENT") as AssessmentType,
          dueAt: String(data.get("dueAt") || ""),
          weight: Number(data.get("weight")) || null,
          status: String(data.get("status") || "PENDING") as AssessmentStatus,
          courseId: String(data.get("courseId") || ""),
        });
      }}
      className="grid gap-3 md:grid-cols-3"
    >
      <Input name="title" defaultValue={assessment.title} />
      <Select name="courseId" defaultValue={assessment.courseId}>
        {courses.map((course) => (
          <option key={course.id} value={course.id}>
            {course.code} · {course.name}
          </option>
        ))}
      </Select>
      <Input name="dueAt" type="datetime-local" defaultValue={toDateTimeLocal(assessment.dueAt)} />
      <Select name="type" defaultValue={assessment.type}>
        {assessmentTypeOptions.map((option) => (
          <option key={option} value={option}>
            {titleCase(option)}
          </option>
        ))}
      </Select>
      <Select name="status" defaultValue={assessment.status}>
        {assessmentStatusOptions.map((option) => (
          <option key={option} value={option}>
            {titleCase(option)}
          </option>
        ))}
      </Select>
      <Input name="weight" type="number" defaultValue={assessment.weight ?? ""} min="0" max="100" />
      <div className="md:col-span-3 flex gap-3">
        <Button type="submit">Save</Button>
        <Button type="button" tone="danger" onClick={() => onDelete(assessment.id)}>
          Delete
        </Button>
      </div>
    </form>
  );
}

export function FileUploadForm({
  courseId,
  onUpload,
}: {
  courseId: string;
  onUpload: (payload: { title: string; fileCategory: FileCategory; file: File }) => Promise<void>;
}) {
  const [isUploading, setIsUploading] = useState(false);

  return (
    <form
      onSubmit={async (event) => {
        event.preventDefault();
        const data = formData(event);
        const file = data.get("file");

        if (!(file instanceof File) || file.size === 0) {
          return;
        }

        setIsUploading(true);
        try {
          await onUpload({
            title: String(data.get("title") || "").trim(),
            fileCategory: String(data.get("fileCategory") || "LECTURE_NOTE") as FileCategory,
            file,
          });
          event.currentTarget.reset();
        } finally {
          setIsUploading(false);
        }
      }}
      className="grid gap-4 md:grid-cols-2"
    >
      <input type="hidden" name="courseId" value={courseId} />
      <Field label="File title">
        <Input name="title" placeholder="Week 3 Lecture Notes" required />
      </Field>
      <Field label="Category">
        <Select name="fileCategory" defaultValue="LECTURE_NOTE">
          {fileCategoryOptions.map((option) => (
            <option key={option} value={option}>
              {titleCase(option)}
            </option>
          ))}
        </Select>
      </Field>
      <Field label="Choose file">
        <Input
          name="file"
          type="file"
          required
          className="file:mr-4 file:rounded-full file:border-0 file:bg-stone-900 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white"
        />
      </Field>
      <div className="md:col-span-2">
        <Button type="submit" disabled={isUploading}>
          {isUploading ? "Saving file..." : "Upload file"}
        </Button>
      </div>
    </form>
  );
}

export function FileDeleteForm({
  fileId,
  onDelete,
}: {
  fileId: string;
  onDelete: (fileId: string) => void;
}) {
  return (
    <Button type="button" tone="danger" onClick={() => onDelete(fileId)}>
      Delete
    </Button>
  );
}
