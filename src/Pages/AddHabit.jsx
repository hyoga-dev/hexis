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
  const DAYS_OF_WEEK = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu","Minggu"];
  const DATES_IN_MONTH = Array.from({ length: 31 }, (_, i) => i + 1);

  const handleDayToggle = (day) => {
    let currentDays = Array.isArray(dataHabit.daySet) ? [...dataHabit.daySet] : [];

    if (currentDays.includes(day)) {
      // Remove if exists
      currentDays = currentDays.filter(d => d !== day);
    } else {
      // Add if not exists
      currentDays.push(day);
    }
    setDataHabit({ ...dataHabit, daySet: currentDays });
  };

  const handleEverydayToggle = (e) => {
    if (e.target.checked) {
      setDataHabit({ ...dataHabit, daySet: [...DAYS_OF_WEEK] });
    } else {
      setDataHabit({ ...dataHabit, daySet: [] });
    }
  };

  const handleDateToggle = (date) => {
    let currentDates = Array.isArray(dataHabit.daySet) ? [...dataHabit.daySet] : [];

    if (currentDates.includes(date)) {
      currentDates = currentDates.filter(d => d !== date);
    } else {
      currentDates.push(date);
    }
    setDataHabit({ ...dataHabit, daySet: currentDates });
  };

  const handleRepeatTypeChange = (e) => {
    const newType = e.target.value;
    let defaultVal = [];

    // Reset logic: interval needs a number or string, others need arrays
    if (newType === 'interval') defaultVal = "1";
    else defaultVal = [];

    setDataHabit({
      ...dataHabit,
      repeatType: newType,
      daySet: defaultVal
    });
  };


  const { habit, setHabit } = useHabitProvider();
  const [dataHabit, setDataHabit] = useState({
    title: "",
    repeatType: "daily",
    daySet: ["senin", "selasa", "rabu", "kamis", "jumat", "sabtu", "minggu"],
    goals: {
      count: 1,
      satuan: "times",
      ulangi: "per_day"
    },
    waktu: ["Morning", "Afternoon", "Evening"],
    waktuMulai: "",
    pengingat: "09:00",
    kondisihabis: "Never",
    endDetails: "",
    area: "",
    checkList: "",
    isGrouped: false,
  });

  useEffect(() => {
    console.log(dataHabit.title);
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

  // Variabel untuk menentukan apakah tombol Save harus dinonaktifkan
  const isSaveDisabled = dataHabit.title.trim() === "";

  const handleSave = () => {
    console.log("Saving Habit:", dataHabit);
    if (dataHabit.title.trim() !== "") {
      setHabit([...habit, dataHabit]);
      window.location.href = '/habit';
      return;
    }
    alert("Habit name cannot be empty.");
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
          onChange={(e) => {
            setDataHabit({ ...dataHabit, title: e.target.value })
          }}
          required
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

          <div className={Styles["inputCol-repeat"]}>

            {/* 1. LEFT SIDE: Type Selector */}
            <select
              name="repeatType"
              value={dataHabit.repeatType}
              onChange={handleRepeatTypeChange}
              className={Styles.fullWidthInput}
            >
              <option value="daily">Daily</option>
              <option value="monthly">Monthly</option>
              <option value="interval">Interval</option>
            </select>

            {/* 2. RIGHT SIDE: Dynamic Input */}
            <div style={{ width: '100%', marginTop: '5px' }}>

              {/* CASE A: DAILY (Vertical Checkboxes) */}
              {dataHabit.repeatType === 'daily' && (
                <div className={Styles.daily}>

                  {/* Everyday Checkbox */}
                  <label>
                    <input
                      type="checkbox"
                      onChange={handleEverydayToggle}
                      checked={Array.isArray(dataHabit.daySet) && dataHabit.daySet.length === 7}
                    />
                    Setiap Hari
                  </label>
                  <hr />

                  {/* Individual Days */}
                  {DAYS_OF_WEEK.map((day) => (
                    <label key={day} >
                      <input
                        type="checkbox"
                        value={day}
                        checked={Array.isArray(dataHabit.daySet) && dataHabit.daySet.includes(day)}
                        onChange={() => handleDayToggle(day)}
                      />
                      {day}
                    </label>
                  ))}
                </div>
              )}

              {/* CASE B: MONTHLY (Grid of Dates) */}
              {dataHabit.repeatType === 'monthly' && (
                <div className={Styles.monthly}>
                  {DATES_IN_MONTH.map((date) => {
                    const isSelected = Array.isArray(dataHabit.daySet) && dataHabit.daySet.includes(date);
                    return (
                      <div
                        key={date}
                        onClick={() => handleDateToggle(date)}
                        style={{
                          backgroundColor: isSelected ? '#38acff' : '#f0f0f0',
                          color: isSelected ? 'white' : 'black',
                        }}
                        className={Styles["input-monthly"]}
                      >
                        {date}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* CASE C: INTERVAL (Number Input) */}
              {dataHabit.repeatType === 'interval' && (
                <div className={Styles.interval}>
                  <span>Setiap</span>
                  <input
                    type="number"
                    min="1"
                    value={dataHabit.daySet}
                    onChange={(e) => setDataHabit({ ...dataHabit, daySet: e.target.value })}

                  />
                  <span>Hari</span>
                </div>
              )}

            </div>
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
              <option value="hours">hours</option>
              <option value="steps">steps</option>
              <option value="km">km</option>
              <option value="ml">ml</option>
              <option value="glasses">glasses</option>
              <option value="pages">pages</option>
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
       {/* Row: End Condition */}
<div className={Styles.row} style={{ alignItems: 'flex-start' }}>
  <div className={Styles.labelCol} style={{ paddingTop: '10px' }}>
    <img src={slashIcon} alt="end" />
    <span>End Condition</span>
  </div>

  <div className={Styles.inputCol} style={{ flexDirection: 'column', gap: '10px' }}>
    
    {/* 1. The Dropdown (Selector) */}
    <select
      className={Styles.fullWidthInput}
      value={dataHabit.kondisihabis}
      onChange={(e) => {
        // Reset the details when type changes
        setDataHabit({ 
          ...dataHabit, 
          kondisihabis: e.target.value,
          endDetails: "" 
        });
      }}
    >
      <option value="Never">Never</option>
      <option value="On Date">On Date</option>
      <option value="After X days">After X days</option>
    </select>

    {/* 2. The Conditional Input */}
    
    {/* CASE A: ON DATE -> Show Calendar Input */}
    {dataHabit.kondisihabis === 'On Date' && (
      <input
        type="date"
        className={Styles.fullWidthInput}
        value={dataHabit.endDetails}
        onChange={(e) => setDataHabit({ ...dataHabit, endDetails: e.target.value })}
        required
      />
    )}

    {/* CASE B: AFTER X DAYS -> Show Number Input */}
    {dataHabit.kondisihabis === 'After X days' && (
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%' }}>
        <input
          type="number"
          placeholder="e.g. 30"
          value={dataHabit.endDetails}
          onChange={(e) => setDataHabit({ ...dataHabit, endDetails: e.target.value })}
          className={Styles.fullWidthInput}
          min="1"
        />
        <span style={{ whiteSpace: 'nowrap' }}>days</span>
      </div>
    )}

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

      </div>

      {/* 4. Footer Buttons */}
      <div className={Styles.footer}>
        <Link to="/habit">
          <button className={Styles.btnCancel}>Cancel</button>
        </Link>
        <button
          className={dataHabit.title !== "" ? Styles.btnSave : Styles.btnSaveDisabled}
          onClick={handleSave}
        // disabled={isSaveDisabled} 
        >
          Save
        </button>
      </div>

    </div>
  );
}