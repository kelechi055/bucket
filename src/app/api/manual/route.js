import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

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

export async function POST(request) {
  const { description } = await request.json();

  if (!description) {
    return NextResponse.json(
      { error: "No description provided" },
      { status: 400 }
    );
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Gemini API key not found" },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `
        You are an intelligent activity planner AI that helps users build personalized summer bucket lists.
    
    You are given the description of some ones summer bucketlist activity and you are tasked with putting that ONE activity into the proper JSON format.
    
    ✅ Return the response as a **valid JSON array**, with no additional text or explanations — JSON only.
    
The one activity object should have the following keys:
    - title: string – a short, engaging name for the activity
    - location: string - a link to the google maps location of the bucketlist item
    - description: string – a concise and helpful description of the activity
    - rating: number – a float between 1.0 and 10.0 (e.g., 7.5). This should reflect how **well the activity matches the user's preferences** and how **unique or creative** the activity is. 10 = highly personalized and unique, 1 = generic and loosely related.
    - difficulty: string – one of the following: "easy", "medium", "hard", or "epic". Estimate the overall effort required to complete the activity (physical, social, or planning-related).
    - tags: array of strings (generate between 1 and 3 tags) – relevant tags (e.g., ["solo", "chill", "local event", "baseball", "wheelchair accessible"])

Description: ${description}

🎯 Return only one **valid JSON object**, with keys listed above. No extra text, no markdown.
`;

    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash", // Use the correct model version
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    //console.log(response);

    if (!response || !response.text) {
      return NextResponse.json(
        { error: "No valid response from Gemini API" },
        { status: 500 }
      );
    }

    const text = response.candidates[0].content.parts[0].text;
    const tFormatted = parseBucketItems(text);
    console.log(tFormatted);

    return NextResponse.json({ tFormatted }); // now `activity` is an object with your desired fields
  } catch (error) {
    console.error("Error generating event details:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
