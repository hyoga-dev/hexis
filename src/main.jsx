import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { registerSW } from "virtual:pwa-register";
import { UserProvider } from "./data/DataDisplayTest.jsx";
import App from "./App.jsx";
import "./assets/Styles/global.css";

registerSW({
  immediate: true,
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <UserProvider>
      <App />
    </UserProvider>
  </StrictMode>
);
