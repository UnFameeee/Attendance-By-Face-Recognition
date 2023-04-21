import { createSlice } from "@reduxjs/toolkit";

const attendanceModalSlice = createSlice({
  name: "attendanceModal",
  initialState: {
    isAttendanceModalOpen: false,
    employeeId: null,
  },
  reducers: {
    setAttendanceModalProps: (state, action) => {
      const { isAttendanceModalOpen, employeeId } = action.payload;
      state.isAttendanceModalOpen = isAttendanceModalOpen;
      state.employeeId = employeeId;
    },
    setAttendanceModalOpen: (state, action) => {
      const { isAttendanceModalOpen } = action.payload;
      state.isAttendanceModalOpen = isAttendanceModalOpen;
    },
    setEmployeeId: (state, action) => {
      const { employeeId } = action.payload;
      state.employeeId = employeeId;
    },
  },
});

export const { setAttendanceModalProps, setAttendanceModalOpen, setEmployeeId } = attendanceModalSlice.actions;

export default attendanceModalSlice.reducer;
