import { createSlice } from "@reduxjs/toolkit";

interface Enrollment {
    _id: string;
    user: string; 
    course: string; 
}

interface DashboardState {
    courses: any[]; 
    enrollments: Enrollment[];
    currentUser: any;
}

const initialState: DashboardState = {
    courses: [], 
    enrollments: [],
    currentUser: {}, 
};

const dashboardSlice = createSlice({
    name: "dashboard",
    initialState,
    reducers: {
        setEnrollments: (state, action) => {
            state.enrollments = action.payload;
        },
        enrollCourse: (state, action) => {
            console.log("Enroll course action:", action.payload);
            // Use the _id from the server response
            state.enrollments.push({
                _id: action.payload._id, // Use server-generated ID
                user: action.payload.userId,
                course: action.payload.courseId
            });
            console.log("Updated state:", state.enrollments);
        },
        unenrollCourse: (state, action) => {
            state.enrollments = state.enrollments.filter(
                enrollment => 
                    !(enrollment.user === action.payload.userId && 
                      enrollment.course === action.payload.courseId)
            );
        }
    },
});

export const {setEnrollments, enrollCourse, unenrollCourse } =
    dashboardSlice.actions;
export default dashboardSlice.reducer;
