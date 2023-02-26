import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import responsiveReducer from "./Slice/responsiveSlice";
import authReducer from "./Slice/authSlice";
export const store = configureStore({
  reducer: {
    responsive: responsiveReducer,
    auth: authReducer,
  },
});
