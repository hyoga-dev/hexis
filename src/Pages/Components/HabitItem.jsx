import { useState } from "react";
import Styles from "../../assets/Styles/habit.module.css";
import UncheckedIcon from "../../assets/Icon/UncheckedIcon";
import CheckedIcon from "../../assets/Icon/CheckedIcon";

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

const HabitItem = ({ 
    onUpdate, onEdit, onDelete, habits, timeContext, ignoreSchedule,
    isSelectionMode, selectedIds, isFlatList
}) => {
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

    if (!habits || habits.length === 0) return null;

    return (
        <>
            {habits.map((item, index) => {
                const scheduledForToday = ignoreSchedule || isToday(item.daySet) || isTodayDate(item.daySet);
                
                let current = 0;
                let target = 1;

                if (isFlatList) {
                    // FLAT VIEW: Show Total Daily Progress
                    current = item.goals.count || 0; 
                    const slotMultiplier = (item.waktu && item.waktu.length > 0) ? item.waktu.length : 1;
                    target = (item.goals.target || 1) * slotMultiplier;
                } else {
                    // NORMAL VIEW: Show Slot Progress
                    current = item.completion
                        ? (item.completion[timeContext] || 0)
                        : ((!item.waktu || item.waktu.length <= 1) ? (item.goals?.count || 0) : 0);
                    target = item.goals.target || 1;
                }

                const percent = Math.min((current / target) * 100, 100);
                const isCompleted = current >= target;
                const statusText = `${current} / ${target} ${item.goals.satuan}`;
                
                const isSelected = selectedIds ? selectedIds.has(item.id) : false;

                if (scheduledForToday) {
                    return (
                        <div key={item.id || index} className={Styles.cardContainer}>
                            <div 
                                className={Styles.card} 
                                onClick={() => onUpdate(true, index)}
                                style={isSelectionMode ? { cursor: 'pointer', border: isSelected ? '1px solid var(--primary-color)' : '1px solid transparent' } : {}}
                            >
                                <div className={Styles.cardHeader}>
                                    <div className={Styles.titleSection}>
                                        {/* SHOW CHECKBOX IN SELECTION MODE */}
                                        {isSelectionMode ? (
                                            <input 
                                                type="checkbox" 
                                                checked={isSelected} 
                                                readOnly 
                                                style={{ width: '24px', height: '24px', marginRight: '10px', accentColor: 'var(--primary-color)' }}
                                            />
                                        ) : (
                                            isCompleted ? <CheckedIcon color="var(--primary-color)" /> : <UncheckedIcon color="var(--secondary-color)" />
                                        )}
                                        
                                        <div>
                                            <h3 className={Styles.habitTitle} style={{ textDecoration: (!isSelectionMode && isCompleted) ? 'line-through' : 'none' }}>
                                                {item.title}
                                            </h3>
                                        </div>
                                    </div>

                                    {!isSelectionMode && !item.roadmapId && (
                                        <button className={Styles.menuBtn} onClick={(e) => toggleMenu(e, index)}>
                                            ⋮
                                        </button>
                                    )}
                                </div>

                                {item.description && (
                                    <p className={Styles.habitDesc}>"{item.description}"</p>
                                )}

                                {!isSelectionMode && (
                                    <div className={Styles.progressSection}>
                                        <div className={Styles.progressInfo}>
                                            <span>{isFlatList ? "Daily Total" : "Progress"}</span>
                                            <span>{statusText}</span>
                                        </div>
                                        <div className={Styles.progressBarBg}>
                                            <div
                                                className={Styles.progressBarFill}
                                                style={{
                                                    width: `${percent}%`,
                                                    backgroundColor: isCompleted ? '#4caf50' : 'var(--primary-color)'
                                                }}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {openMenuIndex === index && !isSelectionMode && (
                                <div className={Styles.menuDropdown}>
                                    <button className={Styles.menuItem} onClick={(e) => handleEditClick(e, index)}>Edit Habit</button>
                                    <button className={`${Styles.menuItem} ${Styles.deleteItem}`} onClick={(e) => handleDeleteClick(e, index)}>Delete</button>
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