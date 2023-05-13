import { configureStore } from '@reduxjs/toolkit'

import navigationReducer from './slices/navigationSlice'
import postPreviewHeightCacheReducer from './slices/postPreviewHeightCacheSlice'

export const store = configureStore({
  reducer: {
    navigation: navigationReducer,
    postPreviewHeightCache: postPreviewHeightCacheReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
