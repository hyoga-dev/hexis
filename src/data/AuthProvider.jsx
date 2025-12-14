import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth'; // 1. Import signOut

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isGuest, setIsGuest] = useState(() => sessionStorage.getItem("isGuest") === "true");
  const [loading, setLoading] = useState(true);

  // 2. Define the logout function
  function logout() {
    sessionStorage.removeItem("isGuest");
    setIsGuest(false);
    return signOut(auth);
  }

  function loginAsGuest() {
    if (currentUser) signOut(auth);
    setCurrentUser(null);
    setIsGuest(true);
    sessionStorage.setItem("isGuest", "true");
  }

  useEffect(() => {
    // Updated to standard Firebase v9 modular syntax
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);

      // Only disable guest mode if a real user is detected
      if (user) {
        setIsGuest(false);
        sessionStorage.removeItem("isGuest");
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