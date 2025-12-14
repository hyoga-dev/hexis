import style from "../assets/Styles/habit.module.css";
import AddHabitStyles from "../assets/Styles/addhabit.module.css";

import { useNavigate } from "react-router-dom";
import { useState, useMemo, useEffect } from "react";

// Data & Icons
import { useHabitProvider } from "../data/habitData";
import { useRoadmapProvider } from "../data/roadmapData";
import SideBar from "./Components/SideBar";
import AddHabit from "./AddHabit";
import AddHabitIcon from "../assets/Icon/AddHabitIcon";

// Components
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

  // Selection Mode State
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedHabitIds, setSelectedHabitIds] = useState(new Set());

  const [isAddHabitOpen, setIsAddHabitOpen] = useState(false);
  const [isRoadmapSelectorOpen, setIsRoadmapSelectorOpen] = useState(false);
  const [habitToEdit, setHabitToEdit] = useState(null);
  const [isProgressOpen, setIsProgressOpen] = useState(false);
  const [popUpContent, setPopUpContent] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(null);

  const {
    habit,    
    userStreak,
    roadmapProgress,
    checkRoadmapCompletion,
    addHabit,
    updateHabit,
    deleteHabit,
    deleteHabits,
    logActivity,
    loading
  } = useHabitProvider();

  const { roadmaps } = useRoadmapProvider();

  const navigate = useNavigate();

  // --- Memos ---
  const joinedRoadmaps = useMemo(() => {
    const map = new Map();
    habit.forEach(h => {
      if (h.roadmapId) {
        if (!map.has(h.roadmapId)) {
          const original = roadmaps.find(r => r.id === h.roadmapId);
          map.set(h.roadmapId, {
            id: h.roadmapId,
            title: h.roadmapTitle || original?.title || `Roadmap ${h.roadmapId}`,
            description: h.roadmapDescription || original?.description || "Your journey continues...",
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
  }, [habit, roadmaps]);

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
      // 1. Tab Filtering
      if (activeTab === "personal") {
        if (item.roadmapId) return false;
      } else {
        if (item.roadmapId !== activeRoadmapId) return false;
        if (item.dayNumber && item.dayNumber !== activeDay) return false;
      }

      // 2. Time Filtering
      // Note: Even in selection mode (flat list), we respect the time filter 
      // so users can say "Select all Morning habits" if they want.
      if (filterTime !== "all") {
        if (filterTime === "Anytime") { if (item.waktu && item.waktu.length > 0) return false; }
        else { if (!item.waktu || !item.waktu.includes(filterTime)) return false; }
      }
      return true;
    });
  }, [habit, activeTab, activeRoadmapId, activeDay, filterTime]);

  const activeDayFocus = useMemo(() => {
    if (activeTab !== "roadmap" || !activeRoadmapId) return null;
    const habitWithFocus = filteredHabits.find(h => h.dayFocus);
    return habitWithFocus ? habitWithFocus.dayFocus : null;
  }, [filteredHabits, activeTab, activeRoadmapId]);

  const handleTabChange = (tab) => {
      setActiveTab(tab);
      setIsSelectionMode(false);
      setSelectedHabitIds(new Set());
  };

  // --- Handlers ---
  const toggleSelectionMode = () => {
      setIsSelectionMode(!isSelectionMode);
      setSelectedHabitIds(new Set()); 
  };

  const handleToggleSelectHabit = (id) => {
      const newSelection = new Set(selectedHabitIds);
      if (newSelection.has(id)) newSelection.delete(id);
      else newSelection.add(id);
      setSelectedHabitIds(newSelection);
  };

  const handleDeleteSelected = () => {
      if (selectedHabitIds.size === 0) return;
      if (window.confirm(`Delete ${selectedHabitIds.size} selected habit(s)?`)) {
          deleteHabits(Array.from(selectedHabitIds));
          setIsSelectionMode(false);
          setSelectedHabitIds(new Set());
      }
  };

  const handleCardClick = (clickedHabit, timeContext) => {
    if (isSelectionMode) {
        handleToggleSelectHabit(clickedHabit.id);
        return;
    }
    if (!clickedHabit) return;

    let habitToOpen = { ...clickedHabit };

    if (!habitToOpen.completion) {
      const newCompletion = {};
      const oldCount = habitToOpen.goals?.count || 0;
      if (oldCount > 0 && (!habitToOpen.waktu || habitToOpen.waktu.length <= 1)) {
        const slot = habitToOpen.waktu?.[0] || "Anytime";
        newCompletion[slot] = oldCount;
      }
      habitToOpen.completion = newCompletion;
    }

    const time = timeContext || (clickedHabit.waktu?.length > 0 ? clickedHabit.waktu[0] : "Anytime");
    const realIndex = habit.findIndex(h => h.id === habitToOpen.id);
    setPopUpContent({ ...habitToOpen, timeContext: time });
    setCurrentIndex(realIndex);
    setIsProgressOpen(true);
  };

  const handleEditHabit = (clickedHabit) => {
    setHabitToEdit(clickedHabit);
    setIsAddHabitOpen(true);
  };

  const handleSaveHabit = (data) => {
    if (habitToEdit) {
      updateHabit(habitToEdit.id, data);
    } else {
      addHabit(data);
    }
    setIsAddHabitOpen(false);
    setHabitToEdit(null);
  };

  const saveHabitProgress = (newSlotCount) => {
    if (currentIndex !== null && popUpContent) {
      const habitToUpdate = habit[currentIndex];
      const timeContext = popUpContent.timeContext;
      const targetPerSlot = habitToUpdate.goals.target || 1;

      const oldSlotCount = habitToUpdate.completion?.[timeContext] || 0;
      const wasSlotCompleted = oldSlotCount >= targetPerSlot;
      const isSlotCompleted = newSlotCount >= targetPerSlot;

      const newCompletion = { ...(habitToUpdate.completion || {}), [timeContext]: newSlotCount };
      const newTotalCount = Object.values(newCompletion).reduce((sum, val) => sum + val, 0);

      const updatedHabit = {
        ...habitToUpdate,
        completion: newCompletion,
        goals: { ...habitToUpdate.goals, count: newTotalCount }
      };
      
      updateHabit(updatedHabit.id, updatedHabit).then(() => {
        if (isSlotCompleted && !wasSlotCompleted) {
            logActivity(1);
        } else if (!isSlotCompleted && wasSlotCompleted) {
            logActivity(-1);
        }

        if (updatedHabit.roadmapId && updatedHabit.dayNumber) {
            setTimeout(() => {
            checkRoadmapCompletion(updatedHabit.roadmapId, updatedHabit.dayNumber);
            }, 50);
        }
      });
    }
    setIsProgressOpen(false);
    setCurrentIndex(null);
  };

  return (
    <div className={style.wrapper}>
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
          isSelectionMode={isSelectionMode}
          toggleSelectionMode={toggleSelectionMode}
          selectedCount={selectedHabitIds.size}
          onDeleteSelected={handleDeleteSelected}
        />

        {activeTab === "roadmap" && activeRoadmapId && availableDays.length > 0 && (
          <div className={style.daySelectorContainer}>
            <span className={style.daySelectorLabel}>Day :</span>
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

        {!loading && (
        <HabitList
          habits={filteredHabits}
          onHabitClick={handleCardClick}
          onEditHabit={handleEditHabit}
          onDeleteHabit={(h) => { if(h?.id) deleteHabit(h.id); }}
          filterTime={filterTime}
          ignoreSchedule={activeTab === "roadmap"}
          filterStatus={filterStatus}
          isSelectionMode={isSelectionMode}
          selectedIds={selectedHabitIds}
          // NEW PROP: Flatten list if in selection mode
          isFlatList={isSelectionMode}
        />
        )}
        
        {/* Add button hidden in selection mode */}
        {activeTab === "personal" && !isSelectionMode && (
          <button className={style.addHabitBtn} onClick={() => { setHabitToEdit(null); setIsAddHabitOpen(true); }}>
            <AddHabitIcon width="2rem" height="2rem" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Habit;