import { Link } from "react-router-dom";
import Styles from "../../assets/Styles/addhabit.module.css";
import BackIcon from "../../assets/Icon/LeftArrow"

export default function Back(props) {
  return (
    <div className={Styles.header}>
      <Link to={props.link} className={Styles["link-check"]}>
        <div>
          <BackIcon />
        </div>
      </Link>
      {props.title}
    </div>
  );
}
