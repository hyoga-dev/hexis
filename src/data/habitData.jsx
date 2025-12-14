import { useState, createContext, useContext, useEffect, useCallback } from "react";
import { useAuth } from "./AuthProvider.jsx";
import useLocalStorage from "./useLocalStorage.jsx";
import { db } from "../firebase";
import {
    doc,
    collection,
    getDocs,
    writeBatch,
    getDoc,
    setDoc,
    deleteDoc,
    updateDoc,
} from "firebase/firestore";

const habitContext = createContext();

export const useHabitProvider = () => {
    return useContext(habitContext);
};

// --- INITIAL DATA ---
const initialHabits = [];

export function HabitProvider({ children }) {
    const { currentUser, isGuest } = useAuth();

    // --- STATE MANAGEMENT ---
    const [habit, setHabit] = useState([]);
    const [userStreak, setUserStreak] = useState({ count: 0, lastActiveDate: null });
    const [habitHistory, setHabitHistory] = useState({});
    const [roadmapProgress, setRoadmapProgress] = useState({});
    const [loading, setLoading] = useState(true);

    // --- LOCAL STORAGE HOOKS (for guest mode) ---
    const [localHabit, setLocalHabit] = useLocalStorage("guest_habits", initialHabits);
    const [localStreak, setLocalStreak] = useLocalStorage("guest_streak", { count: 0, lastActiveDate: null });
    const [localHistory, setLocalHistory] = useLocalStorage("guest_history", {});
    const [localRoadmapProgress, setLocalRoadmapProgress] = useLocalStorage("guest_roadmap_progress", {});

    // --- EFFECT: Fetch data ---
    useEffect(() => {
        if (isGuest) {
            setHabit(localHabit);
            setUserStreak(localStreak);
            setHabitHistory(localHistory);
            setRoadmapProgress(localRoadmapProgress);
            setLoading(false);
        }
        else if (currentUser) {
            setLoading(true);
            const fetchData = async () => {
                try {
                    const userDocRef = doc(db, "users", currentUser.uid);
                    const userDocSnap = await getDoc(userDocRef);

                    if (userDocSnap.exists()) {
                        const userData = userDocSnap.data();
                        setUserStreak(userData.streak || { count: 0, lastActiveDate: null });
                        setHabitHistory(userData.habitHistory || {});
                        setRoadmapProgress(userData.roadmapProgress || {});
                    } else {
                        await setDoc(userDocRef, {
                            streak: { count: 0, lastActiveDate: null },
                            habitHistory: {},
                            roadmapProgress: {},
                            email: currentUser.email,
                            name: currentUser.displayName
                        });
                    }

                    const habitsCollectionRef = collection(db, "users", currentUser.uid, "habits");
                    const habitsSnapshot = await getDocs(habitsCollectionRef);
                    const userHabits = habitsSnapshot.docs.map(d => ({ id: d.id, ...d.data() }));
                    setHabit(userHabits);

                } catch (error) {
                    console.error("Error fetching user data:", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchData();
        } else {
            setHabit([]);
            setUserStreak({ count: 0, lastActiveDate: null });
            setHabitHistory({});
            setRoadmapProgress({});
            setLoading(false);
        }
    }, [currentUser, isGuest]); // Added isGuest to dependency

    // --- CRUD OPERATIONS (UPDATED FOR GUEST) ---
    const addHabit = async (newHabitData) => {
        // 1. Guest Logic
        if (isGuest) {
            const newHabit = { ...newHabitData, id: Date.now().toString() };
            const updatedHabits = [...habit, newHabit];
            setHabit(updatedHabits);
            setLocalHabit(updatedHabits); // Persist to Local Storage
            return;
        }

        // 2. User Logic
        if (!currentUser) return;
        const habitsCollectionRef = collection(db, "users", currentUser.uid, "habits");
        const newHabitRef = doc(habitsCollectionRef);
        const habitWithId = { ...newHabitData, id: newHabitRef.id };

        await setDoc(newHabitRef, newHabitData);
        setHabit(prev => [...prev, habitWithId]);
    };

    const updateHabit = async (habitId, updatedData) => {
        // 1. Guest Logic
        if (isGuest) {
            const updatedHabits = habit.map(h => h.id === habitId ? { ...updatedData, id: habitId } : h);
            setHabit(updatedHabits);
            setLocalHabit(updatedHabits); // Persist
            return;
        }

        // 2. User Logic
        if (!currentUser) return;
        const habitDocRef = doc(db, "users", currentUser.uid, "habits", habitId);
        const { id, ...dataToUpdate } = updatedData;

        await updateDoc(habitDocRef, dataToUpdate);
        setHabit(prev => prev.map(h => h.id === habitId ? updatedData : h));
    };

    const deleteHabit = async (habitId) => {
        // 1. Guest Logic
        if (isGuest) {
            const updatedHabits = habit.filter(h => h.id !== habitId);
            setHabit(updatedHabits);
            setLocalHabit(updatedHabits); // Persist
            return;
        }

        // 2. User Logic
        if (!currentUser) return;
        const habitDocRef = doc(db, "users", currentUser.uid, "habits", habitId);
        await deleteDoc(habitDocRef);
        setHabit(prev => prev.filter(h => h.id !== habitId));
    };

    // --- ACTIVITY LOGGING & STREAK ---
    const logActivity = useCallback(async (amount = 1) => {
        if (!currentUser && !isGuest) return;

        const today = new Date().toLocaleDateString("en-CA");
        const newDailyTotal = Math.max(0, (habitHistory[today] || 0) + amount);
        const newHistory = { ...habitHistory, [today]: newDailyTotal };

        // Update State
        setHabitHistory(newHistory);

        // Calculate Streak
        let newStreak = { ...userStreak };
        if (newDailyTotal > 0) {
            if (userStreak.lastActiveDate !== today) {
                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
                const yesterdayString = yesterday.toLocaleDateString("en-CA");

                if (userStreak.lastActiveDate === yesterdayString) {
                    newStreak = { count: userStreak.count + 1, lastActiveDate: today };
                } else {
                    newStreak = { count: 1, lastActiveDate: today };
                }
            }
        } else if (newDailyTotal === 0 && userStreak.lastActiveDate === today) {
            // Handle decrementing to 0 on the same day
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayString = yesterday.toLocaleDateString("en-CA");
            const newCount = Math.max(0, userStreak.count - 1);
            newStreak = { count: newCount, lastActiveDate: newCount > 0 ? yesterdayString : null };
        }

        setUserStreak(newStreak);

        // Persist Data
        if (isGuest) {
            setLocalHistory(newHistory);
            setLocalStreak(newStreak);
        } else if (currentUser) {
            const userDocRef = doc(db, "users", currentUser.uid);
            await updateDoc(userDocRef, {
                habitHistory: newHistory,
                streak: newStreak
            });
        }
    }, [currentUser, isGuest, habitHistory, userStreak, setLocalHistory, setLocalStreak]);

    // --- ROADMAP COMPLETION CHECK ---
    const checkRoadmapCompletion = useCallback(async (roadmapId, currentDay) => {
        if ((!currentUser && !isGuest) || !roadmapId || !currentDay) return;

        const dayHabits = habit.filter(h => h.roadmapId === roadmapId && h.dayNumber === currentDay);
        if (dayHabits.length === 0) return;

        const allComplete = dayHabits.every(h => (h.goals.count || 0) >= (h.goals.target || 1));

        if (allComplete) {
            const currentProgress = roadmapProgress[roadmapId] || 0;
            if (currentDay > currentProgress) {
                const allRoadmapHabits = habit.filter(h => h.roadmapId === roadmapId);
                const maxDay = Math.max(...allRoadmapHabits.map(h => h.dayNumber || 1));

                let newProgressValue;
                if (currentDay >= maxDay) {
                    alert("🎉 Roadmap Completed! Resetting to Day 1.");
                    newProgressValue = 0;
                } else {
                    newProgressValue = currentDay;
                }

                const newProgress = { ...roadmapProgress, [roadmapId]: newProgressValue };
                setRoadmapProgress(newProgress);

                if (isGuest) {
                    setLocalRoadmapProgress(newProgress);
                } else if (currentUser) {
                    const userDocRef = doc(db, "users", currentUser.uid);
                    await updateDoc(userDocRef, { roadmapProgress: newProgress });
                }
            }
        }
    }, [currentUser, isGuest, habit, roadmapProgress, setLocalRoadmapProgress]);

    // --- SMART UPDATE FOR PERSONAL ROADMAPS ---
    const updatePersonalRoadmap = async (roadmapId, newHabitTemplates, metaData) => {
        if (isGuest) {
            const otherHabits = habit.filter(h => String(h.roadmapId) !== String(roadmapId));
            const newHabits = newHabitTemplates.map(template => ({
                ...template,
                id: Date.now() + Math.random(),
                roadmapId: roadmapId,
                roadmapTitle: metaData.title,
                area: metaData.category,
                goals: { ...template.goals, count: 0 },
                completion: {}
            }));
            const finalHabits = [...otherHabits, ...newHabits];
            setHabit(finalHabits);
            setLocalHabit(finalHabits); // Fixed persistence
            return;
        }
        if (!currentUser) return;

        const batch = writeBatch(db);
        const habitsCollectionRef = collection(db, "users", currentUser.uid, "habits");

        const existingHabits = habit.filter(h => String(h.roadmapId) === String(roadmapId));
        const existingHabitsMap = new Map(existingHabits.map(h => [`${h.dayNumber}-${h.title}`, h]));
        const newHabitsMap = new Map(newHabitTemplates.map(t => [`${t.dayNumber}-${t.title}`, t]));

        for (const existing of existingHabits) {
            if (!newHabitsMap.has(`${existing.dayNumber}-${existing.title}`)) {
                const habitDocRef = doc(habitsCollectionRef, existing.id);
                batch.delete(habitDocRef);
            }
        }

        for (const template of newHabitTemplates) {
            const key = `${template.dayNumber}-${template.title}`;
            const match = existingHabitsMap.get(key);

            if (match) {
                const habitDocRef = doc(habitsCollectionRef, match.id);
                const { id, ...dataToUpdate } = {
                    ...template,
                    goals: { ...template.goals, count: match.goals.count },
                    completion: match.completion || {},
                    roadmapTitle: metaData.title,
                    area: metaData.category
                };
                batch.update(habitDocRef, dataToUpdate);
            } else {
                const newHabitRef = doc(habitsCollectionRef);
                const { id, ...dataToAdd } = {
                    ...template,
                    id: newHabitRef.id,
                    roadmapId: roadmapId,
                    roadmapTitle: metaData.title,
                    area: metaData.category,
                    goals: { ...template.goals, count: 0 },
                    completion: {}
                };
                batch.set(newHabitRef, dataToAdd);
            }
        }

        await batch.commit();

        const habitsSnapshot = await getDocs(habitsCollectionRef);
        const allUserHabits = habitsSnapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        const otherHabits = habit.filter(h => String(h.roadmapId) !== String(roadmapId));
        setHabit([...otherHabits, ...allUserHabits.filter(h => String(h.roadmapId) === String(roadmapId))]);
    };

    const addHabitsBatch = async (habitsToAdd) => {
        if (isGuest) {
            const newHabitsWithIds = habitsToAdd.map(h => ({ ...h, id: Date.now() + Math.random() }));
            const updated = [...habit, ...newHabitsWithIds];
            setHabit(updated);
            setLocalHabit(updated); // Fixed persistence
            return;
        }
        if (!currentUser || !habitsToAdd || habitsToAdd.length === 0) return;

        const batch = writeBatch(db);
        const habitsCollectionRef = collection(db, "users", currentUser.uid, "habits");
        const newHabitsWithIds = [];

        habitsToAdd.forEach(habitData => {
            const newHabitRef = doc(habitsCollectionRef);
            const { id, ...dataToAdd } = { ...habitData, id: newHabitRef.id };
            batch.set(newHabitRef, dataToAdd);
            newHabitsWithIds.push({ ...habitData, id: newHabitRef.id });
        });

        await batch.commit();
        setHabit(prev => [...prev, ...newHabitsWithIds]);
    };

    const deleteHabitsByRoadmap = async (roadmapId) => {
        if (isGuest) {
            const updated = habit.filter(h => h.roadmapId !== roadmapId);
            setHabit(updated);
            setLocalHabit(updated); // Fixed persistence
            return;
        }
        if (!currentUser) return;

        const habitsToDelete = habit.filter(h => h.roadmapId === roadmapId);
        if (habitsToDelete.length === 0) return;

        const batch = writeBatch(db);
        const habitsCollectionRef = collection(db, "users", currentUser.uid, "habits");
        habitsToDelete.forEach(h => {
            const habitDocRef = doc(habitsCollectionRef, h.id);
            batch.delete(habitDocRef);
        });

        await batch.commit();
        setHabit(prev => prev.filter(h => h.roadmapId !== roadmapId));
    };

    const contextValue = {
        habit,
        addHabit,
        updateHabit,
        deleteHabit,
        addHabitsBatch,
        deleteHabitsByRoadmap,
        userStreak,
        habitHistory,
        logActivity,
        roadmapProgress,
        checkRoadmapCompletion,
        updatePersonalRoadmap,
        loading
    };

    return (
        <habitContext.Provider value={contextValue}>
            {children}
        </habitContext.Provider>
    );
}