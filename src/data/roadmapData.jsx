import { createContext, useContext, useMemo, useState, useEffect } from "react";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  setDoc,
  getDoc,
  onSnapshot // Use real-time listener
} from "firebase/firestore";
import { useAuth } from "./AuthProvider";

const RoadmapContext = createContext();

export const useRoadmapProvider = () => {
  return useContext(RoadmapContext);
};

// Default fallback categories
const DEFAULT_CATEGORIES = ["Productivity", "Health", "Fitness", "Learning"];

export function RoadmapProvider({ children }) {
  const { currentUser, isGuest } = useAuth();
  
  const [communityRoadmaps, setCommunityRoadmaps] = useState([]);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES); // <--- NEW STATE
  const [loading, setLoading] = useState(true);

  // 1. FETCH ROADMAPS & CATEGORIES
  useEffect(() => {
    setLoading(true);

    // A. Fetch Roadmaps (Keep existing logic)
    const roadmapsCollectionRef = collection(db, "roadmaps");
    const unsubscribeRoadmaps = onSnapshot(roadmapsCollectionRef, (snapshot) => {
       const allRoadmaps = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
       setCommunityRoadmaps(allRoadmaps);
    });

    // B. Fetch Categories (NEW)
    const categoryDocRef = doc(db, "settings", "categories");
    const unsubscribeCategories = onSnapshot(categoryDocRef, (docSnap) => {
        if (docSnap.exists()) {
            // Sort alphabetically for nice UI
            const list = docSnap.data().list || [];
            setCategories(list.sort());
        } else {
            // If doc doesn't exist yet, create it with defaults
            setDoc(categoryDocRef, { list: DEFAULT_CATEGORIES });
            setCategories(DEFAULT_CATEGORIES);
        }
        setLoading(false);
    });

    return () => {
        unsubscribeRoadmaps();
        unsubscribeCategories();
    };
  }, []);

  const roadmaps = useMemo(() => {
    return [...communityRoadmaps];
  }, [communityRoadmaps]);

  // --- EXISTING FUNCTIONS (addRoadmap, updateRoadmap, etc.) ---
  // (Keep your existing addRoadmap, updateRoadmap, deleteRoadmap, rateRoadmap code here...)
  
  const addRoadmap = async (newRoadmap, type = "community") => {
    if (!currentUser || isGuest) return alert("Login required");
    const roadmapWithMeta = {
      ...newRoadmap,
      type: type,
      rating: 0,
      ratings: {},
      date: new Date().toISOString(),
      authorId: currentUser.uid,
      author: currentUser.displayName || currentUser.email,
      authorPhotoURL: currentUser.photoURL || null,
    };
    const roadmapsCollectionRef = collection(db, "roadmaps");
    await addDoc(roadmapsCollectionRef, roadmapWithMeta);
  };

  const updateRoadmap = async (id, updatedData) => {
     if (!currentUser || isGuest) return;
     const roadmapDocRef = doc(db, "roadmaps", id);
     await updateDoc(roadmapDocRef, updatedData);
  };

  const deleteRoadmap = async (id) => {
     if (!currentUser || isGuest) return;
     const roadmapDocRef = doc(db, "roadmaps", id);
     await deleteDoc(roadmapDocRef);
  };

  const rateRoadmap = async (roadmapId, userId, score) => {
      // ... (keep existing rate logic)
      if (!currentUser || isGuest) return;
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
  };

  // --- NEW: ADD CATEGORY FUNCTION ---
  const addNewCategory = async (newCatName) => {
      if (!newCatName) return;
      // Capitalize first letter
      const formatted = newCatName.charAt(0).toUpperCase() + newCatName.slice(1);
      
      if (categories.includes(formatted)) return alert("Category already exists!");

      const newList = [...categories, formatted];
      const categoryDocRef = doc(db, "settings", "categories");
      
      await setDoc(categoryDocRef, { list: newList });
  };
  
  // --- NEW: DELETE CATEGORY FUNCTION (Optional) ---
  const deleteCategory = async (catName) => {
      if (!window.confirm(`Delete category "${catName}"?`)) return;
      const newList = categories.filter(c => c !== catName);
      const categoryDocRef = doc(db, "settings", "categories");
      await setDoc(categoryDocRef, { list: newList });
  };

  const value = {
    roadmaps,
    categories, // <--- Exported
    addNewCategory, // <--- Exported
    deleteCategory,
    addRoadmap,
    updateRoadmap,
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