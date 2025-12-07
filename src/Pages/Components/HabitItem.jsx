import Styles from "../../assets/Styles/habit.module.css";
import Icon from "../../assets/Images/goal.png";
import { useHabitProvider } from "../../data/habitData";
import { useEffect } from "react";

const getDayName = () => {
    const days = ['minggu', 'senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu'];
    return days[new Date().getDay()];
};

function isToday(dayset) {
    return dayset.includes(getDayName());
}

const HabitItem = () => {
    const { habit, setHabit } = useHabitProvider(); 

    // useEffect(() => {
    //     console.log("isToday changed:", getDayName(), isToday);
    // }, []);
    
    return (
        <>
            {habit.map((item, index) => (
                <div key={index} className={Styles.wrapperCard}> 
                    {isToday(item.daySet) && (
                        <div className={Styles.cardContainer}>
                            <div className={Styles.card} key={index}>
                        

                                    <div>
                                        <div>
                                            <img src={Icon} alt="" />
                                            <p>{item.title}</p>
                                        </div>
                                        <img src={Icon} alt="" /> 
                                    </div>


                            </div>
                        </div>
                    )}

                </div>
                
            ))}
        </>
    );
}

export default HabitItem;