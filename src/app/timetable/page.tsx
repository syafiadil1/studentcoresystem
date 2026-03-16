"use client";

import { useStudentCore } from "@/components/student-core-provider";
import { dayOrder } from "@/lib/constants";
import { SessionCreateForm, SessionUpdateForm } from "@/components/forms";
import { Badge, EmptyState, Section } from "@/components/ui";
import { getTimetableData } from "@/lib/local-data";
import { titleCase } from "@/lib/utils";

export default function TimetablePage() {
  const { hydrated, state, createSession, updateSession, deleteSession } = useStudentCore();
  const sessions = getTimetableData(state);
  const courses = state.courses.map((course) => ({
    id: course.id,
    code: course.code,
    name: course.name,
  }));

  return (
    <div className="space-y-6">
      <Section title="Add Timetable Session" description="Build a weekly class view stored in this browser.">
        {courses.length ? (
          <SessionCreateForm courses={courses} onCreate={createSession} />
        ) : (
          <EmptyState title="No courses available" copy="Create a course first before adding timetable sessions." />
        )}
      </Section>

      {!hydrated ? (
        <EmptyState title="Loading timetable" copy="Reading timetable data from this browser." />
      ) : (
        <Section title="Weekly Board" description="Sessions grouped by weekday and sorted by start time.">
          {sessions.length ? (
            <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
              {dayOrder.map((day) => {
                const daySessions = sessions.filter((session) => session.dayOfWeek === day);

                return (
                  <div key={day} className="rounded-3xl border border-stone-200 bg-white/70 p-4">
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="text-xl font-semibold text-stone-900">{titleCase(day)}</h3>
                      <Badge>{daySessions.length} slots</Badge>
                    </div>

                    {daySessions.length ? (
                      <div className="space-y-4">
                        {daySessions.map((session) => (
                          <div key={session.id} className="rounded-3xl border border-stone-200 bg-stone-50/80 p-4">
                            <div className="mb-3 flex items-start justify-between gap-3">
                              <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-500">
                                  {session.course.code}
                                </p>
                                <h4 className="mt-1 font-semibold text-stone-900">{session.course.name}</h4>
                                <p className="text-sm text-stone-600">
                                  {session.startTime} - {session.endTime}
                                </p>
                              </div>
                              <div className="h-3 w-3 rounded-full" style={{ backgroundColor: session.course.color }} />
                            </div>
                            <SessionUpdateForm
                              session={session}
                              onUpdate={updateSession}
                              onDelete={deleteSession}
                            />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <EmptyState title="No sessions" copy="This day is empty in your timetable." />
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <EmptyState title="Timetable is empty" copy="Create your first class session above." />
          )}
        </Section>
      )}
    </div>
  );
}
