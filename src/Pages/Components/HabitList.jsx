import style from "../../assets/Styles/habitList.module.css";
import HabitItem from "./HabitItem";
import MorningIcon from "../../assets/Icon/SunHoleIcon";
import AfternoonIcon from "../../assets/Icon/SunIcon";
import NightIcon from "../../assets/Icon/MoonIcon";

const timeGroups = [
    { label: "Morning", icon: <MorningIcon color="var(--primary-color)" /> },
    { label: "Afternoon", icon: <AfternoonIcon color="var(--primary-color)" /> },
    { label: "Evening", icon: <NightIcon color="var(--primary-color)" /> }
];

const HabitList = ({ habits, onHabitClick, onEditHabit, onDeleteHabit, filterTime, ignoreSchedule }) => {
    if (!habits || habits.length === 0) {
        return <p className={style.noHabits}>No habits for this section.</p>;
    }

    const groupsToRender = filterTime === "all"
        ? timeGroups
        : (filterTime === "Anytime" ? [] : timeGroups.filter(g => g.label === filterTime));

    return (
        <div>
            {groupsToRender.map((group) => {
                const groupHabits = habits.filter(h => h.waktu && h.waktu.includes(group.label));
                if (groupHabits.length === 0) return null;
                return (
                    <div key={group.label} className={style.timeSection}>
                        <h3 className={style.timeHeader}>{group.label} <span>{group.icon}</span></h3>
                        <HabitItem
                            onUpdate={(_, idx) => onHabitClick(groupHabits[idx])}
                            onEdit={(idx) => onEditHabit(groupHabits[idx])}
                            onDelete={(idx) => onDeleteHabit(groupHabits[idx])}
                            habits={groupHabits}
                            timeContext={group.label}
                            ignoreSchedule={ignoreSchedule}
                        />
                    </div>
                );
            })}
            {(filterTime === "all" || filterTime === "Anytime") && (() => {
                const anytimeHabits = habits.filter(h => !h.waktu || h.waktu.length === 0);
                if (anytimeHabits.length === 0) return null;
                return (
                    <div className={style.timeSection}>
                        <h3 className={style.timeHeader}>Anytime</h3>
                        <HabitItem
                            onUpdate={(_, idx) => onHabitClick(anytimeHabits[idx])}
                            onEdit={(idx) => onEditHabit(anytimeHabits[idx])}
                            onDelete={(idx) => onDeleteHabit(anytimeHabits[idx])}
                            habits={anytimeHabits}
                            ignoreSchedule={ignoreSchedule}
                        />
                    </div>
                );
            })()}
        </div>
    );
};

export default HabitList;