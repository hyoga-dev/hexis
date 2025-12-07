import { useState, createContext, useContext, useEffect, use } from "react";
import useLocalStorage from "./useLocalStorage";
import { useAuth } from "./AuthProvider.jsx";

const habitContext = createContext()


export const useHabitProvider = () => {
    return useContext(habitContext);
}

const dataHabit = [
    {
        title: "",
        repeatType: "daily", 
        daySet: ["minggu", "senin", "selasa", "rabu", "kamis"],  
        goals: { 
        count: 1, 
        satuan: "times", 
        ulangi: "per_day"  
        },
        waktu: ["Morning", "Afternoon", "Evening"], 
        waktuMulai: "",
        pengingat: "09:00",
        kondisihabis: "Never",
        area: "",
        checkList: "",       
        isGrouped: false
    }
]


export function HabitProvider({children}) {
    const { currentUser, loading } = useAuth();


    dataHabit[0].uid = currentUser ? currentUser.uid : "guest";

    const [habit, setHabit] = useLocalStorage("habitDetail", dataHabit);
    const contextValue = {
        habit,
        setHabit
    }

    return (
        <habitContext.Provider value={contextValue}>
            {children}
        </habitContext.Provider>
    )
}