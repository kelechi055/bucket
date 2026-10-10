import { mapsSearchUrl } from "../lib/list-planning";
import { FaMapMarkerAlt, FaTrashAlt } from "react-icons/fa";

export default function BucketItem({ title, description, rating, difficulty, tags, location, website, cuisine, destination, onClick }) {
  const mapUrl = mapsSearchUrl({ title, location }, destination);
  return (
    <article className="my-3 w-full rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          {cuisine && <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-amber-800">{cuisine}</p>}
          <h2 className="break-words text-lg font-bold leading-snug text-gray-950">{title}</h2>
        </div>
        {onClick && <button type="button" onClick={onClick} aria-label={`Remove ${title}`} className="shrink-0 rounded-lg p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-700"><FaTrashAlt size={15} /></button>}
      </div>
      <p className="mt-2 break-words text-sm leading-relaxed text-gray-600">{description}</p>
      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
        {rating != null && <span className="rounded-full bg-amber-50 px-2.5 py-1 font-medium text-amber-900">Match: {rating}/10</span>}
        {difficulty != null && <span className="rounded-full bg-gray-100 px-2.5 py-1 text-gray-600">Difficulty: {difficulty}</span>}
        {tags?.map((tag, index) => <span key={index} className="rounded-full bg-gray-100 px-2.5 py-1 font-medium text-gray-600">{tag}</span>)}
      </div>
      <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 border-t border-gray-100 pt-3 text-sm">
        {mapUrl && <a href={mapUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 font-semibold text-amber-800 hover:underline"><FaMapMarkerAlt size={13} />View on map ↗</a>}
        {website && <a href={website} target="_blank" rel="noopener noreferrer" className="font-medium text-gray-600 hover:underline">Menu & details ↗</a>}
      </div>
    </article>
  );
}
