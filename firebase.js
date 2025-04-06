import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { getAuth, signInWithCustomToken } from "firebase/auth";

// Your Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyCWFsEWEBcXnIwX0xtYs_wS3M89IYPdUyo",
  authDomain: "sunnylist-1f5a2.firebaseapp.com",
  projectId: "sunnylist-1f5a2",
  storageBucket: "sunnylist-1f5a2.firebasestorage.app",
  messagingSenderId: "805392672421",
  appId: "1:805392672421:web:153bdfb324289e18494f4c",
  measurementId: "G-Q5JHQ2LBLP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, addDoc, collection, auth, signInWithCustomToken };