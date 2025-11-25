import { useState } from "react";
import ConfirmPassword from "./ConfirmPassword";
import PasswordInput from "./PasswordInput";

export default function FormBox({ title, isRegister }) {
  const [visible, setVisible] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    ConfirmPassword: "",
  });
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Logging in with", formData);
  };

  return (
    <>
      <div className="form-box">
        <h3>{title}</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Email"
            name="email"
            className="input"
            onChange={handleChange}
          />
          <input
            type={visible ? "text" : "password"}
            placeholder="Password"
            name="password"
            className="input"
            onChange={handleChange}
          />
          <button
            onClick={() => {
              setVisible(!visible);
            }}
          >
            {visible ? "show" : "Hide"}
          </button>
          {isRegister === true && <ConfirmPassword />}
          <button className="btn-primary" type="submit">
            Sign In
          </button>
        </form>
      </div>
    </>
  );
}
