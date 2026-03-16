import Link from "next/link";
import { Button } from "@/components/ui";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <div className="max-w-md rounded-[32px] border border-stone-200 bg-[#fffaf3]/90 p-8 text-center shadow-[0_24px_80px_rgba(80,54,36,0.08)]">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-stone-500">Not Found</p>
        <h1 className="mt-4 text-4xl font-semibold text-stone-900">This course or page does not exist.</h1>
        <p className="mt-4 text-sm leading-6 text-stone-600">
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
