// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
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
const analytics = getAnalytics(app);