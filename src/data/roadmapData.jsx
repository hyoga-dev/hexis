import { createContext, useContext, useMemo } from "react";
import useLocalStorage from "./useLocalStorage";

const RoadmapContext = createContext();

export const useRoadmapProvider = () => {
  return useContext(RoadmapContext);
};

// --- HELPER: Calculate Average ---
export const getAverageRating = (roadmap) => {
    if (roadmap.ratings && Object.keys(roadmap.ratings).length > 0) {
        const scores = Object.values(roadmap.ratings);
        const sum = scores.reduce((a, b) => a + b, 0);
        return (sum / scores.length).toFixed(1);
    }
    return roadmap.rating || 0;
};

// --- STATIC DATA ---
const OFFICIAL_DATA = [
  {
    id: 1,
    type: "official",
    category: "Health",
    title: "30-Day Morning Reset",
    description: "Start your day right with this hydration and movement bundle.",
    author: "Hexis Team",
    rating: 4.8,
    date: "2024-11-01",
    days: [
        { dayNumber: 1, focus: "Hydration", habits: [{ title: "Drink Water", time: ["Morning"], target: 1, unit: "times" }] },
        { dayNumber: 2, focus: "Movement", habits: [{ title: "Stretch", time: ["Morning"], target: 5, unit: "mins" }] },
        { dayNumber: 3, focus: "Routine", habits: [{ title: "Make Bed", time: ["Morning"] }] }
    ]
  }
];

// --- COMMUNITY DATA ---
const INITIAL_COMMUNITY_DATA = [
  {
    id: 3,
    type: "community",
    category: "Fitness",
    title: "Couch to 5K",
    description: "Beginner running plan.",
    author: "RunClub Global",
    rating: 4.5,
    ratings: { "mock_user": 5, "mock_user_2": 4 },
    date: "2025-02-01",
    days: [
        { dayNumber: 1, focus: "Run", habits: [{ title: "Run 1min", time: ["Afternoon"], target: 20, unit: "mins" }] }
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
    deleteRoadmap,
    rateRoadmap
  };

  return (
    <RoadmapContext.Provider value={value}>
      {children}
    </RoadmapContext.Provider>
  );
}