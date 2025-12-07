import { NavLink } from "react-router-dom";
import "../../assets/Styles/global.css";
import Styles from "../../assets/Styles/sidebar.module.css";
import Logo from "../../assets//Icon/HexisLogoRight.jsx";
import BurgerIcon from "../../assets/Icon/SideBar/BurgerIcon";
import RoadMapIcon from "../../assets/Icon/SideBar/RoadMapIcon";
import HabitIcon from "../../assets/Icon/SideBar/HabitIcon";
import SettingIcon from "../../assets/Icon/SideBar/SettingIcon";
import AnalyticsIcon from "../../assets/Icon/SideBar/AnalyticsIcon";
import LogoutIcon from "../../assets/Icon/SideBar/LogoutIcon.jsx"
import AccountIcon from "../../assets/Icon/SideBar/AccountIcon.jsx"
import { signInWithPopup, signOut, getAuth } from 'firebase/auth';
import { auth, googleProvider } from '../../firebase.js';

const navLinks = [
  { name: "Habit", path: "/habit", icon: HabitIcon },
  { name: "Roadmap", path: "/roadmap", icon: RoadMapIcon },
  { name: "Analytics", path: "/analytics", icon: AnalyticsIcon },
  { name: "Settings", path: "/settings", icon: SettingIcon },
];

const SideBar = ({ isOpen, onClose }) => {
  const user = auth.currentUser;

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      window.location.href = '/';

      console.log('Signed out successfully!');
    } catch (error) {
      console.error('Sign-Out Error:', error.message);
    }
  };

  return (
    <>
      <div className={`${Styles.container} ${isOpen ? Styles.active : ""}`}>
        <div className={Styles.header}>
          <button onClick={onClose} className={Styles.BurgerIcon}>
            <BurgerIcon color="var(--font-color)" width="2rem" height="2rem" />
          </button>
          <Logo
            width="22dvw"
            height="7dvh"
            primary="var(--primary-color)"
            secondary="var(--font-color)" />
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
              <link.icon width="2rem" height="2rem" />
              <span>{link.name}</span>
            </NavLink>
          ))}
        </nav>

        <div className={Styles.footer}>
          <div className={Styles.profile} onClick={() => window.location.href = '/settings'}>
            <AccountIcon width="2rem" height="2rem" />
            <span>{`${user ? user.displayName : "Guest"}`}</span>
          </div>


          <div className={Styles.logout}>
            <NavLink onClick={handleSignOut} to="/login" className={Styles.logout}>
              <LogoutIcon color="var(--primary-color)" width="2rem" height="2rem" />
            </NavLink>
          </div>

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
