import { Box } from '@mui/system'
import { TrackedLinkPreview } from '../../types/TrackedLinkPreview'
import PostPreview from '../PostPreview'
import useResizeObserver from '../../utils/useResizeObserver'

interface Props {
  onClose?: (id: string) => void
  onResize?: () => void
  trackedLinkPreviews: TrackedLinkPreview[]
}

const PostBodyPreviews = ({
  onClose,
  onResize,
  trackedLinkPreviews,
}: Props) => {
  const wrapperRef = useResizeObserver(() => onResize?.(), {
    disable: trackedLinkPreviews.length === 0,
  })

  if (!trackedLinkPreviews.length) {
    return null
  }

  return (
    <Box ref={wrapperRef}>
      {trackedLinkPreviews.map(trackedLinkPreview => (
        <PostPreview
          key={trackedLinkPreview.id}
          onClose={() => onClose?.(trackedLinkPreview.id)}
          postPreview={trackedLinkPreview.linkPreview}
        />
      ))}
    </Box>
  )
}

export default PostBodyPreviews
