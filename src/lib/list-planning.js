export function listTitle(list) {
  return list.title || (list.userInfo?.name ? `Bucket List for ${list.userInfo.name}` : "Bucket List");
}

export function progressStatus(list) {
  const items = Array.isArray(list.bucketItems) ? list.bucketItems : [];
  const done = items.filter((_, index) => list.completedItems?.[index] === true).length;
  return items.length > 0 && done === items.length ? "completed" : done > 0 ? "in-progress" : "not-started";
}

export function validDate(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

export function validateTrip(trip, assignments = {}) {
  const start = trip.start || "", end = trip.end || "";
  if ((start || end) && (!validDate(start) || !validDate(end) || end < start)) {
    throw new Error("Choose valid start and end dates, with the end on or after the start.");
  }
  if (Object.values(assignments).some((date) => date && (!start || !validDate(date) || date < start || date > end))) {
    throw new Error("Every scheduled stop must fall within your trip dates. Clear or move stops before changing the dates.");
  }
  return { start, end };
}

export function itineraryGroups(items, assignments = {}, order = items.map((_, index) => index)) {
  const groups = new Map();
  order.forEach((index) => {
    const item = items[index];
    if (!item) return;
    const date = assignments[index] || "";
    if (!groups.has(date)) groups.set(date, []);
    groups.get(date).push({ item, index });
  });
  return [...groups].sort(([a], [b]) => !a ? 1 : !b ? -1 : a.localeCompare(b));
}

export function publicSnapshot(list) {
  return {
    title: list.title || "Bucket List",
    bucketItems: orderedStopIndices(list).map((index) => list.bucketItems[index]).map((item) => Object.fromEntries(
      ["title", "description", "tags", "location", "website", "cuisine"].filter((key) => item[key] !== undefined).map((key) => [key, item[key]])
    )),
  };
}

// Reordering changes only these indices, so notes and progress stay with a stop.
export function orderedStopIndices(list) {
  const length = list.bucketItems?.length || 0;
  const seen = new Set();
  const order = (Array.isArray(list.stopOrder) ? list.stopOrder : []).filter((index) => {
    if (!Number.isInteger(index) || index < 0 || index >= length || seen.has(index)) return false;
    seen.add(index); return true;
  });
  for (let index = 0; index < length; index++) if (!seen.has(index)) order.push(index);
  return order;
}

export function moveStop(order, from, to) {
  if (!order.includes(from) || !order.includes(to)) throw new Error("This stop is no longer in the list.");
  const next = order.filter((index) => index !== from);
  next.splice(order.indexOf(to), 0, from);
  return next;
}

export function customStop(draft, destination = "") {
  const title = draft.title?.trim();
  if (!title || title.length > 100) throw new Error("Use a stop name between 1 and 100 characters.");
  const description = (draft.description || "").trim();
  if (description.length > 1000) throw new Error("Descriptions must be 1,000 characters or less.");
  const address = (draft.address || "").trim();
  if (address.length > 250) throw new Error("Use an address of 250 characters or less.");
  const website = (draft.website || "").trim();
  if (website && !safeWebUrl(website)) throw new Error("Use a full website address beginning with https:// or http://.");
  const query = [address || title, destination].filter(Boolean).join(" ");
  return { title, description, tags: [draft.category === "Restaurants" ? "Restaurants" : "Custom stop"], location: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`, ...(website ? { website } : {}) };
}

export function safeWebUrl(value) {
  try { return ["https:", "http:"].includes(new URL(value).protocol); } catch { return false; }
}

export function stopQuery(item, destination = "") {
  try {
    const url = new URL(item.location);
    if (url.hostname === "www.google.com" || url.hostname === "maps.google.com") {
      const query = url.searchParams.get("query") || url.searchParams.get("q");
      if (query) return query.slice(0, 250);
    }
  } catch { /* A stop can still be located by its name. */ }
  return [item.title, destination].filter(Boolean).join(" ").slice(0, 250);
}

// Build map links ourselves instead of trusting generated short/dynamic URLs.
export function mapsSearchUrl(item, destination = "") {
  const query = stopQuery(item, destination).trim();
  return query ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}` : "";
}
