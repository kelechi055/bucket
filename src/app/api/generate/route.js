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
      You are an intelligent activity planner AI that helps users build personalized bucket lists. 
      The user has submitted a form with their preferences. Based on this data, recommend a list of activities 
      and local events that align with their interests, location, and availability. 
      Include a mix of realistic options and at least one fun or unexpected "surprise me" suggestion.

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
      1. Generate 5–7 personalized activity suggestions
      2. Include variety across activity types (e.g. solo vs. social, active vs. chill)
      3. Highlight anything that matches local events or venues (assume API-backed)
      4. End with one surprise idea based on their vibe
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
