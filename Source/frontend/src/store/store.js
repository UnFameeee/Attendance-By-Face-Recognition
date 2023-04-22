import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import responsiveReducer from "./Slice/responsiveSlice";
import authReducer from "./Slice/authSlice";
import exceptionModalReducer from "./Slice/AttendanceSlice/exceptionModalSlice";
import attendanceModalReducer from "./Slice/AttendanceSlice/attendanceModalSlice";
import takeAttendanceReducer from "./Slice/AttendanceSlice/takeAttendanceSlice";

export const store = configureStore({
  reducer: {
    responsive: responsiveReducer,
    auth: authReducer,
    attendanceModal: attendanceModalReducer,
    exceptionModal: exceptionModalReducer,
    takeAttendance: takeAttendanceReducer,
  },
});
