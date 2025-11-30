import { Link } from "react-router-dom";
import Styles from "../assets/Styles/addhabit.module.css";
import Back from "./Components/Back";


export default function AddHabit() {

  return (
      <div className={Styles["container"]}>
        <Back title="Add Habit" />
        <div className={Styles["nama-habit"]}>
          <img src="src/assets/Images/help.png" alt="help icon"/>   
          <input type="text" placeholder="Masukkan nama habit" />
          <img src="src/assets/Images/maps.png" alt="maps icon" />
          <Link to="/roadmap" className={Styles["link-roadmap"]}>Roadmap</Link>
        </div>

        <div className={Styles["section"]}>

            <div>
              <div>
                <img src="src/assets/Images/repeat.png" alt="" />
                <h3>Ulangi</h3>
              </div>

              <div >
                <select name="ulangi">
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="yearly">Yearly</option>
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
                <img src="src/assets/Images/goal.png" alt="" />
                <h3>Goals</h3>
              </div>

              <div>
                <input type="number" placeholder="0"/>
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
                  <img src="src/assets/Images/sun.png" alt="" />
                  <h3>Times</h3>
                </div>

                <div>
                  <div>
                    <input type="checkbox" id="mark-morning"/>
                    <div>Morning</div>
                  </div>
                  <div>
                    <input type="checkbox" id="mark-afternoon"/>
                    <div>Afternoon</div>
                  </div>
                  <div>
                    <input type="checkbox" id="mark-evening"/>
                    <div>Evening</div>
                  </div>
                </div>
            </div>

            <div>
              <div>
                <img src="src/assets/Images/flag.png" alt="" />
                <h3>Start Date</h3>
              </div>
              <input type="date" className={Styles.date} />
            </div>

            <div>
              <div>
                <img src="src/assets/Images/reminder.png" alt="" />
                <h3>Reminder</h3>
              </div>
              <input type="time" />
            </div>

            <div>
              <div>
                <img src="src/assets/Images/slash.png" alt=""/>
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
                <img src="src/assets/Images/areas.png" alt="" />
                <h3>Areas</h3>
              </div>
              <input type="text" placeholder="select areas"/>
            </div>

            <div>
              <div>
                <img src="src/assets/Images/checklist.png" alt="" />
                <h3>Checklist</h3>
              </div>
              <input type="text" placeholder="Add new checklist"/>

            </div>

        </div>
      </div>
  );
}
