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
    <section className="border border-line bg-panel p-5">
      <div className="mb-5 flex flex-col gap-3 border-b border-line pb-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
          {description ? <p className="mt-1 text-sm text-muted">{description}</p> : null}
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
      ? "bg-success-bg text-accent"
      : tone === "danger"
        ? "bg-danger-bg text-danger"
        : tone === "success"
          ? "bg-success-bg text-success"
          : "bg-panel-2 text-ink-2";

  return (
    <div className="border border-line bg-panel p-5">
      <p className="text-sm text-muted">{label}</p>
      <div className="mt-4 flex items-center justify-between gap-3">
        <p className="tabular text-3xl font-semibold tracking-tight text-ink">{value}</p>
        <span className={cn("px-2 py-1 text-xs font-semibold uppercase tracking-[0.18em]", toneClass)}>
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
    <div className="border border-dashed border-line-strong bg-paper-2 p-8">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-2 max-w-[65ch] text-sm leading-6 text-muted">{copy}</p>
    </div>
  );
}

/* Gate 39 — border-width never shifts between states; focus uses outline,
 * not border. Disabled uses opacity + cursor + native attr. */
const fieldClasses =
  "w-full border border-line bg-paper-2 px-3 py-2.5 text-sm text-ink outline-none placeholder:text-faint hover:border-line-strong focus-visible:border-line-strong disabled:cursor-not-allowed disabled:opacity-55";

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cn(fieldClasses, props.className)} />;
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={cn("min-h-28", fieldClasses, props.className)} />;
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={cn(fieldClasses, props.className)} />;
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
      <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-muted">{label}</span>
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
      ? "border-line bg-transparent text-ink hover:bg-panel-2"
      : tone === "danger"
        ? "border-danger-bg bg-danger-bg text-danger hover:border-danger"
        : "border-accent bg-accent text-accent-ink hover:bg-ink";

  return (
    <button
      {...props}
      className={cn(
        "inline-flex items-center justify-center gap-2 whitespace-nowrap border px-3 py-2.5 text-sm font-medium active:translate-y-px disabled:cursor-not-allowed disabled:opacity-55",
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
    <span className={cn("inline-flex items-center whitespace-nowrap border border-line bg-panel-2 px-2 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-ink-2", className)}>
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
    <div className="border border-line bg-paper-2 p-3">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-faint">{label}</p>
      <div className="tabular mt-1.5 text-sm leading-6 text-ink-2">{value}</div>
    </div>
  );
}
