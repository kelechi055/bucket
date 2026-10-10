"use client";

import { useState, useEffect } from "react";
import { SignInButton, useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { Bookmark, ChevronDown, MapPin, Plus, Search, Share2, Pencil, Trash2, Compass } from "lucide-react";
import Navbar from "../../components/navbar";
import BucketItem from "../../components/bucket_item";
import { loadBucketLists, deleteBucketList, renameBucketList, setActivityComplete, dateMillis } from "../../lib/saved-lists";

function SavedListCard({ list, onDelete, onRename, onComplete }) {
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const title = list.title || (list.userInfo?.name ? `Bucket List for ${list.userInfo.name}` : "Bucket List");
  const [renaming, setRenaming] = useState(false);
  const [draft, setDraft] = useState(title);
  const items = Array.isArray(list.bucketItems) ? list.bucketItems : [];
  const completedCount = items.filter((_, index) => list.completedItems?.[index] === true).length;

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
    try { await onComplete(list.id, index, completed); }
    catch { setError("Unable to save your progress. Please try again."); }
    finally { setBusy(false); }
  }

  async function share() {
    setMessage("");
    setError("");
    const text = [title, ...items.map((item, index) =>
      [`${index + 1}. ${item.title || "Activity"}`, item.description, item.location].filter(Boolean).join("\n")
    )].join("\n\n");
    try {
      if (navigator.share) {
        await navigator.share({ title, text });
        setMessage("List shared.");
      } else {
        await navigator.clipboard.writeText(text);
        setMessage("List copied. Paste it into a message to share.");
      }
    } catch (failure) {
      if (failure.name !== "AbortError") setError("Unable to share this list. Please try again.");
    }
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
    <article className="overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm">
      <details className="group">
        <summary className="flex cursor-pointer list-none items-start gap-4 p-5 focus-visible:outline-2 focus-visible:outline-amber-600 sm:p-7 [&::-webkit-details-marker]:hidden">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-800"><Bookmark size={22} aria-hidden="true" /></span>
          <span className="min-w-0 flex-1">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-widest text-amber-800">{list.sourceGuideId ? "City guide" : "Your adventure"}</span>
            <span className="block break-words text-xl font-bold tracking-tight text-stone-950 sm:text-2xl">{title}</span>
            <span className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-stone-500">
              <span>{items.length} {items.length === 1 ? "stop" : "stops"}</span>
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
        <div className="border-t border-stone-100 bg-amber-50/40 px-5 py-5 sm:px-7">
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-stone-500">The plan · check off each stop as you go</p>
          {items.length ? items.map((item, index) => <div key={index} className="mb-5 last:mb-0">
            <label className="flex cursor-pointer items-center gap-3 text-sm font-medium text-stone-600">
              <input type="checkbox" checked={list.completedItems?.[index] === true} disabled={busy} onChange={(event) => toggle(index, event.target.checked)} className="h-4 w-4 accent-amber-700" />
              <span className={list.completedItems?.[index] === true ? "text-amber-800" : ""}>{list.completedItems?.[index] === true ? "Completed" : `Stop ${String(index + 1).padStart(2, "0")}`}: {item.title}</span>
            </label>
            <BucketItem {...item} onClick={undefined} />
          </div>) : <p className="text-sm text-stone-500">No activities in this list.</p>}
        </div>
      </details>
      <div className="flex flex-wrap items-center gap-2 border-t border-stone-100 px-5 py-3 sm:px-7">
        <button type="button" onClick={share} disabled={busy} aria-label={`Share ${title}`} className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-stone-600 hover:bg-stone-100 disabled:opacity-50"><Share2 size={15} aria-hidden="true" />Share</button>
        <button type="button" disabled={busy} onClick={() => { setDraft(title); setRenaming(true); setConfirming(false); }} className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-stone-600 hover:bg-stone-100 disabled:opacity-50"><Pencil size={15} aria-hidden="true" />Rename</button>
        {!confirming && <button type="button" disabled={busy} onClick={() => { setConfirming(true); setRenaming(false); }} className="ml-auto inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-red-700 hover:bg-red-50 disabled:opacity-50" aria-label={`Delete ${title}`}><Trash2 size={15} aria-hidden="true" />Delete</button>}
      </div>
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
        <p className="mb-3">Delete this saved list? This cannot be undone.</p>
        <div className="flex gap-3">
          <button type="button" onClick={remove} disabled={busy} className="rounded-lg bg-red-700 text-white px-4 py-2 disabled:opacity-50">{busy ? "Deleting…" : "Delete list"}</button>
          <button type="button" onClick={() => setConfirming(false)} disabled={busy} className="rounded-lg border border-gray-300 px-4 py-2 disabled:opacity-50">Cancel</button>
        </div>
      </div>}
      {message && <p role="status" className="mx-5 mb-4 text-sm text-gray-600">{message}</p>}
      {error && <p role="alert" className="mx-5 mb-4 text-sm text-red-700">{error}</p>}
    </article>
  );
}

