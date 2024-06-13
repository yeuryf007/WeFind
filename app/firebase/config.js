import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: proccess.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: proccess.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: proccess.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: proccess.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: proccess.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);