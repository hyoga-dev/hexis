// import { useState } from "react";
import { Link } from "react-router-dom";
import "../assets/Styles/global.css";
import "../assets/Styles/login.css";
import Logo from "../assets/Images/logo.png";
import LoginBox from "./Components/LoginBox";
import AltLogin from "./Components/AltLogin";

export default function Login() {
  return (
    <>
      <div className="container">
        <img src={Logo} alt="Logo" className="logo" />
        <LoginBox title="Login to your account" /> 
        <div className="resetLink">
        <Link to="/reset" className="resetLink">
            Reset Password
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
