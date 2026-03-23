"use client";

import Link from "next/link";
import { useState } from "react";
import { Search as SearchIcon } from "lucide-react";
import { useStudentCore } from "@/components/student-core-provider";
import { Badge, EmptyState, Input, Section, StatCard } from "@/components/ui";
import { getGlobalSearchData } from "@/lib/local-data";
import {
  bytesToSize,
  describeDeadline,
  formatDateTime,
  normalizeSearch,
  openDataUrlInNewTab,
  titleCase,
} from "@/lib/utils";

function matchesQuery(query: string, values: Array<string | null | undefined>) {
  if (!query) {
    return true;
  }

  return values.join(" ").toLowerCase().includes(query);
}

export default function SearchPage() {
  const { hydrated, state } = useStudentCore();
  const [query, setQuery] = useState("");
  const data = getGlobalSearchData(state);
  const normalizedQuery = normalizeSearch(query);

  const courses = data.courses.filter((course) =>
    matchesQuery(normalizedQuery, [course.code, course.name, course.lecturerName, course.semester?.name]),
  );
  const sessions = data.sessions.filter((session) =>
    matchesQuery(normalizedQuery, [
      session.course?.code,
      session.course?.name,
      session.dayOfWeek,
      session.location,
      session.sessionType,
      session.startTime,
      session.endTime,
    ]),
  );
  const tasks = data.tasks.filter((task) =>
    matchesQuery(normalizedQuery, [
      task.title,
      task.description,
      task.category,
      task.status,
      task.priority,
      task.course?.code,
      task.course?.name,
      task.dueAt || "",
    ]),
  );
  const assessments = data.assessments.filter((assessment) =>
    matchesQuery(normalizedQuery, [
      assessment.title,
      assessment.type,
      assessment.status,
      assessment.course?.code,
      assessment.course?.name,
      assessment.dueAt,
      assessment.weight ? String(assessment.weight) : "",
    ]),
  );
  const files = data.files.filter((file) =>
    matchesQuery(normalizedQuery, [
      file.title,
      file.fileName,
      file.fileCategory,
      file.mimeType,
      file.course?.code,
      file.course?.name,
    ]),
  );
  const results = data.results.filter((result) =>
    matchesQuery(normalizedQuery, [
      result.title,
      result.grade,
      result.status,
      result.notes,
      String(result.creditHours),
      result.course?.code,
      result.course?.name,
      result.semester?.name,
    ]),
  );

  const totalMatches =
    courses.length + sessions.length + tasks.length + assessments.length + files.length + results.length;

  return (
    <div className="space-y-6">
      <section className="rounded-[32px] border border-stone-200/80 bg-[#fffaf3]/90 p-6 shadow-[0_24px_80px_rgba(80,54,36,0.08)] md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-stone-500">Global Search</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-stone-900">Find anything in StudentCore.</h1>
            <p className="mt-3 max-w-2xl text-base text-stone-600">
              Search across courses, timetable, tasks, assessments, files, and results from one place.
            </p>
          </div>
          <div className="flex items-center gap-3 rounded-3xl bg-stone-900 px-5 py-4 text-stone-100">
            <SearchIcon className="h-5 w-5" />
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-stone-400">Matches</p>
              <p className="text-2xl font-semibold">{normalizedQuery ? totalMatches : state.courses.length + state.tasks.length + state.assessments.length + state.files.length + (state.results?.length ?? 0) + state.sessions.length}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <StatCard label="Courses" value={courses.length} />
        <StatCard label="Tasks" value={tasks.length} tone="accent" />
        <StatCard label="Assessments" value={assessments.length} tone="success" />
      </section>

      <Section title="Search Workspace" description="Type course code, title, status, grade, file name, or any keyword.">
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search course code, file name, assignment, grade, lecturer, location..."
        />
      </Section>

      {!hydrated ? (
        <EmptyState title="Loading workspace search" copy="Reading search data from this browser." />
      ) : totalMatches === 0 ? (
        <EmptyState
          title={normalizedQuery ? "No matches found" : "Workspace is empty"}
          copy={
            normalizedQuery
              ? "Try another keyword for course, task, assessment, result, file, or timetable session."
              : "Add courses, tasks, files, or results to start searching your workspace."
          }
        />
      ) : (
        <div className="grid gap-6 xl:grid-cols-2">
          <Section title="Courses" description="Courses and semester information.">
            <div className="space-y-3">
              {courses.length ? (
                courses.map((course) => (
                  <Link
                    key={course.id}
                    href={`/courses/${course.id}`}
                    className="block rounded-3xl border border-stone-200 bg-white/70 p-4 transition hover:border-stone-400 hover:bg-white"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-500">{course.code}</p>
                        <h3 className="mt-1 font-semibold text-stone-900">{course.name}</h3>
                        <p className="text-sm text-stone-600">{course.lecturerName} · {course.semester?.name || "No semester"}</p>
                      </div>
                      <Badge>{course.semester?.isActive ? "Active" : "Course"}</Badge>
                    </div>
                  </Link>
                ))
              ) : (
                <EmptyState title="No matching courses" copy="Try another course code, lecturer, or semester keyword." />
              )}
            </div>
          </Section>

          <Section title="Timetable" description="Sessions, day, time, and location.">
            <div className="space-y-3">
              {sessions.length ? (
                sessions.map((session) => (
                  <Link
                    key={session.id}
                    href={`/courses/${session.course!.id}`}
                    className="block rounded-3xl border border-stone-200 bg-white/70 p-4 transition hover:border-stone-400 hover:bg-white"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-500">{session.course?.code}</p>
                        <h3 className="mt-1 font-semibold text-stone-900">{titleCase(session.sessionType)}</h3>
                        <p className="text-sm text-stone-600">
                          {titleCase(session.dayOfWeek)} · {session.startTime} - {session.endTime} · {session.location}
                        </p>
                      </div>
                      <Badge>{session.course?.name || "Course"}</Badge>
                    </div>
                  </Link>
                ))
              ) : (
                <EmptyState title="No matching sessions" copy="Search by day, time, location, or course code." />
              )}
            </div>
          </Section>

          <Section title="Tasks" description="To-do items, revision, homework, and deadlines.">
            <div className="space-y-3">
              {tasks.length ? (
                tasks.map((task) => (
                  <Link
                    key={task.id}
                    href="/tasks"
                    className="block rounded-3xl border border-stone-200 bg-white/70 p-4 transition hover:border-stone-400 hover:bg-white"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <h3 className="font-semibold text-stone-900">{task.title}</h3>
                        <p className="mt-1 text-sm text-stone-600">
                          {task.course ? `${task.course.code} · ${task.course.name}` : "General task"}
                        </p>
                        <p className="mt-2 text-sm text-stone-700">{task.description || "No description"}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Badge>{titleCase(task.status)}</Badge>
                        <Badge className="bg-[#f6d8c8] text-[#7a3626]">{titleCase(task.priority)}</Badge>
                      </div>
                    </div>
                    {task.dueAt ? <p className="mt-3 text-sm text-stone-600">{describeDeadline(task.dueAt)}</p> : null}
                  </Link>
                ))
              ) : (
                <EmptyState title="No matching tasks" copy="Search by title, description, status, or priority." />
              )}
            </div>
          </Section>

          <Section title="Assessments" description="Assignments, quizzes, tests, exams, and presentations.">
            <div className="space-y-3">
              {assessments.length ? (
                assessments.map((assessment) => (
                  <Link
                    key={assessment.id}
                    href="/assessments"
                    className="block rounded-3xl border border-stone-200 bg-white/70 p-4 transition hover:border-stone-400 hover:bg-white"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <h3 className="font-semibold text-stone-900">{assessment.title}</h3>
                        <p className="mt-1 text-sm text-stone-600">
                          {assessment.course?.code} · {assessment.course?.name}
                        </p>
                        <p className="mt-2 text-sm text-stone-700">{formatDateTime(assessment.dueAt)}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Badge>{titleCase(assessment.type)}</Badge>
                        <Badge className="bg-[#d8ead9] text-[#27563c]">{titleCase(assessment.status)}</Badge>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <EmptyState title="No matching assessments" copy="Search by assessment name, type, course, or status." />
              )}
            </div>
          </Section>

          <Section title="Files" description="Course files, notes, and uploaded materials.">
            <div className="space-y-3">
              {files.length ? (
                files.map((file) => (
                  <div key={file.id} className="rounded-3xl border border-stone-200 bg-white/70 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-500">
                          {file.course?.code}
                        </p>
                        <h3 className="mt-1 font-semibold text-stone-900">{file.title}</h3>
                        <p className="text-sm text-stone-600">
                          {file.fileName} · {titleCase(file.fileCategory)} · {bytesToSize(file.sizeBytes)}
                        </p>
                      </div>
                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => openDataUrlInNewTab(file.fileDataUrl)}
                          className="inline-flex items-center justify-center rounded-2xl bg-stone-100 px-4 py-3 text-sm font-medium text-stone-900"
                        >
                          Open
                        </button>
                        <Link
                          href={`/courses/${file.course!.id}`}
                          className="inline-flex items-center justify-center rounded-2xl bg-stone-900 px-4 py-3 text-sm font-medium text-white"
                        >
                          Course
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <EmptyState title="No matching files" copy="Search by file name, title, category, or course code." />
              )}
            </div>
          </Section>

          <Section title="Results" description="Semester results, grades, pointer, and credits.">
            <div className="space-y-3">
              {results.length ? (
                results.map((result) => (
                  <Link
                    key={result.id}
                    href="/results"
                    className="block rounded-3xl border border-stone-200 bg-white/70 p-4 transition hover:border-stone-400 hover:bg-white"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-500">
                          {result.course?.code || "Result"}
                        </p>
                        <h3 className="mt-1 font-semibold text-stone-900">{result.title}</h3>
                        <p className="text-sm text-stone-600">
                          {result.course?.name || "No course"} · {result.semester?.name || "No semester"}
                        </p>
                        <p className="mt-2 text-sm text-stone-700">
                          Grade {result.grade} · Pointer {result.gradePoint.toFixed(2)} · {result.creditHours} credit hours
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Badge>{result.grade}</Badge>
                        <Badge className="bg-[#d8ead9] text-[#27563c]">{titleCase(result.status)}</Badge>
                      </div>
                    </div>
                    {result.notes ? <p className="mt-3 text-sm text-stone-600">{result.notes}</p> : null}
                  </Link>
                ))
              ) : (
                <EmptyState title="No matching results" copy="Search by grade, semester, course, or notes." />
              )}
            </div>
          </Section>
        </div>
      )}
    </div>
  );
}
