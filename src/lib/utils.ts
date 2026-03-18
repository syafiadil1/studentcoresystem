import { format, formatDistanceToNowStrict, isPast, isToday, parseISO } from "date-fns";

export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function formatDateTime(value: string | Date) {
  const date = typeof value === "string" ? parseISO(value) : value;
  return format(date, "dd MMM yyyy, HH:mm");
}

export function formatDate(value: string | Date) {
  const date = typeof value === "string" ? parseISO(value) : value;
  return format(date, "dd MMM yyyy");
}

export function toDateTimeLocal(value: string | Date) {
  const date = typeof value === "string" ? parseISO(value) : value;
  return format(date, "yyyy-MM-dd'T'HH:mm");
}

export function titleCase(value: string) {
  return value
    .toLowerCase()
    .split("_")
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
}

export function describeDeadline(value: string | Date) {
  const date = typeof value === "string" ? parseISO(value) : value;

  if (isToday(date)) {
    return "Today";
  }

  if (isPast(date)) {
    return `Overdue by ${formatDistanceToNowStrict(date)}`;
  }

  return `Due in ${formatDistanceToNowStrict(date)}`;
}

export function bytesToSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function normalizeSearch(value: string) {
  return value.trim().toLowerCase();
}
