import { configureStore } from '@reduxjs/toolkit'
import responsiveReducer from './Slice/responsiveSlice'
export const store = configureStore({
  reducer: {
    responsive: responsiveReducer
  },
})