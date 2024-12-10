import axios from "axios";
import { Quiz, Question } from './types';
const axiosWithCredentials = axios.create({ withCredentials: true });

const REMOTE_SERVER = process.env.REACT_APP_REMOTE_SERVER;
const COURSES_API = `${REMOTE_SERVER}/api/courses`;
const QUIZZES_API = `${REMOTE_SERVER}/api/quizzes`;

export const fetchAllQuizzesForCourse = async (courseId: string) => {
  const response = await axiosWithCredentials.get(`${COURSES_API}/${courseId}/quizzes`);
  return response.data;
};

export const fetchPublishedQuizzesForCourse = async (courseId: string) => {
  const response = await axiosWithCredentials.get(
    `${COURSES_API}/${courseId}/quizzes/published`,
    {
      params: { published: true },
    }
  );
  return response.data;
};

export const createQuiz = async (courseId: string, quizData: any) => {
  const response = await axiosWithCredentials.post(
    `${COURSES_API}/${courseId}/quizzes`,
    quizData
  );
  return response.data;
};
// 参照点
export const updateQuiz = async (courseId: string, quizId: string, quizData: any) => {
  // Make sure points and questions are included in quizData
  const response = await axiosWithCredentials.put(
    `${COURSES_API}/${courseId}/quizzes/${quizId}`,
    {
      ...quizData,
      points: quizData.questions?.reduce((sum: number, q: any) => sum + q.points, 0) || 0,
      questions: quizData.questions || []
    }
  );
  return response.data;
};

export const togglePublish = async (quizId: string, published: boolean) => {
  const response = await axiosWithCredentials.put(`${QUIZZES_API}/${quizId}/publish`, {
    published,
  });
  return response.data;
};

export const deleteQuiz = async (courseId: string, quizId: string) => {
  const response = await axiosWithCredentials.delete(
    `${COURSES_API}/${courseId}/quizzes/${quizId}`
  );
  return response.data;
};

export const getQuiz = async (quizId: string) => {
  const response = await axiosWithCredentials.get(`${QUIZZES_API}/${quizId}`);
  return response.data;
};


export const updateQuizQuestions = async (
  quizId: string, 
  questions: Question[]
) => {
  const response = await axiosWithCredentials.put(
    `${QUIZZES_API}/${quizId}/questions`, 
    { questions }
  );
  return response.data;
};

export const addQuestionToQuiz = async (quizId: string, questionData: Question) => {
  try {
    console.log("Adding question to quiz:", quizId, "with data:", questionData);
    const response = await axiosWithCredentials.post(
      `${QUIZZES_API}/${quizId}/questions`,
      questionData
    );
    return response.data;
  } catch (error) {
    console.error(`Error adding question to quiz ${quizId}:`, error);
    throw error;
  }
};

export const updateQuizQuestion = async (
  quizId: string, 
  questionId: string, 
  questionData: Question
) => {
  try {
    const response = await axiosWithCredentials.put(
      `${QUIZZES_API}/${quizId}/questions/${questionId}`,
      questionData
    );
    return response.data;
  } catch (error) {
    console.error(`Error updating question ${questionId} in quiz ${quizId}:`, error);
    throw error;
  }
};

export const deleteQuestionFromQuiz = async (quizId: string, questionId: string) => {
  try {
    // Send a DELETE request to the backend
    const response = await axiosWithCredentials.delete(
      `${QUIZZES_API}/${quizId}/questions/${questionId}`
    );

    // Log the response for debugging
    console.log(`Deleted question ${questionId} from quiz ${quizId}:`, response.data);

    return response.data; // Return the updated quiz
  } catch (error) {
    console.error(`Error deleting question ${questionId} from quiz ${quizId}:`, error);
    throw error; // Propagate the error to the calling function
  }
};

export const fetchLatestScoreForStudent = async (
  quizId: string,
  studentId: string
) => {
  const response = await axios.get(
    `${QUIZZES_API}/${quizId}/students/${studentId}/score/latest`
  );
  console.log("API Response for latest score:", response.data);
  return response.data.score;
};