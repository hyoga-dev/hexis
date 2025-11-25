import { useState } from "react";
import ConfirmPassword from "./ConfirmPassword";
import PasswordInput from "./PasswordInput";

export default function FormBox({ title, isRegister }) {
  const [visible, setVisible] = useState(false);
  return (
    <>
      <div className="form-box">
        <h3>{title}</h3>
        <input type="text" placeholder="Email" name="email" className="input" />
        <input
          type={visible ? "text" : "password"}
          placeholder="Password"
          name="password"
          className="input"
        />
        <button
          onClick={() => {
            setVisible(!visible);
          }}
        >
          {visible ? "show" : "Hide"}
        </button>
        <PasswordInput />
        {isRegister === true && <ConfirmPassword />}
        <button className="btn-primary">Sign In</button>
      </div>
    </>
  );
}
