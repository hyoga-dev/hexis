import Navbar from "./Components/Navbar";
import Styles from "../assets/Styles/Roadmap.module.css";
import Icon from "../assets/Images/goal.png";

const Roadmap = () => {
    return (
        <div className={Styles.outerContainer}>
            <Navbar />
            <div className={Styles.container}>

                <div className={Styles.card}>
                    <h2>Alamak lorem ipsum dolor sit ammet met met jamet.</h2>
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    </p>
                    <div className={Styles.star}>
                        <img src={Icon} alt="" />
                        <img src={Icon} alt="" />
                    </div>
                </div>

            </div> 
        </div>
    )
}

export default Roadmap;