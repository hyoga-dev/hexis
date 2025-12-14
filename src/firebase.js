// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import {
  getFirestore,
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
} from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBYFL2_tGxMTkOgs2326-1-aLq26UBl-2s",
  authDomain: "hexis-ca21c.firebaseapp.com",
  projectId: "hexis-ca21c",
  storageBucket: "hexis-ca21c.firebasestorage.app",
  messagingSenderId: "671529564556",
  appId: "1:671529564556:web:c39de4386a6ed09d54fea9",
  measurementId: "G-2H47L76FQG",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Auth and Provider services
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Initialize Firestore with offline persistence enabled
// This replaces the standard `export const db = getFirestore(app);`
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager(),
  }),
});
