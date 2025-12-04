import { useState } from "react";
import Styles from "../assets/Styles/settings.module.css";
import NavbarStyles from "../assets/Styles/navbar.module.css";
import BurgerIcon from "../assets/Icon/SideBar/BurgerIcon";
import SideBar from "./Components/SideBar";

const Settings = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={Styles.wrapper}>
      <div className={NavbarStyles.container}>
        <SideBar isOpen={isOpen} onClose={() => setIsOpen(false)} />
        <div className={NavbarStyles.header}>
          <button onClick={() => setIsOpen(true)} className={NavbarStyles.menuBtn}>
            <BurgerIcon width="2rem" height="2rem" />
          </button>
        </div>
      </div>
      Setting
    </div>
  );
};

export default Settings;
