// import { useState } from "react";
import { Link } from "react-router-dom";
// import "../assets/Styles/global.css";
import Styles from "../assets/Styles/reset.module.css";
import { useAuthLogic } from "../data/userAuth";
import Back from "./Components/Back";

export default function Reset() {
  const { formData, handleChange, handleSubmit } = useAuthLogic(true);
  return (
    <>
      <div className={Styles["container-reset"]}>
        <div className={Styles["btn-back"]}>
          <Link to="/" className={Styles["link-check"]}>
            <img src="src/assets/Images/btn-back.png" alt="" />
          </Link>
        </div>

        {/* <Back title="Reset Password" link="/habit" /> */}
        

        <div className={Styles["reset-box"]}>
          <form onSubmit={handleSubmit}>
            <h3>Reset password</h3>
            <p>
              Enter the email associated with your account and we\u2019ll send an
              email with instruction to reset your password.
            </p>

            <input
              type="text"
              placeholder="Email"
              className={Styles.input}
              name="email"
              onChange={handleChange}
              formdata={formData}
            />

            <Link to="/checkemail">
              <button className={Styles["btn-primary"]}>Confirm</button>
            </Link>
          </form>
        </div>
        <p>
          Don't have an account?
          <Link to="/register" className={Styles.link}>
            Sign Up
          </Link>
        </p>
      </div>
    </>
  );
}
