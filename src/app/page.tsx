"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, RotateCcw } from "lucide-react";
import { useStudentCore } from "@/components/student-core-provider";
import { AssessmentUpdateForm, SessionUpdateForm, TaskUpdateForm } from "@/components/forms";
import { Badge, Button, DetailModal, DetailRow, EmptyState, Section, StatCard } from "@/components/ui";
import { getDashboardData } from "@/lib/local-data";
import { describeDeadline, formatDateTime, titleCase } from "@/lib/utils";

export default function DashboardPage() {
  const {
    hydrated,
    state,
    resetWorkspace,
    updateSession,
    deleteSession,
    updateTask,
    deleteTask,
    updateAssessment,
    deleteAssessment,
  } = useStudentCore();
  const data = getDashboardData(state);
  const courseOptions = state.courses.map((course) => ({
    id: course.id,
    code: course.code,
    name: course.name,
  }));
  const [selectedItem, setSelectedItem] = useState<
    | { kind: "class"; id: string }
    | { kind: "task"; id: string }
    | { kind: "assessment"; id: string }
    | null
  >(null);
  const [editing, setEditing] = useState(false);

  const selectedClassCard =
    selectedItem?.kind === "class"
      ? data.todayClasses.find((item) => item.id === selectedItem.id) ?? null
      : null;
  const selectedClass =
    selectedItem?.kind === "class"
      ? state.sessions.find((session) => session.id === selectedItem.id) ?? null
      : null;
  const selectedTask =
    selectedItem?.kind === "task"
      ? state.tasks.find((item) => item.id === selectedItem.id) ?? null
      : null;
  const selectedAssessmentCard =
    selectedItem?.kind === "assessment"
      ? data.upcomingAssessments.find((item) => item.id === selectedItem.id) ?? null
      : null;
  const selectedAssessment =
    selectedItem?.kind === "assessment"
      ? state.assessments.find((item) => item.id === selectedItem.id) ?? null
      : null;
  const selectedTaskCourse = selectedTask
    ? state.courses.find((course) => course.id === selectedTask.courseId)
    : null;
  const selectedAssessmentCourse = selectedAssessment
    ? state.courses.find((course) => course.id === selectedAssessment.courseId)
    : null;

  return (
    <div className="space-y-6">
      <section className="rounded-[32px] border border-stone-200/80 bg-[#fffaf3]/90 p-6 shadow-[0_24px_80px_rgba(80,54,36,0.08)] md:p-8">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-stone-500">
              StudentCore
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-stone-900">
              Run your academic week from one StudentCore workspace.
            </h1>
            <p className="mt-4 text-base leading-7 text-stone-600">
              All data stays in this browser only. New users open with an empty workspace unless
              they add their own courses and tasks.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link href="/courses">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add course
              </Button>
            </Link>
            <Link href="/tasks">
              <Button tone="secondary">Quick add task</Button>
            </Link>
            <Link href="/assessments">
              <Button tone="secondary">Quick add assessment</Button>
            </Link>
            <Link href="/timetable">
              <Button tone="secondary">Quick add class</Button>
            </Link>
            <Button tone="secondary" className="gap-2" onClick={resetWorkspace} type="button">
              <RotateCcw className="h-4 w-4" />
              Reset browser data
            </Button>
          </div>
        </div>
      </section>

      {!hydrated ? (
        <EmptyState
          title="Loading your browser workspace"
          copy="StudentCore is reading local data from this browser."
        />
      ) : (
        <>
          <section className="grid gap-4 md:grid-cols-3">
            <StatCard label="To Do" value={data.taskSummary.todo} tone="accent" />
            <StatCard label="In Progress" value={data.taskSummary.inProgress} />
            <StatCard label="Done" value={data.taskSummary.done} tone="success" />
          </section>

          <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <Section title="Today's Classes" description="Sorted by time for the current day.">
              {data.todayClasses.length ? (
                <div className="grid gap-3">
                  {data.todayClasses.map((session) => (
                    <div
                      key={session.id}
                      className="cursor-pointer rounded-3xl border border-stone-200 bg-white/70 p-4 transition hover:-translate-y-0.5 hover:border-stone-400"
                      onClick={() => {
                        setSelectedItem({ kind: "class", id: session.id });
                        setEditing(false);
                      }}
                    >
                      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div className="flex items-center gap-4">
                          <div
                            className="h-14 w-2 rounded-full"
                            style={{ backgroundColor: session.color }}
                          />
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-500">
                              {session.courseCode}
                            </p>
                            <h3 className="text-lg font-semibold text-stone-900">
                              {session.courseName}
                            </h3>
                            <p className="text-sm text-stone-600">{session.location}</p>
                          </div>
                        </div>

                        <div className="text-sm text-stone-700">
                          <p className="font-medium">
                            {session.startTime} - {session.endTime}
                          </p>
                          <Badge className="mt-2">{titleCase(session.sessionType)}</Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  title="No classes today"
                  copy="Your timetable is empty for today. Add class sessions from the timetable page."
                />
              )}
            </Section>

            <Section title="Upcoming Assessments" description="Nearest quizzes, tests, and submissions.">
              {data.upcomingAssessments.length ? (
                <div className="space-y-3">
                  {data.upcomingAssessments.map((item) => (
                    <div
                      key={item.id}
                      className="cursor-pointer rounded-3xl border border-stone-200 bg-white/70 p-4 transition hover:-translate-y-0.5 hover:border-stone-400"
                      onClick={() => {
                        setSelectedItem({ kind: "assessment", id: item.id });
                        setEditing(false);
                      }}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <h3 className="font-semibold text-stone-900">{item.title}</h3>
                          <p className="text-sm text-stone-600">{item.courseName}</p>
                        </div>
                        <Badge>{titleCase(item.status)}</Badge>
                      </div>
                      <p className="mt-3 text-sm text-stone-700">{formatDateTime(item.dueAt)}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  title="No assessments yet"
                  copy="Create upcoming quizzes, exams, or presentations from the assessments page."
                />
              )}
            </Section>
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            <Section title="Overdue Tasks" description="Tasks past due and still not done.">
              {data.overdueTasks.length ? (
                <div className="space-y-3">
                  {data.overdueTasks.map((task) => (
                    <div
                      key={task.id}
                      className="cursor-pointer rounded-3xl border border-stone-200 bg-white/70 p-4 transition hover:-translate-y-0.5 hover:border-stone-400"
                      onClick={() => {
                        setSelectedItem({ kind: "task", id: task.id });
                        setEditing(false);
                      }}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <h3 className="font-semibold text-stone-900">{task.title}</h3>
                          <p className="text-sm text-stone-600">
                            {state.courses.find((course) => course.id === task.courseId)?.name || "General task"}
                          </p>
                        </div>
                        <Badge className="bg-[#f9d3d0] text-[#842029]">{titleCase(task.priority)}</Badge>
                      </div>
                      {task.dueAt ? (
                        <p className="mt-3 text-sm text-stone-700">
                          {formatDateTime(task.dueAt)} · {describeDeadline(task.dueAt)}
                        </p>
                      ) : null}
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState title="Nothing overdue" copy="You are caught up on tasks that have due dates." />
              )}
            </Section>

            <Section title="Due Soon" description="Upcoming task deadlines that still need work.">
              {data.dueSoonTasks.length ? (
                <div className="space-y-3">
                  {data.dueSoonTasks.map((task) => (
                    <div
                      key={task.id}
                      className="cursor-pointer rounded-3xl border border-stone-200 bg-white/70 p-4 transition hover:-translate-y-0.5 hover:border-stone-400"
                      onClick={() => {
                        setSelectedItem({ kind: "task", id: task.id });
                        setEditing(false);
                      }}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <h3 className="font-semibold text-stone-900">{task.title}</h3>
                          <p className="text-sm text-stone-600">
                            {state.courses.find((course) => course.id === task.courseId)?.name || "General task"}
                          </p>
                        </div>
                        <Badge>{titleCase(task.status)}</Badge>
                      </div>
                      {task.dueAt ? (
                        <p className="mt-3 text-sm text-stone-700">
                          {formatDateTime(task.dueAt)} · {describeDeadline(task.dueAt)}
                        </p>
                      ) : null}
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  title="No urgent tasks"
                  copy="Add upcoming work to keep your study plan realistic."
                />
              )}
            </Section>
          </div>
        </>
      )}

      <DetailModal
        open={Boolean(selectedClassCard && selectedClass)}
        title={selectedClassCard?.courseName || ""}
        subtitle={selectedClassCard ? `${selectedClassCard.courseCode} · ${titleCase(selectedClassCard.sessionType)}` : ""}
        onClose={() => {
          setSelectedItem(null);
          setEditing(false);
        }}
      >
        {selectedClassCard && selectedClass ? (
          <>
            {!editing ? (
              <>
                <DetailRow label="Time" value={`${selectedClassCard.startTime} - ${selectedClassCard.endTime}`} />
                <DetailRow label="Location" value={selectedClassCard.location} />
                <DetailRow label="Course" value={selectedClassCard.courseCode} />
                <Button type="button" onClick={() => setEditing(true)}>
                  Edit class
                </Button>
              </>
            ) : (
              <SessionUpdateForm
                session={selectedClass}
                onUpdate={(sessionId, payload) => {
                  updateSession(sessionId, payload);
                  setEditing(false);
                }}
                onDelete={(sessionId) => {
                  deleteSession(sessionId);
                  setSelectedItem(null);
                  setEditing(false);
                }}
              />
            )}
          </>
        ) : null}
      </DetailModal>

      <DetailModal
        open={Boolean(selectedTask)}
        title={selectedTask?.title || ""}
        subtitle={selectedTaskCourse?.name || "General task"}
        onClose={() => {
          setSelectedItem(null);
          setEditing(false);
        }}
      >
        {selectedTask ? (
          <>
            {!editing ? (
              <>
                <DetailRow label="Status" value={titleCase(selectedTask.status)} />
                <DetailRow label="Priority" value={titleCase(selectedTask.priority)} />
                <DetailRow label="Category" value={titleCase(selectedTask.category)} />
                <DetailRow
                  label="Due"
                  value={selectedTask.dueAt ? `${formatDateTime(selectedTask.dueAt)} · ${describeDeadline(selectedTask.dueAt)}` : "No due date"}
                />
                <DetailRow label="Description" value={selectedTask.description || "No description"} />
                <Button type="button" onClick={() => setEditing(true)}>
                  Edit task
                </Button>
              </>
            ) : (
              <TaskUpdateForm
                task={selectedTask}
                courses={courseOptions}
                onUpdate={(taskId, payload) => {
                  updateTask(taskId, payload);
                  setEditing(false);
                }}
                onDelete={(taskId) => {
                  deleteTask(taskId);
                  setSelectedItem(null);
                  setEditing(false);
                }}
              />
            )}
          </>
        ) : null}
      </DetailModal>

      <DetailModal
        open={Boolean(selectedAssessment && selectedAssessmentCard)}
        title={selectedAssessment?.title || ""}
        subtitle={selectedAssessmentCourse?.name || selectedAssessmentCard?.courseName || ""}
        onClose={() => {
          setSelectedItem(null);
          setEditing(false);
        }}
      >
        {selectedAssessment && selectedAssessmentCard ? (
          <>
            {!editing ? (
              <>
                <DetailRow label="Type" value={titleCase(selectedAssessment.type)} />
                <DetailRow label="Status" value={titleCase(selectedAssessment.status)} />
                <DetailRow label="Due" value={formatDateTime(selectedAssessment.dueAt)} />
                <DetailRow
                  label="Weight"
                  value={selectedAssessment.weight ? `${selectedAssessment.weight}%` : "Not set"}
                />
                <Button type="button" onClick={() => setEditing(true)}>
                  Edit assessment
                </Button>
              </>
            ) : (
              <AssessmentUpdateForm
                assessment={selectedAssessment}
                courses={courseOptions}
                onUpdate={(assessmentId, payload) => {
                  updateAssessment(assessmentId, payload);
                  setEditing(false);
                }}
                onDelete={(assessmentId) => {
                  deleteAssessment(assessmentId);
                  setSelectedItem(null);
                  setEditing(false);
                }}
              />
            )}
          </>
        ) : null}
      </DetailModal>
    </div>
  );
}
