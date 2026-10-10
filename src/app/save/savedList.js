"use client";

import { useState, useEffect, useRef } from "react";
import { SignInButton, useAuth } from "@clerk/nextjs";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Bookmark, ChevronDown, MapPin, Plus, Search, Share2, Pencil, Trash2, Compass, CalendarDays, Star, Users, Map as MapIcon } from "lucide-react";
import Navbar from "../../components/navbar";
import BucketItem from "../../components/bucket_item";
import { loadBucketLists, saveTripPlan, publishList, revokeListShare, dateMillis, updatePlan, updatePersonalList, addCustomStop, reorderStops, createCollaborativeList, watchCollaborativeLists, createInvite, disableInvite, removeCollaborator, trashList, restoreList } from "../../lib/saved-lists";

import { BudgetPanel, VotingPanel, TravelPanel } from "./plan-extras";
import { budgetTotal } from "../../lib/plan-extras";
import { listTitle, progressStatus, orderedStopIndices, validateTrip } from "../../lib/list-planning";
import { StopNote, TripPlanner, SharePanel } from "./list-tools";

import { CalendarExport, NearbyDiscoveries } from "./discovery-tools";
import { CustomStopForm, ReorderItinerary, CollaborationPanel } from "./collection-tools";
const ListMap = dynamic(() => import("./list-map"), { ssr: false, loading: () => <p role="status" className="p-4 text-sm text-stone-500">Loading map…</p> });

