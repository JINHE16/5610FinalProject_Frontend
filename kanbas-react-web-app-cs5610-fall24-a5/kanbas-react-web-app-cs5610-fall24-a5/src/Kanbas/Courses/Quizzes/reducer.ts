import {createSlice} from "@reduxjs/toolkit";

type QuizType = "Graded Quiz" | "Practice Quiz" | "Graded Survey" | "Ungraded Survey";
type AssignmentGroup = "Quizzes" | "Exams" | "Assignments" | "Project";

export type Quiz = {
    _id?: string;
    quizType: QuizType; // Default: "Graded Quiz"
    points: number; // Total points
    assignmentGroup: AssignmentGroup; // Default: "Quizzes"
    shuffleAnswers: boolean; // Default: true
    timeLimit: number; // Default: 20 (in minutes)
    multipleAttempts: boolean; // Default: false
    // viewResponses: boolean;
    howManyAttempts: number; // Default: 1
    showCorrectAnswers: boolean; // Indicates if/when answers are shown
    accessCode: string; // Default: empty string
    oneQuestionAtATime: boolean; // Default: true
    webcamRequired: boolean; // Default: false
    lockQuestionsAfterAnswering: boolean; // Default: false
    description: string; // Default:

    // 旧的quiz的部分定义变量
    title: string;
    available_from: string;
    available_until: string;
    due_date: string;
    questions: number;
    published: boolean;
}

const defaultQuizDetails: Quiz = {
    _id: "",
    quizType: "Graded Quiz",
    points: 0,
    assignmentGroup: "Quizzes",
    shuffleAnswers: true,
    timeLimit: 20,
    multipleAttempts: false,
    // viewResponses: true;
    howManyAttempts: 1,
    showCorrectAnswers: false,
    accessCode: "",
    oneQuestionAtATime: true,
    webcamRequired: false,
    lockQuestionsAfterAnswering: false,
    due_date: "", // Example: "2024-12-31T23:59:59Z"
    available_from: "",
    available_until: "",
    title: "New Quiz",
    questions: 0,
    published: false,
    description: "",
};

// export type Quiz = {
//     _id: string;
//     type: string;
//
//     assignmentGroup: string;
//     shuffleAnswers: boolean;
//     timeLimit: number;
//     multipleAttempts: boolean;
//     viewResponses: string;
//
//     title: string;
//     available_from: string;
//     available_until: string;
//     due_date: string;
//     points: number;
//     questions: number;
//     published: boolean;
// };

export const createInitialQuiz = () => ({
    // _id: "",
    quizType: "Graded Quiz",
    points: 0,
    assignmentGroup: "Quizzes",
    shuffleAnswers: true,
    timeLimit: 20,
    multipleAttempts: false,
    // viewResponses: true;
    howManyAttempts: 1,
    showCorrectAnswers: false,
    accessCode: "",
    oneQuestionAtATime: true,
    webcamRequired: false,
    lockQuestionsAfterAnswering: false,
    due_date: new Date().toISOString(),
    available_from: new Date().toISOString(),
    available_until: new Date().toISOString(),
    title: "New Quiz",
    questions: 0,
    published: false,
    description: "",
    // title: "New Quiz",
    // available_from: new Date().toISOString(),
    // available_until: new Date().toISOString(),
    // due_date: new Date().toISOString(),
    // points: 100,
    // questions: 10,
    // published: false,
});

const initialState = {
    quizzes: [] as Quiz[],
};

const quizSlice = createSlice({
    name: "quiz",
    initialState,
    reducers: {
        setQuizzes: (state, {payload}) => {
            state.quizzes = [...payload];
        },
        createQuiz: (state, {payload}) => {
            state.quizzes = [...state.quizzes, payload];
        },
        updateQuiz: (state, {payload}) => {
            state.quizzes = state.quizzes.map((quiz) =>
                quiz._id === payload._id ? payload : quiz
            );
        },
        togglePublish: (state, {payload}) => {
            const quiz = state.quizzes.find((quiz) => quiz._id === payload.quizId);
            if (quiz) {
                quiz.published = payload.published;
            }
        },
        deleteQuiz: (state, {payload}) => {
            state.quizzes = state.quizzes.filter((quiz) => quiz._id !== payload);
        },
    },
});

export const {
    setQuizzes,
    createQuiz,
    updateQuiz,
    togglePublish,
    deleteQuiz,
} = quizSlice.actions;

export default quizSlice.reducer;
