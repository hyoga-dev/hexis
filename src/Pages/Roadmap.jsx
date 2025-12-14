import Styles from "../assets/Styles/roadmap.module.css";
import StarIcon from "../assets/Icon/StarIcon";
import AddHabitIcon from "../assets/Icon/AddHabitIcon";
import PenIcon from "../assets/Icon/PenIcon";
import DeleteIcon from "../assets/Icon/DeleteIcon";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import NavbarStyles from "../assets/Styles/navbar.module.css";
import BurgerIcon from "../assets/Icon/SideBar/BurgerIcon";
import SideBar from "./Components/SideBar";
import { useHabitProvider } from "../data/habitData";
import { useRoadmapProvider } from "../data/roadmapData";
import { useAuth } from "../data/AuthProvider";

const Roadmap = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("official");

  const navigate = useNavigate();
  const { habit, addHabitsBatch, roadmapProgress } = useHabitProvider();
  const { roadmaps, deleteRoadmap, loading } = useRoadmapProvider();
  const { currentUser } = useAuth();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [showMyCreations, setShowMyCreations] = useState(false);

  // --- DERIVE MY ROADMAPS ---
  const myRoadmaps = useMemo(() => {
    if (!habit || habit.length === 0) return [];

    const map = new Map();
    habit.forEach(h => {
      if (h.roadmapId) {
        if (!map.has(h.roadmapId)) {
          const original = roadmaps.find(r => r.id === h.roadmapId);
          map.set(h.roadmapId, {
            id: h.roadmapId,
            habits: [],
            title: h.roadmapTitle || original?.title || "Untitled Roadmap",
            category: h.area || "General",
            description: h.roadmapDescription || original?.description || "Your ongoing journey.",
            author: original?.author || "You",
            days: original?.days || [],
            type: "personal"
          });
        }
        map.get(h.roadmapId).habits.push(h);
      }
    });

    return Array.from(map.values()).map(joined => {
      if (!joined.days || joined.days.length === 0) {
        const daysMap = new Map();
        joined.habits.forEach(h => {
          const dNum = h.dayNumber || 1;
          if (!daysMap.has(dNum)) {
            daysMap.set(dNum, { dayNumber: dNum, focus: h.dayFocus || `Day ${dNum}`, habits: [] });
          }
          daysMap.get(dNum).habits.push(h);
        });
        joined.days = Array.from(daysMap.values()).sort((a, b) => a.dayNumber - b.dayNumber);
      }

      const total = joined.habits.length;
      const lastCompletedDay = roadmapProgress?.[joined.id] || 0;
      const totalDays = joined.days.length || 1;
      const percent = Math.min(Math.round((lastCompletedDay / totalDays) * 100), 100);

      return {
        ...joined,
        progress: `${percent}%`,
        currentDay: lastCompletedDay + 1,
        habitCount: total
      };
    });
  }, [habit, roadmaps, roadmapProgress]);

  // --- HANDLERS ---
  const handleJoinRoadmap = async (e, roadmapItem) => {
    e.stopPropagation();
    const isJoined = habit.some(h => h.roadmapId === roadmapItem.id);
    if (isJoined) return;

    if (!roadmapItem.days || roadmapItem.days.length === 0) {
      alert("This roadmap is empty.");
      return;
    }

    const allNewHabits = [];
    roadmapItem.days.forEach(day => {
      day.habits.forEach(h => {
        allNewHabits.push({
          title: h.title,
          waktu: h.time || ["Morning"],
          repeatType: "daily",
          daySet: ["senin", "selasa", "rabu", "kamis", "jumat", "sabtu", "minggu"],
          goals: h.goals || { count: 0, target: h.target || 1, satuan: h.unit || "times", ulangi: "per_day" },
          waktuMulai: new Date().toISOString().split('T')[0],
          pengingat: "09:00",
          kondisihabis: "Never",
          area: roadmapItem.category,
          isGrouped: false,
          roadmapId: roadmapItem.id,
          roadmapTitle: roadmapItem.title,
          dayNumber: day.dayNumber,
          dayFocus: day.focus,
          completion: {}
        });
      });
    });

    await addHabitsBatch(allNewHabits);
  };

  const handleDelete = (e, item) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to permanently delete the "${item.title}" roadmap? This cannot be undone.`)) {
      deleteRoadmap(item.id);
    }
  };

  // --- EDIT HANDLER ---
  const handleEdit = (e, item) => {
    e.stopPropagation();
    const isAuthor = currentUser && (item.author === currentUser.displayName || item.author === currentUser.email);
    const isPersonalEdit = activeTab === "personal";

    navigate("/CreateRoadmap", {
      state: {
        editData: item,
        mode: isPersonalEdit ? 'personal' : 'global'
      }
    });
  };

  // --- DATA FILTERING ---
  const tabData = activeTab === "personal"
    ? myRoadmaps
    : roadmaps.filter((item) => {
      if (activeTab === "official") return item.type === "official";
      if (activeTab === "community") {
        if (showMyCreations) {
          const myName = currentUser?.displayName || currentUser?.email;
          return item.type === "community" && item.author === myName;
        }
        return item.type === "community";
      }
      return true;
    });

  const categories = useMemo(() => {
    const cats = tabData.map(item => item.category);
    return ["All", ...new Set(cats)];
  }, [tabData]);

  const finalDisplayData = useMemo(() => {
    let processedData = tabData.filter((item) => {
      const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        (item.title && item.title.toLowerCase().includes(query)) ||
        (item.category && item.category.toLowerCase().includes(query));
      return matchesCategory && matchesSearch;
    });

    processedData.sort((a, b) => {
      if (sortBy === "newest") return new Date(b.date || 0) - new Date(a.date || 0);
      else if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
      return 0;
    });

    return processedData;
  }, [tabData, selectedCategory, searchQuery, sortBy]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchQuery("");
    setSelectedCategory("All");
    setSortBy("newest");
    setShowMyCreations(false);
  };

  return (
    <div className={Styles.wrapper}>
      <SideBar isOpen={isOpen} onClose={() => setIsOpen(false)} />
      <div className={NavbarStyles.header}>
        <button onClick={() => setIsOpen(true)} className={NavbarStyles.menuBtn}>
          <BurgerIcon color="var(--font-color)" width="2rem" height="2rem" />
        </button>
      </div>

      <div className={Styles.container}>
        <div className={Styles.nav}>
          <button onClick={() => handleTabChange("official")} className={`${Styles.navItem} ${activeTab === "official" ? Styles.active : ""}`}>Official</button>
          <button onClick={() => handleTabChange("community")} className={`${Styles.navItem} ${activeTab === "community" ? Styles.active : ""}`}>Community</button>
          <button onClick={() => handleTabChange("personal")} className={`${Styles.navItem} ${activeTab === "personal" ? Styles.active : ""}`}>My Roadmap</button>
        </div>

        <div className={Styles.controls}>
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={Styles.searchInput}
          />
          <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className={Styles.categorySelect}>
            {categories.map((cat) => <option key={cat} value={cat}>{cat === "All" ? "All Categories" : cat}</option>)}
          </select>
          {activeTab === "community" && (
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className={Styles.categorySelect}>
              <option value="newest">Newest</option>
              <option value="rating">Top Rated</option>
            </select>
          )}
          {activeTab === "community" && (
            <button className={Styles.createBtn} onClick={() => navigate("/CreateRoadmap")}>
              <AddHabitIcon className={Styles.btnIcon} />
              <span className={Styles.btnText}>Create</span>
            </button>
          )}
        </div>

        {activeTab === "community" && (
          <div style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: '0.9rem', color: 'var(--secondary-font-color)' }}>
              <input type="checkbox" checked={showMyCreations} onChange={(e) => setShowMyCreations(e.target.checked)} style={{ width: 16, height: 16, accentColor: 'var(--primary-color)' }} />
              Show only my creations
            </label>
          </div>
        )}

        <div>
          {finalDisplayData.length > 0 ? (
            finalDisplayData.map((item) => {
              const isJoined = habit.some(h => h.roadmapId === item.id);
              const isAuthor = currentUser && (item.author === currentUser.displayName || item.author === currentUser.email);
              const canEdit = activeTab === "personal" || (activeTab === "community" && isAuthor);
              const canDelete = activeTab === "community" && isAuthor;

              return (
                <div
                  key={item.id}
                  className={Styles.card}
                  // --- FIX HERE: ALWAYS GO TO DETAIL PAGE ---
                  onClick={() => navigate("/roadmap-detail", { state: { roadmapItem: item } })}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span className={Styles.categoryBadge}>{item.category}</span>

                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      {canEdit && (
                        <button
                          onClick={(e) => handleEdit(e, item)}
                          style={{
                            background: 'none',
                            border: '1px solid var(--secondary-font-color)',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            padding: '4px 8px',
                            color: 'var(--font-color)',
                            fontSize: '0.8rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            zIndex: 10
                          }}
                        >
                          <PenIcon width="0.8rem" height="0.8rem" color="var(--font-color)" />
                          <span>Edit</span>
                        </button>
                      )}
                      {canDelete && (
                        <button
                          onClick={(e) => handleDelete(e, item)}
                          style={{
                            background: 'none',
                            border: '1px solid #ff4d4d',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            padding: '4px 8px',
                            color: '#ff4d4d',
                            fontSize: '0.8rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            zIndex: 10
                          }}
                        >
                          <DeleteIcon width="0.8rem" height="0.8rem" color="#ff4d4d" />
                          <span>Delete</span>
                        </button>
                      )}

                      {activeTab !== "personal" ? (
                        isJoined ? (
                          <span className={Styles.joinedBadge}>✓ Joined</span>
                        ) : (
                          <button
                            onClick={(e) => handleJoinRoadmap(e, item)}
                            className={Styles.joinBtn}
                          >
                            Join +
                          </button>
                        )
                      ) : (
                        <span style={{ fontWeight: 'bold', color: 'var(--primary-color)', fontSize: '0.9rem' }}>
                          Current: Day {item.currentDay}
                        </span>
                      )}
                    </div>
                  </div>

                  <h2>{item.title}</h2>
                  <p>{item.description}</p>

                  <div className={Styles.cardFooter}>
                    <div style={{ display: 'flex', gap: '15px', color: 'var(--secondary-font-color)', fontSize: '0.8rem' }}>
                      <span>📅 {item.days ? item.days.length : 0} Days</span>
                      {item.author && <span>👤 {item.author}</span>}
                    </div>

                    {(activeTab === "community" || activeTab === "official") && (
                      <div className={Styles.star} title="Rating">
                        <StarIcon />
                        <span>{item.rating || 0}</span>
                      </div>
                    )}
                  </div>

                  {activeTab === "personal" && (
                    <div className={Styles.progressContainer}>
                      <div className={Styles.progressBar} style={{ width: item.progress }}></div>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div style={{ textAlign: 'center', marginTop: '40px', color: 'gray' }}>
              <p>No roadmaps found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Roadmap;