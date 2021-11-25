import "../styles/question.scss";
import { ReactNode } from "react";

type QuestionsProps = {
  content: string;
  author: {
    name: string;
    avatar: string;
  };
  children?: ReactNode;
  isAnswered?: boolean;
  isHighlighted?: boolean;
};

export function Question({
  content,
  author,
  children,
  isAnswered = false,
  isHighlighted = false,
}: QuestionsProps) {
  return (
    <div
      className={`question ${isAnswered ? "answered" : ""} ${
        isHighlighted && !isAnswered ? "highlighted" : ""
      }`}
    >
      <p>{content}</p>
      <footer>
        <div className="userInfo">
          <img src={author.avatar} alt="Auhtor Name" />
          <span>{author.name}</span>
        </div>
        <div>{children}</div>
      </footer>
    </div>
  );
}
