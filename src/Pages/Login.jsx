import { useState } from "react";
import { Link } from "react-router-dom";
import "../assets/Styles/global.css";
import "../assets/Styles/login.css";
import Logo from "../assets/Images/logo.png";
import FormBox from "./Components/FormBox";
import AltLogin from "./Components/AltLogin";
import { useAuthLogic } from "../data/userAuth";

export default function Login() {
  const { formData, handleChange, handleSubmit } = useAuthLogic(false);

  return (
    <>
      <div className="container">
        <img src={Logo} alt="Logo" className="logo" />
        <FormBox
          title="Login to your account"
          isRegister={false}
          formData={formData}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
        />
        <div className="reset-container">
          <Link to="/reset" className="reset-link">
            Forgot Password
          </Link>
        </div>
        <p>-Or sign in with-</p>
        <AltLogin />
        <p>
          Don't have an account?{" "}
          <Link to="/register" className="link">
            Sign Up
          </Link>
        </p>
      </div>
    </>
  );
}
