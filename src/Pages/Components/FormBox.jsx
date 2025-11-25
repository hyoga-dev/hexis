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

      {isNewPassword && (
        <p className="description-text">
          Your new password must be different from previous used password.
        </p>
      )}

      <form onSubmit={handleSubmit}>
        {!isNewPassword && (
          <Input
            id="email"
            type="text"
            placeholder="Email"
            name="email"
            value={formData.email || ""}
            onChange={handleChange}
          />
        )}

        {isNewPassword && <label htmlFor="password">Password</label>}
        <Input
          id="password"
          type="password"
          placeholder={isNewPassword ? "***************" : "Password"}
          name="password"
          value={formData.password || ""}
          onChange={handleChange}
        />

        {isNewPassword && (
          <p className="help-text">Must be at least 8 characters.</p>
        )}

        {(isRegister || isNewPassword) && (
          <>
            {isNewPassword && (
              <label htmlFor="confirmPassword">Confirm Password</label>
            )}
            <Input
              id="confirmPassword"
              type="password"
              placeholder={
                isNewPassword ? "***************" : "Confirm Password"
              }
              name="confirmPassword"
              value={formData.confirmPassword || ""}
              onChange={handleChange}
            />
            {isNewPassword && (
              <p className="help-text">Both passwords must match.</p>
            )}
          </>
        )}

        <button className="btn-primary" type="submit">
          {getButtonText()}
        </button>
      </form>
    </div>
  );
}
