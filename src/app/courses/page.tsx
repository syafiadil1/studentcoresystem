import Link from "next/link";
import { getCoursesPageData } from "@/lib/data";
import { CourseCreateForm, SemesterCreateForm, SemesterDeleteForm } from "@/components/forms";
import { Badge, EmptyState, Section } from "@/components/ui";
import { formatDate } from "@/lib/utils";

export default async function CoursesPage() {
  const semesters = await getCoursesPageData();
  const semesterOptions = semesters.map((semester) => ({
    id: semester.id,
    name: semester.name,
    isActive: semester.isActive,
  }));

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Section
          title="Add Semester"
          description="Manage academic periods and choose one active semester."
        >
          <SemesterCreateForm />
        </Section>

        <Section
          title="Add Course"
          description="Create courses that can be linked to sessions, tasks, assessments, and files."
        >
          <CourseCreateForm semesters={semesterOptions} />
        </Section>
      </div>

      <Section title="Courses" description="Browse all courses grouped by semester.">
        <div className="space-y-6">
          {semesters.map((semester) => (
            <div key={semester.id} className="rounded-[28px] border border-stone-200 bg-white/70 p-5">
              <div className="flex flex-col gap-3 border-b border-stone-200 pb-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-2xl font-semibold text-stone-900">{semester.name}</h3>
                    {semester.isActive ? <Badge className="bg-[#d8ead9] text-[#27563c]">Active</Badge> : null}
                  </div>
                  <p className="mt-2 text-sm text-stone-600">
                    {formatDate(semester.startDate)} - {formatDate(semester.endDate)}
                  </p>
                </div>
                <SemesterDeleteForm semesterId={semester.id} />
              </div>

              {semester.courses.length ? (
                <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {semester.courses.map((course) => (
                    <Link
                      key={course.id}
                      href={`/courses/${course.id}`}
                      className="rounded-3xl border border-stone-200 bg-stone-50/80 p-5 transition hover:-translate-y-0.5 hover:border-stone-400"
                    >
                      <div className="mb-4 flex items-start justify-between gap-3">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-500">
                            {course.code}
                          </p>
                          <h4 className="mt-2 text-xl font-semibold text-stone-900">{course.name}</h4>
                        </div>
                        <div className="h-4 w-4 rounded-full" style={{ backgroundColor: course.color }} />
                      </div>
                      <p className="text-sm text-stone-600">{course.lecturerName}</p>
                      <div className="mt-5 grid grid-cols-2 gap-3 text-sm text-stone-600">
                        <div className="rounded-2xl bg-white px-3 py-2">{course.sessions.length} sessions</div>
                        <div className="rounded-2xl bg-white px-3 py-2">{course.tasks.length} tasks</div>
                        <div className="rounded-2xl bg-white px-3 py-2">{course.assessments.length} assessments</div>
                        <div className="rounded-2xl bg-white px-3 py-2">{course.files.length} files</div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="mt-5">
                  <EmptyState
                    title="No courses in this semester"
                    copy="Add your modules above so they can appear across the planner."
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}
