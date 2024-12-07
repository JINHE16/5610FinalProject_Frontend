import axios from "axios";
import quizDetails from "./QuizDetails";
import {Quiz} from "./reducer";
const REMOTE_SERVER = process.env.REACT_APP_REMOTE_SERVER;
const COURSES_API = `${REMOTE_SERVER}/api/courses`;
const QUIZZES_API = `${REMOTE_SERVER}/api/quizzes`;

export const fetchAllQuizzesForCourse = async (courseId: string) => {
  const response = await axios.get(`${COURSES_API}/${courseId}/quizzes`);
  return response.data;
};

export const fetchPublishedQuizzesForCourse = async (courseId: string) => {
  const response = await axios.get(
    `${COURSES_API}/${courseId}/quizzes/published`,
    {
      params: { published: true },
    }
  );
  return response.data;
};

export const createQuiz = async (courseId: string, quizData: any) => {
  const response = await axios.post(
    `${COURSES_API}/${courseId}/quizzes`,
    quizData
  );
  return response.data;
};

export const updateQuiz = async (
  courseId: string,
  quizId: string,
  quizData: any
) => {
  const response = await axios.put(
    `${COURSES_API}/${courseId}/quizzes/${quizId}`,
    quizData
  );
  return response.data;
};

export const togglePublish = async (quizId: string, published: boolean) => {
  const response = await axios.put(`${QUIZZES_API}/${quizId}/publish`, {
    published,
  });
  return response.data;
};

export const deleteQuiz = async (courseId: string, quizId: string) => {
  const response = await axios.delete(
    `${COURSES_API}/${courseId}/quizzes/${quizId}`
  );
  return response.data;
};

// 定义：返回符合courseId和quizId的quiz
export const fetchQuizDetails = async (courseId: string, quizId: string) => {
    const response = await axios.get(
        `${COURSES_API}/${courseId}/quizzes/${quizId}`
    );
    return response.data;
}

export const updateQuizDetails = async (courseId: string, quizId: string, quizDetails: Quiz) => {
    const response = await axios.put(
        `${COURSES_API}/${courseId}/quizzes/${quizId}`,
        quizDetails
    );
    return response.data;
}

