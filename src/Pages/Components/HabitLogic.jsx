import { useEffect } from "react";
import { useHabitProvider } from "../../data/habitData";
import useAddHabit from "./useAddHabit";


const getDayName = () => {
    const days = ['minggu', 'senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu'];
    return days[new Date().getDay()];
};




export default function HabitLogic() {
    const {habit, setHabit} = useHabitProvider();

    const daySet = ["senin", "rabu", "jumat", "sabtu"];
    const isToday = daySet.includes(getDayName());

    
    // console.log(isToday);
    // console.log("Hari ini adalah hari: " + getDayName());   
}



