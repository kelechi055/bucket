"use client";

import { useState } from "react";
import { SignInButton, useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { ArrowUpRight, Check, Compass, MapPin, Search, Utensils, Bookmark } from "lucide-react";
import Navbar from "../../components/navbar";
import { cityGuides } from "../../data/city-guides";
import { saveBucketList } from "../../lib/saved-lists";

function GuideDetail({ guide, userId, isLoaded, getToken }) {
  const [section, setSection] = useState("sights");
  const [status, setStatus] = useState({ userId: null, busy: false, saved: false, error: "" });
  const current = status.userId === userId ? status : { busy: false, saved: false, error: "" };
  const restaurants = guide.bucketItems.filter((item) => item.tags.includes("Restaurants"));
  const sights = guide.bucketItems.filter((item) => !item.tags.includes("Restaurants"));
  const items = section === "food" ? restaurants : sights;

  async function save() {
    if (!userId || current.busy || current.saved) return;
    setStatus({ userId, busy: true, saved: false, error: "" });
    try {
      await saveBucketList(userId, getToken, { location: `${guide.city}, ${guide.state}` }, guide.bucketItems, { title: guide.title, sourceGuideId: guide.id });
      setStatus({ userId, busy: false, saved: true, error: "" });
    } catch (error) {
      setStatus({ userId, busy: false, saved: false, error: error.message || "Unable to save this guide." });
    }
  }

  const saveClass = "inline-flex items-center justify-center gap-2 rounded-xl bg-gray-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:opacity-50";
  return (
    <section aria-label={`${guide.city} guide`} className="min-w-0 overflow-hidden rounded-3xl border border-amber-200 bg-white shadow-sm">
      <div className="relative overflow-hidden bg-gradient-to-br from-amber-100 via-orange-50 to-white px-6 py-8 sm:p-8">
        <Compass aria-hidden="true" className="pointer-events-none absolute -right-6 -top-6 h-48 w-48 text-amber-200/40" strokeWidth={1} />
        <div className="relative">
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-800"><MapPin size={14} aria-hidden="true" />{guide.state} · City starter guide</p>
          <h2 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">{guide.city}</h2>
          <p className="mt-3 max-w-lg leading-relaxed text-gray-600">{guide.description}</p>
          <div className="mt-5 flex flex-wrap gap-2 text-sm">
            <span className="rounded-full border border-amber-200 bg-white/80 px-3 py-1.5">{sights.length} things to do</span>
            <span className="rounded-full border border-amber-200 bg-white/80 px-3 py-1.5">{restaurants.length} places to eat</span>
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            {!isLoaded ? <button disabled className={saveClass}>Loading…</button> : userId ?
              <button onClick={save} disabled={current.busy || current.saved} className={saveClass}>{current.saved ? <Check size={17} aria-hidden="true" /> : <Bookmark size={17} aria-hidden="true" />}{current.busy ? "Saving…" : current.saved ? "Saved to your lists" : "Save this guide"}</button> :
              <SignInButton mode="modal"><button className={saveClass}><Bookmark size={17} aria-hidden="true" />Sign in to save</button></SignInButton>}
            <a href={guide.source} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm font-medium underline underline-offset-4">Visitor information <ArrowUpRight size={14} aria-hidden="true" /></a>
          </div>
          {current.saved && <Link href="/save" className="mt-3 block text-sm underline">View your saved lists →</Link>}
          {current.error && <p role="alert" className="mt-3 text-sm text-red-700">{current.error}</p>}
        </div>
      </div>
      <div className="p-5 sm:p-8">
        <div className="flex gap-2 rounded-2xl bg-gray-100 p-1.5" aria-label="Guide sections">
          {[{ id: "sights", label: "Things to do", icon: Compass }, { id: "food", label: "Where to eat", icon: Utensils }].map(({ id, label, icon: Icon }) =>
            <button key={id} type="button" aria-pressed={section === id} onClick={() => setSection(id)} className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-semibold transition ${section === id ? "bg-white text-gray-950 shadow-sm" : "text-gray-500 hover:text-gray-950"}`}><Icon size={16} aria-hidden="true" />{label}</button>
          )}
        </div>
        <div className="mt-6 mb-5">
          <h3 className="text-xl font-bold">{section === "food" ? "Five stops worth making time for" : "Start with the city essentials"}</h3>
          <p className="mt-1 text-sm leading-relaxed text-gray-500">{section === "food" ? "A mix of meals and quick bites. Pick what fits your day; these are curated suggestions, not a ranking." : "Mix these stops into your trip at your own pace."}</p>
        </div>
        <ol className="space-y-3">
          {items.map((item, index) => <li key={item.title} className="flex gap-4 rounded-2xl border border-gray-200 bg-white p-4 transition hover:border-amber-300 sm:p-5">
            <span aria-hidden="true" className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-bold ${section === "food" ? "bg-orange-100 text-orange-800" : "bg-amber-100 text-amber-800"}`}>{String(index + 1).padStart(2, "0")}</span>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{item.cuisine || (section === "food" ? "Local food stop" : item.tags[0])}</p>
              <h4 className="mt-1 text-lg font-bold leading-snug">{item.title}</h4>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">{item.description}</p>
              <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
                <a href={item.location} target="_blank" rel="noopener noreferrer" aria-label={`Open ${item.title} in Google Maps`} className="inline-flex items-center gap-1 text-sm font-semibold text-amber-800 hover:underline"><MapPin size={14} aria-hidden="true" />Google Maps<ArrowUpRight size={13} aria-hidden="true" /></a>
                {item.website && <a href={item.website} target="_blank" rel="noopener noreferrer" aria-label={`Menu and visiting details for ${item.title}`} className="inline-flex items-center gap-1 text-sm font-medium text-gray-600 hover:underline">Menu & details<ArrowUpRight size={13} aria-hidden="true" /></a>}
              </div>
            </div>
          </li>)}
        </ol>
        <p className="mt-6 border-t border-gray-100 pt-4 text-xs leading-relaxed text-gray-500">Check current hours, menus, and reservation requirements before visiting. Saving this guide adds all {guide.bucketItems.length} stops to your personal list.</p>
      </div>
    </section>
  );
}

