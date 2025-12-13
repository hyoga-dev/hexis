import { useState, useMemo, useEffect } from "react";
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

  const [selectedData, setSelectedData] = useState(null);
  const [daysToShow, setDaysToShow] = useState(window.innerWidth > 768 ? 182 : 91);

  useEffect(() => {
    const handleResize = () => {
        setDaysToShow(window.innerWidth > 768 ? 182 : 91);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const firstName = currentUser?.displayName 
    ? currentUser.displayName.split(' ')[0] 
    : "There";

  const stats = useMemo(() => {
    if (!habit || habit.length === 0) return { total: 0, completed: 0, rate: 0, reps: 0 };
    const total = habit.length;
    const completed = habit.filter(h => (h.goals.count || 0) >= (h.goals.target || 1)).length;
    const rate = Math.round((completed / total) * 100);
    const reps = habit.reduce((acc, h) => acc + (h.goals.count || 0), 0);
    return { total, completed, rate, reps };
  }, [habit]);

  const consistencyData = useMemo(() => {
    const data = [];
    const today = new Date();
    
    // Find start date
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - daysToShow);

    // Adjust to previous Sunday (so row 0 is always Sunday)
    const dayOfWeek = startDate.getDay(); 
    const alignedStartDate = new Date(startDate);
    alignedStartDate.setDate(startDate.getDate() - dayOfWeek);

    const totalDaysToRender = daysToShow + dayOfWeek;

    for (let i = 0; i <= totalDaysToRender; i++) {
        const date = new Date(alignedStartDate);
        date.setDate(alignedStartDate.getDate() + i);
        
        if (date > today) break;

        const dateString = date.toLocaleDateString("en-US", { 
            month: 'short', 
            day: 'numeric',
            year: 'numeric'
        });

        const rand = Math.random();
        let level = 0;
        let count = 0;
        if (rand > 0.9) { level = 4; count = Math.floor(Math.random() * 5) + 8; }
        else if (rand > 0.7) { level = 3; count = Math.floor(Math.random() * 3) + 5; }
        else if (rand > 0.5) { level = 2; count = Math.floor(Math.random() * 3) + 2; }
        else if (rand > 0.3) { level = 1; count = 1; }

        data.push({ id: i, date: dateString, level, count });
    }
    return data;
  }, [daysToShow]);

  const monthLabels = useMemo(() => {
      const labels = [];
      let lastMonth = "";
      const weeks = Math.ceil(consistencyData.length / 7);

      for (let w = 0; w < weeks; w++) {
          const dayIndex = w * 7;
          if (dayIndex >= consistencyData.length) break;

          const dateStr = consistencyData[dayIndex].date; 
          const currentMonth = dateStr.split(" ")[0]; 

          if (currentMonth !== lastMonth) {
              labels.push(currentMonth);
              lastMonth = currentMonth;
          } else {
              labels.push(""); 
          }
      }
      return labels;
  }, [consistencyData]);

  const periodComparison = [
    { label: "Vs Last Week", value: "+12%", type: "positive" },
    { label: "Vs Last Month", value: "+33%", type: "positive" },
    { label: "Completion Avg", value: "78%", type: "neutral" }
  ];

  const topStats = {
      longestStreak: Math.max((userStreak?.count || 0), 14), 
      totalCompletions: 142 + stats.completed, 
      dailyAverage: "85%" 
  };

  return (
    <div className={Styles.wrapper}>
      <SideBar isOpen={isOpen} onClose={() => setIsOpen(false)} />

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
        
        {/* Top Stats Banner */}
        <div className={Styles.topStats}>
            <div className={Styles.statBox}>
                <h4>Longest Streak</h4>
                <span>{topStats.longestStreak} Days</span>
            </div>
            <div className={Styles.statBox}>
                <h4>Total Done</h4>
                <span>{topStats.totalCompletions}</span>
            </div>
            <div className={Styles.statBox}>
                <h4>Daily Avg</h4>
                <span>{topStats.dailyAverage}</span>
            </div>
        </div>

        {/* Metrics Grid */}
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

        {/* --- CONSISTENCY GRAPH --- */}
        <div className={Styles.splitSection}>
            
            <div className={Styles.heatmapSection}>
                <div style={{display:'flex', justifyContent:'space-between', marginBottom:'10px', alignItems:'center'}}>
                    <h3 style={{fontSize:'1.1rem', margin:0, fontWeight:'bold'}}>Consistency</h3>
                    <span style={{fontSize:'0.9rem', color:'var(--primary-color)', fontWeight: 'bold'}}>
                        {selectedData 
                            ? `${selectedData.count} habits on ${selectedData.date}` 
                            : `Last ${daysToShow > 100 ? '6' : '3'} Months`
                        }
                    </span>
                </div>
                
                {/* Graph Container with Side Labels */}
                <div className={Styles.graphContainer}>
                    
                    {/* LEFT COLUMN: Day Labels */}
                    <div className={Styles.dayCol}>
                        <span className={Styles.dayLabel}></span>    {/* Sun */}
                        <span className={Styles.dayLabel}>Mon</span>
                        <span className={Styles.dayLabel}></span>    {/* Tue */}
                        <span className={Styles.dayLabel}>Wed</span>
                        <span className={Styles.dayLabel}></span>    {/* Thu */}
                        <span className={Styles.dayLabel}>Fri</span>
                        <span className={Styles.dayLabel}></span>    {/* Sat */}
                    </div>

                    {/* RIGHT COLUMN: Month + Grid */}
                    <div className={Styles.gridCol}>
                        {/* Month Labels */}
                        <div 
                            className={Styles.monthRow} 
                            style={{gridTemplateColumns: `repeat(${Math.ceil(consistencyData.length / 7)}, 17px)`}}
                        >
                            {monthLabels.map((month, i) => (
                                <span key={i} className={Styles.monthLabel}>{month}</span>
                            ))}
                        </div>

                        {/* Grid */}
                        <div className={Styles.heatmapGrid}>
                            {consistencyData.map((day) => (
                                <div 
                                    key={day.id} 
                                    onClick={() => setSelectedData(day)} 
                                    className={`
                                        ${Styles.heatmapCell} 
                                        ${Styles[`level${day.level}`]} 
                                        ${selectedData?.id === day.id ? Styles.selectedCell : ''}
                                    `}
                                    title={`${day.count} habits on ${day.date}`}
                                ></div>
                            ))}
                        </div>
                    </div>
                </div>
                
                {/* Legend */}
                <div style={{display:'flex', alignItems:'center', gap:'4px', marginTop:'auto', paddingTop: '15px', fontSize:'0.7rem', color:'gray', justifyContent:'center'}}>
                    <span>Less</span>
                    <div className={`${Styles.heatmapCell} ${Styles.level0}`}></div>
                    <div className={`${Styles.heatmapCell} ${Styles.level2}`}></div>
                    <div className={`${Styles.heatmapCell} ${Styles.level4}`}></div>
                    <span>More</span>
                </div>
            </div>

            <div className={Styles.chartCard}>
                <h3 style={{fontSize:'1.1rem', fontWeight:'bold'}}>Performance</h3>
                <div className={Styles.comparisonList}>
                    {periodComparison.map((item, index) => (
                        <div key={index} className={Styles.compareItem}>
                            <div className={Styles.compareLabel}>{item.label}</div>
                            <div className={`${Styles.compareDiff} ${item.type === 'positive' ? Styles.positive : ''}`}>
                                {item.value}
                            </div>
                        </div>
                    ))}
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