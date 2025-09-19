
import { initializeApp } from "firebase/app";
import{getAuth, GoogleAuthProvider} from "firebase/auth";

const firebaseConfig = {
  apiKey:import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "logine-commerce-84eac.firebaseapp.com",
  projectId: "logine-commerce-84eac",
  storageBucket: "logine-commerce-84eac.appspot.com", 
  messagingSenderId: "664687446429",
  appId: "1:664687446429:web:087cfca37f64fd923a4774"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const provider=new GoogleAuthProvider()

export { auth, provider}