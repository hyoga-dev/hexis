import style from "../../assets/Styles/habit.module.css";
import Icon from "../../assets/Images/goal.png";
import { useHabitProvider } from "../../data/habitData";

let habitData = [
  {title:"lamasadad", icon:"something", isGrouped: true},
  {title:"asdkjasd", icon:"something", isGrouped: false},
  {title:";afjklksdafhj", icon:"something", isGrouped: true},
]

const HabitItem = () => {
    const {habit, setHabit, value} = useHabitProvider()
    console.log(habit)

    return (
        <div className={style.cardContainer}>
            
            {habit.map((item, index) => (

                <div className={style.card} key={index}>
                    <div>
                        <div>
                            <img src={Icon} alt="" />
                            <p>{item.title}</p>
                        </div>
                        <img src={Icon} alt="" />   
                    </div>


                    {item.isGrouped && (
                        <div className={style.groupedCard}>
                            <div>
                                <div>
                                    <img src={Icon} alt="icon" />   
                                    <p>
                                        alamak {item.title}
                                    </p>
                                </div>
                                <img src={Icon} alt="icon" />   
                            </div>
                        </div>
                    )}
                </div>




            ))}
            
        </div>
    )
}

export default HabitItem;