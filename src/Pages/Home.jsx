import React, { useState } from "react";

/**
 * Basic login page component
 * Save this file as: /D:/Document/Code/hexis/src/Pages/Home.jsx
 */
export default function Home() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const validate = () => {
        setError("");
        if (!email) return setError("Email is required");
        // simple email check
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) return setError("Enter a valid email");
        if (!password) return setError("Password is required");
        if (password.length < 4) return setError("Password must be at least 4 characters");
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccess("");
        if (validate() !== true) return;
        setLoading(true);
        setError("");

        // Simulate API call
        await new Promise((r) => setTimeout(r, 800));

        // Mock authentication: use credentials user@example.com / password
        if (email === "user@example.com" && password === "password") {
            const fakeToken = "fake-jwt-token";
            localStorage.setItem("authToken", fakeToken);
            setSuccess("Login successful");
            setError("");
            // optionally redirect or update app state here
        } else {
            setError("Invalid email or password");
            setSuccess("");
        }

        setLoading(false);
    };

    return (
        <div style={styles.container}>
            <form onSubmit={handleSubmit} style={styles.form}>
                <h2 style={{ margin: 0, marginBottom: 12 }}>Sign in</h2>

                {error && <div style={styles.error}>{error}</div>}
                {success && <div style={styles.success}>{success}</div>}

                <label style={styles.label}>
                    Email
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={styles.input}
                        placeholder="user@example.com"
                        disabled={loading}
                        autoComplete="username"
                    />
                </label>

                <label style={styles.label}>
                    Password
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={styles.input}
                        placeholder="password"
                        disabled={loading}
                        autoComplete="current-password"
                    />
                </label>

                <button type="submit" style={styles.button} disabled={loading}>
                    {loading ? "Signing in..." : "Sign in"}
                </button>

                <div style={{ marginTop: 10, fontSize: 13, color: "#666" }}>
                    Test credentials: user@example.com / password
                </div>
            </form>
        </div>
    );
}

const styles = {
    container: {
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f6f8fa",
        padding: 20,
    },
    form: {
        width: 360,
        padding: 24,
        borderRadius: 8,
        background: "#fff",
        boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
        display: "flex",
        flexDirection: "column",
    },
    label: {
        display: "flex",
        flexDirection: "column",
        fontSize: 14,
        marginBottom: 12,
        color: "#333",
    },
    input: {
        marginTop: 6,
        padding: "10px 12px",
        fontSize: 14,
        borderRadius: 6,
        border: "1px solid #dfe3e8",
        outline: "none",
    },
    button: {
        marginTop: 8,
        padding: "10px 12px",
        fontSize: 15,
        borderRadius: 6,
        border: "none",
        background: "#0366d6",
        color: "#fff",
        cursor: "pointer",
    },
    error: {
        marginBottom: 10,
        padding: "8px 10px",
        background: "#ffeef0",
        color: "#86181d",
        borderRadius: 6,
    },
    success: {
        marginBottom: 10,
        padding: "8px 10px",
        background: "#e6ffed",
        color: "#165a25",
        borderRadius: 6,
    },
};