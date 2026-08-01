import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const requiredFirebaseEnv = [
  'VITE_FIREBASE_APIKEY',
  'VITE_FIREBASE_AUTHDOMAIN',
  'VITE_FIREBASE_PROJECTID',
  'VITE_FIREBASE_STORAGEBUCKET',
  'VITE_FIREBASE_MESSAGINGSENDERID',
  'VITE_FIREBASE_APPID',
];

const missingFirebaseEnv = requiredFirebaseEnv.filter(
  (key) => !import.meta.env[key]
);

if (missingFirebaseEnv.length > 0) {
  // Keep the detailed message out of the DOM to avoid exposing
  // internal environment variable names to end users.
  const devMessage = `Configuration error: missing environment variables (${missingFirebaseEnv.join(
    ', '
  )}). The site owner needs to add these in the hosting dashboard.`;

  // React hasn't mounted yet at this point, so we write directly to the DOM
  // to avoid leaving the user with a silent blank white screen.
  document.body.textContent = `
    <div style="font-family: sans-serif; max-width: 480px; margin: 80px auto; padding: 24px; text-align: center; color: #333;">
      <h2 style="color:#c0392b;">We're currently unavailable</h2>
      <p>This application is temporarily unavailable due to a configuration issue. Please try again later or contact support.</p>
    </div>
  `;

  throw new Error(devMessage);
}

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTHDOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECTID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGEBUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGINGSENDERID,
  appId: import.meta.env.VITE_FIREBASE_APPID,
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };