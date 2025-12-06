import { useState } from "react";
import { BrowserRouter, Routes, Route, Link, Outlet } from "react-router-dom";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import NotFound from "./Pages/NotFound";
import ResetPassword from "./Pages/ResetPassword"
import CheckEmail from "./Pages/CheckEmail"
import FormResetPassword from "./Pages/FormResetPassword"
import AddHabit from "./Pages/AddHabit"
import Habit from "./Pages/Habit"
import UserData from "./data/DataDisplayTest"
import Roadmap from "./Pages/Roadmap";
import RoadmapDetail from "./Pages/RoadmapDetail";
import Settings from "./Pages/Settings";
import Profil from "./Pages/profil";
import Analytics from "./Pages/Analytics";
import AuthTest from "./data/authTest";
import LoadingScreen from "./Pages/LoadingScreen";
import HabitLogic from "./Pages/Components/habitLogic";


function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>

          <Route path="/" element={<LoadingScreen />} />
          <Route path="/login" element={<Login />} />
          <Route path="/Register" element={<Register />} />
          <Route path="/Reset" element={<ResetPassword />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/CheckEmail" element={<CheckEmail />} />
          <Route path="/FormResetPassword" element={<FormResetPassword />} />
          <Route path="/AddHabit" element={<AddHabit />} />
          <Route path="/Habit" element={<Habit />} />
          <Route path="/Data" element={<UserData />} />
          <Route path="/Roadmap" element={<Roadmap />} />
          <Route path="/RoadmapDetail" element={<RoadmapDetail />} />
          <Route path="/Settings" element={<Settings />} />
          <Route path="/Profil" element={<Profil />} />
          <Route path="/Analytics" element={<Analytics />} />
          <Route path="/AuthTest" element={<AuthTest />} />
          <Route path="/habitLogic" element={<HabitLogic />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
