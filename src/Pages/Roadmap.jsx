import Styles from "../assets/Styles/roadmap.module.css";
import StarIcon from "../assets/Icon/StarIcon";
import AddHabitIcon from "../assets/Icon/AddHabitIcon"; 
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom"; // 1. Import useNavigate
import NavbarStyles from "../assets/Styles/navbar.module.css";
import BurgerIcon from "../assets/Icon/SideBar/BurgerIcon";
import SideBar from "./Components/SideBar";
import { useHabitProvider } from "../data/habitData";

// --- MOCK DATA ---
const ROADMAP_DATA = [
  // 1. Official
  {
    id: 1,
    type: "official",
    category: "Health",
    title: "30-Day Morning Reset",
    description: "Start your day right with this hydration and movement bundle.",
    date: "2024-11-01",
    habits: [
        { title: "Drink 500ml Water", time: ["Morning"] },
        { title: "5 Min Stretching", time: ["Morning"] },
        { title: "Make Bed", time: ["Morning"] }
    ]
  },
  {
    id: 2,
    type: "official",
    category: "Productivity",
    title: "Deep Work Mastery",
    description: "Train your focus with these daily work blocks.",
    date: "2024-12-15",
    habits: [
        { title: "No Phone Block (1h)", time: ["Morning"] },
        { title: "Read 10 Pages", time: ["Evening"] }
    ]
  },
  // 2. Community
  {
    id: 3,
    type: "community",
    category: "Fitness",
    title: "Couch to 5K",
    description: "Beginner running plan.",
    rating: 4.5,
    date: "2025-02-01",
    habits: [
        { title: "Run / Walk 30m", time: ["Afternoon"] }
    ]
  },
  {
    id: 4,
    type: "community",
    category: "Mindfulness",
    title: "Zen Habits",
    description: "Daily mindfulness routine.",
    rating: 4.2,
    date: "2025-01-20",
    habits: [
        { title: "Meditate 10m", time: ["Morning"] },
        { title: "Gratitude Journal", time: ["Evening"] }
    ]
  },
  // 3. My Roadmap
  {
    id: 10,
    type: "personal",
    category: "Learning",
    title: "My React Journey",
    description: "My personal plan to master React hooks.",
    date: "2025-02-15",
    progress: "40%",
  },
];

const Roadmap = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("official"); 
  
  const navigate = useNavigate(); // 2. Initialize Hook
  const { habit, setHabit } = useHabitProvider();

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("newest");

  // --- LOGIC: JOIN ROADMAP ---
  const handleJoinRoadmap = (roadmapItem) => {
    if (!roadmapItem.habits || roadmapItem.habits.length === 0) {
        alert("This roadmap has no habits configured.");
        return;
    }

    const newHabits = roadmapItem.habits.map((item) => ({
        title: item.title,
        waktu: item.time || ["Morning"],
        repeatType: "daily",
        daySet: ["senin", "selasa", "rabu", "kamis", "jumat", "sabtu", "minggu"],
        goals: { count: 0, target: 1, satuan: "times", ulangi: "per_day" }, // Fixed count:0
        waktuMulai: new Date().toISOString().split('T')[0],
        pengingat: "09:00",
        kondisihabis: "Never",
        area: roadmapItem.category,
        isGrouped: false,
        roadmapId: roadmapItem.id
    }));

    setHabit([...habit, ...newHabits]);
    alert(`Successfully joined "${roadmapItem.title}"!`);
  };

  // --- DATA FILTERING ---
  const tabData = ROADMAP_DATA.filter((item) => item.type === activeTab);

  const categories = useMemo(() => {
    const cats = tabData.map(item => item.category);
    return ["All", ...new Set(cats)];
  }, [tabData]);

  const finalDisplayData = useMemo(() => {
    let processedData = tabData.filter((item) => {
      const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        item.title.toLowerCase().includes(query) || 
        item.category.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });

    processedData.sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.date) - new Date(a.date);
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
        
        {/* Nav */}
        <div className={Styles.nav}>
          <button onClick={() => handleTabChange("official")} className={`${Styles.navItem} ${activeTab === "official" ? Styles.active : ""}`}>Official</button>
          <button onClick={() => handleTabChange("community")} className={`${Styles.navItem} ${activeTab === "community" ? Styles.active : ""}`}>Community</button>
          <button onClick={() => handleTabChange("personal")} className={`${Styles.navItem} ${activeTab === "personal" ? Styles.active : ""}`}>My Roadmap</button>
        </div>

        {/* Controls */}
        <div className={Styles.controls}>
          <input 
            type="text" 
            placeholder="Search..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={Styles.searchInput}
          />
          
          {/* 3. Changed Chips back to Dropdown */}
          <select 
            value={selectedCategory} 
            onChange={(e) => setSelectedCategory(e.target.value)}
            className={Styles.categorySelect}
          >
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

          {/* 4. Fixed Routing */}
          <button className={Styles.createBtn} onClick={() => navigate("/CreateRoadmap")}>
             <AddHabitIcon className={Styles.btnIcon} />
             <span className={Styles.btnText}>Create</span>
          </button>
        </div>

        {/* List */}
        <div>
          {finalDisplayData.length > 0 ? (
            finalDisplayData.map((item) => (
              <div 
                key={item.id} 
                className={Styles.card}
                onClick={() => navigate("/roadmap-detail", { state: { roadmapItem: item } })}
                style={{ cursor: "pointer" }}
              >
                <div style={{display:'flex', justifyContent:'space-between', alignItems: 'center'}}>
                   <span className={Styles.categoryBadge}>{item.category}</span>

                   {activeTab !== "personal" && (
                     <button 
                        onClick={(e) => {
                            e.stopPropagation(); // Prevent navigating to detail page
                            handleJoinRoadmap(item);
                        }}
                        style={{
                            background: "transparent",
                            border: "1px solid var(--primary-color)",
                            color: "var(--primary-color)",
                            padding: "6px 12px",
                            borderRadius: "6px",
                            fontWeight: "bold",
                            cursor: "pointer",
                            fontSize: "0.8rem",
                            transition: "all 0.2s"
                        }}
                     >
                        Join +
                     </button>
                   )}

                   {activeTab === "personal" && (
                     <span style={{fontWeight:'bold', color: 'var(--primary-color)'}}>{item.progress}</span>
                   )}
                </div>

                <h2>{item.title}</h2>
                <p>{item.description}</p>

                {item.habits && (
                    <p style={{fontSize: "0.8rem", color: "var(--secondary-font-color)", marginTop: "5px"}}>
                        Includes {item.habits.length} daily habits
                    </p>
                )}

                {activeTab === "community" && (
                  <div className={Styles.star}>
                    <StarIcon />
                    <span>{item.rating}</span>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p>No roadmaps found.</p>
          )}
        </div>

      </div>
    </div>
  );
};

export default Roadmap;