import { useState, createContext, useContext, useEffect, use } from "react";
import { auth } from '../firebase.js'; 
import useLocalStorage from "./useLocalStorage";
import { useAuthLogin } from "./useAuthLogin";
import { useAuth } from "./AuthProvider.jsx";

const habitContext = createContext()


export const useHabitProvider = () => {
    return useContext(habitContext);
}



export function HabitProvider({children}) {
    const { currentUser, loading } = useAuth();

    const dataHabit = [
        {
            uid: currentUser ? currentUser.uid : "guest",
            title: "judul",
            ulangi: {frekuensi: "daily",ulangiSetiap: "everyday"}, 
            goals: {count: 0, satuan: "time", ulangi: "perday"},
            waktu: "morning",
            waktuMulai: "",
            pengingat: "",
            kondisihabis: "",
            checkList: "",
            isGrouped: true,
        }
    ]

    const [value, setValue] = useLocalStorage("habitDetail", dataHabit)
    const [habit, sethabit] = useState(value);

    useEffect(() => {
        dataHabit[0].uid = currentUser ? currentUser.uid : "guest";
        setValue(habit)
    }, [habit])

    const contextValue = {
        habit,
        sethabit,
        value
    }

    return (
        <habitContext.Provider value={contextValue}>
            {children}
        </habitContext.Provider>
    )
}