import style from "../../assets/Styles/habitControls.module.css";
import { useNavigate } from "react-router-dom";

const HabitControls = ({
    activeTab,
    joinedRoadmaps,
    activeRoadmapData,
    onRoadmapSelectorOpen,
    filterTime,
    setFilterTime,
    filterStatus,
    setFilterStatus,
}) => {
    const navigate = useNavigate();

    return (
        <div className={style.controls}>
            {activeTab === "roadmap" && (
                <div className={style.roadmapSelectorContainer}>
                    {joinedRoadmaps.length > 0 ? (
                        <button className={style.selectorTrigger} onClick={onRoadmapSelectorOpen}>
                            <div className={style.triggerLabel}>
                                <span className={style.triggerSubtitle}>Active Roadmap</span>
                                <span className={style.triggerTitle}>{activeRoadmapData?.title || "Select Roadmap"}</span>
                            </div>
                            <span className={style.selectorTriggerIcon}>▼</span>
                        </button>
                    ) : (
                        <button
                            className={`${style.iconBtnSmall} ${style.exploreRoadmapsBtn}`}
                            onClick={() => navigate("/roadmap")}
                        >
                            Explore Roadmaps
                        </button>
                    )}
                </div>
            )}

            <select className={style.filterSelect} value={filterTime} onChange={(e) => setFilterTime(e.target.value)}>
                <option value="all">All Day</option>
                <option value="Morning">Morning</option>
                <option value="Afternoon">Afternoon</option>
                <option value="Evening">Evening</option>
                <option value="Anytime">Anytime</option>
            </select>
            <select className={style.filterSelect} value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                <option value="all">All Status</option>
                <option value="incomplete">To Do</option>
                <option value="completed">Completed</option>
            </select>
        </div>
    );
};

export default HabitControls;