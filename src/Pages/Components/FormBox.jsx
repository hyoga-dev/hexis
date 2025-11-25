import Input from "./Input";

export default function FormBox({
  title,
  isRegister,
  isNewPassword,
  formData,
  handleChange,
  handleSubmit,
}) {
  // Helper to determine Button Text
  const getButtonText = () => {
    if (isNewPassword) return "Reset Password";
    if (isRegister) return "Sign Up";
    return "Sign In";
  };

  return (
    <div className="form-box">
      <h3>{title}</h3>

      <form onSubmit={handleSubmit}>
        {!isNewPassword && (
          <Input
            type="text"
            placeholder="Email"
            name="email"
            value={formData.email || ""}
            onChange={handleChange}
          />
        )}

        <Input
          type="password"
          placeholder={isNewPassword ? "New Password" : "Password"}
          name="password"
          value={formData.password || ""}
          onChange={handleChange}
        />

        {(isRegister || isNewPassword) && (
          <Input
            type="password"
            placeholder="Confirm Password"
            name="confirmPassword"
            value={formData.confirmPassword || ""}
            onChange={handleChange}
          />
        )}

        <button className="btn-primary" type="submit">
          {getButtonText()}
        </button>
      </form>
    </div>
  );
}
