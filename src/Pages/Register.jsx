// import { useState } from "react";
import { Link } from "react-router-dom";
import "../assets/Styles/global.css";
import "../assets/Styles/login.css";
import Logo from "../assets/Images/logo.png";
import AltLogin from "./Components/AltLogin";
import FormBox from "./Components/FormBox";
import { useAuthLogic } from "../data/userAuth";

export default function Register() {
  const { formData, handleChange, handleSubmit } = useAuthLogic(false);
  return (
    <>
      <div className="container">
        <img src={Logo} alt="Logo" className="logo" />
        <FormBox
          title="Register your account"
          isRegister={true}
          formData={formData}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
        />
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