export default function CityGuidesPage() {
  const { userId, isLoaded, getToken } = useAuth();
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(cityGuides[0].id);
  const guides = cityGuides.filter((guide) => `${guide.city} ${guide.state}`.toLowerCase().includes(query.trim().toLowerCase()));
  const selected = guides.find((guide) => guide.id === selectedId) || guides[0];
  return (
    <div className="min-h-screen bg-[#faf8f3] px-4 pb-16 pt-40 text-gray-950 sm:px-6 sm:pt-32">
      <Navbar />
      <main className="mx-auto max-w-6xl">
        <header className="mb-8 sm:mb-10">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-800">Your next adventure</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">A little direction. A lot to discover.</h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-gray-600">Explore {cityGuides.length} U.S. cities with ready-made guides, memorable sights, and five places to eat in every city.</p>
        </header>
        <div className="grid items-start gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
          <aside aria-label="Choose a city" className="rounded-3xl border border-gray-200 bg-white p-4 lg:sticky lg:top-28">
            <label htmlFor="city-search" className="mb-3 block text-sm font-bold">Find your city</label>
            <div className="relative"><Search size={16} aria-hidden="true" className="absolute left-3 top-3.5 text-gray-400" /><input id="city-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="City or state" className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-9 pr-3 text-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-100" /></div>
            <p role="status" className="mb-3 mt-4 text-xs text-gray-500">{guides.length} {guides.length === 1 ? "city" : "cities"} to explore</p>
            <div className="grid max-h-60 grid-cols-2 gap-1 overflow-y-auto sm:grid-cols-3 lg:max-h-[60vh] lg:grid-cols-1">
              {guides.map((guide) => <button key={guide.id} type="button" aria-pressed={selected?.id === guide.id} onClick={() => setSelectedId(guide.id)} className={`rounded-xl px-3 py-3 text-left transition ${selected?.id === guide.id ? "bg-amber-100 text-amber-950" : "hover:bg-gray-50"}`}><span className="block text-sm font-semibold">{guide.city}</span><span className="mt-1 block text-xs text-gray-500">{guide.state}</span></button>)}
            </div>
          </aside>
          {selected ? <GuideDetail key={selected.id} guide={selected} userId={userId} isLoaded={isLoaded} getToken={getToken} /> : <div className="rounded-3xl border border-gray-200 bg-white p-8"><h2 className="text-xl font-bold">No cities found</h2><p className="mt-2 text-gray-600">Try another city or state abbreviation.</p><button onClick={() => setQuery("")} className="mt-4 font-semibold underline">Clear search</button></div>}
        </div>
      </main>
    </div>
  );
}
