import React, {useState, useEffect} from 'react';
import {useParams} from "react-router-dom";
import QuestionEditor from './QuestionEditor';
import {useDispatch, useSelector} from "react-redux";
import * as client from "./client";
import {updateQuiz} from "./reducer";
import {Question} from './types';
import {Editor} from "@tinymce/tinymce-react";

const QuizEditor = () => {
    const {cid, qid} = useParams();
    const dispatch = useDispatch();
    const [activeTab, setActiveTab] = useState("details");
    const quiz = useSelector((state: any) =>
        state.quizReducer.quizzes.find((q: any) => q._id === qid)
    );

    const [quizData, setQuizData] = useState({
        title: "Unnamed Quiz",
        description: "",
        quizType: "GRADED_QUIZ",
        points: 0,
        assignmentGroup: "QUIZZES",
        shuffleAnswers: true,
        timeLimit: 20,
        multipleAttempts: false,
        attempts: 1,
        showCorrectAnswers: "Immediately",
        accessCode: "",
        oneQuestionAtTime: true,
        webcamRequired: false,
        lockQuestionsAfterAnswering: false,
        due_date: "",
        available_from: "",
        available_until: "",
        questions: [] as Question[],
        published: false
    });

    useEffect(() => {
        const fetchQuizData = async () => {
            if (qid) {
                try {
                    const fetchedQuiz = await client.getQuiz(qid);
                    console.log("Fetched Quiz on Load:", fetchedQuiz);
                    setQuizData(fetchedQuiz);
                } catch (error) {
                    console.error("Error fetching quiz data:", error);
                }
            }
        };

        fetchQuizData();
    }, [qid]);

    const handleInputChange = (field: string, value: any) => {
        setQuizData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSaveQuestions = async (questions: Question[]) => {
        try {
            // Update the local state
            const updatedQuizData = {
                ...quizData,
                questions: questions,
                points: questions.reduce((sum, q) => sum + q.points, 0)
            };

            if (qid) {
                // Save to backend
                const updatedQuiz = await client.updateQuiz(cid!, qid, updatedQuizData);
                dispatch(updateQuiz(updatedQuiz));
                setQuizData(updatedQuiz);
            }
        } catch (error) {
            console.error("Error saving questions:", error);
        }
    };

    const handleSave = async () => {
        try {
            if (qid) {
                const updatedQuiz = await client.updateQuiz(cid!, qid, quizData);
                dispatch(updateQuiz(updatedQuiz));
                window.location.hash = `/Kanbas/Courses/${cid}/Quizzes`;
            }
        } catch (error) {
            console.error("Error saving quiz:", error);
        }
    };

    const handleCancel = () => {
        window.location.hash = `/Kanbas/Courses/${cid}/Quizzes`;
    };

    return (
        <div className="container mt-4">
            {/* Tabs */}
            <ul className="nav nav-tabs mb-3">
                <li className="nav-item">
                    <button
                        className={`nav-link ${activeTab === "details" ? "active" : ""}`}
                        onClick={() => setActiveTab("details")}
                    >
                        Details
                    </button>
                </li>
                <li className="nav-item">
                    <button
                        className={`nav-link ${activeTab === "questions" ? "active" : ""}`}
                        onClick={() => setActiveTab("questions")}
                    >
                        Questions
                    </button>
                </li>
            </ul>

            {/* Details Tab Content */}
            {activeTab === "details" && (
                <div className="card">
                    <div className="card-body">
                        <form>
                            {/* Title */}
                            <div className="mb-3">
                                <label className="form-label">Quiz Title</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={quizData.title}
                                    onChange={(e) => handleInputChange("title", e.target.value)}
                                />
                            </div>


                            {/* tinymce是一个富文本编辑器,安装指令为npm install @tinymce/tinymce-react*/}

                            <Editor
                                apiKey='ract2ll529fz82m189u0cypxvp6cnirhoq4p82bt0o3lbe9t'
                                value={quizData.description}
                                init={{
                                    height: 300,
                                    menubar: true,
                                    plugins: [
                                        "advlist autolink lists link image charmap print preview anchor",
                                        "searchreplace visualblocks code fullscreen",
                                        "insertdatetime media table paste code help wordcount",
                                    ],
                                    toolbar:
                                        "undo redo | formatselect | bold italic backcolor | \
                                        alignleft aligncenter alignright alignjustify | \
                                        bullist numlist outdent indent | removeformat | help",
                                }}

                                onEditorChange={(content) => handleInputChange("description", content)}
                            />
                            {/* Quiz Type */}
                            <div className="mb-3">
                                <label className="form-label">Quiz Type</label>
                                <select
                                    className="form-select"
                                    value={quizData.quizType}
                                    onChange={(e) => handleInputChange("quizType", e.target.value)}
                                >
                                    <option value="GRADED_QUIZ">Graded Quiz</option>
                                    <option value="PRACTICE_QUIZ">Practice Quiz</option>
                                    <option value="GRADED_SURVEY">Graded Survey</option>
                                    <option value="UNGRADED_SURVEY">Ungraded Survey</option>
                                </select>
                            </div>

                            {/* Assignment Group */}
                            <div className="mb-3">
                                <label className="form-label">Assignment Group</label>
                                <select
                                    className="form-select"
                                    value={quizData.assignmentGroup}
                                    onChange={(e) => handleInputChange("assignmentGroup", e.target.value)}
                                >
                                    <option value="QUIZZES">Quizzes</option>
                                    <option value="EXAMS">Exams</option>
                                    <option value="ASSIGNMENTS">Assignments</option>
                                    <option value="PROJECT">Project</option>
                                </select>
                            </div>

                            {/* Options */}
                            <div className="mb-3">
                                <div className="form-check mb-2">
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        id="shuffleAnswers"
                                        checked={quizData.shuffleAnswers}
                                        onChange={(e) => handleInputChange("shuffleAnswers", e.target.checked)}
                                    />
                                    <label className="form-check-label" htmlFor="shuffleAnswers">
                                        Shuffle Answers
                                    </label>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Time Limit (Minutes)</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        style={{width: '100px'}}
                                        value={quizData.timeLimit}
                                        onChange={(e) => handleInputChange("timeLimit", parseInt(e.target.value))}
                                        min={0}
                                    />

                                </div>

                                {/*show correct answers dropdown menu*/}
                                <div>
                                    <label className="form-label">Show Correct Answers</label>
                                    <select
                                        className="form-select"
                                        value={quizData.showCorrectAnswers}
                                        onChange={(e) => handleInputChange("showCorrectAnswers", e.target.value)}
                                    >
                                        <option value="Immediately">Immediately</option>
                                        <option value="NEVER">Never</option>
                                        <option value="AFTER_CORRECT_ANSWER">After Correct Answer</option>
                                    </select>
                                </div>

                                {/*modify accesscode*/}
                                <div>
                                    <label className="form-label">Access Code</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={quizData.accessCode}
                                        onChange={(e) => handleInputChange("accessCode", e.target.value)}
                                    />
                                </div>

                                <div className="form-check mb-2">
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        id="multipleAttempts"
                                        checked={quizData.multipleAttempts}
                                        onChange={(e) => handleInputChange("multipleAttempts", e.target.checked)}
                                    />
                                    <label className="form-check-label" htmlFor="multipleAttempts">
                                        Allow Multiple Attempts
                                    </label>
                                </div>

                                {quizData.multipleAttempts && (
                                    <div className="mb-3 ms-4">
                                        <label className="form-label">Number of Attempts</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            style={{width: '100px'}}
                                            value={quizData.attempts}
                                            onChange={(e) => handleInputChange("attempts", parseInt(e.target.value))}
                                            min={1}
                                        />
                                    </div>
                                )}

                                <div className="form-check mb-2">
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        id="oneQuestionAtTime"
                                        checked={quizData.oneQuestionAtTime}
                                        onChange={(e) => handleInputChange("oneQuestionAtTime", e.target.checked)}
                                    />
                                    <label className="form-check-label" htmlFor="oneQuestionAtTime">
                                        One Question at a Time
                                    </label>
                                </div>

                                {/*/!*setPublishStatus*!/*/}
                                {/*<div>*/}
                                {/*    <label className="form-label">Publish Status</label>*/}
                                {/*    <input*/}
                                {/*        type="checkbox"*/}
                                {/*        className="form-check-input"*/}
                                {/*        id="published"*/}
                                {/*        checked={quizData.published}*/}
                                {/*        onChange={(e) => handleInputChange("published", e.target.checked)}*/}
                                {/*    /><label className="form-label">published or not</label>*/}
                                {/*</div>*/}

                                {/*webcam require checkbox*/}
                                <div className="form-check mb-2">

                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        id="webcamRequired"
                                        checked={quizData.webcamRequired}
                                        onChange={(e) => handleInputChange("webcamRequired", e.target.checked)}
                                    /><label className="form-label">Webcam Required</label>
                                </div>

                                <div className="form-check mb-2">
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        id="lockQuestions"
                                        checked={quizData.lockQuestionsAfterAnswering}
                                        onChange={(e) => handleInputChange("lockQuestionsAfterAnswering", e.target.checked)}
                                    />
                                    <label className="form-check-label" htmlFor="lockQuestions">
                                        Lock Questions After Answering
                                    </label>
                                </div>

                            </div>

                            {/* Dates */}
                            <div className="mb-3">
                                <div className="mb-3">
                                    <label className="form-label">Due Date</label>
                                    <input
                                        type="datetime-local"
                                        className="form-control"
                                        value={(quizData.due_date)}
                                        onChange={(e) => handleInputChange("due_date", e.target.value)}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Available From</label>
                                    <input
                                        type="datetime-local"
                                        className="form-control"
                                        value={quizData.available_from}
                                        onChange={(e) => handleInputChange("available_from", e.target.value)}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Available Until</label>
                                    <input
                                        type="datetime-local"
                                        className="form-control"
                                        value={quizData.available_until}
                                        onChange={(e) => handleInputChange("available_until", e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="d-flex justify-content-end gap-2">
                                <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                                    Cancel
                                </button>
                                <button type="button" className="btn btn-primary" onClick={handleSave}>
                                    Save
                                </button>

                                {/*save and publish*/}
                                <button type="button" className="btn btn-danger" onClick={async() =>  {
                                    // Update the `published` attribute first
                                    const updatedQuizData = {
                                        ...quizData,
                                        published: true, // Set published to true
                                    };
                                    handleInputChange("published", true);
                                    setQuizData(updatedQuizData); // Update local state
                                    // Call `handleSave` after updating
                                    try {
                                        // 直接将 updatedQuizData 传递给重写的handleSave，而不是依赖状态（因为handlesave在上文定义不接受参数）
                                        if (qid) {
                                            const savedQuiz = await client.updateQuiz(cid!, qid, updatedQuizData);
                                            dispatch(updateQuiz(savedQuiz));
                                            window.location.hash = `/Kanbas/Courses/${cid}/Quizzes`;
                                        }
                                    } catch (error) {
                                        console.error("Error saving and publishing quiz:", error);
                                    }
                                }}>
                                    Save and Publish
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Questions Tab Content */}
            {activeTab === "questions" && (
                <div className="card">
                    <div className="card-body">
                        <QuestionEditor
                            quizId={qid!}
                            initialQuestions={quizData.questions || []}
                            onSave={handleSaveQuestions}  // Ensure backend is updated
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default QuizEditor;
