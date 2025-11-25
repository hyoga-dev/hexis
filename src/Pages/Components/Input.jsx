import { useState } from "react";

export default function PasswordInput({ type, placeholder, name, onChange }) {
  const [visible, setVisible] = useState(false);

  return (
    <>
    <div className="input-wrapper">
      <input
        type={type === "password" ? (visible ? "text" : "password") : "text"}
        placeholder={placeholder}
        name={name}
        className="input"
        onChange={onChange}
        required
      />
      {type === "password" ? (
        <button type="button" className="peek" onClick={()=>{setVisible(!visible)}}>
          {visible ? "hide" : "show"}
        </button>
      ) : (
        " "
      )}
      </div>
    </>
  );
}
