import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const QuizTaking = () => {
  const { qid } = useParams(); // 获取 URL 中的 quizId 参数
  const [quizData, setQuizData] = useState<any>(null); // 存储测验数据
  const [answers, setAnswers] = useState<any>({}); // 存储用户回答
  const [message, setMessage] = useState(""); // 显示分数或错误消息

  useEffect(() => {
    // 从后端获取测验数据
    const fetchQuizData = async () => {
      const response = await fetch(`/api/quizzes/${qid}`); // 通过 quizId 请求测验数据
      const data = await response.json();
      setQuizData(data); // 保存数据到状态
    };
    fetchQuizData();
  }, [qid]);

  const handleAnswerChange = (questionId: string, value: any) => {
    // 更新答案
    setAnswers({ ...answers, [questionId]: value });
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(`/api/quizzes/${qid}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: "current_user_id", answers }),
      });
      const result = await response.json();
      setMessage(`Your score: ${result.score}`); // 显示分数
    } catch (error) {
      setMessage("Error submitting quiz."); // 显示错误信息
    }
  };

  if (!quizData) return <div>Loading...</div>;

  return (
    <div>
      <h1>{quizData.title}</h1>
      {quizData.questions.map((q: any) => (
        <div key={q._id}>
          <h3>{q.title}</h3>
          {q.type === "MULTIPLE_CHOICE" &&
            q.choices.map((choice: string, index: number) => (
              <div key={index}>
                <input
                  type="radio"
                  name={`question-${q._id}`}
                  onChange={() => handleAnswerChange(q._id, choice)}
                />
                {choice}
              </div>
            ))}
        </div>
      ))}
      <button onClick={handleSubmit}>Submit</button>
      {message && <div>{message}</div>}
    </div>
  );
};

export default QuizTaking;
