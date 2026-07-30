import Link from "next/link";
import { Button } from "@/components/ui";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <div className="max-w-md border border-line bg-panel p-8 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted">Not Found</p>
        <h1 className="mt-4 text-4xl font-semibold text-ink">This course or page does not exist.</h1>
        <p className="mt-4 text-sm leading-6 text-muted">
          Head back to StudentCore dashboard or the courses page to continue managing your work.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/">
            <Button>Dashboard</Button>
          </Link>
          <Link href="/courses">
            <Button tone="secondary">Courses</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
