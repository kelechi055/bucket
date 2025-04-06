// ClientComponent.js (Client Component)
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import firebase from "firebase/app";

export default function ClientComponent() {
  const router = useRouter();

  useEffect(() => {
    // client-side logic
  }, []);

  return <div>Client-side component</div>;
}
