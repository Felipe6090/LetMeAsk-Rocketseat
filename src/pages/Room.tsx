import logoIMG from "../assets/images/logo.svg";
import { Button } from "../components/button";
import { RoomCode } from "../components/RoomCode";
import { useParams } from "react-router-dom";
import { FormEvent, useState } from "react";

import "../styles/room.scss";
import { useAuth } from "../hooks/useAuth";
import { database, DatabaseConfig } from "../services/firebase";
import { Question } from "../components/Question";
import { useRoom } from "../hooks/useRoom";

type RoomParams = {
  id: string;
};

export function Room() {
  const { user } = useAuth();
  const params = useParams<RoomParams>();
  const RoomID = params.id;
  const [newQuestion, setNewQuestion] = useState("");
  const { title, questions } = useRoom(RoomID);

  async function handleQuestion(event: FormEvent) {
    event.preventDefault();

    if (newQuestion.trim() === "") {
      return;
    }

    if (!user) {
      throw new Error("You most be logged in");
    }

    const question = {
      content: newQuestion,
      author: {
        name: user.name,
        avatar: user.avatar,
      },
      isHighlighted: false,
      isAnswered: false,
    };

    const saveInDB = await DatabaseConfig.ref(
      database,
      `rooms/${RoomID}/questions`
    );

    DatabaseConfig.push(saveInDB, question);

    setNewQuestion("");
  }

  async function handleQuestionLikes(questionId: string, likeId: string | undefined) {
    if(likeId) {
      await DatabaseConfig.remove(
        DatabaseConfig.ref(
          database,
          `rooms/${RoomID}/questions/${questionId}/likes/${likeId}`
        )
      );
    } else {
      await DatabaseConfig.push(
        DatabaseConfig.ref(
          database,
          `rooms/${RoomID}/questions/${questionId}/likes`
        ),
        { authorId: user?.id }
      );
    }
}

  return (
    <div id="pageRoom">
      <header>
        <div className="content">
          <img src={logoIMG} alt="logo da aplicação" />
          <RoomCode code={RoomID} />
        </div>
      </header>

      <main>
        <div className="roomTitle">
          <h1>Sala {title}</h1>
          {questions.length > 0 && <span>{questions.length} perguntas</span>}
        </div>

        <form onSubmit={handleQuestion}>
          <textarea
            placeholder="O que você quer perguntar?"
            onChange={(event) => setNewQuestion(event.target.value)}
            value={newQuestion}
          />

          <div className="formFooter">
            {user ? (
              <div className="userInfo">
                <img src={user.avatar} alt={user.name} />
                <span>{user.name}</span>
              </div>
            ) : (
              <span>
                Para enviar uma pergunta, <button>faça seu login.</button>
              </span>
            )}
            <Button type="submit" disabled={!user}>
              Enviar Pergunta
            </Button>
          </div>
        </form>
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
                  className={`likeButton ${question.likeId ? 'liked' : ''}`}
                  type="button"
                  aria-label="marcar como gostei"
                  onClick={() => handleQuestionLikes(question.id, question.likeId)}
                >
                  <span>{question.likeCount > 0 && <span>{question.likeCount}</span>}</span>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M7 22H4C3.46957 22 2.96086 21.7893 2.58579 21.4142C2.21071 21.0391 2 20.5304 2 20V13C2 12.4696 2.21071 11.9609 2.58579 11.5858C2.96086 11.2107 3.46957 11 4 11H7M14 9V5C14 4.20435 13.6839 3.44129 13.1213 2.87868C12.5587 2.31607 11.7956 2 11 2L7 11V22H18.28C18.7623 22.0055 19.2304 21.8364 19.5979 21.524C19.9654 21.2116 20.2077 20.7769 20.28 20.3L21.66 11.3C21.7035 11.0134 21.6842 10.7207 21.6033 10.4423C21.5225 10.1638 21.3821 9.90629 21.1919 9.68751C21.0016 9.46873 20.7661 9.29393 20.5016 9.17522C20.2371 9.0565 19.9499 8.99672 19.66 9H14Z"
                      stroke="#737380"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </Question>
            );
          })}
        </div>
      </main>
    </div>
  );
}
