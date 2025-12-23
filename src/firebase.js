// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import {
  getFirestore,
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  doc,
  setDoc
} from "firebase/firestore";
// 1. Tambahkan import Messaging
import { getMessaging, getToken, onMessage } from "firebase/messaging";

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

// Export Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Initialize Firestore dengan Persistence
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager(),
  }),
});

// 2. Initialize Messaging
export const messaging = getMessaging(app);

// 3. Fungsi Helper untuk Request Izin dan Simpan Token
export const requestAndSaveToken = async (userId) => {
  try {
    const permission = await Notification.requestPermission();
    
    if (permission === "granted") {
      const currentToken = await getToken(messaging, {
        // Ganti dengan VAPID KEY dari Firebase Console
        vapidKey: "BLR1-Tg-18MbGq_VeMH0LiMXA9EAp_SC0zjqGx8iXETA08oUKVnizlD1HxarOlCXCMiSsbuMMTcWCv6pl1EJzTU" 
      });

      if (currentToken) {
        // Simpan token ke dokumen user agar backend/GitHub Action bisa baca
        await setDoc(doc(db, "users", userId), {
          fcmToken: currentToken,
          lastUpdated: new Date()
        }, { merge: true });
        
        console.log("FCM Token saved to Firestore");
        return currentToken;
      }
    } else {
      console.log("Notification permission denied");
    }
  } catch (error) {
    console.error("Error getting notification token:", error);
  }
}