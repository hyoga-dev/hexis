// import { useState } from "react";
import { Link } from "react-router-dom";
import "../assets/Styles/global.css";
import "../assets/Styles/reset.css";
import Logo from "../assets/Images/logo.png";
import AltLogin from "./Components/AltLogin";
import LoginBox from "./Components/LoginBox";

export default function Reset(){
  return (
    <>
    <div className="container-reset">
    <div className="reset-box">
      <h3>Reset password</h3>
      <p>Enter the email associated with your account and we’ll send an email with instruction to reset your password.</p>
    <input type="text" placeholder="Email" className="input" />
    </div>
    <button className="btn-primary">Confirm</button>
    <p>
          Don't have an account?{" "}
          <Link to="/register" className="link">
            Sign Up
          </Link>
        </p>
    </div>
    </>
  )
}