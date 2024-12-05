import { FaPlus } from "react-icons/fa6";
import GreenCheckmark from "./GreenCheckmark";
import UnCheckmark from "./UnCheckmark";
import "../../style.css";
import ModuleEditor from "./ModuleEditor";

export default function ModulesControls(
    { moduleName, setModuleName, addModule, isFaculty }:
    { moduleName: string; setModuleName: (title: string) => void; addModule: () => void; isFaculty: boolean;}
) {
  return (
    <div id="wd-modules-controls" className="d-flex justify-content-end text-nowrap">
      {/* Collapse All button */}
      <button id="wd-collapse-all" className="btn btn-lg btn-secondary me-1">
        Collapse All
      </button>

      {/* View Progress button */}
      <button id="wd-view-progress" className="btn btn-lg btn-secondary me-1">
        View Progress
      </button>

      {/* Dropdown for Publish All */}
      <div className="dropdown d-inline me-1">
        <button id="wd-publish-all-btn" className="btn btn-lg btn-secondary dropdown-toggle"
          type="button" data-bs-toggle="dropdown">
          <GreenCheckmark />
          Publish All
        </button>
        <ul className="dropdown-menu">
          <li>
            <a id="wd-publish-all-modules-and-items-btn" className="dropdown-item" href="#">
              <GreenCheckmark />
              Publish all modules and items
            </a>
          </li>
          <li>
            <a id="wd-publish-modules-only-button" className="dropdown-item" href="#">
              <GreenCheckmark />
              Publish modules only
            </a>
          </li>
          {/* Unpublish options */}
          <li>
            <a id="wd-unpublish-all-modules-and-items" className="dropdown-item" href="#">
            <UnCheckmark />
              Unpublish all modules and items
            </a>
          </li>
          <li>
            <a id="wd-unpublish-modules-only" className="dropdown-item" href="#">
            <UnCheckmark/>
              Unpublish modules only
            </a>
          </li>
        </ul>
      </div>

      {/* Add Module button */}
      {isFaculty && (
        <>
          <button id="wd-add-module-btn" className="btn btn-lg btn-danger"
            data-bs-toggle="modal" data-bs-target="#wd-add-module-dialog">
            <FaPlus className="position-relative me-2" style={{ bottom: "1px" }} />
            Module
          </button>
          
          <ModuleEditor
            dialogTitle="Add Module"
            moduleName={moduleName}
            setModuleName={setModuleName}
            addModule={addModule}
          />
        </>
      )}

    </div>
  );
}
