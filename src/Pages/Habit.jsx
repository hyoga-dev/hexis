import style from "../assets/Styles/habit.module.css";
import HabitItem from "./Components/HabitItem";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Styles from "../assets/Styles/navbar.module.css";
import BurgerIcon from "../assets/Icon/SideBar/BurgerIcon";
import BasilFireOutline from "../assets/Icon/BasilFireOutline";
import SideBar from "./Components/SideBar";
import { useAuthLogin } from "../data/useAuthLogin";

const Habit = () => {
  const [isOpen, setIsOpen] = useState(false);
  const {currentUser, loading} = useAuthLogin();
  
  // useEffect(() => {
  //   console.log(currentUser);
  // }, [currentUser]);

  return (
    <div className={style.wrapper}>

      {/* header */}
      <SideBar isOpen={isOpen} onClose={() => setIsOpen(false)} />
      <div className={Styles.header}>

        <button onClick={() => setIsOpen(true)} className={Styles.menuBtn}>
          <BurgerIcon width="2rem" height="2rem" />
        </button>

        <div className={Styles.streak}>
          <BasilFireOutline width="2rem" height="2rem" />
          <span>4</span>
        </div>

      </div>

      {/* content */}
      <div className={style.container}>
        <div>
          <h2>Morning</h2>
          <p>Filter</p>
        </div>

        <HabitItem />
      </div>

      <Link to="/addhabit" className={style.addHabitBtn}>
        add habit
      </Link>
    </div>
  );
};

export default Habit;
