import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useParams, useNavigate } from "react-router";
import { useDispatch, useSelector } from 'react-redux';
import { addAssignment, updateAssignment } from "./reducer";
import * as AssignmentClient from "./client";
import * as coursesClient from "../client";

export default function AssignmentEditor() {
    const { cid, aid } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const assignments = useSelector((state: any) => state.assignments.assignments);
    const assignment = assignments.find((assignment: any) => assignment._id === aid);
    const { currentUser } = useSelector((state: any) => state.accountReducer);
    const isFaculty = currentUser.role === "FACULTY";

    const [title, setTitle] = useState(assignment?.title || "New Assignment");
    const [description, setDescription] = useState(assignment?.description || "New Assignment Description");
    const [score, setScore] = useState(assignment?.score?.replace(" pts", "") || 100);
    const [dueDate, setDueDate] = useState(assignment?.due || "");
    const [availableFromDate, setAvailableFromDate] = useState(assignment?.notAvailableUntil || "");
    const [availableUntilDate, setAvailableUntilDate] = useState(assignment?.availableUntil || "");
    const [modules, setModules] = useState(assignment?.modules || "Multiple Modules");

    const formatDate = (date: string | number | Date) => {
        if (!date) return ""; // Handle null or empty dates
        const parsedDate = new Date(date);
        if (isNaN(parsedDate.getTime())) return ""; // Invalid date
        return parsedDate.toISOString().slice(0, 16); // Format as yyyy-MM-ddThh:mm
    };

    if (!isFaculty) {
        return null;
    }

    const handleSave = async () => {

        const newAssignment = {
            _id: aid,
            title,
            description,
            score: `${score} pts`,
            modules,
            due: dueDate,
            notAvailableUntil: availableFromDate,
            availableUntil: availableUntilDate,
            course: cid,
        };

        if (assignment) {
            // Update existing assignment
            await AssignmentClient.updateAssignment(newAssignment);
            console.log("Assignment updated successfully.");
        } else {
            // Create a new assignment
            const createdAssignment = await coursesClient.createAssignmentForCourse(cid, newAssignment);
            console.log("Assignment created successfully:", createdAssignment);
        }
    
        navigate(`/Kanbas/Courses/${cid}/Assignments`);
    };

    const handleCancel = () => {
        navigate(`/Kanbas/Courses/${cid}/Assignments`);
    };

    return (
        <div id="wd-assignments-editor" className="container mt-4">
            <form>
                <div className="mb-3">
                    <label htmlFor="wd-name" className="form-label fw-bold">Assignment Name</label>
                    <input
                        type="text"
                        className="form-control"
                        id="wd-name"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="wd-description" className="form-label fw-bold">Description</label>
                    <textarea
                        className="form-control"
                        id="wd-description"
                        rows={4}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="wd-points" className="form-label fw-bold">Points</label>
                    <input
                        type="number"
                        className="form-control"
                        id="wd-points"
                        value={score}
                        onChange={(e) => setScore(e.target.value)}
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="wd-modules" className="form-label fw-bold">Modules</label>
                    <input
                        type="text"
                        className="form-control"
                        id="wd-modules"
                        value={modules}
                        onChange={(e) => setModules(e.target.value)}
                    />
                </div>

                <div className="mb-4 row">
                    <label htmlFor="wd-group" className="col-sm-2 col-form-label">Assignment Group</label>
                    <div className="col-sm-10">
                        <select className="form-control" id="wd-group" defaultValue="assignments">
                            <option value="assignments">ASSIGNMENTS</option>
                            <option value="quizzes">QUIZZES</option>
                            <option value="exams">EXAMS</option>
                            <option value="projects">PROJECTS</option>
                        </select>
                    </div>
                </div>

                <div className="mb-4 row">
                    <label htmlFor="wd-display-grade-as" className="col-sm-2 col-form-label">Display Grade as</label>
                    <div className="col-sm-10">
                        <select className="form-control" id="wd-display-grade-as" defaultValue="points">
                            <option value="percentage">PERCENTAGE</option>
                            <option value="points">POINTS</option>
                            <option value="letter">LETTER GRADE</option>
                        </select>
                    </div>
                </div>

                <div className="mb-4 row">
                    <label htmlFor="wd-submission-type" className="col-sm-2 col-form-label">Submission Type</label>
                    <div className="col-sm-10 border border-secondary-subtle p-3 rounded-4">
                        <select className="form-control" id="wd-submission-type" defaultValue="online">
                            <option value="online">ONLINE</option>
                            <option value="in-person">IN-PERSON</option>
                        </select>
                        <br />
                        <div className="mb-4">
                            <div className="font fw-bold">Online Entry Options</div>
                            <div className='p-2'>
                                <div className="form-check">
                                    <input className="form-check-input" type="checkbox" id="wd-text-entry" />
                                    <label className="form-check-label" htmlFor="wd-text-entry">
                                        Text Entry
                                    </label>
                                </div>
                                <div className="form-check">
                                    <input className="form-check-input" type="checkbox" id="wd-website-url" />
                                    <label className="form-check-label" htmlFor="wd-website-url">
                                        Website URL
                                    </label>
                                </div>
                                <div className="form-check">
                                    <input className="form-check-input" type="checkbox" id="wd-media-recordings" />
                                    <label className="form-check-label" htmlFor="wd-media-recordings">
                                        Media Recordings
                                    </label>
                                </div>
                                <div className="form-check">
                                    <input className="form-check-input" type="checkbox" id="wd-student-annotation" />
                                    <label className="form-check-label" htmlFor="wd-student-annotation">
                                        Student Annotation
                                    </label>
                                </div>
                                <div className="form-check">
                                    <input className="form-check-input" type="checkbox" id="wd-file-upload" />
                                    <label className="form-check-label" htmlFor="wd-file-upload">
                                        File Uploads
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mb-4 row">
                    <label htmlFor="wd-assign-to" className="col-sm-2 col-form-label">Assign</label>
                    <div className="col-sm-10 border border-secondary-subtle p-3 rounded-4">
                        <label htmlFor="wd-assign-to" className="col-sm-2 col-form-label fw-bold">Assign to</label>
                        <select className="form-control" id="wd-assign-to" defaultValue="everyone">
                            <option value="everyone">Everyone</option>
                        </select>
                        <br />
                        <div>
                            <label htmlFor="wd-due-date" className="form-label fw-bold">Due Date</label>
                            <input
                                type="datetime-local"
                                className="form-control"
                                id="wd-due-date"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                            />
                            <div className="row mt-4">
                                <div className="col-sm-6">
                                    <label htmlFor="wd-available-from" className="form-label fw-bold">Available From</label>
                                    <input
                                        type="datetime-local"
                                        className="form-control"
                                        id="wd-available-from"
                                        value={availableFromDate}
                                        onChange={(e) => setAvailableFromDate(e.target.value)}
                                    />
                                </div>
                                <div className="col-sm-6">
                                    <label htmlFor="wd-available-until" className="form-label fw-bold">Available Until</label>
                                    <input
                                        type="datetime-local"
                                        className="form-control"
                                        id="wd-available-until"
                                        value={availableUntilDate}
                                        onChange={(e) => setAvailableUntilDate(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <hr />
                <div className="row">
                    <div className="col text-end">
                        <button type="button" className="btn btn-secondary me-2" onClick={handleCancel}>Cancel</button>
                        <button type="button" className="btn btn-danger" onClick={handleSave}>Save</button>
                    </div>
                </div>
            </form>
        </div>
    );
}
