import Styles from "../../assets/Styles/habit.module.css";
import Icon from "../../assets/Images/goal.png";
import { useHabitProvider } from "../../data/habitData";

let habitData = [
  {title:"lamasadad", icon:"something", isGrouped: true},
  {title:"asdkjasd", icon:"something", isGrouped: false},
  {title:";afjklksdafhj", icon:"something", isGrouped: true},
];

const HabitItem = () => {
    // Menggunakan setHabit (camelCase)
    const { habit, setHabit } = useHabitProvider(); 
    console.log(habit);

    return (
        <div className={Styles.cardContainer}>
            
            {habit.map((item, index) => (

                <div className={Styles.card} key={index}>
                    {/* Header Card Utama */}
                    <div>
                        <div>
                            <img src={Icon} alt="" />
                            <p>{item.title}</p>
                        </div>
                        <img src={Icon} alt="" /> 
                    </div>

                    {/* Conditional Rendering untuk Grup */}
                    {/* {item.isGrouped && (
                        // Loop untuk menampilkan habitData di dalam grup
                        <div className={Styles.groupedContent}> 
                            {habitData
                                .filter(subItem => subItem.isGrouped) // Filter jika Anda hanya ingin menampilkan item yang termasuk grup
                                .map((subItem, idx) => (
                                    <div className={Styles.groupedCard} key={idx}>
                                        <div>
                                            <div>
                                                <img src={Icon} alt="icon" /> 
                                                <p>{subItem.title}</p>
                                            </div>
                                            <img src={Icon} alt="icon" /> 
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    )} */}
                </div>
            ))}
            
        </div>
    );
}

export default HabitItem;