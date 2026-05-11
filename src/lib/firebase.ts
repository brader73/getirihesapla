import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB-tjE6LqlOtIR5B6eO7IZan3qPYv3OJ7k",
  authDomain: "getirihesapla.firebaseapp.com",
  projectId: "getirihesapla",
  storageBucket: "getirihesapla.firebasestorage.app",
  messagingSenderId: "302650331701",
  appId: "1:302650331701:web:9e19949f7bd735feee577c"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { auth, db, googleProvider };
