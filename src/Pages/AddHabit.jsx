import { Link } from "react-router-dom";
import Styles from "../assets/Styles/addhabit.module.css";
import Back from "./Components/Back";
import helpIcon from "../assets/Images/help.png";
import mapsIcon from "../assets/Images/maps.png";
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
    repeatType: "daily", 
    daySet: "day",       
    goals: { 
      count: 0, 
      satuan: "daily",   
      ulangi: "Per-day"  
    },
    waktu: [],           
    waktuMulai: "",      
    pengingat: "",       
    kondisihabis: "daily", 
    area: "",            
    checkList: "",       
    isGrouped: true,
  });

  useEffect(() => {
    console.log("Current Data:", dataHabit);
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
    console.log("Saving Habit:", dataHabit);
    setHabit([...habit, dataHabit]);
  };

  return (
    <div className={Styles["container"]}>
      <Back title="Add Habit" link="/habit" />
      <br />

      {/* --- TITLE SECTION --- */}
      <div className={Styles["nama-habit"]}>
        <img src={helpIcon} alt="help icon" />
        <input 
          type="text" 
          placeholder="Masukkan nama habit" 
          value={dataHabit.title} 
          onChange={(e) => setDataHabit({...dataHabit, title: e.target.value})} 
        />
        <img src={mapsIcon} alt="maps icon" />
        <Link to="/roadmap" className={Styles["link-roadmap"]}>Roadmap</Link>
      </div>

      <div className={Styles["section"]}>

        {/* --- ULANGI (REPEAT) SECTION --- */}
        <div>
          <div>
            <img src={repeatIcon} alt="repeat icon" />
            <h3>Ulangi</h3>
          </div>

          <div>
            {/* Select Tipe Ulangi */}
            <select 
              name="repeatType" 
              value={dataHabit.repeatType} 
              onChange={(e) => setDataHabit({...dataHabit, repeatType: e.target.value})}
            >
              <option value="daily">Daily</option>
              <option value="monthly">Monthly</option>
              <option value="interval">Interval</option>
            </select>

            {/* Select Hari Spesifik */}
            <select 
              name="daySet" 
              value={dataHabit.daySet} 
              onChange={(e) => setDataHabit({...dataHabit, daySet: e.target.value})}
            >
              <option value="day">Every day</option>
              <option value="Sunday">Sunday</option>
              <option value="Monday">Monday</option>
              <option value="Tuesday">Tuesday</option>
              <option value="Wednesday">Wednesday</option>
              <option value="Thursday">Thursday</option>
              <option value="Friday">Friday</option>
              <option value="Saturday">Saturday</option>
            </select>
          </div>
        </div>

        {/* --- GOALS SECTION --- */}
        <div>
          <div>
            <img src={goalIcon} alt="goal icon" />
            <h3>Goals</h3>
          </div>

          <div>
            {/* Input Count */}
            <input 
              type="number" 
              placeholder="0" 
              value={dataHabit.goals.count}
              onChange={(e) => setDataHabit({
                ...dataHabit, 
                goals: {...dataHabit.goals, count: e.target.value}
              })}
            />
            
            {/* Select Satuan (Times/Timed) */}
            <select 
              name="satuan" 
              value={dataHabit.goals.satuan}
              onChange={(e) => setDataHabit({
                ...dataHabit, 
                goals: {...dataHabit.goals, satuan: e.target.value}
              })}
            >
              <option value="daily">Times</option>
              <option value="timed">Timed</option>
            </select>

            {/* Select Periode (Per day/week) */}
            <select 
              name="ulangi" 
              value={dataHabit.goals.ulangi}
              onChange={(e) => setDataHabit({
                ...dataHabit, 
                goals: {...dataHabit.goals, ulangi: e.target.value}
              })}
            >
              <option value="Per-day">Per day</option>
              <option value="Per-week">Per week</option>
            </select>
          </div>
        </div>

        {/* --- TIMES SECTION (Checkboxes) --- */}
        <div className={Styles.times}>
          <div>
            <img src={sunIcon} alt="sun icon" />
            <h3>Times</h3>
          </div>

          <div>
            <div>
              <input 
                type="checkbox" 
                id="mark-morning" 
                value="Morning"
                checked={dataHabit.waktu.includes("Morning")}
                onChange={handleCheckbox}
              />
              <label htmlFor="mark-morning">Morning</label>
            </div>
            <div>
              <input 
                type="checkbox" 
                id="mark-afternoon" 
                value="Afternoon"
                checked={dataHabit.waktu.includes("Afternoon")}
                onChange={handleCheckbox}
              />
              <label htmlFor="mark-afternoon">Afternoon</label>
            </div>
            <div>
              <input 
                type="checkbox" 
                id="mark-evening" 
                value="Evening"
                checked={dataHabit.waktu.includes("Evening")}
                onChange={handleCheckbox}
              />
              <label htmlFor="mark-evening">Evening</label>
            </div>
          </div>
        </div>

        {/* --- START DATE SECTION --- */}
        <div>
          <div>
            <img src={flagIcon} alt="flag icon" />
            <h3>Start Date</h3>
          </div>
          <input 
            type="date" 
            className={Styles.date} 
            value={dataHabit.waktuMulai}
            onChange={(e) => setDataHabit({...dataHabit, waktuMulai: e.target.value})}
          />
        </div>

        {/* --- REMINDER SECTION --- */}
        <div>
          <div>
            <img src={reminderIcon} alt="reminder icon" />
            <h3>Reminder</h3>
          </div>
          <input 
            type="time" 
            value={dataHabit.pengingat}
            onChange={(e) => setDataHabit({...dataHabit, pengingat: e.target.value})}
          />
        </div>

        {/* --- END CONDITION SECTION --- */}
        <div>
          <div>
            <img src={slashIcon} alt="slash icon" />
            <h3>End conditon</h3>
          </div>
          <select 
            name="end-condition"
            value={dataHabit.kondisihabis}
            onChange={(e) => setDataHabit({...dataHabit, kondisihabis: e.target.value})}
          >
            <option value="daily">Never</option>
            <option value="weekly">Weekly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>

        {/* --- AREAS SECTION --- */}
        <div>
          <div>
            <img src={areasIcon} alt="areas icon" />
            <h3>Areas</h3>
          </div>
          <input 
            type="text" 
            placeholder="select areas" 
            value={dataHabit.area}
            onChange={(e) => setDataHabit({...dataHabit, area: e.target.value})}
          />
        </div>

        {/* --- CHECKLIST SECTION --- */}
        <div>
          <div>
            <img src={checklistIcon} alt="checklist icon" />
            <h3>Checklist</h3>
          </div>
          <input 
            type="text" 
            placeholder="Add new checklist" 
            value={dataHabit.checkList}
            onChange={(e) => setDataHabit({...dataHabit, checkList: e.target.value})}
          />
        </div>

        <button className={Styles.buttonSave} onClick={handleSave}>save</button>
      </div>
    </div>
  );
}