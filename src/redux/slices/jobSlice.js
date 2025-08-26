import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  applications: [],
};

const jobSlice = createSlice({
  name: "jobs",
  initialState,
  reducers: {
    setApplications: (state, action) => {
      state.applications = action.payload;
    },
    addApplication: (state, action) => {
      state.applications.push(action.payload);
    },
    updateApplication: (state, action) => {
      const index = state.applications.findIndex(
        (app) => app.id === action.payload.id
      );
      if (index !== -1) {
        state.applications[index] = action.payload;
      }
    },
    deleteApplication: (state, action) => {
      state.applications = state.applications.filter(
        (app) => app.id !== action.payload
      );
    },
  },
});

export const { setApplications, addApplication, updateApplication, deleteApplication } =
  jobSlice.actions;
export default jobSlice.reducer;
