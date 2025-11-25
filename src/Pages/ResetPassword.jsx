// import { useState } from "react";
import { Link } from "react-router-dom";
import "../assets/Styles/global.css";
import "../assets/Styles/login.css";
import Logo from "../assets/Images/logo.png";
import AltLogin from "./Components/AltLogin";
import LoginBox from "./Components/LoginBox";

export default function Reset(){
  return (
    <input type="text" placeholder="Email" className="input" />
  )
}