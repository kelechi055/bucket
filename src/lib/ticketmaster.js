import { validDate } from "./list-planning.js";

export const eventCategories = { all: "", music: "Music", sports: "Sports", theater: "Arts & Theatre", comedy: "Comedy" };

export function eventSearch(params, guide, now = new Date()) {
  const keyword = (params.get("keyword") || "").trim();
  if (keyword.length > 100) throw new Error("Search must be 100 characters or less.");
  const category = params.get("category") || "all";
  const start = params.get("start") || "";
  const end = params.get("end") || "";
  if (!guide || !Object.hasOwn(eventCategories, category)) throw new Error("Choose a valid city and event type.");
  if ((start && !validDate(start)) || (end && !validDate(end)) || (start && end && start > end)) throw new Error("Choose a valid date range.");
  const query = new URLSearchParams({ city: guide.city, stateCode: guide.state, countryCode: "US", size: "20", sort: "date,asc", includeTBA: "no", includeTBD: "no" });
  if (keyword) query.set("keyword", keyword);
  query.set("startDateTime", now.toISOString().replace(/\.\d{3}Z$/, "Z"));
  // Local dates keep evening events inside the requested trip dates across U.S. time zones.
  if (start || end) query.set("localStartDateTime", `${start || now.toISOString().slice(0, 10)}T00:00:00,${end || "2099-12-31"}T23:59:59`);
  if (eventCategories[category]) query.set("classificationName", eventCategories[category]);
  return query;
}

function httpsUrl(value) {
  try { const url = new URL(value); return url.protocol === "https:" ? url.href : ""; } catch { return ""; }
}

export function normalizeEvent(event) {
  const venue = event._embedded?.venues?.[0];
  const start = event.dates?.start;
  const status = event.dates?.status?.code || "";
  if (!event.id || !event.name || status === "cancelled") return null;
  return {
    id: event.id, title: event.name, date: start?.localDate || "", time: start?.timeTBA || start?.noSpecificTime ? "" : start?.localTime || "",
    venue: venue?.name || "Venue to be announced", address: [venue?.address?.line1, venue?.city?.name, venue?.state?.stateCode].filter(Boolean).join(", "),
    category: event.classifications?.[0]?.segment?.name || "Event", status,
    website: httpsUrl(event.url),
  };
}

export function eventStop(event) {
  const when = [event.date, event.time].filter(Boolean).join(" at ");
  return { title: event.title, ...(event.date ? { eventDate: event.date } : {}), description: `${when || "Date to be announced"} · ${event.venue}. Check the ticket page for current details and availability.`, tags: ["Events", event.category], location: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent([event.venue, event.address].filter(Boolean).join(" "))}`, website: event.website };
}
