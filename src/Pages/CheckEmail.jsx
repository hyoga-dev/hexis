// import { useState } from "react";
import { Link } from "react-router-dom";
import "../assets/Styles/global.css";
import "../assets/Styles/checkemail.css";


export default function CheckEmail(){
  return (
    <>
      <div className="container-check-email">
      <div className="btn-back">
        <Link to="/" className="link-check">
          <img src="src/assets/Images/btn-back.png" alt="" />
          </Link>
      </div>
      <div className="img-check">
      <img src="src/assets/Images/mail.png" alt=""/>
      </div>
      <div className="email-email-box">
      <h3>Check your email</h3>
      <p>We have sent a password recover.
      Instruction to your email</p>
      </div>
      <button className="btn-primary-check">Open email app</button>
      <Link to="/" className="link-check">
          Skip, i’ll confirm later
          </Link>
      </div>
    </>
  )
}