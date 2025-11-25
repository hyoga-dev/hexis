import { useState } from "react";
import ConfirmPassword from "./ConfirmPassword";
import Input from "./Input";

export default function FormBox({ title, isRegister }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
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
        <form>
          <Input
            type="text"
            placeholder="Email"
            name="email"
            onChange={handleChange}
          />
          <Input
            type="password"
            placeholder="Password"
            name="password"
            onChange={handleChange}
          />
          {isRegister === true && (
            <Input
              type="password"
              placeholder="Confirm Password"
              name="confirmPassword"
              onChange={handleChange}
            />
          )}
          <button className="btn-primary" type="submit" onClick={handleSubmit}>
            Sign In
          </button>
        </form>
      </div>
    </>
  );
}
