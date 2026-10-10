import { orderedStopIndices, validDate, stopQuery, safeWebUrl } from "./list-planning.js";

const escapeText = (value) => String(value || "").replace(/\\/g, "\\\\").replace(/\r\n|\r|\n/g, "\\n").replace(/;/g, "\\;").replace(/,/g, "\\,");
function fold(line) {
  const encoder = new TextEncoder();
  let current = "", bytes = 0;
  const lines = [];
  for (const character of line) {
    const size = encoder.encode(character).length;
    if (bytes + size > 75) { lines.push(current); current = " "; bytes = 1; }
    current += character; bytes += size;
  }
  lines.push(current);
  return lines.join("\r\n");
}
export function calendarDate(list, index) {
  const item = list.bucketItems[index];
  const assigned = list.scheduledItems?.[index];
  const eventDate = item.eventDate || (item.tags?.includes("Events") ? item.description?.match(/^\d{4}-\d{2}-\d{2}/)?.[0] : "");
  const date = assigned || eventDate;
  return validDate(date) ? date : "";
}
export function calendarExport(list, now = new Date()) {
  const entries = orderedStopIndices(list).filter((index) => calendarDate(list, index));
  if (!entries.length) throw new Error("Plan trip dates and assign stops to a day before exporting.");
  const stamp = now.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
  const lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Bucket//Trip Planner//EN", "CALSCALE:GREGORIAN"];
  for (const index of entries) {
    const item = list.bucketItems[index], date = calendarDate(list, index);
    const nextDay = new Date(`${date}T00:00:00Z`); nextDay.setUTCDate(nextDay.getUTCDate() + 1);
    const description = [item.description, safeWebUrl(item.website) ? item.website : "", safeWebUrl(item.location) ? item.location : ""].filter(Boolean).join("\n");
    lines.push("BEGIN:VEVENT", `UID:${encodeURIComponent(list.id || "bucket-list")}-${index}@bucket`, `DTSTAMP:${stamp}`, `DTSTART;VALUE=DATE:${date.replace(/-/g, "")}`, `DTEND;VALUE=DATE:${nextDay.toISOString().slice(0, 10).replace(/-/g, "")}`, `SUMMARY:${escapeText(item.title)}`, `DESCRIPTION:${escapeText(description)}`, `LOCATION:${escapeText(stopQuery(item, list.destination || list.userInfo?.location))}`, "TRANSP:TRANSPARENT", "END:VEVENT");
  }
  lines.push("END:VCALENDAR");
  return { content: lines.map(fold).join("\r\n") + "\r\n", count: entries.length, skipped: (list.bucketItems?.length || 0) - entries.length };
}
