import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

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
    - location: string - a link to the google maps location of the bucketlist item
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
    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash", // Use the correct model version
      contents: prompt,
    });

    if (!response || !response.text) {
      return NextResponse.json(
        { error: "No valid response from Gemini API" },
        { status: 500 }
      );
    }

    // Send the generated bucket list as a response
    const bucketList = response.text;

    return NextResponse.json({ bucketList });
  } catch (error) {
    console.error("Error generating bucket list:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
