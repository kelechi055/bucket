"use client";

import { useState } from "react";
import { itineraryGroups, orderedStopIndices } from "../../lib/list-planning";

const inputStyle = "w-full rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-amber-600";
const buttonStyle = "rounded-xl bg-amber-300 px-4 py-2 text-sm font-semibold text-amber-950 hover:bg-amber-400 disabled:opacity-50";

export function StopNote({ value = "", onSave, title }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function save(event) {
    event.preventDefault(); setBusy(true); setError("");
    try { await onSave(draft); setEditing(false); }
    catch (failure) { setError(failure.message || "Unable to save your note."); }
    finally { setBusy(false); }
  }
  return <div className="rounded-xl border border-amber-100 bg-white/70 p-3">
    {editing ? <form onSubmit={save}>
      <label className="text-xs font-semibold text-stone-600">Private note for {title}<textarea maxLength={2000} rows={3} value={draft} disabled={busy} onChange={(event) => setDraft(event.target.value)} className={`${inputStyle} mt-2`} placeholder="Reservation details, things to try, a little reminder…" /></label>
      <div className="mt-2 flex items-center gap-3"><button className={buttonStyle} disabled={busy}>{busy ? "Saving…" : "Save note"}</button><button type="button" disabled={busy} onClick={() => setEditing(false)} className="text-sm text-stone-500">Cancel</button></div>
    </form> : <><p className="whitespace-pre-wrap break-words text-sm text-stone-600">{value}</p><button type="button" onClick={() => { setDraft(value); setEditing(true); }} className="text-xs font-semibold text-amber-800">{value ? "Edit private note" : "+ Add a private note"}</button></>}
    {error && <p role="alert" className="mt-2 text-sm text-red-700">{error}</p>}
  </div>;
}

export function TripPlanner({ list, onSave, onClose }) {
  const [trip, setTrip] = useState(list.trip || { start: "", end: "" });
  const [assignments, setAssignments] = useState(list.scheduledItems || {});
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function save(event) {
    event.preventDefault(); setBusy(true); setError("");
    try { await onSave(trip, assignments); onClose(); }
    catch (failure) { setError(failure.message || "Unable to save your trip."); }
    finally { setBusy(false); }
  }
  return <form onSubmit={save} className="m-3 sm:m-5 rounded-2xl bg-amber-50 p-4 sm:p-5">
    <h3 className="font-bold">Plan your trip</h3><p className="mt-1 text-sm text-stone-500">Choose your dates, then assign stops to a day. Trip dates are visible to members of shared plans.</p>
    <div className="mt-4 grid gap-3 sm:grid-cols-2">{["start", "end"].map((field) => <label key={field} className="text-sm font-medium">{field === "start" ? "Start date" : "End date"}<input type="date" min={field === "end" ? trip.start : undefined} value={trip[field]} disabled={busy} onChange={(event) => setTrip({ ...trip, [field]: event.target.value })} className={`${inputStyle} mt-1`} /></label>)}</div>
    <div className="mt-4 space-y-3">{orderedStopIndices(list).map((index) => ({ item: list.bucketItems[index], index })).map(({ item, index }, position) => <label key={index} className="flex flex-col items-stretch gap-2 text-sm sm:flex-row sm:items-center sm:justify-between"><span className="min-w-0 flex-1">{position + 1}. {item.title}</span><input aria-label={`Date for ${item.title}`} type="date" min={trip.start || undefined} max={trip.end || undefined} disabled={busy || !trip.start || !trip.end} value={assignments[index] || ""} onChange={(event) => setAssignments({ ...assignments, [index]: event.target.value })} className={`${inputStyle} sm:max-w-44`} /></label>)}</div>
    <div className="mt-5 flex flex-wrap gap-3"><button disabled={busy} className={buttonStyle}>{busy ? "Saving…" : "Save trip"}</button><button type="button" disabled={busy} onClick={() => { setTrip({ start: "", end: "" }); setAssignments({}); }} className="text-sm text-stone-500">Clear dates</button><button type="button" disabled={busy} onClick={onClose} className="ml-auto text-sm text-stone-500">Cancel</button></div>
    {error && <p role="alert" className="mt-3 text-sm text-red-700">{error}</p>}
  </form>;
}

export function Itinerary({ list }) {
  return <div className="mb-5 rounded-2xl border border-amber-100 bg-white p-4"><h3 className="mb-3 font-bold">Your itinerary</h3>
    {itineraryGroups(list.bucketItems || [], list.scheduledItems).map(([date, stops]) => <div key={date} className="mb-4 last:mb-0"><h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-amber-800">{date ? new Date(`${date}T12:00:00`).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" }) : "Unscheduled"}</h4><ol className="space-y-1 text-sm text-stone-600">{stops.map(({ item, index }) => <li key={index} className={list.completedItems?.[index] ? "text-stone-400 line-through" : ""}>{item.title}</li>)}</ol></div>)}
  </div>;
}

export function SharePanel({ list, onPublish, onRevoke, onClose }) {
  const [busy, setBusy] = useState(false);
  const [url, setUrl] = useState(list.shareId ? `${window.location.origin}/share/${list.shareId}` : "");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  async function publish() {
    setBusy(true); setError(""); setMessage("");
    try { const id = await onPublish(); setUrl(`${window.location.origin}/share/${id}`); setMessage("Public link ready. Copy it below."); }
    catch (failure) { setError(failure.code === "permission-denied" ? "Public sharing needs the updated Firestore rules. Please contact support." : "Unable to create the link. Please try again."); }
    finally { setBusy(false); }
  }
  async function revoke() {
    setBusy(true); setError(""); setMessage("");
    try { await onRevoke(); setUrl(""); setMessage("Link disabled. This list is private again."); }
    catch { setError("Unable to disable the link. Please try again."); }
    finally { setBusy(false); }
  }
  async function copy() {
    try { await navigator.clipboard.writeText(url); setMessage("Link copied."); }
    catch { setMessage("Select and copy the link above."); }
  }
  return <section className="m-3 sm:m-5 rounded-2xl bg-amber-50 p-5"><h3 className="font-bold">Share a public copy</h3><p className="mt-2 text-sm text-stone-600">Anyone with the link can view the list title and stops. Your notes, trip dates, profile, progress, and favorites are excluded from the public copy. Refresh the copy after editing your list.</p>
    {url && <label className="mt-4 block text-sm font-semibold">Public link<input readOnly value={url} onFocus={(event) => event.target.select()} className={`${inputStyle} mt-1`} /></label>}
    <div className="mt-4 flex flex-wrap gap-3"><button type="button" disabled={busy} onClick={publish} className={buttonStyle}>{busy ? "Working…" : url ? "Refresh public copy" : "Create public link"}</button>{url && <><button type="button" disabled={busy} onClick={copy} className="text-sm font-semibold text-amber-800">Copy link</button><button type="button" disabled={busy} onClick={revoke} className="text-sm text-red-700">Disable link</button></>}<button type="button" disabled={busy} onClick={onClose} className="ml-auto text-sm text-stone-500">Close</button></div>
    {message && <p role="status" className="mt-3 text-sm text-stone-600">{message}</p>}{error && <p role="alert" className="mt-3 text-sm text-red-700">{error}</p>}
  </section>;
}
