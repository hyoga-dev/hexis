export default function PasswordInput() {
  const [visible, setVisible] = useState(false);
  return (
    <>
      <input
        type={visible ? "text" : "password"}
        placeholder="Password"
        className="input"
      />
      <button className="toggle-show" onClick={()=> setVisible(!visible)}>{visible ? "👁️" : "🫣"}</button>
    </>
  );
}