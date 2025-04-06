"use client";
import React, { useState, useEffect } from "react";
import BucketItem from "@/components/bucket_item";
import Navbar from "@/components/navbar";
import AddBtn from "@/components/add_input.js";
import SummerLoader from "@/components/summerLoader";
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

function manualAdd() {
  return (
    <>
      <input className="w-full p-3 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"></input>
    </>
  );
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  useEffect(() => {
    const anchor = document.getElementById("bucket-anchor");
    if (anchor) {
      anchor.scrollIntoView({
        behavior: "smooth",
        block: "start", // aligns the top of the element with the top of the scroll area
      });
    }
  }, [loading]);

  const removeElement = (indexToRemove) => {
    setParsedList((prevList) =>
      prevList.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleSubmit = async (e) => {
    setParsedList([]); //reset the list
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userInfo }),
      });

      const data = await response.json();
      setBucketList(data);

      if (response.ok) {
        var bucketItems = parseBucketItems(data.bucketList);
        bucketItems.map((item, index) => {
          //console.log(`Item ${index + 1}:`);
          Object.entries(item).forEach(([key, value]) => {
            //console.log(`  ${key}: ${value}`);
          });
        });
        setParsedList(bucketItems);
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

  if (loading) return <SummerLoader />;
  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
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
      {parsedList.length != 0 ? <AddBtn /> : ""}
    </div>
  );
}
