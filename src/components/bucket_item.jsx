import { FaMapMarkerAlt, FaEdit, FaTrashAlt } from "react-icons/fa";

export default function BucketItem({
  title,
  description,
  rating,
  difficulty,
  tags,
}) {
  // Color palette inspired by sunrise/sunset
  const sunsetColors = [
    "bg-pink-400",
    "bg-pink-500",
    "bg-red-400",
    "bg-orange-400",
    "bg-orange-500",
    "bg-yellow-400",
    "bg-rose-400",
    "bg-amber-400",
    "bg-fuchsia-500",
  ];

  // Deterministic string-to-color hashing
  const hashStringToIndex = (str, max) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash) % max;
  };

  return (
    <div className="flex items-start gap-4 p-4 border border-yellow-300 bg-yellow-50 rounded-2xl shadow-sm max-w-3xl w-full">
      {/* Location icon */}
      <div className="text-blue-600 mt-1">
        <FaMapMarkerAlt size={20} />
      </div>

      {/* Main content */}
      <div className="flex-1">
        <h2 className="font-bold text-lg text-black">{title}</h2>

        {/* Metadata row */}
        <div className="flex flex-wrap items-center gap-2 mt-1 mb-2 text-sm">
          <span className="font-semibold text-black">Rating:</span>
          <span className="text-black">{rating}</span>

          <span className="font-semibold text-black ml-4">Difficulty:</span>
          <span className="text-black">{difficulty}</span>

          {/* Tags with hashed color */}
          {tags?.map((tag, idx) => {
            const colorIndex = hashStringToIndex(tag, sunsetColors.length);
            const color = sunsetColors[colorIndex];
            return (
              <span
                key={idx}
                className={`px-2 py-1 rounded-full text-white text-xs font-semibold ${color}`}
              >
                {tag}
              </span>
            );
          })}
        </div>

        {/* Description */}
        <p className="text-gray-800 text-sm">{description}</p>
      </div>

      {/* Subtle icon buttons */}
      <div className="flex flex-col items-end gap-2 mt-1">
        <button className="flex items-center gap-1 text-green-700 hover:text-green-800 text-sm font-medium">
          <FaEdit size={14} />
          edit
        </button>
        <button className="flex items-center gap-1 text-red-600 hover:text-red-700 text-sm font-medium">
          <FaTrashAlt size={14} />
          remove
        </button>
      </div>
    </div>
  );
}
