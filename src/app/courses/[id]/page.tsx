"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useStudentCore } from "@/components/student-core-provider";
import {
  AssessmentCreateForm,
  AssessmentUpdateForm,
  CourseUpdateForm,
  FileDeleteForm,
  FileUploadForm,
  ResultCreateForm,
  ResultUpdateForm,
  SessionCreateForm,
  SessionUpdateForm,
  TaskCreateForm,
  TaskUpdateForm,
} from "@/components/forms";
import { Badge, Button, EmptyState, Section } from "@/components/ui";
import { getCourseDetail, getCoursesPageData } from "@/lib/local-data";
import { bytesToSize, describeDeadline, formatDateTime, titleCase } from "@/lib/utils";

export default function CourseDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const {
    hydrated,
    state,
    updateCourse,
    deleteCourse,
    createSession,
    updateSession,
    deleteSession,
    createTask,
    updateTask,
    deleteTask,
    createAssessment,
    updateAssessment,
    deleteAssessment,
    createResult,
    updateResult,
    deleteResult,
    uploadFile,
    deleteFile,
  } = useStudentCore();

  const course = getCourseDetail(state, params.id);
  const semesters = getCoursesPageData(state).map((semester) => ({
    id: semester.id,
    name: semester.name,
    isActive: semester.isActive,
  }));
  const courseOptions = state.courses.map((item) => ({
    id: item.id,
    code: item.code,
    name: item.name,
  }));

  if (!hydrated) {
    return <EmptyState title="Loading course" copy="Reading course data from this browser." />;
  }

  if (!course || !course.semester) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="max-w-md rounded-[32px] border border-stone-200 bg-[#fffaf3]/90 p-8 text-center shadow-[0_24px_80px_rgba(80,54,36,0.08)]">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-stone-500">Not Found</p>
          <h1 className="mt-4 text-4xl font-semibold text-stone-900">This course does not exist in this browser workspace.</h1>
          <p className="mt-4 text-sm leading-6 text-stone-600">
            Head back to StudentCore courses and create a course for this browser.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link href="/courses">
              <Button>Courses</Button>
            </Link>
            <Link href="/">
              <Button tone="secondary">Dashboard</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[32px] border border-stone-200/80 bg-[#fffaf3]/90 p-6 shadow-[0_24px_80px_rgba(80,54,36,0.08)] md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-stone-500">
              {course.code}
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-stone-900">
              {course.name}
            </h1>
            <p className="mt-3 text-base text-stone-600">
              {course.lecturerName} · {course.semester.name}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge>{course.tasks.length} tasks</Badge>
            <Badge>{course.assessments.length} assessments</Badge>
            <Badge>{course.files.length} files</Badge>
            <Badge>{course.results.length} results</Badge>
          </div>
        </div>
      </section>

      <Section title="Course Info" description="Update course details or remove the course from this browser.">
        <CourseUpdateForm
          course={course}
          semesters={semesters}
          onUpdate={updateCourse}
          onDelete={(courseId) => {
            deleteCourse(courseId);
            router.push("/courses");
          }}
        />
      </Section>

      <div className="grid gap-6 xl:grid-cols-2">
        <Section title="Files" description="Files stay in this browser only after upload.">
          <FileUploadForm
            courseId={course.id}
            onUpload={(payload) => uploadFile({ ...payload, courseId: course.id })}
          />
          <div className="mt-5 space-y-3">
            {course.files.length ? (
              course.files.map((file) => (
                <div key={file.id} className="rounded-3xl border border-stone-200 bg-white/70 p-4">
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <h3 className="font-semibold text-stone-900">{file.title}</h3>
                      <p className="text-sm text-stone-600">
                        {titleCase(file.fileCategory)} · {bytesToSize(file.sizeBytes)}
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <a
                        href={file.fileDataUrl}
                        download={file.fileName}
                        className="inline-flex items-center justify-center rounded-2xl bg-stone-100 px-4 py-3 text-sm font-medium text-stone-900"
                      >
                        Open
                      </a>
                      <FileDeleteForm fileId={file.id} onDelete={deleteFile} />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <EmptyState title="No files uploaded" copy="Add notes, tutorial sheets, or past year papers." />
            )}
          </div>
        </Section>

        <Section title="Class Sessions" description="Timetable entries linked to this course.">
          <SessionCreateForm courses={courseOptions.filter((item) => item.id === course.id)} onCreate={createSession} fixedCourseId={course.id} />
          <div className="mt-5 space-y-4">
            {course.sessions.length ? (
              course.sessions.map((session) => (
                <div key={session.id} className="rounded-3xl border border-stone-200 bg-white/70 p-4">
                  <p className="mb-3 text-sm text-stone-600">
                    {titleCase(session.dayOfWeek)} · {session.startTime} - {session.endTime}
                  </p>
                  <SessionUpdateForm session={session} onUpdate={updateSession} onDelete={deleteSession} />
                </div>
              ))
            ) : (
              <EmptyState title="No class sessions yet" copy="Add lecture, tutorial, or lab slots for this course." />
            )}
          </div>
        </Section>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Section title="Tasks" description="Linked tasks for this course.">
          <TaskCreateForm courses={courseOptions.filter((item) => item.id === course.id)} onCreate={createTask} fixedCourseId={course.id} />
          <div className="mt-5 space-y-4">
            {course.tasks.length ? (
              course.tasks.map((task) => (
                <div key={task.id} className="rounded-3xl border border-stone-200 bg-white/70 p-4">
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <Badge>{titleCase(task.status)}</Badge>
                    <Badge className="bg-[#f6d8c8] text-[#7a3626]">{titleCase(task.priority)}</Badge>
                    {task.dueAt ? <span className="text-sm text-stone-600">{describeDeadline(task.dueAt)}</span> : null}
                  </div>
                  <TaskUpdateForm task={task} courses={courseOptions} onUpdate={updateTask} onDelete={deleteTask} />
                </div>
              ))
            ) : (
              <EmptyState title="No tasks for this course" copy="Create task items such as revision work or admin reminders." />
            )}
          </div>
        </Section>

        <Section title="Assessments" description="Track graded work for this course.">
          <AssessmentCreateForm courses={courseOptions.filter((item) => item.id === course.id)} onCreate={createAssessment} fixedCourseId={course.id} />
          <div className="mt-5 space-y-4">
            {course.assessments.length ? (
              course.assessments.map((assessment) => (
                <div key={assessment.id} className="rounded-3xl border border-stone-200 bg-white/70 p-4">
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <Badge>{titleCase(assessment.type)}</Badge>
                    <Badge className="bg-[#d8ead9] text-[#27563c]">{titleCase(assessment.status)}</Badge>
                    <span className="text-sm text-stone-600">{formatDateTime(assessment.dueAt)}</span>
                  </div>
                  <AssessmentUpdateForm
                    assessment={assessment}
                    courses={courseOptions}
                    onUpdate={updateAssessment}
                    onDelete={deleteAssessment}
                  />
                </div>
              ))
            ) : (
              <EmptyState title="No assessments yet" copy="Add quizzes, tests, assignments, exams, or presentations for this course." />
            )}
          </div>
        </Section>
      </div>

      <Section title="Results" description="Track released or expected result records for this course.">
        <ResultCreateForm
          courses={courseOptions.filter((item) => item.id === course.id)}
          semesters={semesters}
          onCreate={(payload) => createResult({ ...payload, courseId: course.id, semesterId: course.semesterId })}
        />
        <div className="mt-5 space-y-4">
          {course.results.length ? (
            course.results.map((result) => (
              <div key={result.id} className="rounded-3xl border border-stone-200 bg-white/70 p-4">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <Badge>{result.grade}</Badge>
                  <Badge className="bg-[#d8ead9] text-[#27563c]">{titleCase(result.status)}</Badge>
                  <span className="text-sm text-stone-600">
                    GPA point {result.gradePoint.toFixed(2)} · {result.creditHours} credits
                  </span>
                </div>
                <ResultUpdateForm
                  result={result}
                  courses={courseOptions}
                  semesters={semesters}
                  onUpdate={updateResult}
                  onDelete={deleteResult}
                />
              </div>
            ))
          ) : (
            <EmptyState title="No result records yet" copy="Add final grades, score, and credit hours for this course." />
          )}
        </div>
      </Section>
    </div>
  );
}
