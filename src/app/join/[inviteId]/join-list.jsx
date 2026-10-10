"use client";

import { useEffect, useState } from "react";
import { useAuth, SignInButton } from "@clerk/nextjs";
import Link from "next/link";
import { Users } from "lucide-react";
import { loadInvite, joinCollaborativeList } from "../../../lib/saved-lists";

export default function JoinList({ inviteId }) {
  const { userId, isLoaded, getToken } = useAuth();
  const [result, setResult] = useState({ userId: null, invite: null, error: "", loaded: false });
  const [busy, setBusy] = useState(false), [joined, setJoined] = useState(null), [error, setError] = useState("");
  useEffect(() => {
    if (!isLoaded || !userId) return;
    let active = true;
    loadInvite(userId, getToken, inviteId).then((invite) => { if (active) setResult({ userId, invite, error: "", loaded: true }); }, () => { if (active) setResult({ userId, invite: null, error: "This invitation is invalid, disabled, or no longer available.", loaded: true }); });
    return () => { active = false; };
  }, [isLoaded, userId, getToken, inviteId]);
  async function join() {
    setBusy(true); setError("");
    try { await joinCollaborativeList(userId, getToken, inviteId); setJoined(userId); }
    catch { setError("Unable to join. The invitation may have expired or the plan may be full. Ask the owner for a new link."); }
    finally { setBusy(false); }
  }
  const loading = !isLoaded || (userId && (!result.loaded || result.userId !== userId));
  return <main className="min-h-screen bg-[#fffbf2] px-4 py-16"><section className="mx-auto max-w-lg rounded-3xl border border-amber-200 bg-white p-8"><Users className="mb-5 text-amber-800" aria-hidden="true" /><p className="text-xs font-semibold uppercase tracking-widest text-amber-800">An adventure together</p>
    {loading ? <p role="status" className="mt-5">Loading invitation…</p> : !userId ? <><h1 className="mt-4 text-3xl font-bold">Join a shared plan</h1><p className="mt-3 text-stone-500">Sign in to view the invitation and choose whether to join.</p><SignInButton mode="modal"><button className="mt-5 rounded-xl bg-amber-300 px-5 py-3 font-semibold text-amber-950">Sign in to continue</button></SignInButton></> : joined === userId ? <><h1 className="mt-4 text-3xl font-bold">You’re in.</h1><p role="status" className="mt-3 text-stone-500">This plan is now in your Saved Lists. Changes you make will be visible to the other members.</p><Link href="/save" className="mt-5 inline-block rounded-xl bg-amber-300 px-5 py-3 font-semibold text-amber-950">Open Saved Lists →</Link></> : result.invite ? <><h1 className="mt-4 break-words text-3xl font-bold">{result.invite.title}</h1><p className="mt-3 text-stone-500">Join as an editor to add stops, arrange the itinerary, plan dates, and check off shared progress. Your personal notes and favorites stay private.</p><button type="button" disabled={busy} onClick={join} className="mt-5 rounded-xl bg-amber-300 px-5 py-3 font-semibold text-amber-950 disabled:opacity-50">{busy ? "Joining…" : "Join shared plan"}</button>{error && <p role="alert" className="mt-3 text-sm text-red-700">{error}</p>}</> : <><h1 className="mt-4 text-3xl font-bold">Invitation unavailable</h1><p role="alert" className="mt-3 text-stone-500">{result.error || "Ask the owner for a new invite link."}</p></>}
    <Link href="/guides" className="mt-6 block text-sm font-semibold text-amber-800">Browse city guides</Link>
  </section></main>;
}
