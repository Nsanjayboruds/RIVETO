import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY || 'dummy',
  authDomain:
    import.meta.env.VITE_FIREBASE_AUTHDOMAIN ||
    'logine-commerce-84eac.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECTID || 'logine-commerce-84eac',
  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGEBUCKET ||
    'logine-commerce-84eac.appspot.com',
  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGINGSENDERID || '664687446429',
  appId:
    import.meta.env.VITE_FIREBASE_APPID ||
    '1:664687446429:web:087cfca37f64fd923a4774',
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
