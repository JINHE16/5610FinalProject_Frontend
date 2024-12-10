import React, { useEffect, useState } from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import * as client from './client';
import { setQuizzes } from './reducer';
import './QuizDetails.css';
import ProtectedRoute from "../../Account/ProtectedRoute";

const QuizDetails = () => {
    const { qid } = useParams(); // 从 URL 获取 quizId 参数
    const dispatch = useDispatch(); // 初始化 dispatch
    const quiz = useSelector((state: any) =>
        state.quizReducer.quizzes.find((q: any) => q._id === qid)
    );
    const navigate = useNavigate();

    const fetchQuizDetails = async () => {
        try {
            console.log("Fetching quiz details for qid:", qid);
            const quizData = await client.getQuiz(qid!);
            console.log("Quiz fetched from backend:", quizData); // 添加日志
            dispatch(setQuizzes([quizData])); // 将获取的数据存入 Redux
        } catch (error) {
            console.error("Error fetching quiz details:", error);
        }
    };

    useEffect(() => {
        if (qid) {
            fetchQuizDetails();
        }
    }, [qid]);

    if (!quiz) {
        console.log("No matching quiz found in Redux state."); // 打印调试日志
        return <div>Quiz not found!</div>;
    }

    console.log("Rendering quiz details:", quiz); // 确认渲染的 Quiz 数据

    return (<>

    <ProtectedRoute isDataReady={true} requiredRole={["FACULTY", "ADMIN"]}>
        <div className="quiz-details-container">
            <div style={{display: "flex", gap: "10px"}}>
                {/* Preview Button */}
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
                    }}
                    onClick={() => navigate(`/Kanbas/Courses/${quiz.course}/Quizzes/${qid}/preview`)}
                >
                    <span style={{marginRight: "6px"}}>🔍</span> Preview
                </button>


                {/* Edit Button */}
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
                    }}
                    onClick={() => navigate(`editor`)}
                >
                    <span style={{marginRight: "6px"}}>✏️</span> Edit
                </button>
            </div>
            <hr/>
            <h1 className="mb-4">{quiz.title}</h1>
            <div className="quiz-details">
                <dl>
                    <dt>Quiz Type</dt>
                    <dd>{quiz.quizType}</dd>

                    <dt>Points</dt>
                    <dd>{quiz.points}</dd>

                    <dt>Assignment Group</dt>
                    <dd>{quiz.assignmentGroup}</dd>

                    <dt>Shuffle Answers</dt>
                    <dd>{quiz.shuffleAnswers ? 'Yes' : 'No'}</dd>

                    <dt>Time Limit</dt>
                    <dd>{quiz.timeLimit} Minutes</dd>

                    <dt>Multiple Attempts</dt>
                    <dd>{quiz.multipleAttempts ? 'Yes' : 'No'}</dd>

                    <dt>Attempts</dt>
                    <dd>{quiz.attempts}</dd>

                    <dt>Show Correct Answers</dt>
                    <dd>{quiz.showCorrectAnswers}</dd>

                    <dt>Access Code</dt>
                    <dd>{quiz.accessCode}</dd>

                    <dt>One Question at a Time</dt>
                    <dd>{quiz.oneQuestionAtATime ? 'Yes' : 'No'}</dd>

                    <dt>Webcam Required</dt>
                    <dd>{quiz.webcamRequired ? 'Yes' : 'No'}</dd>

                    <dt>Lock Questions After Answering</dt>
                    <dd>{quiz.lockQuestionsAfterAnswering ? 'Yes' : 'No'}</dd>

                    <dt>Due Date</dt>
                    <dd>{new Date(quiz.due_date).toLocaleString()}</dd>

                    <dt>Available From</dt>
                    <dd>{new Date(quiz.available_from).toLocaleString()}</dd>

                    <dt>Available Until</dt>
                    <dd>{new Date(quiz.available_until).toLocaleString()}</dd>
                </dl>
            </div>
        </div> </ProtectedRoute>

            <ProtectedRoute isDataReady={true} requiredRole="STUDENT">
                <div style={{
                    flexDirection: "column", // 垂直排列
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}>
                    <h1 className="mb-4">{quiz.title}</h1>
                    <br/>
                    <button
                        className="btn btn-danger"
                        onClick={() => navigate(`/Kanbas/Courses/${quiz.course}/Quizzes/${qid}/start`)}
                    >
                        Start Quiz
                    </button>
                </div>
            </ProtectedRoute>
        </>
    );

};

export default QuizDetails;
