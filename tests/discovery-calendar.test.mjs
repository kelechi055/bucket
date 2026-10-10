import test from "node:test";
import assert from "node:assert/strict";
import { calendarExport } from "../src/lib/calendar-export.js";
import { discoveryCandidates, guideForList, milesBetween } from "../src/lib/nearby-discoveries.js";

test("calendar exports assigned days and Ticketmaster dates, excludes private notes and unscheduled stops", () => {
  const list = { id: "plan", notes: { 0: "secret reservation code" }, bucketItems: [{ title: "Dinner, friends; fun", description: "First\nSecond" }, { title: "Show", eventDate: "2026-10-12" }, { title: "Undated" }], scheduledItems: { 0: "2026-12-31" }, stopOrder: [1, 0, 2] };
  const result = calendarExport(list, new Date("2026-10-10T12:00:00Z"));
  assert.equal(result.count, 2); assert.equal(result.skipped, 1);
  assert.match(result.content, /DTSTART;VALUE=DATE:20261231\r\nDTEND;VALUE=DATE:20270101/);
  assert.match(result.content, /SUMMARY:Dinner\\, friends\\; fun/);
  assert.match(result.content, /DESCRIPTION:First\\nSecond/);
  assert.ok(!result.content.includes("secret reservation code"));
  assert.ok(result.content.indexOf("SUMMARY:Show") < result.content.indexOf("SUMMARY:Dinner"));
  assert.ok(result.content.endsWith("END:VCALENDAR\r\n"));
});
test("calendar folding respects 75 UTF-8 octets and prevents injected content lines", () => {
  const result = calendarExport({ id: "safe", bucketItems: [{ title: "🌞".repeat(80) + "\r\nEND:VEVENT", eventDate: "2026-10-12" }] });
  assert.ok(result.content.split("\r\n").every((line) => Buffer.byteLength(line) <= 75));
  const unfolded = result.content.replace(/\r\n /g, "");
  assert.match(unfolded, /\\nEND:VEVENT/);
  assert.equal(result.content.split("\r\n").filter((line) => line === "END:VEVENT").length, 1);
  assert.throws(() => calendarExport({ bucketItems: [{ title: "Undated" }] }));
});
test("nearby discovery matches guides, excludes existing picks, and calculates distance", () => {
  const first = { title: "Cafe", location: "https://www.google.com/maps/search/?query=Cafe+Boston", tags: ["Restaurants"] };
  const second = { title: "Park", tags: ["Outdoors"] };
  const guide = { id: "boston", city: "Boston", state: "MA", bucketItems: [first, second] };
  assert.equal(guideForList({ userInfo: { location: "Boston, MA" } }, [guide]), guide);
  assert.equal(guideForList({ userInfo: { location: "Paris" } }, [guide]), null);
  assert.deepEqual(discoveryCandidates({ bucketItems: [first] }, guide, "food"), []);
  assert.deepEqual(discoveryCandidates({ bucketItems: [] }, guide, "activities"), [second]);
  assert.equal(milesBetween({ lat: 42, lng: -71 }, { lat: 42, lng: -71 }), 0);
  assert.ok(Math.abs(milesBetween({ lat: 0, lng: 0 }, { lat: 0, lng: 1 }) - 69.1) < 0.2);
});