function SavedListCard({ activePanel, onPanelChange, list, onDelete, onRename, onComplete, onNote, onTrip, onPublish, onRevoke, onFavorite, onStopFavorite, onAdd, onReorder, onCreateTeam, onInvite, onDisableInvite, onRemoveMember, onBudget, userId, getToken }) {
  const card = useRef(null);
  const panel = activePanel?.userId === userId && activePanel?.id === list.id ? activePanel.type : null;
  function setPanel(type, open) {
    if (open) card.current?.closest('main')?.querySelectorAll('details[name="saved-list-accordion"][open]').forEach((details) => { details.open = false; });
    onPanelChange((previous) => open ? { userId, id: list.id, type } : previous?.id === list.id && previous?.type === type ? null : previous);
  }
  const budgeting = panel === "budgeting";
  const setBudgeting = (open) => setPanel("budgeting", open);
  const voting = panel === "voting";
  const setVoting = (open) => setPanel("voting", open);
  const traveling = panel === "traveling";
  const setTraveling = (open) => setPanel("traveling", open);
  const confirming = panel === "confirming";
  const setConfirming = (open) => setPanel("confirming", open);
  const planning = panel === "planning";
  const setPlanning = (open) => setPanel("planning", open);
  const sharing = panel === "sharing";
  const setSharing = (open) => setPanel("sharing", open);
  const discovering = panel === "discovering";
  const setDiscovering = (open) => setPanel("discovering", open);
  const adding = panel === "adding";
  const setAdding = (open) => setPanel("adding", open);
  const collaborating = panel === "collaborating";
  const setCollaborating = (open) => setPanel("collaborating", open);
  const renaming = panel === "renaming";
  const setRenaming = (open) => setPanel("renaming", open);

  useEffect(() => {
    if (window.location.hash === `#list-${encodeURIComponent(list.id)}` && card.current) {
      const details = card.current.querySelector('details');
      if (details) details.open = true;
      card.current.scrollIntoView({ block: 'start' });
    }
  }, [list.id]);
  const [lastCompletion, setLastCompletion] = useState(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const title = listTitle(list);
  const [mapView, setMapView] = useState(false);
  const [favoriteStopsOnly, setFavoriteStopsOnly] = useState(false);
  const owner = !list.teamId || list.ownerId === userId;
  const [draft, setDraft] = useState(title);
  const items = Array.isArray(list.bucketItems) ? list.bucketItems : [];
  const completedCount = items.filter((_, index) => list.completedItems?.[index] === true).length;

  async function favorite(index) {
    setBusy(true); setError("");
    try { if (index === undefined) await onFavorite(list.id, !list.favorite); else await onStopFavorite(list.id, index, !list.favoriteItems?.[index]); }
    catch { setError("Unable to save your favorite. Please try again."); }
    finally { setBusy(false); }
  }

  async function rename(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      await onRename(list.id, draft);
      setRenaming(false);
      setMessage("List renamed.");
    } catch (failure) {
      setError(failure.message || "Unable to rename this list.");
    } finally { setBusy(false); }
  }

  async function toggle(index, completed) {
    setBusy(true);
    setError("");
    try { await onComplete(list.id, index, completed); setLastCompletion({ index, previous: !completed }); }
    catch { setError("Unable to save your progress. Please try again."); }
    finally { setBusy(false); }
  }

  async function remove() {
    setBusy(true);
    setError("");
    setMessage("");
    try {
      await onDelete(list.id);
    } catch {
      setError("Unable to delete this list. Please try again.");
      setBusy(false);
    }
  }

  return (
    <article ref={card} id={`list-${encodeURIComponent(list.id)}`} className="scroll-mt-24 overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm">
      <details name="saved-list-accordion" className="group" onToggle={(event) => { if (event.target === event.currentTarget && event.currentTarget.open) onPanelChange(null); }}>
        <summary className="flex cursor-pointer list-none items-start gap-3 p-4 sm:gap-4 sm:p-5 focus-visible:outline-2 focus-visible:outline-amber-600 sm:p-7 [&::-webkit-details-marker]:hidden">
          <span className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-800"><Bookmark size={22} aria-hidden="true" /></span>
          <span className="min-w-0 flex-1">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-widest text-amber-800">{list.teamId ? "Shared plan" : list.sourceGuideId ? "City guide" : "Your adventure"}{list.favorite && " · ★ Pinned"}</span>
            <span className="block break-words text-xl font-bold tracking-tight text-stone-950 sm:text-2xl">{title}</span>
            <span className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-stone-500">
              <span>{items.length} {items.length === 1 ? "stop" : "stops"}</span>
              {list.trip?.start && <span className="inline-flex items-center gap-1 text-amber-800"><CalendarDays size={14} aria-hidden="true" />{list.trip.start} → {list.trip.end}</span>}
              {list.shareId && <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs text-amber-800">Shared copy</span>}
              {list.userInfo?.location && <span className="inline-flex items-center gap-1"><MapPin size={14} aria-hidden="true" />{list.userInfo.location}</span>}
              {dateMillis(list.timestamp) > 0 && <span>Saved {new Date(dateMillis(list.timestamp)).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}</span>}
            </span>
            {items.length > 0 && <span className="mt-5 block max-w-xs">
              <span className="mb-2 flex justify-between text-xs font-medium text-stone-500"><span>{completedCount === items.length ? "Adventure complete" : "Your progress"}</span><span>{completedCount} / {items.length}</span></span>
              <span className="block h-1.5 overflow-hidden rounded-full bg-stone-100"><span className="block h-full rounded-full bg-amber-500 transition-all" style={{ width: `${completedCount / items.length * 100}%` }} /></span>
            </span>}
          </span>
          <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-stone-100 text-stone-500 transition group-open:rotate-180"><ChevronDown size={18} aria-hidden="true" /></span>
        </summary>
        <div className="border-t border-stone-100 bg-amber-50/40 px-3 py-4 sm:px-7 sm:py-5">
          <div className="mb-4 flex flex-wrap gap-2"><button type="button" aria-pressed={mapView} onClick={() => setMapView(!mapView)} className="inline-flex items-center gap-2 rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm text-amber-900"><MapIcon size={16} aria-hidden="true" />{mapView ? "Hide map" : "Map view"}</button><button type="button" aria-pressed={favoriteStopsOnly} onClick={() => setFavoriteStopsOnly(!favoriteStopsOnly)} className={`rounded-xl border px-3 py-2 text-sm ${favoriteStopsOnly ? "border-amber-300 bg-amber-100 text-amber-900" : "border-stone-200 bg-white text-stone-500"}`}>Favorite stops</button></div>
          <CalendarExport list={list} />
          {lastCompletion && <div role="status" className="mb-4 flex flex-wrap items-center gap-3 text-sm"><span>Progress updated.</span><button type="button" disabled={busy} onClick={async () => { setBusy(true); try { await onComplete(list.id, lastCompletion.index, lastCompletion.previous); setLastCompletion(null); } catch { setError("Unable to undo progress."); } finally { setBusy(false); } }} className="min-h-11 px-3 font-semibold text-amber-800 underline">Undo</button></div>}
          <p className="mb-4 text-sm text-stone-600">{list.budget ? `Estimated cost: ${new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(budgetTotal(list) / 100)}` : "Set your trip estimates with Budget."}</p>
          {mapView && <ListMap list={list} />}
          {items.length > 0 && <ReorderItinerary list={list} onReorder={(order) => onReorder(list.id, order)} />}
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-stone-500">The plan · check off each stop as you go</p>
          {items.length ? orderedStopIndices(list).filter((index) => !favoriteStopsOnly || list.favoriteItems?.[index]).map((index) => { const item = items[index]; return <div key={index} className="mb-5 last:mb-0">
            <label className="flex cursor-pointer items-center gap-3 text-sm font-medium text-stone-600">
              <input type="checkbox" checked={list.completedItems?.[index] === true} disabled={busy} onChange={(event) => toggle(index, event.target.checked)} className="h-4 w-4 accent-amber-700" />
              <span className={list.completedItems?.[index] === true ? "text-amber-800" : ""}>{list.completedItems?.[index] === true ? "Completed" : `Stop ${String(orderedStopIndices(list).indexOf(index) + 1).padStart(2, "0")}`}: {item.title}</span>
            </label>
            <button type="button" disabled={busy} aria-pressed={Boolean(list.favoriteItems?.[index])} aria-label={`${list.favoriteItems?.[index] ? "Unfavorite" : "Favorite"} ${item.title}`} onClick={() => favorite(index)} className="mt-2 inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-semibold text-amber-800 hover:bg-amber-100"><Star size={14} fill={list.favoriteItems?.[index] ? "currentColor" : "none"} aria-hidden="true" />{list.favoriteItems?.[index] ? "Favorite stop" : "Favorite"}</button>
            <BucketItem {...item} destination={list.destination || list.userInfo?.location || ""} onClick={undefined} />
            <StopNote value={list.notes?.[index] || ""} title={item.title} onSave={(note) => onNote(list.id, index, note)} />
          </div>; }) : <p className="text-sm text-stone-500">No activities in this list.</p>}
          {favoriteStopsOnly && !items.some((_, index) => list.favoriteItems?.[index]) && <p className="text-sm text-stone-500">Star a stop to find it here.</p>}
        </div>
      </details>
      <div className="list-actions grid grid-cols-2 gap-2 border-t border-stone-100 px-3 py-3 sm:flex sm:flex-wrap sm:items-center sm:px-7">
        <button type="button" disabled={busy} aria-pressed={Boolean(list.favorite)} onClick={() => favorite()} className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-amber-800 hover:bg-amber-50"><Star size={15} fill={list.favorite ? "currentColor" : "none"} aria-hidden="true" />{list.favorite ? "Pinned" : "Pin list"}</button>
        {owner && <button type="button" onClick={() => { setSharing(!sharing); setPlanning(false); }} disabled={busy} aria-label={`Share ${title}`} className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-stone-600 hover:bg-stone-100 disabled:opacity-50"><Share2 size={15} aria-hidden="true" />Share</button>}
        <button type="button" disabled={busy} onClick={() => { setDraft(title); setRenaming(true); setConfirming(false); }} className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-stone-600 hover:bg-stone-100 disabled:opacity-50"><Pencil size={15} aria-hidden="true" />Rename</button>
        <button type="button" disabled={busy} onClick={() => { setPlanning(!planning); setSharing(false); }} className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-stone-600 hover:bg-stone-100"><CalendarDays size={15} aria-hidden="true" />Plan trip</button>
        <button type="button" disabled={busy} onClick={() => setDiscovering(!discovering)} aria-expanded={discovering} className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-stone-600 hover:bg-stone-100"><Compass size={15} aria-hidden="true" />Nearby discoveries</button>
        <button type="button" disabled={busy} onClick={() => setAdding(!adding)} className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-stone-600 hover:bg-stone-100"><Plus size={15} aria-hidden="true" />Add stop</button>
        <button type="button" disabled={busy} onClick={() => setCollaborating(!collaborating)} className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-stone-600 hover:bg-stone-100"><Users size={15} aria-hidden="true" />Collaborate</button>
        <button type="button" disabled={busy} onClick={() => setBudgeting(!budgeting)} className="min-h-11 rounded-xl px-3 py-2 text-sm text-stone-600">Budget</button>
        {list.teamId && <button type="button" disabled={busy} onClick={() => setVoting(!voting)} className="min-h-11 rounded-xl px-3 py-2 text-sm text-stone-600">Vote on stops</button>}
        <button type="button" disabled={busy} onClick={() => setTraveling(!traveling)} className="min-h-11 rounded-xl px-3 py-2 text-sm text-stone-600">Travel times</button>
        {!confirming && <button type="button" disabled={busy} onClick={() => { setConfirming(true); setRenaming(false); }} className="sm:ml-auto inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-red-700 hover:bg-red-50 disabled:opacity-50" aria-label={`Delete ${title}`}><Trash2 size={15} aria-hidden="true" />{owner ? "Delete" : "Leave plan"}</button>}
      </div>
      {budgeting && <BudgetPanel list={list} onSave={(budget) => onBudget(list.id, budget)} onClose={() => setBudgeting(false)} />}
      {voting && <VotingPanel list={list} userId={userId} getToken={getToken} onClose={() => setVoting(false)} />}
      {traveling && <TravelPanel list={list} onClose={() => setTraveling(false)} />}
      {discovering && <NearbyDiscoveries list={list} onAdd={(draft) => onAdd(list.id, draft)} onClose={() => setDiscovering(false)} />}
      {adding && <CustomStopForm onSave={(draft) => onAdd(list.id, draft)} onClose={() => setAdding(false)} />}
      {collaborating && <CollaborationPanel list={list} userId={userId} getToken={getToken} onCreate={() => onCreateTeam(list.id)} onInvite={() => onInvite(list.id)} onDisable={() => onDisableInvite(list.id)} onRemove={(memberId) => onRemoveMember(list.id, memberId)} onClose={() => setCollaborating(false)} />}
      {sharing && <SharePanel list={list} onPublish={() => onPublish(list.id)} onRevoke={() => onRevoke(list.id)} onClose={() => setSharing(false)} />}
      {planning && <TripPlanner list={list} onSave={(trip, assignments) => onTrip(list.id, trip, assignments)} onClose={() => setPlanning(false)} />}
      {renaming && <form onSubmit={rename} className="m-5 rounded-2xl bg-amber-50 p-4">
        <label className="block text-sm font-semibold mb-2">List name
          <input autoFocus required maxLength={100} value={draft} onChange={(event) => setDraft(event.target.value)} disabled={busy} className="block mt-2 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 focus-visible:outline-2 focus-visible:outline-amber-600" />
        </label>
        <div className="flex gap-3">
          <button disabled={busy || !draft.trim()} className="rounded-lg bg-amber-300 text-amber-950 px-4 py-2 font-semibold hover:bg-amber-400 disabled:opacity-50">{busy ? "Saving…" : "Save name"}</button>
          <button type="button" disabled={busy} onClick={() => setRenaming(false)} className="rounded-lg border border-gray-300 px-4 py-2">Cancel</button>
        </div>
      </form>}
      {confirming && <div className="m-5 rounded-2xl bg-red-50 p-4">
        <p className="mb-3">{owner ? list.teamId ? "Move this shared plan to Recently deleted for everyone? Public and invite links will be disabled." : "Move this list to Recently deleted? You can restore it later. Public links will be disabled." : "Leave this shared plan? You will lose access unless you join again."}</p>
        <div className="flex gap-3">
          <button type="button" onClick={remove} disabled={busy} className="rounded-lg bg-red-700 text-white px-4 py-2 disabled:opacity-50">{busy ? "Working…" : owner ? "Delete list" : "Leave plan"}</button>
          <button type="button" onClick={() => setConfirming(false)} disabled={busy} className="rounded-lg border border-gray-300 px-4 py-2 disabled:opacity-50">Cancel</button>
        </div>
      </div>}
      {message && <p role="status" className="mx-5 mb-4 text-sm text-gray-600">{message}</p>}
      {error && <p role="alert" className="mx-5 mb-4 text-sm text-red-700">{error}</p>}
    </article>
  );
}

export default function SavedBucketLists() {
  const [activePanel, setActivePanel] = useState(null);
  const { userId, isLoaded, getToken } = useAuth();
  const [result, setResult] = useState({ userId: null, attempt: -1, lists: [], error: null });
  const [attempt, setAttempt] = useState(0);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [teams, setTeams] = useState({ userId: null, lists: [], error: "" });

  useEffect(() => {
    if (!isLoaded || !userId) return;
    let active = true;
    loadBucketLists(userId, getToken).then(
      (lists) => { if (active) setResult({ userId, attempt, lists, error: null }); },
      (error) => {
        console.error("Error loading saved lists:", error);
        if (active) setResult({ userId, attempt, lists: [], error: error.message || "Unable to load saved lists." });
      }
    );
    return () => { active = false; };
  }, [isLoaded, userId, getToken, attempt]);

  useEffect(() => {
    if (!isLoaded || !userId) return;
    let active = true, unsubscribe;
    watchCollaborativeLists(userId, getToken, (lists) => {
      if (active) setTeams({ userId, error: "", lists });
    }, () => { if (active) setTeams((current) => ({ ...current, userId, error: "Shared plans could not be updated. Try reloading your collection." })); }).then((stop) => { if (active) unsubscribe = stop; else stop(); }).catch(() => { if (active) setTeams({ userId, lists: [], error: "Unable to connect shared plans. Try again." }); });
    return () => { active = false; unsubscribe?.(); };
  }, [isLoaded, userId, getToken, attempt]);

  const allRecords = [...(result.userId === userId ? result.lists : []), ...(teams.userId === userId ? teams.lists : [])];
  const allLists = allRecords.filter((list) => !list.deletedAt);
  const trashed = allRecords.filter((list) => list.deletedAt && (!list.teamId || list.ownerId === userId));
  function findList(id) {
    const list = allRecords.find((entry) => entry.id === id);
    if (!list) throw new Error("This list is no longer available.");
    return list;
  }
  const loading = !isLoaded || (userId && (result.userId !== userId || result.attempt !== attempt));
  async function removeList(listId) {
    const list = findList(listId);
    if (list.teamId) {
      if (list.ownerId === userId) { await trashList(userId, getToken, list); updateList(listId, (entry) => ({ ...entry, deletedAt: new Date().toISOString(), shareId: "", inviteId: "" })); return; }
      else await removeCollaborator(userId, getToken, list, userId);
      setTeams((current) => current.userId === userId ? { ...current, lists: current.lists.filter((entry) => entry.id !== listId) } : current);
    } else {
      await trashList(userId, getToken, list);
      updateList(listId, (entry) => ({ ...entry, deletedAt: new Date().toISOString(), shareId: "" }));
    }
  }
  function updateList(listId, update) {
    const change = (current) => current.userId === userId ? { ...current, lists: current.lists.map((list) => list.id === listId ? update(list) : list) } : current;
    setResult(change); setTeams(change);
  }
  async function renameList(listId, title) {
    const trimmed = title.trim();
    if (!trimmed || trimmed.length > 100) throw new Error("Use a list name between 1 and 100 characters.");
    await updatePlan(userId, getToken, findList(listId), { title: trimmed });
    updateList(listId, (list) => ({ ...list, title: trimmed }));
  }
  async function completeActivity(listId, index, completed) {
    await updatePlan(userId, getToken, findList(listId), { [`completedItems.${index}`]: completed });
    updateList(listId, (list) => ({ ...list, completedItems: { ...list.completedItems, [index]: completed } }));
  }
  async function noteActivity(listId, index, note) {
    if (note.length > 2000) throw new Error("Notes must be 2,000 characters or less.");
    const list = findList(listId), notes = { ...list.notes, [index]: note.trim() };
    await updatePersonalList(userId, getToken, list, { notes });
    updateList(listId, (current) => ({ ...current, notes }));
  }
  async function favoriteList(listId, favorite) {
    await updatePersonalList(userId, getToken, findList(listId), { favorite });
    updateList(listId, (list) => ({ ...list, favorite }));
  }
  async function favoriteStop(listId, index, favorite) {
    const list = findList(listId), favoriteItems = { ...list.favoriteItems, [index]: favorite };
    await updatePersonalList(userId, getToken, list, { favoriteItems });
    updateList(listId, (current) => ({ ...current, favoriteItems }));
  }
  async function planTrip(listId, trip, assignments) {
    const list = findList(listId), savedTrip = validateTrip(trip, assignments);
    if (list.teamId) await updatePlan(userId, getToken, list, { trip: savedTrip, scheduledItems: assignments });
    else await saveTripPlan(userId, getToken, listId, trip, assignments);
    updateList(listId, (current) => ({ ...current, trip: savedTrip, scheduledItems: assignments }));
  }
  async function addStop(listId, draft) {
    const update = await addCustomStop(userId, getToken, findList(listId), draft);
    updateList(listId, (list) => ({ ...list, ...update }));
  }
  async function reorder(listId, stopOrder) {
    await reorderStops(userId, getToken, findList(listId), stopOrder);
    updateList(listId, (list) => ({ ...list, stopOrder }));
  }
  async function publish(listId) {
    const shareId = await publishList(userId, getToken, findList(listId));
    updateList(listId, (list) => ({ ...list, shareId }));
    return shareId;
  }
  async function revoke(listId) {
    await revokeListShare(userId, getToken, findList(listId));
    updateList(listId, (list) => ({ ...list, shareId: "" }));
  }
  async function invite(listId) {
    const inviteId = await createInvite(userId, getToken, findList(listId));
    updateList(listId, (list) => ({ ...list, inviteId }));
  }
  async function stopInvites(listId) {
    await disableInvite(userId, getToken, findList(listId));
    updateList(listId, (list) => ({ ...list, inviteId: "" }));
  }
  async function removeMember(listId, memberId) {
    await removeCollaborator(userId, getToken, findList(listId), memberId);
  }
  async function createTeam(listId) {
    await createCollaborativeList(userId, getToken, findList(listId));
  }
  async function saveBudget(listId, budget) {
    await updatePlan(userId, getToken, findList(listId), { budget });
    updateList(listId, (list) => ({ ...list, budget }));
  }
  async function restore(listId) {
    try { await restoreList(userId, getToken, findList(listId)); updateList(listId, (list) => ({ ...list, deletedAt: "" })); }
    catch { setRecoveryError("Unable to restore this list. Please try again."); }
  }
  const [recoveryError, setRecoveryError] = useState("");
  const visibleLists = allLists.filter((list) =>
    (filter === "all" || (filter === "favorites" ? list.favorite : filter === "shared" ? list.teamId : progressStatus(list) === filter)) &&
    `${listTitle(list)} ${list.userInfo?.location || ""}`.toLowerCase().includes(query.trim().toLowerCase())
  ).sort((a, b) => Number(Boolean(b.favorite)) - Number(Boolean(a.favorite)) || dateMillis(b.timestamp) - dateMillis(a.timestamp));
  return (
    <div className="min-h-screen bg-[#fffbf2] px-4 pb-16 pt-24 text-gray-900 sm:pt-28">
      <Navbar />
      <main className="max-w-5xl mx-auto">
        <header className="mb-9 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-amber-800">Your collection</p>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-stone-950 sm:text-5xl">Good plans. Ready when you are.</h1>
            <p className="mt-4 max-w-xl text-stone-500">Your saved lists, favorite discoveries, and next adventures—all in one place.</p>
          </div>
          {userId && <Link href="/generate" className="inline-flex items-center gap-2 rounded-2xl bg-amber-300 px-5 py-3 text-sm font-semibold text-amber-950 transition hover:bg-amber-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-700"><Plus size={18} aria-hidden="true" />Create a list</Link>}
        </header>
        {userId && !loading && !result.error && allLists.length > 0 && <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-sm font-semibold text-stone-600">Saved lists <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-900">{allLists.length}</span></h2>
          <label className="flex w-full items-center gap-2 rounded-xl border border-stone-200 bg-white px-3 py-2.5 focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-100 sm:w-72"><Search size={17} className="text-stone-400" aria-hidden="true" /><input aria-label="Search saved lists" placeholder="Find a list…" value={query} onChange={(event) => setQuery(event.target.value)} className="min-w-0 flex-1 bg-transparent text-sm outline-none" /></label>
        </div>}
        {userId && !loading && !result.error && allLists.length > 0 && <div className="mb-6 flex gap-2 overflow-x-auto pb-2 sm:flex-wrap" aria-label="Filter lists by progress">{[["all", "All"], ["favorites", "Favorites"], ["shared", "Shared plans"], ["not-started", "Not started"], ["in-progress", "In progress"], ["completed", "Completed"]].map(([value, label]) => <button key={value} type="button" aria-pressed={filter === value} onClick={() => setFilter(value)} className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${filter === value ? "bg-amber-200 text-amber-950" : "border border-stone-200 bg-white text-stone-500 hover:bg-amber-50"}`}>{label}</button>)}</div>}
        {teams.userId === userId && teams.error && <div role="alert" className="mb-5 rounded-xl bg-red-50 p-4 text-sm text-red-700">{teams.error}<button type="button" onClick={() => setAttempt((value) => value + 1)} className="ml-3 underline">Retry</button></div>}
        {loading ? (
          <div role="status" className="rounded-3xl border border-stone-200 bg-white p-8 text-stone-500">Loading your collection…</div>
        ) : !userId ? (
          <div className="rounded-3xl border border-stone-200 bg-white p-8">
            <p className="mb-4">Sign in to view your saved bucket lists.</p>
            <SignInButton mode="modal"><button className="rounded-lg bg-amber-300 text-amber-950 px-5 py-3 font-semibold hover:bg-amber-400">Sign In</button></SignInButton>
          </div>
        ) : result.error ? (
          <div role="alert" className="rounded-3xl border border-stone-200 bg-white p-8">
            <p className="text-red-700 mb-4">{result.error}</p>
            <button onClick={() => setAttempt((value) => value + 1)} className="underline">Try again</button>
          </div>
        ) : allLists.length === 0 ? (
          <div className="rounded-3xl border border-stone-200 bg-white p-8">
            <Bookmark size={32} className="mb-5 text-amber-700" aria-hidden="true" /><h2 className="mb-2 text-2xl font-bold">Your next adventure starts here.</h2><p className="mb-5 max-w-lg text-stone-500">Create a personal bucket list or save a city guide. Your plans will be waiting here when you’re ready to explore.</p>
            <Link href="/generate" className="font-semibold text-amber-800 hover:underline">Create your first list →</Link>
          </div>
        ) : (
          <div className="space-y-5">
            {visibleLists.length === 0 && <div className="rounded-2xl border border-stone-200 bg-white p-6"><p className="text-stone-500">No lists match this search and filter.</p><button type="button" onClick={() => { setQuery(""); setFilter("all"); }} className="mt-3 text-sm font-semibold text-amber-800">Show all lists</button></div>}
            {visibleLists.map((list) => (
              <SavedListCard activePanel={activePanel} onPanelChange={setActivePanel} key={`${userId}:${list.id}`} list={list} onDelete={removeList} onRename={renameList} onComplete={completeActivity} onNote={noteActivity} onTrip={planTrip} onPublish={publish} onRevoke={revoke} onFavorite={favoriteList} onStopFavorite={favoriteStop} onAdd={addStop} onReorder={reorder} onCreateTeam={createTeam} onInvite={invite} onDisableInvite={stopInvites} onRemoveMember={removeMember} onBudget={saveBudget} userId={userId} getToken={getToken} />
            ))}
          </div>
        )}
        {trashed.length > 0 && <details className="mt-8 rounded-2xl border border-stone-200 bg-white p-5"><summary className="cursor-pointer font-semibold">Recently deleted · {trashed.length}</summary><p className="mt-3 text-sm text-stone-500">Restore your lists here. Public and editor invite links stay disabled after restoring.</p><ul className="mt-3 space-y-3">{trashed.map((list) => <li key={list.id} className="flex flex-wrap items-center gap-3"><span className="min-w-0 flex-1 break-words text-sm">{listTitle(list)}</span><button onClick={() => restore(list.id)} className="min-h-11 rounded-xl bg-amber-200 px-4 py-2 text-sm font-semibold">Restore</button></li>)}</ul>{recoveryError && <p role="alert" className="mt-3 text-sm text-red-700">{recoveryError}</p>}</details>}
        {userId && <Link href="/guides" className="mt-8 flex flex-wrap items-center gap-4 rounded-2xl border border-amber-200/60 bg-amber-50 p-5 text-amber-950 transition hover:bg-amber-100"><Compass size={24} aria-hidden="true" /><span className="flex-1"><span className="block font-semibold">Looking for a little inspiration?</span><span className="text-sm text-amber-900/70">Explore ready-to-save guides for 50 U.S. cities.</span></span><span className="text-sm font-semibold">Browse city guides →</span></Link>}
      </main>
    </div>
  );
}
