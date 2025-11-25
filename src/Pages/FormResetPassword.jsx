// import { useState } from "react";
import { Form, Link } from "react-router-dom";
import "../assets/Styles/global.css";
import "../assets/Styles/resetPassword.css";
import FormBox from "./Components/FormBox";
import { useAuthLogic } from "../data/userAuth";

export default function Register() {
  const { formData, handleChange, handleSubmit } = useAuthLogic(false);
  return (
    <>
      <div className="container-reset-password">
        <div className="reset-password-box">
          <FormBox
            title="Create new password"
            isNewPassword={true}
            formData={formData}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
          />
        </div>
      </div>
    </>
  );
}
