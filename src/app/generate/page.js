"use client";
import BucketItem from "../../components/bucket_item";
import Navbar from "../../components/navbar";
import SummerLoader from "../../components/summerLoader";
import { collection, addDoc } from "firebase/firestore";
import { auth } from "/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { db } from "/firebase";
import React, { useState, useEffect, useRef } from "react";
import AddBtn from "../../components/add_input.js";
import { element } from "prop-types";
import { FaEdit } from "react-icons/fa";

function parseBucketItems(rawString) {
  // Remove the ```json wrapper
  const cleaned = rawString.replace(/```json\s*|\s*```/g, "");

  // Parse JSON
  try {
    const bucketItems = JSON.parse(cleaned);
    return bucketItems;
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

  const [bucketList, setBucketList] = useState(null);
  const [parsedList, setParsedList] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const isFirstRender = useRef(true);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return; // skip running on first render
    }

    const anchor = document.getElementById("bucket-anchor");
    if (anchor) {
      anchor.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [loading]);

  const removeElement = (indexToRemove) => {
    setParsedList((prevList) =>
      prevList.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
  
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
  
  

  // Save button handler
  const handleSave = async () => {
    setLoading(true);
  
    // Check if user is authenticated before saving
    const user = auth.currentUser;
    if (!user) {
      console.log("User not authenticated.");
      setError("You need to sign in first.");
      setLoading(false);
      return;
    }
  
    if (parsedList.length > 0) {
      try {
        // Save to Firestore under the path /users/{userId}/savedBucketLists
        await addDoc(
          collection(db, `users/${user.uid}/savedBucketLists`), // Path: /users/{userId}/savedBucketLists
          {
            userInfo,
            bucketItems: parsedList,
            timestamp: new Date().toISOString(),
          }
        );
        console.log("Bucket List saved successfully!");
      } catch (error) {
        console.error("Error saving bucket list:", error);
        setError("An error occurred while saving the bucket list.");
      }
    } else {
      setError("No bucket items to save.");
    }
  
    setLoading(false);
  };
  
  
  if (loading) return <SummerLoader />;
  return (
    <div class="bg-[url('/beach_sun_3.png')] bg-cover bg-center bg-repeat-y min-h-screen mt-10 py-40">
      <div className="max-w-4xl mx-auto px-9 py-17 mb-30 bg-white/60 rounded-lg shadow-md">
        <Navbar />
        <h1 className="text-3xl font-bold text-center text-gray-700 mb-6">
          Generate Your Bucket List
        </h1>

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
    </div>
  );
}
