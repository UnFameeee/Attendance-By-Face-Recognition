import { createSlice } from "@reduxjs/toolkit";

const takeAttendanceSlice = createSlice({
  name: "takeAttendance",
  initialState: {
    isScaningPaused: false,
    isTakeAttendance: false,
  },
  reducers: {
    setIsScaningPaused: (state, action) => {
      const { isScaningPaused } = action.payload;
      state.isScaningPaused = isScaningPaused;
    },
    setIsTakeAttendance: (state, action) => {
      const { isTakeAttendance } = action.payload;
      state.isTakeAttendance = isTakeAttendance;
    },
  },
});

export const { setIsScaningPaused, setIsTakeAttendance } = takeAttendanceSlice.actions;

export default takeAttendanceSlice.reducer;
