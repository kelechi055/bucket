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
import { Check, ChevronDown } from "lucide-react";
import AddBtn from "../../components/add_input";

const fieldOrder = ["name", "location", "interests", "budget", "solo_or_social", "transportation", "travel_distance", "availability", "limitations", "categories"];
const choices = {
  budget: ["Free", "Under $25", "$25–$50", "$50–$100", "$100–$250", "$250+", "No preference"],
  solo_or_social: ["Solo", "With friends", "Date / couple", "Family", "Either solo or social"],
  transportation: ["Walking", "Bicycle", "Public transit", "Car", "Rideshare", "No preference"],
  travel_distance: ["Within 1 mile", "Within 5 miles", "Within 10 miles", "Within 25 miles", "Within 50 miles", "Open to a day trip"],
  availability: ["Weekday mornings", "Weekday afternoons", "Weekday evenings", "Weekends", "Anytime"],
  interests: ["Food & cafés", "Live music", "Hiking", "Museums", "Sports", "Nightlife"],
  categories: ["Outdoors", "Food", "Art & culture", "Entertainment", "Wellness", "Shopping"],
};

function PreferenceField({ field, value, onChange }) {
  const [customMode, setCustomMode] = useState(false);
  const [selected, setSelected] = useState([]);
  const [custom, setCustom] = useState("");
  const options = choices[field.name];
  const multiple = field.name === "interests" || field.name === "categories";
  const control = "preference-control w-full rounded-xl border px-4 py-3 text-base font-normal focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600";
  function update(next) { onChange({ target: { name: field.name, value: next } }); }
  function updateMultiple(nextSelected, nextCustom) { update([...nextSelected, nextCustom.trim()].filter(Boolean).join(", ")); }
  const label = "preference-label mb-2 block text-sm font-medium";
  if (multiple) return <fieldset className="preference-group min-w-0 border-y py-5 sm:col-span-2">
    <legend className="preference-label px-1 text-sm font-medium">{field.label}</legend>
    <p className="theme-muted mb-3 text-xs">Pick as many as you like.</p>
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">{options.map((option) => <label key={option} className={`preference-choice relative flex min-h-11 cursor-pointer items-center gap-2 rounded-xl border px-3 py-2.5 text-sm transition focus-within:ring-2 focus-within:ring-amber-500 ${selected.includes(option) ? "is-selected" : ""}`}>
      <input type="checkbox" checked={selected.includes(option)} onChange={(event) => { const next = event.target.checked ? [...selected, option] : selected.filter((entry) => entry !== option); setSelected(next); updateMultiple(next, custom); }} className="sr-only" />
      <span aria-hidden="true" className="preference-check flex h-4 w-4 shrink-0 items-center justify-center rounded border">{selected.includes(option) && <Check size={12} strokeWidth={3} />}</span><span>{option}</span>
    </label>)}</div>
    <label htmlFor={`${field.name}-custom`} className="theme-muted mt-3 block text-xs">Something else? <span className="opacity-80">Optional</span></label><input id={`${field.name}-custom`} value={custom} maxLength={500} onChange={(event) => { setCustom(event.target.value); updateMultiple(selected, event.target.value); }} placeholder="Add your own interests…" className={`${control} mt-1.5`} />
  </fieldset>;
  return <div className="min-w-0"><label htmlFor={field.name} className={label}><span aria-hidden="true" className={`mr-2 inline-block h-1.5 w-1.5 rounded-full ${field.border.replace("border-", "bg-")}`} />{field.label}</label>
    {options ? <><div className="relative"><select id={field.name} name={field.name} value={customMode ? "__custom" : value} onChange={(event) => { const isCustom = event.target.value === "__custom"; setCustomMode(isCustom); update(isCustom ? "" : event.target.value); }} className={`${control} appearance-none pr-10 ${!value && !customMode ? "is-placeholder" : ""}`}>
      <option value="">Choose an option</option>{options.map((option) => <option key={option} value={option}>{option}</option>)}<option value="__custom">Custom…</option>
    </select><ChevronDown size={17} aria-hidden="true" className="theme-muted pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2" /></div>{customMode && <><label htmlFor={`${field.name}-custom`} className="theme-muted mt-3 block text-xs">Your {field.label.toLowerCase()}</label><input id={`${field.name}-custom`} name={field.name} value={value} onChange={onChange} maxLength={500} placeholder={field.placeholder} className={`${control} mt-1.5`} /></>}</> : <input id={field.name} type="text" name={field.name} value={value} onChange={onChange} maxLength={500} placeholder={field.placeholder} className={control} />}
  </div>;

}

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
    <>
    <Navbar />
    <Box
      sx={{
        backgroundImage: "url(/generate-bg2.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "100svh",
        pt: { xs: "calc(96px + env(safe-area-inset-top))", sm: "calc(112px + env(safe-area-inset-top))" },
        pb: 8,
        px: { xs: 2, sm: 3 },
      }}
    >
      <div className="min-h-screen">
        <div className="preference-card font-fredoka max-w-2xl mx-auto p-5 sm:p-8 mb-8 rounded-3xl border shadow-lg">
          <div className="mt-0">
            <h1 className="preference-label text-3xl sm:text-4xl font-semibold text-center mb-2">
              Generate Your Bucket List
            </h1>

            <p className="theme-muted mb-7 text-center text-sm">Choose what you love. We’ll help plan the rest.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-5">
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
                ].sort((a, b) => fieldOrder.indexOf(a.name) - fieldOrder.indexOf(b.name)).map((field) => (
                  <PreferenceField key={field.name} field={field} value={userInfo[field.name]} onChange={handleInputChange} />
                ))}
              </div>

              <button
                type="submit"
                className="w-full min-h-12 p-3 bg-amber-300 text-amber-950 text-base font-semibold rounded-xl hover:bg-amber-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600"
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

            <div id="bucket-anchor" ref={anchorRef} className="scroll-mt-24">
              {parsedList.map((item, index) => (
                <BucketItem
                  key={index}
                  title={item.title}
                  description={item.description}
                  tags={item.tags}
                  rating={item.rating}
                  difficulty={item.difficulty}
                  location={item.location}
                  destination={userInfo.location}
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
    </>
  );
}
