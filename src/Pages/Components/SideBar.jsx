import { NavLink, useNavigate } from "react-router-dom";
import "../../assets/Styles/global.css";
import Styles from "../../assets/Styles/sidebar.module.css";
import Logo from "../../assets//Icon/HexisLogoRight.jsx";
import BurgerIcon from "../../assets/Icon/SideBar/BurgerIcon";
import RoadMapIcon from "../../assets/Icon/SideBar/RoadMapIcon";
import HabitIcon from "../../assets/Icon/SideBar/HabitIcon";
import SettingIcon from "../../assets/Icon/SideBar/SettingIcon";
import AnalyticsIcon from "../../assets/Icon/SideBar/AnalyticsIcon";
import LogoutIcon from "../../assets/Icon/SideBar/LogoutIcon.jsx";
import AccountIcon from "../../assets/Icon/SideBar/AccountIcon.jsx";
// 1. Import useAuth for reactive user data
import { useAuth } from "../../data/AuthProvider"; 

const navLinks = [
  { name: "Habit", path: "/habit", icon: HabitIcon },
  { name: "Roadmap", path: "/roadmap", icon: RoadMapIcon },
  { name: "Analytics", path: "/analytics", icon: AnalyticsIcon },
  { name: "Settings", path: "/settings", icon: SettingIcon },
];

const SideBar = ({ isOpen, onClose }) => {
  // 2. Get real-time user data and logout function
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await logout();
      navigate('/login'); // Use navigate instead of window.location for smoother transition
      console.log('Signed out successfully!');
    } catch (error) {
      console.error('Sign-Out Error:', error.message);
    }
  };

  // 3. Helpers to display Name and Avatar
  const displayName = currentUser?.displayName || "Guest";
  const avatarUrl = currentUser?.photoURL;

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
          {/* 4. UPDATED PROFILE SECTION */}
          <div className={Styles.profile} onClick={() => navigate('/settings')}>
            {avatarUrl ? (
                // Show real avatar if available
                <img src={avatarUrl} alt="Profile" className={Styles.avatarImage} />
            ) : (
                // Fallback to Icon if no photo
                <AccountIcon width="2rem" height="2rem" />
            )}
            <span className={Styles.userName}>{displayName}</span>
          </div>

          <div className={Styles.logout}>
            <button onClick={handleSignOut} className={Styles.logoutBtn}>
              <LogoutIcon color="var(--primary-color)" width="2rem" height="2rem" />
            </button>
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