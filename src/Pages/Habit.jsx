import style from "../assets/Styles/habit.module.css";
import AddHabitStyles from "../assets/Styles/addhabit.module.css"; 
import HabitItem from "./Components/HabitItem";
import { Link, useNavigate } from "react-router-dom";
import { useState, useMemo, useEffect, useRef } from "react";
import NavbarStyles from "../assets/Styles/navbar.module.css";
import BurgerIcon from "../assets/Icon/SideBar/BurgerIcon";
import BasilFireOutline from "../assets/Icon/BasilFireOutline";
import SideBar from "./Components/SideBar";
import { useHabitProvider } from "../data/habitData";
import AddHabitIcon from "../assets/Icon/AddHabitIcon";
import AddHabit from "./AddHabit"; 

// --- TIMER COMPONENT ---
const TimerInterface = ({ habit, onSave, onClose }) => {
  const [isActive, setIsActive] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const intervalRef = useRef(null);

  const formatTime = (totalSeconds) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const toggleTimer = () => {
    if (isActive) { clearInterval(intervalRef.current); setIsActive(false); }
    else { setIsActive(true); intervalRef.current = setInterval(() => setSeconds(p => p + 1), 1000); }
  };

  const handleFinish = () => {
    clearInterval(intervalRef.current);
    setIsActive(false);
    let added = habit.goals.satuan === "hours" ? parseFloat((seconds / 3600).toFixed(2)) : Math.floor(seconds / 60);
    if (added > 0) onSave((habit.goals.count || 0) + added);
    else onClose();
  };

  useEffect(() => () => clearInterval(intervalRef.current), []);

  return (
    <div className={style.counterWrapper}>
      <div className={style.timerDisplay}>{formatTime(seconds)}</div>
      <div style={{color: "gray", fontSize: "0.9rem", marginBottom: "20px"}}>
         Current Progress: {habit.goals.count} / {habit.goals.target} {habit.goals.satuan}
      </div>
      <div className={style.timerControls}>
        {!isActive && seconds > 0 && <button className={`${style.timerBtn} ${style.resetBtn}`} onClick={() => setSeconds(0)}>↺</button>}
        <button className={`${style.timerBtn} ${isActive ? style.stopBtn : style.startBtn}`} onClick={toggleTimer}>{isActive ? "⏸" : "▶"}</button>
        <button className={style.timerBtn} style={{backgroundColor: "var(--primary-color)", color: "white"}} onClick={handleFinish}>✔</button>
      </div>
    </div>
  );
};

