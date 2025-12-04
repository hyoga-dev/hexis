import { useState } from "react";
import Styles from "../assets/Styles/analytics.module.css";
import NavbarStyle from "../assets/Styles/navbar.module.css";
import BurgerIcon from "../assets/Icon/SideBar/BurgerIcon";
import SideBar from "./Components/SideBar";

const Analytics = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={Styles.wrapper}>
      <div className={NavbarStyle.container}>
        <SideBar isOpen={isOpen} onClose={() => setIsOpen(false)} />
        <div className={NavbarStyle.header}>
          <button onClick={() => setIsOpen(true)} className={NavbarStyle.menuBtn}>
            <BurgerIcon width="2rem" height="2rem" />
          </button>
        </div>
      </div>
      Analytics
    </div>
  );
};

export default Analytics;
