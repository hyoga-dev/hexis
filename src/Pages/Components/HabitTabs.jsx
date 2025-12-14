import style from "../../assets/Styles/habitTabs.module.css";

const HabitTabs = ({ activeTab, onTabChange }) => {
    return (
        <div className={style.nav}>
            <button
                onClick={() => onTabChange("personal")}
                className={`${style.navItem} ${activeTab === "personal" ? style.active : ""}`}
            >
                Personal
            </button>
            {/* "All" Tab removed */}
            <button
                onClick={() => onTabChange("roadmap")}
                className={`${style.navItem} ${activeTab === "roadmap" ? style.active : ""}`}
            >
                Roadmap
            </button>
        </div>
    );
};

export default HabitTabs;