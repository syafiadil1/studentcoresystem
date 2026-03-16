import { getAssessmentPageData } from "@/lib/data";
import { assessmentStatusOptions, assessmentTypeOptions } from "@/lib/constants";
import { AssessmentCreateForm, AssessmentUpdateForm } from "@/components/forms";
import { Badge, EmptyState, Section } from "@/components/ui";
import { formatDateTime, titleCase } from "@/lib/utils";

type SearchParams = Promise<{
  courseId?: string;
  status?: string;
  type?: string;
}>;

export default async function AssessmentsPage({ searchParams }: { searchParams: SearchParams }) {
  const filters = await searchParams;
  const data = await getAssessmentPageData(filters);
  const courseOptions = data.courses.map((course) => ({
    id: course.id,
    code: course.code,
    name: course.name,
  }));

  return (
    <div className="space-y-6">
      <Section title="Add Assessment" description="Track homework, assignments, quizzes, tests, exams, and presentations.">
        <AssessmentCreateForm courses={courseOptions} sourcePath="/assessments" />
      </Section>

      <Section title="Assessment List" description="Filter upcoming and submitted academic work.">
        <form className="mb-5 grid gap-4 rounded-3xl border border-stone-200 bg-white/70 p-4 md:grid-cols-4">
          <select
            name="courseId"
            defaultValue={filters.courseId || ""}
            className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm"
          >
            <option value="">All courses</option>
            {data.courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.code} · {course.name}
              </option>
            ))}
          </select>
          <select
            name="type"
            defaultValue={filters.type || ""}
            className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm"
          >
            <option value="">All types</option>
            {assessmentTypeOptions.map((type) => (
              <option key={type} value={type}>
                {titleCase(type)}
              </option>
            ))}
          </select>
          <select
            name="status"
            defaultValue={filters.status || ""}
            className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm"
          >
            <option value="">All statuses</option>
            {assessmentStatusOptions.map((status) => (
              <option key={status} value={status}>
                {titleCase(status)}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="rounded-2xl bg-stone-900 px-4 py-3 text-sm font-medium text-white"
          >
            Apply filters
          </button>
        </form>

        {data.assessments.length ? (
          <div className="space-y-4">
            {data.assessments.map((assessment) => (
              <div key={assessment.id} className="rounded-3xl border border-stone-200 bg-white/70 p-4">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-stone-900">{assessment.title}</h3>
                    <p className="text-sm text-stone-600">{assessment.course.name}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge>{titleCase(assessment.type)}</Badge>
                    <Badge className="bg-[#d8ead9] text-[#27563c]">{titleCase(assessment.status)}</Badge>
                  </div>
                </div>
                <p className="mb-3 text-sm text-stone-700">
                  {formatDateTime(assessment.dueAt)}
                  {assessment.weight ? ` · ${assessment.weight}%` : ""}
                </p>
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
                  sourcePath="/assessments"
                />
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No assessments found"
            copy="Try changing filters or add your first assessment above."
          />
        )}
      </Section>
    </div>
  );
}
