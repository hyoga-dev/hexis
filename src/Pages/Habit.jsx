import { useState } from "react";

import Styles from "../assets/Styles/habit.module.css";
import "../assets/Styles/global.css";
import BurgerIcon from "../assets/Icon/SideBar/BurgerIcon";
import BasilFireOutline from "../assets/Icon/BasilFireOutline";

import SideBar from "../Pages/Components/SideBar";

const Habit = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className={Styles.container}>
        <div className={Styles.header}>
          <SideBar isOpen={isOpen} onClose={() => setIsOpen(false)} />
          <button onClick={() => setIsOpen(true)} className={Styles.menuBtn}>
            <BurgerIcon width="2rem" height="2rem" />
          </button>

          <div className={Styles.streak}>
            <BasilFireOutline width="2rem" height="2rem" />
            <span>4</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Habit;
