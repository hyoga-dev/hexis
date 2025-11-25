import { useState } from "react";

export default function PasswordInput() {
  const [visible, setVisible] = useState(false);
  return (
    <>
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
    </>
  );
}
