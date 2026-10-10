import { auth } from "@clerk/nextjs/server";
import { sign } from "node:crypto";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Sign in to access saved lists." }, { status: 401 });

  const email = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
  if (!email || !privateKey) {
    return NextResponse.json({ error: "Saved lists are not configured yet. Please try again later." }, { status: 503 });
  }

  try {
    const now = Math.floor(Date.now() / 1000);
    const encode = (value) => Buffer.from(JSON.stringify(value)).toString("base64url");
    const payload = `${encode({ alg: "RS256", typ: "JWT" })}.${encode({
      iss: email,
      sub: email,
      aud: "https://identitytoolkit.googleapis.com/google.identity.identitytoolkit.v1.IdentityToolkit",
      iat: now,
      exp: now + 300,
      uid: userId,
    })}`;
    const signature = sign("RSA-SHA256", Buffer.from(payload), privateKey).toString("base64url");
    return NextResponse.json({ token: `${payload}.${signature}` }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    console.error("Unable to sign Firebase custom token. Check server credentials.");
    return NextResponse.json({ error: "Unable to connect saved lists. Please try again later." }, { status: 503 });
  }
}
