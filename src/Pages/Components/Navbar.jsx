import { useState } from "react";
import "../../assets/Styles/global.css";
import Styles from "../../assets/Styles/navbar.module.css";
import BurgerIcon from "../../assets/Icon/SideBar/BurgerIcon";
import BasilFireOutline from "../../assets/Icon/BasilFireOutline";

import SideBar from "./SideBar";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className={Styles.container}>
            <SideBar isOpen={isOpen} onClose={() => setIsOpen(false)} />
            <div className={Styles.header}>
                <button onClick={() => setIsOpen(true)} className={Styles.menuBtn}>
                    <BurgerIcon width="2rem" height="2rem" />
                </button>

                <div className={Styles.streak}>
                    <BasilFireOutline width="2rem" height="2rem" />
                    <span>4</span>
                </div>
            </div>
        </div>
)
}