import { useEffect } from "react";
import { useHabitProvider } from "../../data/habitData";

export default function useAddHabit() {
    const {habit, setHabit} = useHabitProvider();

    const setData = () => {
        habit.push();
    }

    return [setData];
}