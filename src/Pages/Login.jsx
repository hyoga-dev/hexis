// import { useState } from "react";
import { Link } from "react-router-dom";
import "../assets/Styles/global.css";
import "../assets/Styles/login.css";
import Logo from "../assets/Images/logo.png";
import Icon from "../assets/Images/icon.png";
import LoginBox from "./Components/LoginBox";





function AltLogin() {
  return (
    <>
      <div className="alt-login">
        <img src={Icon} className="icon" />
        <img src={Icon} className="icon" />
        <img src={Icon} className="icon" />
      </div>
    </>
  );
}

export default function Login() {
  return (
    <>
      <div className="container">
        <img src={Logo} alt="Logo" className="logo" />
        <LoginBox /> 
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
