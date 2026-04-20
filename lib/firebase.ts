import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDzTHxpTTJw7m__6qXy7wdgM_KyaHvg6oU",
  authDomain: "hamza-portfolio-f885f.firebaseapp.com",
  projectId: "hamza-portfolio-f885f",
  storageBucket: "hamza-portfolio-f885f.firebasestorage.app",
  messagingSenderId: "594500640663",
  appId: "1:594500640663:web:027209d74a77a4223f6ed2",
  measurementId: "G-YC5E1Y1SZM",
};

// Prevent duplicate initialization
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const db = getFirestore(app);