// --- MAIN COMPONENT ---
const Habit = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");
  
  // Filters
  const [filterStatus, setFilterStatus] = useState("all"); 
  const [filterTime, setFilterTime] = useState("all"); 
  const [activeRoadmapId, setActiveRoadmapId] = useState(null);
  const [activeDay, setActiveDay] = useState(1);

  // Modals
  const [isAddHabitOpen, setIsAddHabitOpen] = useState(false); 
  const [isRoadmapSelectorOpen, setIsRoadmapSelectorOpen] = useState(false);
  const [habitToEdit, setHabitToEdit] = useState(null); 
  const [isProgressOpen, setIsProgressOpen] = useState(false);
  const [popUpContent, setPopUpContent] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(null);

  // --- GET STREAK DATA ---
  const { habit, setHabit, userStreak, updateStreak } = useHabitProvider();
  const navigate = useNavigate();

  // --- 1. EXTRACT ROADMAPS ---
  const joinedRoadmaps = useMemo(() => {
    const map = new Map();
    habit.forEach(h => {
        if (h.roadmapId) {
            if (!map.has(h.roadmapId)) {
                map.set(h.roadmapId, { 
                    id: h.roadmapId, 
                    title: h.roadmapTitle || `Roadmap ${h.roadmapId}`,
                    description: h.roadmapDescription || "Your journey continues...",
                    habits: []
                });
            }
            map.get(h.roadmapId).habits.push(h);
        }
    });

    return Array.from(map.values()).map(roadmap => {
        const total = roadmap.habits.length;
        const completed = roadmap.habits.filter(h => (h.goals.count || 0) >= (h.goals.target || 1)).length;
        const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
        return { ...roadmap, percent };
    });
  }, [habit]);

  // --- 2. AUTO-SELECT ---
  useEffect(() => {
    if (activeTab === "roadmap" && joinedRoadmaps.length > 0) {
        const exists = joinedRoadmaps.some(r => r.id === activeRoadmapId);
        if (!activeRoadmapId || !exists) {
            setActiveRoadmapId(joinedRoadmaps[0].id);
            setActiveDay(1);
        }
    }
  }, [activeTab, joinedRoadmaps, activeRoadmapId]);

  const activeRoadmapData = useMemo(() => 
    joinedRoadmaps.find(r => r.id === activeRoadmapId), 
  [activeRoadmapId, joinedRoadmaps]);

  // --- 3. AVAILABLE DAYS ---
  const availableDays = useMemo(() => {
    if (!activeRoadmapId) return [];
    const roadmapHabits = habit.filter(h => h.roadmapId === activeRoadmapId);
    const days = new Set(roadmapHabits.map(h => h.dayNumber || 1));
    return Array.from(days).sort((a, b) => a - b);
  }, [habit, activeRoadmapId]);

  // --- 4. FILTERING ---
  const filteredHabits = useMemo(() => {
    if (!habit) return [];
    return habit.filter((item) => {
      if (activeTab === "personal") {
         if (item.roadmapId) return false;
      } else {
         if (!item.roadmapId) return false;
         if (item.roadmapId !== activeRoadmapId) return false;
         if (item.dayNumber && item.dayNumber !== activeDay) return false;
      }

      const current = item.goals.count || 0;
      const target = item.goals.target || 1;
      const isCompleted = current >= target;
      if (filterStatus === "completed" && !isCompleted) return false;
      if (filterStatus === "incomplete" && isCompleted) return false;

      if (filterTime !== "all") {
        if (filterTime === "Anytime") { if (item.waktu && item.waktu.length > 0) return false; }
        else { if (!item.waktu || !item.waktu.includes(filterTime)) return false; }
      }
      return true; 
    });
  }, [habit, activeTab, activeRoadmapId, activeDay, filterStatus, filterTime]);

  const activeDayFocus = useMemo(() => {
    if (activeTab !== "roadmap" || !activeRoadmapId) return null;
    const habitWithFocus = filteredHabits.find(h => h.dayFocus);
    return habitWithFocus ? habitWithFocus.dayFocus : null;
  }, [filteredHabits, activeTab, activeRoadmapId]);

  // --- HANDLERS ---
  const handleCardClick = (clickedHabit) => {
    const realIndex = habit.findIndex(h => h.id === clickedHabit.id);
    setPopUpContent({ ...clickedHabit }); 
    setCurrentIndex(realIndex);
    setIsProgressOpen(true);
  };

  const handleEditHabit = (clickedHabit) => {
    setHabitToEdit(clickedHabit); 
    setIsAddHabitOpen(true);
  };

  const handleSaveHabit = (data) => {
    if (habitToEdit) {
        setHabit(habit.map(h => h.id === habitToEdit.id ? data : h));
    } else {
        setHabit([...habit, { ...data, id: Date.now() }]);
    }
    setIsAddHabitOpen(false);
    setHabitToEdit(null);
  };

  const saveHabitProgress = (newCount) => {
    if (currentIndex !== null && popUpContent) {
        const updated = [...habit];
        updated[currentIndex] = { ...popUpContent, goals: { ...popUpContent.goals, count: newCount } };
        setHabit(updated);
        
        // --- TRIGGER STREAK UPDATE ---
        if (newCount > (habit[currentIndex].goals.count || 0)) {
            updateStreak();
        }
    }
    setIsProgressOpen(false);
    setCurrentIndex(null);
  };

  const handleDelete = (clickedHabit) => {
    const realIndex = habit.findIndex(h => h.id === clickedHabit.id);
    if (realIndex !== -1) setHabit(habit.filter((_, i) => i !== realIndex));
  };

  const ProgressPopUp = () => {
    if (!popUpContent) return null;
    const isTimer = ["minutes", "hours"].includes(popUpContent.goals.satuan);
    return (
      <div className={style.popUp}>
        <div className={style.popUpBackground} onClick={() => setIsProgressOpen(false)} />
        <div className={style.popUpCard}>
          <button className={style.closeBtn} onClick={() => setIsProgressOpen(false)}>×</button>
          <h3 style={{fontSize: "1.3rem", textAlign: "center", margin: "10px 0"}}>{popUpContent.title}</h3>
          {isTimer ? (
            <TimerInterface habit={popUpContent} onSave={saveHabitProgress} onClose={() => setIsProgressOpen(false)} />
          ) : (
            <div className={style.counterWrapper}>
               <p style={{color: "gray", fontSize: "0.9rem"}}>How many {popUpContent.goals.satuan} today?</p>
               <div className={style.counterControls}>
                  <button onClick={() => setPopUpContent(p => ({...p, goals: {...p.goals, count: Math.max(0, p.goals.count - 1)}}))} className={style.counterBtn}>-</button>
                  <span className={style.counterDisplay}>{popUpContent.goals.count}</span>
                  <button onClick={() => setPopUpContent(p => ({...p, goals: {...p.goals, count: p.goals.count + 1}}))} className={style.counterBtn}>+</button>
               </div>
               <p style={{ fontSize: "0.9rem", color: "var(--primary-color)", marginTop: "5px" }}>Target: {popUpContent.goals.target}</p>
               <button onClick={() => saveHabitProgress(popUpContent.goals.count)} style={{ marginTop: "15px", padding: "12px", backgroundColor: "var(--primary-color)", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold", width: "100%", fontSize: "1rem" }}>Save Progress</button>
            </div>
          )}
        </div>
      </div>
    );
  };

  const timeGroups = [{ label: "Morning", icon: "🌅" }, { label: "Afternoon", icon: "☀️" }, { label: "Evening", icon: "🌙" }];
  const groupsToRender = filterTime === "all" ? timeGroups : (filterTime === "Anytime" ? [] : timeGroups.filter(g => g.label === filterTime));

  return (
    <div className={style.wrapper}>
      {isProgressOpen && <ProgressPopUp />}
      
      {isAddHabitOpen && (
        <div className={AddHabitStyles.modalOverlay} style={{zIndex: 200, position:'fixed', top:0, left:0, width:'100%', height:'100%', background:'rgba(0,0,0,0.5)', display:'flex', justifyContent:'center', alignItems:'center'}}>
           <div style={{width: '500px', maxHeight: '90vh', overflowY: 'auto', background: 'var(--surface-color)', borderRadius: '8px'}}>
              <AddHabit 
                 onSave={handleSaveHabit} 
                 onCancel={() => { setIsAddHabitOpen(false); setHabitToEdit(null); }} 
                 habitToEdit={habitToEdit} 
              />
           </div>
        </div>
      )}

      {isRoadmapSelectorOpen && (
        <div className={style.popUp}>
            <div className={style.popUpBackground} onClick={() => setIsRoadmapSelectorOpen(false)} />
            <div className={style.popUpCard} style={{maxWidth: '450px'}}>
                <button className={style.closeBtn} onClick={() => setIsRoadmapSelectorOpen(false)}>×</button>
                <h3 style={{margin: '0 0 15px 0'}}>Switch Roadmap</h3>
                <div className={style.selectorList}>
                    {joinedRoadmaps.map((rm) => (
                        <div 
                            key={rm.id} 
                            className={`${style.selectorCard} ${activeRoadmapId === rm.id ? style.active : ''}`}
                            onClick={() => {
                                setActiveRoadmapId(rm.id);
                                setActiveDay(1);
                                setIsRoadmapSelectorOpen(false);
                            }}
                        >
                            <div className={style.roadmapMeta}>
                                <span className={style.roadmapTitle}>{rm.title}</span>
                                <span style={{fontSize:'0.8rem', fontWeight:'bold', color:'var(--primary-color)'}}>{rm.percent}%</span>
                            </div>
                            <p className={style.roadmapDesc}>{rm.description}</p>
                            <div className={style.miniProgress}>
                                <div className={style.miniFill} style={{width: `${rm.percent}%`}}></div>
                            </div>
                        </div>
                    ))}
                </div>
                <button 
                    onClick={() => navigate("/roadmap")}
                    style={{marginTop: '10px', padding: '12px', background: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold'}}
                >
                    + Join New Roadmap
                </button>
            </div>
        </div>
      )}

      <SideBar isOpen={isOpen} onClose={() => setIsOpen(false)} />
      <div className={NavbarStyles.header}>
        <button onClick={() => setIsOpen(true)} className={NavbarStyles.menuBtn}>
          <BurgerIcon color="var(--font-color)" width="2rem" height="2rem" />
        </button>
        
        {/* --- DYNAMIC STREAK --- */}
        <div className={NavbarStyles.streak}>
          <BasilFireOutline width="2rem" height="2rem" />
          <span>{userStreak ? userStreak.count : 0}</span>
        </div>
      </div>

      <div className={style.container}>
        <div className={style.nav}>
          <button onClick={() => setActiveTab("personal")} className={`${style.navItem} ${activeTab === "personal" ? style.active : ""}`}>Personal</button>
          <button onClick={() => setActiveTab("roadmap")} className={`${style.navItem} ${activeTab === "roadmap" ? style.active : ""}`}>Roadmap</button>
        </div>

        <div className={style.controls}>
          {activeTab === "roadmap" && (
             <div style={{flex: 1, marginRight: 'auto'}}> 
                {joinedRoadmaps.length > 0 ? (
                    <button 
                        className={style.selectorTrigger}
                        onClick={() => setIsRoadmapSelectorOpen(true)}
                    >
                        <div className={style.triggerLabel}>
                            <span className={style.triggerSubtitle}>Active Roadmap</span>
                            <span className={style.triggerTitle}>{activeRoadmapData?.title || "Select Roadmap"}</span>
                        </div>
                        <span style={{color: 'var(--primary-color)'}}>▼</span>
                    </button>
                ) : (
                    <button 
                        className={style.iconBtnSmall} 
                        style={{width: 'auto', padding: '0 15px'}}
                        onClick={() => navigate("/roadmap")}
                    >
                        Explore Roadmaps
                    </button>
                )}
             </div>
          )}

          <select className={style.filterSelect} value={filterTime} onChange={(e) => setFilterTime(e.target.value)}>
            <option value="all">All Day</option>
            <option value="Morning">Morning</option>
            <option value="Afternoon">Afternoon</option>
            <option value="Evening">Evening</option>
            <option value="Anytime">Anytime</option>
          </select>
          <select className={style.filterSelect} value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="all">All Status</option>
            <option value="incomplete">To Do</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {/* --- RESTORED DROPDOWN DAY SELECTOR --- */}
        {activeTab === "roadmap" && activeRoadmapId && availableDays.length > 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "15px" }}>
                <span style={{ 
                    fontWeight: "bold", 
                    color: "var(--secondary-font-color)",
                    fontSize: "1rem",
                    whiteSpace: "nowrap" 
                }}>
                    Day :
                </span>
                
                <select 
                    value={activeDay} 
                    onChange={(e) => setActiveDay(Number(e.target.value))}
                    className={style.filterSelect}
                    style={{ 
                        flex: 1, 
                        textAlign: 'left', 
                        cursor: 'pointer',
                        fontWeight: '600'
                    }} 
                >
                    {availableDays.map((d) => (
                        <option key={d} value={d}>
                            Day {d}
                        </option>
                    ))}
                </select>
            </div>
        )}

        {activeTab === "roadmap" && activeDayFocus && (
            <div className={style.focusBanner}>
                <h4>Today's Focus</h4>
                <p>{activeDayFocus}</p>
            </div>
        )}

        <div>
          {filteredHabits.length === 0 ? <p style={{ textAlign: "center", color: "gray", marginTop: "40px" }}>No habits for this section.</p> : (
            <>
              {groupsToRender.map((group) => {
                const groupHabits = filteredHabits.filter(h => h.waktu && h.waktu.includes(group.label));
                if (groupHabits.length === 0) return null;
                return (
                  <div key={group.label} className={style.timeSection}>
                    <h3 className={style.timeHeader}>{group.label} <span>{group.icon}</span></h3>
                    <HabitItem 
                        onUpdate={(_, idx) => handleCardClick(groupHabits[idx])} 
                        onEdit={(idx) => handleEditHabit(groupHabits[idx])} 
                        onDelete={(idx) => handleDelete(groupHabits[idx])} 
                        habits={groupHabits} 
                        timeContext={group.label} 
                    />
                  </div>
                );
              })}
              {(filterTime === "all" || filterTime === "Anytime") && (() => {
                 const anytime = filteredHabits.filter(h => !h.waktu || h.waktu.length === 0);
                 return anytime.length > 0 && (
                   <div className={style.timeSection}>
                     <h3 className={style.timeHeader}>Anytime</h3>
                     <HabitItem 
                        onUpdate={(_, idx) => handleCardClick(anytime[idx])} 
                        onEdit={(idx) => handleEditHabit(anytime[idx])} 
                        onDelete={(idx) => handleDelete(anytime[idx])} 
                        habits={anytime} 
                     />
                   </div>
                 );
              })()}
            </>
          )}
        </div>

        {activeTab === "personal" && (
          <button className={style.addHabitBtn} onClick={() => { setHabitToEdit(null); setIsAddHabitOpen(true); }}>
            <AddHabitIcon width="2rem" height="2rem" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Habit;