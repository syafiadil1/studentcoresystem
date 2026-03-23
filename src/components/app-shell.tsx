"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Award, BookOpen, CalendarRange, ClipboardList, Home, ListChecks, Search } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Dashboard", icon: Home },
  { href: "/search", label: "Search", icon: Search },
  { href: "/courses", label: "Courses", icon: BookOpen },
  { href: "/timetable", label: "Timetable", icon: CalendarRange },
  { href: "/tasks", label: "Tasks", icon: ListChecks },
  { href: "/assessments", label: "Assessments", icon: ClipboardList },
  { href: "/results", label: "Results", icon: Award },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen text-stone-900">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col gap-6 px-4 py-5 md:flex-row md:px-6">
        <aside className="md:sticky md:top-5 md:h-[calc(100vh-2.5rem)] md:w-72">
          <div className="flex h-full flex-col rounded-[28px] border border-stone-200/80 bg-[#fffaf3]/90 p-5 shadow-[0_24px_80px_rgba(80,54,36,0.08)] backdrop-blur">
            <div className="mb-8">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-stone-500">
                studentcore
              </p>
              <h1 className="mt-3 text-2xl font-semibold tracking-tight text-stone-900">
                Academic workspace
              </h1>
              <p className="mt-2 text-sm leading-6 text-stone-600">
                Courses, deadlines, files, and results in one local terminal-style workspace.
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
                      "flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-medium transition",
                      active
                        ? "border-stone-500 bg-stone-900 text-white shadow-lg"
                        : "border-stone-200 text-stone-600 hover:bg-stone-100 hover:text-stone-900",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-xs tracking-[0.22em]">{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="mt-auto rounded-2xl bg-stone-900 px-4 py-4 text-sm text-stone-100">
              <p className="font-medium">Local storage</p>
              <p className="mt-2 text-stone-300">
                Data is stored in this browser only. New users boot into their own empty workspace.
              </p>
            </div>
          </div>
        </aside>

        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
