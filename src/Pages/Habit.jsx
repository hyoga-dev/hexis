import Styles from "../assets/Styles/habit.module.css";
import "../assets/Styles/global.css";
import LineMdAlignLeft from "../assets/Icon/LineMdAlignLeft";
import BasilFireOutline from "../assets/Icon/BasilFireOutline";

const Habit = () => {
  return (
    <>
      <div className={Styles.container}>
        <div className="header">
          <LineMdAlignLeft width="3rem" height="3rem" />
          <div className="streak">
            <BasilFireOutline width="3rem" height="3rem" />
            <span>4</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Habit;
