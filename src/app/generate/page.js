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
    <div className="max-w-3xl mx-auto p-6 my-30 bg-white rounded-lg shadow-md">
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

        <button
          type="submit"
          className="w-full p-3 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
        >
          Generate Bucket List
        </button>
      </form>

      {/* Save button */}
      <button
        type="button"
        className={
          parsedList.length != 0
            ? "w-full p-3 bg-green-500 text-white rounded-md hover:bg-green-600 mt-4"
            : "hidden"
        }
        onClick={handleSave}
      >
        Save Bucket List
      </button>

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
  );
}
