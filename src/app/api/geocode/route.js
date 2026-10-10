import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const cache = new Map();
const requests = new Map();
let queue = Promise.resolve();
let lastRequest = 0;

export async function POST(request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Sign in to view your map." }, { status: 401 });
  let query;
  try { ({ query } = await request.json()); } catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }
  if (typeof query !== "string" || !query.trim() || query.length > 250) return NextResponse.json({ error: "Use a place name or address of 250 characters or less." }, { status: 400 });
  query = query.trim();
  const cached = cache.get(query);
  if (cached && cached.until > Date.now()) return NextResponse.json(cached.value);
  const now = Date.now(), bucket = requests.get(userId);
  if (bucket && bucket.until > now && bucket.count >= 60) return NextResponse.json({ error: "Map searches are busy. Try again in a minute." }, { status: 429 });
  requests.set(userId, bucket && bucket.until > now ? { ...bucket, count: bucket.count + 1 } : { count: 1, until: now + 60000 });
  if (requests.size > 1000) for (const [key, entry] of requests) if (entry.until <= now) requests.delete(key);
  const operation = queue.then(async () => {
    const wait = Math.max(0, 1000 - (Date.now() - lastRequest));
    if (wait) await new Promise((resolve) => setTimeout(resolve, wait));
    lastRequest = Date.now();
    const url = new URL("https://photon.komoot.io/api/");
    url.searchParams.set("q", query); url.searchParams.set("limit", "1"); url.searchParams.set("lang", "en");
    const response = await fetch(url, { signal: AbortSignal.timeout(8000), headers: { "User-Agent": "BucketTravelMap/1.0" }, cache: "no-store" });
    if (!response.ok) throw new Error("Geocoder unavailable");
    const data = await response.json(), feature = data.features?.[0], coordinates = feature?.geometry?.coordinates;
    const valid = Array.isArray(coordinates) && coordinates.length >= 2 && coordinates.slice(0, 2).every(Number.isFinite) && Math.abs(coordinates[1]) <= 90 && Math.abs(coordinates[0]) <= 180;
    const value = { place: valid ? { lat: coordinates[1], lng: coordinates[0], label: [feature.properties?.name, feature.properties?.city, feature.properties?.state, feature.properties?.country].filter(Boolean).join(", ") } : null };
    if (cache.size >= 1000) cache.delete(cache.keys().next().value);
    cache.set(query, { until: Date.now() + 86400000, value });
    return value;
  });
  queue = operation.catch(() => {});
  try { return NextResponse.json(await operation); }
  catch { return NextResponse.json({ error: "This place could not be located right now. You can still open it in Google Maps." }, { status: 503 }); }
}
