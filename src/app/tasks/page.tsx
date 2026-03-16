import { getTaskPageData } from "@/lib/data";
import { taskStatusOptions } from "@/lib/constants";
import { TaskCreateForm, TaskUpdateForm } from "@/components/forms";
import { Badge, EmptyState, Section } from "@/components/ui";
import { describeDeadline, formatDateTime, titleCase } from "@/lib/utils";

type SearchParams = Promise<{
  courseId?: string;
  status?: string;
}>;

export default async function TasksPage({ searchParams }: { searchParams: SearchParams }) {
  const filters = await searchParams;
  const data = await getTaskPageData(filters);
  const courseOptions = data.courses.map((course) => ({
    id: course.id,
    code: course.code,
    name: course.name,
  }));

  return (
    <div className="space-y-6">
      <Section title="Add Task" description="Capture coursework, revision, or admin tasks.">
        <TaskCreateForm courses={courseOptions} sourcePath="/tasks" />
      </Section>

      <Section title="Task List" description="Filter by linked course and current status.">
        <form className="mb-5 grid gap-4 rounded-3xl border border-stone-200 bg-white/70 p-4 md:grid-cols-3">
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
            name="status"
            defaultValue={filters.status || ""}
            className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm"
          >
            <option value="">All statuses</option>
            {taskStatusOptions.map((status) => (
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

        {data.tasks.length ? (
          <div className="space-y-4">
            {data.tasks.map((task) => (
              <div key={task.id} className="rounded-3xl border border-stone-200 bg-white/70 p-4">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-stone-900">{task.title}</h3>
                    <p className="text-sm text-stone-600">{task.course?.name || "General task"}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge>{titleCase(task.status)}</Badge>
                    <Badge className="bg-[#f6d8c8] text-[#7a3626]">{titleCase(task.priority)}</Badge>
                  </div>
                </div>
                {task.dueAt ? (
                  <p className="mb-3 text-sm text-stone-700">
                    {formatDateTime(task.dueAt)} · {describeDeadline(task.dueAt)}
                  </p>
                ) : null}
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
                  sourcePath="/tasks"
                />
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No tasks found"
            copy="Try changing your filters or create a new task above."
          />
        )}
      </Section>
    </div>
  );
}
