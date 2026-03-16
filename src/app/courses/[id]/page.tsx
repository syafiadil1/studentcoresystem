import { notFound } from "next/navigation";
import { getCourseDetail, getCoursesPageData } from "@/lib/data";
import {
  AssessmentCreateForm,
  AssessmentUpdateForm,
  CourseUpdateForm,
  FileDeleteForm,
  FileUploadForm,
  SessionCreateForm,
  SessionUpdateForm,
  TaskCreateForm,
  TaskUpdateForm,
} from "@/components/forms";
import { Badge, EmptyState, Section } from "@/components/ui";
import { bytesToSize, describeDeadline, formatDateTime, titleCase } from "@/lib/utils";

type Params = Promise<{ id: string }>;

export default async function CourseDetailPage({ params }: { params: Params }) {
  const { id } = await params;
  const [course, semesters] = await Promise.all([getCourseDetail(id), getCoursesPageData()]);

  if (!course) {
    notFound();
  }

  const semesterOptions = semesters.map((semester) => ({
    id: semester.id,
    name: semester.name,
    isActive: semester.isActive,
  }));
  const courseOptions = semesters.flatMap((semester) =>
    semester.courses.map((item) => ({
      id: item.id,
      code: item.code,
      name: item.name,
    })),
  );

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
          </div>
        </div>
      </section>

      <Section title="Course Info" description="Update course details or remove the course.">
        <CourseUpdateForm
          course={{
            id: course.id,
            code: course.code,
            name: course.name,
            lecturerName: course.lecturerName,
            color: course.color,
            semesterId: course.semesterId,
          }}
          semesters={semesterOptions}
        />
      </Section>

      <div className="grid gap-6 xl:grid-cols-2">
        <Section title="Files" description="Upload and organise course materials.">
          <FileUploadForm courseId={course.id} sourcePath={`/courses/${course.id}`} />
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
                        href={`/api/files/${file.id}`}
                        target="_blank"
                        className="inline-flex items-center justify-center rounded-2xl bg-stone-100 px-4 py-3 text-sm font-medium text-stone-900"
                      >
                        Open
                      </a>
                      <FileDeleteForm fileId={file.id} sourcePath={`/courses/${course.id}`} />
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
          <SessionCreateForm courses={courseOptions.filter((item) => item.id === course.id)} sourcePath={`/courses/${course.id}`} />
          <div className="mt-5 space-y-4">
            {course.sessions.length ? (
              course.sessions.map((session) => (
                <div key={session.id} className="rounded-3xl border border-stone-200 bg-white/70 p-4">
                  <p className="mb-3 text-sm text-stone-600">
                    {titleCase(session.dayOfWeek)} · {session.startTime} - {session.endTime}
                  </p>
                  <SessionUpdateForm
                    session={{
                      id: session.id,
                      dayOfWeek: session.dayOfWeek,
                      startTime: session.startTime,
                      endTime: session.endTime,
                      location: session.location,
                      sessionType: session.sessionType,
                    }}
                    sourcePath={`/courses/${course.id}`}
                  />
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
          <TaskCreateForm courses={courseOptions.filter((item) => item.id === course.id)} sourcePath={`/courses/${course.id}`} />
          <div className="mt-5 space-y-4">
            {course.tasks.length ? (
              course.tasks.map((task) => (
                <div key={task.id} className="rounded-3xl border border-stone-200 bg-white/70 p-4">
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <Badge>{titleCase(task.status)}</Badge>
                    <Badge className="bg-[#f6d8c8] text-[#7a3626]">{titleCase(task.priority)}</Badge>
                    {task.dueAt ? <span className="text-sm text-stone-600">{describeDeadline(task.dueAt)}</span> : null}
                  </div>
                  <TaskUpdateForm
                    task={{
                      id: task.id,
                      title: task.title,
                      description: task.description,
                      category: task.category,
                      status: task.status,
                      priority: task.priority,
                      dueAt: task.dueAt,
                      courseId: task.courseId,
                    }}
                    courses={courseOptions}
                    sourcePath={`/courses/${course.id}`}
                  />
                </div>
              ))
            ) : (
              <EmptyState title="No tasks for this course" copy="Create task items such as revision work or admin reminders." />
            )}
          </div>
        </Section>

        <Section title="Assessments" description="Track graded work for this course.">
          <AssessmentCreateForm courses={courseOptions.filter((item) => item.id === course.id)} sourcePath={`/courses/${course.id}`} />
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
                    assessment={{
                      id: assessment.id,
                      title: assessment.title,
                      type: assessment.type,
                      dueAt: assessment.dueAt,
                      weight: assessment.weight,
                      status: assessment.status,
                      courseId: assessment.courseId,
                    }}
                    courses={courseOptions}
                    sourcePath={`/courses/${course.id}`}
                  />
                </div>
              ))
            ) : (
              <EmptyState title="No assessments yet" copy="Add quizzes, tests, assignments, exams, or presentations for this course." />
            )}
          </div>
        </Section>
      </div>
    </div>
  );
}
