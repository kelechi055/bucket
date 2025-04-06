"use client";
import Navbar from "../../components/navbar";


import { AlertCircle } from "lucide-react";


export default function PremiumComingSoon() {
  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-b from-yellow-100 via-orange-200 to-pink-200">
      <Navbar />
      <div className="relative text-center p-10 bg-white/80 rounded-2xl shadow-xl backdrop-blur-md animate-fade-in">
        <div className="absolute inset-0 rounded-2xl bg-pink-400 opacity-20 blur-2xl -z-10"></div>
        <div className="flex flex-col items-center space-y-4">
          <AlertCircle className="w-12 h-12 text-orange-500" />
          <h1 className="text-3xl font-bold text-orange-700">
            Cloud Storage Coming Soon...
          </h1>
          <p className="text-orange-800 max-w-md">
            We’re crafting something sunny and spectacular. Stay tuned for
            premium features that make your summer bucket list even hotter!
          </p>
        </div>
      </div>
    </div>
    )
  }
