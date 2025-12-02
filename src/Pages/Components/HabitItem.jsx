import style from "../../assets/Styles/habit.module.css";
import Icon from "../../assets/Images/goal.png";

let habit = [
  {title:"lamasadad", icon:"something"},
  {title:"asdkjasd", icon:"something"},
  {title:";afjklksdafhj", icon:"something"},
]

const HabitItem = () => {
    console.log(habit[0].title)

    return (
        <div className={style.cardContainer}>
            
            {habit.map((item, index) => (
                <div className={style.card} key={index}>
                <div>
                    <img src={Icon} alt="" />
                    <p>{item.title}</p>
                </div>

                <img src={Icon} alt="" />
                </div>
            ))}
            
        </div>
    )
}

export default HabitItem;