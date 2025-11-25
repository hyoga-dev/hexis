import { useState } from "react";
import { BrowserRouter, Routes, Route, Link, Outlet } from "react-router-dom";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import NotFound from "./Pages/NotFound";
import ResetPassword from "./Pages/ResetPassword"
import CheckEmail from "./Pages/CheckEmail"
import FormResetPassword from "./Pages/FormResetPassword"


function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/Register" element={<Register />} />
          <Route path="/Reset" element={<ResetPassword />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/CheckEmail" element={<CheckEmail />} />
          <Route path="/FormResetPassword" element={<FormResetPassword />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
