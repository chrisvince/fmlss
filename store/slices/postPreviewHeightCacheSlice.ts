import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface postPreviewHeightCacheState {
  postPreviewHeightCache: Record<string, number>
}

const initialState: postPreviewHeightCacheState = {
  postPreviewHeightCache: {},
}

export const postPreviewHeightCacheSlice = createSlice({
  name: 'postPreviewHeightCache',
  initialState,
  reducers: {
    setPostPreviewHeightCache: (
      state,
      action: PayloadAction<Record<string, number>>
    ) => {
      state.postPreviewHeightCache = {
        ...state.postPreviewHeightCache,
        ...action.payload,
      }
    },
  },
})

export const { setPostPreviewHeightCache } = postPreviewHeightCacheSlice.actions

export default postPreviewHeightCacheSlice.reducer
