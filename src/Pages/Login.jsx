import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../assets/Styles/global.css";
import "../assets/Styles/login.css";
import Images from "../assets/Images/logo.png";

export default function Login() {
  return (
    <>
      <div className="container">
        <img src={Images} alt="Logo" />
      </div>
    </>
  );
}
