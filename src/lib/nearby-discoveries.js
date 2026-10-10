import { stopQuery } from "./list-planning.js";

export function guideForList(list, guides) {
  if (list.sourceGuideId) {
    const source = guides.find((guide) => guide.id === list.sourceGuideId);
    if (source) return source;
  }
  const destination = (list.destination || list.userInfo?.location || "").toLowerCase();
  const matches = guides.filter((guide) => destination.includes(guide.city.toLowerCase()));
  if (matches.length === 1) return matches[0];
  return matches.find((guide) => new RegExp(`\\b${guide.state}\\b`, "i").test(destination)) || null;
}
export function milesBetween(a, b) {
  const rad = (value) => value * Math.PI / 180;
  const dlat = rad(b.lat - a.lat), dlng = rad(b.lng - a.lng);
  const h = Math.sin(dlat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dlng / 2) ** 2;
  return 3958.8 * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(Math.max(0, 1 - h)));
}
export function discoveryCandidates(list, guide, category) {
  const queries = new Set((list.bucketItems || []).map((item) => stopQuery(item).toLowerCase()));
  const titles = new Set((list.bucketItems || []).map((item) => item.title.toLowerCase()));
  return (guide?.bucketItems || []).filter((item) => !titles.has(item.title.toLowerCase()) && !queries.has(stopQuery(item).toLowerCase()) && (category === "food" ? item.tags?.includes("Restaurants") : !item.tags?.includes("Restaurants")));
}
