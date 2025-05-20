import { Auth, GoogleAuthProvider, browserLocalPersistence, getAuth, setPersistence } from "firebase/auth";
import { FirebaseApp, getApp, getApps, initializeApp } from "firebase/app";

// Firebase config from environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID!,
};

// Initialize Firebase if not already initialized
const app: FirebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Firebase services initialization
export const auth: Auth = getAuth(app);
export const googleAuth = new GoogleAuthProvider();

await setPersistence(auth, browserLocalPersistence);