import { IoEllipsisVertical } from "react-icons/io5";
import GreenCheckmark from "./GreenCheckmark";
import { FaPlus } from "react-icons/fa6";
import { FaTrash } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";

export default function LessonControlButtons(
  { moduleId, deleteModule, editModule, isFaculty}:
    {
      moduleId: string; 
      deleteModule:(moduleId: string) => void; 
      editModule: (moduleId: string) => void;
      isFaculty: boolean;
    }
) {
  return (
    <div className="float-end">
     {isFaculty && (
        <>
          <FaPencil onClick={() => editModule(moduleId)} className="text-primary me-3" />
          <FaTrash className="text-danger me-2 mb-1" onClick={() => deleteModule(moduleId)} />
        </>
      )}
      <GreenCheckmark />
      <FaPlus />
      <IoEllipsisVertical className="fs-4" />
    </div>
  );
}
 