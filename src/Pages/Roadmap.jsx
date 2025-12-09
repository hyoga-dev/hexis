import Styles from "../assets/Styles/roadmap.module.css";
import StarIcon from "../assets/Icon/StarIcon";
import AddHabitIcon from "../assets/Icon/AddHabitIcon"; 
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom"; 
import NavbarStyles from "../assets/Styles/navbar.module.css";
import BurgerIcon from "../assets/Icon/SideBar/BurgerIcon";
import SideBar from "./Components/SideBar";
import { useHabitProvider } from "../data/habitData";

// --- MOCK DATA (STRUCTURED BY DAYS) ---
const ROADMAP_DATA = [
  // 1. Official
  {
    id: 1,
    type: "official",
    category: "Health",
    title: "30-Day Morning Reset",
    description: "Start your day right with this hydration and movement bundle.",
    date: "2024-11-01",
    days: [
        { 
            dayNumber: 1, 
            focus: "Hydration First", 
            habits: [{ title: "Drink 500ml Water", time: ["Morning"], target: 1, unit: "times" }]
        },
        { 
            dayNumber: 2, 
            focus: "Add Movement", 
            habits: [
                { title: "Drink 500ml Water", time: ["Morning"], target: 1, unit: "times" },
                { title: "5 Min Stretching", time: ["Morning"], target: 5, unit: "mins" }
            ]
        },
        { 
            dayNumber: 3, 
            focus: "Full Routine", 
            habits: [
                { title: "Drink 500ml Water", time: ["Morning"] },
                { title: "5 Min Stretching", time: ["Morning"] },
                { title: "Make Bed", time: ["Morning"] }
            ]
        }
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
    days: [
        { 
            dayNumber: 1, 
            focus: "The First Run", 
            habits: [{ title: "Run 1min / Walk 1min", time: ["Afternoon"], target: 20, unit: "mins" }]
        },
        { 
            dayNumber: 2, 
            focus: "Active Recovery", 
            habits: [{ title: "Light Walk", time: ["Anytime"], target: 15, unit: "mins" }]
        },
        { 
            dayNumber: 3, 
            focus: "Push Harder", 
            habits: [{ title: "Run 2min / Walk 1min", time: ["Afternoon"], target: 20, unit: "mins" }]
        }
    ]
  }
];

const Roadmap = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("official"); 
  
  const navigate = useNavigate(); 
  const { habit, setHabit } = useHabitProvider();

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("newest");

  // --- LOGIC: JOIN ROADMAP (Adapted for Days) ---
  const handleJoinRoadmap = (roadmapItem) => {
    // Flatten all habits from all days into one list for the user
    // (In a real app, you might only add Day 1's habits first)
    if (!roadmapItem.days || roadmapItem.days.length === 0) {
        alert("This roadmap is empty.");
        return;
    }

    const allNewHabits = [];
    
    roadmapItem.days.forEach(day => {
        day.habits.forEach(h => {
             // Avoid adding duplicates if the same habit is in multiple days
             // For simplicity here, we add them all, but you might want logic to merge duplicates
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
                roadmapId: roadmapItem.id
             });
        });
    });

    // Simple de-duplication based on title to avoid spamming the user's list
    const uniqueHabits = Array.from(new Map(allNewHabits.map(item => [item.title, item])).values());

    setHabit([...habit, ...uniqueHabits]);
    alert(`Successfully joined "${roadmapItem.title}"! Added ${uniqueHabits.length} unique habits.`);
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
                            e.stopPropagation(); 
                            handleJoinRoadmap(item);
                        }}
                        style={{
                            background: "transparent", border: "1px solid var(--primary-color)", color: "var(--primary-color)",
                            padding: "6px 12px", borderRadius: "6px", fontWeight: "bold", cursor: "pointer", fontSize: "0.8rem"
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

                {item.days && (
                    <p style={{fontSize: "0.8rem", color: "var(--secondary-font-color)", marginTop: "5px"}}>
                        {item.days.length} Days Plan
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