import Styles from "../assets/Styles/roadmap.module.css";
import StarIcon from "../assets/Icon/StarIcon";
import AddHabitIcon from "../assets/Icon/AddHabitIcon";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import NavbarStyles from "../assets/Styles/navbar.module.css";
import BurgerIcon from "../assets/Icon/SideBar/BurgerIcon";
import SideBar from "./Components/SideBar";
import { useHabitProvider } from "../data/habitData";
import { useRoadmapProvider } from "../data/roadmapData";

const Roadmap = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("official");

  const navigate = useNavigate();
  const { habit, setHabit } = useHabitProvider();

  // Destructure upvoteRoadmap
  const { roadmaps, upvoteRoadmap } = useRoadmapProvider();

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("newest");

  // --- 1. DERIVE MY ROADMAPS FROM HABIT CONTEXT ---
  const myRoadmaps = useMemo(() => {
    if (!habit || habit.length === 0) return [];

    const map = new Map();
    habit.forEach(h => {
      if (h.roadmapId) {
        if (!map.has(h.roadmapId)) {
          map.set(h.roadmapId, {
            id: h.roadmapId,
            habits: [],
            title: h.roadmapTitle || "Untitled Roadmap",
            category: h.area || "General",
            description: "Your ongoing journey.",
            type: "personal"
          });
        }
        map.get(h.roadmapId).habits.push(h);
      }
    });

    return Array.from(map.values()).map(joined => {
      const original = roadmaps.find(r => r.id === joined.id);
      const total = joined.habits.length;
      const completed = joined.habits.filter(h => (h.goals.count || 0) >= (h.goals.target || 1)).length;
      const progressPercent = total === 0 ? 0 : Math.round((completed / total) * 100);

      return {
        ...joined,
        ...(original || {}),
        type: "personal",
        progress: `${progressPercent}%`,
        habitCount: total
      };
    });
  }, [habit, roadmaps]);

  // --- HANDLERS ---
  const handleJoinRoadmap = (e, roadmapItem) => {
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
          goals: { count: 0, target: h.target || 1, satuan: h.unit || "times", ulangi: "per_day" },
          waktuMulai: new Date().toISOString().split('T')[0],
          pengingat: "09:00",
          kondisihabis: "Never",
          area: roadmapItem.category,
          isGrouped: false,
          roadmapId: roadmapItem.id,
          roadmapTitle: roadmapItem.title,
          dayNumber: day.dayNumber,
          dayFocus: day.focus,
          completedTimeSlots: []
        });
      });
    });

    const uniqueHabits = Array.from(new Map(allNewHabits.map(item => [item.title, item])).values());
    setHabit([...habit, ...uniqueHabits]);
  };

  const handleUpvote = (e, item) => {
    e.stopPropagation();
    // Only allow voting for community items in the community tab
    if (activeTab === "community") {
      upvoteRoadmap(item.id);
    }
  };

  // --- DATA FILTERING ---
  const tabData = activeTab === "personal"
    ? myRoadmaps
    : roadmaps.filter((item) => item.type === activeTab);

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
      if (sortBy === "newest") {
        return new Date(b.date || 0) - new Date(a.date || 0);
      } else if (sortBy === "rating") {
        return (b.rating || 0) - (a.rating || 0);
      }
      return 0;
    });

    return processedData;
  }, [tabData, selectedCategory, searchQuery, sortBy]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchQuery("");
    setSelectedCategory("All");
    setSortBy("newest");
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
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat === "All" ? "All Categories" : cat}</option>
            ))}
          </select>
          {activeTab === "community" && (
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className={Styles.categorySelect}>
              <option value="newest">Newest</option>
              <option value="rating">Top Rated</option>
            </select>
          )}
          <button className={Styles.createBtn} onClick={() => navigate("/CreateRoadmap")}>
            <AddHabitIcon className={Styles.btnIcon} />
            <span className={Styles.btnText}>Create</span>
          </button>
        </div>

        <div>
          {finalDisplayData.length > 0 ? (
            finalDisplayData.map((item) => {
              const isJoined = habit.some(h => h.roadmapId === item.id);

              return (
                <div
                  key={item.id}
                  className={Styles.card}
                  onClick={() => navigate("/roadmap-detail", { state: { roadmapItem: item } })}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span className={Styles.categoryBadge}>{item.category}</span>

                    {/* Join Button or Joined Badge */}
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
                        {item.progress}
                      </span>
                    )}
                  </div>

                  <h2>{item.title}</h2>
                  <p>{item.description}</p>

                  <div className={Styles.cardFooter}>
                    <div style={{ display: 'flex', gap: '15px', color: 'var(--secondary-font-color)', fontSize: '0.8rem' }}>
                      <span>📅 {item.days ? item.days.length : 0} Days</span>
                      {/* Display Author Name */}
                      {item.author && (
                        <span>👤 {item.author}</span>
                      )}
                    </div>

                    {/* Interactive Rating */}
                    {(activeTab === "community" || activeTab === "official") && (
                      <div
                        className={Styles.star}
                        title="Rating"
                      >
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
              {activeTab === "personal" ? (
                <>
                  <p>You haven't joined any roadmaps yet.</p>
                  <button
                    onClick={() => handleTabChange("official")}
                    className={Styles.linkBtn}
                  >
                    Browse Official Plans →
                  </button>
                </>
              ) : (
                <p>No roadmaps found.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Roadmap;