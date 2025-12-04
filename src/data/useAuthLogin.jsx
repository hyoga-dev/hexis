import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase.js'; // Import auth
/**
 * Custom Hook to track and return the current Firebase User object.
 */
export function useAuthLogin() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Subscribe to the authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    // 2. Unsubscribe when the component unmounts
    return () => unsubscribe();
  }, []); // Run only on mount and unmount

  return { currentUser, loading };
}