import { createSlice } from "@reduxjs/toolkit";

type Quiz = {
  _id: string;
  title: string;
  available_from: string;
  available_until: string;
  due_date: string;
  points: number;
  questions: number;
  published: boolean;
};

export const createInitialQuiz = () => ({
  title: "New Quiz",
  available_from: new Date().toISOString(),
  available_until: new Date().toISOString(),
  due_date: new Date().toISOString(),
  points: 100,
  questions: 10,
  published: false,
});

const initialState = {
  quizzes: [] as Quiz[],
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
    togglePublish: (state, { payload }) => {
      const quiz = state.quizzes.find((quiz) => quiz._id === payload.quizId);
      if (quiz) {
        quiz.published = payload.published;
      }
    },
    deleteQuiz: (state, { payload }) => {
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
