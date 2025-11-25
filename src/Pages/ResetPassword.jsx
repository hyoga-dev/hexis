// import { useState } from "react";
import { Link } from "react-router-dom";
import "../assets/Styles/global.css";
import "../assets/Styles/reset.css";
import { useAuthLogic } from "../data/userAuth";

export default function Reset() {
  const { formData, handleChange, handleSubmit } = useAuthLogic(true);
  return (
    <>
      <div className="container-reset">
        <div className="reset-box">
          <form onSubmit={handleSubmit}>
            <h3>Reset password</h3>
            <p>
              Enter the email associated with your account and we’ll send an
              email with instruction to reset your password.
            </p>
            <input type="text" placeholder="Email" className="input" name="email" onChange={handleChange} formdata={formData} />
            <button className="btn-primary">Confirm</button>
          </form>
        </div>
        <p>
          Don't have an account?
          <Link to="/register" className="link">
            Sign Up
          </Link>
        </p>

        
      </div>
    </>
  );
}
