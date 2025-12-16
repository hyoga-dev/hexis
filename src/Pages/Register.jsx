import { useState } from "react";
import { Link } from "react-router-dom";
import "../assets/Styles/global.css";
import Styles from "../assets/Styles/login.module.css";
import Logo from "../assets/Icon/HexisLogoBottom";
import AltLogin from "./Components/AltLogin";
import FormBox from "./Components/FormBox";
import { useAuthLogic } from "../data/userAuth";

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
  const { formData, handleChange, handleSubmit: originalHandleSubmit } = useAuthLogic(true);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  const handleBlur = (e) => {
    // Check if the new focused element is NOT a child of the current target (the wrapper div).
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsPasswordFocused(false);
    }
  };

  const handleRegistration = (e) => {
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

    originalHandleSubmit(e);
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
