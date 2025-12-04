import { useState } from "react";
import { Link } from "react-router-dom";
import "../assets/Styles/global.css";
import Styles from "../assets/Styles/login.module.css";
import Logo from "../assets/Images/logo.png";
import FormBox from "./Components/FormBox";
import AltLogin from "./Components/AltLogin";
import { useAuthLogic } from "../data/userAuth";

export default function Login() {
  const { formData, handleChange, handleSubmit } = useAuthLogic(false);

  return (
    <div className={Styles.pageWrapper}>
      <div className={Styles.container}>
        <img src={Logo} alt="Logo" className={Styles.logo} />
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
