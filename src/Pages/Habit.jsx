import style from "../assets/Styles/habit.module.css";
import AddHabitStyles from "../assets/Styles/addhabit.module.css"; 
import HabitItem from "./Components/HabitItem";
import { Link } from "react-router-dom";
import { useState, useMemo, useEffect, useRef } from "react";
import NavbarStyles from "../assets/Styles/navbar.module.css";
import BurgerIcon from "../assets/Icon/SideBar/BurgerIcon";
import BasilFireOutline from "../assets/Icon/BasilFireOutline";
import SideBar from "./Components/SideBar";
import { useHabitProvider } from "../data/habitData";
import AddHabitIcon from "../assets/Icon/AddHabitIcon";
import AddHabit from "./AddHabit"; 

// --- TIMER COMPONENT (Same as before) ---
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

// --- MAIN PAGE ---
const Habit = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");
  
  // Filters
  const [filterStatus, setFilterStatus] = useState("all"); 
  const [filterTime, setFilterTime] = useState("all"); 
  const [activeRoadmapId, setActiveRoadmapId] = useState("all"); // RESTORED

  // Modals
  const [isAddHabitOpen, setIsAddHabitOpen] = useState(false); 
  const [habitToEdit, setHabitToEdit] = useState(null); 
  const [isProgressOpen, setIsProgressOpen] = useState(false);
  const [popUpContent, setPopUpContent] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(null);

  const { habit, setHabit } = useHabitProvider();

  // --- 1. EXTRACT JOINED ROADMAPS (RESTORED) ---
  const joinedRoadmaps = useMemo(() => {
    const map = new Map();
    habit.forEach(h => {
        if (h.roadmapId) {
            const title = h.roadmapTitle || `Roadmap ${h.roadmapId}`; // Fallback if title missing
            if (!map.has(h.roadmapId)) {
                map.set(h.roadmapId, title);
            }
        }
    });
    return Array.from(map, ([id, title]) => ({ id, title }));
  }, [habit]);

  // --- 2. FILTERING LOGIC ---
  const filteredHabits = useMemo(() => {
    if (!habit) return [];
    return habit.filter((item) => {
      
      // A. TAB FILTER
      if (activeTab === "personal") {
         if (item.roadmapId) return false;
      } else {
         if (!item.roadmapId) return false;
         // B. SUB-ROADMAP FILTER (RESTORED)
         if (activeRoadmapId !== "all" && item.roadmapId !== activeRoadmapId) return false;
      }

      // C. STATUS FILTER
      const current = item.goals.count || 0;
      const target = item.goals.target || 1;
      const isCompleted = current >= target;
      if (filterStatus === "completed" && !isCompleted) return false;
      if (filterStatus === "incomplete" && isCompleted) return false;

      // D. TIME FILTER
      if (filterTime !== "all") {
        if (filterTime === "Anytime") { if (item.waktu && item.waktu.length > 0) return false; }
        else { if (!item.waktu || !item.waktu.includes(filterTime)) return false; }
      }
      return true; 
    });
  }, [habit, activeTab, activeRoadmapId, filterStatus, filterTime]);

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
    }
    setIsProgressOpen(false);
    setCurrentIndex(null);
  };

  const handleDelete = (clickedHabit) => {
    const realIndex = habit.findIndex(h => h.id === clickedHabit.id);
    if (realIndex !== -1) setHabit(habit.filter((_, i) => i !== realIndex));
  };

  // --- POPUP ---
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

  // --- RENDER ---
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

      <SideBar isOpen={isOpen} onClose={() => setIsOpen(false)} />
      <div className={NavbarStyles.header}>
        <button onClick={() => setIsOpen(true)} className={NavbarStyles.menuBtn}>
          <BurgerIcon color="var(--font-color)" width="2rem" height="2rem" />
        </button>
        <div className={NavbarStyles.streak}>
          <BasilFireOutline width="2rem" height="2rem" />
          <span>4</span>
        </div>
      </div>

      <div className={style.container}>
        <div className={style.nav}>
          <button onClick={() => setActiveTab("personal")} className={`${style.navItem} ${activeTab === "personal" ? style.active : ""}`}>Personal</button>
          <button onClick={() => setActiveTab("roadmap")} className={`${style.navItem} ${activeTab === "roadmap" ? style.active : ""}`}>Roadmap</button>
        </div>

        {/* --- RESTORED ROADMAP SUB-MENU --- */}
        {activeTab === "roadmap" && joinedRoadmaps.length > 0 && (
            <div className={style.subNav}>
                <button 
                    className={`${style.subNavItem} ${activeRoadmapId === "all" ? style.activeSub : ""}`}
                    onClick={() => setActiveRoadmapId("all")}
                >
                    All Roadmaps
                </button>
                {joinedRoadmaps.map((rm) => (
                    <button 
                        key={rm.id}
                        className={`${style.subNavItem} ${activeRoadmapId === rm.id ? style.activeSub : ""}`}
                        onClick={() => setActiveRoadmapId(rm.id)}
                    >
                        {rm.title}
                    </button>
                ))}
            </div>
        )}

        <div className={style.controls}>
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

        <div>
          {filteredHabits.length === 0 ? <p style={{ textAlign: "center", color: "gray", marginTop: "40px" }}>No habits found.</p> : (
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