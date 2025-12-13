import { createContext, useContext, useMemo } from "react";
import useLocalStorage from "./useLocalStorage";

const RoadmapContext = createContext();

export const useRoadmapProvider = () => {
  return useContext(RoadmapContext);
};

// ... (Keep existing OFFICIAL_DATA and INITIAL_COMMUNITY_DATA) ...
const OFFICIAL_DATA = [
  {
    id: 101,
    type: "official",
    category: "Health",
    title: "30-Day Morning Reset",
    description: "Build a powerful morning routine with hydration, movement, and mindfulness.",
    author: "Hexis Team",
    rating: 4.8,
    date: "2024-01-01",
    days: [
        { 
            dayNumber: 1, 
            focus: "Hydration First", 
            habits: [
                { 
                    title: "Drink Water", 
                    description: "Start with 500ml of water.",
                    waktu: ["Morning"], 
                    goals: { target: 1, satuan: "glass", ulangi: "per_day" } 
                }
            ] 
        },
        // ... (truncated for brevity, keep original data)
        { 
            dayNumber: 2, 
            focus: "Move Your Body", 
            habits: [
                { title: "Drink Water", waktu: ["Morning"], goals: { target: 1, satuan: "glass", ulangi: "per_day" } },
                { title: "Light Stretch", description: "Wake up your muscles.", waktu: ["Morning"], goals: { target: 5, satuan: "mins", ulangi: "per_day" } }
            ] 
        },
        { 
            dayNumber: 3, 
            focus: "Mental Clarity", 
            habits: [
                 { title: "Drink Water", waktu: ["Morning"], goals: { target: 1, satuan: "glass", ulangi: "per_day" } },
                 { title: "Light Stretch", waktu: ["Morning"], goals: { target: 5, satuan: "mins", ulangi: "per_day" } },
                 { title: "Mindful Breathing", description: "Box breathing technique.", waktu: ["Morning"], goals: { target: 3, satuan: "mins", ulangi: "per_day" } }
            ] 
        }
    ]
  },
  {
    id: 102,
    type: "official",
    category: "Productivity",
    title: "Deep Work Protocol",
    description: "A 7-day challenge to reclaim your focus and eliminate distractions.",
    author: "Hexis Team",
    rating: 4.9,
    date: "2024-02-15",
    days: [
        { 
            dayNumber: 1, 
            focus: "Eliminate Noise", 
            habits: [
                { title: "Phone Free Hour", description: "No phone for first hour of day.", waktu: ["Morning"], goals: { target: 60, satuan: "mins", ulangi: "per_day" } },
                { title: "Plan Tomorrow", waktu: ["Evening"], goals: { target: 1, satuan: "times", ulangi: "per_day" } }
            ] 
        },
        { 
            dayNumber: 2, 
            focus: "Single Tasking", 
            habits: [
                { title: "Focus Block", description: "One task, no switching.", waktu: ["Morning", "Afternoon"], goals: { target: 90, satuan: "mins", ulangi: "per_day" } },
                { title: "Phone Free Hour", waktu: ["Morning"], goals: { target: 60, satuan: "mins", ulangi: "per_day" } }
            ] 
        }
    ]
  }
];

const INITIAL_COMMUNITY_DATA = [
  {
    id: 201,
    type: "community",
    category: "Fitness",
    title: "Couch to 5K",
    description: "The classic running plan for absolute beginners.",
    author: "RunClub Global",
    rating: 4.5,
    ratings: { "user1": 5, "user2": 4 },
    date: "2024-03-01",
    days: [
        { 
            dayNumber: 1, 
            focus: "The First Steps", 
            habits: [
                { title: "Run / Walk", description: "Run 1 min, Walk 90 sec x 8.", waktu: ["Afternoon"], goals: { target: 20, satuan: "mins", ulangi: "per_day" } }
            ] 
        },
        // ... (truncated, keep original data)
        { 
            dayNumber: 2, 
            focus: "Rest & Recovery", 
            habits: [
                 { title: "Active Recovery Walk", waktu: ["Anytime"], goals: { target: 15, satuan: "mins", ulangi: "per_day" } }
            ] 
        },
         { 
            dayNumber: 3, 
            focus: "Build Stamina", 
            habits: [
                { title: "Run / Walk", description: "Run 2 min, Walk 90 sec x 6.", waktu: ["Afternoon"], goals: { target: 25, satuan: "mins", ulangi: "per_day" } }
            ] 
        }
    ]
  }
];

export function RoadmapProvider({ children }) {
  const [customRoadmaps, setCustomRoadmaps] = useLocalStorage("hexis_community_v2", INITIAL_COMMUNITY_DATA);

  const roadmaps = useMemo(() => {
    return [...OFFICIAL_DATA, ...customRoadmaps];
  }, [customRoadmaps]);

  const addRoadmap = (newRoadmap) => {
    const roadmapWithMeta = {
        ...newRoadmap,
        id: Date.now(),
        type: "community",
        rating: 0, 
        ratings: {},
        date: new Date().toISOString().split('T')[0]
    };
    setCustomRoadmaps([...customRoadmaps, roadmapWithMeta]);
  };

  // --- NEW: Update Existing Roadmap ---
  const updateRoadmap = (id, updatedData) => {
    setCustomRoadmaps(prev => prev.map(r => r.id === id ? { ...r, ...updatedData } : r));
  };

  const rateRoadmap = (roadmapId, userId, score) => {
    const updated = customRoadmaps.map(map => {
        if (map.id === roadmapId) {
            const currentRatings = map.ratings || {};
            const newRatings = { ...currentRatings, [userId]: score };
            const scores = Object.values(newRatings);
            const avg = scores.reduce((a, b) => a + b, 0) / scores.length;

            return { 
                ...map, 
                ratings: newRatings, 
                rating: parseFloat(avg.toFixed(1)) 
            };
        }
        return map;
    });
    setCustomRoadmaps(updated);
  };

  const deleteRoadmap = (id) => {
    setCustomRoadmaps(customRoadmaps.filter(r => r.id !== id));
  };

  const value = {
    roadmaps,
    addRoadmap,
    updateRoadmap, // Exported
    deleteRoadmap,
    rateRoadmap
  };

  return (
    <RoadmapContext.Provider value={value}>
      {children}
    </RoadmapContext.Provider>
  );
}