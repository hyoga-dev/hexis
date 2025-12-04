import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { registerSW } from "virtual:pwa-register";
import { UserProvider } from "./data/userData.jsx";
import App from "./App.jsx";
import "./assets/Styles/global.css";
import { HabitProvider } from "./data/habitData.jsx";

registerSW({
  immediate: true,
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HabitProvider>
      <UserProvider>
        <App />
      </UserProvider>
    </HabitProvider>
  </StrictMode>
);
