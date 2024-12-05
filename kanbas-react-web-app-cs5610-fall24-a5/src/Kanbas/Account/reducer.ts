import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  currentUser: null,
};
const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
    },

    logoutUser: (state) => {
      state.currentUser = null;
    },
  },
});
export const { setCurrentUser, logoutUser} = accountSlice.actions;
export default accountSlice.reducer;

