// import Icon from "../../assets/Images/icon.png";
import Styles from "../../assets/Styles/login.module.css";
import GoogleIcon from "../../assets/Icon/GoogleIcon.jsx";

import { signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider } from '../../firebase.js';


export default function AltLogin() {

  // const user = auth.currentUser; 

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);

      const user = result.user;
      console.log('Signed in successfully!', user.displayName);
      window.location.href = '/habit';
    } catch (error) {
      console.error('Google Sign-In Error:', error.code, error.message);
    }
  };

  return (
    <>
      <div className={Styles["alt-login"]}>
        <button className={Styles["google-btn"]} onClick={handleGoogleSignIn}> <GoogleIcon width="2.5rem" height="2.5rem" /></button>
      </div>
    </>
  );
}
