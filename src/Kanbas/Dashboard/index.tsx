import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Dashboard(
    { courses, allCourses, course, setCourse, addNewCourse,
        deleteCourse, updateCourse, handleEnrollToggle }:
        {
            courses: any[];
            allCourses: any[];
            course: any;
            setCourse: (course: any) => void;
            addNewCourse: () => void;
            deleteCourse: (course: any) => void;
            updateCourse: () => void;
            handleEnrollToggle: (courseId: string, isEnrolled: boolean) => Promise<void>;
        }
) {
    const { currentUser } = useSelector((state: any) => state.accountReducer);
    const [showAllCourses, setShowAllCourses] = useState(false);
    const isFaculty = currentUser.role === "FACULTY";
    const isStudent = currentUser.role == "STUDENT";
    const isAdmin = currentUser.role === "ADMIN";

    const initialstate ={
        courses:[],// Ensure new users have an empty array
        allCourses:[]// Populate all available courses
    };
    
    const handleToggleEnrollments = () => {
        setShowAllCourses(!showAllCourses);
    };

    const visibleCourses = isAdmin ? allCourses :
        (showAllCourses ? allCourses : courses);

    return (
        <div id="wd-dashboard">
            <h1 id="wd-dashboard-title">Dashboard</h1> <hr />
            {(isFaculty || isAdmin) && (
                <>
                    <h5>New Course
                        <button
                            className="btn btn-primary float-end"
                            id="wd-add-new-course-click"
                            onClick={addNewCourse}
                        >
                            Add
                        </button>
                        <button
                            className="btn btn-warning float-end me-2"
                            onClick={updateCourse}
                            id="wd-update-course-click"
                        >
                            Update
                        </button>
                    </h5> <br />
                    <input
                        value={course.name}
                        className="form-control mb-2"
                        onChange={(e) => setCourse({ ...course, name: e.target.value })}
                    />
                    <textarea
                        value={course.description}
                        className="form-control"
                        onChange={(e) => setCourse({ ...course, description: e.target.value })}
                    />
                    <hr />
                </>
            )}

            {isStudent && (
                <div className="d-flex justify-content-end mb-3">
                    <button className="btn btn-primary" onClick={handleToggleEnrollments}>
                        {showAllCourses ? "Show Enrolled Courses" : "Show All Courses"}
                    </button>
                </div>
            )}

            <h2 id="wd-dashboard-published">
                {isAdmin ?
                    "All Courses" :
                    (showAllCourses ? "All Courses" : "Enrolled Courses")}
                ({visibleCourses.length})
            </h2>

            <div id="wd-dashboard-courses" className="row">
                <div className="row row-cols-1 row-cols-md-5 g-4">
                    {visibleCourses.map((course) => {
                        const isEnrolled = courses.some((c) => c._id === course._id);
                        return (
                            <div key={course._id} className="wd-dashboard-course col" style={{ width: "300px" }}>
                                <div className="card rounded-3 overflow-hidden">
                                    <Link to={`/Kanbas/Courses/${course._id}/Home`}
                                        className="wd-dashboard-course-link text-decoration-none text-dark"
                                        onClick={() => console.log(`Navigating to course: ${course._id}`)}>
                                        <img src="/images/course_banner.png" width="100%" height={160} />
                                        <div className="card-body">
                                            <h5 className="wd-dashboard-course-title card-title">
                                                {course.name} </h5>
                                            <p className="wd-dashboard-course-title card-text overflow-y-hidden" style={{ maxHeight: 100 }}>
                                                {course.description} </p>
                                            <button className="btn btn-primary"> Go </button>
                                            {isStudent && (
                                                <button
                                                    className={`btn float-end ${isEnrolled ? "btn-danger" : "btn-success"}`}
                                                    onClick={(event) => {
                                                        event.preventDefault(); // Prevent default behavior
                                                        handleEnrollToggle(course._id, isEnrolled);
                                                    }}
                                                >
                                                    {isEnrolled ? "Unenroll" : "Enroll"}
                                                </button>
                                            )}
                                            {(isFaculty || isAdmin) && (
                                                <>
                                                    <button onClick={(event) => {
                                                        event.preventDefault();
                                                        deleteCourse(course._id);
                                                    }} className="btn btn-danger float-end"
                                                        id="wd-delete-course-click">
                                                        Delete
                                                    </button>
                                                    <button id="wd-edit-course-click"
                                                        onClick={(event) => {
                                                            event.preventDefault(); 
                                                            setCourse(course);
                                                        }}
                                                        className="btn btn-warning me-2 float-end" >
                                                        Edit
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
