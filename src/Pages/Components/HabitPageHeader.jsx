import style from "../../assets/Styles/habitPageHeader.module.css";
import BurgerIcon from "../../assets/Icon/SideBar/BurgerIcon";
import BasilFireOutline from "../../assets/Icon/BasilFireOutline";

const HabitPageHeader = ({ onMenuClick, streak }) => {
    return (
        <div className={style.header}>
            <button onClick={onMenuClick} className={style.menuBtn}>
                <BurgerIcon color="var(--font-color)" width="2rem" height="2rem" />
            </button>

            <div className={style.streak}>
                <BasilFireOutline width="2rem" height="2rem" />
                <span>{streak}</span>
            </div>
        </div>
    );
};

export default HabitPageHeader;