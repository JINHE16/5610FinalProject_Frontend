import { configureStore } from "@reduxjs/toolkit";
import modulesReducer from "./Courses/Modules/reducer";
import accountReducer from "./Account/reducer";
import dashboardReducer from "./Dashboard/reducer";
import quizReducer from "./Courses/Quizzes/reducer";

const store = configureStore({
  reducer: {
    modulesReducer,
    accountReducer,
    dashboard: dashboardReducer, 
    quizReducer,
  },
});
export default store;