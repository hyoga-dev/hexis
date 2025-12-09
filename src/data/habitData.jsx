import { useState, createContext, useContext, useEffect } from "react";
import useLocalStorage from "./useLocalStorage";
import { useAuth } from "./AuthProvider.jsx";

const habitContext = createContext();

export const useHabitProvider = () => {
    return useContext(habitContext);
};

// --- ROBUST MOCK DATA ---
const initialHabits = [
    // 1. PERSONAL HABITS (No roadmapId)
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
    {
        id: "p2",
        title: "Read a Book",
        description: "Finish 'Atomic Habits' this month.",
        repeatType: "daily",
        daySet: ["senin", "rabu", "jumat", "minggu"],
        goals: { count: 0, target: 30, satuan: "minutes", ulangi: "per_day" },
        waktu: ["Evening"],
        waktuMulai: "2024-01-01",
        pengingat: "20:00",
        area: "Learning",
        roadmapId: null,
        completedTimeSlots: []
    },

    // 2. ROADMAP: "30-Day Morning Reset" (ID: 1)
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
        completedTimeSlots: []
    },

    // 3. ROADMAP: "Couch to 5K" (ID: 2)
    {
        id: "r2-1",
        title: "Run / Walk Intervals",
        description: "Week 1: Run 1 min, Walk 90 sec.",
        repeatType: "daily",
        daySet: ["senin", "rabu", "jumat"], // Only 3 days a week
        goals: { count: 0, target: 3, satuan: "km", ulangi: "per_day" },
        waktu: ["Afternoon"],
        waktuMulai: "2024-03-10",
        pengingat: "17:00",
        area: "Fitness",
        roadmapId: 2,
        roadmapTitle: "Couch to 5K",
        completedTimeSlots: []
    },

    // 4. ROADMAP: "My React Journey" (ID: 3)
    {
        id: "r3-1",
        title: "Code 1 Hour",
        description: "Focus on building the Hexis App.",
        repeatType: "daily",
        daySet: ["senin", "selasa", "rabu", "kamis", "jumat"],
        goals: { count: 0, target: 1, satuan: "hours", ulangi: "per_day" },
        waktu: ["Evening"],
        waktuMulai: "2024-04-01",
        pengingat: "19:00",
        area: "Learning",
        roadmapId: 3,
        roadmapTitle: "My React Journey",
        completedTimeSlots: []
    }
];

export function HabitProvider({ children }) {
    const { currentUser } = useAuth();

    // In a real app, you'd fetch this from Firebase based on UID.
    // Here we seed useLocalStorage with our mock data.
    const [habit, setHabit] = useLocalStorage("habitDetail", initialHabits);

    // Optional: Reset if empty (for testing)
    useEffect(() => {
        if (!habit || habit.length === 0) {
            setHabit(initialHabits);
        }
    }, []);

    const contextValue = {
        habit,
        setHabit
    };

    return (
        <habitContext.Provider value={contextValue}>
            {children}
        </habitContext.Provider>
    );
}