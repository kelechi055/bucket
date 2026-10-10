import { mapsSearchUrl } from "../../../lib/list-planning";
import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

function getApiStatus(error) {
  const status = Number(error?.status ?? error?.code);
  if (Number.isInteger(status) && status >= 400 && status <= 599) {
    return status;
  }
  // @google/genai 0.7 reports the HTTP status in the message.
  const match = error?.message?.match(/got status:\s*(\d{3})\b/);
  return match ? Number(match[1]) : undefined;
}

function isTemporaryError(error) {
  return [429, 500, 502, 503, 504].includes(getApiStatus(error));
}

async function generateWithRetry(ai, params) {
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      return await ai.models.generateContent(params);
    } catch (error) {
      if (!isTemporaryError(error) || attempt === 2) throw error;
      const delay = 1000 * 2 ** attempt + Math.floor(Math.random() * 500);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
}

export async function POST(request) {
  const { userInfo } = await request.json();

  // Check if the user info is valid
  if (!userInfo) {
    return NextResponse.json(
      { error: "No user info provided" },
      { status: 400 }
    );
  }

  const {
    name,
    interests,
    location,
    budget,
    solo_or_social,
    transportation,
    travel_distance,
    availability,
    categories,
    limitations,
    extra_details,
  } = userInfo;

  try {
    // Check if the Gemini API key is available
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Gemini API key not found" },
        { status: 500 }
      );
    }

    // Initialize the GoogleGenAI client
    const ai = new GoogleGenAI({ apiKey });

    // Prepare the prompt for generating the bucket list
    const prompt = `
    You are an intelligent activity planner AI that helps users build personalized summer bucket lists.
    
    The user has submitted a form with their preferences. Based on this data, recommend a list of activities and local events that align with their interests, location, and availability. Include a mix of realistic options and at least one fun or unexpected "surprise me" suggestion.
    
    ✅ Return the response as a **valid JSON array**, with no additional text or explanations — JSON only.
    
    Each activity object should have the following keys:
    - title: string – a short, engaging name for the activity
    - location: string - a full Google Maps search URL: https://www.google.com/maps/search/?api=1&query=URL_ENCODED_PLACE_NAME_AND_CITY. Include the venue or address and city in the query. Never invent a short link or use maps.app.goo.gl, goo.gl, or dynamic links.
    - description: string – a concise and helpful description of the activity
    - rating: number – a float between 1.0 and 10.0 (e.g., 7.5). This should reflect how **well the activity matches the user's preferences** and how **unique or creative** the activity is. 10 = highly personalized and unique, 1 = generic and loosely related.
    - difficulty: string – one of the following: "easy", "medium", "hard", or "epic". Estimate the overall effort required to complete the activity (physical, social, or planning-related).
    - tags: array of strings (generate between 1 and 3 tags) – relevant tags (e.g., ["solo", "chill", "local event", "baseball", "wheelchair accessible"])
    
    Here are the details the user provided:
    - Name: ${name}
    - Interests: ${interests}
    - Location: ${location}
    - Budget: ${budget}
    - Preferred Activity Type: ${solo_or_social}
    - Travel Method: ${transportation}
    - Max Travel Distance: ${travel_distance}
    - Available Times: ${availability}
    - Preferred Categories: ${categories}
    - Physical Limitations: ${limitations}
    - Extra Info: ${extra_details}
    
    Use this information to:
    1. Generate 4-5 personalized activity suggestions
    2. Include variety across activity types (solo vs. social, active vs. chill)
    3. Highlight local events or venues when appropriate
    4. End the list with one unique "surprise me" idea based on the user's vibe; do not label it suprise me, format same as all other titles.
    
    Repeat: Output **only a valid JSON array** of activity objects, no markdown, no commentary only use [ {"key": "value"}] NOTHING ELSE!
    `;

    // Generate the bucket list using Gemini API
    const response = await generateWithRetry(ai, {
      model: process.env.GEMINI_MODEL || "gemini-3.8-flash",
      contents: prompt,
    });

    if (!response || !response.text) {
      return NextResponse.json(
        { error: "No valid response from Gemini API" },
        { status: 500 }
      );
    }

    // Send the generated bucket list as a response
    const items = JSON.parse(response.text.replace(/```json\s*|\s*```/g, ""));
    if (!Array.isArray(items) || items.some((item) => !item || typeof item.title !== "string")) throw new Error("Invalid generated activities.");
    const bucketList = JSON.stringify(items.map((item) => ({ ...item, location: mapsSearchUrl(item, location) })));

    return NextResponse.json({ bucketList });
  } catch (error) {
    console.error("Error generating bucket list:", error);
    if (isTemporaryError(error)) {
      return NextResponse.json(
        { error: "The activity generator is temporarily busy. Please try again shortly." },
        { status: 503, headers: { "Retry-After": "10" } }
      );
    }
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
