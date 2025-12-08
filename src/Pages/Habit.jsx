import style from "../assets/Styles/habit.module.css";
import HabitItem from "./Components/HabitItem";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Styles from "../assets/Styles/navbar.module.css";
import BurgerIcon from "../assets/Icon/SideBar/BurgerIcon";
import BasilFireOutline from "../assets/Icon/BasilFireOutline";
import SideBar from "./Components/SideBar";
import { useAuthLogin } from "../data/useAuthLogin";
import { useHabitProvider } from "../data/habitData";
import AddHabitIcon from "../assets/Icon/AddHabitIcon"
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";


const Habit = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [data, setData] = useState([]);
  const {currentUser, loading} = useAuthLogin();
  const {habit, setHabit} = useHabitProvider();
  const [popUpContent, setPopUpContent] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const collectionRef = collection(db, 'habit'); 
        const querySnapshot = await getDocs(collectionRef);
        
        const items = querySnapshot.docs.map(doc => ({ 
          id: doc.id, 
          ...doc.data() 
        }));
        console.log(items);
        
        setData(items);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };
    fetchData()
  }, [])

  function cardVisibility(visibility, index) {

    setPopUpContent(habit[index]);
    setCurrentIndex(index);

    setIsVisible(visibility);
  }

  function handleCloseAndSave() {
    if (currentIndex !== null && popUpContent) {
        
        const updatedHabit = [...habit];
        
        updatedHabit[currentIndex] = popUpContent;
        
        setHabit(updatedHabit); 
    }
    
    setIsVisible(false);
    setCurrentIndex(null);
  }

  useEffect(() => {
    // console.log(popUpContent);
  }, [popUpContent]);

  function PopUp() {

    if (!popUpContent) return null;

    return (
      <div className={style.popUp}>
        <div className={style.popUpBackground} onClick={handleCloseAndSave} />
        <div className={style.card}>
          
          <div>
            <input type="number" value={popUpContent.goals.count} onChange={(e) => setPopUpContent({...popUpContent, goals: { ...popUpContent.goals, count: parseInt(e.target.value) || 0}}) } />
            <span> / 7 times</span>
          </div>

          {/* <button onClick={handleCloseAndSave}>Close</button> */}
        </div>
      </div>
    )
  }






  return (
    <div className={style.wrapper}>

      {isVisible && <PopUp />}

      {/* header */}
      <SideBar isOpen={isOpen} onClose={() => setIsOpen(false)} />
      <div className={Styles.header}>

        <button onClick={() => setIsOpen(true)} className={Styles.menuBtn}>
          <BurgerIcon color="var(--font-color)" width="2rem" height="2rem" />
        </button>

        <div className={Styles.streak}>
          <BasilFireOutline width="2rem" height="2rem" />
          <span>4</span>
        </div>

      </div>

      {/* content */}
      <div className={style.container}>
        <div>
          <h2>Morning</h2>
          <p>Filter</p>
        </div>

        <HabitItem onUpdate={cardVisibility} />
        <Link to="/addhabit" className={style.addHabitBtn}>
          <AddHabitIcon width="4rem" height="4rem" />
        </Link>
      </div>

    </div>
  );
};

export default Habit;
