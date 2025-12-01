import Navbar from "./Components/Navbar";
import style from "../assets/Styles/habit.module.css";
import HabitItem from "./Components/HabitItem";


const Habit = () => {
  
  return (
      <div className={style.outerContainer}>

        <Navbar />

        <div className={style.container}>
          <div>
            <h2>Morning</h2>
            <p>Filter</p>
          </div>
          <HabitItem />
        </div>
        
      </div>
  );
};

export default Habit;
