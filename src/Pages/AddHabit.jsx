import { Link } from "react-router-dom";
import Styles from "../assets/Styles/addhabit.module.css";
import helpIcon from "../assets/Images/help.png";
import repeatIcon from "../assets/Images/repeat.png";
import goalIcon from "../assets/Images/goal.png";
import sunIcon from "../assets/Images/sun.png";
import flagIcon from "../assets/Images/flag.png";
import reminderIcon from "../assets/Images/reminder.png";
import slashIcon from "../assets/Images/slash.png";
import areasIcon from "../assets/Images/areas.png";
import checklistIcon from "../assets/Images/checklist.png";
import { useHabitProvider } from "../data/habitData";
import { useEffect, useState } from "react";

export default function AddHabit() {
  const { habit, setHabit } = useHabitProvider();
  
  // Memperbarui state agar sesuai dengan semua input
  const [dataHabit, setDataHabit] = useState({
    title: "",
    repeatType: "daily", // Untuk select pertama Repeat
    daySet: "everyday",  // Untuk select kedua Repeat
    goals: { 
      count: 1, 
      satuan: "times", // Unit: times/minutes
      ulangi: "per_day"  // Period: per day/per week
    },
    waktu: ["Morning", "Afternoon", "Evening"], // Array untuk menampung checkbox Time of Day
    waktuMulai: "",      // Start Date
    pengingat: "09:00",  // Reminder Time
    kondisihabis: "Never", // End Condition
    area: "",            // Area input
    checkList: "",       // Checklist input
    isGrouped: true,
  });

  useEffect(() => {
    console.log(dataHabit);
  }, [dataHabit]);

  const handleCheckbox = (e) => {
    const { value, checked } = e.target;
    let updatedWaktu = [...dataHabit.waktu];

    if (checked) {
      updatedWaktu.push(value);
    } else {
      updatedWaktu = updatedWaktu.filter((item) => item !== value);
    }

    setDataHabit({ ...dataHabit, waktu: updatedWaktu });
  };
  
  const handleSave = () => {
    // Implementasi simpan data
    console.log("Saving Habit:", dataHabit);
    setHabit([...habit, dataHabit]);
  };

  return (
    <div className={Styles.container}>

      {/* 1. Top Tabs */}
      <div className={Styles.header}>
        <h2>Add Habit</h2>
      </div>

      {/* 2. Main Name Input */}
      <div className={Styles.headerInput}>
        <img src={helpIcon} alt="help" />
        <input 
          type="text" 
          placeholder="Enter Habit Name" 
          value={dataHabit.title}
          onChange={(e) => setDataHabit({ ...dataHabit, title: e.target.value })}
        />

      </div>

      {/* 3. Form Body */}
      <div className={Styles.formBody}>

        {/* Row: Repeat */}
        <div className={Styles.row}>
          <div className={Styles.labelCol}>
            <img src={repeatIcon} alt="repeat" />
            <span>Repeat</span>
          </div>
          <div className={Styles.inputCol}>
            {/* Select Tipe Ulangi */}
            <select 
              name="repeatType" 
              value={dataHabit.repeatType} 
              onChange={(e) => setDataHabit({ ...dataHabit, repeatType: e.target.value })}
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
            {/* Select Hari Spesifik */}
            <select 
              name="daySet"
              value={dataHabit.daySet}
              onChange={(e) => setDataHabit({ ...dataHabit, daySet: e.target.value })}
            >
              <option value="everyday">Every Day</option>
              <option value="weekdays">Weekdays</option>
              <option value="weekends">Weekends</option>
            </select>
          </div>
        </div>

        {/* Row: Goal */}
        <div className={Styles.row}>
          <div className={Styles.labelCol}>
            <img src={goalIcon} alt="goal" />
            <span>Goal</span>
          </div>
          <div className={Styles.inputCol}>
            {/* Input Count */}
            <input 
              type="number" 
              value={dataHabit.goals.count} 
              onChange={(e) => setDataHabit({ ...dataHabit, goals: { ...dataHabit.goals, count: parseInt(e.target.value) || 0 } })}
              className={Styles.goalNumber} 
            />
            {/* Select Satuan (Unit) */}
            <select 
              name="satuan"
              value={dataHabit.goals.satuan}
              onChange={(e) => setDataHabit({ ...dataHabit, goals: { ...dataHabit.goals, satuan: e.target.value } })}
            >
              <option value="times">times</option>
              <option value="minutes">mins</option>
            </select>
            {/* Select Periode (Period) */}
            <select 
              name="period"
              value={dataHabit.goals.ulangi}
              onChange={(e) => setDataHabit({ ...dataHabit, goals: { ...dataHabit.goals, ulangi: e.target.value } })}
            >
              <option value="per_day">per day</option>
              <option value="per_week">per week</option>
            </select>
          </div>
        </div>

        {/* Row: Time of Day (Checkboxes) */}
        <div className={Styles.row}>
          <div className={Styles.labelCol}>
            <img src={sunIcon} alt="time" />
            <span>Time of Day</span>
          </div>
          <div className={Styles.inputCol}>
            <div className={Styles.checkboxGroup}>
              <label className={Styles.checkboxItem}>
                <input 
                  type="checkbox" 
                  value="Morning"
                  checked={dataHabit.waktu.includes("Morning")}
                  onChange={handleCheckbox}
                /> Morning
              </label>
              <label className={Styles.checkboxItem}>
                <input 
                  type="checkbox" 
                  value="Afternoon"
                  checked={dataHabit.waktu.includes("Afternoon")}
                  onChange={handleCheckbox}
                /> Afternoon
              </label>
              <label className={Styles.checkboxItem}>
                <input 
                  type="checkbox" 
                  value="Evening"
                  checked={dataHabit.waktu.includes("Evening")}
                  onChange={handleCheckbox}
                /> Evening
              </label>
            </div>
          </div>
        </div>

        {/* Row: Start Date */}
        <div className={Styles.row}>
          <div className={Styles.labelCol}>
            <img src={flagIcon} alt="start" />
            <span>Start Date</span>
          </div>
          <div className={Styles.inputCol}>
            <input 
              type="date" 
              className={Styles.fullWidthInput} 
              value={dataHabit.waktuMulai}
              onChange={(e) => setDataHabit({ ...dataHabit, waktuMulai: e.target.value })}
            />
          </div>
        </div>

        {/* Row: End Condition */}
        <div className={Styles.row}>
          <div className={Styles.labelCol}>
            <img src={slashIcon} alt="end" />
            <span>End Condition</span>
          </div>
          <div className={Styles.inputCol}>
            <select 
              className={Styles.fullWidthInput}
              value={dataHabit.kondisihabis}
              onChange={(e) => setDataHabit({ ...dataHabit, kondisihabis: e.target.value })}
            >
              <option value="Never">Never</option>
              <option value="On Date">On Date</option>
              <option value="After X days">After X days</option>
            </select>
          </div>
        </div>

        {/* Row: Reminders */}
        <div className={Styles.row}>
          <div className={Styles.labelCol}>
            <img src={reminderIcon} alt="reminder" />
            <span>Reminders</span>
          </div>
          <div className={Styles.inputCol}>
            <input 
              type="time" 
              className={Styles.fullWidthInput} 
              value={dataHabit.pengingat}
              onChange={(e) => setDataHabit({ ...dataHabit, pengingat: e.target.value })}
            />
          </div>
        </div>

        {/* Row: Area */}
        <div className={Styles.row}>
          <div className={Styles.labelCol}>
            <img src={areasIcon} alt="area" />
            <span>Area</span>
          </div>
          <div className={Styles.inputCol}>
            <input 
              type="text" 
              placeholder="Select areas" 
              className={Styles.fullWidthInput}
              value={dataHabit.area}
              onChange={(e) => setDataHabit({ ...dataHabit, area: e.target.value })}
            />
          </div>
        </div>

        {/* Row: Checklist */}
        <div className={Styles.row} style={{ borderBottom: 'none' }}>
          <div className={Styles.labelCol}>
            <img src={checklistIcon} alt="checklist" />
            <span>Checklist</span>
          </div>
          <div className={Styles.inputCol}>
            <input 
              type="text" 
              placeholder="Add New Checklist" 
              className={Styles.fullWidthInput}
              value={dataHabit.checkList}
              onChange={(e) => setDataHabit({ ...dataHabit, checkList: e.target.value })}
            />
          </div>
        </div>

      </div>

      {/* 4. Footer Buttons */}
      <div className={Styles.footer}>
        <Link to="/habit">
          <button className={Styles.btnCancel}>Cancel</button>
        </Link>
        <button className={Styles.btnSave} onClick={handleSave}>Save</button>
      </div>

    </div>
  );
}