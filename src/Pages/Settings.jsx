import { useState } from "react";
import "../assets/Styles/global.css";
import Styles from "../assets/Styles/settings.module.css";
import NavbarStyles from "../assets/Styles/navbar.module.css";
import BurgerIcon from "../assets/Icon/SideBar/BurgerIcon";
import SideBar from "./Components/SideBar";
import SettingApperance from "./Components/SettingApperance";


const Settings = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("account");
 

  return (
    <div className={Styles.wrapper}>

      <SideBar isOpen={isOpen} onClose={() => setIsOpen(false)} />
      <div className={NavbarStyles.header}>
        <button onClick={() => setIsOpen(true)} className={NavbarStyles.menuBtn}>
          <BurgerIcon color="var(--font-color)" width="2rem" height="2rem" />
        </button>
      </div>

      {/* content */}
      <div className={Styles.container}>
        <h2>Settings</h2>

        {/* Navigation Tabs */}
        <div className={Styles.navbar}>
          <button
            className={`${Styles.navItem} ${activeTab === 'account' ? Styles.active : ''}`}
            onClick={() => setActiveTab('account')}
          >
            Account
          </button>
          <button
            className={`${Styles.navItem} ${activeTab === 'appearance' ? Styles.active : ''}`}
            onClick={() => setActiveTab('appearance')}
          >
            Appearance
          </button>
        </div>

        {/* Dynamic Content */}
        <div className={Styles.contentArea}>
          {activeTab === 'account' && (
            <div className={Styles.section}>
              <h3>Account Settings</h3>
              <p>Manage your profile and account details here.</p>
              {/* Add your Account inputs here */}
            </div>
          )}

          {activeTab === 'appearance' && (
           <SettingApperance />
          )}
        </div>

      </div>
    </div>
  );
};

export default Settings;