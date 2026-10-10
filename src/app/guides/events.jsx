"use client";

import EventListPicker from "./event-list-picker";
import { useState } from "react";
import { SignInButton } from "@clerk/nextjs";
import Link from "next/link";
import { eventCategories, eventStop } from "../../lib/ticketmaster";
import { saveBucketList } from "../../lib/saved-lists";

export default function CityEvents({ guide, userId, isLoaded, getToken }) {
  const [picker, setPicker] = useState("");
  const [category, setCategory] = useState("all");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(null);
  const [saved, setSaved] = useState({});
  const [saveError, setSaveError] = useState("");
  const inputClass = "w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm";
  const buttonClass = "rounded-xl bg-gray-950 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50";

  async function search(event) {
    event.preventDefault();
    setBusy(true); setError(""); setResult(null);
    try {
      const response = await fetch(`/api/events?${new URLSearchParams({ city: guide.id, category, start, end })}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to find events.");
      setResult(data.events);
    } catch (error) { setError(error.message); }
    finally { setBusy(false); }
  }

  async function save(event) {
    if (!userId || saving) return;
    setSaving(event.id); setSaveError("");
    try {
      await saveBucketList(userId, getToken, { location: `${guide.city}, ${guide.state}` }, [eventStop(event)], { title: event.title.slice(0, 100) });
      setSaved((previous) => ({ ...previous, [`${userId}:${event.id}`]: true }));
    } catch (error) { setSaveError(error.message || "Unable to save this event."); }
    finally { setSaving(null); }
  }

  return <div className="mt-6">
    <h3 className="text-xl font-bold">Make room for something live</h3>
    <p className="mt-1 text-sm text-gray-600">Find upcoming events in {guide.city}. Dates and times are local to the venue.</p>
    <form onSubmit={search} className="mt-5 grid gap-3 rounded-2xl bg-amber-50 p-4 sm:grid-cols-3">
      <label className="min-w-0 text-xs font-semibold">Event type<select value={category} onChange={(event) => setCategory(event.target.value)} className={`${inputClass} mt-1`}>{Object.entries(eventCategories).map(([id, label]) => <option key={id} value={id}>{label || "All events"}</option>)}</select></label>
      <label className="min-w-0 text-xs font-semibold">From<input type="date" value={start} onChange={(event) => setStart(event.target.value)} className={`${inputClass} mt-1`} /></label>
      <label className="min-w-0 text-xs font-semibold">Through<input type="date" min={start || undefined} value={end} onChange={(event) => setEnd(event.target.value)} className={`${inputClass} mt-1`} /></label>
      <button disabled={busy} className={`${buttonClass} sm:col-span-3`}>{busy ? "Finding events…" : "Find events"}</button>
    </form>
    {error && <p role="alert" className="mt-4 text-sm text-amber-900">{error}</p>}
    {saveError && <p role="alert" className="mt-4 text-sm text-red-700">{saveError}</p>}
    {result?.length === 0 && <p role="status" className="mt-5 text-sm text-gray-600">No events found for these filters. Try different dates or another event type.</p>}
    <ul className="mt-5 space-y-3">{result?.map((event) => {
      const isSaved = saved[`${userId}:${event.id}`];
      return <li key={event.id} className="rounded-2xl border border-gray-200 p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-amber-800">{event.category} · {event.date || "Date to be announced"}{event.time && ` · ${event.time.slice(0, 5)}`}</p>
        <h4 className="mt-2 break-words text-lg font-bold">{event.title}</h4>
        <p className="mt-2 text-sm text-gray-600">{event.venue}</p>
        {event.address && <p className="mt-1 text-xs text-gray-500">{event.address}</p>}
        {["postponed", "rescheduled", "offsale"].includes(event.status) && <p className="mt-2 text-sm font-semibold text-amber-900">{event.status === "offsale" ? "Currently off sale" : event.status === "postponed" ? "Postponed — check ticket details" : "Rescheduled — check ticket details"}</p>}
        <div className="mt-4 flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
          {event.website && <a href={event.website} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-amber-800 underline">Tickets & details ↗</a>}
          {!isLoaded ? <button disabled className={buttonClass}>Loading…</button> : userId ? <button disabled={!!saving || isSaved} onClick={() => save(event)} className={buttonClass}>{saving === event.id ? "Saving…" : isSaved ? "Saved" : "Save event as a list"}</button> : <SignInButton mode="modal"><button className={buttonClass}>Sign in to save</button></SignInButton>}
          {userId && <button type="button" onClick={() => setPicker(picker === event.id ? "" : event.id)} className="min-h-11 rounded-xl border border-stone-200 px-4 py-2 text-sm">Add to existing list</button>}
          {isSaved && <Link href="/save" className="text-sm underline">View saved lists →</Link>}
        </div>
        {picker === event.id && userId && <EventListPicker key={userId} event={event} userId={userId} getToken={getToken} onClose={() => setPicker("")} />}
      </li>;
    })}</ul>
    <p className="mt-5 text-xs text-gray-500">Events provided by Ticketmaster. Showing up to 20 upcoming matches. Availability can change; confirm details before booking.</p>
  </div>;
}
