"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Award, BookOpen, CalendarRange, ClipboardList, Home, ListChecks } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Dashboard", icon: Home },
  { href: "/courses", label: "Courses", icon: BookOpen },
  { href: "/timetable", label: "Timetable", icon: CalendarRange },
  { href: "/tasks", label: "Tasks", icon: ListChecks },
  { href: "/assessments", label: "Assessments", icon: ClipboardList },
  { href: "/results", label: "Results", icon: Award },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(225,106,84,0.12),_transparent_30%),linear-gradient(180deg,#f5efe6_0%,#f8f4ed_42%,#f2efe8_100%)] text-stone-900">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col gap-6 px-4 py-5 md:flex-row md:px-6">
        <aside className="md:sticky md:top-5 md:h-[calc(100vh-2.5rem)] md:w-72">
          <div className="flex h-full flex-col rounded-[28px] border border-stone-200/80 bg-[#fffaf3]/90 p-5 shadow-[0_24px_80px_rgba(80,54,36,0.08)] backdrop-blur">
            <div className="mb-8">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-stone-500">
                StudentCore
              </p>
              <h1 className="mt-3 text-2xl font-semibold tracking-tight text-stone-900">
                Academic Workspace
              </h1>
              <p className="mt-2 text-sm leading-6 text-stone-600">
                StudentCore keeps your classes, deadlines, files, and weekly study flow in one browser workspace.
              </p>
            </div>

            <nav className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href || pathname.startsWith(`${item.href}/`);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition",
                      active
                        ? "bg-stone-900 text-white shadow-lg"
                        : "text-stone-600 hover:bg-stone-100 hover:text-stone-900",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-auto rounded-2xl bg-stone-900 px-4 py-4 text-sm text-stone-100">
              <p className="font-medium">Browser-local workspace</p>
              <p className="mt-2 text-stone-300">
                Data is stored in this browser only. Other users start with their own empty workspace.
              </p>
            </div>
          </div>
        </aside>

        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
