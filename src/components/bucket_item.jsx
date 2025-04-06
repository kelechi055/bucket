import { FaMapMarkerAlt, FaTrashAlt } from "react-icons/fa";
import { useEffect, useState } from "react";

export default function BucketItem({
  title,
  description,
  rating,
  difficulty,
  tags,
  location,
  onClick,
}) {
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

  const [lnBr, setLnBr] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth < 414) {
      setLnBr(<div className="line-br w-full leading-[1px]"></div>);
    }
  }, []);

  const hashStringToIndex = (str, max) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash) % max;
  };

  return (
    <div className="flex items-start gap-4 p-4 border border-yellow-300 bg-yellow-50 rounded-2xl shadow-sm max-w-3xl w-full my-1.5">
      <a
        href={location}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 mt-1 inline-block"
      >
        <FaMapMarkerAlt
          size={20}
          className="animate-[glow_3s_ease-in-out_infinite] drop-shadow-[0_0_1px_rgba(59,130,246,0.4)]"
        />
      </a>

      <div className="flex-1">
        <h2 className="font-bold text-lg text-black">{title}</h2>

        <div className="flex flex-wrap items-center gap-2 mt-1 mb-2 text-sm">
          <span className="font-semibold text-black">Rating:</span>
          <span className="text-black">{rating}</span>

          <span className="font-semibold text-black ml-4">Difficulty:</span>
          <span className="text-black">{difficulty}</span>

          {lnBr}

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

        <p className="text-gray-800 text-sm">{description}</p>
      </div>

      <div className="flex flex-row items-end gap-3 mt-1">
        <button
          onClick={onClick}
          className="flex items-center gap-1 text-red-600 hover:text-red-700 text-sm font-semi-bold"
        >
          <FaTrashAlt size={17} />
        </button>
      </div>
    </div>
  );
}
