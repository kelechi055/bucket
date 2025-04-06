"use client";
import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "/firebase";
import Navbar from "../../components/navbar";

export default function SavedBucketLists() {
  const [bucketLists, setBucketLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBucketLists = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "bucketLists"));
        const bucketListsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBucketLists(bucketListsData);
      } catch (error) {
        console.error("Error fetching bucket lists:", error);
        setError("There was an error fetching the saved bucket lists.");
      } finally {
        setLoading(false);
      }
    };

    fetchBucketLists();
  }, []);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <Navbar />
        <h1 className="text-3xl font-bold text-center text-gray-700 mb-6">
          Loading Saved Bucket Lists...
        </h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <Navbar />
        <h1 className="text-3xl font-bold text-center text-gray-700 mb-6">
          Error Loading Bucket Lists
        </h1>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <Navbar />
      <h1 className="text-3xl font-bold text-center text-gray-700 mb-6">
        Saved Bucket Lists
      </h1>

      {bucketLists.length === 0 ? (
        <p className="text-lg text-gray-500">No saved bucket lists yet.</p>
      ) : (
        <div className="space-y-6">
          {bucketLists.map((bucketList) => (
            <div
              key={bucketList.id}
              className="border p-4 rounded-lg shadow-md bg-gray-50"
            >
              <h2 className="text-2xl font-semibold text-gray-700">
                Bucket List for {bucketList.userInfo.name}
              </h2>
              <div className="mt-4">
                <p className="font-medium text-gray-600">Interests:</p>
                <p>{bucketList.userInfo.interests}</p>
              </div>
              <div className="mt-4">
                <p className="font-medium text-gray-600">Location:</p>
                <p>{bucketList.userInfo.location}</p>
              </div>
              <div className="mt-4">
                <p className="font-medium text-gray-600">Categories:</p>
                <p>{bucketList.userInfo.categories}</p>
              </div>
              <div className="mt-4">
                <p className="font-medium text-gray-600">Saved At:</p>
                <p>{new Date(bucketList.timestamp).toLocaleString()}</p>
              </div>
              <div className="mt-4">
                <p className="font-medium text-gray-600">Bucket Items:</p>
                {bucketList.bucketItems && bucketList.bucketItems.length > 0 ? (
                  <ul className="list-disc pl-5">
                    {bucketList.bucketItems.map((item, index) => (
                      <li key={index}>{item.title}</li>
                    ))}
                  </ul>
                ) : (
                  <p>No items in this bucket list.</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
