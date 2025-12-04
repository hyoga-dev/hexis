import { useState, createContext, useContext, useEffect } from "react";
import useLocalStorage from "./useLocalStorage";

const habitContext = createContext()

export const useHabitProvider = () => {
    return useContext(habitContext);
}

const dataHabit = [
    {
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
    
    const [value, setValue] = useLocalStorage("habitDetail", dataHabit)
    const [habit, sethabit] = useState(value);

    
    useEffect(() => {
        // console.log(habit);
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