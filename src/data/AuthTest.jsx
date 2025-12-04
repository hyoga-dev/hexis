// src/AuthTest.jsx
import { useAuth } from './hooks/useAuth';
import Login from './Login';

function AuthTest() {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <h1>Loading Authentication...</h1>;
  }

  return (
    <div>
      {currentUser ? (
        // Display protected content for logged-in users
        <h1>Hello, {currentUser.displayName}! You are authenticated.</h1>
      ) : (
        // Show the login component
        <Login />
      )}
    </div>
  );
}

export default AuthTest;