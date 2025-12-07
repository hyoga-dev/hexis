import { useState } from "react";
import "../assets/Styles/global.css";
import Styles from "../assets/Styles/settings.module.css";
import NavbarStyles from "../assets/Styles/navbar.module.css";
import BurgerIcon from "../assets/Icon/SideBar/BurgerIcon";
import SideBar from "./Components/SideBar";
import useTheme from "../data/useTheme";

const Settings = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("account");
  const { isDarkMode, toggleDarkMode, updateColor, applyColors, discardChanges, resetColors, getColorValue, hasChanges } = useTheme();

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
            <div className={Styles.section}>
              <h3>Appearance</h3>

              {/* Theme Toggle */}
              <div className={Styles.settingGroup}>
                <div className={Styles.settingHeader}>
                  <label htmlFor="darkModeToggle">Dark Mode</label>
                  <input
                    id="darkModeToggle"
                    type="checkbox"
                    checked={isDarkMode}
                    onChange={toggleDarkMode}
                    className={Styles.toggle}
                  />
                </div>
                <p className={Styles.description}>
                  {isDarkMode ? "Currently using dark mode" : "Currently using light mode"}
                </p>
              </div>

              {/* Color Customization */}
              <div className={Styles.settingGroup}>
                <h4>Customize Colors</h4>
                <p className={Styles.description}>Click on a color swatch to change individual colors</p>

                <div className={Styles.colorGrid}>
                  {/* Primary Color */}
                  <div className={Styles.colorItem}>
                    <label htmlFor="primaryColor">Primary Color</label>
                    <div className={Styles.colorInputWrapper}>
                      <input
                        id="primaryColor"
                        type="color"
                        value={getColorValue('primaryColor')}
                        onChange={(e) => updateColor('primaryColor', e.target.value)}
                        className={Styles.colorInput}
                      />
                      <span className={Styles.colorValue}>{getColorValue('primaryColor')}</span>
                    </div>
                  </div>

                  {/* Primary Hover */}
                  <div className={Styles.colorItem}>
                    <label htmlFor="primaryHover">Primary Hover</label>
                    <div className={Styles.colorInputWrapper}>
                      <input
                        id="primaryHover"
                        type="color"
                        value={getColorValue('primaryHover')}
                        onChange={(e) => updateColor('primaryHover', e.target.value)}
                        className={Styles.colorInput}
                      />
                      <span className={Styles.colorValue}>{getColorValue('primaryHover')}</span>
                    </div>
                  </div>

                  {/* Secondary Color */}
                  <div className={Styles.colorItem}>
                    <label htmlFor="secondaryColor">Secondary Color</label>
                    <div className={Styles.colorInputWrapper}>
                      <input
                        id="secondaryColor"
                        type="color"
                        value={getColorValue('secondaryColor')}
                        onChange={(e) => updateColor('secondaryColor', e.target.value)}
                        className={Styles.colorInput}
                      />
                      <span className={Styles.colorValue}>{getColorValue('secondaryColor')}</span>
                    </div>
                  </div>

                  {/* Font Color */}
                  <div className={Styles.colorItem}>
                    <label htmlFor="fontColor">Font Color</label>
                    <div className={Styles.colorInputWrapper}>
                      <input
                        id="fontColor"
                        type="color"
                        value={getColorValue('fontColor')}
                        onChange={(e) => updateColor('fontColor', e.target.value)}
                        className={Styles.colorInput}
                      />
                      <span className={Styles.colorValue}>{getColorValue('fontColor')}</span>
                    </div>
                  </div>

                  {/* Background Color */}
                  <div className={Styles.colorItem}>
                    <label htmlFor="backgroundColor">Background Color</label>
                    <div className={Styles.colorInputWrapper}>
                      <input
                        id="backgroundColor"
                        type="color"
                        value={getColorValue('backgroundColor')}
                        onChange={(e) => updateColor('backgroundColor', e.target.value)}
                        className={Styles.colorInput}
                      />
                      <span className={Styles.colorValue}>{getColorValue('backgroundColor')}</span>
                    </div>
                  </div>

                  {/* Surface Color */}
                  <div className={Styles.colorItem}>
                    <label htmlFor="surfaceColor">Surface Color</label>
                    <div className={Styles.colorInputWrapper}>
                      <input
                        id="surfaceColor"
                        type="color"
                        value={getColorValue('surfaceColor')}
                        onChange={(e) => updateColor('surfaceColor', e.target.value)}
                        className={Styles.colorInput}
                      />
                      <span className={Styles.colorValue}>{getColorValue('surfaceColor')}</span>
                    </div>
                  </div>

                  {/* Error Color */}
                  <div className={Styles.colorItem}>
                    <label htmlFor="errorColor">Error Color</label>
                    <div className={Styles.colorInputWrapper}>
                      <input
                        id="errorColor"
                        type="color"
                        value={getColorValue('errorColor')}
                        onChange={(e) => updateColor('errorColor', e.target.value)}
                        className={Styles.colorInput}
                      />
                      <span className={Styles.colorValue}>{getColorValue('errorColor')}</span>
                    </div>
                  </div>

                  {/* Border Color */}
                  <div className={Styles.colorItem}>
                    <label htmlFor="borderColor">Border Color</label>
                    <div className={Styles.colorInputWrapper}>
                      <input
                        id="borderColor"
                        type="color"
                        value={getColorValue('borderColor')}
                        onChange={(e) => updateColor('borderColor', e.target.value)}
                        className={Styles.colorInput}
                      />
                      <span className={Styles.colorValue}>{getColorValue('borderColor')}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className={Styles.buttonGroup}>
                  <button onClick={applyColors} className={Styles.applyBtn} disabled={!hasChanges}>
                    Apply Changes
                  </button>
                  <button onClick={discardChanges} className={Styles.discardBtn} disabled={!hasChanges}>
                    Discard Changes
                  </button>
                  <button onClick={resetColors} className={Styles.resetBtn}>
                    Reset to Default Colors
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Settings;