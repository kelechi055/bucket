"use client";

import { useState } from "react";
import { ArrowUp, ArrowDown, GripVertical } from "lucide-react";
import { itineraryGroups, orderedStopIndices, moveStop } from "../../lib/list-planning";

const input = "mt-1 w-full rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-amber-600";
const button = "rounded-xl bg-amber-300 px-4 py-2 text-sm font-semibold text-amber-950 hover:bg-amber-400 disabled:opacity-50";

export function CustomStopForm({ onSave, onClose }) {
  const [draft, setDraft] = useState({ title: "", description: "", address: "", website: "", category: "Custom stop" });
  const [busy, setBusy] = useState(false), [error, setError] = useState("");
  async function save(event) {
    event.preventDefault(); setBusy(true); setError("");
    try { await onSave(draft); onClose(); } catch (failure) { setError(failure.message || "Unable to add this stop."); } finally { setBusy(false); }
  }
  return <form onSubmit={save} className="m-5 rounded-2xl bg-amber-50 p-5"><h3 className="font-bold">Add your own discovery</h3><div className="mt-4 grid gap-3 sm:grid-cols-2">
    <label className="text-sm font-medium">Place or activity name<input required maxLength={100} value={draft.title} disabled={busy} onChange={(event) => setDraft({ ...draft, title: event.target.value })} className={input} /></label>
    <label className="text-sm font-medium">Address or neighborhood<input maxLength={250} value={draft.address} disabled={busy} onChange={(event) => setDraft({ ...draft, address: event.target.value })} className={input} placeholder="Helps place your stop on the map" /></label>
    <label className="text-sm font-medium sm:col-span-2">Description<textarea rows={2} maxLength={1000} value={draft.description} disabled={busy} onChange={(event) => setDraft({ ...draft, description: event.target.value })} className={input} /></label>
    <label className="text-sm font-medium">Website (optional)<input type="url" maxLength={1000} value={draft.website} disabled={busy} onChange={(event) => setDraft({ ...draft, website: event.target.value })} className={input} placeholder="https://…" /></label>
    <label className="text-sm font-medium">Category<select value={draft.category} disabled={busy} onChange={(event) => setDraft({ ...draft, category: event.target.value })} className={input}><option>Custom stop</option><option>Restaurants</option></select></label>
  </div><div className="mt-4 flex gap-3"><button disabled={busy} className={button}>{busy ? "Adding…" : "Add stop"}</button><button type="button" disabled={busy} onClick={onClose} className="text-sm text-stone-500">Cancel</button></div>{error && <p role="alert" className="mt-3 text-sm text-red-700">{error}</p>}</form>;
}

export function ReorderItinerary({ list, onReorder }) {
  const [dragging, setDragging] = useState(null), [busy, setBusy] = useState(false), [error, setError] = useState("");
  const order = orderedStopIndices(list);
  async function move(from, to) {
    if (from === to || busy) return;
    setBusy(true); setError(""); setDragging(null);
    try { await onReorder(moveStop(order, from, to)); } catch (failure) { setError(failure.message || "Unable to reorder stops."); } finally { setBusy(false); }
  }
  const groups = itineraryGroups(list.bucketItems || [], list.scheduledItems, order);
  return <section className="mb-5 rounded-2xl border border-amber-100 bg-white p-4"><h3 className="font-bold">Your itinerary</h3><p className="mb-4 mt-1 text-xs text-stone-500">Drag the handle to reorder stops within a day, or use the arrows.</p>
    {groups.map(([date, stops]) => <div key={date} className="mb-4 last:mb-0"><h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-amber-800">{date ? new Date(`${date}T12:00:00`).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" }) : "Unscheduled"}</h4><ol className="space-y-2">{stops.map(({ item, index }, position) => <li key={index} onDragOver={(event) => { if (dragging !== null && (list.scheduledItems?.[dragging] || "") === date) event.preventDefault(); }} onDrop={(event) => { event.preventDefault(); if (dragging !== null && (list.scheduledItems?.[dragging] || "") === date) move(dragging, index); }} className={`flex items-center gap-2 rounded-xl border px-3 py-2 ${dragging === index ? "border-amber-300 bg-amber-50" : "border-stone-100"}`}>
      <span draggable={!busy} onDragStart={(event) => { setDragging(index); event.dataTransfer.setData("text/plain", String(index)); event.dataTransfer.effectAllowed = "move"; }} onDragEnd={() => setDragging(null)} className="cursor-grab text-stone-400" aria-hidden="true"><GripVertical size={17} /></span><span className={`min-w-0 flex-1 text-sm ${list.completedItems?.[index] ? "text-stone-400 line-through" : "text-stone-600"}`}>{item.title}</span>
      <button type="button" disabled={busy || position === 0} onClick={() => move(index, stops[position - 1].index)} aria-label={`Move ${item.title} earlier`} className="rounded-lg p-1 text-stone-500 hover:bg-amber-50 disabled:opacity-25"><ArrowUp size={16} /></button><button type="button" disabled={busy || position === stops.length - 1} onClick={() => move(index, stops[position + 1].index)} aria-label={`Move ${item.title} later`} className="rounded-lg p-1 text-stone-500 hover:bg-amber-50 disabled:opacity-25"><ArrowDown size={16} /></button>
    </li>)}</ol></div>)}
    {busy && <p role="status" className="mt-2 text-sm text-amber-800">Saving order…</p>}{error && <p role="alert" className="mt-2 text-sm text-red-700">{error}</p>}
  </section>;
}

