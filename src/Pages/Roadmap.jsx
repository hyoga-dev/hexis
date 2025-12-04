import Styles from "../assets/Styles/Roadmap.module.css";
import Icon from "../assets/Images/goal.png";
import { useState } from "react";
import NavbarStyles from "../assets/Styles/navbar.module.css";
import BurgerIcon from "../assets/Icon/SideBar/BurgerIcon";
import SideBar from "./Components/SideBar";

const Roadmap = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={Styles.wrapper}>
      <div className={NavbarStyles.container}>
        <SideBar isOpen={isOpen} onClose={() => setIsOpen(false)} />
        <div className={NavbarStyles.header}>
          <button
            onClick={() => setIsOpen(true)}
            className={NavbarStyles.menuBtn}
          >
            <BurgerIcon width="2rem" height="2rem" />
          </button>
        </div>
      </div>
      <div className={Styles.container}>
        <div className={Styles.card}>
          <h2>Alamak lorem ipsum dolor sit ammet met met jamet.</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
          <div className={Styles.star}>
            <img src={Icon} alt="" />
            <img src={Icon} alt="" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Roadmap;
