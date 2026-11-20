import { useState, useEffect } from "react";
import questions from "./questions.json";

function shuffleArray(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

export default function App() {
  const [index, setIndex] = useState(
    Number(localStorage.getItem("index")) || 0
  );

  const [showAnswer, setShowAnswer] = useState(false);

  const [understood, setUnderstood] = useState(
    Number(localStorage.getItem("understood")) || 0
  );

  const [notUnderstood, setNotUnderstood] = useState(
    Number(localStorage.getItem("notUnderstood")) || 0
  );

  const [isFinished, setIsFinished] = useState(false);

  const [wrongQuestions, setWrongQuestions] = useState([]);
  const [reviewMode, setReviewMode] = useState(false);

  const [shuffledQuestions, setShuffledQuestions] =
    useState(() => shuffleArray(questions));

  useEffect(() => {
    localStorage.setItem("index", index);
  }, [index]);

  useEffect(() => {
    localStorage.setItem("understood", understood);
  }, [understood]);

  useEffect(() => {
    localStorage.setItem(
      "notUnderstood",
      notUnderstood
    );
  }, [notUnderstood]);

  const activeQuestions = reviewMode
    ? wrongQuestions
    : shuffledQuestions;

  const currentQuestion =
    activeQuestions[index];

  const nextQuestion = () => {
    setShowAnswer(false);

    if (
      index <
      activeQuestions.length - 1
    ) {
      setIndex(index + 1);
    } else {
      setIsFinished(true);
    }
  };

  const handleUnderstood = () => {
    setUnderstood((prev) => prev + 1);
    nextQuestion();
  };

  const handleNotUnderstood = () => {
    setNotUnderstood((prev) => prev + 1);

    setWrongQuestions((prev) => [
      ...prev,
      currentQuestion,
    ]);

    nextQuestion();
  };

  const restart = () => {
    localStorage.removeItem("index");
    localStorage.removeItem("understood");
    localStorage.removeItem(
      "notUnderstood"
    );

    setIndex(0);
    setShowAnswer(false);
    setUnderstood(0);
    setNotUnderstood(0);
    setWrongQuestions([]);
    setReviewMode(false);
    setShuffledQuestions(
      shuffleArray(questions)
    );
    setIsFinished(false);
  };

  const accuracy =
    understood + notUnderstood === 0
      ? 0
      : Math.round(
          (understood /
            (understood +
              notUnderstood)) *
            100
        );

  if (isFinished) {
    return (
      <div
        style={{
          maxWidth: "700px",
          margin: "50px auto",
          padding: "20px",
          textAlign: "center",
        }}
      >
        <h1>🎉 学習終了！</h1>

        <p>✅ わかった: {understood}</p>

        <p>
          ❌ わからなかった:
          {notUnderstood}
        </p>

        <p>
          📈 正答率: {accuracy}%
        </p>

        <p>
          📚 復習問題数:
          {wrongQuestions.length}
        </p>

        {wrongQuestions.length >
          0 && (
          <button
            onClick={() => {
              setIndex(0);
              setShowAnswer(false);
              setReviewMode(true);
              setIsFinished(false);
            }}
            style={{
              margin: "10px",
              padding: "10px 20px",
              backgroundColor:
                "#ff9800",
              color: "white",
              border: "none",
              borderRadius:
                "5px",
              cursor: "pointer",
            }}
          >
            📚 間違えた問題だけ復習
          </button>
        )}

        <br />

        <button
          onClick={restart}
          style={{
            marginTop: "20px",
            padding:
              "10px 20px",
            backgroundColor:
              "#0078d4",
            color: "white",
            border: "none",
            borderRadius:
              "5px",
            cursor: "pointer",
          }}
        >
          🔄 最初からやり直す
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: "700px",
        margin: "50px auto",
        padding: "20px",
        textAlign: "center",
      }}
    >
      <h1>
        {reviewMode
          ? "📚 復習モード"
          : "AZ-900学習アプリ"}
      </h1>

      <button
        onClick={() => {
          setIndex(0);
          setShowAnswer(false);

          setShuffledQuestions(
            shuffleArray(questions)
          );
        }}
        style={{
          marginBottom: "15px",
          padding: "8px 16px",
        }}
      >
        🔀 シャッフル
      </button>

      <h3>
        問題 {index + 1} /
        {activeQuestions.length}
      </h3>

      <p>
        ✅ わかった:
        {understood}
      </p>

      <p>
        ❌ わからなかった:
        {notUnderstood}
      </p>

      <p>
        📈 正答率:
        {accuracy}%
      </p>

      <div
        onClick={() =>
          setShowAnswer(
            !showAnswer
          )
        }
        style={{
          border:
            "1px solid #ccc",
          borderRadius:
            "10px",
          padding: "30px",
          marginTop: "20px",
          cursor: "pointer",
          backgroundColor:
            showAnswer
              ? "#fff7e6"
              : "#f8f9fa",
        }}
      >
        <div
          style={{
            color:
              showAnswer
                ? "orange"
                : "#333",
            fontWeight:
              showAnswer
                ? "bold"
                : "normal",
            fontSize: "24px",
          }}
        >
          {showAnswer
            ? currentQuestion.answer
            : currentQuestion.question}
        </div>

        <div
          style={{
            marginTop: "15px",
            fontSize: "12px",
            color: "#888",
          }}
        >
          タップして切り替え
        </div>
      </div>

      {showAnswer && (
        <div
          style={{
            marginTop:
              "20px",
            display: "flex",
            justifyContent:
              "center",
            gap: "10px",
          }}
        >
          <button
            onClick={
              handleUnderstood
            }
            style={{
              padding:
                "10px 20px",
              backgroundColor:
                "#28a745",
              color: "white",
              border: "none",
              borderRadius:
                "5px",
              cursor: "pointer",
            }}
          >
            ✅ わかった
          </button>

          <button
            onClick={
              handleNotUnderstood
            }
            style={{
              padding:
                "10px 20px",
              backgroundColor:
                "#dc3545",
              color: "white",
              border: "none",
              borderRadius:
                "5px",
              cursor: "pointer",
            }}
          >
            ❌ わからなかった
          </button>
        </div>
      )}
    </div>
  );
}