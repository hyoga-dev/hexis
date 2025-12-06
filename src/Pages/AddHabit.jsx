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
  const {habit, setHabit} = useHabitProvider();
  const [dataHabit, setDataHabit] = useState({
    title: "",
    daySet: [], 
    goals: {count: 0, satuan: "", ulangi: ""},
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
    <div className={Styles["container"]}>
      <Back title="Add Habit" link="/habit" />
      <br />

      <div className={Styles["nama-habit"]}>
        <img src={helpIcon} alt="help icon" />
        <input type="text" placeholder="Masukkan nama habit" />
        <img src={mapsIcon} alt="maps icon" />
        <Link to="/roadmap" className={Styles["link-roadmap"]}>Roadmap</Link>
      </div>

      <div className={Styles["section"]}>

        <div>
          <div>
            <img src={repeatIcon} alt="repeat icon" />
            <h3>Ulangi</h3>
          </div>

          <div >
            <select name="ulangi" value={dataHabit.goals.ulangi} onChange={(e) => setDataHabit({...dataHabit, goals: {...dataHabit.goals, ulangi: e.target.value}}) }>
              <option value="daily">Daily</option>
              <option value="monthly">Monthly</option>
              <option value="interval">Interval</option>
            </select>

            <select name="ulangi">
              <option value="day">Every day</option>
              <option value="day">Sunday</option>
              <option value="day">Monday</option>
              <option value="day">Tuesday</option>
              <option value="day">Wednesday</option>
              <option value="day">Thursday</option>
              <option value="day">Friday</option>
              <option value="day">Saturday</option>
            </select>
          </div>
        </div>

        <div>
          <div>
            <img src={goalIcon} alt="goal icon" />
            <h3>Goals</h3>
          </div>

          <div>
            <input type="number" placeholder="0" />
            <select name="goal" >
              <option value="daily">Times</option>
              <option value="daily">Timed</option>
            </select>
            <select name="goal" >
              <option value="Per-day">Per day</option>
              <option value="Per-week">Per week</option>
            </select>
          </div>
        </div>

        <div className={Styles.times}>
          <div >
            <img src={sunIcon} alt="sun icon" />
            <h3>Times</h3>
          </div>

          <div>
            <div>
              <input type="checkbox" id="mark-morning" />
              <div>Morning</div>
            </div>
            <div>
              <input type="checkbox" id="mark-afternoon" />
              <div>Afternoon</div>
            </div>
            <div>
              <input type="checkbox" id="mark-evening" />
              <div>Evening</div>
            </div>
          </div>
        </div>

        <div>
          <div>
            <img src={flagIcon} alt="flag icon" />
            <h3>Start Date</h3>
          </div>
          <input type="date" className={Styles.date} />
        </div>

        <div>
          <div>
            <img src={reminderIcon} alt="reminder icon" />
            <h3>Reminder</h3>
          </div>
          <input type="time" />
        </div>

        <div>
          <div>
            <img src={slashIcon} alt="slash icon" />
            <h3>End conditon</h3>
          </div>
          <select name="end-condition" >
            <option value="daily">Never</option>
            <option value="weekly"></option>
            <option value="yearly"></option>
          </select>

        </div>

        <div>
          <div>
            <img src={areasIcon} alt="areas icon" />
            <h3>Areas</h3>
          </div>
          <input type="text" placeholder="select areas" />
        </div>

        <div>
          <div>
            <img src={checklistIcon} alt="checklist icon" />
            <h3>Checklist</h3>
          </div>
          <input type="text" placeholder="Add new checklist" />

        </div>

        <button className={Styles.buttonSave}>save</button>
      </div>
    </div>
  );
}
