import copyIMG from "../assets/images/copy.svg";
import "../styles/roomCode.scss";

type Code = {
  code: string;
};

export function RoomCode(props: Code) {
  
  function CopyCode() {
    navigator.clipboard.writeText(props.code);
  }

  return (
    <button className="roomCode" onClick={CopyCode}>
      <div>
        <img src={copyIMG} alt="copia e cola img" />
      </div>
      <span>Sala #{props.code}</span>
    </button>
  );
}
