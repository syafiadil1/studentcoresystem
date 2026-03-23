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
      ? "bg-[rgba(50,255,126,0.12)] text-[#8ff7a7]"
      : tone === "danger"
        ? "bg-[rgba(255,90,90,0.14)] text-[#ff9898]"
        : tone === "success"
          ? "bg-[rgba(120,255,120,0.12)] text-[#c6ffba]"
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
        "w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-stone-500 focus:shadow-[0_0_0_1px_rgba(120,255,120,0.2),0_0_18px_rgba(57,255,20,0.08)]",
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
        "min-h-28 w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-stone-500 focus:shadow-[0_0_0_1px_rgba(120,255,120,0.2),0_0_18px_rgba(57,255,20,0.08)]",
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
        "w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-900 outline-none transition focus:border-stone-500 focus:shadow-[0_0_0_1px_rgba(120,255,120,0.2),0_0_18px_rgba(57,255,20,0.08)]",
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
      ? "bg-stone-100 text-stone-900 hover:opacity-90"
      : tone === "danger"
        ? "bg-[#3a0d0d] text-[#ff9898] hover:opacity-90"
        : "bg-stone-900 text-white hover:opacity-90";

  return (
    <button
      {...props}
      className={cn(
        "inline-flex items-center justify-center rounded-2xl border border-stone-300 px-4 py-3 text-sm font-medium transition",
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
    <span className={cn("rounded-full border border-stone-300 bg-stone-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-stone-700", className)}>
      {children}
    </span>
  );
}

export function DetailRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white/80 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">{label}</p>
      <div className="mt-2 text-sm leading-6 text-stone-800">{value}</div>
    </div>
  );
}
