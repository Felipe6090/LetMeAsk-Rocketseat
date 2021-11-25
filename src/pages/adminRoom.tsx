import { database, DatabaseConfig } from "../services/firebase";
import { useHistory, useParams } from "react-router-dom";

import logoIMG from "../assets/images/logo.svg";
import deleteIMG from "../assets/images/delete.svg";
import checkIMG from "../assets/images/check.svg";
import answerIMG from "../assets/images/answer.svg";

import { Button } from "../components/button";
import { RoomCode } from "../components/RoomCode";

import "../styles/room.scss";
//import { useAuth } from "../hooks/useAuth";
import { Question } from "../components/Question";
import { useRoom } from "../hooks/useRoom";

type RoomParams = {
  id: string;
};

export function AdminRoom() {
  // const { user } = useAuth();
  const history = useHistory();
  const params = useParams<RoomParams>();
  const RoomID = params.id;
  const { title, questions } = useRoom(RoomID);

  async function handleDeleteQuestion(questionId: string) {
    if (window.confirm("Você tem certeza que deseja excluir está pergunta?")) {
      await DatabaseConfig.remove(
        DatabaseConfig.ref(database, `rooms/${RoomID}/questions/${questionId}`)
      );
    }
  }

  async function handleCheckQuestion(questionId: string) {
    if (window.confirm("Você tem certeza que deseja excluir está pergunta?")) {
      await DatabaseConfig.update(
        DatabaseConfig.ref(database, `rooms/${RoomID}/questions/${questionId}`),
        { isAnswered: true }
      );
    }
  }

  async function handleHighlightQuestion(questionId: string) {
    if (window.confirm("Você tem certeza que deseja excluir está pergunta?")) {
      await DatabaseConfig.update(
        DatabaseConfig.ref(database, `rooms/${RoomID}/questions/${questionId}`),
        { isHighlighted: true }
      );
    }
  }

  async function handleEndRoom() {
    await DatabaseConfig.update(
      DatabaseConfig.ref(database, `rooms/${RoomID}`),
      { endedAt: new Date() }
    );

    history.push('/')
  }

  return (
    <div id="pageRoom">
      <header>
        <div className="content">
          <img src={logoIMG} alt="logo da aplicação" />
          <div>
            <RoomCode code={RoomID} />
            <Button isOutlined onClick={ handleEndRoom }>Encerrar Sala</Button>
          </div>
        </div>
      </header>

      <main>
        <div className="roomTitle">
          <h1>Sala {title}</h1>
          {questions.length > 0 && <span>{questions.length} perguntas</span>}
        </div>

        <div className="questionList">
          {questions.map((question) => {
            return (
              <Question
                key={question.id}
                content={question.content}
                author={question.author}
                isAnswered={question.isAnswered}
                isHighlighted={question.isHighlighted}
              >
                <button
                  type="button"
                  onClick={() => handleCheckQuestion(question.id)}
                >
                  <img src={checkIMG} alt="Marcar como respondida" />
                </button>
                <button
                  type="button"
                  onClick={() => handleHighlightQuestion(question.id)}
                >
                  <img src={answerIMG} alt="Dar destaque" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteQuestion(question.id)}
                >
                  <img src={deleteIMG} alt="Remover pergunta" />
                </button>
              </Question>
            );
          })}
        </div>
      </main>
    </div>
  );
}
