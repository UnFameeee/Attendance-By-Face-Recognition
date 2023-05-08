import { createSlice } from "@reduxjs/toolkit";

const takeAttendanceSlice = createSlice({
  name: "takeAttendance",
  initialState: {
    isScaningPaused: false,
    isTakeAttendance: false,
    imageCapture: null,
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
    setImageCapture: (state, action) => {
      const { imageCapture } = action.payload;
      state.imageCapture = imageCapture;
    }
  },
});

export const { setIsScaningPaused, setIsTakeAttendance } = takeAttendanceSlice.actions;

export default takeAttendanceSlice.reducer;
