import modalStyle from "../../assets/Styles/modal.module.css";
import style from "../../assets/Styles/roadmapSelectorModal.module.css";

const RoadmapSelectorModal = ({ isOpen, onClose, roadmaps, activeId, onSelect, onExplore }) => {
  if (!isOpen) return null;

  return (
    <div className={modalStyle.popUp}>
      <div className={modalStyle.popUpBackground} onClick={onClose} />
      <div className={`${modalStyle.popUpCard} ${style.roadmapSelectorModalCard}`}>
        <button className={modalStyle.closeBtn} onClick={onClose}>×</button>
        <h3 className={modalStyle.popUpTitle}>Switch Roadmap</h3>
        <div className={style.selectorList}>
          {roadmaps.map((rm) => (
            <div
              key={rm.id}
              className={`${style.selectorCard} ${activeId === rm.id ? style.active : ''}`}
              onClick={() => onSelect(rm)}
            >
              <div className={style.roadmapMeta}>
                <span className={style.roadmapTitle}>{rm.title}</span>
                <span className={style.roadmapPercent}>
                  {rm.percent}%
                </span>
              </div>
              <p className={style.roadmapDesc}>{rm.description}</p>
              <div className={style.miniProgress}>
                <div className={style.miniFill} style={{ width: `${rm.percent}%` }}></div>
              </div>
            </div>
          ))}
        </div>
        <button onClick={onExplore} className={`${modalStyle.btn} ${modalStyle.btnPrimary} ${style.exploreRoadmapsBtn}`}>
          + Join New Roadmap
        </button>
      </div>
    </div>
  );
};

export default RoadmapSelectorModal;