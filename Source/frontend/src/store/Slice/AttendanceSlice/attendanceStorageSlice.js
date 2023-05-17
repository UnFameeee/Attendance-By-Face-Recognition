import { createSlice } from "@reduxjs/toolkit";

const attendanceStorageSlice = createSlice({
  name: "attendanceStorage",
  initialState: {
    imageCapture: null,
    imageExceptionCapture: null,
  },
  reducers: {
    setImageCapture: (state, action) => {
      const { imageCapture } = action.payload;
      state.imageCapture = imageCapture;
    },
    setImageExceptionCapture: (state, action) => {
      const { imageExceptionCapture } = action.payload;
      state.imageExceptionCapture = imageExceptionCapture;
    }
  },
});

export const { setImageCapture, setImageExceptionCapture } = attendanceStorageSlice.actions;

export default attendanceStorageSlice.reducer;