import { Link } from "react-router-dom";
import Styles from "../../assets/Styles/addhabit.module.css";

export default function Back(props) {
  return (
    <div className={Styles.header}>
      <Link to={props.link} className={Styles["link-check"]}>
        <div>
          <img src="src/assets/Images/btn-back.png" alt="" />
        </div>
      </Link>
      {props.title}
    </div>
  );
}
