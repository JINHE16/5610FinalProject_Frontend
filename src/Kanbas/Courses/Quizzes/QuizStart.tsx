import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setLatestScore } from "./reducer";
import { setQuizzes } from './reducer';

const QuizStart = () => {
  const dispatch = useDispatch();
  const { qid } = useParams();
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const [quizData, setQuizData] = useState<any>(null);
  const [answers, setAnswers] = useState<any>({});
  const [message, setMessage] = useState("");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [results, setResults] = useState<any>(null);
  const [showLastAttempt, setShowLastAttempt] = useState(true);

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/quizAttempts/${qid}/start`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: currentUser?._id }),
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(`Failed to start quiz: ${response.status}`);
        }

        const data = await response.json();
        console.log("Fetched quiz data:", data); 
        setQuizData(data);
      } catch (error) {
        console.error("Error starting quiz:", error);
        setMessage("Error loading quiz. Please try again.");
      }
    };

    fetchQuizData();
  }, [qid, currentUser]);

  const handleAnswerChange = (questionId: string, value: any) => {
    const parsedValue = value === "true" ? true : value === "false" ? false : value;
    setAnswers((prevAnswers: { [key: string]: any }) => ({
      ...prevAnswers,
      [questionId]: parsedValue,
    }));
  };

  const handleSubmit = async () => {
    if (!currentUser?._id) {
      console.error("User ID is not available");
      return;
    }

    try {
      const formattedAnswers = Object.keys(answers).map((questionId) => {
        const answer = answers[questionId];
        return {
          questionId,
          answer: typeof answer === "string" ? answer.trim().toLowerCase() : answer,
        };
      });

      const response = await fetch(`http://localhost:4000/api/quizAttempts/${qid}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUser._id, answers: formattedAnswers }),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`Failed to submit quiz: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      const resultsById = result.answers.reduce((acc: any, answer: any) => {
        acc[answer.questionId] = answer;
        return acc;
      }, {});

      dispatch(setLatestScore({ 
        quizId: qid,
        score: result.score,
        userId: currentUser._id  // 添加用户ID
      }));

      setMessage(`Your score: ${result.score}`);
      setResults(resultsById);
    } catch (err: unknown) {
      console.error("Error submitting quiz:", err);
      setMessage("An unknown error occurred while submitting the quiz.");
    }
  };

  if (!quizData) return <div>Loading...</div>;

  const currentQuestion = quizData.questions[currentQuestionIndex];

  return (
    <div>
      <h1>{quizData.title}</h1>

      {showLastAttempt && quizData.lastAttempt && (
        <div
          style={{
            padding: "10px",
            margin: "20px 0",
            border: "1px solid #ccc",
            borderRadius: "5px",
            backgroundColor: "#f9f9f9",
          }}
        >
          <h3>Last Attempt</h3>
          <p>
            <strong>Score:</strong> {quizData.lastAttempt.score}
          </p>
          <ul style={{ listStyleType: "none", paddingLeft: "0" }}>
          {quizData.questions.map((question: any, index: number) => {
  // 在 lastAttempt.answers 数组中查找对应问题的答案
  const lastAnswer = quizData.lastAttempt.answers.find(
    (ans: any) => ans.questionId === (question.id || question._id)
  );

  return (
    <li key={question.id || question._id} style={{ marginBottom: "10px" }}>
      <strong>Question {index + 1}:</strong> {question.title}
      <br />
      <strong>Your Answer:</strong>{" "}
      {lastAnswer 
        ? (typeof lastAnswer.answer === 'boolean' 
          ? lastAnswer.answer.toString() 
          : lastAnswer.answer)
        : "No Answer"}
    </li>
  );
})}
          </ul>
          <p>
            <strong>Date:</strong> {new Date(quizData.lastAttempt.attemptDate).toLocaleString()}
          </p>
        </div>
      )}

      {showLastAttempt ? (
        <button
          className="btn btn-primary"
          onClick={() => setShowLastAttempt(false)}
          style={{ marginBottom: "20px" }}
        >
          Start Quiz
        </button>
      ) : results ? (
        <div>
          <h2 style={{ textAlign: "center", marginTop: "20px" }}>{message}</h2>
          <table
            style={{
              borderCollapse: "collapse",
              margin: "20px auto",
              width: "80%",
              boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#f2f2f2", textAlign: "center" }}>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>Question #</th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>Your Answer</th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>Correct</th>
              </tr>
            </thead>
            <tbody>
              {quizData.questions.map((question: any, index: number) => {
                const isCorrect = results[question.id]?.isCorrect;
                return (
                  <tr
                    key={question.id}
                    style={{
                      backgroundColor: isCorrect ? "#e6ffed" : "#ffe6e6",
                      textAlign: "center",
                    }}
                  >
                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>{index + 1}</td>
                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                      {JSON.stringify(answers[question.id] || "No Answer")}
                    </td>
                    <td
                      style={{
                        padding: "10px",
                        border: "1px solid #ddd",
                        color: isCorrect ? "green" : "red",
                        fontWeight: "bold",
                      }}
                    >
                      {isCorrect ? "✅" : "❌"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div>
          <div key={currentQuestion.id}>
            <h3>
              {currentQuestionIndex + 1}. {currentQuestion.title}
            </h3>

            {currentQuestion.type === "TRUE_FALSE" && (
              <div>
                <label>
                  <input
                    type="radio"
                    name={`question-${currentQuestion.id}`}
                    value="true"
                    checked={answers[currentQuestion.id] === true}
                    onChange={() => handleAnswerChange(currentQuestion.id, "true")}
                  />
                  True
                </label>
                <label>
                  <input
                    type="radio"
                    name={`question-${currentQuestion.id}`}
                    value="false"
                    checked={answers[currentQuestion.id] === false}
                    onChange={() => handleAnswerChange(currentQuestion.id, "false")}
                  />
                  False
                </label>
              </div>
            )}

            {currentQuestion.type === "MULTIPLE_CHOICE" && (
              <div>
                {currentQuestion.options.map((option: string, index: number) => (
                  <div key={index}>
                    <label>
                      <input
                        type="radio"
                        name={`question-${currentQuestion.id}`}
                        value={option}
                        checked={answers[currentQuestion.id] === option}
                        onChange={() => handleAnswerChange(currentQuestion.id, option)}
                      />
                      {option}
                    </label>
                  </div>
                ))}
              </div>
            )}

            {currentQuestion.type === "FILL_BLANK" && (
              <input
                type="text"
                value={answers[currentQuestion.id] || ""}
                onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                placeholder="Type your answer"
              />
            )}
          </div>

          <div style={{ marginTop: "20px" }}>
            <button
              className="btn btn-secondary"
              disabled={currentQuestionIndex === 0}
              onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
            >
              Previous
            </button>

            {currentQuestionIndex < quizData.questions.length - 1 ? (
              <button
                className="btn btn-primary"
                style={{ marginLeft: "10px" }}
                onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
              >
                Next
              </button>
            ) : (
              <button
                className="btn btn-success"
                style={{ marginLeft: "10px" }}
                onClick={handleSubmit}
              >
                Submit Quiz
              </button>
            )}
          </div>

          <hr />
          <h4>Questions</h4>
          <ul>
            {quizData.questions.map((q: any, index: number) => (
              <li key={q.id}>
                <button
                  style={{
                    border: "none",
                    background: "none",
                    color: "blue",
                    cursor: "pointer",
                    textDecoration: "underline",
                  }}
                  onClick={() => setCurrentQuestionIndex(index)}
                >
                  Question {index + 1}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default QuizStart;
