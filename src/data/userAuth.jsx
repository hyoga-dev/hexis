import { useState } from "react";
import { signIn, signUp } from "./AuthEmail";

const MockUser = {
  email: "naufalabbad26@gmail.com",
  password: "091624",
};

export const useAuthLogic = (isRegister = false) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isRegister) {
      console.log("ada");
      if (formData.password !== formData.confirmPassword) {
        alert("Passwords do not match!");
        return;
      }

      signUp(formData.email, formData.password)
      console.log("Registering new user:", formData);
      alert("Account Created Successfully!");
    } else  {
      signIn(formData.email, formData.password)
      // if (
      //   formData.email !== MockUser.email ||
      //   formData.password !== MockUser.password
      // ) {
      //   alert("Wrong Credentials (Git Gut)");
      // } else {
      //   alert("Login Success (GoodJob)");
      // }
    }
  };
  
  return { formData, handleChange, handleSubmit };
};
