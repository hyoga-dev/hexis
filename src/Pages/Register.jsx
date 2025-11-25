import { useState } from "react";
import { Link } from "react-router-dom";
import "../assets/Styles/global.css";
import "../assets/Styles/login.css";
import Logo from "../assets/Images/logo.png";
import Icon from "../assets/Images/icon.png";

function PasswordInput() {
  const [visible, setVisible] = useState(false);
  return (
    <>
      <input
        type={visible ? "text" : "password"}
        placeholder="Password"
        className="input"
      />
      <button className="toggle-show" onClick={()=> setVisible(!visible)}>{visible ? "👁️" : "🫣"}</button>
    </>
  );
}

function LoginBox() {
  return (
    <>
      <div className="login-box">
        <h3>Register your account</h3>
        <input type="text" placeholder="Email" className="input" />
        <PasswordInput />
        <button className="btn-primary">Sign Up</button>
      </div>
    </>
  );
}

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
