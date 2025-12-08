import Styles from "../../assets/Styles/habit.module.css";
import Icon from "../../assets/Images/goal.png";
import { useHabitProvider } from "../../data/habitData";
import { useEffect } from "react";

const getDayName = () => {
    const days = ['minggu', 'senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu'];
    return days[new Date().getDay()];
};

const isTodayDate = (dayset) => {
    const today = (new Date().getDate())
    return dayset.includes(today);
}

function isToday(dayset) {
    return dayset.includes(getDayName());
}

const HabitItem = ({onUpdate}) => {
    const { habit, setHabit } = useHabitProvider(); 


    const handleClick = (index) => {
        onUpdate(true, index);
        
    };

    
    return (
        <>
            {habit.map((item, index) => (
                // <div key={index} className={Styles.wrapperCard}> 
                <>
                    {(isToday(item.daySet) || isTodayDate(item.daySet)) && (

                        <div className={Styles.cardContainer} onClick={() => handleClick(index)}>
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
                </>
                // </div> 
                
            ))}
        </>
    );
}

export default HabitItem;