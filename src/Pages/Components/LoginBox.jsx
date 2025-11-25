import ConfirmPassword from "./ConfirmPassword";
import PasswordInput from "./PasswordInput";

export default function LoginBox(props) {
  return (
    <>
      <div className="login-box">
        <h3>{props.title}</h3>
        <input type="text" placeholder="Email" className="input" />
        <PasswordInput />
        {props.isregister === true && <ConfirmPassword />}
        <button className="btn-primary">Sign In</button>
      </div>
    </>
  );
}