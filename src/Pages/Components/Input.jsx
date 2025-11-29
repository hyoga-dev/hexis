import { useState } from "react";
import Styles from "../../assets/Styles/login.module.css";
import Show from "../../assets/Images/icon-show.png";
import Hide from "../../assets/Images/icon-hide.png";

export default function PasswordInput({ type, placeholder, name, onChange }) {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <div className={Styles["input-wrapper"]}>
        <input
          type={type === "password" ? (visible ? "text" : "password") : "text"}
          placeholder={placeholder}
          name={name}
          className={Styles.input}
          onChange={onChange}
          required
        />
        {type === "password" ? (
          <button
            type="button"
            className={Styles.peek}
            onClick={() => {
              setVisible(!visible);
            }}
          >
            {visible ? <img src={Show} /> : <img src={Hide} />}
          </button>
        ) : (
          " "
        )}
      </div>
    </>
  );
}
