import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Styles from "../assets/Styles/roadmapDetail.module.css";
import LeftArrow from "../assets/Icon/LeftArrow";
import StarIcon from "../assets/Icon/StarIcon"; 
import { useHabitProvider } from "../data/habitData";
import { useRoadmapProvider } from "../data/roadmapData"; 
import { useAuth } from "../data/AuthProvider"; 

const RoadmapDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { habit, setHabit, roadmapProgress } = useHabitProvider(); // Get roadmapProgress
  const { roadmaps, rateRoadmap } = useRoadmapProvider(); 
  const { currentUser } = useAuth(); 

  const [selectedDay, setSelectedDay] = useState(null);
  const [hoverRating, setHoverRating] = useState(0); 

  const initialData = location.state?.roadmapItem;
  const roadmapData = roadmaps.find(r => r.id === initialData?.id) || initialData;

  if (!roadmapData) return <div style={{padding:20}}>Roadmap not found. <button onClick={()=>navigate(-1)}>Back</button></div>;

  const isJoined = habit.some((h) => h.roadmapId === roadmapData.id);
  const currentCompletedDay = roadmapProgress?.[roadmapData.id] || 0; // Get progress
  
  const userId = currentUser?.uid || currentUser?.email || "guest";
  const userRating = roadmapData.ratings ? roadmapData.ratings[userId] : 0;

  // --- HANDLERS ---
  const handleJoin = () => {
    if (!roadmapData.days || roadmapData.days.length === 0) return alert("This roadmap is empty!");
    
    const allHabits = [];
    roadmapData.days.forEach(day => {
      day.habits.forEach(h => {
        allHabits.push({
          title: h.title,
          target: h.target || 1,
          unit: h.unit || "times",
          roadmapId: roadmapData.id,
          roadmapTitle: roadmapData.title,
          area: roadmapData.category,
          waktu: h.time || ["Morning"],
          goals: { count: 0, target: h.target || 1, satuan: h.unit || "times", ulangi: "per_day" },
          daySet: ["senin", "selasa", "rabu", "kamis", "jumat", "sabtu", "minggu"],
          waktuMulai: new Date().toISOString().split('T')[0],
          pengingat: "09:00",
          completedTimeSlots: [],
          dayNumber: day.dayNumber, // Ensure these are saved
          dayFocus: day.focus
        });
      });
    });

    const unique = Array.from(new Map(allHabits.map(item => [item.title, item])).values());
    setHabit([...habit, ...unique]);
    navigate("/habit", { state: { activeRoadmapId: roadmapData.id }});
  };

  const handleLeave = () => {
    if (window.confirm("Are you sure? This will remove all habits and progress for this roadmap.")) {
      const updatedHabits = habit.filter((h) => h.roadmapId !== roadmapData.id);
      setHabit(updatedHabits);
      navigate("/roadmap");
    }
  };

  const handleContinue = () => {
    navigate("/habit", { state: { activeRoadmapId: roadmapData.id }});
  };

  const onRate = (score) => {
      if(roadmapData.type !== 'community') return alert("Official roadmaps cannot be rated.");
      rateRoadmap(roadmapData.id, userId, score);
  };

  return (
    <div className={Styles.wrapper}>
      <div className={Styles.container}>
        <div style={{ marginBottom: "20px", cursor: "pointer", display: 'inline-flex' }} onClick={() => navigate(-1)}>
          <LeftArrow width="2rem" height="2rem" />
        </div>

        {/* HEADER */}
        <div className={Styles.header}>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:'10px'}}>
             <div>
                <span className={Styles.categoryBadge}>{roadmapData.category}</span>
                <h1 className={Styles.title}>{roadmapData.title}</h1>
             </div>
             
             <div style={{display:'flex', flexDirection:'column', alignItems:'flex-end'}}>
                 {/* Rating UI */}
                 <div style={{display:'flex', gap:'5px', cursor: roadmapData.type === 'community' ? 'pointer' : 'default'}}>
                    {[1, 2, 3, 4, 5].map((star) => (
                        <div 
                            key={star}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            onClick={() => onRate(star)}
                            style={{
                                color: (hoverRating || userRating) >= star ? '#FFD700' : '#e0e0e0',
                                transition: 'color 0.2s',
                                transform: hoverRating >= star ? 'scale(1.1)' : 'scale(1)'
                            }}
                        >
                            <StarIcon width="1.8rem" height="1.8rem" />
                        </div>
                    ))}
                 </div>
                 <span style={{fontSize:'0.8rem', color:'gray', marginTop:'5px'}}>
                    {userRating ? `You rated: ${userRating}/5` : "Rate this roadmap"} 
                    {' • '} 
                    <strong style={{color:'var(--font-color)'}}>{roadmapData.rating || 0} Avg</strong>
                 </span>
             </div>
          </div>

          <div className={Styles.metaRow}>
            <span>By {roadmapData.author || (roadmapData.type === 'official' ? 'Hexis Team' : 'Community')}</span>
          </div>
        </div>

        {/* STATS */}
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

        <div className={Styles.section}>
          <h3 className={Styles.sectionTitle}>Overview</h3>
          <p className={Styles.description}>
            {roadmapData.description || "No description provided for this roadmap."}
          </p>
        </div>

        {/* TIMELINE */}
        <div className={Styles.section}>
          <h3 className={Styles.sectionTitle}>Timeline</h3>
          <div className={Styles.dayList}>
            {roadmapData.days && roadmapData.days.length > 0 ? (
              roadmapData.days.map((day, index) => {
                const isCompleted = day.dayNumber <= currentCompletedDay;
                return (
                    <div
                    key={index}
                    className={Styles.dayCard}
                    onClick={() => setSelectedDay(day)}
                    style={isCompleted ? {borderLeft: '4px solid #4caf50'} : {}}
                    >
                    <div className={Styles.dayInfo}>
                        <h4 style={isCompleted ? {color:'#4caf50'} : {}}>
                            {isCompleted ? "✓ " : ""}Day {day.dayNumber}: {day.focus}
                        </h4>
                        <p>{day.habits.length} habits included</p>
                    </div>
                    <span className={Styles.arrowIcon}>→</span>
                    </div>
                );
              })
            ) : (
              <p>No days listed.</p>
            )}
          </div>
        </div>

        {/* FOOTER ACTIONS */}
        <div className={Styles.footer}>
          {isJoined ? (
            <div style={{display:'flex', gap:'10px', width:'100%'}}>
                <button
                    className={Styles.joinBtn}
                    style={{backgroundColor: 'transparent', color: '#ff4d4d', border: '1px solid #ff4d4d', flex: 1}}
                    onClick={handleLeave}
                >
                    Leave
                </button>
                <button
                    className={Styles.joinBtn}
                    style={{flex: 2}}
                    onClick={handleContinue}
                >
                    Continue Journey
                </button>
            </div>
          ) : (
            <button
                className={Styles.joinBtn}
                onClick={handleJoin}
            >
                Start Roadmap
            </button>
          )}
        </div>

      </div>

      {/* MODAL */}
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
                  <div className={Styles.modalIcon}>
                      {selectedDay.dayNumber <= currentCompletedDay ? "✅" : "⬜"}
                  </div>
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