import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const requiredEnvVars = [
  "VITE_FIREBASE_API_KEY",
  "VITE_FIREBASE_AUTH_DOMAIN",
  "VITE_FIREBASE_PROJECT_ID",
];

let isFirebaseConfigValid = true;

requiredEnvVars.forEach((key) => {
  if (!import.meta.env[key]) {
    console.error(`Missing Firebase env variable: ${key}`);
    isFirebaseConfigValid = false;
  }
});

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "dummy",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "logine-commerce-84eac.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "logine-commerce-84eac",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "logine-commerce-84eac.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "664687446429",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:664687446429:web:087cfca37f64fd923a4774",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, isFirebaseConfigValid };