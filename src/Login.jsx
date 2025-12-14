import { signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider } from './firebase.js';

function Login() {
  const user = auth.currentUser;

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      console.log('Signed in successfully!', user.displayName);

    } catch (error) {
      console.error('Google Sign-In Error:', error.code, error.message);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      console.log('Signed out successfully!');
    } catch (error) {
      console.error('Sign-Out Error:', error.message);
    }
  };

  return (
    <div>
      {console.log(user)}

      {user ? (
        <div>
          <h3>Welcome, **{user.displayName}**!</h3>
          <p>Email: {user.email}</p>
          <button onClick={handleSignOut}>Sign Out</button>
        </div>
      ) : (
        <button onClick={handleGoogleSignIn}>
          Sign in with Google
        </button>
      )}
    </div>
  );
}

export default Login;