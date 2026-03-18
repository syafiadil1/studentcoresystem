"use client";

import { useState } from "react";
import { useStudentCore } from "@/components/student-core-provider";
import { ResultCreateForm, ResultUpdateForm } from "@/components/forms";
import { Badge, DetailRow, EmptyState, Section, StatCard } from "@/components/ui";
import { getResultsPageData } from "@/lib/local-data";
import { titleCase } from "@/lib/utils";

export default function ResultsPage() {
  const { hydrated, state, createResult, updateResult, deleteResult } = useStudentCore();
  const [selectedResultId, setSelectedResultId] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const data = getResultsPageData(state);
  const courseOptions = data.courses.map((course) => ({
    id: course.id,
    code: course.code,
    name: course.name,
  }));
  const semesterOptions = data.semesters.map((semester) => ({
    id: semester.id,
    name: semester.name,
    isActive: semester.isActive,
  }));

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-3">
        <StatCard label="CGPA" value={data.cgpa.toFixed(2)} tone="accent" />
        <StatCard label="Credits" value={data.totalCredits} />
        <StatCard label="Results" value={data.results.length} tone="success" />
      </section>

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <Section title="Add Result" description="Store final result, GPA inputs, and released grades by course.">
          {courseOptions.length && semesterOptions.length ? (
            <ResultCreateForm courses={courseOptions} semesters={semesterOptions} onCreate={createResult} />
          ) : (
            <EmptyState title="Courses or semesters missing" copy="Create your semester and courses first before adding results." />
          )}
        </Section>

        <Section title="Semester Performance" description="Quick GPA summary by semester.">
          {data.summaries.length ? (
            <div className="space-y-3">
              {data.summaries.map((summary) => (
                <div key={summary.semesterId} className="rounded-3xl border border-stone-200 bg-white/80 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-semibold text-stone-900">{summary.semesterName}</h3>
                      <p className="mt-1 text-sm text-stone-600">{summary.resultsCount} results · {summary.totalCredits} credits</p>
                    </div>
                    <Badge className="bg-[#d8ead9] text-[#27563c]">GPA {summary.gpa.toFixed(2)}</Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState title="No results yet" copy="Once you add course results, semester GPA will appear here." />
          )}
        </Section>
      </div>

      {!hydrated ? (
        <EmptyState title="Loading results" copy="Reading result data from this browser." />
      ) : (
        <Section title="Result Records" description="Expand a result card to view full details or edit it.">
          {data.results.length ? (
            <div className="space-y-4">
              {data.results.map((result) => (
                <div
                  key={result.id}
                  className={`rounded-3xl border bg-white/70 p-4 transition ${
                    selectedResultId === result.id ? "border-stone-500 shadow-[0_18px_50px_rgba(80,54,36,0.12)]" : "border-stone-200"
                  }`}
                >
                  <div
                    className="cursor-pointer rounded-2xl transition hover:bg-stone-50/80"
                    onClick={() => {
                      setSelectedResultId((current) => (current === result.id ? null : result.id));
                      setEditing(false);
                    }}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-500">
                          {result.course?.code || "Unknown course"}
                        </p>
                        <h3 className="mt-1 text-lg font-semibold text-stone-900">{result.title}</h3>
                        <p className="text-sm text-stone-600">
                          {result.semester?.name || "Removed semester"} · {result.course?.name || "Removed course"}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Badge>{result.grade}</Badge>
                        <Badge className="bg-[#d8ead9] text-[#27563c]">{titleCase(result.status)}</Badge>
                      </div>
                    </div>
                    <p className="mt-3 text-sm text-stone-700">
                      Grade point {result.gradePoint.toFixed(2)} · {result.creditHours} credits
                    </p>
                  </div>
                  {selectedResultId === result.id ? (
                    <div className="mt-4 space-y-4 border-t border-stone-200 pt-4">
                      {!editing ? (
                        <>
                          <div className="grid gap-3 md:grid-cols-2">
                            <DetailRow label="Grade" value={result.grade} />
                            <DetailRow label="Grade Point" value={result.gradePoint.toFixed(2)} />
                            <DetailRow label="Credits" value={result.creditHours} />
                            <DetailRow label="Status" value={titleCase(result.status)} />
                          </div>
                          <DetailRow label="Notes" value={result.notes || "No notes"} />
                          <div className="flex gap-3">
                            <button
                              type="button"
                              onClick={() => setEditing(true)}
                              className="rounded-2xl bg-stone-900 px-4 py-3 text-sm font-medium text-white"
                            >
                              Edit result
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedResultId(null);
                                setEditing(false);
                              }}
                              className="rounded-2xl bg-stone-100 px-4 py-3 text-sm font-medium text-stone-900"
                            >
                              Collapse
                            </button>
                          </div>
                        </>
                      ) : (
                        <ResultUpdateForm
                          result={result}
                          courses={courseOptions}
                          semesters={semesterOptions}
                          onUpdate={updateResult}
                          onDelete={deleteResult}
                        />
                      )}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          ) : (
            <EmptyState title="No result records" copy="Add released or expected results to start tracking GPA and grades." />
          )}
        </Section>
      )}
    </div>
  );
}
