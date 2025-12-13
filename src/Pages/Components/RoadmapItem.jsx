import Styles from "../../assets/Styles/roadmap.module.css";
import StarIcon from "../../assets/Icon/StarIcon";
import PenIcon from "../../assets/Icon/PenIcon"; // Assuming you have this or use text

const RoadmapItem = ({ item, onClick, onJoin, onEdit, isJoined, isPersonal, canEdit }) => {
  // Safe Fallbacks
  const title = item.title || "Untitled Roadmap";
  const desc = item.description || "No description provided.";
  const category = item.category || "General";
  const author = item.author || "Unknown";
  const daysCount = item.days ? item.days.length : 0;
  const rating = item.rating || 0;
  
  const percent = item.percent || 0;
  const currentDay = item.currentDay || 1;

  return (
    <div className={Styles.card} onClick={() => onClick(item)}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <span className={Styles.categoryBadge}>{category}</span>

        <div style={{display: 'flex', gap: '8px', alignItems: 'center'}}>
            {/* EDIT BUTTON (Only if Author) */}
            {canEdit && (
                <button 
                    onClick={(e) => { e.stopPropagation(); onEdit(item); }}
                    className={Styles.joinBtn}
                    style={{padding: '4px 8px', fontSize: '0.8rem', border: '1px solid var(--font-color)', color: 'var(--font-color)'}}
                >
                    Edit
                </button>
            )}

            {!isPersonal ? (
                isJoined ? (
                    <span className={Styles.joinedBadge}>✓ Joined</span>
                ) : (
                    <button
                        onClick={(e) => { e.stopPropagation(); if (onJoin) onJoin(item); }}
                        className={Styles.joinBtn}
                    >
                        Join +
                    </button>
                )
            ) : (
                <span style={{ fontWeight: 'bold', color: 'var(--primary-color)', fontSize: '0.9rem' }}>
                    Day {currentDay}
                </span>
            )}
        </div>
      </div>

      <h2>{title}</h2>
      <p>{desc}</p>

      <div className={Styles.cardFooter}>
        <div style={{ display: 'flex', gap: '15px', color: 'var(--secondary-font-color)', fontSize: '0.8rem' }}>
          <span>📅 {daysCount} Days</span>
          {author && <span>👤 {author}</span>}
        </div>

        {!isPersonal && (
          <div className={Styles.star} title="Rating">
            <StarIcon />
            <span>{rating}</span>
          </div>
        )}
      </div>

      {isPersonal && (
        <div className={Styles.progressContainer}>
          <div className={Styles.progressBar} style={{ width: `${percent}%` }}></div>
        </div>
      )}
    </div>
  );
};

export default RoadmapItem;