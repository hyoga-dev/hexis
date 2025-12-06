import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase.js';
import { useEffect } from 'react';
import LoadingIcon from "../assets/Icon/LoadingIcon.jsx"
import Styles from "../assets/Styles/loading.module.css"

const LoadingScreen = () => {
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                window.location.href = '/habit';
            } else {
                window.location.href = '/login';
            }
        });

        return () => unsubscribe();
    }, []);

    return (
        <div className={Styles["loading-screen"]}>
            <div className={Styles.spinner}></div>
            <LoadingIcon />
            <p>Loading...</p>
        </div>
    );
}

export default LoadingScreen;