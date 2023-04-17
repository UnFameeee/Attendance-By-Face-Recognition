import { createSlice } from "@reduxjs/toolkit";

const attendanceModalSlice = createSlice({
  name: "attendanceModal",
  initialState: {
    isModalOpen: false,
    employeeId: "",
  },
  reducers: {
    setAttendanceModalProps: (state, action) => {
      const { isModalOpen, employeeId } = action.payload;
      state.isModalOpen = isModalOpen;
      state.employeeId = employeeId;
    },
    setIsModalOpen: (state, action) => {
      const { isModalOpen } = action.payload;
      state.isModalOpen = isModalOpen;
    },
    setEmployeeId: (state, action) => {
      const { employeeId } = action.payload;
      state.employeeId = employeeId;
    },
  },
});

export const { setAttendanceModalProps, setIsModalOpen, setEmployeeId } = attendanceModalSlice.actions;

export default attendanceModalSlice.reducer;
