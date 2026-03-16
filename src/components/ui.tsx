import { cn } from "@/lib/utils";

export function Section({
  title,
  description,
  action,
  children,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[28px] border border-stone-200/80 bg-[#fffaf3]/90 p-5 shadow-[0_24px_80px_rgba(80,54,36,0.08)]">
      <div className="mb-5 flex flex-col gap-3 border-b border-stone-200 pb-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-stone-900">{title}</h2>
          {description ? <p className="mt-1 text-sm text-stone-600">{description}</p> : null}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

export function StatCard({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: string | number;
  tone?: "default" | "accent" | "danger" | "success";
}) {
  const toneClass =
    tone === "accent"
      ? "bg-[#f6d8c8] text-[#7a3626]"
      : tone === "danger"
        ? "bg-[#f9d3d0] text-[#842029]"
        : tone === "success"
          ? "bg-[#d8ead9] text-[#27563c]"
          : "bg-stone-100 text-stone-700";

  return (
    <div className="rounded-3xl border border-stone-200 bg-white/70 p-5">
      <p className="text-sm text-stone-500">{label}</p>
      <div className="mt-4 flex items-center justify-between">
        <p className="text-3xl font-semibold tracking-tight text-stone-900">{value}</p>
        <span className={cn("rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em]", toneClass)}>
          {label}
        </span>
      </div>
    </div>
  );
}

export function EmptyState({
  title,
  copy,
}: {
  title: string;
  copy: string;
}) {
  return (
    <div className="rounded-3xl border border-dashed border-stone-300 bg-stone-50/80 p-8 text-center">
      <h3 className="text-lg font-semibold text-stone-900">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-stone-600">{copy}</p>
    </div>
  );
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        "w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-stone-500",
        props.className,
      )}
    />
  );
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={cn(
        "min-h-28 w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-stone-500",
        props.className,
      )}
    />
  );
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={cn(
        "w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-900 outline-none transition focus:border-stone-500",
        props.className,
      )}
    />
  );
}

export function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-stone-700">{label}</span>
      {children}
    </label>
  );
}

export function Button({
  tone = "primary",
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  tone?: "primary" | "secondary" | "danger";
}) {
  const tones =
    tone === "secondary"
      ? "bg-stone-100 text-stone-900 hover:bg-stone-200"
      : tone === "danger"
        ? "bg-[#872b1f] text-white hover:bg-[#6d2218]"
        : "bg-stone-900 text-white hover:bg-stone-700";

  return (
    <button
      {...props}
      className={cn(
        "inline-flex items-center justify-center rounded-2xl px-4 py-3 text-sm font-medium transition",
        tones,
        className,
      )}
    />
  );
}

export function Badge({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span className={cn("rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-stone-700", className)}>
      {children}
    </span>
  );
}
