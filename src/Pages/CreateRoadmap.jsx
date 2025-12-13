import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Styles from "../assets/Styles/createRoadmap.module.css";
import AddHabitStyles from "../assets/Styles/addhabit.module.css"; 
import { useHabitProvider } from "../data/habitData";
import { useRoadmapProvider } from "../data/roadmapData"; 
import { useAuth } from "../data/AuthProvider"; 
import AddHabit from "./AddHabit"; 

//Icon 
import DeleteIcon from "../assets/Icon/DeleteIcon";
import CopyIcon from "../assets/Icon/CopyIcon";

export default function CreateRoadmap() {
  const navigate = useNavigate();
  const { habit } = useHabitProvider(); 
  const { addRoadmap } = useRoadmapProvider(); 
  const { currentUser } = useAuth(); 

  // --- STATE ---
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Productivity",
    privacy: "public",
  });

  const [days, setDays] = useState([
    { id: 1, dayNumber: 1, description: "", habits: [] }
  ]);

  const [activeDayIndex, setActiveDayIndex] = useState(0);
  
  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  
  const [habitToEdit, setHabitToEdit] = useState(null); 
  const [editingIndex, setEditingIndex] = useState(null); 

  // --- HANDLERS (Timeline) ---
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addDay = () => {
    const newDayNum = days.length + 1;
    setDays([...days, { id: Date.now(), dayNumber: newDayNum, description: "", habits: [] }]);
    setActiveDayIndex(days.length);
  };

  const deleteDay = (e, indexToDelete) => {
    e.stopPropagation();
    if (days.length === 1) return alert("You need at least one day.");
    if (window.confirm(`Delete Day ${days[indexToDelete].dayNumber}?`)) {
        const remainingDays = days.filter((_, i) => i !== indexToDelete);
        const renumberedDays = remainingDays.map((day, i) => ({ ...day, dayNumber: i + 1 }));
        setDays(renumberedDays);
        if (activeDayIndex >= renumberedDays.length) setActiveDayIndex(renumberedDays.length - 1);
    }
  };

  const handleDayDescChange = (index, val) => {
    const updatedDays = [...days];
    updatedDays[index].description = val;
    setDays(updatedDays);
  };

  // --- HANDLERS (Habits) ---
  const openCreateModal = () => {
    setHabitToEdit(null); 
    setEditingIndex(null);
    setIsModalOpen(true);
  };

  const openEditModal = (habitData, index) => {
    setHabitToEdit(habitData);
    setEditingIndex(index);
    setIsModalOpen(true);
  };

  const duplicateHabit = (e, habitData) => {
    e.stopPropagation();
    const updatedDays = [...days];
    updatedDays[activeDayIndex].habits.push({
        ...habitData,
        id: Date.now() 
    });
    setDays(updatedDays);
  };

  const importHabit = (habitTemplate) => {
    const updatedDays = [...days];
    updatedDays[activeDayIndex].habits.push({
        ...habitTemplate,
        id: Date.now()
    });
    setDays(updatedDays);
    setIsImportModalOpen(false);
  };

  const handleSaveHabit = (data) => {
    const updatedDays = [...days];
    const targetDay = updatedDays[activeDayIndex];

    if (editingIndex !== null) {
        targetDay.habits[editingIndex] = { ...data, id: targetDay.habits[editingIndex].id };
    } else {
        targetDay.habits.push({ ...data, id: Date.now() });
    }

    setDays(updatedDays);
    setIsModalOpen(false);
  };

  const removeHabit = (index, e) => {
    e.stopPropagation();
    const updatedDays = [...days];
    updatedDays[activeDayIndex].habits.splice(index, 1);
    setDays(updatedDays);
  };

  // --- SAVE HANDLER ---
  const handleSaveRoadmap = () => {
    if (!formData.title) return alert("Please enter a Roadmap Title");
    
    // Transform 'days' into the structure Roadmap.jsx expects
    const cleanedDays = days.map(d => ({
        dayNumber: d.dayNumber,
        focus: d.description || `Day ${d.dayNumber}`,
        habits: d.habits.map(h => ({
            title: h.title,
            target: h.goals?.target || h.target || 1,
            unit: h.goals?.satuan || h.unit || "times",
            time: h.waktu || h.time || ["Morning"]
        }))
    }));

    const finalRoadmap = {
        ...formData,
        author: currentUser?.displayName || "Anonymous", 
        days: cleanedDays,
    };

    addRoadmap(finalRoadmap); 
    navigate("/roadmap");
  };

  const availableHabits = useMemo(() => {
    const map = new Map();
    habit.forEach(h => { if (!h.roadmapId) map.set(h.title, h); });
    days.forEach(day => {
        day.habits.forEach(h => { map.set(h.title, h); });
    });
    return Array.from(map.values());
  }, [days, habit]);

  const activeDay = days[activeDayIndex];

  return (
    <div className={Styles.pageWrapper}>
      
      {/* --- LEFT PANEL --- */}
      <div className={Styles.leftPanel}>
        <div className={Styles.leftContent}>
            
            <input 
                name="title" 
                className={Styles.headerInput} 
                placeholder="Roadmap Title"
                value={formData.title}
                onChange={handleInputChange}
            />

            <div style={{ display: 'flex', gap: '10px', marginTop: '10px', marginBottom: '5px' }}>
                <label className={Styles.formLabel} style={{ flex: 1 }}>Category</label>
                <label className={Styles.formLabel} style={{ flex: 1 }}>Privacy</label>
            </div>

            <div className={Styles.selectGroup}>
                <select name="category" className={Styles.selectInput} value={formData.category} onChange={handleInputChange}>
                    <option value="Productivity">Productivity</option>
                    <option value="Health">Health</option>
                    <option value="Fitness">Fitness</option>
                    <option value="Learning">Learning</option>
                </select>
                <select name="privacy" className={Styles.selectInput} value={formData.privacy} onChange={handleInputChange}>
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                </select>
            </div>

            <label className={Styles.formLabel} style={{ display: 'block', marginTop: '15px', marginBottom: '5px' }}>Description</label>
            <textarea 
                name="description" 
                className={Styles.dayDescInput} 
                style={{ minHeight: '80px', fontSize: '0.9rem' }} 
                placeholder="What is the goal of this roadmap?"
                value={formData.description}
                onChange={handleInputChange}
            />

            <hr style={{borderColor: 'var(--border-color)', opacity: 0.5, margin: '20px 0'}}/>
            
            <div className={Styles.dayList}>
                {days.map((day, index) => (
                    <div 
                        key={day.id} 
                        className={`${Styles.dayItem} ${activeDayIndex === index ? Styles.active : ''}`}
                        onClick={() => setActiveDayIndex(index)}
                    >
                        <div className={Styles.dayInfo}>
                            <span className={Styles.dayTitle}>Day {day.dayNumber}</span>
                            <span className={Styles.dayCount}>{day.habits.length} habits</span>
                        </div>
                        <button className={Styles.deleteDayBtn} onClick={(e) => deleteDay(e, index)}><DeleteIcon color="var(--font-color)" /></button>
                    </div>
                ))}
                <button className={Styles.addDayBtn} onClick={addDay}>+ Add Day</button>
            </div>
        </div>
        
        <div className={Styles.footer}>
            <button className={Styles.cancelBtn} onClick={() => navigate("/roadmap")}>Cancel</button>
            <button className={Styles.saveBtn} onClick={handleSaveRoadmap}>Save</button>
        </div>
      </div>

      {/* --- RIGHT PANEL --- */}
      <div className={Styles.rightPanel}>
         <div className={Styles.editorHeader}>
            <h2 className={Styles.dayHeading}>Day {activeDay.dayNumber} Content</h2>
            <textarea 
                className={Styles.dayDescInput}
                placeholder={`Focus for Day ${activeDay.dayNumber}...`}
                value={activeDay.description}
                onChange={(e) => handleDayDescChange(activeDayIndex, e.target.value)}
            />
         </div>

         <div className={Styles.habitList}>
            {activeDay.habits.map((h, i) => (
                <div 
                    key={h.id || i} 
                    className={Styles.habitCard}
                    onClick={() => openEditModal(h, i)} 
                    style={{cursor: 'pointer'}}
                >
                    <div className={Styles.habitInfo}>
                        <h4>{h.title}</h4>
                        <p>{h.goals?.target || h.target} {h.goals?.satuan || h.unit} • {Array.isArray(h.waktu) ? h.waktu.join(", ") : (h.time || "")}</p>
                    </div>
                    
                    <div className={Styles.habitActions}>
                        <button 
                            className={Styles.iconBtn} 
                            onClick={(e) => duplicateHabit(e, h)}
                            title="Duplicate"
                        >
                            📋
                        </button>
                        <button 
                            className={`${Styles.iconBtn} ${Styles.deleteBtn}`} 
                            onClick={(e) => removeHabit(i, e)}
                            title="Remove"
                        >
                            ×
                        </button>
                    </div>
                </div>
            ))}
            
            <div className={Styles.addActions}>
                <div className={Styles.addHabitCard} onClick={openCreateModal}>
                    <span style={{fontSize: '1.5rem'}}>+</span>
                    <p>Create New</p>
                </div>
                
                <div className={Styles.copyHabitCard} onClick={() => setIsImportModalOpen(true)}>
                    <span style={{fontSize: '1.5rem'}}><CopyIcon color="var(--font-color)" /></span>
                    <p>Copy Existing</p>
                </div>
            </div>
         </div>
      </div>

      {/* --- ADD/EDIT MODAL --- */}
      {isModalOpen && (
        <div className={Styles.modalOverlay} style={{zIndex: 200}}>
           <div style={{width: '500px', maxHeight: '90vh', overflowY: 'auto', background: 'var(--surface-color)', borderRadius: '8px', boxShadow: '0 10px 40px rgba(0,0,0,0.3)'}}>
              <AddHabit 
                 onSave={handleSaveHabit} 
                 onCancel={() => setIsModalOpen(false)} 
                 habitToEdit={habitToEdit}
                 isTemplate={true} // <--- PASS TRUE TO HIDE REPEAT/START/END
              />
           </div>
        </div>
      )}

      {/* --- IMPORT MODAL --- */}
      {isImportModalOpen && (
        <div className={Styles.modalOverlay} style={{zIndex: 200}}>
            <div className={AddHabitStyles.container} style={{ margin: 0, height: 'auto', maxHeight: '70vh', width: '400px', overflowY: 'auto' }}>
                <div className={AddHabitStyles.header} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2>Select Habit to Copy</h2>
                    <button onClick={() => setIsImportModalOpen(false)} style={{background:'none', border:'none', fontSize:'1.5rem', cursor:'pointer'}}>×</button>
                </div>
                
                <div style={{padding: '20px'}}>
                    {availableHabits.length > 0 ? (
                        <div className={Styles.importList}>
                            {availableHabits.map((h, i) => (
                                <div key={i} className={Styles.importItem} onClick={() => importHabit(h)}>
                                    <span>{h.title}</span>
                                    <span style={{fontSize:'0.8rem', color:'gray'}}>
                                        {h.goals?.target || h.target || 1} {h.goals?.satuan || h.unit || 'times'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p style={{textAlign:'center', color:'gray'}}>No habits found in library.</p>
                    )}
                </div>
            </div>
        </div>
      )}

    </div>
  );
}