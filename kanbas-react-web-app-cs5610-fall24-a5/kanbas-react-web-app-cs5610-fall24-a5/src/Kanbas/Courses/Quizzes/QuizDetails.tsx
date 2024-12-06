import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import * as client from './client'; // 用于调用后端 API
import { Quiz } from './reducer';

const QuizDetails = () => {
    const { cid, quizId } = useParams(); // 从 URL 获取 cid 和 quizId 参数
    const [quiz, setQuiz] = useState<Quiz>();
    const [loading, setLoading] = useState(true);

    // 加载测验详情
    useEffect(() => {
        // 若不存在param中的这两个参数返回错误
        if (!cid || !quizId) {
            console.error("Missing required parameters");
            return;
        }
        const fetchQuizDetails = async () => {
            try {
                const quizData = await client.fetchQuizDetails(cid, quizId);
                setQuiz(quizData);
            } catch (error) {
                console.error('Error fetching quiz details:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchQuizDetails();
    }, [cid, quizId]);

    // if (loading) {
    //     return <div>Loading...</div>;
    // }

    if (!quiz) {
        return <div>Quiz not found!</div>;
    }

    return (
        <div className="quiz-details-container">
            <h1>{quiz.title}</h1>
            <p>Points: {quiz.points}</p>
            <p>Available From: {quiz.available_from}</p>
            <p>Available Until: {quiz.available_until}</p>
            <p>Due Date: {quiz.due_date}</p>
            <p>Questions: {quiz.questions || 0}</p>
            <p>Published: {quiz.published ? 'Yes' : 'No'}</p>
        </div>
    );
};

export default QuizDetails;
