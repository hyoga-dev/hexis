import modalStyle from "../../assets/Styles/modal.module.css";
import style from "../../assets/Styles/habitProgressModal.module.css";
import TimerInterface from "./TimerInterface";

const HabitProgressModal = ({ popUpContent, onClose, onSave, setPopUpContent }) => {
    // 1. Safety Check: If no content, do not render
    if (!popUpContent) return null;

    // 2. Safe Access: Use ?. to prevent crash if goals or satuan is missing
    const timeContext = popUpContent.timeContext || "Anytime";
    const satuan = popUpContent.goals?.satuan || "";
    const isTimer = ["minutes", "hours"].includes(satuan);

    // Default values for counters
    // Get the count for the specific time slot, fallback to global count for older data
    const currentCount = popUpContent.completion?.[timeContext] || 0;
    const targetCount = popUpContent.goals?.target || 1;

    return (
        <div className={`${modalStyle.popUp} ${modalStyle.modalOverlay}`}>

            <div className={modalStyle.popUpBackground} onClick={onClose} />

            <div className={`${modalStyle.popUpCard} ${modalStyle.modalCard}`}>
                <button className={modalStyle.closeBtn} onClick={onClose}>×</button>

                <h3 className={modalStyle.popUpTitle}>{popUpContent.title || "Habit"}</h3>

                {isTimer ? (
                    <TimerInterface habit={popUpContent} onSave={onSave} onClose={onClose} />
                ) : (
                    <div className={style.counterWrapper}>
                        <p className={style.popUpSubtitle}>How many {satuan} today?</p>
                        <div className={style.counterControls}>
                            <button
                                onClick={() => setPopUpContent(p => ({
                                    ...p,
                                    completion: {
                                        ...(p.completion || {}),
                                        [timeContext]: Math.max(0, (p.completion?.[timeContext] || 0) - 1)
                                    }
                                }))}
                                className={style.counterBtn}
                            >
                                -
                            </button>

                            <span className={style.counterDisplay}>{currentCount}</span>

                            <button
                                onClick={() => setPopUpContent(p => ({
                                    ...p,
                                    completion: {
                                        ...(p.completion || {}),
                                        [timeContext]: (p.completion?.[timeContext] || 0) + 1
                                    }
                                }))}
                                className={style.counterBtn}
                            >
                                +
                            </button>
                        </div>
                        <p className={style.targetInfo}>Target: {targetCount}</p>
                        <button onClick={() => onSave(currentCount)} className={`${modalStyle.btn} ${modalStyle.btnPrimary} ${modalStyle.btnFullWidth}`}>Save Progress</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HabitProgressModal;