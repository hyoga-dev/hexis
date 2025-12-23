import { useState, createContext, useContext, useEffect, useCallback } from "react";
import { useAuth } from "./AuthProvider.jsx";
import useLocalStorage from "./useLocalStorage.jsx";
import { db } from "../firebase";
import {
    doc,
    collection,
    writeBatch,
    setDoc,
    deleteDoc,
    updateDoc,
    onSnapshot, // <--- IMPORT THIS
    runTransaction
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

    // --- EFFECT: Real-time Listeners ---
    useEffect(() => {
        let unsubscribeHabits;
        let unsubscribeUser;

        if (isGuest) {
            setHabit(localHabit);
            setUserStreak(localStreak);
            setHabitHistory(localHistory);
            setRoadmapProgress(localRoadmapProgress);
            setLoading(false);
        }
        else if (currentUser) {
            setLoading(true);

            // 1. Listen to User Profile (Streak, History, Progress)
            const userDocRef = doc(db, "users", currentUser.uid);
            unsubscribeUser = onSnapshot(userDocRef, (docSnap) => {
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setUserStreak(data.streak || { count: 0, lastActiveDate: null });
                    setHabitHistory(data.habitHistory || {});
                    setRoadmapProgress(data.roadmapProgress || {});
                } else {
                    // Create profile if it doesn't exist
                    setDoc(userDocRef, {
                        streak: { count: 0, lastActiveDate: null },
                        habitHistory: {},
                        roadmapProgress: {},
                        email: currentUser.email,
                        name: currentUser.displayName
                    }, { merge: true });
                }
            });

            // 2. Listen to Habits Collection (The List)
            const habitsCollectionRef = collection(db, "users", currentUser.uid, "habits");
            unsubscribeHabits = onSnapshot(habitsCollectionRef, (snapshot) => {
                const userHabits = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
                setHabit(userHabits);
                setLoading(false);
            }, (error) => {
                console.error("Error listening to habits:", error);
                setLoading(false);
            });
        } else {
            setHabit([]);
            setUserStreak({ count: 0, lastActiveDate: null });
            setHabitHistory({});
            setRoadmapProgress({});
            setLoading(false);
        }

        // Cleanup listeners when unmounting or switching users
        return () => {
            if (unsubscribeHabits) unsubscribeHabits();
            if (unsubscribeUser) unsubscribeUser();
        };
    }, [currentUser, isGuest]);
    // --- CRUD OPERATIONS (Simplified) ---
    // Note: We removed the manual 'setHabit' calls because the onSnapshot listener 
    // above will detect these changes instantly (even offline) and update the UI.

    const addHabit = async (newHabitData) => {
        if (isGuest) {
            const newHabit = { ...newHabitData, id: Date.now().toString() };
            const updated = [...habit, newHabit];
            setHabit(updated);
            setLocalHabit(updated);
            return;
        }

        if (!currentUser) return;
        const habitsCollectionRef = collection(db, "users", currentUser.uid, "habits");
        const newHabitRef = doc(habitsCollectionRef);
        const habitWithId = { ...newHabitData, id: newHabitRef.id };

        // Just write to DB. The listener handles the UI update.
        await setDoc(newHabitRef, newHabitData);
    };

    const updateHabit = async (habitId, updatedData) => {
        if (isGuest) {
            const updated = habit.map(h => h.id === habitId ? { ...updatedData, id: habitId } : h);
            setHabit(updated);
            setLocalHabit(updated);
            return;
        }

        if (!currentUser) return;
        const habitDocRef = doc(db, "users", currentUser.uid, "habits", habitId);
        const { id, ...dataToUpdate } = updatedData;

        await updateDoc(habitDocRef, dataToUpdate);
    };

    const deleteHabit = async (habitId) => {
        if (isGuest) {
            const updated = habit.filter(h => h.id !== habitId);
            setHabit(updated);
            setLocalHabit(updated);
            return;
        }

        if (!currentUser) return;
        const habitDocRef = doc(db, "users", currentUser.uid, "habits", habitId);
        await deleteDoc(habitDocRef);
    };

    const deleteHabits = async (habitIds) => {
        if (!habitIds || habitIds.length === 0) return;

        if (isGuest) {
            const updated = habit.filter(h => !habitIds.includes(h.id));
            setHabit(updated);
            setLocalHabit(updated);
            return;
        }

        if (!currentUser) return;

        const batch = writeBatch(db);
        habitIds.forEach(id => {
            const habitDocRef = doc(db, "users", currentUser.uid, "habits", id);
            batch.delete(habitDocRef);
        });

        await batch.commit();
    };

    const logActivity = useCallback(async (amount = 1) => {
        if (!currentUser && !isGuest) return;

        const today = new Date().toLocaleDateString("en-CA");

        // Helper to calculate streak logic (reused for Guest and Auth)
        const calculateNewState = (currentHistory, currentStreak) => {
            const newDailyTotal = Math.max(0, (currentHistory[today] || 0) + amount);
            const newHistory = { ...currentHistory, [today]: newDailyTotal };
            let newStreak = { ...currentStreak };

            if (newDailyTotal > 0) {
                if (currentStreak.lastActiveDate !== today) {
                    const yesterday = new Date();
                    yesterday.setDate(yesterday.getDate() - 1);
                    const yesterdayString = yesterday.toLocaleDateString("en-CA");

                    if (currentStreak.lastActiveDate === yesterdayString) {
                        newStreak = { count: currentStreak.count + 1, lastActiveDate: today };
                    } else {
                        newStreak = { count: 1, lastActiveDate: today };
                    }
                }
            } else if (newDailyTotal === 0 && currentStreak.lastActiveDate === today) {
                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
                const yesterdayString = yesterday.toLocaleDateString("en-CA");
                const newCount = Math.max(0, currentStreak.count - 1);
                newStreak = { count: newCount, lastActiveDate: newCount > 0 ? yesterdayString : null };
            }
            return { newHistory, newStreak };
        };

        if (isGuest) {
            const { newHistory, newStreak } = calculateNewState(habitHistory, userStreak);
            setHabitHistory(newHistory);
            setUserStreak(newStreak);
            setLocalHistory(newHistory);
            setLocalStreak(newStreak);
        } else if (currentUser) {
            const userDocRef = doc(db, "users", currentUser.uid);
            try {
                await runTransaction(db, async (transaction) => {
                    const sfDoc = await transaction.get(userDocRef);
                    if (!sfDoc.exists()) return;
                    const data = sfDoc.data();
                    const { newHistory, newStreak } = calculateNewState(
                        data.habitHistory || {},
                        data.streak || { count: 0, lastActiveDate: null }
                    );
                    transaction.update(userDocRef, { habitHistory: newHistory, streak: newStreak });
                });
            } catch (e) {
                console.error("Streak transaction failed: ", e);
            }
        }
    }, [currentUser, isGuest, habitHistory, userStreak]);

    const checkRoadmapCompletion = useCallback(async (roadmapId, currentDay) => {
        if ((!currentUser && !isGuest) || !roadmapId || !currentDay) return;

        const dayHabits = habit.filter(h => h.roadmapId === roadmapId && h.dayNumber === currentDay);
        if (dayHabits.length === 0) return;

        const allComplete = dayHabits.every(h => {
            const targetPerSlot = h.goals.target || 1;
            const currentTotal = h.goals.count || 0;
            const multiplier = (h.waktu && h.waktu.length > 0) ? h.waktu.length : 1;
            return currentTotal >= (targetPerSlot * multiplier);
        });

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

                if (isGuest) {
                    setRoadmapProgress(newProgress);
                    setLocalRoadmapProgress(newProgress);
                } else if (currentUser) {
                    const userDocRef = doc(db, "users", currentUser.uid);
                    updateDoc(userDocRef, { roadmapProgress: newProgress });
                }
            }
        }
    }, [currentUser, isGuest, habit, roadmapProgress]);

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
            setLocalHabit(finalHabits);
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
    };

    const addHabitsBatch = async (habitsToAdd) => {
        if (isGuest) {
            const newHabitsWithIds = habitsToAdd.map(h => ({ ...h, id: Date.now() + Math.random() }));
            const updated = [...habit, ...newHabitsWithIds];
            setHabit(updated);
            setLocalHabit(updated);
            return;
        }
        if (!currentUser || !habitsToAdd || habitsToAdd.length === 0) return;

        const batch = writeBatch(db);
        const habitsCollectionRef = collection(db, "users", currentUser.uid, "habits");

        habitsToAdd.forEach(habitData => {
            const newHabitRef = doc(habitsCollectionRef);
            const { id, ...dataToAdd } = { ...habitData, id: newHabitRef.id };
            batch.set(newHabitRef, dataToAdd);
        });

        await batch.commit();
    };

    const deleteHabitsByRoadmap = async (roadmapId) => {
        if (isGuest) {
            const updated = habit.filter(h => h.roadmapId !== roadmapId);
            setHabit(updated);
            setLocalHabit(updated);
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
    };

    const contextValue = {
        habit,
        addHabit,
        updateHabit,
        deleteHabit,
        deleteHabits,
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