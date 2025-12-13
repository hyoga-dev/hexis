import { useState, createContext, useContext, useEffect } from "react";
import useLocalStorage from "./useLocalStorage";
import { useAuth } from "./AuthProvider.jsx";

const habitContext = createContext();

export const useHabitProvider = () => {
    return useContext(habitContext);
};

// --- INITIAL DATA ---
const initialHabits = [];

export function HabitProvider({ children }) {
    const { currentUser } = useAuth();
    
    // --- STATE MANAGEMENT ---
    const [habit, setHabit] = useLocalStorage("habitDetail", initialHabits);
    const [userStreak, setUserStreak] = useLocalStorage("userStreak", { count: 0, lastActiveDate: null });
    const [habitHistory, setHabitHistory] = useLocalStorage("habitHistory", {});
    const [lastResetDate, setLastResetDate] = useLocalStorage("lastResetDate", null);
    const [roadmapProgress, setRoadmapProgress] = useLocalStorage("roadmapProgress", {});

    // --- EFFECT: INITIALIZATION & DAILY RESET LOGIC ---
    useEffect(() => {
        // 1. Initialize if empty
        if (!habit || habit.length === 0) {
            setHabit(initialHabits);
        }

        const checkAndReset = () => {
            const today = new Date().toLocaleDateString("en-CA"); 
            
            // 2. Check Streak Integrity
            if (userStreak.lastActiveDate) {
                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
                const yesterdayString = yesterday.toLocaleDateString("en-CA");

                // If user skipped a day (last active wasn't today OR yesterday), reset streak
                if (userStreak.lastActiveDate !== today && userStreak.lastActiveDate !== yesterdayString) {
                    if (userStreak.count > 0) {
                        setUserStreak({ count: 0, lastActiveDate: userStreak.lastActiveDate }); 
                    }
                }
            }

            // 3. Daily Habit Reset Logic
            if (!lastResetDate) {
                setLastResetDate(today);
                return;
            }

            if (today !== lastResetDate) {
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

        // Run immediately and then check every minute (to handle day changes while app is open)
        checkAndReset();
        const intervalId = setInterval(checkAndReset, 60000); 
        return () => clearInterval(intervalId);

    }, [habit, lastResetDate, userStreak, setHabit, setLastResetDate, setUserStreak]); 

    // --- ACTIVITY LOGGING & STREAK CALCULATION ---
    const logActivity = (amount = 1) => {
        const today = new Date().toLocaleDateString("en-CA");
        const currentCount = habitHistory[today] || 0;
        const newDailyTotal = Math.max(0, currentCount + amount);
        
        setHabitHistory(prevHistory => ({ ...prevHistory, [today]: newDailyTotal }));

        setUserStreak(prevStreak => {
            const { count, lastActiveDate } = prevStreak;
            
            // Incrementing activity
            if (newDailyTotal > 0) {
                if (lastActiveDate !== today) {
                    const yesterday = new Date();
                    yesterday.setDate(yesterday.getDate() - 1);
                    const yesterdayString = yesterday.toLocaleDateString("en-CA");
                    
                    if (lastActiveDate === yesterdayString) {
                        // Continued streak
                        return { count: count + 1, lastActiveDate: today };
                    } else {
                        // Broken streak, start over
                        return { count: 1, lastActiveDate: today }; 
                    }
                }
                return prevStreak; // Already logged today
            }
            
            // Decrementing activity (undo) resulting in 0
            if (newDailyTotal === 0 && lastActiveDate === today) {
                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
                const yesterdayString = yesterday.toLocaleDateString("en-CA");
                const newCount = Math.max(0, count - 1);
                
                // Revert to yesterday's state if possible
                return { count: newCount, lastActiveDate: newCount > 0 ? yesterdayString : null };
            }
            return prevStreak;
        });
    };

    // --- ROADMAP COMPLETION CHECK ---
    const checkRoadmapCompletion = (roadmapId, currentDay) => {
        if (!roadmapId || !currentDay) return;
        
        // Find habits for this specific day of the roadmap
        const dayHabits = habit.filter(h => h.roadmapId === roadmapId && h.dayNumber === currentDay);
        if (dayHabits.length === 0) return;

        // Check if all targets are met
        const allComplete = dayHabits.every(h => (h.goals.count || 0) >= (h.goals.target || 1));

        if (allComplete) {
            setRoadmapProgress(prev => {
                const currentProgress = prev[roadmapId] || 0;
                
                // Only advance if this is the next step
                if (currentDay > currentProgress) {
                    const allRoadmapHabits = habit.filter(h => h.roadmapId === roadmapId);
                    const maxDay = Math.max(...allRoadmapHabits.map(h => h.dayNumber || 1));

                    if (currentDay >= maxDay) {
                        alert("🎉 Roadmap Completed! Resetting to Day 1.");
                        return { ...prev, [roadmapId]: 0 }; // Loop/Reset
                    }
                    return { ...prev, [roadmapId]: currentDay };
                }
                return prev;
            });
        }
    };

    // --- SMART UPDATE FOR PERSONAL ROADMAPS ---
    const updatePersonalRoadmap = (roadmapId, newHabitTemplates, metaData) => {
        setHabit(prevHabits => {
            // 1. Separate habits NOT in this roadmap (keep them safe)
            const otherHabits = prevHabits.filter(h => String(h.roadmapId) !== String(roadmapId));
            
            // 2. Get existing habits for this roadmap (to preserve progress)
            const existingHabits = prevHabits.filter(h => String(h.roadmapId) === String(roadmapId));

            // 3. Generate the new list, preserving progress where titles/days match
            const updatedRoadmapHabits = newHabitTemplates.map(template => {
                // Try to find a matching existing habit (Same Day + Same Title)
                const match = existingHabits.find(ex => 
                    ex.dayNumber === template.dayNumber && 
                    ex.title === template.title
                );

                if (match) {
                    // PRESERVE PROGRESS: Keep ID, Count, and History
                    return {
                        ...template,
                        id: match.id,
                        goals: { 
                            ...template.goals, 
                            count: match.goals.count // Keep current progress count
                        },
                        completedTimeSlots: match.completedTimeSlots || [],
                        // Update metadata just in case (e.g. if roadmap was renamed)
                        roadmapTitle: metaData.title,
                        area: metaData.category
                    };
                } else {
                    // NEW TASK: Create fresh
                    return {
                        ...template,
                        id: Date.now() + Math.random(), // Unique ID
                        roadmapId: roadmapId, 
                        roadmapTitle: metaData.title,
                        area: metaData.category,
                        goals: { ...template.goals, count: 0 }, // Ensure count starts at 0
                        completedTimeSlots: []
                    };
                }
            });

            return [...otherHabits, ...updatedRoadmapHabits];
        });
    };

    const contextValue = { 
        habit, 
        setHabit, 
        userStreak, 
        habitHistory, 
        logActivity,
        roadmapProgress,
        checkRoadmapCompletion,
        updatePersonalRoadmap
    }; 

    return (
        <habitContext.Provider value={contextValue}>
            {children}
        </habitContext.Provider>
    );
}