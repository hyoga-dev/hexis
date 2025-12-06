import { useState, createContext, useContext, useEffect } from "react";
import { auth } from '../firebase.js'; 
import useLocalStorage from "./useLocalStorage";
import { useAuthLogin } from "./useAuthLogin";

const habitContext = createContext()

export const useHabitProvider = () => {
    return useContext(habitContext);
}

const dataHabit = [
    {
        // uid: auth.currentUser ? auth.currentUser.uid : "guest",
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

export function HabitProvider({children}) {
    const { currentUser, loading } = useAuthLogin();
    // dataHabit[0].uid = currentUser ? currentUser.uid : "guest";
    // console.log(currentUser);

    const [value, setValue] = useLocalStorage("habitDetail", dataHabit)
    const [habit, sethabit] = useState(value);

    
    // useEffect(() => {
    //     setValue(habit)
    // }, [habit])

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