import { createContext, useContext, useMemo, useState, useEffect } from "react";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { useAuth } from "./AuthProvider";

const RoadmapContext = createContext();

export const useRoadmapProvider = () => {
  return useContext(RoadmapContext);
};

// ... (Keep existing OFFICIAL_DATA and INITIAL_COMMUNITY_DATA) ...
const OFFICIAL_DATA = [];

const INITIAL_COMMUNITY_DATA = [];

export function RoadmapProvider({ children }) {
  const { currentUser, isGuest } = useAuth();
  const [communityRoadmaps, setCommunityRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoadmaps = async () => {
      setLoading(true);
      try {
        const roadmapsCollectionRef = collection(db, "roadmaps");
        const roadmapsSnapshot = await getDocs(roadmapsCollectionRef);
        const allRoadmaps = roadmapsSnapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));
        setCommunityRoadmaps(allRoadmaps);
      } catch (error) {
        console.error("Error fetching roadmaps:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoadmaps();
  }, []);

  const roadmaps = useMemo(() => {
    return [...OFFICIAL_DATA, ...communityRoadmaps];
  }, [communityRoadmaps]);

  const addRoadmap = async (newRoadmap) => {
    if (!currentUser || isGuest) {
      alert("You must be logged in to create a roadmap.");
      return null;
    }

    const roadmapWithMeta = {
      ...newRoadmap,
      type: "community",
      rating: 0,
      ratings: {},
      date: new Date().toISOString(),
      authorId: currentUser.uid,
      author: currentUser.displayName || currentUser.email,
      authorPhotoURL: currentUser.photoURL || null,
    };

    const roadmapsCollectionRef = collection(db, "roadmaps");
    const newDocRef = await addDoc(roadmapsCollectionRef, roadmapWithMeta);
    const newRoadmapWithId = { ...roadmapWithMeta, id: newDocRef.id };
    setCommunityRoadmaps((prev) => [...prev, newRoadmapWithId]);
    return newRoadmapWithId;
  };

  // --- NEW: Update Existing Roadmap ---
  const updateRoadmap = async (id, updatedData) => {
    if (!currentUser || isGuest) {
      alert("You must be logged in to edit a roadmap.");
      return;
    }
    const roadmapDocRef = doc(db, "roadmaps", id);
    await updateDoc(roadmapDocRef, updatedData);
    setCommunityRoadmaps((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...updatedData } : r))
    );
  };

  const rateRoadmap = async (roadmapId, userId, score) => {
    if (!currentUser || isGuest) {
      alert("You must be logged in to rate a roadmap.");
      return;
    }
    const roadmapToUpdate = communityRoadmaps.find((r) => r.id === roadmapId);
    if (!roadmapToUpdate) return;

    const currentRatings = roadmapToUpdate.ratings || {};
    const newRatings = { ...currentRatings, [userId]: score };
    const scores = Object.values(newRatings);
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
    const newAvgRating = parseFloat(avg.toFixed(1));

    const updatedFields = { ratings: newRatings, rating: newAvgRating };

    const roadmapDocRef = doc(db, "roadmaps", roadmapId);
    await updateDoc(roadmapDocRef, updatedFields);

    setCommunityRoadmaps((prev) => prev.map((map) => {
      if (map.id === roadmapId) {
        return { ...map, ...updatedFields };
      }
      return map;
    }));
  };

  const deleteRoadmap = async (id) => {
    if (!currentUser || isGuest) {
      alert("You must be logged in to delete a roadmap.");
      return;
    }
    const roadmapDocRef = doc(db, "roadmaps", id);
    await deleteDoc(roadmapDocRef);
    setCommunityRoadmaps((prev) => prev.filter((r) => r.id !== id));
  };

  const value = {
    roadmaps,
    addRoadmap,
    updateRoadmap, // Exported
    deleteRoadmap,
    rateRoadmap,
    loading,
  };

  return (
    <RoadmapContext.Provider value={value}>
      {children}
    </RoadmapContext.Provider>
  );
}