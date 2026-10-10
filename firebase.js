import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { getAuth, signInWithCustomToken } from "firebase/auth";

// Your Firebase configuration
import { firebaseConfig } from "./src/lib/firebase-config";

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, addDoc, collection, auth, signInWithCustomToken };

export { firebaseConfig };
