import {AiOutlinePlus} from "react-icons/ai";
import {IoEllipsisVertical} from "react-icons/io5";
import {RiArrowDropDownFill} from "react-icons/ri";
import {RxRocket} from "react-icons/rx";
import {FaBan} from "react-icons/fa";
import GreenCheckmark from "../Modules/GreenCheckmark";
import {useParams, useNavigate} from "react-router-dom";
import {useSelector, useDispatch} from "react-redux";
import { useEffect } from "react";
import * as client from "./client";
import {
    createQuiz,
    createInitialQuiz,
    deleteQuiz,
    setQuizzes,
    togglePublish,
    setLatestScore,
} from "./reducer";
import {Dropdown} from "react-bootstrap";
import ProtectedRoute from "../../Account/ProtectedRoute";

export default function Quizzes() {
    const {cid} = useParams();
    const { quizzes, latestScores } = useSelector(
        (state: any) => state.quizReducer
    );
    const {currentUser} = useSelector((state: any) => state.accountReducer);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const loadQuizzesForCourse = async (courseId: string) => {
        const fetchMethod =
            currentUser.role === "FACULTY" || currentUser.role === "ADMIN"
                ? client.fetchAllQuizzesForCourse
                : client.fetchPublishedQuizzesForCourse;
        const quizzesData = await fetchMethod(courseId);
        dispatch(setQuizzes(quizzesData));
    };
    const handleCreateQuiz = async () => {
        const newQuiz = createInitialQuiz();
        const createdQuiz = await client.createQuiz(cid as string, newQuiz);
        dispatch(createQuiz(createdQuiz));
        navigate(`${createdQuiz._id}`);
    };
    const handleTogglePublish = async (quizId: string, published: boolean) => {
        const updatedQuiz = await client.togglePublish(quizId, published);
        dispatch(
            togglePublish({
                quizId: updatedQuiz._id,
                published: updatedQuiz.published,
            })
        );
    };
    const handleDelete = async (courseId: string, quizId: string) => {
        await client.deleteQuiz(courseId, quizId);
        dispatch(deleteQuiz(quizId));
    };
    const fetchLatestScore = async (quizId: string) => {
        const score = await client.fetchLatestScoreForStudent(
          quizId,
          currentUser._id
        );
        dispatch(setLatestScore({ quizId, score }));
    };
    useEffect(() => {
        if (cid) {
            loadQuizzesForCourse(cid);
        }
    }, [cid]);
    useEffect(() => {
        quizzes.forEach((quiz: any) => {
          fetchLatestScore(quiz._id);
        });
    }, [quizzes]);

    const formatDate = (isoDate: string) =>
        new Date(isoDate)
            .toLocaleString("en-US", {
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
                hour12: true,
            })
            .replace(",", "")
            .replace(/(AM|PM)/g, (match) => match.toLowerCase());
    const isClosed = (availableUntil: string) =>
        new Date(availableUntil) < new Date();
    const isAvailable = (availableFrom: string, availableUntil: string) =>
        new Date() >= new Date(availableFrom) &&
        new Date() <= new Date(availableUntil);

    return (
        <div id="wd-quiz-list" className="container">
            {/* top section */}
            <div className="d-flex justify-content-between align-items-center mb-3">
                <input
                    type="text"
                    className="form-control w-50 h-auto"
                    placeholder="Search for Quiz"
                />
                <ProtectedRoute isDataReady={true} requiredRole={["FACULTY", "ADMIN"]}>
                    <div>
                        <button className="btn btn-danger me-2" onClick={handleCreateQuiz}>
                            <AiOutlinePlus/> Quiz
                        </button>
                        <button className="btn btn-light">
                            <IoEllipsisVertical className="fs-4"/>
                        </button>
                    </div>
                </ProtectedRoute>
            </div>
            <hr/>

            {/* bottom section */}
            {quizzes.length > 0 && (
                <ul id="wd-quiz-list" className="list-group rounded-0">
                    <li className="list-group-item p-0 mb-5 fs-5 border-gray">
                        <div className="wd-title p-4 ps-3 bg-light">
                            <RiArrowDropDownFill className="me-2 fs-4"/>
                            Assignment Quizzes
                        </div>
                        <ul
                            className="wd-quiz-list-item list-group rounded-0 border-gray"
                            style={{borderLeft: "3px solid green"}}
                        >
                            {quizzes.map((quiz: any) => (
                                <li key={quiz._id} className="list-group-item p-3">
                                    <div className="d-flex justify-content-between align-items-center">
                                        {/* bottom left: icons */}
                                        <div className="d-flex align-items-center">
                                            <RxRocket className="text-success me-2 fs-3"/>
                                        </div>

                                        {/* bottom middle: content */}
                                        <div className="flex-grow-1 mx-3">
                                            {/*点击quiz名称进行跳转*/}
                                            <a
                                                className="wd-quiz-link fw-bold text-dark text-decoration-none"
                                                // href={`#/Kanbas/Courses/${cid}/Quizzes/${quiz._id}`}
                                                onClick={() => navigate(`/Kanbas/Courses/${cid}/Quizzes/${quiz._id}`)}
                                                style={{cursor: 'pointer'}}
                                            >
                                                {quiz.title}
                                            </a>
                                            <div>
                                                {isClosed(quiz.available_until) ? (
                                                    <strong>Closed</strong>
                                                ) : isAvailable(
                                                    quiz.available_from,
                                                    quiz.available_until
                                                ) ? (
                                                    <>
                                                        <strong>Available until</strong>&nbsp;
                                                        {formatDate(quiz.available_until)}
                                                    </>
                                                ) : (
                                                    <>
                                                        <strong>Not available from</strong>&nbsp;
                                                        {formatDate(quiz.available_from)}
                                                    </>
                                                )}
                                                <>
                                                    &nbsp;&#124;&nbsp;<strong>Due</strong>&nbsp;
                                                    {formatDate(quiz.due_date)}
                                                    &nbsp;&#124;&nbsp;{quiz.points}&nbsp;pts
                                                    &nbsp;&#124;&nbsp;{Array.isArray(quiz.questions) ? quiz.questions.length : 0}&nbsp;questions
                                                    &nbsp;&#124;&nbsp;
                                                    <ProtectedRoute
                                                        isDataReady={true}
                                                        requiredRole={"STUDENT"}
                                                    >
                                                        {latestScores[quiz._id] != null
                                                            ? `${latestScores[quiz._id]} / ${quiz.points} pts`
                                                            : `- / ${quiz.points} pts`}
                                                    </ProtectedRoute>
                                                    <ProtectedRoute
                                                        isDataReady={true}
                                                        requiredRole={["FACULTY", "ADMIN"]}
                                                    >
                                                        {quiz.points} pts
                                                    </ProtectedRoute>
                                                </>
                                            </div>
                                        </div>

                                        {/* bottom right: controls */}
                                        <ProtectedRoute isDataReady={true} requiredRole={["FACULTY", "ADMIN"]}>
                                            <div className="d-flex align-items-center">
                                                <button
                                                    className="btn p-0"
                                                    onClick={() =>
                                                        handleTogglePublish(quiz._id, !quiz.published)
                                                    }
                                                >
                                                    {quiz.published ? (
                                                        <GreenCheckmark/>
                                                    ) : (
                                                        <FaBan className="text-danger fs-4"/>
                                                    )}
                                                </button>
                                                <Dropdown className="ms-2">
                                                    <Dropdown.Toggle
                                                        variant="light"
                                                        id="dropdown-custom-components"
                                                    >
                                                        <IoEllipsisVertical className="fs-4 ms-2"/>
                                                    </Dropdown.Toggle>
                                                    <Dropdown.Menu>
                                                        <Dropdown.Item
                                                            href={`#/Kanbas/Courses/${cid}/Quizzes/${quiz._id}`}
                                                        >
                                                            Edit
                                                        </Dropdown.Item>
                                                        <Dropdown.Item
                                                            onClick={() =>
                                                                handleDelete(cid as string, quiz._id)
                                                            }
                                                        >
                                                            Delete
                                                        </Dropdown.Item>
                                                        <Dropdown.Item
                                                            onClick={() =>
                                                                handleTogglePublish(quiz._id, !quiz.published)
                                                            }
                                                        >
                                                            {quiz.published ? "Unpublish" : "Publish"}
                                                        </Dropdown.Item>
                                                        <Dropdown.Item>Copy</Dropdown.Item>
                                                        <Dropdown.Item>Sort</Dropdown.Item>
                                                    </Dropdown.Menu>
                                                </Dropdown>
                                            </div>
                                        </ProtectedRoute>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </li>
                </ul>
            )}
        </div>
    );
}
