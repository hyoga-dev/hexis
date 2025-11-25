import { useState } from "react";

export default function PasswordInput() {
  const [visible, setVisible] = useState(false);
  return (
    <>
      <input
        type={visible ? "text" : "password"}
        placeholder="Password"
        className="input"
      />
    </>
  );
}