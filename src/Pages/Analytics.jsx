import { useState, useMemo } from "react";
import Styles from "../assets/Styles/analytics.module.css";
import NavbarStyle from "../assets/Styles/navbar.module.css";
import BurgerIcon from "../assets/Icon/SideBar/BurgerIcon";
import SideBar from "./Components/SideBar";
import { useHabitProvider } from "../data/habitData";
import { useAuth } from "../data/AuthProvider";

const Analytics = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { habit, userStreak } = useHabitProvider();
  const { currentUser } = useAuth();

  const firstName = currentUser?.displayName 
    ? currentUser.displayName.split(' ')[0] 
    : "There";

  // --- 1. REAL TIME DATA ---
  const stats = useMemo(() => {
    if (!habit || habit.length === 0) return { total: 0, completed: 0, rate: 0, reps: 0 };
    
    const total = habit.length;
    const completed = habit.filter(h => (h.goals.count || 0) >= (h.goals.target || 1)).length;
    const rate = Math.round((completed / total) * 100);
    
    // Sum of all repetitions (goals.count) across all habits today
    const reps = habit.reduce((acc, h) => acc + (h.goals.count || 0), 0);

    return { total, completed, rate, reps };
  }, [habit]);

  // --- 2. MOCK DATA FOR VISUALS (Since we don't have DB History) ---
  
  // Contribution Data: 12 Weeks (Columns) x 7 Days (Rows)
  const contributionData = useMemo(() => {
    return Array.from({ length: 84 }).map(() => Math.floor(Math.random() * 5)); // 0-4 intensity
  }, []);

  // Trend Data: Last 7 Days
  const trendData = [30, 45, 60, 50, 70, 85, stats.rate]; 

  // Comparison Data
  const periodComparison = {
    thisWeek: 24, // Total habits done this week
    lastWeek: 18,
    diff: "+33%"
  };

  return (
    <div className={Styles.wrapper}>
      <SideBar isOpen={isOpen} onClose={() => setIsOpen(false)} />

      {/* Header */}
      <div className={NavbarStyle.header}>
        <button onClick={() => setIsOpen(true)} className={NavbarStyle.menuBtn}>
          <BurgerIcon color="var(--font-color)" width="2rem" height="2rem" />
        </button>
        <div style={{textAlign: 'right'}}>
            <span style={{fontSize: '0.8rem', color: 'var(--secondary-font-color)'}}>Overview</span>
            <div style={{fontWeight: 'bold', fontSize: '1rem'}}>Analytics</div>
        </div>
      </div>

      <div className={Styles.container}>
        
        <h2 style={{marginBottom: '20px'}}>Hi, {firstName} 👋</h2>

        {/* 1, 2, 3: KEY METRICS */}
        <div className={Styles.statsGrid}>
          {/* Current Streak */}
          <div className={Styles.card}>
            <span className={Styles.cardTitle}>Current Streak</span>
            <span className={Styles.cardValue}>
               {userStreak ? userStreak.count : 0} <span style={{fontSize:'1rem'}}>days</span>
            </span>
            <span className={Styles.cardFooter}>Personal Best: {Math.max((userStreak?.count || 0), 5)} days</span>
          </div>

          {/* Completion Rate */}
          <div className={Styles.card}>
            <span className={Styles.cardTitle}>Completion Rate</span>
            <span className={Styles.cardValue}>{stats.rate}%</span>
            <span className={Styles.cardFooter}>Today's Progress</span>
          </div>

          {/* Total Repetitions */}
          <div className={Styles.card}>
            <span className={Styles.cardTitle}>Total Repetitions</span>
            <span className={Styles.cardValue}>{stats.reps}</span>
            <span className={Styles.cardFooter}>Actions done today</span>
          </div>
        </div>

        {/* 7. TOP STATS (HIGHLIGHT) */}
        <div className={Styles.topStats} style={{marginBottom: '25px'}}>
            <div className={Styles.statBox}>
                <h4>Longest Streak</h4>
                <span>{Math.max((userStreak?.count || 0), 12)}d</span>
            </div>
            <div className={Styles.statBox}>
                <h4>Total Done</h4>
                <span>{142 + stats.completed}</span> {/* Mock lifetime total */}
            </div>
            <div className={Styles.statBox}>
                <h4>Daily Avg</h4>
                <span>85%</span>
            </div>
        </div>

        {/* 4. CONTRIBUTION GRAPH */}
        <div className={Styles.heatmapSection}>
            <h3 style={{fontSize:'1.1rem', marginBottom:'15px'}}>Contribution Graph (Last 3 Months)</h3>
            <div className={Styles.heatmapGrid}>
                {contributionData.map((level, i) => (
                    <div 
                        key={i} 
                        className={`${Styles.heatmapCell} ${Styles[`level${level}`]}`}
                        title={`Activity Level: ${level}`}
                    ></div>
                ))}
            </div>
        </div>

        {/* 5 & 6: TREND & COMPARISON */}
        <div className={Styles.splitSection}>
            
            {/* 5. Trend Line Chart */}
            <div className={Styles.chartCard}>
                <h3 style={{fontSize:'1.1rem'}}>Weekly Trend</h3>
                <div style={{flex: 1, padding: '10px 0'}}>
                   {/* Simple SVG Line Chart */}
                   <svg className={Styles.trendChart} viewBox="0 0 100 50" preserveAspectRatio="none">
                      {/* Grid Lines */}
                      <line x1="0" y1="10" x2="100" y2="10" stroke="var(--border-color)" strokeWidth="0.5" />
                      <line x1="0" y1="25" x2="100" y2="25" stroke="var(--border-color)" strokeWidth="0.5" />
                      <line x1="0" y1="40" x2="100" y2="40" stroke="var(--border-color)" strokeWidth="0.5" />
                      
                      {/* The Line */}
                      <polyline 
                         points={trendData.map((val, i) => `${(i / (trendData.length - 1)) * 100},${50 - (val / 2)}`).join(" ")}
                         className={Styles.chartLine}
                      />
                      {/* Dots */}
                      {trendData.map((val, i) => (
                          <circle 
                            key={i} 
                            cx={(i / (trendData.length - 1)) * 100} 
                            cy={50 - (val / 2)} 
                            className={Styles.chartDot} 
                          />
                      ))}
                   </svg>
                </div>
                <div style={{display:'flex', justifyContent:'space-between', fontSize:'0.8rem', color:'gray'}}>
                    <span>Mon</span><span>Sun</span>
                </div>
            </div>

            {/* 6. Period Comparison */}
            <div className={Styles.chartCard}>
                <h3 style={{fontSize:'1.1rem'}}>Performance</h3>
                <div className={Styles.comparisonList}>
                    <div className={Styles.compareItem}>
                        <div className={Styles.compareLabel}>Vs Last Week</div>
                        <div className={`${Styles.compareDiff} ${Styles.positive}`}>+12%</div>
                    </div>
                    <div className={Styles.compareItem}>
                        <div className={Styles.compareLabel}>Vs Last Month</div>
                        <div className={`${Styles.compareDiff} ${Styles.positive}`}>+5%</div>
                    </div>
                    <div className={Styles.compareItem}>
                        <div className={Styles.compareLabel}>Completion Avg</div>
                        <div className={Styles.compareDiff}>78%</div>
                    </div>
                    <div style={{marginTop: 'auto', fontSize:'0.8rem', color:'gray', textAlign:'center'}}>
                        Keep pushing! You're doing better than 65% of users.
                    </div>
                </div>
            </div>

        </div>

      </div>
    </div>
  );
};

export default Analytics;