import { Link, useNavigate } from "react-router-dom";
import Styles from "../assets/Styles/addhabit.module.css";

//Icon
import NameIcon from "../assets/Icon/PenIcon";
import MotivationIcon from "../assets/Icon/MotivationIcon";
import RepeatIcon from "../assets/Icon/RepeatIcon";
import GoalIcon from "../assets/Icon/GoalIcon";
import TimeIcon from "../assets/Icon/TimeIcon";
import StartIcon from "../assets/Icon/DateIcon";
import EndIcon from "../assets/Icon/EndIcon";
import RemainderIcon from "../assets/Icon/AlertIcon";

import helpIcon from "../assets/Images/help.png";
import repeatIcon from "../assets/Images/repeat.png";
import goalIcon from "../assets/Images/goal.png";
import sunIcon from "../assets/Images/sun.png";
import flagIcon from "../assets/Images/flag.png";
import reminderIcon from "../assets/Images/reminder.png";
import slashIcon from "../assets/Images/slash.png";
import { useHabitProvider } from "../data/habitData";
import { useState, useEffect } from "react";

// Updated to accept props for reuse
export default function AddHabit({ onSave, onCancel, habitToEdit }) {
  const navigate = useNavigate();
  const DAYS_OF_WEEK = ["senin", "selasa", "rabu", "kamis", "jumat", "sabtu", "minggu"];
  const DATES_IN_MONTH = Array.from({ length: 31 }, (_, i) => i + 1);

  const { habit, setHabit } = useHabitProvider();

  // Default State
  const defaultState = {
    title: "",
    description: "",
    repeatType: "daily",
    daySet: ["senin", "selasa", "rabu", "kamis", "jumat", "sabtu", "minggu"],
    goals: { target: 1, count: 0, satuan: "times", ulangi: "per_day" },
    waktu: ["Morning", "Afternoon", "Evening"],
    waktuMulai: new Date().toISOString().split('T')[0],
    pengingat: "09:00",
    kondisihabis: "Never",
    endDetails: "",
    area: "",
    checkList: "",
    isGrouped: false,
  };

  const [dataHabit, setDataHabit] = useState(defaultState);

  // Load habitToEdit if provided (EDIT MODE)
  useEffect(() => {
    if (habitToEdit) {
      setDataHabit({ ...defaultState, ...habitToEdit });
    }
  }, [habitToEdit]);

  const calculateDailyAverage = () => {
    if (dataHabit.goals.ulangi !== "per_week") return null;
    if (!Array.isArray(dataHabit.daySet) || dataHabit.daySet.length === 0) return null;
    const avg = dataHabit.goals.target / dataHabit.daySet.length;
    return `Daily Avg: ~${Number.isInteger(avg) ? avg : avg.toFixed(1)} ${dataHabit.goals.satuan}`;
  };

  // --- HANDLERS ---
  const handleDayToggle = (day) => {
    let current = Array.isArray(dataHabit.daySet) ? [...dataHabit.daySet] : [];
    if (current.includes(day)) current = current.filter(d => d !== day);
    else current.push(day);
    setDataHabit({ ...dataHabit, daySet: current });
  };

  const handleEverydayToggle = (e) => {
    setDataHabit({ ...dataHabit, daySet: e.target.checked ? [...DAYS_OF_WEEK] : [] });
  };

  const handleDateToggle = (date) => {
    let current = Array.isArray(dataHabit.daySet) ? [...dataHabit.daySet] : [];
    if (current.includes(date)) current = current.filter(d => d !== date);
    else current.push(date);
    setDataHabit({ ...dataHabit, daySet: current });
  };

  const handleRepeatTypeChange = (e) => {
    const newType = e.target.value;
    setDataHabit({ ...dataHabit, repeatType: newType, daySet: newType === 'interval' ? "1" : [] });
  };

  const handleCheckbox = (e) => {
    const { value, checked } = e.target;
    let updated = [...dataHabit.waktu];
    if (checked) updated.push(value);
    else updated = updated.filter((item) => item !== value);
    setDataHabit({ ...dataHabit, waktu: updated });
  };

  // --- SAVE LOGIC ---
  const handleSave = () => {
    if (dataHabit.title.trim() === "") return alert("Habit name cannot be empty.");

    if (onSave) {
      // REUSABLE MODE: Pass data back to parent
      onSave(dataHabit);
    } else {
      // DEFAULT MODE: Save to Global Context
      setHabit([...habit, dataHabit]);
      navigate('/habit');
    }
  };

  const handleCancel = () => {
    if (onCancel) onCancel();
    else navigate('/habit');
  };

  return (
    // Style override to fit inside modal if needed
    <div className={Styles.container} style={onSave ? { width: '100%', margin: 0, height: '100%', maxHeight: 'none', boxShadow: 'none', border: 'none' } : {}}>

      <div className={Styles.header} style={onSave ? { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } : {}}>
        <h2>{habitToEdit ? "Edit Habit" : "Add Habit"}</h2>
        {onSave && <button onClick={handleCancel} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--secondary-font-color)' }}>×</button>}
      </div>

      <div className={Styles.headerInput}>
        <NameIcon color="var(--primary-color)" />
        <input
          type="text"
          placeholder="Enter Habit Name"
          value={dataHabit.title}
          onChange={(e) => setDataHabit({ ...dataHabit, title: e.target.value })}
          required
          autoFocus={!!onSave}
        />
      </div>

      <div className={Styles.formBody}>

        {/* Motivation */}
        <div className={Styles.row}>
          <div className={Styles.labelCol}>
            <MotivationIcon color="var(--primary-color)" />
            <span>Motivation</span>
          </div>
          <div className={Styles.inputCol}>
            <textarea
              placeholder="Why this habit?"
              value={dataHabit.description}
              onChange={(e) => setDataHabit({ ...dataHabit, description: e.target.value })}
            />
          </div>
        </div>

        {/* Repeat */}
        <div className={Styles.row}>
          <div className={Styles.labelCol}>
            <RepeatIcon color="var(--primary-color)" />
            <span>Repeat</span>
          </div>
          <div className={Styles["inputCol-repeat"]}>
            <select
              value={dataHabit.repeatType}
              onChange={handleRepeatTypeChange}
              className={Styles.fullWidthInput}
            >
              <option value="daily">Daily</option>
              <option value="monthly">Monthly</option>
              <option value="interval">Interval</option>
            </select>

            <div style={{ width: '100%', marginTop: '5px' }}>
              {dataHabit.repeatType === 'daily' && (
                <div className={Styles.daily}>
                  <label>
                    <input type="checkbox" onChange={handleEverydayToggle} checked={Array.isArray(dataHabit.daySet) && dataHabit.daySet.length === 7} />
                    Setiap Hari
                  </label>
                  <hr />
                  {DAYS_OF_WEEK.map((day) => (
                    <label key={day}>
                      <input type="checkbox" value={day} checked={Array.isArray(dataHabit.daySet) && dataHabit.daySet.includes(day)} onChange={() => handleDayToggle(day)} />
                      {day}
                    </label>
                  ))}
                </div>
              )}
              {dataHabit.repeatType === 'monthly' && (
                <div className={Styles.monthly}>
                  {DATES_IN_MONTH.map((date) => (
                    <div key={date} onClick={() => handleDateToggle(date)} className={Styles["input-monthly"]}
                      style={{ backgroundColor: Array.isArray(dataHabit.daySet) && dataHabit.daySet.includes(date) ? '#38acff' : '#f0f0f0', color: Array.isArray(dataHabit.daySet) && dataHabit.daySet.includes(date) ? 'white' : 'black' }}>
                      {date}
                    </div>
                  ))}
                </div>
              )}
              {dataHabit.repeatType === 'interval' && (
                <div className={Styles.interval}>
                  <span>Setiap</span>
                  <input type="number" min="1" value={dataHabit.daySet} onChange={(e) => setDataHabit({ ...dataHabit, daySet: e.target.value })} />
                  <span>Hari</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Goal */}
        <div className={Styles.row}>
          <div className={Styles.labelCol}>
            <GoalIcon color="var(--primary-color)" />
            <span>Goal</span>
          </div>
          <div className={Styles.inputCol}>
            <input type="number" value={dataHabit.goals.target} onChange={(e) => setDataHabit({ ...dataHabit, goals: { ...dataHabit.goals, target: parseInt(e.target.value) || 0 } })} className={Styles.goalNumber} />
            <select value={dataHabit.goals.satuan} onChange={(e) => setDataHabit({ ...dataHabit, goals: { ...dataHabit.goals, satuan: e.target.value } })}>
              <option value="times">times</option>
              <option value="minutes">mins</option>
              <option value="pages">pages</option>
              <option value="km">km</option>
              <option value="glasses">glasses</option>
            </select>
            <select value={dataHabit.goals.ulangi} onChange={(e) => setDataHabit({ ...dataHabit, goals: { ...dataHabit.goals, ulangi: e.target.value } })}>
              <option value="per_day">per day</option>
              <option value="per_week">per week</option>
            </select>
            <div className={Styles.calcText}>{calculateDailyAverage()}</div>
          </div>
        </div>

        {/* Time of Day */}
        <div className={Styles.row}>
          <div className={Styles.labelCol}>
            <TimeIcon color="var(--primary-color)" />
            <span>Time</span>
          </div>
          <div className={Styles.inputCol}>
            <div className={Styles.checkboxGroup}>
              {["Morning", "Afternoon", "Evening"].map(time => (
                <label key={time} className={Styles.checkboxItem}>
                  <input type="checkbox" value={time} checked={dataHabit.waktu.includes(time)} onChange={handleCheckbox} /> {time}
                </label>
              ))}
              <label className={Styles.checkboxItem}>
                <input type="checkbox" checked={dataHabit.waktu.length === 0} onChange={() => setDataHabit({ ...dataHabit, waktu: [] })} /> Anytime
              </label>
            </div>
          </div>
        </div>

        {/* Start Date */}
        <div className={Styles.row}>
          <div className={Styles.labelCol}>
             <StartIcon color="var(--primary-color)" />
            <span>Start</span>
          </div>
          <div className={Styles.inputCol}>
            <input type="date" value={dataHabit.waktuMulai} onChange={(e) => setDataHabit({ ...dataHabit, waktuMulai: e.target.value })} />
          </div>
        </div>

        {/* End Condition (Restored) */}
        <div className={Styles.row}>
          <div className={Styles.labelCol}>
           <EndIcon color="var(--primary-color)" />
            <span>End Condition</span>
          </div>
          <div className={Styles.inputCol} style={{ flexDirection: 'column', gap: '10px', alignItems: 'flex-start' }}>
            <select
              value={dataHabit.kondisihabis}
              onChange={(e) => setDataHabit({ ...dataHabit, kondisihabis: e.target.value, endDetails: "" })}
              style={{ width: '100%' }}
            >
              <option value="Never">Never</option>
              <option value="On Date">On Date</option>
              <option value="After X days">After X days</option>
            </select>

            {dataHabit.kondisihabis === 'On Date' && (
              <input
                type="date"
                value={dataHabit.endDetails}
                onChange={(e) => setDataHabit({ ...dataHabit, endDetails: e.target.value })}
                required
                style={{ width: '100%' }}
              />
            )}

            {dataHabit.kondisihabis === 'After X days' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%' }}>
                <input
                  type="number"
                  placeholder="30"
                  value={dataHabit.endDetails}
                  onChange={(e) => setDataHabit({ ...dataHabit, endDetails: e.target.value })}
                  style={{ flex: 1 }}
                  min="1"
                />
                <span style={{ whiteSpace: 'nowrap' }}>days</span>
              </div>
            )}
          </div>
        </div>

        {/* Reminders (Restored) */}
        <div className={Styles.row}>
          <div className={Styles.labelCol}>
            <RemainderIcon color="var(--primary-color)" />
            <span>Reminders</span>
          </div>
          <div className={Styles.inputCol}>
            <input
              type="time"
              value={dataHabit.pengingat}
              onChange={(e) => setDataHabit({ ...dataHabit, pengingat: e.target.value })}
            />
          </div>
        </div>

      </div>

      <div className={Styles.footer}>
        <button className={Styles.btnCancel} onClick={handleCancel}>Cancel</button>
        <button className={dataHabit.title !== "" ? Styles.btnSave : Styles.btnSaveDisabled} onClick={handleSave}>
          {habitToEdit ? "Update" : "Save"}
        </button>
      </div>

    </div>
  );
}