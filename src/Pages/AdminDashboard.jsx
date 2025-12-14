import { useState } from "react";
import { useAuth } from "../data/AuthProvider";
import { useRoadmapProvider } from "../data/roadmapData";
import { useNavigate } from "react-router-dom";
import "../assets/Styles/global.css";
import DeniedIcon from "../assets/Icon/EndIcon";
import Style from "../assets/Styles/adminDashboard.module.css";

const ADMIN_EMAILS = ["fadilcrown1@gmail.com"]; // <--- PUT YOUR EMAIL HERE

const AdminDashboard = () => {
    const { currentUser } = useAuth();
    const {
        roadmaps,
        addRoadmap,
        deleteRoadmap,
        categories,
        addNewCategory,
        deleteCategory
    } = useRoadmapProvider();
    const navigate = useNavigate();

    // Form State
    const [newCatInput, setNewCatInput] = useState("");

    // Access Control
    if (!currentUser || !ADMIN_EMAILS.includes(currentUser.email)) {
        return (
            <div className={Style.deniedContainer}>
                <h2 className={Style.deniedTitle}><DeniedIcon /> Access Denied</h2>
                <p className={Style.deniedText}>You do not have permission to view this page.</p>
                <button className={Style.homeButton} onClick={() => navigate("/")}>Go Home</button>
            </div>
        );
    }

    const handleAddCategory = async (e) => {
        e.preventDefault();
        await addNewCategory(newCatInput);
        setNewCatInput("");
        alert("Category Added!");
    };

    const handleDelete = async (id) => {
        if (window.confirm("MODERATION: Are you sure you want to delete this roadmap?")) {
            await deleteRoadmap(id);
        }
    };

    return (
        <div className={Style.wrapper}>
            <h1>Admin Dashboard</h1>
            <p className={Style.welcomeMessage}>Welcome, {currentUser.email}</p>

            <hr className={Style.divider} />

            {/* --- SECTION 1: CREATE OFFICIAL ROADMAP --- */}
            <div className={Style.section}>
                <h2 className={Style.sectionTitle}>Create Official Roadmap</h2>
                <p>Use the full-featured editor to create a new official roadmap template.</p>
                <button onClick={() => navigate('/createroadmapofficial')} className={Style.submitButton}>
                    + Create New Official Roadmap
                </button>
            </div>

            {/* --- SECTION 2: MODERATION --- */}
            <div className={Style.section}>
                <h2 className={Style.sectionTitle}>🛡️ Moderation Zone</h2>
                <p>Delete any roadmap (Official or Community).</p>

                <div className={Style.moderationList}>
                    {roadmaps.map(r => (
                        <div key={r.id} className={Style.roadmapItem}>
                            <div className={Style.roadmapInfo}>
                                <strong>{r.title}</strong>
                                <span className={`${Style.roadmapType} ${r.type === 'official' ? Style.roadmapTypeOfficial : Style.roadmapTypeCommunity}`}>
                                    ({r.type})
                                </span>
                                <div className={Style.roadmapAuthor}>by {r.author}</div>
                            </div>
                            <button
                                onClick={() => handleDelete(r.id)}
                                className={Style.deleteButton}
                            >
                                DELETE
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* --- NEW SECTION: MANAGE CATEGORIES --- */}
            <div className={Style.section}>
                <h2 className={Style.sectionTitle}>🏷️ Manage Categories</h2>
                <form onSubmit={handleAddCategory} className={Style.categoryForm}>
                    <input
                        value={newCatInput}
                        onChange={(e) => setNewCatInput(e.target.value)}
                        placeholder="New Category Name (e.g. Finance)"
                        className={`${Style.input} ${Style.categoryInput}`}
                        required
                    />
                    <button type="submit" className={Style.addCategoryButton}>
                        Add
                    </button>
                </form>

                <div className={Style.categoryList}>
                    {categories.map(cat => (
                        <div key={cat} className={Style.categoryPill}>
                            {cat}
                            <span
                                onClick={() => deleteCategory(cat)}
                                className={Style.deleteCategoryBtn}
                                title={`Delete ${cat}`}
                            >
                                ×
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;