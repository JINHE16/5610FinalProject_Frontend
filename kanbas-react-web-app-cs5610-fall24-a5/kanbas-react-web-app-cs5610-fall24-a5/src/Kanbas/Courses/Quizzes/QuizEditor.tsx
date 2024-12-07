import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as client from './client'; // API 调用
import { Quiz } from './reducer';
import './QuizDetailsEditor.css'; // 可添加样式
import { Editor } from "@tinymce/tinymce-react";
import {updateQuizDetails} from "./client";

const QuizDetailsEditor = () => {
    const navigate = useNavigate();
    const { cid, quizId } = useParams();

    const [quizDetails, setQuizDetails] = useState<Quiz>({
        title: '',
        description: '',
        quizType: 'Graded Quiz',
        points: 0,
        assignmentGroup: 'Quizzes',
        shuffleAnswers: true,
        timeLimit: 20,
        howManyAttempts: 1,
        published: false,
        questions: 0,
        multipleAttempts: false,
        showCorrectAnswers: false,
        accessCode: '',
        oneQuestionAtATime: true,
        webcamRequired: false,
        lockQuestionsAfterAnswering: false,
        due_date: new Date().toISOString(),
        available_from: new Date().toISOString(),
        available_until: new Date().toISOString(),
    });

    const [activeTab, setActiveTab] = useState<'Details' | 'Questions'>('Details');

    // 根据给定的Quiz中field和value进行reducer的修改
    const handleInputChange = (field: keyof Quiz, value: any) => {
        setQuizDetails({
            ...quizDetails,
            [field]: value,
        });
    };

    const handleSave = async () => {
        try {
            await client.updateQuizDetails(cid as string, quizId as string, quizDetails);
            navigate(`/Kanbas/Courses/${cid}/Quizzes/${quizId}`);
        } catch (error) {
            console.error('Error saving quiz details:', error);
        }
    };

    const handleSaveAndPublish = async () => {
        try {
            setQuizDetails({...quizDetails, published: true,});
            await client.updateQuizDetails(cid as string, quizId as string, quizDetails);
            navigate(`/Kanbas/Courses/${cid}/Quizzes`);
        } catch (error) {
            console.error('Error saving and publishing quiz:', error);
        }
    };

    const handleCancel = () => {
        navigate(`/Kanbas/Courses/${cid}/Quizzes`);
    };

    return (
        <div className="quiz-details-editor-container">
            <h1>Edit Quiz</h1>
            <div className="tabs">
                <button
                    className={`tab-button ${activeTab === 'Details' ? 'active' : ''}`}
                    onClick={() => setActiveTab('Details')}
                >
                    Details
                </button>
                <button
                    className={`tab-button ${activeTab === 'Questions' ? 'active' : ''}`}
                    onClick={() => navigate(`/Kanbas/Courses/${cid}/Quizzes/${quizId}/Questions`)}
                >
                    Questions
                </button>
            </div>
            {activeTab === 'Details' && (
                <form className="quiz-details-form">
                    <div className="form-group">
                        <label>Title</label>
                        <input
                            type="text"
                            value={quizDetails.title}
                            onChange={(e) => handleInputChange('title', e.target.value)}
                            className="form-control"
                        />
                    </div>
                    <div className="form-group">
                        <label>Description</label>
                        <Editor
                            apiKey="your-tinymce-api-key"
                            initialValue={quizDetails.description}
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

                            onEditorChange={(content) => handleInputChange('description', content)}
                        />
                    </div>


                    <div className="form-group">
                        <label>Quiz Type</label>
                        <select
                            value={quizDetails.quizType}
                            onChange={(e) => handleInputChange('quizType', e.target.value)}
                            className="form-control"
                        >
                            <option>Graded Quiz</option>
                            <option>Practice Quiz</option>
                            <option>Graded Survey</option>
                            <option>Ungraded Survey</option>
                        </select>
                    </div>

                    {/*point应该是根据questions生成的*/}
                    {/*<div className="form-group">*/}
                    {/*    <label>Points</label>*/}
                    {/*    <input*/}
                    {/*        type="number"*/}
                    {/*        value={quizDetails.points}*/}
                    {/*        onChange={(e) => handleInputChange('points', +e.target.value)}*/}
                    {/*        className="form-control"*/}
                    {/*    />*/}
                    {/*</div>*/}

                    <div className="form-group">
                        <label>Assignment Group</label>
                        <select
                            value={quizDetails.assignmentGroup}
                            onChange={(e) => handleInputChange('assignmentGroup', e.target.value)}
                            className="form-control"
                        >
                            <option>Quizzes</option>
                            <option>Exams</option>
                            <option>Assignments</option>
                            <option>Project</option>
                        </select>
                    </div>

                    {/*Options按键组*/}
                    <div className="options-section">
                        <h4>Options</h4>
                        <div className="form-group">
                            {/* Shuffle Answers */}
                            <label>
                                <input
                                    type="checkbox"
                                    checked={quizDetails.shuffleAnswers}
                                    onChange={(e) => handleInputChange("shuffleAnswers", e.target.checked)}
                                />
                                Shuffle Answers
                            </label>
                        </div>

                        <div className="form-group d-flex align-items-center">
                            {/* Time Limit */}
                            <label>
                                <input
                                    type="checkbox"
                                    checked={quizDetails.timeLimit !== null}
                                    onChange={(e) =>
                                        handleInputChange("timeLimit", e.target.checked ? 20 : null) // Default: 20 minutes
                                    }
                                />
                                Time Limit
                            </label>
                            {quizDetails.timeLimit !== null && (
                                <input
                                    type="number"
                                    value={quizDetails.timeLimit}
                                    onChange={(e) => handleInputChange("timeLimit", +e.target.value)}
                                    className="form-control ms-2"
                                    style={{width: "100px"}}
                                    placeholder="Minutes"
                                    min={1}
                                />
                            )}
                        </div>

                        <div className="form-group">
                            {/* Allow Multiple Attempts */}
                            <label>
                                <input
                                    type="checkbox"
                                    checked={quizDetails.multipleAttempts}
                                    onChange={(e) => handleInputChange("multipleAttempts", e.target.checked)}
                                />
                                Allow Multiple Attempts
                            </label>
                        </div>
                    </div>



                    {/*分配截止日期按键组*/}
                    <div className="date-settings-section">
                        <h4>Dates</h4>
                        {/* Due Date */}
                        <div className="form-group">
                            <label>Due</label>
                            <div className="input-group">
                                <input
                                    type="datetime-local"
                                    value={quizDetails.due_date}
                                    onChange={(e) => handleInputChange("due_date", e.target.value)}
                                    className="form-control"
                                />
                                <span className="input-group-text">
                        <i className="bi bi-calendar"></i> {/* Bootstrap Icon or replace with another icon */}
                    </span>
                            </div>
                        </div>

                        {/* Available From */}
                        <div className="form-group d-flex">
                            <div className="me-2">
                                <label>Available from</label>
                                <div className="input-group">
                                    <input
                                        type="datetime-local"
                                        value={quizDetails.available_from}
                                        onChange={(e) => handleInputChange("available_from", e.target.value)}
                                        className="form-control"
                                    />
                                    <span className="input-group-text">
                            <i className="bi bi-calendar"></i>
                        </span>
                                </div>
                            </div>

                            {/* Available Until */}
                            <div>
                                <label>Until</label>
                                <div className="input-group">
                                    <input
                                        type="datetime-local"
                                        value={quizDetails.available_until}
                                        onChange={(e) => handleInputChange("available_until", e.target.value)}
                                        className="form-control"
                                    />
                                    <span className="input-group-text">
                            <i className="bi bi-calendar"></i>
                        </span>
                                </div>
                            </div>
                        </div>
                    </div>



                    {/*保存按键组*/}
                    <div className="form-buttons">
                        <button type="button" className="btn btn-primary" onClick={handleSave}>
                            Save
                        </button>

                        <button
                            type="button"
                            className="btn btn-success"
                            onClick={handleSaveAndPublish}
                        >
                            Save & Publish
                        </button>

                        <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                            Cancel
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default QuizDetailsEditor;
