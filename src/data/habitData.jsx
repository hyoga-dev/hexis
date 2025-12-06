import { useState, createContext, useContext, useEffect, use } from "react";
import useLocalStorage from "./useLocalStorage";
import { useAuth } from "./AuthProvider.jsx";

const habitContext = createContext()


export const useHabitProvider = () => {
    return useContext(habitContext);
}

const dataHabit = [
    {
        uid: "guest",
        title: "judul",
        daySet: ["senin", "selasa"], 
        goals: {count: 0, satuan: "time", ulangi: "perday"},
        waktu: "morning",
        waktuMulai: "",
        pengingat: "",
        kondisihabis: "",
        checkList: "",
        isGrouped: true,
    }
]


export function HabitProvider({children}) {
    const { currentUser, loading } = useAuth();


    dataHabit[0].uid = currentUser ? currentUser.uid : "guest";

    const [habit, sethabit] = useLocalStorage("habitDetail", dataHabit);

    const contextValue = {
        habit,
        sethabit
    }

    return (
        <habitContext.Provider value={contextValue}>
            {children}
        </habitContext.Provider>
    )
}