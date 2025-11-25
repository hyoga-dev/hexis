import PasswordInput from "./PasswordInput";

export default function LoginBox() {
  return (
    <>
      <div className="login-box">
        <h3>Login to your account</h3>
        <input type="text" placeholder="Email" className="input" />
        <PasswordInput />
        <button className="btn-primary">Sign In</button>
      </div>
    </>
  );
}