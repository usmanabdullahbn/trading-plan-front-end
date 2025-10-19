// src/config/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyC_DvN41syxWOXOneya7yXxSADZIWMMtUA",

  authDomain: "trading-app-88a1b.firebaseapp.com",

  projectId: "trading-app-88a1b",

  storageBucket: "trading-app-88a1b.firebasestorage.app",

  messagingSenderId: "1019490648936",

  appId: "1:1019490648936:web:a680964a0618e736b0ccdd",

  measurementId: "G-G5R01P71FK",
};

export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
