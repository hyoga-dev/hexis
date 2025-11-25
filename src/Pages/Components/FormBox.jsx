import { useState } from "react";
import Input from "./Input";

export default function FormBox({
  title,
  isRegister,
  isNewPassword,
  handleChange,
  handleSubmit,
}) {
  return (
    <>
      <div className="form-box">
        <h3>{title}</h3>
        <form>
          {isNewPassword === true ? (
            <>
              <p>Your new password must be different from previous used password.</p>
              <label htmlFor="password">Password</label>
              <Input id="password"
                type="password"
                placeholder="***************"
                name="password"
                onChange={handleChange}
              />
              <p>Must be at least 8 character.</p>
              <label htmlFor="newpassword">New Password</label>
              <Input id="newpassword"
                type="password"
                placeholder="***************"
                name="confirmPassword"
                onChange={handleChange}
              />
              <p>Both password must match.</p>
            </>
          ) : (
            <>
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
            </>
          )}
          <button className="btn-primary" type="submit" onClick={handleSubmit}>
            Sign In
          </button>
        </form>
      </div>
    </>
  );
}