const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "2025-08" → "Aug 2025" */
export function formatMonth(ym: string): string {
  const [y, m] = ym.split("-").map(Number);
  return `${MONTHS[(m ?? 1) - 1]} ${y}`;
}

/** Months since Jan 2000, for laying out timelines. */
export function monthIndex(ym: string): number {
  const [y, m] = ym.split("-").map(Number);
  return (y! - 2000) * 12 + (m! - 1);
}

/** Current month as yyyy-mm; build-time for static pages. */
export function currentMonth(d = new Date()): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export function durationLabel(start: string, end: string | null): string {
  const months = monthIndex(end ?? currentMonth()) - monthIndex(start) + 1;
  const y = Math.floor(months / 12);
  const mo = months % 12;
  return [y ? `${y} yr${y > 1 ? "s" : ""}` : "", mo ? `${mo} mo` : ""].filter(Boolean).join(" ");
}
