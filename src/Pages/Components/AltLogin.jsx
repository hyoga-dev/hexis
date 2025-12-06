// import Icon from "../../assets/Images/icon.png";
import Styles from "../../assets/Styles/login.module.css";
import Google from "../../assets/Images/icon-google.png";
import Facebook from "../../assets/Images/icon-facebook.png";
import Github from "../../assets/Images/icon-github.png";
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
        <img onClick={handleGoogleSignIn} src={Google} className={Styles.icon} />
        <img src={Facebook} className={Styles.icon} />
        <img src={Github} className={Styles.icon} />
      </div>
    </>
  );
}
