"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup, Tooltip, useMap } from "react-leaflet";
import { orderedStopIndices, safeWebUrl, stopQuery } from "../../lib/list-planning";
import "leaflet/dist/leaflet.css";

const foundPlaces = new Map();
function FitStops({ points }) {
  const map = useMap();
  useEffect(() => {
    if (points.length === 1) map.setView([points[0].lat, points[0].lng], 14);
    else if (points.length > 1) map.fitBounds(points.map((point) => [point.lat, point.lng]), { padding: [35, 35], maxZoom: 15 });
  }, [map, points]);
  return null;
}

export default function ListMap({ list }) {
  const signature = JSON.stringify(orderedStopIndices(list).map((index) => ({ index, title: list.bucketItems[index].title, location: list.bucketItems[index].location, query: stopQuery(list.bucketItems[index], list.destination || list.userInfo?.location) })));
  const [result, setResult] = useState({ signature: "", points: [], missing: [], loading: true });
  const entries = JSON.parse(signature);
  useEffect(() => {
    const controller = new AbortController();
    const requested = JSON.parse(signature);
    const points = [], missing = [];
    async function locate() {
      for (const [position, entry] of requested.entries()) {
        if (controller.signal.aborted) return;
        try {
          let place = foundPlaces.get(entry.query);
          if (!place) {
            const response = await fetch("/api/geocode", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ query: entry.query }), signal: controller.signal });
            if (!response.ok) throw new Error("Unable to locate");
            ({ place } = await response.json());
            if (place) foundPlaces.set(entry.query, place);
          }
          if (place) points.push({ ...entry, ...place, position: position + 1 });
          else missing.push(entry);
        } catch { if (controller.signal.aborted) return; missing.push(entry); }
        setResult({ signature, points: [...points], missing: [...missing], loading: position < requested.length - 1 });
      }
      if (!requested.length) setResult({ signature, points: [], missing: [], loading: false });
    }
    locate();
    return () => controller.abort();
  }, [signature]);
  const current = result.signature === signature ? result : { points: [], missing: [], loading: true };
  return <section className="mb-5 overflow-hidden rounded-2xl border border-stone-200 bg-white">
    <div className="p-4"><h3 className="font-bold">Your stops on a map</h3><p className="mt-1 text-xs text-stone-500">Pins use place-name matches. Check the matched address before you travel.</p>{current.loading && <p role="status" className="mt-2 text-sm text-amber-800">Locating stops… {current.points.length + current.missing.length} / {entries.length}</p>}</div>
    <div className="relative z-0 h-96"><MapContainer center={[39.5, -98.35]} zoom={4} scrollWheelZoom={false} style={{ height: "100%", width: "100%" }}>
      <TileLayer url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' />
      <FitStops points={current.points} />
      {current.points.map((point) => <CircleMarker key={point.index} center={[point.lat, point.lng]} radius={13} pathOptions={{ color: "#92400e", fillColor: "#fbbf24", fillOpacity: 1 }}><Tooltip permanent direction="center" className="bucket-map-number">{point.position}</Tooltip><Popup><strong>{point.title}</strong><p>Matched to: {point.label}</p>{safeWebUrl(point.location) && <a href={point.location} target="_blank" rel="noopener noreferrer">Check in Google Maps ↗</a>}</Popup></CircleMarker>)}
    </MapContainer></div>
    {current.missing.length > 0 && <div className="p-4 text-sm text-stone-500"><p className="mb-2 font-medium">These stops couldn’t be placed:</p><ul className="space-y-1">{current.missing.map((entry) => <li key={entry.index}>{safeWebUrl(entry.location) ? <a href={entry.location} target="_blank" rel="noopener noreferrer" className="text-amber-800 hover:underline">{entry.title} ↗</a> : entry.title}</li>)}</ul></div>}
  </section>;
}
