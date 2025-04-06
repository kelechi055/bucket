'use client';

import BucketItem from "../../components/bucket_item";
import Navbar from "../../components/navbar";
import { Box } from "@mui/material";
import SummerLoader from "../../components/summerLoader";
import { collection, addDoc } from "firebase/firestore";
import { auth } from "/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { db } from "/firebase";
import React, { useState, useEffect, useRef } from "react";
import '@fontsource/fredoka';
import { FaEdit } from "react-icons/fa";

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

  const [parsedList, setParsedList] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const anchorRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({ ...prev, [name]: value }));
  };

  const removeElement = (indexToRemove) => {
    setParsedList((prevList) =>
      prevList.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!auth.currentUser) {
      try {
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
      } catch (error) {
        setError("Could not sign in. Please try again.");
        setLoading(false);
        return;
      }
    }

    const user = auth.currentUser;

    if (user) {
      try {
        const response = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userInfo }),
        });

        const data = await response.json();

        if (response.ok) {
          const bucketItems = parseBucketItems(data.bucketList);
          setParsedList(bucketItems);

          // scroll to anchor after setting list
          setTimeout(() => {
            if (anchorRef.current) {
              anchorRef.current.scrollIntoView({ behavior: "smooth" });
            }
          }, 100);

          await addDoc(collection(db, "bucketLists"), {
            userInfo,
            bucketItems,
            timestamp: new Date().toISOString(),
            userId: user.uid,
          });
        } else {
          setError(data.error || "Error generating bucket list.");
        }
      } catch {
        setError("An error occurred while generating the bucket list.");
      }
    } else {
      setError("User not authenticated — cannot write to Firestore");
  
    // Check if user is authenticated (optional - only to give user feedback)
    const user = auth.currentUser;
    if (!user) {
      console.log("User not authenticated.");
      setError("You need to sign in first.");
      setLoading(false);
      return;
    }
  
    try {
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
      } else {
        setError(
          data.error || "An error occurred while generating the bucket list."
        );
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      setError("An error occurred while generating the bucket list.");
    }

    setLoading(false);
  };

  const handleSave = async () => {
    setLoading(true);
    const user = auth.currentUser;
    if (user && parsedList.length > 0) {
      try {
        await addDoc(collection(db, "bucketLists"), {
          userInfo,
          bucketItems: parsedList,
          timestamp: new Date().toISOString(),
          userId: user.uid,
        });
      } catch {
        setError("Error saving bucket list.");
      }
    } else {
      setError("No bucket items to save or user not authenticated.");
    }
    setLoading(false);
  };

  if (loading) return <SummerLoader />;

  return (
    <Box
      sx={{
        backgroundImage: 'url(/generate-bg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh',
        pt: 16,
        pb: 16,
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
                  { label: "Name", name: "name", placeholder: "John Doe", border: "border-pink-400" },
                  { label: "Favorite Activities", name: "interests", placeholder: "Concerts, Fishing, Karaoke, ...", border: "border-yellow-400" },
                  { label: "Location", name: "location", placeholder: "Austin, Texas", border: "border-blue-400" },
                  { label: "Budget", name: "budget", placeholder: "$100 / $500+", border: "border-green-400" },
                  { label: "Solo or Social", name: "solo_or_social", placeholder: "Solo, Group", border: "border-purple-400" },
                  { label: "Transportation", name: "transportation", placeholder: "Bike, Bus, Car", border: "border-cyan-400" },
                  { label: "Max Travel Distance", name: "travel_distance", placeholder: "10 miles, 50 miles, etc.", border: "border-orange-400" },
                  { label: "Available Times", name: "availability", placeholder: "Weekends, Evenings...", border: "border-lime-400" },
                  { label: "Preferred Categories", name: "categories", placeholder: "Outdoor, Food, Art...", border: "border-amber-400" },
                  { label: "Physical Limitations", name: "limitations", placeholder: "None, Knee issues, etc.", border: "border-rose-400" },
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
                      className={`w-full px-4 py-3 bg-gray-100 text-gray-600 rounded-full placeholder-gray-500 focus:outline-none border ${field.border}`}
                    />
                  </div>
                ))}

                <div className="col-span-2">
                  <label className="block text-lg font-semibold text-black mb-2 text-center">
                    Extra Info
                  </label>
                  <input
                    type="text"
                    name="extra_details"
                    value={userInfo.extra_details}
                    onChange={handleInputChange}
                    placeholder="Anything else we should know?"
                    className="w-full px-4 py-3 bg-gray-100 text-gray-600 rounded-full placeholder-gray-500 focus:outline-none border border-sky-400"
                  />
                </div>
              </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-lg font-medium text-gray-700">
                Name:
              </label>
              <input
                type="text"
                name="name"
                value={userInfo.name}
                onChange={handleInputChange}
                className="w-full p-3 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-lg font-medium text-gray-700">
                Interests:
              </label>
              <input
                type="text"
                name="interests"
                value={userInfo.interests}
                onChange={handleInputChange}
                className="w-full p-3 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-lg font-medium text-gray-700">
                Location:
              </label>
              <input
                type="text"
                name="location"
                value={userInfo.location}
                onChange={handleInputChange}
                className="w-full p-3 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-lg font-medium text-gray-700">
                Budget:
              </label>
              <input
                type="text"
                name="budget"
                value={userInfo.budget}
                onChange={handleInputChange}
                className="w-full p-3 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-lg font-medium text-gray-700">
                Solo or Social:
              </label>
              <input
                type="text"
                name="solo_or_social"
                value={userInfo.solo_or_social}
                onChange={handleInputChange}
                className="w-full p-3 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-lg font-medium text-gray-700">
                Transportation:
              </label>
              <input
                type="text"
                name="transportation"
                value={userInfo.transportation}
                onChange={handleInputChange}
                className="w-full p-3 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-lg font-medium text-gray-700">
                Max Travel Distance:
              </label>
              <input
                type="text"
                name="travel_distance"
                value={userInfo.travel_distance}
                onChange={handleInputChange}
                className="w-full p-3 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-lg font-medium text-gray-700">
                Available Times:
              </label>
              <input
                type="text"
                name="availability"
                value={userInfo.availability}
                onChange={handleInputChange}
                className="w-full p-3 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-lg font-medium text-gray-700">
                Preferred Categories:
              </label>
              <input
                type="text"
                name="categories"
                value={userInfo.categories}
                onChange={handleInputChange}
                className="w-full p-3 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-lg font-medium text-gray-700">
                Physical Limitations:
              </label>
              <input
                type="text"
                name="limitations"
                value={userInfo.limitations}
                onChange={handleInputChange}
                className="w-full p-3 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-lg font-medium text-gray-700">
                Extra Info:
              </label>
              <input
                type="text"
                name="extra_details"
                value={userInfo.extra_details}
                onChange={handleInputChange}
                className="w-full p-3 border rounded-md"
              />
            </div>
          </div>

              <button
                type="submit"
                className="w-full p-3 bg-yellow-500 text-white text-xl rounded-md hover:bg-yellow-600"
              >
                Generate Bucket List
              </button>
          <div className="flex w-full justify-between items-center px-4">
            {/* Left spacer */}
            <div className="w-1/3" />

            {/* Centered Generate/Regenerate Button */}
            <div className="flex justify-center w-1/3 mb-6">
              <button
                type="submit"
                className="bg-gradient-to-r from-yellow-400 to-pink-500 text-white font-semibold py-3 px-6 rounded-2xl shadow-lg hover:scale-105 hover:shadow-xl transition-transform duration-300"
              >
                {parsedList.length !== 0 ? "Regenerate" : "Generate"} Bucket
                List
              </button>
            </div>

              <button
                type="button"
                className="w-full p-3 bg-green-500 text-white text-xl rounded-md hover:bg-green-600 mt-4"
                onClick={handleSave}
              >
                Save Bucket List
              </button>
            {/* Right-aligned Save Button */}
            <div className="flex justify-end w-1/3">
              <button
                type="button"
                className={
                  parsedList.length !== 0
                    ? "flex items-center gap-2 px-3 py-1 font-semibold bg-[#43B047] text-white rounded-lg hover:bg-green-600 transition duration-300"
                    : "hidden"
                }
                onClick={handleSave}
              >
                Save
                <FaEdit size={16} />
              </button>
            </div>
          </div>
        </form>

              {error && <p className="mt-4 text-red-500">{error}</p>}
            </form>
        {error && <p className="mt-4 text-red-500">{error}</p>}

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
          </div>
        </div>
        <div id="bucket-anchor">
          {parsedList.map((item, index) => {
            return (
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
            );
          })}
        </div>
        {parsedList.length != 0 ? (
          <AddBtn
            setParsedList={setParsedList}
            setBucketList={setBucketList}
            setLoading={setLoading}
            setError={setError}
            parsedList={parsedList}
          />
        ) : (
          ""
        )}
      </div>
    </Box>
  );
}
