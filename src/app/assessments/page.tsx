"use client";

import { useState } from "react";
import { useStudentCore } from "@/components/student-core-provider";
import { assessmentStatusOptions, assessmentTypeOptions } from "@/lib/constants";
import { AssessmentCreateForm, AssessmentUpdateForm } from "@/components/forms";
import { Badge, DetailModal, DetailRow, EmptyState, Section } from "@/components/ui";
import { getAssessmentPageData } from "@/lib/local-data";
import { formatDateTime, titleCase } from "@/lib/utils";

export default function AssessmentsPage() {
  const { hydrated, state, createAssessment, updateAssessment, deleteAssessment } = useStudentCore();
  const [courseId, setCourseId] = useState("");
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");
  const [selectedAssessmentId, setSelectedAssessmentId] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const data = getAssessmentPageData(state, {
    courseId: courseId || undefined,
    status: status || undefined,
    type: type || undefined,
  });
  const courseOptions = data.courses.map((course) => ({
    id: course.id,
    code: course.code,
    name: course.name,
  }));
  const selectedAssessment =
    data.assessments.find((assessment) => assessment.id === selectedAssessmentId) ?? null;

  return (
    <div className="space-y-6">
      <Section title="Add Assessment" description="Track homework, assignments, quizzes, tests, exams, and presentations.">
        {courseOptions.length ? (
          <AssessmentCreateForm courses={courseOptions} onCreate={createAssessment} />
        ) : (
          <EmptyState title="No courses available" copy="Create a course first before adding assessments." />
        )}
      </Section>

      {!hydrated ? (
        <EmptyState title="Loading assessments" copy="Reading assessment data from this browser." />
      ) : (
        <Section title="Assessment List" description="Filter upcoming and submitted academic work.">
          <div className="mb-5 grid gap-4 rounded-3xl border border-stone-200 bg-white/70 p-4 md:grid-cols-4">
            <select
              value={courseId}
              onChange={(event) => setCourseId(event.target.value)}
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
              value={type}
              onChange={(event) => setType(event.target.value)}
              className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm"
            >
              <option value="">All types</option>
              {assessmentTypeOptions.map((item) => (
                <option key={item} value={item}>
                  {titleCase(item)}
                </option>
              ))}
            </select>
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm"
            >
              <option value="">All statuses</option>
              {assessmentStatusOptions.map((item) => (
                <option key={item} value={item}>
                  {titleCase(item)}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => {
                setCourseId("");
                setType("");
                setStatus("");
              }}
              className="rounded-2xl bg-stone-100 px-4 py-3 text-sm font-medium text-stone-900"
            >
              Clear filters
            </button>
          </div>

          {data.assessments.length ? (
            <div className="space-y-4">
              {data.assessments.map((assessment) => (
                <div key={assessment.id} className="rounded-3xl border border-stone-200 bg-white/70 p-4">
                  <div
                    className="mb-3 flex cursor-pointer flex-wrap items-center justify-between gap-3 rounded-2xl transition hover:bg-stone-50/80"
                    onClick={() => {
                      setSelectedAssessmentId(assessment.id);
                      setEditing(false);
                    }}
                  >
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
                    assessment={assessment}
                    courses={courseOptions}
                    onUpdate={updateAssessment}
                    onDelete={deleteAssessment}
                  />
                </div>
              ))}
            </div>
          ) : (
            <EmptyState title="No assessments found" copy="Try changing filters or add your first assessment above." />
          )}
        </Section>
      )}

      <DetailModal
        open={Boolean(selectedAssessment)}
        title={selectedAssessment?.title || ""}
        subtitle={selectedAssessment?.course.name || ""}
        onClose={() => {
          setSelectedAssessmentId(null);
          setEditing(false);
        }}
      >
        {selectedAssessment ? (
          <>
            {!editing ? (
              <>
                <DetailRow label="Type" value={titleCase(selectedAssessment.type)} />
                <DetailRow label="Status" value={titleCase(selectedAssessment.status)} />
                <DetailRow label="Due" value={formatDateTime(selectedAssessment.dueAt)} />
                <DetailRow label="Weight" value={selectedAssessment.weight ? `${selectedAssessment.weight}%` : "Not set"} />
                <button
                  type="button"
                  onClick={() => setEditing(true)}
                  className="rounded-2xl bg-stone-900 px-4 py-3 text-sm font-medium text-white"
                >
                  Edit assessment
                </button>
              </>
            ) : (
              <AssessmentUpdateForm
                assessment={selectedAssessment}
                courses={courseOptions}
                onUpdate={updateAssessment}
                onDelete={deleteAssessment}
              />
            )}
          </>
        ) : null}
      </DetailModal>
    </div>
  );
}