export default function SavedBucketLists() {
  const { userId, isLoaded, getToken } = useAuth();
  const [result, setResult] = useState({ userId: null, attempt: -1, lists: [], error: null });
  const [attempt, setAttempt] = useState(0);
  const [query, setQuery] = useState("");

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

  const loading = !isLoaded || (userId && (result.userId !== userId || result.attempt !== attempt));
  async function removeList(listId) {
    await deleteBucketList(userId, getToken, listId);
    setResult((current) => current.userId === userId ? {
      ...current, lists: current.lists.filter((list) => list.id !== listId),
    } : current);
  }
  function updateList(listId, update) {
    setResult((current) => current.userId === userId ? {
      ...current, lists: current.lists.map((list) => list.id === listId ? update(list) : list),
    } : current);
  }
  async function renameList(listId, title) {
    const savedTitle = await renameBucketList(userId, getToken, listId, title);
    updateList(listId, (list) => ({ ...list, title: savedTitle }));
  }
  async function completeActivity(listId, index, completed) {
    await setActivityComplete(userId, getToken, listId, index, completed);
    updateList(listId, (list) => ({ ...list, completedItems: { ...list.completedItems, [index]: completed } }));
  }
  return (
    <div className="min-h-screen bg-[#fffbf2] px-4 pb-16 pt-40 text-gray-900 sm:pt-32">
      <Navbar />
      <main className="max-w-5xl mx-auto">
        <header className="mb-9 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-amber-800">Your collection</p>
            <h1 className="text-4xl font-bold tracking-tight text-stone-950 sm:text-5xl">Good plans. Ready when you are.</h1>
            <p className="mt-4 max-w-xl text-stone-500">Your saved lists, favorite discoveries, and next adventures—all in one place.</p>
          </div>
          {userId && <Link href="/generate" className="inline-flex items-center gap-2 rounded-2xl bg-amber-300 px-5 py-3 text-sm font-semibold text-amber-950 transition hover:bg-amber-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-700"><Plus size={18} aria-hidden="true" />Create a list</Link>}
        </header>
        {userId && !loading && !result.error && result.lists.length > 0 && <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-sm font-semibold text-stone-600">Saved lists <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-900">{result.lists.length}</span></h2>
          <label className="flex w-full items-center gap-2 rounded-xl border border-stone-200 bg-white px-3 py-2.5 focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-100 sm:w-72"><Search size={17} className="text-stone-400" aria-hidden="true" /><input aria-label="Search saved lists" placeholder="Find a list…" value={query} onChange={(event) => setQuery(event.target.value)} className="min-w-0 flex-1 bg-transparent text-sm outline-none" /></label>
        </div>}
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
        ) : result.lists.length === 0 ? (
          <div className="rounded-3xl border border-stone-200 bg-white p-8">
            <Bookmark size={32} className="mb-5 text-amber-700" aria-hidden="true" /><h2 className="mb-2 text-2xl font-bold">Your next adventure starts here.</h2><p className="mb-5 max-w-lg text-stone-500">Create a personal bucket list or save a city guide. Your plans will be waiting here when you’re ready to explore.</p>
            <Link href="/generate" className="font-semibold text-amber-800 hover:underline">Create your first list →</Link>
          </div>
        ) : (
          <div className="space-y-5">
            {query.trim() && !result.lists.some((list) => `${list.title || "Bucket List"} ${list.userInfo?.name || ""} ${list.userInfo?.location || ""}`.toLowerCase().includes(query.trim().toLowerCase())) && <p className="rounded-2xl border border-stone-200 bg-white p-6 text-stone-500">No lists match “{query}”. Try a different name.</p>}
            {result.lists.filter((list) => `${list.title || "Bucket List"} ${list.userInfo?.name || ""} ${list.userInfo?.location || ""}`.toLowerCase().includes(query.trim().toLowerCase())).map((list) => (
              <SavedListCard key={`${userId}:${list.id}`} list={list} onDelete={removeList} onRename={renameList} onComplete={completeActivity} />
            ))}
          </div>
        )}
        {userId && <Link href="/guides" className="mt-8 flex flex-wrap items-center gap-4 rounded-2xl border border-amber-200/60 bg-amber-50 p-5 text-amber-950 transition hover:bg-amber-100"><Compass size={24} aria-hidden="true" /><span className="flex-1"><span className="block font-semibold">Looking for a little inspiration?</span><span className="text-sm text-amber-900/70">Explore ready-to-save guides for 50 U.S. cities.</span></span><span className="text-sm font-semibold">Browse city guides →</span></Link>}
      </main>
    </div>
  );
}