export function CollaborationPanel({ list, userId, onCreate, onInvite, onDisable, onRemove, onClose }) {
  const [busy, setBusy] = useState(false), [error, setError] = useState(""), [message, setMessage] = useState("");
  const owner = !list.teamId || list.ownerId === userId;
  const inviteUrl = list.inviteId ? `${window.location.origin}/join/${list.inviteId}` : "";
  async function action(callback, success) {
    setBusy(true); setError(""); setMessage("");
    try { await callback(); setMessage(success); } catch (failure) { setError(failure.message || "Unable to update collaborators."); } finally { setBusy(false); }
  }
  return <section className="m-5 rounded-2xl bg-amber-50 p-5"><h3 className="font-bold">Plan with friends</h3><p className="mt-2 text-sm text-stone-600">{list.teamId ? "Members can edit stops, dates, order, and shared progress. Personal notes and favorites stay private." : "Create a shared planning copy, then invite friends to edit it. Your original list stays in your collection."}</p>
    {!list.teamId ? <button type="button" disabled={busy} onClick={() => action(onCreate, "Shared plan created. Open it in your collection to invite friends.")} className={`${button} mt-4`}>{busy ? "Creating…" : "Create shared plan"}</button> : <>
      <ul className="mt-4 space-y-2 text-sm">{list.memberIds.map((id, index) => <li key={id} className="flex items-center gap-3"><span className="flex-1">{id === userId ? "You" : id === list.ownerId ? "Plan owner" : `Collaborator ${index + 1}`}{id === list.ownerId && " · Owner"}</span>{owner && id !== userId && <button type="button" disabled={busy} onClick={() => action(() => onRemove(id), "Collaborator removed.")} className="text-red-700">Remove access</button>}</li>)}</ul>
      {owner && <><p className="mt-4 text-xs text-stone-500">Anyone with your invite link can sign in and join as an editor. Disabling it stops new joins; use Remove access for existing members.</p>{inviteUrl && <label className="mt-3 block text-sm font-semibold">Editor invitation<input readOnly value={inviteUrl} onFocus={(event) => event.target.select()} className={input} /></label>}<div className="mt-3 flex flex-wrap gap-3"><button type="button" disabled={busy} onClick={() => action(onInvite, "Invitation ready. Copy the link to share it.")} className={button}>{inviteUrl ? "Replace invite link" : "Create invite link"}</button>{inviteUrl && <><button type="button" disabled={busy} onClick={() => action(() => navigator.clipboard.writeText(inviteUrl), "Invite link copied.")} className="text-sm font-semibold text-amber-800">Copy invite</button><button type="button" disabled={busy} onClick={() => action(onDisable, "Invitation disabled.")} className="text-sm text-red-700">Disable invite</button></>}</div></>}
    </>}
    <button type="button" disabled={busy} onClick={onClose} className="mt-4 block text-sm text-stone-500">Close</button>{message && <p role="status" className="mt-3 text-sm text-stone-600">{message}</p>}{error && <p role="alert" className="mt-3 text-sm text-red-700">{error}</p>}
  </section>;
}
