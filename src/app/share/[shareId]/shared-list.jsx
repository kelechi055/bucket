"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bookmark } from "lucide-react";
import BucketItem from "../../../components/bucket_item";
import { loadSharedList } from "../../../lib/saved-lists";

export default function SharedList({ shareId }) {
  const [result, setResult] = useState({ loading: true, list: null, error: "" });
  useEffect(() => {
    let active = true;
    loadSharedList(shareId).then((list) => { if (active) setResult({ loading: false, list, error: "" }); }, (failure) => {
      if (active) setResult({ loading: false, list: null, error: failure.code === "permission-denied" ? "This link is unavailable. It may have been disabled or deleted." : "Unable to load this list. Check your connection and try again." });
    });
    return () => { active = false; };
  }, [shareId]);
  return <main className="min-h-screen bg-[#fffbf2] px-4 py-12 text-stone-950"><div className="mx-auto max-w-3xl">
    <Link href="/" className="text-lg font-bold text-amber-900">bucket.</Link>
    {result.loading ? <p role="status" className="mt-12">Loading shared list…</p> : result.list ? <>
      <header className="mb-8 mt-10 rounded-3xl border border-amber-200 bg-amber-50 p-7"><Bookmark className="mb-4 text-amber-800" aria-hidden="true" /><p className="text-xs font-semibold uppercase tracking-widest text-amber-800">Shared adventure · read-only copy</p><h1 className="mt-3 break-words text-4xl font-bold">{result.list.title}</h1><p className="mt-3 text-sm text-stone-500">{result.list.bucketItems.length} stops to discover</p></header>
      {result.list.bucketItems.map((item, index) => <BucketItem key={index} {...item} />)}
      <Link href="/guides" className="mt-8 inline-block rounded-xl bg-amber-300 px-5 py-3 font-semibold text-amber-950">Find your next adventure →</Link>
    </> : <section className="mt-12 rounded-3xl border border-stone-200 bg-white p-8"><h1 className="text-2xl font-bold">List unavailable</h1><p role="alert" className="mt-3 text-stone-500">{result.error || "This link is invalid or no longer available."}</p><Link href="/guides" className="mt-5 inline-block font-semibold text-amber-800">Explore city guides →</Link></section>}
  </div></main>;
}
