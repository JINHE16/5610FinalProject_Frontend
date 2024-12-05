import React from 'react';
import { CiSearch } from "react-icons/ci";
import { FaPlus } from "react-icons/fa6";
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from "react-router-dom";

export default function AssignmentControl({ isFaculty }: { isFaculty: boolean }) {
    const navigate = useNavigate();
    const { cid } = useParams();
    const assignments = useSelector((state: any) => state.assignments.assignments);

    const getNextAssignmentId = () => {
        const courseAssignments = assignments
            .filter((assignment: any) => assignment.course === cid) // Filter by current course ID
            .map((assignment: any) => assignment._id)
            .filter((id: any) => /^A\d+$/.test(id)) // Keep only IDs in "A" + digits format
            .map((id: any) => parseInt(id.slice(1), 10)) // Convert numeric part to integer
            .sort((a: any, b: any) => a - b);

        const highestIdNumber = courseAssignments.length ? courseAssignments[courseAssignments.length - 1] : 100;
        return `A${highestIdNumber + 1}`;
    };

    const handleAddAssignment = () => {
        const newId = getNextAssignmentId();
        navigate(`/Kanbas/Courses/${cid}/Assignments/${newId}`);
    };

    return (
        <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="input-group" style={{ width: "250px" }}>
                <span className="input-group-text bg-white border-end-0">
                    <CiSearch className="text-muted me-1 fs-5" />
                </span>
                <input
                    type="text"
                    className="form-control border-start-0"
                    placeholder="Search..."
                    aria-label="Search"
                />
            </div>
            <div>
                <button
                    id="wd-add-assignment-group"
                    className="btn bg-secondary-subtle text-black me-2 btn-outline-secondary-subtle"
                >
                    <FaPlus className="me-1" />Group
                </button>
                {isFaculty && (
                    <button
                        id="wd-add-assignment"
                        className="btn btn-danger text-white btn-outline-danger"
                        onClick={handleAddAssignment}
                    >
                        <FaPlus className="me-1" />Assignment
                    </button>
                )}
            </div>
        </div>
    );
}
