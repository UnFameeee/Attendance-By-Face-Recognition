import { createSlice } from "@reduxjs/toolkit";

const exceptionModalSlice = createSlice({
  name: "exceptionModal",
  initialState: {
    isExceptionModalOpen: false,
    failedCount: 0,
  },
  reducers: {
    setExceptionModalOpen: (state, action) => {
      const { isExceptionModalOpen } = action.payload;
      state.isExceptionModalOpen = isExceptionModalOpen;
    },
    setFailedCount: (state) => {
      state.failedCount = state.failedCount + 1;
    },
    resetFailedCount: (state) => {
      state.failedCount = 0;
    },
  },
});

export const {
  setAttendanceModalProps,
  setExceptionModalOpen,
  setFailedCount,
  resetFailedCount,
} = exceptionModalSlice.actions;

export default exceptionModalSlice.reducer;
