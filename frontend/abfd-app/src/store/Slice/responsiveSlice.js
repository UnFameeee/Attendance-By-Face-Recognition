import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  homeSideBarWidth: '250px',
}

export const responsiveSlice = createSlice({
  name: 'responsive',
  initialState,
  reducers: {
    collapsedHomeSideBar:(state,action) =>{
        state.homeSideBarWidth= action.payload;
    },
  },
})

// Action creators are generated for each case reducer function
export const { collapsedHomeSideBar } = responsiveSlice.actions

export default responsiveSlice.reducer