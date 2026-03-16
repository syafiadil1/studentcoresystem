import Link from "next/link";
import { Plus } from "lucide-react";
import { getDashboardData } from "@/lib/data";
import { describeDeadline, formatDateTime, titleCase } from "@/lib/utils";
import { Badge, Button, EmptyState, Section, StatCard } from "@/components/ui";

export default async function DashboardPage() {
  const data = await getDashboardData();

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
              StudentCore helps you track classes, urgent deadlines, course materials, and every
              assessment without switching between tools.
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
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <StatCard label="To Do" value={data.taskSummary.todo} tone="accent" />
        <StatCard label="In Progress" value={data.taskSummary.inProgress} />
        <StatCard label="Done" value={data.taskSummary.done} tone="success" />
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Section title="Today&apos;s Classes" description="Sorted by time for the current day.">
          {data.todayClasses.length ? (
            <div className="grid gap-3">
              {data.todayClasses.map((session) => (
                <div
                  key={session.id}
                  className="rounded-3xl border border-stone-200 bg-white/70 p-4"
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
              copy="Your timetable is clear for today. Add class sessions from the timetable page."
            />
          )}
        </Section>

        <Section title="Upcoming Assessments" description="Nearest quizzes, tests, and submissions.">
          {data.upcomingAssessments.length ? (
            <div className="space-y-3">
              {data.upcomingAssessments.map((item) => (
                <div key={item.id} className="rounded-3xl border border-stone-200 bg-white/70 p-4">
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
                <div key={task.id} className="rounded-3xl border border-stone-200 bg-white/70 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-stone-900">{task.title}</h3>
                      <p className="text-sm text-stone-600">{task.course?.name || "General task"}</p>
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
                <div key={task.id} className="rounded-3xl border border-stone-200 bg-white/70 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-stone-900">{task.title}</h3>
                      <p className="text-sm text-stone-600">{task.course?.name || "General task"}</p>
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
    </div>
  );
}
