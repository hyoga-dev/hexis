// import { useState } from "react";
import { Link } from "react-router-dom";
import "../assets/Styles/global.css";
import Styles from "../assets/Styles/login.module.css";
import Logo from "../assets/Images/logo.png";
import AltLogin from "./Components/AltLogin";
import FormBox from "./Components/FormBox";
import { useAuthLogic } from "../data/userAuth";

export default function Register() {
  const { formData, handleChange, handleSubmit } = useAuthLogic(true);
  return (
    <div className={Styles.pageWrapper}>
      <div className={Styles.container}>
        <img src={Logo} alt="Logo" className={Styles.logo} />
        <FormBox
          title="Register your account"
          isRegister={true}
          formData={formData}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
        />
        <p className={Styles.orSign}>-Or sign up with-</p>
        <AltLogin />
        <p>
          Already have an account?{" "}
          <Link to="/" className={Styles.link}>
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
