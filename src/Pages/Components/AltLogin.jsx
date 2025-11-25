import Icon from "../../assets/Images/icon.png";

import Google from "../../assets/Images/icon-google.png";
import Facebook from "../../assets/Images/icon-facebook.png";
import Github from "../../assets/Images/icon-github.png";

export default function AltLogin() {
  return (
    <>
      <div className="alt-login">
        <img src={Google} className="icon" />
        <img src={Facebook} className="icon" />
        <img src={Github} className="icon" />
      </div>
    </>
  );
}
