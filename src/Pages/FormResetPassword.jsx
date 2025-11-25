// import { useState } from "react";
import { Form, Link } from "react-router-dom";
import "../assets/Styles/global.css";
import "../assets/Styles/resetPassword.css";
import Logo from "../assets/Images/logo.png";
import AltLogin from "./Components/AltLogin";
import FormBox from "./Components/FormBox";

export default function Register() {
  return (
    <>
    <div className="container-reset-password">
    <div className="reset-password-box">
    <FormBox title="Create new password" isNewPassword={true} /> 
    </div>
    </div>
    </>
  );
}
