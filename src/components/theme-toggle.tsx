"use client";

import { useCallback, useEffect, useState } from "react";
import { Monitor, Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

type Mode = "light" | "dark";

function readMode(): Mode {
  if (typeof window === "undefined") return "dark";
  const stored = window.localStorage.getItem("studentcore-mode");
  if (stored === "light" || stored === "dark") return stored;
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

export function ThemeToggle({ className }: { className?: string }) {
  const [mode, setMode] = useState<Mode>(() => readMode());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute("data-mode", mode);
    window.localStorage.setItem("studentcore-mode", mode);
    setMounted(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cycle = useCallback(() => {
    setMode((prev) => {
      const next: Mode = prev === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-mode", next);
      window.localStorage.setItem("studentcore-mode", next);
      return next;
    });
  }, []);

  return (
    <button
      type="button"
      onClick={cycle}
      aria-label={`Switch to ${mode === "dark" ? "light" : "dark"} mode`}
      className={cn(
        "inline-flex items-center gap-2 border border-line bg-paper-2 px-3 py-2 text-sm transition-colors hover:border-line-strong hover:text-ink",
        className,
      )}
    >
      {!mounted ? (
        <Monitor className="h-4 w-4 text-faint" />
      ) : mode === "dark" ? (
        <Sun className="h-4 w-4 text-accent" />
      ) : (
        <Moon className="h-4 w-4 text-accent" />
      )}
      <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
        {mounted ? mode : "mode"}
      </span>
    </button>
  );
}
