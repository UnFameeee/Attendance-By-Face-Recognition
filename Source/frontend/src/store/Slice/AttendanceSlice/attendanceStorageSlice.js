import { createSlice } from "@reduxjs/toolkit";

const attendanceStorageSlice = createSlice({
  name: "attendanceStorage",
  initialState: {
    imageCapture: null,
  },
  reducers: {
    setImageCapture: (state, action) => {
      const { imageCapture } = action.payload;
      state.imageCapture = imageCapture;
    }
  },
});

export const { setImageCapture } = attendanceStorageSlice.actions;

export default attendanceStorageSlice.reducer;