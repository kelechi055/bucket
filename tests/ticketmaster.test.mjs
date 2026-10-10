import test from "node:test";
import assert from "node:assert/strict";
import { eventSearch, normalizeEvent, eventStop } from "../src/lib/ticketmaster.js";

const guide = { city: "Boston", state: "MA" };
test("event search validates filters and uses venue-local trip boundaries", () => {
  const params = new URLSearchParams({ keyword: "  jazz  ", category: "music", start: "2026-10-12", end: "2026-10-15" });
  const query = eventSearch(params, guide, new Date("2026-10-10T12:00:00Z"));
  assert.equal(query.get("localStartDateTime"), "2026-10-12T00:00:00,2026-10-15T23:59:59");
  assert.equal(query.get("classificationName"), "Music");
  assert.equal(query.get("stateCode"), "MA");
  assert.equal(query.get("keyword"), "jazz");
  assert.throws(() => eventSearch(new URLSearchParams({ keyword: "x".repeat(101) }), guide));
  assert.equal(query.has("apikey"), false);
  for (const input of [{ start: "2026-02-30" }, { start: "2026-10-15", end: "2026-10-12" }, { category: "bogus" }]) assert.throws(() => eventSearch(new URLSearchParams(input), guide));
  assert.throws(() => eventSearch(new URLSearchParams(), undefined));
});
test("events omit cancellations and unsafe links, preserve local details in saved stops", () => {
  assert.equal(normalizeEvent({ id: "cancelled", name: "Cancelled", dates: { status: { code: "cancelled" } } }), null);
  const event = normalizeEvent({ id: "one", name: "Live show", url: "javascript:alert(1)", dates: { start: { localDate: "2026-10-12", localTime: "19:00:00", timeTBA: true } }, _embedded: { venues: [{ name: "Music Hall", address: { line1: "123 Main St" }, city: { name: "Boston" }, state: { stateCode: "MA" } }] } });
  assert.equal(event.website, "");
  assert.equal(event.time, "");
  const stop = eventStop(event);
  assert.match(stop.description, /2026-10-12/);
  assert.match(stop.location, /Music%20Hall/);
  assert.ok(stop.tags.includes("Events"));
});
