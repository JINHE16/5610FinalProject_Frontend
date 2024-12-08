import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import * as client from './client'; // 用于调用后端 API
import { Quiz } from './types';
import {setQuizzes} from "./reducer";
import {useSelector} from "react-redux";

const QuizDetails = () => {
    const { cid, quizId } = useParams(); // 从 URL 获取 cid 和 quizId 参数
    const [loading, setLoading] = useState(true);
    const quiz = useSelector((state: any) =>
        state.quizReducer.quizzes.find((q: any) => q._id === quizId)
    );
    // 加载测验详情
    useEffect(() => {
        // 若不存在param中的这两个参数返回错误
        if (!quizId) {
            console.error("Missing required parameters");
            return;
        }
        const fetchQuizDetails = async () => {
            try {
                const quizData = await client.getQuiz(quizId);
                setQuizzes(quizData);
            } catch (error) {
                console.error('Error fetching quiz details:', error);
            }
        };
        fetchQuizDetails();
    }, [cid, quizId]);



    if (!quiz) {
        return <div>Quiz not found!</div>;
    }

    return (
        <div className="quiz-details-container">
            <h1>{quiz.title}</h1>
            <p>{`Quiz Type: ${quiz.quizType}`}</p>
            {/*<p>Points: {quiz.points}</p>*/}
            {/*<p>Assignment Group: {quiz.assignmentGroup}</p>*/}
            {/*<p>Shuffle Answers: {quiz.shuffleAnswers}</p>*/}
            {/*<p>Time Limit: {quiz.timeLimit}</p>*/}
            {/*<p>Multiple Attempts: {quiz.multipleAttempts}</p>*/}
            {/*/!*<p>View Responses: {quiz.viewResponses}</p>*!/*/}
            {/*<p>How many attempts: {quiz.howManyAttempts}</p>*/}
            {/*<p>Show Correct Answers: {quiz.showCorrectAnswers}</p>*/}
            {/*<p>Access Code: {quiz.accessCode}</p>*/}
            {/*<p>One Question At A Time: {quiz.oneQuestionAtATime}</p>*/}
            {/*<p>Webcam Required: {quiz.webcamRequired}</p>*/}
            {/*<p>Lock Questions After Answering: {quiz.lockQuestionsAfterAnswering}</p>*/}
            {/*<p>Due Date: {quiz.due_date}</p>*/}
            {/*<p>Available From: {quiz.available_from}</p>*/}
            {/*<p>Available Until: {quiz.available_until}</p>*/}
            {/*<div className="quiz-dates">*/}
            {/*    <br/>*/}
            {/*    <p>Due Date: {quiz.due_date}</p>*/}
            {/*    <p>Available From: {quiz.available_from}</p>*/}
            {/*    <p>Available Until: {quiz.available_until}</p>*/}
            {/*    <br/>*/}
            {/*</div>*/}
        </div>
    );
};

export default QuizDetails;
