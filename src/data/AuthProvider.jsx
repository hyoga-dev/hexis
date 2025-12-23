import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, requestAndSaveToken } from '../firebase'; // Ensure requestAndSaveToken is exported from firebase.js
import { onAuthStateChanged, signOut } from 'firebase/auth';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  // Default to true. We assume Guest until Firebase tells us otherwise.
  const [isGuest, setIsGuest] = useState(true);
  const [loading, setLoading] = useState(true);

  function logout() {
    // Signing out now effectively returns you to the default state (Guest)
    return signOut(auth);
  }

  function loginAsGuest() {
    if (currentUser) signOut(auth);
    setIsGuest(true);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // 1. User Logged In
        setCurrentUser(user);
        setIsGuest(false);

        // 🚀 NEW: Automatically request permission & save token
        // This puts the 'fcmToken' into your Firestore User Document
        requestAndSaveToken(user.uid); 

      } else {
        // 2. User Logged Out / Not Found -> Force Guest Mode
        setCurrentUser(null);
        setIsGuest(true);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    loading,
    logout,
    isGuest,
    loginAsGuest,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}