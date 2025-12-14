// import { useState } from "react";
import { Link } from "react-router-dom";
import "../assets/Styles/global.css";
import Styles from "../assets/Styles/checkemail.module.css";

export default function CheckEmail() {
  return (
    <>
      <div className={Styles["container-check-email"]}>
        <div className={Styles["btn-back"]}>
          <Link onClick={() => window.location.href = "mailto:"} to="/reset" className={Styles["link-check"]}>
            <img src="src/assets/Images/btn-back.png" alt="" />
          </Link>
        </div>
        <div className={Styles["img-check"]}>
          <img src="src/assets/Images/mail.png" alt="" />
        </div>
        <div className={Styles["email-email-box"]}>
          <h3>Check your email</h3>
          <p>We have sent a password recover. Instruction to your email</p>
        </div>
        <button className={Styles["btn-primary-check"]}>Open email app</button>
        <Link to="/" className={Styles["link-check"]}>
          Skip, i'll confirm later
        </Link>
      </div>
    </>
  );
}
