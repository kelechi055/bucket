"use client";

import { useState, useEffect } from "react";
import { SignInButton, useAuth } from "@clerk/nextjs";
import Link from "next/link";
import Navbar from "../../components/navbar";
import BucketItem from "../../components/bucket_item";
import { loadBucketLists, deleteBucketList, dateMillis } from "../../lib/saved-lists";

function SavedListCard({ list, onDelete }) {
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const title = list.userInfo?.name ? `Bucket List for ${list.userInfo.name}` : "Bucket List";
  const items = Array.isArray(list.bucketItems) ? list.bucketItems : [];

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
    <article className="bg-white rounded-xl p-6 shadow-sm">
      <details className="group">
        <summary className="cursor-pointer rounded-lg focus-visible:outline-2 focus-visible:outline-amber-600">
          <span className="text-2xl font-bold">{title}</span>
          <span className="block text-sm text-gray-500 mt-2">{items.length} {items.length === 1 ? "activity" : "activities"} · <span className="group-open:hidden">Expand list</span><span className="hidden group-open:inline">Collapse list</span></span>
          {list.userInfo?.location && <span className="block text-gray-600 mt-1">{list.userInfo.location}</span>}
          {dateMillis(list.timestamp) > 0 && <span className="block text-sm text-gray-500 mt-2">Saved {new Date(dateMillis(list.timestamp)).toLocaleString()}</span>}
        </summary>
        <div className="mt-4">
          {items.length ? items.map((item, index) => <BucketItem key={index} {...item} onClick={undefined} />) : <p>No activities in this list.</p>}
        </div>
      </details>
      <div className="flex flex-wrap gap-3 mt-5 border-t border-gray-100 pt-4">
        <button type="button" onClick={share} disabled={busy} aria-label={`Share ${title}`} className="rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-50 disabled:opacity-50">Share</button>
        {!confirming && <button type="button" onClick={() => setConfirming(true)} className="rounded-lg px-4 py-2 text-red-700 hover:bg-red-50" aria-label={`Delete ${title}`}>Delete</button>}
      </div>
      {confirming && <div className="mt-3 rounded-lg bg-red-50 p-4">
        <p className="mb-3">Delete this saved list? This cannot be undone.</p>
        <div className="flex gap-3">
          <button type="button" onClick={remove} disabled={busy} className="rounded-lg bg-red-700 text-white px-4 py-2 disabled:opacity-50">{busy ? "Deleting…" : "Delete list"}</button>
          <button type="button" onClick={() => setConfirming(false)} disabled={busy} className="rounded-lg border border-gray-300 px-4 py-2 disabled:opacity-50">Cancel</button>
        </div>
      </div>}
      {message && <p role="status" className="mt-3 text-sm text-gray-600">{message}</p>}
      {error && <p role="alert" className="mt-3 text-sm text-red-700">{error}</p>}
    </article>
  );
}

export default function SavedBucketLists() {
  const { userId, isLoaded, getToken } = useAuth();
  const [result, setResult] = useState({ userId: null, attempt: -1, lists: [], error: null });
  const [attempt, setAttempt] = useState(0);

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
  return (
    <div className="min-h-screen bg-amber-50 px-4 pb-12 pt-28 text-gray-900">
      <Navbar />
      <main className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-3">Your Saved Bucket Lists</h1>
        <p className="text-gray-600 mb-8">Revisit your plans whenever you&apos;re ready for your next adventure.</p>
        {userId && <Link href="/generate" className="inline-block mb-6 rounded-lg bg-black text-white px-5 py-3">Create another list</Link>}
        {loading ? (
          <p role="status">Loading your saved lists...</p>
        ) : !userId ? (
          <div className="bg-white rounded-xl p-6">
            <p className="mb-4">Sign in to view your saved bucket lists.</p>
            <SignInButton mode="modal"><button className="rounded-lg bg-black text-white px-5 py-3">Sign In</button></SignInButton>
          </div>
        ) : result.error ? (
          <div role="alert" className="bg-white rounded-xl p-6">
            <p className="text-red-700 mb-4">{result.error}</p>
            <button onClick={() => setAttempt((value) => value + 1)} className="underline">Try again</button>
          </div>
        ) : result.lists.length === 0 ? (
          <div className="bg-white rounded-xl p-6">
            <p className="mb-4">You haven&apos;t saved any lists yet. Generate a list, then choose Save Bucket List.</p>
            <Link href="/generate" className="underline font-semibold">Create your first list</Link>
          </div>
        ) : (
          <div className="space-y-6">
            {result.lists.map((list) => (
              <SavedListCard key={`${userId}:${list.id}`} list={list} onDelete={removeList} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
