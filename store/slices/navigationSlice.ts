import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface NavigationState {
  shouldCollapse: boolean
}

const initialState: NavigationState = {
  shouldCollapse: true,
}

export const navigationSlice = createSlice({
  name: 'navigation',
  initialState,
  reducers: {
    shouldCollapse: (state, action: PayloadAction<boolean>) => {
      state.shouldCollapse = action.payload
    },
  },
})

export const { shouldCollapse } = navigationSlice.actions

export default navigationSlice.reducer
