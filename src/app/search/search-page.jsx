'use client';
import { useEffect, useRef, useState } from 'react';
import { useAuth, SignInButton } from '@clerk/nextjs';
import Link from 'next/link';
import Navbar from '../../components/navbar';
import { cityGuides } from '../../data/city-guides';
import { searchCatalog } from '../../lib/global-search';
import { loadBucketLists, watchCollaborativeLists } from '../../lib/saved-lists';
import EventListPicker from '../guides/event-list-picker';
import { Search, ArrowUpRight } from 'lucide-react';
const input = 'min-h-12 rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm';
export default function SearchPage() {
  const { userId, isLoaded, getToken } = useAuth();
  const [query, setQuery] = useState(''), [type, setType] = useState('all'), [city, setCity] = useState('');
  const [collection, setCollection] = useState({ userId: null, own: [], teams: [], error: '', ownReady: false });
  const [live, setLive] = useState({ key: '', events: [], busy: false, error: '' });
  const [selected, setSelected] = useState(null);
  const request = useRef(null);
  useEffect(() => {
    if (!userId) return;
    let active = true, stop;
    const update = (patch) => { if (active) setCollection((old) => ({ ...(old.userId === userId ? old : { own: [], teams: [], ownReady: false }), userId, ...patch })); };
    loadBucketLists(userId, getToken).then((own) => update({ own, ownReady: true })).catch(() => update({ error: 'Your saved plans could not be loaded. Try refreshing.', ownReady: true }));
    watchCollaborativeLists(userId, getToken, (teams) => update({ teams }), () => update({ error: 'Shared plans could not be loaded.' })).then((unsubscribe) => { if (active) stop = unsubscribe; else unsubscribe(); }).catch(() => update({ error: 'Shared plans could not be loaded.' }));
    return () => { active = false; stop?.(); };
  }, [userId, getToken]);
  useEffect(() => () => request.current?.abort(), []);
  const lists = collection.userId === userId ? [...collection.own, ...collection.teams] : [];
  const results = searchCatalog(cityGuides, lists, query, type, city);
  const liveKey = `${city}:${query.trim()}`;
  async function searchEvents(event) {
    event.preventDefault();
    request.current?.abort(); const controller = new AbortController(); request.current = controller;
    setLive({ key: liveKey, events: [], busy: true, error: '' });
    try {
      const response = await fetch(`/api/events?${new URLSearchParams({ city, keyword: query.trim() })}`, { signal: controller.signal });
      const data = await response.json(); if (!response.ok) throw new Error(data.error);
      if (!controller.signal.aborted) setLive({ key: liveKey, events: data.events, busy: false, error: '' });
    } catch (error) { if (!controller.signal.aborted) setLive({ key: liveKey, events: [], busy: false, error: error.message || 'Unable to search events.' }); }
  }
  return <><Navbar /><main className="min-h-screen bg-amber-50/60 px-4 pb-16 pt-24 sm:px-8"><div className="mx-auto max-w-5xl">
    <p className="text-xs font-bold uppercase tracking-widest text-amber-800">Find your next plan</p><h1 className="mt-2 text-3xl font-bold sm:text-5xl">Search everything</h1><p className="mt-3 text-stone-600">Cities, restaurants, things to do, and your private and shared plans.</p>
    <form onSubmit={searchEvents} className="mt-6 rounded-3xl border border-amber-200 bg-white p-4 sm:p-6"><label htmlFor="global-query" className="text-sm font-semibold">What are you looking for?</label><div className="relative mt-2"><Search className="absolute left-4 top-4 text-stone-400" size={20} /><input id="global-query" type="search" value={query} onChange={(event) => setQuery(event.target.value)} maxLength={100} placeholder="Try pizza, Boston, museums, or a plan name…" className={`${input} w-full pl-12`} /></div>
    <div className="mt-3 grid gap-3 sm:grid-cols-2"><label className="text-sm">Search in<select value={type} onChange={(event) => setType(event.target.value)} className={`${input} mt-1 w-full`}>{[['all','Everything'],['cities','Cities'],['places','Restaurants & attractions'],['lists','My plans'],['stops','My saved stops'],['events','Live events']].map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label><label className="text-sm">City<select value={city} onChange={(event) => setCity(event.target.value)} className={`${input} mt-1 w-full`}><option value="">All cities</option>{cityGuides.map((guide) => <option key={guide.id} value={guide.id}>{guide.city}, {guide.state}</option>)}</select></label></div>
    {(type === 'all' || type === 'events') && <div className="mt-4 flex flex-wrap items-center gap-3"><button disabled={!city || !query.trim() || (live.key === liveKey && live.busy)} className="rounded-xl bg-stone-950 px-4 py-3 text-sm font-semibold text-white disabled:opacity-40">{live.key === liveKey && live.busy ? 'Searching…' : 'Search live events'}</button><p className="text-xs text-stone-500">Choose a city to include upcoming Ticketmaster events.</p></div>}</form>
    {isLoaded && !userId && <p className="mt-4 text-sm text-stone-600"><SignInButton mode="modal"><button className="font-semibold underline">Sign in</button></SignInButton> to search your saved and shared plans.</p>}
    {userId && (collection.userId !== userId || !collection.ownReady) && <p role="status" className="mt-4 text-sm text-stone-500">Loading your saved plans…</p>}
    {collection.userId === userId && collection.error && <p role="alert" className="mt-4 text-sm text-red-700">{collection.error}</p>}
    {type !== 'events' && <section className="mt-7" aria-label="Search results"><h2 aria-live="polite" className="mb-3 font-semibold">{query.trim() ? `${results.length} results` : 'Start with a city, place, or plan name'}</h2><div className="grid gap-3 sm:grid-cols-2">{results.slice(0, 60).map((result) => <Link key={result.id} href={result.href} className="min-w-0 rounded-2xl border border-stone-200 bg-white p-5 hover:border-amber-400"><p className="text-xs font-semibold uppercase text-amber-800">{result.type === 'stops' ? 'Saved stop' : result.type === 'lists' ? 'Saved plan' : result.type === 'cities' ? 'City guide' : 'Place'}</p><h3 className="mt-2 flex items-center justify-between gap-2 font-bold">{result.title}<ArrowUpRight size={18} className="shrink-0" /></h3><p className="mt-2 line-clamp-2 text-sm text-stone-600">{result.description}</p><p className="mt-3 text-xs text-stone-500">{result.context}</p></Link>)}</div>{results.length > 60 && <p className="mt-3 text-sm text-stone-500">Showing the first 60 results. Narrow your search to see more.</p>}{query.trim() && !results.length && <p className="rounded-2xl bg-white p-5 text-stone-500">No matches. Try a different name or fewer words.</p>}</section>}
    {(type === 'all' || type === 'events') && live.key === liveKey && <section className="mt-8" aria-label="Live event results"><h2 className="font-bold">Live events</h2>{live.error && <p role="alert" className="mt-3 text-red-700">{live.error}</p>}{!live.busy && !live.error && !live.events.length && <p className="mt-3 text-stone-500">No upcoming events matched this search.</p>}<div className="mt-3 grid gap-3 sm:grid-cols-2">{live.events.map((event) => <article key={event.id} className="rounded-2xl border border-stone-200 bg-white p-5"><p className="text-xs text-amber-800">{event.category} · {event.date || 'Date TBA'}</p><h3 className="mt-2 font-bold">{event.title}</h3><p className="mt-2 text-sm text-stone-500">{event.venue}</p><div className="mt-4 flex flex-wrap gap-4">{event.website && <a href={event.website} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold underline">Tickets</a>}{userId && <button onClick={() => setSelected(event)} className="text-sm font-semibold text-amber-800">Add to a plan</button>}</div></article>)}</div></section>}
    {selected && userId && <div className="fixed inset-0 z-50 overflow-auto bg-stone-950/40 p-4 pt-24"><div className="mx-auto max-w-xl rounded-3xl bg-white p-4"><EventListPicker key={`${userId}:${selected.id}`} event={selected} userId={userId} getToken={getToken} onClose={() => setSelected(null)} /></div></div>}
  </div></main></>;
}
