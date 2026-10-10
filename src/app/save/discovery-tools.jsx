"use client";

import { useEffect, useRef, useState } from "react";
import { cityGuides } from "../../data/city-guides";
import { calendarExport } from "../../lib/calendar-export";
import { discoveryCandidates, guideForList, milesBetween } from "../../lib/nearby-discoveries";
import { orderedStopIndices, stopQuery } from "../../lib/list-planning";

const places = new Map();
const button = "min-h-11 rounded-xl bg-amber-300 px-4 py-2 text-sm font-semibold text-amber-950 disabled:opacity-50";
const input = "mt-1 w-full min-w-0 rounded-xl border border-stone-200 bg-white px-3 py-3 text-sm";

export function CalendarExport({ list }) {
  const [message, setMessage] = useState("");
  function download() {
    try {
      const { content, count, skipped } = calendarExport(list);
      const url = URL.createObjectURL(new Blob([content], { type: "text/calendar;charset=utf-8" }));
      const link = document.createElement("a"); link.href = url;
      link.download = `${(list.title || "bucket-trip").replace(/[^a-z0-9-]/gi, "-").slice(0, 60)}.ics`;
      document.body.appendChild(link); link.click(); link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 60000);
      setMessage(`Exported ${count} all-day ${count === 1 ? "stop" : "stops"}.${skipped ? ` ${skipped} unscheduled stops were skipped.` : ""}`);
    } catch (error) { setMessage(error.message); }
  }
  return <section className="mb-5 rounded-2xl border border-amber-100 bg-white p-4"><div className="flex flex-wrap items-center justify-between gap-3"><div><h3 className="font-bold">Take your plans with you</h3><p className="mt-1 text-xs text-stone-500">Download dated stops as all-day calendar entries. Private notes stay in Bucket.</p></div><button type="button" onClick={download} className={button}>Export calendar (.ics)</button></div>{message && <p role="status" className="mt-3 text-sm text-amber-900">{message}</p>}<p className="mt-3 text-xs text-stone-500">Import the file into Apple Calendar, Google Calendar, or Outlook. This is a one-time export; changes won’t sync automatically.</p></section>;
}

