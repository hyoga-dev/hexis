import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../firebase'; 
import { onAuthStateChanged, signOut } from 'firebase/auth'; // 1. Import signOut

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 2. Define the logout function
  function logout() {
    return signOut(auth);
  }

  useEffect(() => {
    // Updated to standard Firebase v9 modular syntax
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    loading,
    logout, // 3. Pass logout to the value object so other components can use it
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children} 
    </AuthContext.Provider>
  );
}