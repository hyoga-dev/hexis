// import { useState } from "react";
import { Form, Link } from "react-router-dom";
import "../assets/Styles/global.css";
import Styles from "../assets/Styles/resetPassword.module.css";
import FormBox from "./Components/FormBox";
import { useAuthLogic } from "../data/userAuth";

export default function Register() {
  const { formData, handleChange, handleSubmit } = useAuthLogic(false);
  return (
    <>
      <div className={Styles["container-reset-password"]}>
        <div className={Styles["reset-password-box"]}>
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
