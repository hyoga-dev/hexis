import { useState, createContext, useContext, useEffect } from "react";
import useLocalStorage from "./useLocalStorage";
import { useAuth } from "./AuthProvider.jsx";

const habitContext = createContext();

export const useHabitProvider = () => {
    return useContext(habitContext);
};

// ... (Keep initialHabits array) ...
const initialHabits = [
    {
        id: "p1",
        title: "Walk the Dog",
        description: "Fresh air for Bruno and me.",
        repeatType: "daily",
        daySet: ["senin", "selasa", "rabu", "kamis", "jumat", "sabtu", "minggu"],
        goals: { count: 0, target: 2, satuan: "times", ulangi: "per_day" },
        waktu: ["Morning", "Evening"],
        waktuMulai: "2024-01-01",
        pengingat: "07:00",
        area: "Chores",
        roadmapId: null,
        completedTimeSlots: []
    },
    // ... (rest of mock data)
    {
        id: "r2-1",
        title: "Run / Walk Intervals",
        description: "Week 1: Run 1 min, Walk 90 sec.",
        repeatType: "daily",
        daySet: ["senin", "rabu", "jumat"], 
        goals: { count: 0, target: 3, satuan: "km", ulangi: "per_day" },
        waktu: ["Afternoon"],
        waktuMulai: "2024-03-10",
        pengingat: "17:00",
        area: "Fitness",
        roadmapId: 2,
        roadmapTitle: "Couch to 5K",
        dayNumber: 1,
        dayFocus: "The First Run", 
        completedTimeSlots: []
    }
];

export function HabitProvider({ children }) {
    const { currentUser } = useAuth();
    
    const [habit, setHabit] = useLocalStorage("habitDetail", initialHabits);
    const [userStreak, setUserStreak] = useLocalStorage("userStreak", { count: 0, lastActiveDate: null });
    const [habitHistory, setHabitHistory] = useLocalStorage("habitHistory", {});
    const [lastResetDate, setLastResetDate] = useLocalStorage("lastResetDate", null);

    // --- NEW: TRACK ROADMAP PROGRESS ---
    // Stores: { "roadmapId_1": 5, "roadmapId_2": 1 } 
    // (Value is the last COMPLETED day)
    const [roadmapProgress, setRoadmapProgress] = useLocalStorage("roadmapProgress", {});

    useEffect(() => {
        if (!habit || habit.length === 0) {
            setHabit(initialHabits);
        }

        const checkAndReset = () => {
            const today = new Date().toLocaleDateString("en-CA"); 
            
            if (userStreak.lastActiveDate) {
                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
                const yesterdayString = yesterday.toLocaleDateString("en-CA");

                if (userStreak.lastActiveDate !== today && userStreak.lastActiveDate !== yesterdayString) {
                    if (userStreak.count > 0) {
                        setUserStreak({ count: 0, lastActiveDate: userStreak.lastActiveDate }); 
                    }
                }
            }

            if (!lastResetDate) {
                setLastResetDate(today);
                return;
            }

            if (today !== lastResetDate) {
                console.log("🌞 New Day Detected! Resetting habits...");

                // NOTE: We do NOT reset 'roadmapProgress' here. 
                // Progression is permanent until the roadmap is finished.

                const resetHabits = habit.map(h => {
                    if (h.repeatType === "daily") {
                        return {
                            ...h,
                            goals: { ...h.goals, count: 0 },
                            completedTimeSlots: []
                        };
                    }
                    return h;
                });

                setHabit(resetHabits);
                setLastResetDate(today);
            }
        };

        checkAndReset();
        const intervalId = setInterval(checkAndReset, 60000); 
        return () => clearInterval(intervalId);

    }, [habit, lastResetDate, userStreak, setHabit, setLastResetDate, setUserStreak]); 


    const logActivity = (amount = 1) => {
        const today = new Date().toLocaleDateString("en-CA");
        const currentCount = habitHistory[today] || 0;
        const newDailyTotal = Math.max(0, currentCount + amount);
        
        setHabitHistory(prevHistory => ({ ...prevHistory, [today]: newDailyTotal }));

        setUserStreak(prevStreak => {
            const { count, lastActiveDate } = prevStreak;
            if (newDailyTotal > 0) {
                if (lastActiveDate !== today) {
                    const yesterday = new Date();
                    yesterday.setDate(yesterday.getDate() - 1);
                    const yesterdayString = yesterday.toLocaleDateString("en-CA");
                    if (lastActiveDate === yesterdayString) return { count: count + 1, lastActiveDate: today };
                    else return { count: 1, lastActiveDate: today }; 
                }
                return prevStreak;
            }
            if (newDailyTotal === 0 && lastActiveDate === today) {
                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
                const yesterdayString = yesterday.toLocaleDateString("en-CA");
                const newCount = Math.max(0, count - 1);
                return { count: newCount, lastActiveDate: newCount > 0 ? yesterdayString : null };
            }
            return prevStreak;
        });
    };

    // --- NEW: CHECK ROADMAP COMPLETION ---
    // Call this whenever a habit is saved
    const checkRoadmapCompletion = (roadmapId, currentDay) => {
        if (!roadmapId || !currentDay) return;

        // 1. Find all habits for this specific Roadmap Day
        const dayHabits = habit.filter(h => h.roadmapId === roadmapId && h.dayNumber === currentDay);
        if (dayHabits.length === 0) return;

        // 2. Check if ALL are complete
        const allComplete = dayHabits.every(h => (h.goals.count || 0) >= (h.goals.target || 1));

        if (allComplete) {
            // 3. Mark this day as Complete
            setRoadmapProgress(prev => {
                const currentProgress = prev[roadmapId] || 0;
                // Only update if we are moving forward
                if (currentDay > currentProgress) {
                    console.log(`🚀 Roadmap ${roadmapId}: Day ${currentDay} Complete!`);
                    
                    // 4. CHECK IF LAST DAY (Reset Logic)
                    // Find max day for this roadmap
                    const allRoadmapHabits = habit.filter(h => h.roadmapId === roadmapId);
                    const maxDay = Math.max(...allRoadmapHabits.map(h => h.dayNumber || 1));

                    if (currentDay >= maxDay) {
                        alert("🎉 Roadmap Completed! Resetting to Day 1.");
                        return { ...prev, [roadmapId]: 0 }; // Reset to 0 (Start over)
                    }
                    
                    return { ...prev, [roadmapId]: currentDay };
                }
                return prev;
            });
        }
    };

    const contextValue = { 
        habit, 
        setHabit, 
        userStreak, 
        habitHistory, 
        logActivity,
        // New Exports
        roadmapProgress,
        checkRoadmapCompletion
    }; 

    return (
        <habitContext.Provider value={contextValue}>
            {children}
        </habitContext.Provider>
    );
}