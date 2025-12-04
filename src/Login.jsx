import React from 'react';
import { signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider } from './firebase'; // Import from your setup file

function Login() {
  // Check the current user state on component render
  const user = auth.currentUser; 

  const handleGoogleSignIn = async () => {
    try {
      // 1. Call the sign-in function
      const result = await signInWithPopup(auth, googleProvider);
      
      // The user info is available in result.user
      const user = result.user;
      console.log('Signed in successfully!', user.displayName);

    } catch (error) {
      // Handle Errors 
      console.error('Google Sign-In Error:', error.code, error.message);
    }
  };

  const handleSignOut = async () => {
    try {
      // 2. Call the sign-out function
      await signOut(auth);
      console.log('Signed out successfully!');
    } catch (error) {
      console.error('Sign-Out Error:', error.message);
    }
  };

  return (
    <div>
      {user ? (
        // UI when user is logged in
        <div>
          <h3>Welcome, **{user.displayName}**!</h3>
          <p>Email: {user.email}</p>
          <button onClick={handleSignOut}>Sign Out</button>
        </div>
      ) : (
        // UI when user is logged out
        <button onClick={handleGoogleSignIn}>
          Sign in with Google
        </button>
      )}
    </div>
  );
}

export default Login;