import React from "react";
import { NavLink } from "react-router-dom";
import "../../assets/Styles/global.css";
import Styles from "../../assets/Styles/sidebar.module.css";
import Logo from "../../assets/Images/logo.png";
import BurgerIcon from "../../assets/Icon/BurgerIcon";
import Icon from "../../assets/Images/icon.png"

const navLinks = [
  { name: "Habit", path: "/habit" },
  { name: "RoadMap", path: "/habits" },
  { name: "Analytics", path: "/analytics" },
  { name: "Settings", path: "/settings" },
];

const SideBar = ({ isOpen, onClose }) => {
  return (
    <>
      <div className={`${Styles.container} ${isOpen ? Styles.active : ""}`}>
        <div className={Styles.header}>
          <button onClick={onClose} className={Styles.BurgerIcon}>
            <BurgerIcon width="2rem" height="2rem" />
          </button>
          <img src={Logo} alt="Hexis Logo" className={Styles.logo} />
        </div>

        <nav className={Styles.nav}>
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                isActive ? `${Styles.link} ${Styles.activeLink}` : Styles.link
              }
            >
              <img src={Icon} alt="" />
             <span>{link.name}</span>
            </NavLink>
          ))}
        </nav>

        <div className={Styles.footer}>
          <NavLink to="/login" className={Styles.logout}>
            Logout
          </NavLink>
        </div>
      </div>
      <div
        className={`${Styles.overlay} ${isOpen ? Styles.overlayActive : ""}`}
        onClick={onClose}
      ></div>
    </>
  );
};

export default SideBar;
