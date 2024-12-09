import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./QuizPreview.css";

const QuizPreview = () => {
  const { qid } = useParams();
  const navigate = useNavigate();
  const [quizData, setQuizData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<any>({});
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUserId = async () => {
      const response = await fetch("http://localhost:4000/api/user");
      const data = await response.json();
      setUserId(data.userId);
    };

    fetchUserId();
  }, []);

  useEffect(() => {
    const fetchQuizPreview = async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/quizzes/${qid}/preview`);
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
  }, [qid]);

  const handleAnswerChange = (questionId: string, value: any) => {
    setAnswers({ ...answers, [questionId]: value });
  };

  const handleMultiSelectChange = (questionId: string, value: string) => {
    const currentAnswers = answers[questionId] || [];
    const updatedAnswers = currentAnswers.includes(value)
      ? currentAnswers.filter((ans: string) => ans !== value)
      : [...currentAnswers, value];
    setAnswers({ ...answers, [questionId]: updatedAnswers });
  };

  const handleNextQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
  };

  const handleSubmit = async () => {
    if (!userId) {
      console.error("User ID is not available");
      return;
    }
  
    try {
      const formattedAnswers = Object.keys(answers).map((questionId) => ({
        questionId,
        answer: answers[questionId],
      }));
  
      const response = await fetch(`http://localhost:4000/api/quizzes/${qid}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, answers: formattedAnswers }),
      });
  
      const result = await response.json();
      console.log("Submit response:", result);
      if (response.ok) {
        setSubmitMessage(`Your score: ${result.score}`);
      } else {
        setSubmitMessage(`Error: ${result.error || "Unknown error occurred"}`);
      }
    } catch (err) {
      console.error("Error submitting quiz:", err);
      setSubmitMessage("Error submitting quiz.");
    }
  };  

  if (loading) return <div>Loading...</div>;
  if (!quizData) return <div>Quiz not found!</div>;

  const currentQuestion = quizData.questions[currentQuestionIndex];

  return (
    <div className="container">
      <h1 className="mb-4">Preview: {quizData.title}</h1>
      <p className="text-danger">
        <b>⚠ This is a preview of the published version of the quiz.</b>
      </p>

      <div className="quiz-instructions">
        <p><b>Quiz Instructions</b></p>
      </div>

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
                    checked={answers[currentQuestion.id] === "true"} // 根据状态确定是否选中
                    onChange={() => handleAnswerChange(currentQuestion.id, "true")}
                />
                True
                </label>
                <label>
                <input
                    type="radio"
                    name={`question-${currentQuestion.id}`}
                    value="false"
                    checked={answers[currentQuestion.id] === "false"} // 根据状态确定是否选中
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
                        type="checkbox" // 使用 checkbox 实现多选
                        value={option}
                        checked={answers[currentQuestion.id]?.includes(option) || false} // 判断选项是否已被选中
                        onChange={() => handleMultiSelectChange(currentQuestion.id, option)}
                    />
                    {option}
                    </label>
                </div>
                ))}
            </div>
            )}

          {currentQuestion.type === "FILL_BLANK" && (
            <div>
                <input
                type="text"
                placeholder="Type your answer here"
                value={answers[currentQuestion.id] || ""} // 确保显示正确的答案
                onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                name={`question-${currentQuestion.id}`}
            />
            </div>
          )}
        </div>
      )}

      {currentQuestionIndex < quizData.questions.length - 1 ? (
        <button className="btn btn-primary" onClick={handleNextQuestion}>
          Next
        </button>
      ) : (
        <button className="btn btn-success" onClick={handleSubmit}>
          Submit Quiz
        </button>
      )}

        <button
        style={{
            border: "1px solid #ccc",
            backgroundColor: "white",
            color: "#555",
            padding: "8px 16px",
            borderRadius: "4px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginTop: "10px",
        }}
        onClick={() => navigate(`Quizzes/${qid}/editor`)}
        >
        <span style={{ marginRight: "6px" }}></span>Keep editing this quiz
        </button>


      {/* 显示提交后的分数信息 */}
      {submitMessage && <div className="alert alert-info mt-3">{submitMessage}</div>}

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
  );
};

export default QuizPreview;