import { useState } from "react";
import Styles from "../assets/Styles/navbar.module.css";
import BurgerIcon from "../assets/Icon/SideBar/BurgerIcon";
import SideBar from "./Components/SideBar";

const Profil = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <div className={Styles.container}>
        <SideBar isOpen={isOpen} onClose={() => setIsOpen(false)} />
        <div className={Styles.header}>
          <button onClick={() => setIsOpen(true)} className={Styles.menuBtn}>
            <BurgerIcon width="2rem" height="2rem" />
          </button>
        </div>
      </div>
      Profil
    </div>
  );
};

export default Profil;
