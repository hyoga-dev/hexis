import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Styles from "../assets/Styles/roadmapDetail.module.css";
import NavbarStyles from "../assets/Styles/navbar.module.css";
import BurgerIcon from "../assets/Icon/SideBar/BurgerIcon";
import SideBar from "./Components/SideBar";
import LeftArrow from "../assets/Icon/LeftArrow";
import { useHabitProvider } from "../data/habitData";

const RoadmapDetail = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { habit, setHabit } = useHabitProvider();

  // NEW: State for selected Day Popup
  const [selectedDay, setSelectedDay] = useState(null);

  const roadmapData = location.state?.roadmapItem;

  if (!roadmapData) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <p>No roadmap data found.</p>
        <button onClick={() => navigate("/roadmap")}>Back to List</button>
      </div>
    );
  }

  const isJoined = habit.some((h) => h.roadmapId === roadmapData.id);

  const handleToggleJoin = () => {
    if (isJoined) {
      if (window.confirm("Leave this roadmap?")) {
        const updatedHabits = habit.filter((h) => h.roadmapId !== roadmapData.id);
        setHabit(updatedHabits);
      }
    } else {
      if (!roadmapData.days || roadmapData.days.length === 0) {
        alert("This roadmap is empty!");
        return;
      }
      // Combine all habits from all days (De-duplication logic can be added here)
      const allHabits = [];
      roadmapData.days.forEach(day => {
        day.habits.forEach(h => {
          allHabits.push({
            title: h.title,
            target: h.target || 1,
            unit: h.unit || "times",
            // ... other props
            roadmapId: roadmapData.id,
            roadmapTitle: roadmapData.title,
            area: roadmapData.category,
            waktu: h.time || ["Morning"],
            goals: { count: 0, target: h.target, satuan: h.unit, ulangi: "per_day" },
            daySet: ["senin", "selasa", "rabu", "kamis", "jumat", "sabtu", "minggu"],
            waktuMulai: new Date().toISOString().split('T')[0],
            pengingat: "09:00",
            completedTimeSlots: []
          });
        });
      });

      // Simple dedupe by title
      const unique = Array.from(new Map(allHabits.map(item => [item.title, item])).values());
      setHabit([...habit, ...unique]);
      alert(`Joined! Added ${unique.length} habits.`);
    }
  };

  return (
    <div className={Styles.wrapper}>


      <div className={Styles.container}>

        {/* Back Button */}
        <div style={{ marginBottom: "20px", cursor: "pointer", display: 'inline-flex' }} onClick={() => navigate(-1)}>
          <LeftArrow width="2rem" height="2rem" />
        </div>

        {/* Header Info */}
        <div className={Styles.header}>
          <span className={Styles.categoryBadge}>{roadmapData.category}</span>
          <h1 className={Styles.title}>{roadmapData.title}</h1>
          <div className={Styles.metaRow}>
            <span>By {roadmapData.type === 'official' ? 'Hexis Team' : 'Community'}</span>
            {roadmapData.rating && <span>⭐ {roadmapData.rating}</span>}
          </div>
        </div>

        {/* Stats Grid */}
        <div className={Styles.statsGrid}>
          <div className={Styles.statCard}>
            <span className={Styles.statValue}>{roadmapData.days?.length || 0}</span>
            <span className={Styles.statLabel}>Days</span>
          </div>
          <div className={Styles.statCard}>
            <span className={Styles.statValue}>{roadmapData.days ? roadmapData.days.reduce((acc, d) => acc + d.habits.length, 0) : 0}</span>
            <span className={Styles.statLabel}>Total Habits</span>
          </div>
        </div>

        {/* Description */}
        <div className={Styles.section}>
          <h3 className={Styles.sectionTitle}>Overview</h3>
          <p className={Styles.description}>
            {roadmapData.description || "No description provided for this roadmap."}
          </p>
        </div>

        {/* --- DAY LIST --- */}
        <div className={Styles.section}>
          <h3 className={Styles.sectionTitle}>Timeline</h3>
          <div className={Styles.dayList}>
            {roadmapData.days && roadmapData.days.length > 0 ? (
              roadmapData.days.map((day, index) => (
                <div
                  key={index}
                  className={Styles.dayCard}
                  onClick={() => setSelectedDay(day)} // Open Popup
                >
                  <div className={Styles.dayInfo}>
                    <h4>Day {day.dayNumber}: {day.focus}</h4>
                    <p>{day.habits.length} habits included</p>
                  </div>
                  <span className={Styles.arrowIcon}>→</span>
                </div>
              ))
            ) : (
              <p>No days listed.</p>
            )}
          </div>
        </div>

        {/* Footer Action Button */}
        <div className={Styles.footer}>
          <button
            className={`${Styles.joinBtn} ${isJoined ? Styles.joinedBtn : ""}`}
            onClick={handleToggleJoin}
          >
            {isJoined ? "Leave Roadmap" : "Start Roadmap"}
          </button>
        </div>

      </div>

      {/* --- DAY DETAIL MODAL --- */}
      {selectedDay && (
        <div className={Styles.modalOverlay} onClick={() => setSelectedDay(null)}>
          <div className={Styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={Styles.modalHeader}>
              <div>
                <h2 className={Styles.modalTitle}>Day {selectedDay.dayNumber}</h2>
                <div className={Styles.modalSubtitle}>{selectedDay.focus}</div>
              </div>
              <button className={Styles.closeBtn} onClick={() => setSelectedDay(null)}>×</button>
            </div>

            <div className={Styles.modalHabitList}>
              {selectedDay.habits.map((h, i) => (
                <div key={i} className={Styles.modalHabitItem}>
                  <div className={Styles.modalIcon}>✅</div>
                  <div>
                    <div style={{ fontWeight: 'bold' }}>{h.title}</div>
                    <div style={{ fontSize: '0.85rem', color: 'gray' }}>
                      {h.target} {h.unit} • {h.time ? h.time.join(", ") : "Anytime"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default RoadmapDetail;