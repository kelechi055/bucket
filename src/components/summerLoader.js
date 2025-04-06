import React from "react";

export default function SummerLoader() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-yellow-50 text-orange-500">
      <div className="relative w-24 h-24 mb-6">
        {/* Spinning sun */}
        <div className="absolute inset-0 flex items-center justify-center animate-spin text-6xl text-yellow-400">
          🌞
        </div>
        {/* Pinging wave */}
        <div className="absolute inset-0 flex items-center justify-center animate-ping text-6xl opacity-30">
          🌊
        </div>
      </div>
      <p className="text-lg font-semibold animate-bounce">
        Crafting your summer adventure...
      </p>
    </div>
  );
}
