import { useState, useMemo } from "react";
import Styles from "../assets/Styles/analytics.module.css";
import NavbarStyle from "../assets/Styles/navbar.module.css";
import BurgerIcon from "../assets/Icon/SideBar/BurgerIcon";
import SideBar from "./Components/SideBar";
import { useHabitProvider } from "../data/habitData"; 
import { useAuth } from "../data/AuthProvider";

const Analytics = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { habit, userStreak, habitHistory } = useHabitProvider(); 
  const { currentUser } = useAuth(); 

  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, data: null, alignClass: Styles.tooltipCenter });
  const daysToShow = 365;

  const firstName = currentUser?.displayName 
    ? currentUser.displayName.split(' ')[0] 
    : "There";

  // --- 1. REAL-TIME STATS (Today's Snapshot) ---
  const stats = useMemo(() => {
    if (!habit || habit.length === 0) return { total: 0, completed: 0, rate: 0, reps: 0 };
    const total = habit.length;
    const completed = habit.filter(h => (h.goals.count || 0) >= (h.goals.target || 1)).length;
    const rate = Math.round((completed / total) * 100);
    const reps = habit.reduce((acc, h) => acc + (h.goals.count || 0), 0);
    return { total, completed, rate, reps };
  }, [habit]);

  // --- 2. HISTORICAL ANALYSIS (Crunching the numbers) ---
  const historyStats = useMemo(() => {
      const activeDates = Object.keys(habitHistory)
          .filter(date => habitHistory[date] > 0) // Only count days with actual activity
          .sort(); // Sort chronologically "2024-01-01", "2024-01-02"

      // A. Total Completions (All time)
      const totalDone = activeDates.reduce((acc, date) => acc + habitHistory[date], 0);

      // B. Longest Streak Calculation
      let maxStreak = 0;
      let currentRun = 0;
      
      for (let i = 0; i < activeDates.length; i++) {
          if (i === 0) {
              currentRun = 1;
          } else {
              const prev = new Date(activeDates[i-1]);
              const curr = new Date(activeDates[i]);
              const diffTime = Math.abs(curr - prev);
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

              if (diffDays === 1) {
                  currentRun++; // Consecutive day
              } else {
                  currentRun = 1; // Streak broken
              }
          }
          if (currentRun > maxStreak) maxStreak = currentRun;
      }

      // C. Daily Average (Total / Days since first active)
      let dailyAvg = 0;
      if (activeDates.length > 0) {
          const firstDate = new Date(activeDates[0]);
          const today = new Date();
          const daysSinceStart = Math.max(1, Math.ceil((today - firstDate) / (1000 * 60 * 60 * 24)));
          dailyAvg = (totalDone / daysSinceStart).toFixed(1);
      }

      return { totalDone, maxStreak, dailyAvg, activeDates };
  }, [habitHistory]);

  // --- 3. PERFORMANCE COMPARISON (This Week vs Last Week) ---
  const performanceData = useMemo(() => {
      const today = new Date();
      let thisWeekCount = 0;
      let lastWeekCount = 0;

      for (let i = 0; i < 14; i++) {
          const d = new Date(today);
          d.setDate(today.getDate() - i);
          const key = d.toLocaleDateString("en-CA");
          const count = habitHistory[key] || 0;

          if (i < 7) thisWeekCount += count; // 0-6 days ago
          else lastWeekCount += count;       // 7-13 days ago
      }

      // Avoid division by zero
      const diff = lastWeekCount === 0 ? (thisWeekCount > 0 ? 100 : 0) : Math.round(((thisWeekCount - lastWeekCount) / lastWeekCount) * 100);
      const sign = diff >= 0 ? "+" : "";

      return { thisWeekCount, lastWeekCount, diff, sign };
  }, [habitHistory]);

  // --- 4. CONSISTENCY GRAPH DATA ---
  const consistencyData = useMemo(() => {
    const data = [];
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - daysToShow);
    const dayOfWeek = startDate.getDay(); 
    const alignedStartDate = new Date(startDate);
    alignedStartDate.setDate(startDate.getDate() - dayOfWeek);
    const totalDaysToRender = daysToShow + dayOfWeek;

    for (let i = 0; i <= totalDaysToRender; i++) {
        const date = new Date(alignedStartDate);
        date.setDate(alignedStartDate.getDate() + i);
        if (date > today) break;

        const dateKey = date.toLocaleDateString("en-CA");
        const displayDate = date.toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' });
        const count = habitHistory?.[dateKey] || 0;

        let level = 0;
        if (count >= 1) level = 1;
        if (count >= 3) level = 2;
        if (count >= 5) level = 3;
        if (count >= 8) level = 4;

        data.push({ id: i, date: displayDate, level, count });
    }
    return data;
  }, [habitHistory]); 

  const monthLabels = useMemo(() => {
      const labels = [];
      let lastMonth = "";
      const weeks = Math.ceil(consistencyData.length / 7);
      for (let w = 0; w < weeks; w++) {
          const dayIndex = w * 7;
          if (dayIndex >= consistencyData.length) break;
          const dateStr = consistencyData[dayIndex].date; 
          const currentMonth = dateStr.split(" ")[0]; 
          if (currentMonth !== lastMonth) { labels.push(currentMonth); lastMonth = currentMonth; } 
          else { labels.push(""); }
      }
      return labels;
  }, [consistencyData]);

  const handleCellClick = (e, day) => {
      if (tooltip.visible && tooltip.data && tooltip.data.id === day.id) {
          setTooltip({ ...tooltip, visible: false });
          return;
      }
      const rect = e.target.getBoundingClientRect();
      const screenWidth = window.innerWidth;
      
      let x = rect.left + (rect.width / 2);
      let alignClass = Styles.tooltipCenter;

      if (rect.left < 70) {
          x = rect.left + (rect.width / 2); 
          alignClass = Styles.tooltipLeft;
      } 
      else if (rect.right > screenWidth - 70) {
          x = rect.left + (rect.width / 2); 
          alignClass = Styles.tooltipRight;
      }

      setTooltip({ visible: true, x: x, y: rect.top, data: day, alignClass: alignClass });
  };

  return (
    <div className={Styles.wrapper}>
      <SideBar isOpen={isOpen} onClose={() => setIsOpen(false)} />

      {tooltip.visible && tooltip.data && (
          <div className={`${Styles.tooltip} ${tooltip.alignClass}`} style={{ top: tooltip.y, left: tooltip.x }}>
             <div style={{fontWeight:'bold', marginBottom:'2px'}}>{tooltip.data.date}</div>
             <div>{tooltip.data.count === 0 ? "No activity" : `${tooltip.data.count} habits completed`}</div>
          </div>
      )}

      <div className={NavbarStyle.header}>
        <button onClick={() => setIsOpen(true)} className={NavbarStyle.menuBtn}>
          <BurgerIcon color="var(--font-color)" width="2rem" height="2rem" />
        </button>
        <div style={{textAlign: 'right'}}>
            <span style={{fontSize: '0.8rem', color: 'var(--secondary-font-color)', display: 'block'}}>Welcome back,</span>
            <span style={{fontWeight: 'bold', fontSize: '1rem'}}>{firstName} 👋</span>
        </div>
      </div>

      <div className={Styles.container}>
        
        {/* --- 5. REAL TOP STATS --- */}
        <div className={Styles.topStats}>
            <div className={Styles.statBox}>
                <h4>Best Streak</h4>
                <span>{historyStats.maxStreak} Days</span>
            </div>
            <div className={Styles.statBox}>
                <h4>Total Done</h4>
                <span>{historyStats.totalDone}</span>
            </div>
            <div className={Styles.statBox}>
                <h4>Daily Avg</h4>
                <span>{historyStats.dailyAvg}</span>
            </div>
        </div>

        <div className={Styles.statsGrid}>
          <div className={Styles.card}>
            <span className={Styles.cardTitle}>Current Streak</span>
            <span className={Styles.cardValue}>
               {userStreak ? userStreak.count : 0} <span style={{fontSize:'1rem'}}>days</span>
            </span>
            <span className={Styles.cardFooter}>Keep the fire burning! 🔥</span>
          </div>
          <div className={Styles.card}>
            <span className={Styles.cardTitle}>Completion Rate</span>
            <span className={Styles.cardValue}>{stats.rate}%</span>
            <span className={Styles.cardFooter}>{stats.completed} of {stats.total} habits finished</span>
          </div>
          <div className={Styles.card}>
            <span className={Styles.cardTitle}>Total Repetitions</span>
            <span className={Styles.cardValue}>{stats.reps}</span>
            <span className={Styles.cardFooter}>Actions done today</span>
          </div>
        </div>

        <div className={Styles.sectionStack}>
            
            <div className={Styles.heatmapSection}>
                <div style={{display:'flex', justifyContent:'space-between', marginBottom:'10px', alignItems:'center'}}>
                    <h3 style={{fontSize:'1.1rem', margin:0, fontWeight:'bold'}}>Consistency</h3>
                    <span style={{fontSize:'0.9rem', color:'var(--secondary-font-color)', fontWeight: 'normal'}}>
                        Last 12 Months
                    </span>
                </div>
                
                <div className={Styles.graphContainer}>
                    <div className={Styles.dayCol}>
                        <span className={Styles.dayLabel}></span>
                        <span className={Styles.dayLabel}>Mon</span>
                        <span className={Styles.dayLabel}></span>
                        <span className={Styles.dayLabel}>Wed</span>
                        <span className={Styles.dayLabel}></span>
                        <span className={Styles.dayLabel}>Fri</span>
                        <span className={Styles.dayLabel}></span>
                    </div>
                    <div className={Styles.gridCol}>
                        <div className={Styles.monthRow} style={{gridTemplateColumns: `repeat(${Math.ceil(consistencyData.length / 7)}, 17px)`}}>
                            {monthLabels.map((month, i) => (<span key={i} className={Styles.monthLabel}>{month}</span>))}
                        </div>
                        <div className={Styles.heatmapGrid}>
                            {consistencyData.map((day) => (
                                <div 
                                    key={day.id} 
                                    onClick={(e) => handleCellClick(e, day)} 
                                    className={`${Styles.heatmapCell} ${Styles[`level${day.level}`]} ${tooltip.visible && tooltip.data?.id === day.id ? Styles.selectedCell : ''}`}
                                ></div>
                            ))}
                        </div>
                    </div>
                </div>
                
                <div style={{display:'flex', alignItems:'center', gap:'4px', marginTop:'auto', paddingTop: '15px', fontSize:'0.7rem', color:'gray', justifyContent:'center'}}>
                    <span>Less</span>
                    <div className={`${Styles.heatmapCell} ${Styles.level0}`}></div>
                    <div className={`${Styles.heatmapCell} ${Styles.level2}`}></div>
                    <div className={`${Styles.heatmapCell} ${Styles.level4}`}></div>
                    <span>More</span>
                </div>
            </div>

            {/* --- 6. REAL PERFORMANCE DATA --- */}
            <div className={Styles.chartCard}>
                <h3 style={{fontSize:'1.1rem', fontWeight:'bold'}}>Performance</h3>
                <div className={Styles.comparisonList}>
                    <div className={Styles.compareItem}>
                        <div className={Styles.compareLabel}>Vs Last Week</div>
                        <div className={`${Styles.compareDiff} ${performanceData.diff >= 0 ? Styles.positive : Styles.negative}`}>
                            {performanceData.sign}{performanceData.diff}%
                        </div>
                    </div>
                    <div className={Styles.compareItem}>
                        <div className={Styles.compareLabel}>This Week Total</div>
                        <div className={Styles.compareDiff}>{performanceData.thisWeekCount}</div>
                    </div>
                    <div className={Styles.compareItem}>
                        <div className={Styles.compareLabel}>Last Week Total</div>
                        <div className={Styles.compareDiff} style={{color:'gray'}}>{performanceData.lastWeekCount}</div>
                    </div>
                    <div style={{marginTop: 'auto', fontSize:'0.85rem', color:'var(--secondary-font-color)', textAlign:'center', paddingTop: '20px', fontStyle:'italic'}}>
                        "Small progress is still progress."
                    </div>
                </div>
            </div>

        </div>

      </div>
    </div>
  );
};

export default Analytics;