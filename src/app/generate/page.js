"use client";

import BucketItem from "../../components/bucket_item";
import Navbar from "../../components/navbar";
import { Box } from "@mui/material";
import SummerLoader from "../../components/summerLoader";
import { SignInButton, useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { saveBucketList } from "../../lib/saved-lists";
import React, { useState, useRef } from "react";
import "@fontsource/fredoka";
import { FaEdit } from "react-icons/fa";
import AddBtn from "../../components/add_input";

function parseBucketItems(rawString) {
  const cleaned = rawString.replace(/```json\s*|\s*```/g, "");
  try {
    return JSON.parse(cleaned);
  } catch (error) {
    console.error("Failed to parse bucket items:", error);
    return [];
  }
}

export default function GenerateBucketPage() {
  const [userInfo, setUserInfo] = useState({
    name: "",
    interests: "",
    location: "",
    budget: "",
    solo_or_social: "",
    transportation: "",
    travel_distance: "",
    availability: "",
    categories: "",
    limitations: "",
    extra_details: "",
  });

  const { userId, getToken, isLoaded } = useAuth();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [parsedList, setParsedList] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const anchorRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSaved(false);
    setUserInfo((prev) => ({ ...prev, [name]: value }));
  };

  const removeElement = (indexToRemove) => {
    setSaved(false);
    setParsedList((prevList) =>
      prevList.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    setSaved(false);

    try {
      // Call the API to generate the bucket list
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userInfo }),
      });

      const data = await response.json();

      if (response.ok) {
        const bucketItems = parseBucketItems(data.bucketList);
        setParsedList(bucketItems); // Store the generated bucket items

        // Scroll to the generated bucket list
        setTimeout(() => {
          if (anchorRef.current) {
            anchorRef.current.scrollIntoView({ behavior: "smooth" });
          }
        }, 100);

      } else {
        setError(
          data.error || "An error occurred while generating the bucket list."
        );
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      setError("An error occurred while generating the bucket list. Please try again.");
    }

    setLoading(false);
  };

  const handleSave = async () => {
    setError(null);
    if (!userId || !parsedList.length) {
      setError("Sign in and generate a list before saving.");
      return;
    }
    setSaving(true);
    try {
      await saveBucketList(userId, getToken, userInfo, parsedList);
      setSaved(true);
    } catch (err) {
      console.error("Error saving bucket list:", err);
      setError(err.message || "Unable to save your list. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <SummerLoader />;

  return (
    <Box
      sx={{
        backgroundImage: "url(/generate-bg2.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "110vh",
        py: 12,
      }}
    >
      <div className="min-h-screen">
        <div className="font-fredoka max-w-2xl mx-auto p-6 mb-32 bg-white/70 rounded-lg shadow-md">
          <Navbar />
          <div className="mt-0">
            <h1 className="text-5xl font-bold text-center text-black mb-6">
              Generate Your Bucket List
            </h1>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  {
                    label: "Name",
                    name: "name",
                    placeholder: "John Doe",
                    border: "border-pink-400",
                  },
                  {
                    label: "Favorite Activities",
                    name: "interests",
                    placeholder: "Concerts, Fishing, Karaoke, ...",
                    border: "border-yellow-400",
                  },
                  {
                    label: "Location",
                    name: "location",
                    placeholder: "Austin, Texas",
                    border: "border-blue-400",
                  },
                  {
                    label: "Budget",
                    name: "budget",
                    placeholder: "$100 / $500+",
                    border: "border-green-400",
                  },
                  {
                    label: "Solo or Social",
                    name: "solo_or_social",
                    placeholder: "Solo, Group",
                    border: "border-purple-400",
                  },
                  {
                    label: "Transportation",
                    name: "transportation",
                    placeholder: "Bike, Bus, Car",
                    border: "border-cyan-400",
                  },
                  {
                    label: "Max Travel Distance",
                    name: "travel_distance",
                    placeholder: "10 miles, 50 miles, etc.",
                    border: "border-orange-400",
                  },
                  {
                    label: "Available Times",
                    name: "availability",
                    placeholder: "Weekends, Evenings...",
                    border: "border-lime-400",
                  },
                  {
                    label: "Preferred Categories",
                    name: "categories",
                    placeholder: "Outdoor, Food, Art...",
                    border: "border-amber-400",
                  },
                  {
                    label: "Physical Limitations",
                    name: "limitations",
                    placeholder: "None, Knee issues, etc.",
                    border: "border-rose-400",
                  },
                ].map((field) => (
                  <div key={field.name}>
                    <label className="block text-lg font-semibold text-black mb-2">
                      {field.label}
                    </label>
                    <input
                      type="text"
                      name={field.name}
                      value={userInfo[field.name]}
                      onChange={handleInputChange}
                      placeholder={field.placeholder}
                      className={`w-full px-4 py-3 bg-gray-100 text-black font-bold text-lg rounded-full placeholder-gray-400 focus:outline-none border ${field.border}`}
                    />
                  </div>
                ))}
              </div>

              <button
                type="submit"
                className="w-full p-3 bg-yellow-500 text-white text-xl rounded-md hover:bg-yellow-600"
              >
                Generate Bucket List
              </button>

              {parsedList.length > 0 && (
                userId ? (
                  <button
                    type="button"
                    disabled={saving || saved || !isLoaded}
                    className="w-full p-3 bg-green-500 text-white text-xl rounded-md hover:bg-green-600 mt-4 disabled:opacity-60"
                    onClick={handleSave}
                  >
                    {saving ? "Saving..." : saved ? "List Saved" : "Save Bucket List"}
                  </button>
                ) : (
                  <SignInButton mode="modal">
                    <button type="button" className="w-full p-3 bg-green-500 text-white text-xl rounded-md mt-4">
                      Sign in to save your list
                    </button>
                  </SignInButton>
                )
              )}
              {saved && (
                <p role="status" className="text-green-800">
                  Your list is saved. <Link href="/save" className="underline">View saved lists</Link>
                </p>
              )}

              {error && <p className="mt-4 text-red-500">{error}</p>}
            </form>

            <div id="bucket-anchor" ref={anchorRef}>
              {parsedList.map((item, index) => (
                <BucketItem
                  key={index}
                  title={item.title}
                  description={item.description}
                  tags={item.tags}
                  rating={item.rating}
                  difficulty={item.difficulty}
                  location={item.location}
                  onClick={() => removeElement(index)}
                />
              ))}
            </div>

            {parsedList.length !== 0 && (
              <AddBtn
                setParsedList={(value) => { setSaved(false); setParsedList(value); }}
                setBucketList={() => {}}
                setLoading={setLoading}
                setError={setError}
                parsedList={parsedList}
              />
            )}
          </div>
        </div>
      </div>
    </Box>
  );
}
