import { useState } from "react";

export default function ConfirmPassword() {
  const [visible, setVisible] = useState(false);
  return (
    <>
      <input
        type={visible ? "text" : "password"}
        placeholder="Confirm Password"
        className="input"
      />
    </>
  );
}