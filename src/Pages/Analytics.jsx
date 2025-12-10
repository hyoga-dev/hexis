import { useState, useMemo } from "react";
import Styles from "../assets/Styles/analytics.module.css";
import NavbarStyle from "../assets/Styles/navbar.module.css";
import BurgerIcon from "../assets/Icon/SideBar/BurgerIcon";
import SideBar from "./Components/SideBar";
import { useHabitProvider } from "../data/habitData";

const Analytics = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { habit, userStreak } = useHabitProvider();

  // --- 1. CALCULATE REAL STATS ---
  const stats = useMemo(() => {
    if (!habit || habit.length === 0) return { total: 0, completed: 0, rate: 0 };

    const total = habit.length;
    // Count habits where count >= target
    const completed = habit.filter(h => (h.goals.count || 0) >= (h.goals.target || 1)).length;
    const rate = Math.round((completed / total) * 100);

    return { total, completed, rate };
  }, [habit]);

  // --- 2. MOCK WEEKLY DATA (Since we don't have DB history yet) ---
  // This simulates data for the bar chart
  const weeklyData = [
    { day: "Mon", value: 40 },
    { day: "Tue", value: 65 },
    { day: "Wed", value: 30 },
    { day: "Thu", value: 85 },
    { day: "Fri", value: 50 },
    { day: "Sat", value: 90 },
    { day: "Sun", value: stats.rate }, // Today (Real data)
  ];

  return (
    <div className={Styles.wrapper}>
      <SideBar isOpen={isOpen} onClose={() => setIsOpen(false)} />

      {/* Header */}
      <div className={NavbarStyle.header}>
        <button onClick={() => setIsOpen(true)} className={NavbarStyle.menuBtn}>
          <BurgerIcon color="var(--font-color)" width="2rem" height="2rem" />
        </button>
        <h2 style={{ fontSize: "1.2rem", fontWeight: "bold" }}>Analytics</h2>
      </div>

      <div className={Styles.container}>
        
        {/* --- OVERVIEW CARDS --- */ }
        <div className={Styles.grid}>
          {/* Completion Rate */}
          <div className={Styles.card}>
            <span className={Styles.cardLabel}>Daily Completion</span>
            <span className={Styles.cardValue}>{stats.rate}%</span>
            <span className={Styles.cardSub}>
               {stats.completed} of {stats.total} habits done
            </span>
          </div>

          {/* Current Streak */}
          <div className={Styles.card}>
            <span className={Styles.cardLabel}>Current Streak</span>
            <span className={Styles.cardValue}>
                {userStreak ? userStreak.count : 0} <span style={{fontSize:'1rem'}}>days</span>
            </span>
            <span className={Styles.cardSub}>Keep it burning! 🔥</span>
          </div>

          {/* Total Habits */}
          <div className={Styles.card}>
            <span className={Styles.cardLabel}>Active Habits</span>
            <span className={Styles.cardValue}>{stats.total}</span>
            <span className={Styles.cardSub}>Across all roadmaps</span>
          </div>
        </div>

        {/* --- WEEKLY PROGRESS CHART (CSS ONLY) --- */}
        <div className={Styles.section}>
          <div className={Styles.sectionHeader}>
             <span className={Styles.sectionTitle}>Weekly Consistency</span>
          </div>
          
          <div className={Styles.chartContainer}>
            {weeklyData.map((d, index) => {
                const isToday = index === weeklyData.length - 1;
                return (
                    <div key={d.day} className={Styles.barGroup}>
                        <div 
                            className={`${Styles.bar} ${isToday ? Styles.active : ''}`}
                            style={{ 
                                height: `${d.value}%`,
                                backgroundColor: isToday ? 'var(--primary-color)' : 'var(--border-color)' 
                            }}
                        ></div>
                        <span className={Styles.barLabel} style={{fontWeight: isToday ? 'bold' : 'normal'}}>
                            {d.day}
                        </span>
                    </div>
                );
            })}
          </div>
        </div>

        {/* --- HABIT PERFORMANCE LIST --- */}
        <div className={Styles.section}>
           <div className={Styles.sectionHeader}>
             <span className={Styles.sectionTitle}>Habit Breakdown</span>
           </div>

           <div className={Styles.list}>
             {habit.map((h) => {
                const current = h.goals.count || 0;
                const target = h.goals.target || 1;
                const percent = Math.min((current / target) * 100, 100);

                return (
                    <div key={h.id} className={Styles.listItem}>
                        <div className={Styles.itemInfo}>
                            <h4>{h.title}</h4>
                            <p>Target: {target} {h.goals.satuan}</p>
                        </div>
                        
                        {/* CSS Conic Gradient for Circular Progress */}
                        <div className={Styles.progressCircle} style={{ "--p": `${percent * 3.6}deg` }}>
                            <div className={Styles.innerCircle}>
                                {Math.round(percent)}%
                            </div>
                        </div>
                    </div>
                );
             })}
           </div>
        </div>

      </div>
    </div>
  );
};

export default Analytics;