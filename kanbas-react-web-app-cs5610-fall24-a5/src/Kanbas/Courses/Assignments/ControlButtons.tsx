import { IoEllipsisVertical } from "react-icons/io5";
import { FaPlus } from "react-icons/fa6";

export default function ControlButtons() {
    return (
        <div className="d-flex align-items-center">
            <div className="me-3">
                <div className="btn text-dark btn-outline-secondary rounded-pill px-3">
                    40% of Total
                </div>
            </div>
            <FaPlus className="me-3" />
            <IoEllipsisVertical className="fs-4" />
        </div>
    );
}
