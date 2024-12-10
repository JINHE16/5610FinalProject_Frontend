import { createSlice } from "@reduxjs/toolkit";
import { Quiz, Question } from './types';

export const createInitialQuiz = () => ({
  title: "New Quiz",
  available_from: new Date().toISOString(),
  available_until: new Date().toISOString(),
  due_date: new Date().toISOString(),
  points: 0,
  questions: [],  // Initialize with empty array
  published: false,
  scores: [],
});

const initialState = {
  quizzes: [] as Quiz[],
  latestScores: {} as { [quizId: string]: number },
};

const quizSlice = createSlice({
  name: "quiz",
  initialState,
  reducers: {
    setQuizzes: (state, { payload }) => {
      state.quizzes = [...payload];
    },
    createQuiz: (state, { payload }) => {
      state.quizzes = [...state.quizzes, payload];
    },
    updateQuiz: (state, { payload }) => {
      state.quizzes = state.quizzes.map((quiz) =>
        quiz._id === payload._id ? payload : quiz
      );
    },
    addQuestion: (state, { payload }) => {
      const { quizId, question } = payload;
      const quiz = state.quizzes.find((quiz) => quiz._id === quizId);
      if (quiz) {
        quiz.questions.push(question);
        quiz.points += question.points; // Update points
      }
    },
    updateQuestion: (state, { payload }) => {
      const { quizId, questionId, question } = payload;
      const quiz = state.quizzes.find((quiz) => quiz._id === quizId);
      if (quiz) {
        const existingQuestion = quiz.questions.find((q) => q.id === questionId);
        if (existingQuestion) {
          Object.assign(existingQuestion, question); // Update question fields
          quiz.points = quiz.questions.reduce((sum, q) => sum + q.points, 0); // Recalculate points
        }
      }
    },
    deleteQuestion: (state, { payload }) => {
      const { quizId, questionId } = payload;
      const quiz = state.quizzes.find((quiz) => quiz._id === quizId);
      if (quiz) {
        quiz.questions = quiz.questions.filter((q) => q.id !== questionId);
        quiz.points = quiz.questions.reduce((sum, q) => sum + q.points, 0); // Recalculate points
      }
    },
    togglePublish: (state, { payload }) => {
      const quiz = state.quizzes.find((quiz) => quiz._id === payload.quizId);
      if (quiz) {
        quiz.published = payload.published;
      }
    },
    deleteQuiz: (state, { payload }) => {
      state.quizzes = state.quizzes.filter((quiz) => quiz._id !== payload);
    },
    setLatestScore: (state, { payload }) => {
      const { quizId, score } = payload;
      state.latestScores[quizId] = score;
    },
  },
});

export const {
  setQuizzes,
  createQuiz,
  updateQuiz,
  addQuestion,
  updateQuestion,
  deleteQuestion,
  togglePublish,
  deleteQuiz,
  setLatestScore,
  // setLastAttempt,
} = quizSlice.actions;

export default quizSlice.reducer;
