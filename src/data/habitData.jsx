import { useState, createContext, useContext, useEffect } from "react";
import useLocalStorage from "./useLocalStorage";
import { useAuth } from "./AuthProvider.jsx";

const habitContext = createContext();

export const useHabitProvider = () => {
    return useContext(habitContext);
};

// --- ROBUST MOCK DATA ---
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
    // ... (Your other mock data remains here)
    {
        id: "r1-1",
        title: "Drink 500ml Water",
        description: "Hydrate immediately after waking up.",
        repeatType: "daily",
        daySet: ["senin", "selasa", "rabu", "kamis", "jumat", "sabtu", "minggu"],
        goals: { count: 0, target: 1, satuan: "times", ulangi: "per_day" },
        waktu: ["Morning"],
        waktuMulai: "2024-02-01",
        pengingat: "06:30",
        area: "Health",
        roadmapId: 1,
        roadmapTitle: "30-Day Morning Reset",
        dayNumber: 1,
        dayFocus: "Hydration First",
        completedTimeSlots: []
    },
    {
        id: "r1-2",
        title: "5 Min Stretching",
        description: "Touch your toes and reach for the sky.",
        repeatType: "daily",
        daySet: ["senin", "selasa", "rabu", "kamis", "jumat", "sabtu", "minggu"],
        goals: { count: 0, target: 5, satuan: "minutes", ulangi: "per_day" },
        waktu: ["Morning"],
        waktuMulai: "2024-02-01",
        pengingat: "06:45",
        area: "Health",
        roadmapId: 1,
        roadmapTitle: "30-Day Morning Reset",
        dayNumber: 1,
        dayFocus: "Hydration First",
        completedTimeSlots: []
    },
     {
        id: "r1-3",
        title: "Drink 500ml Water",
        description: "Hydrate immediately after waking up.",
        repeatType: "daily",
        daySet: ["senin", "selasa", "rabu", "kamis", "jumat", "sabtu", "minggu"],
        goals: { count: 0, target: 1, satuan: "times", ulangi: "per_day" },
        waktu: ["Morning"],
        waktuMulai: "2024-02-01",
        pengingat: "06:30",
        area: "Health",
        roadmapId: 1,
        roadmapTitle: "30-Day Morning Reset",
        dayNumber: 2,
        dayFocus: "Add Movement",
        completedTimeSlots: []
    },
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

    // --- NEW: STREAK STATE ---
    // Stores { count: 3, lastActiveDate: "2024-12-10" }
    const [userStreak, setUserStreak] = useLocalStorage("userStreak", { count: 0, lastActiveDate: null });

    useEffect(() => {
        if (!habit || habit.length === 0) {
            setHabit(initialHabits);
        }
    }, []);

    // --- NEW: LOGIC TO UPDATE STREAK ---
    const updateStreak = () => {
        const today = new Date().toISOString().split('T')[0];
        const { count, lastActiveDate } = userStreak;

        // 1. If already active today, do nothing
        if (lastActiveDate === today) return;

        // 2. Calculate Yesterday's Date
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayString = yesterday.toISOString().split('T')[0];

        if (lastActiveDate === yesterdayString) {
            // 3. Consecutive day! Increment.
            setUserStreak({ count: count + 1, lastActiveDate: today });
        } else {
            // 4. Broken streak (or first time). Reset to 1.
            setUserStreak({ count: 1, lastActiveDate: today });
        }
    };

    const contextValue = { habit, setHabit, userStreak, updateStreak }; // Export new props
    return (
        <habitContext.Provider value={contextValue}>
            {children}
        </habitContext.Provider>
    );
}