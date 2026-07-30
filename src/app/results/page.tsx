"use client";

import { useState } from "react";
import { useStudentCore } from "@/components/student-core-provider";
import { ResultCreateForm, ResultUpdateForm } from "@/components/forms";
import { Badge, DetailRow, EmptyState, Section, StatCard } from "@/components/ui";
import { getResultsPageData } from "@/lib/local-data";
import { normalizeSearch, titleCase } from "@/lib/utils";

export default function ResultsPage() {
  const { hydrated, state, createResult, updateResult, deleteResult } = useStudentCore();
  const [selectedResultId, setSelectedResultId] = useState<string | null>(null);
  const [expandedSemesterId, setExpandedSemesterId] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [search, setSearch] = useState("");
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
  const query = normalizeSearch(search);
  const filteredResults = data.results.filter((result) => {
    if (!query) {
      return true;
    }

    const haystack = [
      result.title,
      result.grade,
      titleCase(result.status),
      String(result.creditHours),
      result.notes,
      result.course?.code || "",
      result.course?.name || "",
      result.semester?.name || "",
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(query);
  });

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
                <div
                  key={summary.semesterId}
                  className={`border bg-paper-2 p-4 transition-colors ${
                    expandedSemesterId === summary.semesterId
                      ? "border-line-strong"
                      : "border-line"
                  }`}
                >
                  <div
                    className="cursor-pointer transition-colors hover:bg-paper-2"
                    onClick={() =>
                      setExpandedSemesterId((current) =>
                        current === summary.semesterId ? null : summary.semesterId,
                      )
                    }
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-semibold text-ink">{summary.semesterName}</h3>
                        <p className="mt-1 text-sm text-muted">
                          {summary.resultsCount} results · {summary.totalCredits} credits
                        </p>
                      </div>
                      <Badge className="bg-success-bg text-success">GPA {summary.gpa.toFixed(2)}</Badge>
                    </div>
                  </div>
                  {expandedSemesterId === summary.semesterId ? (
                    <div className="mt-4 space-y-4 border-t border-line pt-4">
                      <div className="grid gap-3 md:grid-cols-3">
                        <DetailRow label="GPA" value={summary.gpa.toFixed(2)} />
                        <DetailRow label="Credits" value={summary.totalCredits} />
                        <DetailRow label="Results" value={summary.resultsCount} />
                      </div>
                      <div className="space-y-3">
                        {data.resultsBySemester[summary.semesterId]?.map((result) => (
                          <div
                            key={result.id}
                            className="border border-line bg-paper-2 p-4"
                          >
                            <div className="flex flex-wrap items-center justify-between gap-3">
                              <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                                  {result.course?.code || "Unknown course"}
                                </p>
                                <h4 className="mt-1 font-semibold text-ink">
                                  {result.course?.name || result.title}
                                </h4>
                                <p className="text-sm text-muted">{result.title}</p>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                <Badge>{result.grade}</Badge>
                                <Badge className="bg-panel-2 text-ink-2">
                                  Pointer {result.gradePoint.toFixed(2)}
                                </Badge>
                              </div>
                            </div>
                            <div className="mt-3 grid gap-3 md:grid-cols-3">
                              <DetailRow label="Grade" value={result.grade} />
                              <DetailRow label="Grade Point" value={result.gradePoint.toFixed(2)} />
                              <DetailRow label="Credit Hour" value={result.creditHours} />
                            </div>
                          </div>
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={() => setExpandedSemesterId(null)}
                        className="bg-panel-2 px-4 py-3 text-sm font-medium text-ink"
                      >
                        Collapse
                      </button>
                    </div>
                  ) : null}
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
          <div className="mb-5 grid gap-4 border border-line bg-paper-2 p-4 md:grid-cols-[1fr_auto]">
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search title, course, semester, grade, status, notes..."
              className="w-full border border-line bg-paper-2 px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-faint focus:border-line-strong"
            />
            <button
              type="button"
              onClick={() => setSearch("")}
              className="bg-panel-2 px-4 py-3 text-sm font-medium text-ink"
            >
              Clear
            </button>
          </div>
          {filteredResults.length ? (
            <div className="space-y-4">
              {filteredResults.map((result) => (
                <div
                  key={result.id}
                  className={`border bg-paper-2 p-4 transition-colors ${
                    selectedResultId === result.id ? "border-line-strong" : "border-line"
                  }`}
                >
                  <div
                    className="cursor-pointer transition-colors hover:bg-paper-2"
                    onClick={() => {
                      setSelectedResultId((current) => (current === result.id ? null : result.id));
                      setEditing(false);
                    }}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted">
                          {result.course?.code || "Unknown course"}
                        </p>
                        <h3 className="mt-1 text-lg font-semibold text-ink">{result.title}</h3>
                        <p className="text-sm text-muted">
                          {result.semester?.name || "Removed semester"} · {result.course?.name || "Removed course"}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Badge>{result.grade}</Badge>
                        <Badge className="bg-success-bg text-success">{titleCase(result.status)}</Badge>
                      </div>
                    </div>
                    <p className="mt-3 text-sm text-ink-2">
                      Grade point {result.gradePoint.toFixed(2)} · {result.creditHours} credits
                    </p>
                  </div>
                  {selectedResultId === result.id ? (
                    <div className="mt-4 space-y-4 border-t border-line pt-4">
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
                              className="bg-accent px-4 py-3 text-sm font-medium text-accent-ink"
                            >
                              Edit result
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedResultId(null);
                                setEditing(false);
                              }}
                              className="bg-panel-2 px-4 py-3 text-sm font-medium text-ink"
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
            <EmptyState
              title={data.results.length ? "No matching results" : "No result records"}
              copy={
                data.results.length
                  ? "Try a different keyword for title, course, semester, grade, or notes."
                  : "Add released or expected results to start tracking GPA and grades."
              }
            />
          )}
        </Section>
      )}
    </div>
  );
}
