import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../assets/Styles/global.css";
import Styles from "../assets/Styles/login.module.css";
import Logo from "../assets/Icon/HexisLogoBottom";
import AltLogin from "./Components/AltLogin";
import FormBox from "./Components/FormBox";
import { useAuthLogic } from "../data/userAuth";
import { createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from "firebase/auth";
import { auth } from "../firebase.js";

const PasswordCriteria = ({ password = "" }) => {
  const criteria = [
    { text: "At least 8 characters", regex: /.{8,}/ },
    { text: "At least one uppercase letter (A-Z)", regex: /[A-Z]/ },
    { text: "At least one lowercase letter (a-z)", regex: /[a-z]/ },
    { text: "At least one number (0-9)", regex: /\d/ },
  ];

  return (
    <div style={{ fontSize: '0.8rem', color: 'var(--secondary-font-color)', textAlign: 'left', width: '100%', maxWidth: '350px', marginTop: '15px', padding: '10px', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
      <p style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>Password must contain:</p>
      <ul style={{ margin: 0, paddingLeft: '20px' }}>
        {criteria.map(item => (
          <li key={item.text} style={{ color: item.regex.test(password) ? '#4caf50' : 'inherit', transition: 'color 0.3s' }}>
            {item.text}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default function Register() {
  const { formData, handleChange } = useAuthLogic(true);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const navigate = useNavigate();

  const handleBlur = (e) => {
    // Check if the new focused element is NOT a child of the current target (the wrapper div).
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsPasswordFocused(false);
    }
  };

  const handleRegistration = async (e) => {
    e.preventDefault();

    const password = formData.password || "";
    const confirmPassword = formData.confirmPassword || "";

    // Password validation criteria
    const isLengthValid = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);

    if (!isLengthValid || !hasUppercase || !hasLowercase || !hasNumber) {
      alert("Please ensure your password meets all the required criteria.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match. Please check again.");
      return;
    }

    try {
      // 1. Create User
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, password);
      const user = userCredential.user;

      // 2. Generate Name (from email) & Avatar (DiceBear)
      const nameFromEmail = formData.email.split('@')[0];
      const randomSeed = Math.random().toString(36).substring(7) + Date.now();
      const newAvatar = `https://api.dicebear.com/9.x/avataaars/svg?seed=${randomSeed}&backgroundColor=b6e3f4,c0aede,d1d4f9`;

      // 3. Update Profile
      await updateProfile(user, {
        displayName: nameFromEmail,
        photoURL: newAvatar
      });

      // 4. Send Verification & Redirect
      await sendEmailVerification(user);
      alert("Registration successful! A verification link has been sent to your email.");
      navigate("/login");
    } catch (error) {
      console.error("Registration Error:", error);
      alert(error.message);
    }
  };

  return (
    <div className={Styles.pageWrapper}>
      <div className={Styles.container}>
        <Logo
          width="22dvw"
          height="22dvh"
          primary="var(--primary-color)"
          secondary="var(--font-color)" />
        <div onFocus={() => setIsPasswordFocused(true)} onBlur={handleBlur} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <FormBox
            title="Register your account"
            isRegister={true}
            formData={formData}
            handleChange={handleChange}
            handleSubmit={handleRegistration}
          />
          {isPasswordFocused && <PasswordCriteria password={formData.password} />}
        </div>
        <p style={{ fontSize: '0.8rem', color: 'var(--secondary-font-color)', textAlign: 'center', maxWidth: '350px', marginTop: '10px' }}>
          A verification link will be sent to your email address.
        </p>
        <p style={{ marginTop: '15px' }}>-Or sign up with-</p>
        <AltLogin />
        <p>
          Already have an account?{" "}
          <Link to="/login" className={Styles.link}>
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
