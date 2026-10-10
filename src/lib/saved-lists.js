import { collection, addDoc, getDocs, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { signInWithCustomToken } from "firebase/auth";
import { auth, db } from "../../firebase";

async function connectUser(userId, getToken) {
  if (!userId) throw new Error("Sign in to access your saved lists.");
  await auth.authStateReady();
  if (auth.currentUser?.uid === userId) return;

  let token;
  const template = process.env.NEXT_PUBLIC_CLERK_FIREBASE_TEMPLATE;
  if (template) {
    token = await getToken({ template });
  } else {
    const response = await fetch("/api/firebase-token", { method: "POST" });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Unable to connect your account.");
    token = data.token;
  }
  if (!token) throw new Error("Unable to connect your account.");
  const credentials = await signInWithCustomToken(auth, token);
  if (credentials.user.uid !== userId) {
    await auth.signOut();
    throw new Error("Your saved-list account does not match your sign-in. Please contact support.");
  }
}

export async function saveBucketList(userId, getToken, userInfo, bucketItems, metadata = {}) {
  await connectUser(userId, getToken);
  return addDoc(collection(db, "users", userId, "savedBucketLists"), {
    userInfo,
    bucketItems,
    timestamp: new Date().toISOString(),
    title: metadata.title || "",
    sourceGuideId: metadata.sourceGuideId || "",
  });
}

export async function loadBucketLists(userId, getToken) {
  await connectUser(userId, getToken);
  const snapshot = await getDocs(collection(db, "users", userId, "savedBucketLists"));
  return snapshot.docs
    .map((doc) => ({ ...doc.data(), id: doc.id }))
    .sort((a, b) => dateMillis(b.timestamp) - dateMillis(a.timestamp));
}

export async function deleteBucketList(userId, getToken, listId) {
  await connectUser(userId, getToken);
  await deleteDoc(doc(db, "users", userId, "savedBucketLists", listId));
}

export async function renameBucketList(userId, getToken, listId, title) {
  const trimmed = title.trim();
  if (!trimmed || trimmed.length > 100) throw new Error("Use a list name between 1 and 100 characters.");
  await connectUser(userId, getToken);
  await updateDoc(doc(db, "users", userId, "savedBucketLists", listId), { title: trimmed });
  return trimmed;
}

export async function setActivityComplete(userId, getToken, listId, index, completed) {
  if (!Number.isInteger(index) || index < 0) throw new Error("Invalid activity.");
  await connectUser(userId, getToken);
  await updateDoc(doc(db, "users", userId, "savedBucketLists", listId), {
    [`completedItems.${index}`]: Boolean(completed),
  });
}

export function dateMillis(value) {
  const millis = value?.toMillis ? value.toMillis() : new Date(value).getTime();
  return Number.isFinite(millis) ? millis : 0;
}
