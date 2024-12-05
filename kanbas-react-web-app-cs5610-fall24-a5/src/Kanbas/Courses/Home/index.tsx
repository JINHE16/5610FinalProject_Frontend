import Modules from "../Modules";
import CourseStatus from "./Status";

export default function Home() {
    return (
        <div className="d-flex" id="wd-home">
            <div className="flex-fill me-4">
                <Modules />
            </div>
            <div className="d-none d-md-block">
                <CourseStatus />
            </div>
        </div>
    );
}