import { useState } from "react";
import Styles from "../../assets/Styles/habit.module.css";
import Icon from "../../assets/Images/goal.png";
import CheckedIcon from "../../assets/Images/checklist.png";

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

const HabitItem = ({ onUpdate, onEdit, onDelete, habits, timeContext }) => {
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
        if(window.confirm("Are you sure you want to delete this habit?")) {
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
                const scheduledForToday = isToday(item.daySet) || isTodayDate(item.daySet);
                
                // --- PROGRESS LOGIC ---
                const current = item.goals.count || 0;
                const target = item.goals.target || 1;
                // Calculate percentage (max 100%)
                const percent = Math.min((current / target) * 100, 100);
                const isCompleted = current >= target;

                // Status Text
                let statusText = `${current} / ${target} ${item.goals.satuan}`;
                let visualPercent = percent;

                // If in a time slot (Morning/etc), show simplified status if preferred, 
                // OR just show the global progress bar which is usually better.
                if (timeContext) {
                    const isSlotDone = item.completedTimeSlots && item.completedTimeSlots.includes(timeContext);
                    // Optionally override status text here if you want "Done" instead of numbers
                }

                if (scheduledForToday) {
                    return (
                        <div key={item.id || index} className={Styles.cardContainer}>
                            
                            <div className={Styles.card} onClick={() => onUpdate(true, index)}>
                                
                                <div className={Styles.cardHeader}>
                                    <div className={Styles.titleSection}>
                                        <img 
                                            src={isCompleted ? CheckedIcon : Icon} 
                                            alt="icon" 
                                            className={Styles.habitIcon}
                                            style={{ opacity: isCompleted ? 1 : 0.7 }}
                                        />
                                        <div>
                                            <h3 className={Styles.habitTitle} style={{textDecoration: isCompleted ? 'line-through' : 'none'}}>
                                                {item.title}
                                            </h3>
                                        </div>
                                    </div>

                                    {/* Hide menu for Roadmap items */}
                                    {!item.roadmapId && (
                                        <button className={Styles.menuBtn} onClick={(e) => toggleMenu(e, index)}>
                                            ⋮
                                        </button>
                                    )}
                                </div>

                                {item.description && (
                                    <p className={Styles.habitDesc}>"{item.description}"</p>
                                )}

                                {/* PROGRESS BAR SECTION */}
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
                                                // Green if complete, Primary Blue if in progress
                                                backgroundColor: isCompleted ? '#4caf50' : 'var(--primary-color)' 
                                            }} 
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Dropdown Menu */}
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