export function NearbyDiscoveries({ list, onAdd, onClose }) {
  const guide = guideForList(list, cityGuides);
  const order = orderedStopIndices(list);
  const [anchor, setAnchor] = useState(String(order[0] ?? ""));
  const [category, setCategory] = useState("food");
  const [radius, setRadius] = useState("5");
  const [results, setResults] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [adding, setAdding] = useState("");
  const controller = useRef(null);
  useEffect(() => () => controller.current?.abort(), []);
  const destination = list.destination || list.userInfo?.location || "";
  const centerItem = list.bucketItems?.[Number(anchor)];
  async function locate(query, signal) {
    if (places.has(query)) return places.get(query);
    const response = await fetch("/api/geocode", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ query }), signal });
    if (!response.ok) throw new Error("Nearby search is temporarily unavailable. Please try again later.");
    const { place } = await response.json();
    if (place) { if (places.size >= 200) places.delete(places.keys().next().value); places.set(query, place); }
    return place;
  }
  async function search(event) {
    event.preventDefault(); controller.current?.abort();
    const next = new AbortController(); controller.current = next;
    setBusy(true); setResults(null); setError(""); setMessage("");
    try {
      const center = await locate(stopQuery(centerItem, destination), next.signal);
      if (!center) throw new Error("This stop couldn’t be located. Try another stop or search Google Maps below.");
      const found = [];
      for (const item of discoveryCandidates(list, guide, category)) {
        const place = await locate(stopQuery(item, destination), next.signal);
        if (place) {
          const miles = milesBetween(center, place);
          if (miles <= Number(radius)) found.push({ item, miles, address: place.label });
        }
      }
      if (!next.signal.aborted) setResults({ entries: found.sort((a, b) => a.miles - b.miles).slice(0, 5), center: center.label });
    } catch (error) { if (!next.signal.aborted) setError(error.message); }
    finally { if (!next.signal.aborted) setBusy(false); }
  }
  async function add(entry) {
    setAdding(entry.item.title); setError("");
    try {
      await onAdd({ title: entry.item.title.slice(0, 100), description: entry.item.description, address: stopQuery(entry.item), website: entry.item.website || "", category: entry.item.tags.includes("Restaurants") ? "Restaurants" : "Custom stop" });
      setResults((current) => current ? { ...current, entries: current.entries.filter((result) => result.item.title !== entry.item.title) } : current);
      setMessage(`${entry.item.title} added to your list.`);
    } catch (error) { setError(error.message || "Unable to add this discovery."); }
    finally { setAdding(""); }
  }
  const mapQuery = `${category === "food" ? "restaurants" : "things to do"} near ${centerItem ? stopQuery(centerItem, destination) : destination}`;
  return <section className="m-3 rounded-2xl bg-amber-50 p-4 sm:m-5 sm:p-5"><div className="flex items-center justify-between gap-3"><h3 className="font-bold">Discover around your stops</h3><button type="button" onClick={onClose} className="min-h-11 px-2 text-sm">Close</button></div><p className="mt-2 text-sm text-stone-600">{guide ? `Explore curated ${guide.city} picks, sorted by approximate distance. Stops already in your list are excluded.` : "This destination isn’t in our curated guides yet. Search Google Maps for more places nearby."}</p>
    {guide && centerItem && <form onSubmit={search} className="mt-4 grid gap-3 sm:grid-cols-3"><label className="min-w-0 text-sm">Around<select value={anchor} disabled={busy} onChange={(event) => { setAnchor(event.target.value); setResults(null); }} className={input}>{order.map((index) => <option key={index} value={index}>{list.bucketItems[index].title}</option>)}</select></label><label className="text-sm">Discover<select value={category} disabled={busy} onChange={(event) => { setCategory(event.target.value); setResults(null); }} className={input}><option value="food">Places to eat</option><option value="activities">Things to do</option></select></label><label className="text-sm">Within<select value={radius} disabled={busy} onChange={(event) => { setRadius(event.target.value); setResults(null); }} className={input}><option value="2">2 miles</option><option value="5">5 miles</option><option value="15">15 miles</option></select></label><button disabled={busy} className={`${button} sm:col-span-3`}>{busy ? "Finding nearby picks…" : "Find nearby discoveries"}</button></form>}
    {results && <><p className="mt-4 break-words text-xs text-stone-500">Matched starting point: {results.center}</p>{!results.entries.length && <p className="mt-3 text-sm text-stone-600">No new curated picks within this distance. Try a wider radius, another category, or Google Maps.</p>}<ul className="mt-3 space-y-3">{results.entries.map((entry) => <li key={entry.item.title} className="rounded-xl border border-amber-100 bg-white p-4"><p className="text-xs font-semibold text-amber-800">About {entry.miles < 0.1 ? "<0.1" : entry.miles.toFixed(1)} miles away</p><h4 className="mt-1 break-words font-bold">{entry.item.title}</h4><p className="mt-2 text-sm text-stone-600">{entry.item.description}</p><p className="mt-2 break-words text-xs text-stone-500">Matched to: {entry.address}</p><div className="mt-3 flex flex-wrap items-center gap-3"><a href={entry.item.location} target="_blank" rel="noopener noreferrer" className="min-h-11 py-3 text-sm font-semibold text-amber-800 underline">Check in Google Maps ↗</a><button disabled={!!adding} onClick={() => add(entry)} className={button}>{adding === entry.item.title ? "Adding…" : "Add to this list"}</button></div></li>)}</ul></>}
    {error && <p role="alert" className="mt-3 text-sm text-red-700">{error}</p>}{message && <p role="status" className="mt-3 text-sm text-amber-900">{message}</p>}
    <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex min-h-11 items-center text-sm font-semibold text-amber-800 underline">Explore more on Google Maps ↗</a><p className="mt-2 text-xs text-stone-500">Distances are straight-line estimates from place-name matches, not walking routes. Check the matched addresses and current hours.</p>
  </section>;
}
