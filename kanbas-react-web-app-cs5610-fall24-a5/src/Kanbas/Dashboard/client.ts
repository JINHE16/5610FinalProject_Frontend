import axios from "axios";

const REMOTE_SERVER = process.env.REACT_APP_REMOTE_SERVER;
const USERS_API = `${REMOTE_SERVER}/api/users`;

export const enrollInCourse = async (userId: string, courseId: string) => {
    // Enroll a user in a course
    const { data } = await axios.post(`${USERS_API}/${userId}/enrollments`, { courseId });
    return data;
};

export const unenrollFromCourse = async (userId: string, courseId: string) => {
    // Unenroll a user from a course
    await axios.delete(`${USERS_API}/${userId}/enrollments/${courseId}`);
};
