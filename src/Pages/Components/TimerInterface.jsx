import { useState, useRef, useEffect } from "react";
import style from "../../assets/Styles/timerInterface.module.css";

const TimerInterface = ({ habit, onSave, onClose }) => {
    const [isActive, setIsActive] = useState(false);
    const [seconds, setSeconds] = useState(0);
    const intervalRef = useRef(null);

    const timeContext = habit.timeContext || "Anytime";
    const currentProgress = habit.completion?.[timeContext] || 0;

    const formatTime = (totalSeconds) => {
        const h = Math.floor(totalSeconds / 3600);
        const m = Math.floor((totalSeconds % 3600) / 60);
        const s = totalSeconds % 60;
        if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const toggleTimer = () => {
        if (isActive) {
            clearInterval(intervalRef.current);
            setIsActive(false);
        } else {
            setIsActive(true);
            intervalRef.current = setInterval(() => setSeconds(p => p + 1), 1000);
        }
    };

    const handleFinish = () => {
        clearInterval(intervalRef.current);
        setIsActive(false);
        let added = habit.goals.satuan === "hours" ? parseFloat((seconds / 3600).toFixed(2)) : Math.floor(seconds / 60);

        // Calculate new total and save
        if (added > 0) {
            onSave(currentProgress + added);
        } else {
            onClose();
        }
    };

    useEffect(() => () => clearInterval(intervalRef.current), []);

    return (
        <div className={style.counterWrapper}>
            <div className={style.timerDisplay}>{formatTime(seconds)}</div>
            <div className={style.timerProgressInfo} >
                Current Progress: {currentProgress} / {habit.goals.target} {habit.goals.satuan}
            </div>
            <div className={style.timerControls}>
                {!isActive && seconds > 0 && (
                    <button className={`${style.timerBtn} ${style.resetBtn}`} onClick={() => setSeconds(0)}>↺</button>
                )}
                <button
                    className={`${style.timerBtn} ${isActive ? style.stopBtn : style.startBtn}`}
                    onClick={toggleTimer}
                >
                    {isActive ? "⏸" : "▶"}
                </button>
                <button className={`${style.timerBtn} ${style.finishBtn}`} onClick={handleFinish}>
                    ✔
                </button>
            </div>
        </div>
    );
};

export default TimerInterface;