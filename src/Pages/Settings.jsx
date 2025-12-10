import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/Styles/global.css";
import Styles from "../assets/Styles/settings.module.css";
import NavbarStyles from "../assets/Styles/navbar.module.css";
import BurgerIcon from "../assets/Icon/SideBar/BurgerIcon";
import SideBar from "./Components/SideBar";
import SettingApperance from "./Components/SettingApperance";
import { useAuth } from "../data/AuthProvider"; 
import { 
    getAuth, 
    updateProfile, 
    updateEmail, 
    linkWithPopup, 
    unlink, 
    GoogleAuthProvider, 
    deleteUser 
} from "firebase/auth";

// --- IMPORT LOCAL ICONS ---
import GoogleIcon from "../assets/Images/icon-google.png";
import MailIcon from "../assets/Images/mail.png";

const Settings = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("account");
  const navigate = useNavigate();
  
  // Auth Data
  const { currentUser } = useAuth();
  const auth = getAuth();
  
  // Form States
  const [displayName, setDisplayName] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [email, setEmail] = useState("");
  const [isAvatarOpen, setIsAvatarOpen] = useState(false); 
  
  // Status States
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Load user data on mount
  useEffect(() => {
    if (currentUser) {
        setDisplayName(currentUser.displayName || "");
        setPhotoURL(currentUser.photoURL || "");
        setEmail(currentUser.email || "");
    }
  }, [currentUser]);

  // --- CHECK LINKED PROVIDERS ---
  const isGoogleLinked = currentUser?.providerData.some(
      (p) => p.providerId === "google.com"
  );
  
  // Checks if user has a password set (EmailAuthProvider)
  const isEmailLinked = currentUser?.providerData.some(
      (p) => p.providerId === "password"
  );

  // --- HANDLERS ---
  const handleUpdateProfile = async () => {
    setIsLoading(true);
    setMessage({ type: "", text: "" });
    try {
        await updateProfile(currentUser, {
            displayName: displayName,
            photoURL: photoURL
        });
        
        if (email !== currentUser.email) {
            await updateEmail(currentUser, email);
        }

        setMessage({ type: "success", text: "Profile updated successfully!" });
    } catch (error) {
        console.error("Update Error:", error);
        if (error.code === 'auth/requires-recent-login') {
            setMessage({ type: "error", text: "Please log out and log back in to change sensitive info." });
        } else {
            setMessage({ type: "error", text: "Failed to update profile." });
        }
    } finally {
        setIsLoading(false);
        setIsAvatarOpen(false);
    }
  };

  const handleGoogleLink = async () => {
      setIsLoading(true);
      setMessage({ type: "", text: "" });
      const provider = new GoogleAuthProvider();

      try {
          if (isGoogleLinked) {
              await unlink(currentUser, "google.com");
              setMessage({ type: "success", text: "Google account disconnected." });
          } else {
              await linkWithPopup(currentUser, provider);
              setMessage({ type: "success", text: "Google account connected!" });
          }
      } catch (error) {
          console.error("Link Error:", error);
          setMessage({ type: "error", text: error.message });
      } finally {
          setIsLoading(false);
      }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("ARE YOU SURE? This will permanently delete your account and all local data. This cannot be undone.")) {
        return;
    }

    try {
        await deleteUser(currentUser);
        localStorage.removeItem("habitDetail");
        localStorage.removeItem("userStreak");
        localStorage.removeItem("hexis_community_v2");
        localStorage.removeItem("myCustomRoadmaps");
        alert("Account deleted.");
        navigate("/login");
    } catch (error) {
        console.error("Delete Error:", error);
        if (error.code === 'auth/requires-recent-login') {
            alert("Security Check: Please log out and log back in again to delete your account.");
        } else {
            alert("Failed to delete account. " + error.message);
        }
    }
  };

  return (
    <div className={Styles.wrapper}>

      <SideBar isOpen={isOpen} onClose={() => setIsOpen(false)} />
      <div className={NavbarStyles.header}>
        <button onClick={() => setIsOpen(true)} className={NavbarStyles.menuBtn}>
          <BurgerIcon color="var(--font-color)" width="2rem" height="2rem" />
        </button>
      </div>

      <div className={Styles.container}>
        <h2>Settings</h2>

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

        <div className={Styles.contentArea}>
          
          {activeTab === 'account' && (
            <div className={Styles.section}>
              
              {/* Profile Header */}
              <div className={Styles.profileHeader}>
                 <div className={Styles.avatarWrapper}>
                     {photoURL ? (
                         <img src={photoURL} alt="Profile" className={Styles.avatarImage} />
                     ) : (
                         <div className={Styles.avatarCircle}>
                            {displayName ? displayName.charAt(0).toUpperCase() : (currentUser?.email?.charAt(0).toUpperCase() || "U")}
                         </div>
                     )}
                     <button 
                        className={Styles.editAvatarBtn}
                        onClick={() => setIsAvatarOpen(!isAvatarOpen)}
                     >
                        📷
                     </button>
                 </div>
                 
                 <div>
                    <h3 style={{margin: 0}}>{displayName || "User"}</h3>
                    <p className={Styles.description}>{currentUser?.email}</p>
                 </div>
              </div>

              {isAvatarOpen && (
                  <div className={Styles.settingGroup} style={{marginBottom: '10px'}}>
                      <label className={Styles.inputLabel}>New Avatar URL</label>
                      <input 
                          className={Styles.textInput} 
                          value={photoURL} 
                          onChange={(e) => setPhotoURL(e.target.value)}
                          placeholder="https://example.com/my-photo.jpg" 
                      />
                  </div>
              )}

              <div className={Styles.settingGroup}>
                  <h4>Profile Details</h4>
                  
                  <div className={Styles.inputGroup}>
                      <label className={Styles.inputLabel}>Display Name</label>
                      <input 
                        type="text" 
                        className={Styles.textInput} 
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        placeholder="Enter your name"
                      />
                  </div>

                  <div className={Styles.inputGroup}>
                      <label className={Styles.inputLabel}>Email Address</label>
                      <input 
                        type="email" 
                        className={Styles.textInput} 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                  </div>

                  {message.text && (
                      <p className={message.type === 'error' ? Styles.errorMsg : Styles.successMsg}>
                          {message.text}
                      </p>
                  )}

                  <button 
                    onClick={handleUpdateProfile} 
                    className={Styles.applyBtn}
                    disabled={isLoading}
                  >
                    {isLoading ? "Saving..." : "Save Changes"}
                  </button>
              </div>

              {/* --- UPDATED: CONNECTED ACCOUNTS --- */}
              <div className={Styles.settingGroup}>
                  <h4>Connected Accounts</h4>
                  
                  {/* 1. Email / Password Row */}
                  <div className={Styles.connectRow}>
                      <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
                          <img src={MailIcon} width="20" alt="Email" />
                          <span>Email Account</span>
                      </div>
                      <span className={Styles.statusBadge} style={{
                          backgroundColor: isEmailLinked ? 'rgba(76, 175, 80, 0.1)' : 'rgba(0,0,0,0.05)',
                          color: isEmailLinked ? '#4caf50' : 'gray'
                      }}>
                          {isEmailLinked ? "✓ Active" : "Not Set"}
                      </span>
                  </div>

                  {/* 2. Google Row */}
                  <div className={Styles.connectRow}>
                      <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
                          <img src={GoogleIcon} width="20" alt="Google" />
                          <span>Google</span>
                      </div>
                      <button 
                        className={isGoogleLinked ? Styles.unlinkBtn : Styles.linkBtn}
                        onClick={handleGoogleLink}
                        disabled={isLoading}
                      >
                          {isGoogleLinked ? "Disconnect" : "Connect"}
                      </button>
                  </div>
              </div>

              <div className={`${Styles.settingGroup} ${Styles.dangerZone}`}>
                  <h4 className={Styles.dangerTitle}>Danger Zone</h4>
                  <p className={Styles.description}>
                      Permanently delete your account and all local habit data.
                  </p>
                  <button onClick={handleDeleteAccount} className={Styles.deleteAccountBtn}>
                      Delete Account & Data
                  </button>
              </div>

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