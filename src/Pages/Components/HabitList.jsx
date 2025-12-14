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

const HabitList = ({ 
    habits, 
    onHabitClick, 
    onEditHabit, 
    onDeleteHabit, 
    filterTime, 
    ignoreSchedule, 
    filterStatus,
    isSelectionMode,
    selectedIds,
    isFlatList // <--- Now controlled by isSelectionMode in parent
}) => {
    if (!habits || habits.length === 0) {
        return <p className={style.noHabits}>No habits for this section.</p>;
    }

    // --- FLAT LIST VIEW (SELECTION MODE) ---
    // Ignores groups and shows everything in one list
    if (isFlatList) {
        return (
            <div className={style.timeSection}>
                <h3 className={style.timeHeader}>Select Habits to Delete</h3>
                <HabitItem
                    onUpdate={(_, idx) => onHabitClick(habits[idx])} 
                    onEdit={(idx) => onEditHabit(habits[idx])}
                    onDelete={(idx) => onDeleteHabit(habits[idx])}
                    habits={habits}
                    timeContext="total" 
                    ignoreSchedule={true} 
                    isSelectionMode={isSelectionMode}
                    selectedIds={selectedIds}
                    isFlatList={true}
                />
            </div>
        );
    }

    // --- STANDARD GROUPED VIEW ---
    const groupsToRender = filterTime === "all"
        ? timeGroups
        : (filterTime === "Anytime" ? [] : timeGroups.filter(g => g.label === filterTime));

    return (
        <div>
            {groupsToRender.map((group) => {
                const groupHabits = habits
                    .filter(h => h.waktu && h.waktu.includes(group.label))
                    .filter(h => {
                        if (filterStatus === 'all') return true;
                        const target = h.goals?.target || 1;
                        const current = h.completion?.[group.label] || 0;
                        const isCompleted = current >= target;
                        if (filterStatus === 'completed') return isCompleted;
                        if (filterStatus === 'incomplete') return !isCompleted;
                        return true;
                    });
                if (groupHabits.length === 0) return null;
                return (
                    <div key={group.label} className={style.timeSection}>
                        <h3 className={style.timeHeader}>{group.label} <span>{group.icon}</span></h3>
                        <HabitItem
                            onUpdate={(_, idx) => onHabitClick(groupHabits[idx], group.label)}
                            onEdit={(idx) => onEditHabit(groupHabits[idx])}
                            onDelete={(idx) => onDeleteHabit(groupHabits[idx])}
                            habits={groupHabits}
                            timeContext={group.label}
                            ignoreSchedule={ignoreSchedule}
                            isSelectionMode={isSelectionMode}
                            selectedIds={selectedIds}
                        />
                    </div>
                );
            })}
            {(filterTime === "all" || filterTime === "Anytime") && (() => {
                const anytimeHabits = habits
                    .filter(h => !h.waktu || h.waktu.length === 0)
                    .filter(h => {
                        if (filterStatus === 'all') return true;
                        const target = h.goals?.target || 1;
                        const current = h.completion?.Anytime || h.goals?.count || 0;
                        const isCompleted = current >= target;
                        if (filterStatus === 'completed') return isCompleted;
                        if (filterStatus === 'incomplete') return !isCompleted;
                        return true;
                    });
                if (anytimeHabits.length === 0) return null;
                return (
                    <div className={style.timeSection}>
                        <h3 className={style.timeHeader}>Anytime</h3>
                        <HabitItem
                            onUpdate={(_, idx) => onHabitClick(anytimeHabits[idx], "Anytime")}
                            onEdit={(idx) => onEditHabit(anytimeHabits[idx])}
                            onDelete={(idx) => onDeleteHabit(anytimeHabits[idx])}
                            habits={anytimeHabits}
                            timeContext="Anytime"
                            ignoreSchedule={ignoreSchedule}
                            isSelectionMode={isSelectionMode}
                            selectedIds={selectedIds}
                        />
                    </div>
                );
            })()}
        </div>
    );
};

export default HabitList;