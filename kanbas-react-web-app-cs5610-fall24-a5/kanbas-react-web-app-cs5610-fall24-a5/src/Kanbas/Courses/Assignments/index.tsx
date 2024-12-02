import React, { useState, useEffect } from "react";
import { BsGripVertical } from "react-icons/bs";
import AssignmentControl from "./AssignmentControl";
import ControlButtons from "./ControlButtons";
import { PiNotePencil } from "react-icons/pi";
import LessonControlButtons from "../Modules/LessonControlButtons";
import { useParams } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import AssignmentControlButtons from "./AssignmentControlButtons";
import { setAssignment, deleteAssignment } from "./reducer";
import * as coursesClient from "../client";
import * as AssignmentClient from "./client";

export default function Assignments() {
    const { cid } = useParams();
    const dispatch = useDispatch();
    const assignments = useSelector((state: any) => state.assignments.assignments);
    const { currentUser } = useSelector((state: any) => state.accountReducer);
    const isFaculty = currentUser.role === "FACULTY";
    const [showDialog, setShowDialog] = useState(false);
    const [selectedAssignmentId, setSelectedAssignmentId] = useState<string | null>(null);

    const fetchAssignments = async () => {
        const assignments = await coursesClient.findAssignmentsForCourse(cid as string);
        dispatch(setAssignment(assignments));
    };
    
    useEffect(() => {
        fetchAssignments();
    }, []);

    const formatDateTime = (dateTimeString: any) => {
        // Check if the date is already in the correct format (e.g., "July 6 at 12:00am")
        if (isNaN(Date.parse(dateTimeString))) {
            return dateTimeString; // Return as-is if it cannot be parsed as a date
        }

        // Otherwise, parse it as a Date object
        const date = new Date(dateTimeString);
        return `${date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} at ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`;
    };

    const handleDeleteClick = (assignmentId: string) => {
        setSelectedAssignmentId(assignmentId);
        setShowDialog(true);
    };

    const confirmDelete = async () => {
        if (selectedAssignmentId) {
            await AssignmentClient.deleteAssignment(selectedAssignmentId);
            dispatch(deleteAssignment(selectedAssignmentId));
            setShowDialog(false);
            setSelectedAssignmentId(null);
        }
    };

    const cancelDelete = () => {
        setShowDialog(false);
        setSelectedAssignmentId(null);
    };

    return (
        <div id="wd-assignments" className="p-3">
            <AssignmentControl isFaculty={isFaculty} />
            <div id="wd-assignments-title" className="wd-title p-3 ps-1 bg-secondary-subtle d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                    <BsGripVertical className="me-2 fs-3" />
                    <span className="fw-bold fs-5">ASSIGNMENTS</span>
                </div>
                <ControlButtons />
            </div>
            <ul id="wd-assignment-list" className="list-group rounded-0">
                {assignments
                    .map((assignment: any) => (
                        <li key={assignment._id} className="wd-assignment-list-item list-group-item p-3 ps-1 d-flex justify-content-between align-items-start">
                            <div className="d-flex align-items-start">
                                <BsGripVertical className="me-3 fs-3" />
                                <PiNotePencil className="me-3 fs-4 text-success" />
                                <div>
                                    <a className="wd-assignment-link"
                                        href={`#/Kanbas/Courses/${cid}/Assignments/${assignment._id}`}
                                        style={{ color: "black", fontWeight: "bold", textDecoration: "none", fontSize: "20px" }}>
                                        {assignment.title}
                                    </a>
                                    <div>
                                        <span className="text-danger me-2"> {assignment.modules}</span> |
                                        <span className="text-dark fw-bold me-2"> Not available until</span>
                                        <span className="text-dark">{formatDateTime(assignment.notAvailableUntil)}</span> |
                                    </div>
                                    <div className="text-dark">
                                        <span className="fw-bold text-dark me-2">Due</span>
                                        {formatDateTime(assignment.due)}  | {assignment.score}
                                    </div>
                                </div>
                            </div>
                          
                            <div className="d-flex align-items-center">
                                <AssignmentControlButtons
                                    assignmentId={assignment._id}
                                    deleteAssignment={() => handleDeleteClick(assignment._id)}
                                    isFaculty={isFaculty}
                                />
                                <LessonControlButtons />
                            </div>
                        </li>
                    ))
                }
            </ul>

            {showDialog && (
                <div className="modal show d-block" tabIndex={-1}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Confirm Delete</h5>
                                <button type="button" className="btn-close" onClick={cancelDelete}></button>
                            </div>
                            <div className="modal-body">
                                <p>Are you sure you want to delete this assignment?</p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={cancelDelete}>Cancel</button>
                                <button type="button" className="btn btn-danger" onClick={confirmDelete}>Delete</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
