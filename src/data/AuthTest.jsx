import { useAuthLogin } from './useAuthLogin.jsx';
import { auth } from '../firebase.js'; 

import Login from '../Login';

function AuthTest() {
  // console.log(auth.currentUser);
  const { currentUser, loading } = useAuthLogin();

  if (loading) {
    return <h1>Loading Authentication...</h1>;
  }

  return (
    <div>
      {currentUser ? (
        // Display protected content for logged-in users
        <div>
            <h1>Hello, {currentUser.displayName}! You are authenticated.</h1>
            <Login />
        </div>
      ) : (
        // Show the login component
        <Login />
      )}
    </div>
  );
}

export default AuthTest;