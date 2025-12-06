import { Link } from "react-router-dom";
import Styles from "../assets/Styles/addhabit.module.css";
// import Back from "./Components/Back"; // Optional based on image
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
  const [dataHabit, setDataHabit] = useState({
    title: "",
    daySet: [],
    goals: { count: 0, satuan: "", ulangi: "" },
    waktu: "",
    waktuMulai: "",
    pengingat: "",
    kondisihabis: "",
    checkList: "",
    isGrouped: true,
  });

  useEffect(() => {
    console.log(dataHabit);
  }, [dataHabit]);
  return (
    <div className={Styles.container}>

      {/* 1. Top Tabs */}
      <div className={Styles.header}>
        <h2>Add Habit</h2>
      </div>

      {/* 2. Main Name Input */}
      <div className={Styles.headerInput}>
        <img src={helpIcon} alt="help" />
        <input type="text" placeholder="Enter Habit Name" />

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
            <select name="ulangi" value={dataHabit.goals.ulangi} onChange={(e) => setDataHabit({ ...dataHabit, goals: { ...dataHabit.goals, ulangi: e.target.value } })}>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
            <select name="repeatDay">
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
            <input type="number" defaultValue="1" className={Styles.goalNumber} />
            <select name="unit">
              <option value="times">times</option>
              <option value="minutes">mins</option>
            </select>
            <select name="period">
              <option value="per_day">per day</option>
              <option value="per_week">per week</option>
            </select>
          </div>
        </div>

        {/* Row: Time of Day */}
        <div className={Styles.row}>
          <div className={Styles.labelCol}>
            <img src={sunIcon} alt="time" />
            <span>Time of Day</span>
          </div>
          <div className={Styles.inputCol}>
            <div className={Styles.checkboxGroup}>
              <label className={Styles.checkboxItem}>
                <input type="checkbox" defaultChecked /> Morning
              </label>
              <label className={Styles.checkboxItem}>
                <input type="checkbox" defaultChecked /> Afternoon
              </label>
              <label className={Styles.checkboxItem}>
                <input type="checkbox" defaultChecked /> Evening
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
            <input type="date" className={Styles.fullWidthInput} />
          </div>
        </div>

        {/* Row: End Condition */}
        <div className={Styles.row}>
          <div className={Styles.labelCol}>
            <img src={slashIcon} alt="end" />
            <span>End Condition</span>
          </div>
          <div className={Styles.inputCol}>
            <select className={Styles.fullWidthInput}>
              <option>Never</option>
              <option>On Date</option>
              <option>After X days</option>
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
            {/* Simulating the placeholder look from image */}
            <input type="time" className={Styles.fullWidthInput} defaultValue="09:00" />
          </div>
        </div>

        {/* Row: Area */}
        <div className={Styles.row}>
          <div className={Styles.labelCol}>
            <img src={areasIcon} alt="area" />
            <span>Area</span>
          </div>
          <div className={Styles.inputCol}>
            <input type="text" placeholder="Select areas" className={Styles.fullWidthInput} />
          </div>
        </div>

        {/* Row: Checklist */}
        <div className={Styles.row} style={{ borderBottom: 'none' }}>
          <div className={Styles.labelCol}>
            <img src={checklistIcon} alt="checklist" />
            <span>Checklist</span>
          </div>
          <div className={Styles.inputCol}>
            <input type="text" placeholder="Add New Checklist" className={Styles.fullWidthInput} />
          </div>
        </div>

      </div>

      {/* 4. Footer Buttons */}
      <div className={Styles.footer}>
        <Link to="/habit">
          <button className={Styles.btnCancel}>Cancel</button>
        </Link>
        <button className={Styles.btnSave}>Save</button>
      </div>

    </div>
  );
}