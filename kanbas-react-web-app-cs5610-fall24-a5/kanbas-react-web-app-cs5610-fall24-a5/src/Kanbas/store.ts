import { configureStore } from "@reduxjs/toolkit";
import modulesReducer from "./Courses/Modules/reducer";
import accountReducer from "./Account/reducer";
import assignmentReducer from "./Courses/Assignments/reducer";
import dashboardReducer from "./Dashboard/reducer";

const store = configureStore({
  reducer: {
    modulesReducer,
    accountReducer,
    assignments: assignmentReducer,
    dashboard: dashboardReducer, 
  },
});
export default store;