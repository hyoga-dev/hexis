import style from "../assets/Styles/habit.module.css";
import AddHabitStyles from "../assets/Styles/addhabit.module.css";

import { useNavigate } from "react-router-dom";
import { useState, useMemo, useEffect } from "react";

// Data & Icons
import { useHabitProvider } from "../data/habitData";
import SideBar from "./Components/SideBar";
import AddHabit from "./AddHabit";
import AddHabitIcon from "../assets/Icon/AddHabitIcon";

// New Components
import HabitProgressModal from "./Components/HabitProgressModal";
import RoadmapSelectorModal from "./Components/RoadmapSelectorModal";
import HabitPageHeader from "./Components/HabitPageHeader";
import HabitTabs from "./Components/HabitTabs";
import HabitControls from "./Components/HabitControls";
import HabitList from "./Components/HabitList";

const Habit = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");

  const [filterStatus, setFilterStatus] = useState("all");
  const [filterTime, setFilterTime] = useState("all");
  const [activeRoadmapId, setActiveRoadmapId] = useState(null);
  const [activeDay, setActiveDay] = useState(1);

  const [isAddHabitOpen, setIsAddHabitOpen] = useState(false);
  const [isRoadmapSelectorOpen, setIsRoadmapSelectorOpen] = useState(false);
  const [habitToEdit, setHabitToEdit] = useState(null);
  const [isProgressOpen, setIsProgressOpen] = useState(false);
  const [popUpContent, setPopUpContent] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(null);

  const {
    habit,
    setHabit,
    userStreak,
    logActivity,
    roadmapProgress,
    checkRoadmapCompletion
  } = useHabitProvider();

  const navigate = useNavigate();

  // --- Memos & Derived State ---
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

  useEffect(() => {
    if (activeTab === "roadmap" && joinedRoadmaps.length > 0) {
      if (!activeRoadmapId || !joinedRoadmaps.some(r => r.id === activeRoadmapId)) {
        const defaultRoadmapId = joinedRoadmaps[0].id;
        setActiveRoadmapId(defaultRoadmapId);
        const completedDay = roadmapProgress?.[defaultRoadmapId] || 0;
        setActiveDay(completedDay + 1);
      } else {
        const completedDay = roadmapProgress?.[activeRoadmapId] || 0;
        if (activeDay <= completedDay) {
          setActiveDay(completedDay + 1);
        }
      }
    }
  }, [activeTab, joinedRoadmaps, activeRoadmapId, roadmapProgress]);

  const activeRoadmapData = useMemo(() =>
    joinedRoadmaps.find(r => r.id === activeRoadmapId),
    [activeRoadmapId, joinedRoadmaps]);

  const availableDays = useMemo(() => {
    if (!activeRoadmapId) return [];
    const roadmapHabits = habit.filter(h => h.roadmapId === activeRoadmapId);
    const days = new Set(roadmapHabits.map(h => h.dayNumber || 1));
    return Array.from(days).sort((a, b) => a - b);
  }, [habit, activeRoadmapId]);

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

  const handleTabChange = (tab) => setActiveTab(tab);

  // --- Handlers ---
  const handleCardClick = (clickedHabit) => {

    if (!clickedHabit) {
      console.error("Clicked habit is undefined");
      return;
    }

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
      const oldHabit = habit[currentIndex];
      const oldCount = oldHabit.goals.count || 0;
      const target = oldHabit.goals.target || 1;

      const wasCompleted = oldCount >= target;
      const isCompleted = newCount >= target;

      const updated = [...habit];
      const updatedHabit = { ...popUpContent, goals: { ...popUpContent.goals, count: newCount } };
      updated[currentIndex] = updatedHabit;
      setHabit(updated);

      if (!wasCompleted && isCompleted) {
        logActivity(1);
      } else if (wasCompleted && !isCompleted) {
        logActivity(-1);
      }

      if (updatedHabit.roadmapId && updatedHabit.dayNumber) {
        setTimeout(() => {
          checkRoadmapCompletion(updatedHabit.roadmapId, updatedHabit.dayNumber);
        }, 50);
      }
    }
    setIsProgressOpen(false);
    setCurrentIndex(null);
  };

  const handleDelete = (clickedHabit) => {
    const realIndex = habit.findIndex(h => h.id === clickedHabit.id);
    if (realIndex !== -1) setHabit(habit.filter((_, i) => i !== realIndex));
  };

  return (
    <div className={style.wrapper}>
      {/* --- Refactored Components --- */}
      {isProgressOpen && (
        <HabitProgressModal
          popUpContent={popUpContent}
          onClose={() => setIsProgressOpen(false)}
          onSave={saveHabitProgress}
          setPopUpContent={setPopUpContent}
        />
      )}

      <RoadmapSelectorModal
        isOpen={isRoadmapSelectorOpen}
        onClose={() => setIsRoadmapSelectorOpen(false)}
        roadmaps={joinedRoadmaps}
        activeId={activeRoadmapId}
        onSelect={(rm) => {
          setActiveRoadmapId(rm.id);
          const completedDay = roadmapProgress?.[rm.id] || 0;
          setActiveDay(completedDay + 1);
          setIsRoadmapSelectorOpen(false);
        }}
        onExplore={() => navigate("/roadmap")}
      />

      {isAddHabitOpen && (
        <div className={AddHabitStyles.modalOverlay}>
          <div className={AddHabitStyles.addHabitModalContent}>
            <AddHabit
              onSave={handleSaveHabit}
              onCancel={() => { setIsAddHabitOpen(false); setHabitToEdit(null); }}
              habitToEdit={habitToEdit}
            />
          </div>
        </div>
      )}

      {/* --- Page Layout --- */}
      <SideBar isOpen={isOpen} onClose={() => setIsOpen(false)} />

      <HabitPageHeader onMenuClick={() => setIsOpen(true)} streak={userStreak ? userStreak.count : 0} />

      <div className={style.container}>
        <HabitTabs activeTab={activeTab} onTabChange={handleTabChange} />

        <HabitControls
          activeTab={activeTab}
          joinedRoadmaps={joinedRoadmaps}
          activeRoadmapData={activeRoadmapData}
          onRoadmapSelectorOpen={() => setIsRoadmapSelectorOpen(true)}
          filterTime={filterTime}
          setFilterTime={setFilterTime}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
        />

        {activeTab === "roadmap" && activeRoadmapId && availableDays.length > 0 && (
          <div className={style.daySelectorContainer}>
            <span className={style.daySelectorLabel}>
              Day :
            </span>
            <select
              value={activeDay}
              onChange={(e) => setActiveDay(Number(e.target.value))}
              className={`${style.filterSelect} ${style.daySelectorDropdown}`}
            >
              {availableDays.map((d) => (
                <option key={d} value={d}>Day {d}</option>
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

        <HabitList
          habits={filteredHabits}
          onHabitClick={handleCardClick}
          onEditHabit={handleEditHabit}
          onDeleteHabit={handleDelete}
          filterTime={filterTime}
          ignoreSchedule={activeTab === "roadmap"}
        />

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