// src/Kanbas/Quizzes/types.ts
export type Question = {
    _id?: string;  // Use _id to match MongoDB
    id?: string;   // Keep id for backward compatibility
    title: string;
    type: 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'FILL_BLANK';
    points: number;
    question: string;
    choices?: string[];
    correctAnswer?: string | boolean;
    possibleAnswers?: string[];
};

export type Quiz = {
    _id: string;
    title: string;
    available_from: string;
    available_until: string;
    due_date: string;
    points: number;
    questions: Question[];
    published: boolean;

    course: String,
    description: String,  // Optional field
    timeLimit: Number,

    quizType: {
        type: String,
        enum: ["Graded Quiz", "Practice Quiz", "Graded Survey", "Ungraded Survey"],
        default: "Graded Quiz",
    },
    assignmentGroup: {
        type: String,
        enum: ["Quizzes", "Exams", "Assignments", "Project"],
        default: "Quizzes",
    },
    shuffleAnswers: { type: Boolean, default: false },
    multipleAttempts: { type: Boolean, default: false },
    attempts: { type: Number, default: 1 },
    showCorrectAnswers: { type: String, default: "Immediately" },
    accessCode: { type: String, default: "" },
    oneQuestionAtTime: { type: Boolean, default: true },
    webcamRequired: { type: Boolean, default: false },
    lockQuestionsAfterAnswering: { type: Boolean, default: false },
    lastAttempt?: {
        score: number;
        attemptDate: string;
      };
};
