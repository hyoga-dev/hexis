import { useState } from "react";
import Styles from "../../assets/Styles/habit.module.css";

//Icon
import UncheckedIcon from "../../assets/Icon/UncheckedIcon";
import CheckedIcon from "../../assets/Icon/CheckedIcon";

import Icon from "../../assets/Images/goal.png";

// Helpers
const getDayName = () => {
    const days = ['minggu', 'senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu'];
    return days[new Date().getDay()];
};

const isTodayDate = (dayset) => {
    if (!Array.isArray(dayset)) return false;
    const today = (new Date().getDate());
    return dayset.includes(today);
}

const isToday = (dayset) => {
    if (!Array.isArray(dayset)) return false;
    return dayset.includes(getDayName());
}

// Added 'ignoreSchedule' prop
const HabitItem = ({ onUpdate, onEdit, onDelete, habits, timeContext, ignoreSchedule }) => {
    const [openMenuIndex, setOpenMenuIndex] = useState(null);

    const toggleMenu = (e, index) => {
        e.stopPropagation();
        setOpenMenuIndex(openMenuIndex === index ? null : index);
    };

    const handleEditClick = (e, index) => {
        e.stopPropagation();
        setOpenMenuIndex(null);
        if (onEdit) onEdit(index);
    };

    const handleDeleteClick = (e, index) => {
        e.stopPropagation();
        setOpenMenuIndex(null);
        if (window.confirm("Are you sure you want to delete this habit?")) {
            onDelete(index);
        }
    };

    if (!habits || habits.length === 0) {
        return (
            <div style={{ textAlign: "center", marginTop: "50px", color: "gray", opacity: 0.7 }}>
                <p>No habits found.</p>
            </div>
        );
    }

    return (
        <>
            {habits.map((item, index) => {
                // --- UPDATED LOGIC ---
                // If ignoreSchedule is true (Roadmap Mode), we show it regardless of the day.
                // Otherwise, we check if it is scheduled for today.
                const scheduledForToday = ignoreSchedule || isToday(item.daySet) || isTodayDate(item.daySet);

                // --- PROGRESS LOGIC ---
                const current = item.goals.count || 0;
                const target = item.goals.target || 1;
                const percent = Math.min((current / target) * 100, 100);
                const isCompleted = current >= target;

                let statusText = `${current} / ${target} ${item.goals.satuan}`;
                let visualPercent = percent;

                if (scheduledForToday) {
                    return (
                        <div key={item.id || index} className={Styles.cardContainer}>

                            <div className={Styles.card} onClick={() => onUpdate(true, index)}>

                                <div className={Styles.cardHeader}>
                                    <div className={Styles.titleSection}>
                                        {isCompleted ? <CheckedIcon color="var(--primary-color)" /> : <UncheckedIcon color="var(--secondary-color)" />}
                                        <div>
                                            <h3 className={Styles.habitTitle} style={{ textDecoration: isCompleted ? 'line-through' : 'none' }}>
                                                {item.title}
                                            </h3>
                                        </div>
                                    </div>

                                    {!item.roadmapId && (
                                        <button className={Styles.menuBtn} onClick={(e) => toggleMenu(e, index)}>
                                            ⋮
                                        </button>
                                    )}
                                </div>

                                {item.description && (
                                    <p className={Styles.habitDesc}>"{item.description}"</p>
                                )}

                                <div className={Styles.progressSection}>
                                    <div className={Styles.progressInfo}>
                                        <span>Progress</span>
                                        <span>{statusText}</span>
                                    </div>
                                    <div className={Styles.progressBarBg}>
                                        <div
                                            className={Styles.progressBarFill}
                                            style={{
                                                width: `${visualPercent}%`,
                                                backgroundColor: isCompleted ? '#4caf50' : 'var(--primary-color)'
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {openMenuIndex === index && (
                                <div className={Styles.menuDropdown}>
                                    <button className={Styles.menuItem} onClick={(e) => handleEditClick(e, index)}>
                                        Edit Habit
                                    </button>
                                    <button
                                        className={`${Styles.menuItem} ${Styles.deleteItem}`}
                                        onClick={(e) => handleDeleteClick(e, index)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            )}

                        </div>
                    );
                }
                return null;
            })}
        </>
    );
}

export default HabitItem;