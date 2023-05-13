import { useDispatch, useSelector } from 'react-redux'
import { setPostPreviewHeightCache } from '../../store/slices/postPreviewHeightCacheSlice'
import { PostPreview as PostPreviewType } from '../../types'
import useResizeObserver from '../../utils/useResizeObserver'
import PostPreview from '../PostPreview'
import { RootState } from '../../store'
import { Box } from '@mui/system'
import { useCallback } from 'react'

interface Props {
  measure?: () => void
  onPostPreviewLoaded?: () => void
  postId: string
  postPreviews: PostPreviewType[]
}

const PostPreviews = ({
  measure,
  onPostPreviewLoaded,
  postId,
  postPreviews,
}: Props) => {
  const dispatch = useDispatch()

  const cachedHeight = useSelector(
    (state: RootState) =>
      state.postPreviewHeightCache.postPreviewHeightCache[postId]
  )

  const handleResize = useCallback(
    (newHeight: number) => {
      measure?.()
      if (!newHeight || newHeight === cachedHeight) return
      dispatch(setPostPreviewHeightCache({ [postId]: newHeight }))
    },
    [cachedHeight, dispatch, measure, postId]
  )

  const wrapperRef = useResizeObserver(
    entries => {
      onPostPreviewLoaded?.()

      for (const entry of entries) {
        const newHeight = entry.contentRect.height
        handleResize(newHeight)
      }
    },
    { disable: postPreviews.length === 0 }
  )

  if (!postPreviews.length) {
    return null
  }

  return (
    <Box sx={{ height: cachedHeight, overflow: 'hidden' }}>
      <Box ref={wrapperRef}>
        {postPreviews.map(postPreview => (
          <PostPreview key={postPreview.href} postPreview={postPreview} />
        ))}
      </Box>
    </Box>
  )
}

export default PostPreviews
