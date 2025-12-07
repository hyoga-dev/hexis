import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../assets/Styles/global.css";
import Styles from "../assets/Styles/login.module.css";
import Logo from "../assets/Icon/HexisLogoBottom.jsx";
import FormBox from "./Components/FormBox";
import AltLogin from "./Components/AltLogin";
import { useAuthLogic } from "../data/userAuth";
import { useAuthLogin } from "../data/useAuthLogin";
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase.js';

export default function Login() {
  const { formData, handleChange, handleSubmit } = useAuthLogic(false);
  // const {currentUser, loading} = useAuthLogin();


  return (
    <div className={Styles.pageWrapper}>
      <div className={Styles.container}>
        <Logo
          width="22dvw"
          height="22dvh"
          primary="var(--primary-color)"
          secondary="var(--font-color)" />
        <FormBox
          title="Login to your account"
          isRegister={false}
          formData={formData}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
        />
        <div className={Styles["reset-container"]}>
          <Link to="/reset" className={Styles["reset-link"]}>
            Forgot Password
          </Link>
        </div>
        <p>-Or sign in with-</p>
        <AltLogin />
        <p>
          Don't have an account?
          <Link to="/register" className={Styles.link}>
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
