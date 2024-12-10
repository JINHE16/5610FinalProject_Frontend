import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import "./QuizPreview.css";

const QuizPreview = () => {
  const { qid } = useParams();
  const navigate = useNavigate();
  const [quizData, setQuizData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<any>({});
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const [showLastAttemptPage, setShowLastAttemptPage] = useState(true);
  const [results, setResults] = useState<any>({});

  const { currentUser } = useSelector((state: any) => state.accountReducer);

  useEffect(() => {
    const fetchQuizPreview = async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/quizAttempts/${qid}/preview`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: currentUser?._id }),
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setQuizData(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching quiz preview:", error);
        setLoading(false);
      }
    };

    fetchQuizPreview();
  }, [qid, currentUser]);

  const handleAnswerChange = (questionId: string, value: any) => {
    const parsedValue = value === "true" ? true : value === "false" ? false : value;
    setAnswers({ ...answers, [questionId]: parsedValue });
  };

  const handleStartPreview = () => {
    setShowLastAttemptPage(false);
  };

  const handleSubmit = async () => {
    if (!currentUser?._id) {
      console.error("User ID is not available");
      return;
    }

    try {
      const formattedAnswers = Object.keys(answers).map((questionId) => ({
        questionId,
        answer: answers[questionId],
      }));

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

      setSubmitMessage(`Your score: ${result.score}`);
      setResults(resultsById);
    } catch (err: unknown) {
      console.error("Error submitting quiz:", err);
      setSubmitMessage("An unknown error occurred while submitting the quiz.");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!quizData) return <div>Quiz not found!</div>;

  if (showLastAttemptPage) {
    return (
      <div className="container">
        <h1 className="mb-4">Quiz Preview</h1>
        {quizData.lastAttempt && (
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
            <p>
              <strong>Date:</strong> {new Date(quizData.lastAttempt.attemptDate).toLocaleString()}
            </p>
            <button
              className="btn btn-primary"
              onClick={handleStartPreview}
              style={{ marginTop: "10px" }}
            >
              Start Preview
            </button>
          </div>
        )}
      </div>
    );
  }

  const currentQuestion = quizData.questions[currentQuestionIndex];

  return (
    <div className="container">
      {results && Object.keys(results).length > 0 ? (
        <div>
          <h2 style={{ textAlign: "center", marginTop: "20px" }}>{submitMessage}</h2>
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
        <>
          <h1 className="mb-4">Preview: {quizData.title}</h1>
          <p className="text-danger">
            <b>⚠ This is a preview of the published version of the quiz.</b>
          </p>

          {currentQuestion && (
            <div className="question-container">
              <h4>
                Question {currentQuestionIndex + 1}: {currentQuestion.title} ({currentQuestion.points} pts)
              </h4>

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
          )}

          {currentQuestionIndex < quizData.questions.length - 1 ? (
            <button className="btn btn-primary" onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}>
              Next
            </button>
          ) : (
            <button className="btn btn-success" onClick={handleSubmit}>
              Submit Quiz
            </button>
          )}

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
        </>
      )}
    </div>
  );
};

export default QuizPreview;
