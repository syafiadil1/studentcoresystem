import {
  createAssessment,
  createClassSession,
  createCourse,
  createSemester,
  createTaskItem,
  deleteAssessment,
  deleteClassSession,
  deleteCourse,
  deleteCourseFile,
  deleteSemester,
  deleteTaskItem,
  updateAssessment,
  updateClassSession,
  updateCourse,
  updateTaskItem,
  uploadCourseFile,
} from "@/lib/actions";
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
import { Button, Field, Input, Select, Textarea } from "@/components/ui";
import { titleCase, toDateTimeLocal } from "@/lib/utils";

type SemesterOption = {
  id: string;
  name: string;
  isActive: boolean;
};

type CourseOption = {
  id: string;
  code: string;
  name: string;
};

export function SemesterCreateForm() {
  return (
    <form action={createSemester} className="grid gap-4 rounded-3xl border border-stone-200 bg-white/70 p-4 md:grid-cols-2">
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

export function SemesterDeleteForm({ semesterId }: { semesterId: string }) {
  return (
    <form action={deleteSemester}>
      <input name="semesterId" type="hidden" value={semesterId} />
      <Button type="submit" tone="danger">
        Delete
      </Button>
    </form>
  );
}

export function CourseCreateForm({ semesters }: { semesters: SemesterOption[] }) {
  return (
    <form action={createCourse} className="grid gap-4 md:grid-cols-2">
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
}: {
  course: {
    id: string;
    code: string;
    name: string;
    lecturerName: string;
    color: string;
    semesterId: string;
  };
  semesters: SemesterOption[];
}) {
  return (
    <form action={updateCourse} className="grid gap-4 md:grid-cols-2">
      <input name="courseId" type="hidden" value={course.id} />
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
        <Button type="submit" formAction={deleteCourse} tone="danger">
          Delete course
        </Button>
      </div>
    </form>
  );
}

export function SessionCreateForm({
  courses,
  sourcePath,
}: {
  courses: CourseOption[];
  sourcePath: string;
}) {
  return (
    <form action={createClassSession} className="grid gap-4 md:grid-cols-3">
      <input name="sourcePath" type="hidden" value={sourcePath} />
      <Field label="Course">
        <Select name="courseId" required>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.code} · {course.name}
            </option>
          ))}
        </Select>
      </Field>
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
  sourcePath,
}: {
  session: {
    id: string;
    dayOfWeek: string;
    startTime: string;
    endTime: string;
    location: string;
    sessionType: string;
  };
  sourcePath: string;
}) {
  return (
    <form action={updateClassSession} className="grid gap-3 md:grid-cols-5">
      <input name="sessionId" type="hidden" value={session.id} />
      <input name="sourcePath" type="hidden" value={sourcePath} />
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
        <Button type="submit" formAction={deleteClassSession} tone="danger">
          Delete
        </Button>
      </div>
    </form>
  );
}

export function TaskCreateForm({
  courses,
  sourcePath,
}: {
  courses: CourseOption[];
  sourcePath: string;
}) {
  return (
    <form action={createTaskItem} className="grid gap-4 md:grid-cols-2">
      <input name="sourcePath" type="hidden" value={sourcePath} />
      <Field label="Task title">
        <Input name="title" placeholder="Submit lab reflection" required />
      </Field>
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
  sourcePath,
}: {
  task: {
    id: string;
    title: string;
    description: string;
    category: string;
    status: string;
    priority: string;
    dueAt: Date | null;
    courseId: string | null;
  };
  courses: CourseOption[];
  sourcePath: string;
}) {
  return (
    <form action={updateTaskItem} className="grid gap-3 md:grid-cols-3">
      <input name="taskId" type="hidden" value={task.id} />
      <input name="sourcePath" type="hidden" value={sourcePath} />
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
        <Button type="submit" formAction={deleteTaskItem} tone="danger">
          Delete
        </Button>
      </div>
    </form>
  );
}

export function AssessmentCreateForm({
  courses,
  sourcePath,
}: {
  courses: CourseOption[];
  sourcePath: string;
}) {
  return (
    <form action={createAssessment} className="grid gap-4 md:grid-cols-2">
      <input name="sourcePath" type="hidden" value={sourcePath} />
      <Field label="Assessment title">
        <Input name="title" placeholder="Linked List Assignment" required />
      </Field>
      <Field label="Course">
        <Select name="courseId" required>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.code} · {course.name}
            </option>
          ))}
        </Select>
      </Field>
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
  sourcePath,
}: {
  assessment: {
    id: string;
    title: string;
    type: string;
    dueAt: Date;
    weight: number | null;
    status: string;
    courseId: string;
  };
  courses: CourseOption[];
  sourcePath: string;
}) {
  return (
    <form action={updateAssessment} className="grid gap-3 md:grid-cols-3">
      <input name="assessmentId" type="hidden" value={assessment.id} />
      <input name="sourcePath" type="hidden" value={sourcePath} />
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
        <Button type="submit" formAction={deleteAssessment} tone="danger">
          Delete
        </Button>
      </div>
    </form>
  );
}

export function FileUploadForm({ courseId, sourcePath }: { courseId: string; sourcePath: string }) {
  return (
    <form action={uploadCourseFile} className="grid gap-4 md:grid-cols-2">
      <input name="courseId" type="hidden" value={courseId} />
      <input name="sourcePath" type="hidden" value={sourcePath} />
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
        <Input name="file" type="file" required className="file:mr-4 file:rounded-full file:border-0 file:bg-stone-900 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white" />
      </Field>
      <div className="md:col-span-2">
        <Button type="submit">Upload file</Button>
      </div>
    </form>
  );
}

export function FileDeleteForm({ fileId, sourcePath }: { fileId: string; sourcePath: string }) {
  return (
    <form action={deleteCourseFile}>
      <input name="fileId" type="hidden" value={fileId} />
      <input name="sourcePath" type="hidden" value={sourcePath} />
      <Button type="submit" tone="danger">
        Delete
      </Button>
    </form>
  );
}
