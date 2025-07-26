import {
  Auth,
  GoogleAuthProvider,
  browserLocalPersistence,
  getAuth,
  setPersistence,
} from "firebase/auth";
import {
  FirebaseApp,
  getApp,
  getApps,
  initializeApp,
} from "firebase/app";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID!,
};

// Initialize Firebase app once
const app: FirebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Auth & provider
export const auth: Auth = getAuth(app);
export const googleAuth = new GoogleAuthProvider();

// ✅ Create a function to ensure persistence is set
export async function initAuthPersistence() {
  await setPersistence(auth, browserLocalPersistence);
}