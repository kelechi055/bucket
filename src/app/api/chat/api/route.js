import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request) {
    if (!process.env.NEXT_GEMINI_API_KEY) {
        return NextResponse.json({ error: "Gemini API key not found" }, { status: 500 });
    }

    const { userInfo } = await request.json();

    if (!userInfo) {
        return NextResponse.json({ error: "No user info provided" }, { status: 400 });
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
        extra_details
    } = userInfo;

    const genAI = new GoogleGenerativeAI(process.env.NEXT_GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
You are an intelligent activity planner AI that helps users build personalized bucket lists. The user has submitted a form with their preferences. Based on this data, recommend a list of activities and local events that align with their interests, location, and availability. Include a mix of realistic options and at least one fun or unexpected "surprise me" suggestion.

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

You don’t need to ask the user anything — just return results as a clean list with short explanations.
    `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        return NextResponse.json({ bucketList: text });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
