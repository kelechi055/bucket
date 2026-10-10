"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { loadBucketLists } from "../../lib/saved-lists";

export function useDetails() {
  const { userId, isLoaded, getToken } = useAuth();
  const [result, setResult] = useState({ userId: null, bucketItems: [], error: null });

  useEffect(() => {
    if (!isLoaded || !userId) return;
    let active = true;
    loadBucketLists(userId, getToken).then(
      (lists) => {
        if (active) setResult({
          userId,
          bucketItems: lists.flatMap((list) => Array.isArray(list.bucketItems) ? list.bucketItems : []),
          error: null,
        });
      },
      (error) => { if (active) setResult({ userId, bucketItems: [], error }); }
    );
    return () => { active = false; };
  }, [isLoaded, userId, getToken]);

  const current = isLoaded && userId && result.userId === userId;
  return {
    bucketItems: current ? result.bucketItems : [],
    error: current ? result.error : null,
  };
}
