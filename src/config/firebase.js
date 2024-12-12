import { GoogleAuthProvider, getAuth } from "firebase/auth";

import { getAnalytics } from "firebase/analytics";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCjyyceFjxJpFUZQq1lMKdbng4uTpjA6P4",
  authDomain: "eproprietar-6ccbf.firebaseapp.com",
  projectId: "eproprietar-6ccbf",
  storageBucket: "eproprietar-6ccbf.appspot.com",
  messagingSenderId: "173145553550",
  appId: "1:173145553550:web:595589c4008f8e7b27e7df",
  measurementId: "G-6ZTSNX1EPB",
};
console.log(
  "process.env.NEXT_PUBLIC_FIREBASE_API_KEY",
  "AIzaSyCjyyceFjxJpFUZQq1lMKdbng4uTpjA6P4",
);
// Initialize Firebase
initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const auth = getAuth();
export const googleAuth = new GoogleAuthProvider();
