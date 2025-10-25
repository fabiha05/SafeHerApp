// firebase.js - UPDATED VERSION
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBmPhh5GPJpV4FGzrRGQxNYK7KLDdYSv-8",
  authDomain: "safeher-304d9.firebaseapp.com",
  projectId: "safeher-304d9",
  storageBucket: "safeher-304d9.firebasestorage.app",
  messagingSenderId: "261307771875",
  appId: "1:261307771875:web:bad2fd526ac475c9150ed6",
  measurementId: "G-VRD9FD96MX"
};

// Initialize Firebase only if not already initialized
let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

// Initialize Auth - SIMPLIFIED (persistence will work automatically in React Native)
export const auth = getAuth(app);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Storage
export const storage = getStorage(app);

console.log("✅ Firebase initialized successfully!");