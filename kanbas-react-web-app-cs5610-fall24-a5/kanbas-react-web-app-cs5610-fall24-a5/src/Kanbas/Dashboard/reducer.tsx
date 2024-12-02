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
            const { userId, courseId } = action.payload;
        
            if (!state.enrollments.some(enrollment => enrollment.user === userId && enrollment.course === courseId)) {
                state.enrollments.push({
                    _id: new Date().getTime().toString(),
                    user: userId,
                    course: courseId,
                });
                console.log("Enroll course action:", action.payload);
                console.log("Updated state:", JSON.stringify(state.enrollments, null, 2));
            }
        },
        
        unenrollCourse: (state, action) => {
            const { userId, courseId } = action.payload;
            state.enrollments = state.enrollments.filter(
                (enrollment) => !(enrollment.user === userId && enrollment.course === courseId)
            );
            console.log("Unenroll course action:", action.payload);
            console.log("Updated state:", JSON.stringify(state.enrollments, null, 2));
        },
    },
});

export const {setEnrollments, enrollCourse, unenrollCourse } =
    dashboardSlice.actions;
export default dashboardSlice.reducer;
