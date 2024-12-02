import { FaTrash } from "react-icons/fa6";

export default function AssignmentControlButtons({
    assignmentId, deleteAssignment, isFaculty 
}: {
    assignmentId: string,
    deleteAssignment: (assignmentId: string) => void,
    isFaculty: boolean
}) {
    return (
        <div className="float-end">
            {isFaculty && (
                <FaTrash
                    className="text-danger me-2 mb-1"
                    style={{ cursor: 'pointer' }}
                    onClick={() => deleteAssignment(assignmentId)}
                />
            )}
        </div>
    );
}
