import Icon from "../../assets/Images/icon.png";
import Styles from "../../assets/Styles/login.module.css";
import Google from "../../assets/Images/icon-google.png";
import Facebook from "../../assets/Images/icon-facebook.png";
import Github from "../../assets/Images/icon-github.png";

export default function AltLogin() {
  return (
    <>
      <div className={Styles["alt-login"]}>
        <img src={Google} className={Styles.icon} />
        <img src={Facebook} className={Styles.icon} />
        <img src={Github} className={Styles.icon} />
      </div>
    </>
  );
}
