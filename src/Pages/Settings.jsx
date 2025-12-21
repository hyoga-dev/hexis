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
    signInWithPopup,
    unlink,
    GoogleAuthProvider,
    deleteUser,
    sendPasswordResetEmail,
    sendEmailVerification,
    getAdditionalUserInfo
} from "firebase/auth";

import GoogleIcon from "../assets/Images/icon-google.png";
import MailIcon from "../assets/Images/mail.png";

const Settings = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("account");
    const navigate = useNavigate();

    // 1. Get isGuest
    const { currentUser, isGuest } = useAuth();
    const auth = getAuth();

    const [displayName, setDisplayName] = useState("");
    const [photoURL, setPhotoURL] = useState("");
    const [email, setEmail] = useState("");
    const [isAvatarOpen, setIsAvatarOpen] = useState(false);

    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });

    useEffect(() => {
        if (currentUser) {
            setDisplayName(currentUser.displayName || "");
            setPhotoURL(currentUser.photoURL || "");
            setEmail(currentUser.email || "");
        }
    }, [currentUser]);

    const isGoogleLinked = currentUser?.providerData.some(p => p.providerId === "google.com");
    const isEmailLinked = currentUser?.providerData.some(p => p.providerId === "password");

    // --- UPDATED: RANDOM AVATAR GENERATOR ---
    const handleGenerateAvatar = () => {
        const randomSeed = Math.random().toString(36).substring(7) + Date.now();
        const newAvatar = `https://api.dicebear.com/9.x/avataaars/svg?seed=${randomSeed}&backgroundColor=b6e3f4,c0aede,d1d4f9`;
        setPhotoURL(newAvatar);
    };

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
            if (typeof currentUser.reload === 'function') {
                await currentUser.reload();
            }
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

    const handlePasswordReset = async () => {
        if (!email) return;
        try {
            await sendPasswordResetEmail(auth, email);
            alert(`Password reset email sent to ${email}`);
        } catch (error) {
            alert("Error sending reset email: " + error.message);
        }
    };

    const handleVerifyEmail = async () => {
        try {
            await sendEmailVerification(currentUser);
            alert(`Verification email sent to ${email}`);
        } catch (error) {
            alert("Error: " + error.message);
        }
    };

    const handleGoogleLink = async () => {
        setIsLoading(true);
        setMessage({ type: "", text: "" });
        const provider = new GoogleAuthProvider();
        const auth = getAuth(); // Ensure you have the auth instance

        try {
            if (!currentUser) {
                // 1. Attempt Sign In
                const result = await signInWithPopup(auth, provider);

                // 2. Check if this is a "New" user or "Existing" user
                const { isNewUser } = getAdditionalUserInfo(result);

                if (!isNewUser) {
                    // CASE: Account already exists -> STOP and Sign Out
                    await auth.signOut();
                    setMessage({ type: "error", text: "That account already exists! Cannot link guest data." });
                } else {
                    // CASE: Brand new account (Unused) -> SAFE TO MERGE

                    // 1. Grab the guest data (before it gets ignored)
                    const guestHabits = JSON.parse(localStorage.getItem("guest_habits")) || [];

                    if (guestHabits.length > 0) {
                        const batch = writeBatch(db);
                        const habitsRef = collection(db, "users", result.user.uid, "habits");

                        guestHabits.forEach(habit => {
                            const newDocRef = doc(habitsRef);
                            // Remove old ID, assign new Firestore ID
                            const { id, ...habitData } = habit;
                            batch.set(newDocRef, { ...habitData, id: newDocRef.id });
                        });

                        await batch.commit();

                        // Optional: Clean up local storage so it doesn't linger
                        localStorage.removeItem("guest_habits");
                        localStorage.removeItem("guest_streak");
                        localStorage.removeItem("guest_history");
                    }

                    setMessage({ type: "success", text: "New account created! Your habits have been saved." });
                }
            }
        } catch (error) {
            console.error("Google Auth Error:", error);
            // Handle specific error where account already exists with different credential
            if (error.code === 'auth/credential-already-in-use') {
                setMessage({ type: "error", text: "This Google account is already used by another user." });
            } else {
                setMessage({ type: "error", text: error.message });
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (!window.confirm("ARE YOU SURE? This will permanently delete your account.")) return;

        try {
            await deleteUser(currentUser);
            localStorage.clear();
            alert("Account deleted.");
            navigate("/login");
        } catch (error) {
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
                    <button className={`${Styles.navItem} ${activeTab === 'account' ? Styles.active : ''}`} onClick={() => setActiveTab('account')}>Account</button>
                    <button className={`${Styles.navItem} ${activeTab === 'appearance' ? Styles.active : ''}`} onClick={() => setActiveTab('appearance')}>Appearance</button>
                </div>

                <div className={Styles.contentArea}>

                    {activeTab === 'account' && (
                        <div className={Styles.section}>

                            {/* --- 3. GUEST MODE VIEW --- */}
                            {isGuest ? (
                                <div style={{ textAlign: 'center', padding: '20px' }}>
                                    <h3>Guest Mode</h3>
                                    <p className={Styles.description} style={{ marginBottom: '30px' }}>
                                        You are currently using Hexis as a Guest. Your data is stored locally on this device.
                                        Connect a Google Account to sync your habits and unlock all features.
                                    </p>

                                    <div className={Styles.settingGroup}>
                                        <h4>Sync & Upgrade</h4>
                                        <div className={Styles.connectRow} style={{ justifyContent: 'center', marginTop: '15px' }}>
                                            <button
                                                className={Styles.linkBtn}
                                                onClick={handleGoogleLink}
                                                disabled={isLoading}
                                                style={{ width: '100%', maxWidth: '300px', padding: '12px' }}
                                            >
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                                                    <img src={GoogleIcon} width="20" alt="Google" />
                                                    <span>Connect Google Account</span>
                                                </div>
                                            </button>
                                        </div>
                                        {message.text && (
                                            <p className={message.type === 'error' ? Styles.errorMsg : Styles.successMsg}>
                                                {message.text}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                /* --- AUTHENTICATED USER VIEW --- */
                                <>
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
                                            <h3 style={{ margin: 0 }}>{displayName || "User"}</h3>
                                            <p className={Styles.description}>{currentUser?.email}</p>
                                        </div>
                                    </div>

                                    {isAvatarOpen && (
                                        <div className={Styles.settingGroup} style={{ marginBottom: '10px' }}>
                                            <label className={Styles.inputLabel}>Avatar Image</label>
                                            <div style={{ display: 'flex', gap: '10px' }}>
                                                <input
                                                    className={Styles.textInput}
                                                    value={photoURL}
                                                    onChange={(e) => setPhotoURL(e.target.value)}
                                                    placeholder="https://example.com/my-photo.jpg"
                                                    style={{ flex: 1 }}
                                                />
                                                <button
                                                    onClick={handleGenerateAvatar}
                                                    className={Styles.linkBtn}
                                                    style={{ fontSize: '1.2rem', padding: '0 15px' }}
                                                    title="Generate Random Avatar"
                                                >
                                                    🎲
                                                </button>
                                            </div>
                                            <span className={Styles.hintText}>Enter a URL or click 🎲 to generate a random new look!</span>
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
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <label className={Styles.inputLabel}>Email Address</label>
                                                {currentUser?.emailVerified ? (
                                                    <span style={{ color: '#4caf50', fontSize: '0.8rem', fontWeight: 'bold' }}>✓ Verified</span>
                                                ) : (
                                                    <span
                                                        onClick={handleVerifyEmail}
                                                        style={{ color: 'orange', fontSize: '0.8rem', fontWeight: 'bold', cursor: 'pointer', textDecoration: 'underline' }}
                                                    >
                                                        ⚠ Verify Email
                                                    </span>
                                                )}
                                            </div>
                                            <input
                                                type="email"
                                                className={Styles.textInput}
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                disabled={currentUser?.emailVerified}
                                                style={currentUser?.emailVerified ? { opacity: 0.6, cursor: 'not-allowed' } : {}}
                                            />
                                        </div>

                                        {message.text && (
                                            <p className={message.type === 'error' ? Styles.errorMsg : Styles.successMsg}>
                                                {message.text}
                                            </p>
                                        )}

                                        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                            <button
                                                onClick={handleUpdateProfile}
                                                className={Styles.applyBtn}
                                                disabled={isLoading}
                                            >
                                                {isLoading ? "Saving..." : "Save Changes"}
                                            </button>

                                            {isEmailLinked && (
                                                <button
                                                    onClick={handlePasswordReset}
                                                    className={Styles.discardBtn}
                                                >
                                                    Reset Password
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {/* Connected Accounts */}
                                    <div className={Styles.settingGroup}>
                                        <h4>Connected Accounts</h4>

                                        <div className={Styles.connectRow}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
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

                                        <div className={Styles.connectRow}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
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
                                            Permanently delete your account and all data.
                                        </p>
                                        <button onClick={handleDeleteAccount} className={Styles.deleteAccountBtn}>
                                            Delete Account
                                        </button>
                                    </div>
                                </>
                            )}

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