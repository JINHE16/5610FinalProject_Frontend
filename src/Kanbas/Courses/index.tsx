import CoursesNavigation from "./Navigation";
import Modules from "./Modules";
import Home from "./Home";
import { Navigate, Route, Routes, useParams, useLocation } from "react-router";
import { FaAlignJustify } from "react-icons/fa";
// import { courses } from "../Database";
import Quizzes from "./Quizzes";
import QuizEditor from "./Quizzes/Editor";
import QuizDetails from "./Quizzes/QuizDetails";
import Editor from "./Quizzes/Editor";
import QuizPreview from "./Quizzes/QuizPreview";
import QuizStart from "./Quizzes/QuizStart";

export default function Courses({ courses }: { courses: any[]; }) {
    const { cid } = useParams();
    const course = courses.find((course) => course._id === cid);
    const { pathname } = useLocation();
    return (
        <div id="wd-courses">
            <h2 className="text-danger">
                <FaAlignJustify className="me-4 fs-4 mb-1" />
                {course && course.name} &gt; {pathname.split("/")[4]}
            </h2><hr />
            <div className="d-flex">
                <div className="d-none d-md-block">
                    <CoursesNavigation />
                </div>
                <div className="flex-fill">
                    <Routes>
                        <Route path="/" element={<Navigate to="Home" />} />
                        <Route path="Home" element={<Home />} />
                        <Route path="Modules" element={<h2>Modules</h2>} />
                        <Route path="Piazza" element={<h2>Piazza</h2>} />
                        <Route path="Zoom" element={<h2>Zoom</h2>} />
                        <Route path="Assignments" element={<h2>Assignments</h2>} />
                        <Route path="Assignments/:aid" element={<h2>Assignments</h2>} />
                        <Route path="Quizzes" element={<Quizzes />} />
                        <Route path ="Quizzes/:qid" element={<QuizDetails />} />
                        <Route path ="Quizzes/:qid/editor" element={<Editor />} />
                        <Route path="Quizzes/:qid/preview" element={<QuizPreview />} />
                        <Route path="Quizzes/:qid/start" element={<QuizStart />} />
                        <Route path="Grades" element={<h2>Grades</h2>} />
                        <Route path="People" element={<h2>People</h2>} />
                    </Routes>
                </div>
            </div>
        </div>
    );
}
