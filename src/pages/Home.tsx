import { useHistory } from "react-router-dom";
import { FormEvent, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { database, DatabaseConfig } from "../services/firebase";

import illustrationIMG from "../assets/images/illustration.svg";
import logoIMG from "../assets/images/logo.svg";
import googleIconIMG from "../assets/images/google-icon.svg";

import { Button } from "../components/button";

import "../styles/auth.scss";

export function Home() {
  const history = useHistory();
  const { user, signInWithGoogle } = useAuth();
  const [roomCode, setRoomCode] = useState("");

  async function handleCreateRoom() {
    if (!user) {
      await signInWithGoogle();
    }
    history.push("/rooms/new");
  }

  async function handleJoinRoom(event: FormEvent) {
    event.preventDefault();

    if(roomCode.trim() === "") {
      return
    }

    const roomRef = await DatabaseConfig.get(DatabaseConfig.ref(database, `rooms/${roomCode}`))
    
    if(!roomRef.exists()) {
      alert("Room does not exists!");
      return;
    }

    if (roomRef.val().endedAt) {
      alert("Room alredy closed.");
      return;
    }

    history.push(`/rooms/${roomCode}`)
   }

  return (
    <div id="pageAuth">
      <aside>
        <img src={illustrationIMG} alt="Illustração tela inicial" />
        <strong>Toda pergunta tem uma resposta.</strong>
        <p>Aprenda e compartilhe conhecimento com outras pessoas</p>
      </aside>
      <main>
        <div className="mainContent">
          <img src={logoIMG} alt="Logo do aplicativo" />
          <button onClick={handleCreateRoom} className="createRoom">
            <img src={googleIconIMG} alt="logo da google" />
            crie sua sala com o google
          </button>
          <div className="separator">ou entre em uma sala</div>
          <form onSubmit={handleJoinRoom}>
            <input
              type="text"
              placeholder="Digite o código da sala"
              onChange={(event) => setRoomCode(event.target.value)}
              value={roomCode}
            />
            <Button type="submit">Entrar na sala</Button>
          </form>
        </div>
      </main>
    </div>
  );
}
