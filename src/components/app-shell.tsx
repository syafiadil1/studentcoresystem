"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Award, BookOpen, CalendarRange, ClipboardList, Home, ListChecks, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";

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
    <div className="min-h-screen">
      <div className="flex min-h-screen flex-col gap-6 px-3 py-5 md:flex-row md:px-4">
        <aside className="md:sticky md:top-5 md:z-sticky md:h-[calc(100vh-2.5rem)] md:w-72">
          <div className="flex h-full flex-col border border-line bg-panel p-5">
            <div className="mb-8">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent">
                studentcore
              </p>
              <h1 className="mt-3 text-2xl font-semibold tracking-tight">
                Academic workspace
              </h1>
              <p className="mt-2 text-sm leading-6 text-muted">
                Courses, deadlines, files, and results in one local terminal-style workspace.
              </p>
            </div>

            <nav className="space-y-1" aria-label="Primary">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href || pathname.startsWith(`${item.href}/`);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex items-center gap-3 border border-transparent px-3 py-2.5 text-sm transition-colors",
                      active
                        ? "border-line bg-panel-2 text-ink"
                        : "text-muted hover:bg-panel-2 hover:text-ink",
                    )}
                  >
                    <Icon className={cn("h-4 w-4", active ? "text-accent" : "text-faint")} aria-hidden="true" />
                    <span className="text-xs font-semibold uppercase tracking-[0.18em]">{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="mt-auto flex flex-col gap-3">
              <ThemeToggle />
              <div className="border border-line bg-paper-2 px-4 py-4 text-sm">
                <p className="font-medium text-ink">Local storage</p>
                <p className="mt-2 text-muted">
                  Data is stored in this browser only. New users boot into their own empty workspace.
                </p>
              </div>
            </div>
          </div>
        </aside>

        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
