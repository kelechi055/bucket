import { cityGuides } from "../../../data/city-guides";
import { eventSearch, normalizeEvent } from "../../../lib/ticketmaster";

const cache = new Map();
const pending = new Map();
let nextRequestAt = 0;

async function discover(query, key) {
  const wait = Math.max(0, nextRequestAt - Date.now());
  if (wait > 3000) return { status: 429, body: { error: "Event discovery is busy. Please try again shortly." } };
  nextRequestAt = Date.now() + wait + 550;
  if (wait) await new Promise((resolve) => setTimeout(resolve, wait));
  query.set("apikey", key);
  try {
    const response = await fetch(`https://app.ticketmaster.com/discovery/v2/events.json?${query}`, { cache: "no-store", signal: AbortSignal.timeout(10000) });
    if (!response.ok) return { status: response.status === 429 ? 429 : 503, body: { error: "Events are temporarily unavailable. Please try again later." } };
    const data = await response.json();
    return { status: 200, body: { events: (data._embedded?.events || []).map(normalizeEvent).filter(Boolean) } };
  } catch {
    // Never log the upstream URL: it contains the private API key.
    return { status: 503, body: { error: "Events are temporarily unavailable. Please try again later." } };
  }
}

export async function GET(request) {
  const params = new URL(request.url).searchParams;
  let query;
  try { query = eventSearch(params, cityGuides.find((guide) => guide.id === params.get("city"))); }
  catch (error) { return Response.json({ error: error.message }, { status: 400 }); }
  const key = process.env.TICKETMASTER_API_KEY?.trim();
  if (!key) return Response.json({ error: "Event discovery is coming soon." }, { status: 503 });
  const cacheKey = JSON.stringify([params.get("city"), params.get("category") || "all", params.get("start") || "", params.get("end") || "", (params.get("keyword") || "").trim()]);
  let result = cache.get(cacheKey);
  if (!result || result.expires < Date.now()) {
    if (!pending.has(cacheKey)) pending.set(cacheKey, discover(query, key));
    result = await pending.get(cacheKey);
    pending.delete(cacheKey);
    if (result.status === 200) {
      if (cache.size >= 200) cache.delete(cache.keys().next().value);
      cache.set(cacheKey, { ...result, expires: Date.now() + 5 * 60 * 1000 });
    }
  }
  return Response.json(result.body, { status: result.status });
}
