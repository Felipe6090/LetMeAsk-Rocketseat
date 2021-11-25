import { useAuth } from "../hooks/useAuth";
import { FormEvent, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { database, DatabaseConfig } from "../services/firebase";

import illustrationIMG from "../assets/images/illustration.svg";
import logoIMG from "../assets/images/logo.svg";
import { Button } from "../components/button";

import "../styles/auth.scss";

export function NewRoom() {
  const { user } = useAuth()
  const history = useHistory()
  const [ newRoom, setNewRoom ] = useState('')

  async function handleNewRoom(event: FormEvent) {
      event.preventDefault()

      if(newRoom.trim() === "") {
        return
      }

      const roomRef = DatabaseConfig.ref(database, "rooms")

      const firebaseRoom = await DatabaseConfig.push(roomRef, {
        title: newRoom,
        authorId: user?.id,
      })

      history.push(`/rooms/${firebaseRoom.key}`)
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
          <h2>Criar uma nova sala</h2>
          <form onSubmit={handleNewRoom}>
            <input 
            type="text" 
            placeholder="Nome da Sala" 
            onChange={ event => setNewRoom(event.target.value)}
            value={newRoom} 
            />
            <Button type="submit">Criar Sala</Button>
          </form>
          <p>
            Quer entrar em uma sala já existente?<Link to="/">Clique Aqui</Link>
          </p>
        </div>
      </main>
    </div>
  );
}
