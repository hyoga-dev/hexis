import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase.js';
import { useEffect } from 'react';

const LoadingScreen = () => {
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          if (user) {
              window.location.href = '/habit';
          } else {
              window.location.href = '/login';
          }
        });
    
        return () => unsubscribe();
      }, []); 

    return (
        <div className="loading-screen">
            <div className="spinner"></div>
            <p>Loading...</p>
        </div>
    );
}

export default LoadingScreen;