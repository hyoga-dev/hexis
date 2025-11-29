// import { useState } from "react";
import { Link } from "react-router-dom";
import "../assets/Styles/global.css";
import "../assets/Styles/addhabit.css";
import { useAuthLogic } from "../data/userAuth";

export default function AddHabit() {
  const { formData, handleChange, handleSubmit } = useAuthLogic(true);
  return (
    <>
      <div className="container-add-habit">
        <div className="header">
          <Link to="/" className="link-check">
            <div>
              <img src="src/assets/Images/btn-back.png" alt="" />
            </div>
          </Link>
          Add Habit
        </div>
        <div className="container-section">
          <div className="add-habit-section-1">
            <div className="btn-help">
              <img
                className="btn-help"
                src="src/assets/Images/help.png"
                alt=""
              />
            </div>
            <input
              className="input"
              type="text"
              placeholder="Masukkan nama habit"
            ></input>
            <div className="btn-maps">
              <img src="src/assets/Images/maps.png" alt="" />
            </div>
            <Link to="/roadmap" className="link-roadmap">
              Roadmap
            </Link>
          </div>
          <div className="add-habit-section-2">
            <img src="src/assets/Images/repeat.png" alt="" />
            <h3>Ulangi</h3>
            <select name="ulangi" className="input">
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="yearly">Yearly</option>
            </select>
            <select name="ulangi" className="input">
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
          <div className="add-habit-section-3">
            <img src="src/assets/Images/goal.png" alt="" />
            <input type="number" className="input" placeholder="1"></input>
            <select name="goal" className="input">
              <option value="daily">Times</option>
              <option value="daily">Timed</option>
            </select>
            <select name="goal" className="input">
              <option value="Per-day">Per day</option>
              <option value="Per-week">Per week</option>
            </select>
          </div>
          <div className="add-habit-section-4">
            <img src="src/assets/Images/sun.png" alt="" />
            <h3>Times of the day</h3>
            <input
              type="checkbox"
              class="custom-mark"
              id="mark-morning"
            /><p>Morning</p>
            <input
              type="checkbox"
              class="custom-mark"
              id="mark-afternoon"
            /><p>Afternoon</p>
            <input
              type="checkbox"
              class="custom-mark"
              id="mark-evening"
            /><p>Evening</p>
          </div>
          <div className="add-habit-section-5">
          <img src="src/assets/Images/flag.png" alt="" />
          <h3>Start Date</h3>
          <input type="date" className="date"/>
          </div>
          <div className="add-habit-section-6">
          <img src="src/assets/Images/slash.png" alt="" />
          <h3>End conditon</h3>
           <select name="end-condition" className="input">
              <option value="daily">Never</option>
              <option value="weekly"></option>
              <option value="yearly"></option>
            </select>
          </div>
          <div className="add-habit-section-7">
          <img src="src/assets/Images/reminder.png" alt="" />
          <h3>Reminder</h3>
          <input type="time" className="input" />
          </div>
          <div className="add-habit-section-8">
          <img src="src/assets/Images/areas.png" alt="" />
          <h3>Areas</h3>
          <input type="text" className="input" placeholder="select areas"/>
          </div>
          <div className="add-habit-section-8">
          <img src="src/assets/Images/checklist.png" alt="" />
          <h3>Checklist</h3>
          <input type="text" placeholder="Add new checklist" className="input"/>
          </div>
        </div>
      </div>
    </>
  );
}
