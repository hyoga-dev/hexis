// import { useState } from "react";
import { Link } from "react-router-dom";
import "../assets/Styles/global.css";
import "../assets/Styles/login.css";
import Logo from "../assets/Images/logo.png";
import AltLogin from "./Components/AltLogin";
import LoginBox from "./Components/FormBox";

export default function Register() {
  return (
    <>
      <div className="container">
        <img src={Logo} alt="Logo" className="logo" />
        <LoginBox title="Register your account" isRegister={true} />
        <p>-Or sign up with-</p>
        <AltLogin />
        <p>
          Already have an account?{" "}
          <Link to="/" className="link">
            Sign In
          </Link>
        </p>
      </div>
    </>
  );
}
