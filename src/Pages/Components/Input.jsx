import { useState } from "react";

export default function PasswordInput({ type, placeholder, name, onChange }) {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <input
        type={type}
        placeholder={placeholder}
        name={name}
        className="input"
        onChange={onChange}
        required
      />
    </>
  );
}
